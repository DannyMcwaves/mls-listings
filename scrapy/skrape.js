const House = require('../db/house')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/mls_listings')

const Nightmare = require('nightmare')
const co = require('co')
let nightmare = Nightmare({
  show: false
});

const { padScrape } = require('./pad')


var run = function*(url) {
  var result = yield nightmare
    .goto(url)
    .evaluate(function() {

      /* 
        getDataFromHtml = {
          TURNING THE SCRAPED HTML INNERTEXT INTO AN OBJECT
        }
      */
      function getDataFromHtml(child) {
        let data = {}

        let wrLocation

        /*
        * Top section
        * Getting "Address" "Listing price" "Taxes" "Bedrooms" "Washrooms"
        */
        const topz = child[0].children[0].children[1].innerText

        const topText = topz.split('\n')

        data.address = topText[0]
        
        for (var i = 0; i < topText.length; i++) {
          const str = topText[i]

          if (str.includes('List')) {
            data.price = parseInt(str.match(/\d/g).join(""))
          }
          if (str.includes('Taxes')) {
            data.taxes = parseFloat(str.match(/\d+,\d+\.\d+/)[0].replace(',',''))
          }
          if (str.includes('Bedrooms')) {
            let br = 0
            let brString = str.substring(str.indexOf(':') + 1, str.length)
            if (brString.includes('+')) {
              let brs = brString.split('+')
              brs.forEach(b => {
                let brNumParse = parseInt(b)
                br += brNumParse
              })
              data.bedrooms = br
            } else {
              data.bedrooms = parseInt(brString)
            }

            //data.bedrooms = str.substring(str.indexOf(':') + 1, str.length)
          }
          if (str.includes('Washrooms')) {
            data.washrooms = parseInt(str.substring(str.indexOf(':') + 1, str.length))
            data.wrLocation = topText[i + 1].split(',')
          }
        }

        /*
        * MLS is below photo. Getting MLS string
        */
        const mls = child[1].children[0].children[0].innerText
        data.mls = mls.substring(mls.indexOf(':') + 1, mls.length);

        /*
        * middle is the 1st column in the middle section
        * Getting "Kitchens" "Heat" "Square footage" from this section
        */
        const middle = child[2].children[0].children[0].innerText.split('\n')

        for (var i = 0; i < middle.length; i++) {
          const str = middle[i]

          if (str.includes('Kitchens')) {
            let kitchens = 0
            let kitchensString = str.substring(str.indexOf(':') + 1, str.length)
            if (kitchensString.includes('+')) {
              let kits = kitchensString.split('+')
              kits.forEach(k => {
                let kitchenNumParse = parseInt(k)
                kitchens += kitchenNumParse
              })
              data.kitchens = kitchens
            } else {
              data.kitchens = parseInt(kitchensString)
            }
          }

          if (str.includes('Heat')) {
            if (str.indexOf(':') + 1 === str.length) {
              data.heat = null
            } else {
              data.heat = str.substring(str.indexOf(':') + 1, str.length)
            }
          }
          if (str.includes('Apx Sqft')) {
            if (str.indexOf(':') + 1 === str.length) {
              data.sqft = null
            } else {
              data.sqft = str.substring(str.indexOf(':') + 1, str.length)
            }
          }
        }
    
        // this isn't being used but it's the 2nd column in the middle section
        const middle2 = child[2].children[0].children[1].innerText.split('\n')

        /*
        * Middle3 is the 3rd column in the middle section
        * Getting "Hydro" and "Gas" values
        */
        const middle3 = child[2].children[0].children[2].innerText.split('\n')

        for (var i = 0; i < middle3.length; i++) {
          const str = middle3[i]
          if (str.includes('Hydro')) {
            // check if empty
            if (str.indexOf(':') + 1 === str.length) {
              data.hydro = null
            } else {
              data.hydro = str.substring(str.indexOf(':') + 1, str.length)
            }
          }
          if (str.includes('Gas')) {
            // check if empty
            if (str.indexOf(':') + 1 === str.length) {
              data.gas = null
            } else {
              data.gas = str.substring(str.indexOf(':') + 1, str.length)
            }
          }
        }

        /**
        * Client Remarks is just some text at the bottom of the house listing
        */
        const clientRmrks = child[7].innerText

        data.clientRemarks = clientRmrks.substring(clientRmrks.indexOf(':') + 1, clientRmrks.length)
        
        return data
      }




      var elements = Array.from(document.getElementsByClassName('formitem legacyBorder formgroup vertical'));
      return elements.map(function(element) {
        const child = element.children

        // v - the object to create and return
        //let data = {}
        let data = getDataFromHtml(child)

        /**
        * roomsArray is the section above "client remarks" and below the 3 column info
        * Turning "Rooms" and "Level" into array of objects for "parsedRooms". Level is key Room is value
          Check parsedRooms object below for schema
        */
        const roomsArray = child[5].children
        let rooms = []
        for (var i = 0; i < roomsArray.length; i++ ) {
          rooms.push(roomsArray.item(i).innerText)
        }

        let parsedRooms = { 
          bsmt: { rooms: [], washrooms: 0, },
          main: { rooms: [], washrooms: 0, },
          second: { rooms: [], washrooms: 0, },
          third: { rooms: [], washrooms: 0, },
          errs: { error: false, messages: [] }
        }

        if (rooms.length === 0) {
          parsedRooms.errs.error = true
          parsedRooms.errs.messages.push('Missing room information.')
        } else {
          // Adding room string to array of rooms in levels field for parsedRooms object
          rooms.forEach(r => {
            if (r !== '') {
              const str = r.split('\n')

              const level = str[2]
              const room = str[1]

              if (level.includes('Bsmt') || level.includes('Lower')) {
                parsedRooms.bsmt.rooms.push(room)
              }
              if (level.includes('Main') || level.includes('Ground')) {
                parsedRooms.main.rooms.push(room)
              }
              if (level.includes('2nd')) {
                parsedRooms.second.rooms.push(room)
              }
              if (level.includes('3rd')) {
                parsedRooms.third.rooms.push(room)
              }
            }
          })
        }

        /**
        * GETTING THE UNITS AND BEDROOMS
        * LOGIC
        */

        // Need the Washroom LOCATIONS = wrLocations
        // Need the ROOMS + LEVELs object = parsedRooms
        // Need the # Kitchens!

        // lets first organize washroom + room location by object

        // add washrooms to parsedRooms object where applicable
        if (!parsedRooms.errs.error) {
          let missingWr = false
          data.wrLocation.forEach(w => {
            const str = w.split('x')
            if (str.length === 3) {
              if (w.includes('Bsmt') || w.includes('Lower')) {
                const num = parseInt(str[0])
                parsedRooms.bsmt.washrooms += num
              }
              if (w.includes('Main') || w.includes('Ground')) {
                const num = parseInt(str[0])
                parsedRooms.main.washrooms += num
              }
              if (w.includes('2nd')) {
                const num = parseInt(str[0])
                parsedRooms.second.washrooms += num
              }
              if (w.includes('3rd')) {
                const num = parseInt(str[0])
                parsedRooms.third.washrooms += num
              }
            } else {
              missingWr = true
            }
          })
          if (missingWr) {
            parsedRooms.errs.error = true
            parsedRooms.errs.messages.push('Missing washroom information')
          }
        } 

        // create a units array
        // units.length = # of units. each element contains a br #
        let units
        let unitAndBr = {
          err: {
            error: false,
            message: []
          },
          units: []
        }


        // NOW PARSEDROOMS IS PARSED.
        // EACH LEVEL HAS EVERY ROOM AND WASHROOM IN IT
        // NOW YOU MUST FIGURE OUT UNITS + BEDROOMS OF THE CURRENT ADDRESS!
        // USING THE PARSEDROOMS OBJECT...

        if (!parsedRooms.errs.error) {
          const { bsmt, main, second, third } = parsedRooms
          units = [] // make as array
          // 1 kitchen = 1 unit...get all rooms into this bitch
          if (data.kitchens === 1) {
            let num = 0
            if (bsmt.rooms.length > 0) {
              bsmt.rooms.forEach(b => {
                if (b === "Master") num++
                if (b === "2nd Br") num++
                if (b === "3rd Br") num++
                if (b === "4th Br") num++
                if (b === "5th Br") num++
                if (b === "Br") num++
                if (b === "Rec") num++
              })
            }
            if (main.rooms.length > 0) {
              main.rooms.forEach(m => {
                if (m === "Master") num++
                if (m === "2nd Br") num++
                if (m === "3rd Br") num++
                if (m === "4th Br") num++
                if (m === "5th Br") num++
                if (m === "Br") num++
              })
            }
            if (second.rooms.length > 0) {
              second.rooms.forEach(s => {
                if (s === "Master") num++
                if (s === "2nd Br") num++
                if (s === "3rd Br") num++
                if (s === "4th Br") num++
                if (s === "5th Br") num++
                if (s === "Br") num++
                if (s === "Rec") num++
              })
            }
            if (third.rooms.length > 0) {
              third.rooms.forEach(t => {
                if (t === "Master") num++
                if (t === "2nd Br") num++
                if (t === "3rd Br") num++
                if (t === "4th Br") num++
                if (t === "5th Br") num++
                if (t === "Br") num++
                if (t === "Rec") num++
              })
            }
            unitAndBr.units.push(num)
          } else if (data.kitchens >= 2) {
            // check if level has washroom & kitchen
            let bsmtKitchen = false
            let bsmtWashroom = false
            let mainKitchen = false
            let mainWashroom = false
            let secondKitchen = false
            let secondWashroom = false
            let thirdKitchen = false
            let thirdWashroom = false

            bsmt.rooms.forEach(b => {
              if (b === 'Kitchen') {
                bsmtKitchen = true
              }
            })
            if (bsmt.washrooms > 0) {
              bsmtWashroom = true
            }
            main.rooms.forEach(m => {
              if (m === 'Kitchen') {
                mainKitchen = true
              }
            })
            if (main.washrooms > 0) {
              mainWashroom = true
            }
            second.rooms.forEach(s => {
              if (s === 'Kitchen') {
                secondKitchen = true
              }
            })
            if (second.washrooms > 0) {
              secondWashroom = true
            }
            third.rooms.forEach(t => {
              if (t === 'Kitchen') {
                thirdKitchen = true
              }
            })
            if (third.washrooms > 0) {
              thirdWashroom = true
            }

            //
            // THE GOD DAMN MAGIC SHOW!!!!!!
            //
            if (bsmtKitchen) {
              if (bsmtWashroom) {
                if (mainKitchen) {
                  units.push(['bsmt'])
                  if (mainWashroom) {
                    // these need fix
                    if (secondKitchen || second.rooms.length === 0) {
                      units.push(['main'])
                    }
                    if (second.rooms.length > 0 && third.rooms.length === 0) {
                      units.push(['main', 'second'])
                    }
                  } else if (!mainWashroom) {
                    if (secondWashroom) {
                      units.push(['main', 'second']);
                    }
                  }
                }
              } else if (!bsmtWashroom) {
                if (mainWashroom) {
                  units.push(['bsmt', 'main'])
                }
              }
            } else if (!bsmtKitchen) {
              if (mainKitchen) {
                if (second.rooms.length === 0) {
                  units.push(['bsmt', 'main'])
                } else if (second.rooms.length > 0) {
                  if (secondKitchen && secondWashroom) {
                    units.push(['bsmt', 'main'])
                  } else if (third.rooms.length === 0) {
                    units.push(['bsmt', 'main', 'second'])
                  }
                }
              } else if (!mainKitchen) {
                if (secondKitchen) {
                  units.push(['bsmt', 'main', 'second'])
                }
              }
            }
            if (third.rooms.length === 0) {
              if (secondKitchen) {
                if (secondWashroom) {
                  if (mainKitchen) {
                    units.push(['second'])
                  }
                } else if (!secondWashroom) {
                  if (mainWashroom) {
                    units.push(['main', 'second'])
                  }
                }
              }
            } else if (third.rooms.length > 0) {
              if (second.rooms.length > 0) {
                if (mainKitchen) {
                  if (!secondKitchen) {
                    if (!thirdKitchen) {
                      units.push(['main', 'second', 'third'])
                    } else {
                      units.push(['main', 'second'])
                    }
                  }
                } else if (!mainKitchen) {
                  if (secondKitchen) {
                    units.push(['main', 'second'])
                  }
                }
              }
            } else if (thirdKitchen) {
                if (thirdWashroom) {
                  if (secondKitchen) {
                    units.push(['third'])
                  }
                }
            } else if (!thirdKitchen) {
                if (secondKitchen) {
                  units.push(['second', 'third'])
                }
            }

          }
        } else {
           // if here then there are errors
          unitAndBr.err.error = true
          parsedRooms.errs.messages.forEach(m => {
            unitAndBr.err.message.push(m)
          })
        }

        // ASSUME THAT THE UNITS ARE DONE PROPERLY
        // NOW COUNT THE BEDROOMS FOR EACH UNIT
        // AND YOU HAVE THE HOUSE OBJECT

        if (!parsedRooms.errs.error) {

          units.forEach(u => {
            let num = 0
            u.forEach(r => {
              parsedRooms[r].rooms.forEach(pr => {
                if (pr === "Master") num++
                if (pr === "2nd Br") num++
                if (pr === "3rd Br") num++
                if (pr === "4th Br") num++
                if (pr === "5th Br") num++
                if (pr === "Br") num++
                if (r === "bsmt") {
                  if (pr === "Rec") num++
                }
              })
            })
            unitAndBr.units.push(num)
          })
        }
        data.unitAndBr = unitAndBr
        

        return {
          data
        }
      })
    }, url);

  yield nightmare.end();

  return result;
}

const getLinkAndScrape = (link) => {
  co.wrap(run)(link)
  .then(function(result) {
    result.forEach(r => {
      const { data } = r

      let house = new House()
      house.address = data.address || null
      house.mls = data.mls || null
      house.price = data.price || null
      house.sqft = data.sqft || null
      house.clientRemarks = data.clientRemarks || null
      house.gas = data.gas || null
      house.heat = data.heat || null
      house.hydro = data.hydro || null
      house.taxes = data.taxes || null
      house.unitAndBr = data.unitAndBr || null

      house.save(err => {
        if (err) {
          console.error(err)
        } else {
          // house saved successfully
          // now called padmapper scraper
          if (house.unitAndBr) {
            console.log(`${house.address} saved. Now scraping padmapper`)
            padScrape(house.address, house.unitAndBr)
          } else {
            console.log(`${house.address} saved, no units and br to scrape`)
          }
        }
      })
    })

  }, function(err) {
    console.log(err);
  });
}

module.exports = getLinkAndScrape