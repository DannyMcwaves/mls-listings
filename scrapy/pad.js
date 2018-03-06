const House = require('../db/house')
const mongoose = require('mongoose')
var Nightmare = require('nightmare'),
co = require('co'),
nightmare = Nightmare({
	show: false
});

mongoose.connect('mongodb://localhost:27017/mls_listings')

const getPutAvgIncome = async () => {

	// how can i automate this script...and that script...

	const houses = await House.find({}).exec()
	
	let addressArray = []
	let unitArray = []

	houses.forEach(h => {
		if (!h.unitAndBr.err.error) {
			const addrUnit = {
				address: h.address,
				unit: h.unitAndBr
			}
			addressArray.push(h.address)
			unitArray.push(h.unitAndBr)
		}
	})

//	console.log(addressArray[0])
//console.log(unitArray[0])
	co.wrap(run)(addressArray[0], unitArray[0])
  .then(function(result) {

		// result = 
		// [ null,
		// 	null,
		// 	{ br: 1, price: 1395 },
		// 	{ br: 2, price: 1350 },
		// 	null,
		// 	{ br: 1, price: 1700 },
		// 	null,
		// 	{ br: 1, price: 1000 },
		// 	{ br: 2, price: 1750 } ]

		// now i have the prices and bedrooms i care about
		// now i must get the average of each br
		// and insert into db

		let onebr = 0;
		let onecount = 0;
		let twobr = 0;
		let twocount = 0;
		let threebr = 0;
		let threecount = 0;
		let fourbr = 0;
		let fourcount = 0;

		let income = {
			onebr: { totalUnits: 0, avgPrice: 0	},
			twobr: { totalUnits: 0, avgPrice: 0	},
			threebr: { totalUnits: 0, avgPrice: 0 },
			fourbr: { totalUnits: 0, avgPrice: 0 }
		}

		// first add them
		result.forEach(r => {
			if (r !== null) {
				if (r.br === 1) {
					onebr += r.price
					onecount++
				}
				if (r.br === 2) {
					twobr += r.price
					twocount++
				}
				if (r.br === 3) {
					threebr += r.price
					threecount++
				}
				if (r.br >= 4) {
					fourbr += r.price
					fourcount++
				}
			}
		})

		income.onebr.avgPrice = onebr / onecount || 0
		income.onebr.totalUnits = onecount || 0
		income.twobr.avgPrice = twobr / twocount || 0
		income.twobr.totalUnits = twocount || 0
		income.threebr.avgPrice = threebr / threecount || 0
		income.threebr.totalUnits = threecount || 0
		income.fourbr.avgPrice = fourbr / fourcount || 0
		income.fourbr.totalUnits = fourcount || 0

		House.findOneAndUpdate({address: addressArray[0]}, 
			{ $set: { income }}, { new: true }, (err, doc) => {
				if (err) throw err

				console.log(doc)
			})


    
  }, function(err) {
    console.log(err);
  });

}

getPutAvgIncome()

// await House.find({}, (err, docs) => {
// 	if (err) throw err

// 	docs.forEach(d => {
// 		addressArray.push(d.address)
// 	})
// })

// console.log(addressArray)
var run = function*(address, unit) {

	const longTermBtn = '#root > div > div > div > div > div.col-second > div > div > div > div.p-filter > div > div > div:nth-child(2) > div > div.col-filter-wrap > div > div > div:nth-child(1)'
	const onebr = '#root > div > div > div > div > div.col-second > div > div > div > div.p-filter > div > div > div:nth-child(3) > div > div.col-filter-wrap > div > div > div:nth-child(2)'
	const twobr = '#root > div > div > div > div > div.col-second > div > div > div > div.p-filter > div > div > div:nth-child(3) > div > div.col-filter-wrap > div > div > div:nth-child(3)'
	const threebr = '#root > div > div > div > div > div.col-second > div > div > div > div.p-filter > div > div > div:nth-child(3) > div > div.col-filter-wrap > div > div > div:nth-child(4)'
	const fourbr = '#root > div > div > div > div > div.col-second > div > div > div > div.p-filter > div > div > div:nth-child(3) > div > div.col-filter-wrap > div > div > div:nth-child(5)'
	const zoomOut = '.gmnoprint.gm-bundled-control.gm-bundled-control-on-bottom > div > div > button:nth-child(3)'

  var result = yield nightmare
    .goto('https://www.padmapper.com/')

    .type('.animate-shake', `${address}, Toronto, ON, Canada \u000d`)

    .wait(4000)
		.click(zoomOut)
		.wait(500)
		.click(zoomOut)
		.wait(500)
		.click(zoomOut)
		.wait(500)
		.click(longTermBtn)
		.wait(500)
		.click(onebr)
		.wait(500)
		.click(twobr)
		.wait(500)
		.click(threebr)
		.wait(500)
		.click(fourbr)
		.wait(500)

    .evaluate(function(unit) {
			var elements = Array.from(document.getElementsByClassName('row p-no-gutter list-item-full'));

			// do unit understanding here
			// send info as param to map function
			// which elements in array do we care about?
			// it's about br from unit
			// [1, 2]

			return elements.map(function(element) {

				const textsplit = element.innerText.split('·')
				const priceBr = textsplit[0].split('\n')
				// pricebr = [ '$2,800', '3 Bedrooms ' ]
				const price = parseInt(priceBr[0].replace(/\D+/g, ""))
				const br = parseInt(priceBr[1])



				let x = []

				for (let i = 0; i < unit.units.length; i++) {
					const u = unit.units[i] // bedroom size
					if (u < 4) {
						if (br === u) {
							return {
								br, price
							}
						}
					} else if (u >= 4) {
						if (br >= u) {
							return {
								br, price
							}
						}
					}

				}

			  return

				// x.push({
				// 	price, br
				// })
				

				// return x
			})
    }, unit);

  yield nightmare.end();

  return result;
};
