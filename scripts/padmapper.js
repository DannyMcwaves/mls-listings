var Nightmare = require('nightmare');
const async = require('async');

const getIncomes = item => {

  var results = [];

  var cargo = async.cargo(function(tasks, cb) {
    async.each(tasks, function(url, cb) {
      var nightmare = new Nightmare({show:true});
      nightmare.goto(url.link)
        .type('.animate-shake', `${url.location}, Toronto, ON, Canada \u000d`)
        .wait(5000)
        .click('.gmnoprint.gm-bundled-control.gm-bundled-control-on-bottom > div > div > button:nth-child(3)')
        .wait(1000)
        .click('.gmnoprint.gm-bundled-control.gm-bundled-control-on-bottom > div > div > button:nth-child(3)')
        .wait(1000)
        .click('.gmnoprint.gm-bundled-control.gm-bundled-control-on-bottom > div > div > button:nth-child(3)')
        .wait(1000)
        .click('div#root > div.app.ferdy:nth-child(1) > div.p-home-body-scroll:nth-child(1) > div.colmask.right-menu:nth-child(2) > div.col-left:nth-child(1) > div.col-second:nth-child(2) > div.p-rails:nth-child(1) > div.rails:nth-child(1) > div.p-list:nth-child(1) > div.p-filter:nth-child(2) > div.row.filter:nth-child(1) > div.filter-content-container:nth-child(1) > div.filter-row:nth-child(3) > div.col-right:nth-child(1) > div.col-filter-wrap:nth-child(1) > div.col-filter:nth-child(1) > div.row.row-bedrooms.p-no-gutter:nth-child(1) > div.btn.btn-toggle.toggle-sm:nth-child(2)')
        .wait(2000)
        .evaluate(() => {
          let nodelist = document.querySelectorAll('.list-item-container > div'), total = 0, l = nodelist.length;
          for(let node of nodelist){
            text = node.innerText
            cur = text ? text.match(/\$\d+,\d+/)[0].replace(/[$,]/g, '') : '0'
            total += eval(cur)
          }
          return {averagePrice: total/(l||1), numberOfUnits: l}
        })
        .then((home) => {
          results.push({'one_br' : home});
          nightmare
            .click('div#root > div.app.ferdy:nth-child(1) > div.p-home-body-scroll:nth-child(1) > div.colmask.right-menu:nth-child(2) > div.col-left:nth-child(1) > div.col-second:nth-child(2) > div.p-rails:nth-child(1) > div.rails:nth-child(1) > div.p-list:nth-child(1) > div.p-filter:nth-child(2) > div.row.filter:nth-child(1) > div.filter-content-container:nth-child(1) > div.filter-row:nth-child(3) > div.col-right:nth-child(1) > div.col-filter-wrap:nth-child(1) > div.col-filter:nth-child(1) > div.row.row-bedrooms.p-no-gutter:nth-child(1) > div.btn.btn-toggle.toggle-sm:nth-child(2)')
            .click('div#root > div.app.ferdy:nth-child(1) > div.p-home-body-scroll:nth-child(1) > div.colmask.right-menu:nth-child(2) > div.col-left:nth-child(1) > div.col-second:nth-child(2) > div.p-rails:nth-child(1) > div.rails:nth-child(1) > div.p-list:nth-child(1) > div.p-filter:nth-child(2) > div.row.filter:nth-child(1) > div.filter-content-container:nth-child(1) > div.filter-row:nth-child(3) > div.col-right:nth-child(1) > div.col-filter-wrap:nth-child(1) > div.col-filter:nth-child(1) > div.row.row-bedrooms.p-no-gutter:nth-child(1) > div.btn.btn-toggle.toggle-sm:nth-child(3)')
            .wait(2000)
            .evaluate((home) => {
              let nodelist = document.querySelectorAll('.list-item-container > div'), total = 0, l = nodelist.length;
              for(let node of nodelist){
                text = node.innerText
                cur = text ? text.match(/\$\d+,\d+/)[0].replace(/[$,]/g, '') : '0'
                total += eval(cur)
              }
              return {averagePrice: total/(l||1), numberOfUnits: l}
            }, home.averagePrice)
            .then((home) => {
              results.push({'two_br': home});
              nightmare
                .click('div#root > div.app.ferdy:nth-child(1) > div.p-home-body-scroll:nth-child(1) > div.colmask.right-menu:nth-child(2) > div.col-left:nth-child(1) > div.col-second:nth-child(2) > div.p-rails:nth-child(1) > div.rails:nth-child(1) > div.p-list:nth-child(1) > div.p-filter:nth-child(2) > div.row.filter:nth-child(1) > div.filter-content-container:nth-child(1) > div.filter-row:nth-child(3) > div.col-right:nth-child(1) > div.col-filter-wrap:nth-child(1) > div.col-filter:nth-child(1) > div.row.row-bedrooms.p-no-gutter:nth-child(1) > div.btn.btn-toggle.toggle-sm:nth-child(3)')
                .click('div#root > div.app.ferdy:nth-child(1) > div.p-home-body-scroll:nth-child(1) > div.colmask.right-menu:nth-child(2) > div.col-left:nth-child(1) > div.col-second:nth-child(2) > div.p-rails:nth-child(1) > div.rails:nth-child(1) > div.p-list:nth-child(1) > div.p-filter:nth-child(2) > div.row.filter:nth-child(1) > div.filter-content-container:nth-child(1) > div.filter-row:nth-child(3) > div.col-right:nth-child(1) > div.col-filter-wrap:nth-child(1) > div.col-filter:nth-child(1) > div.row.row-bedrooms.p-no-gutter:nth-child(1) > div.btn.btn-toggle.toggle-sm:nth-child(4)')
                .wait(2000)
                .evaluate((home) => {
                  let nodelist = document.querySelectorAll('.list-item-container > div'), total = 0, l = nodelist.length;
                  for(let node of nodelist){
                    text = node.innerText
                    cur = text ? text.match(/\$\d+,\d+/)[0].replace(/[$,]/g, '') : '0'
                    total += eval(cur)
                  }
                  return {averagePrice: total/(l||1), numberOfUnits: l}
                }, home.averagePrice)
                .then(home => {
                  results.push({'three_br': home});
                  nightmare
                    .click('div#root > div.app.ferdy:nth-child(1) > div.p-home-body-scroll:nth-child(1) > div.colmask.right-menu:nth-child(2) > div.col-left:nth-child(1) > div.col-second:nth-child(2) > div.p-rails:nth-child(1) > div.rails:nth-child(1) > div.p-list:nth-child(1) > div.p-filter:nth-child(2) > div.row.filter:nth-child(1) > div.filter-content-container:nth-child(1) > div.filter-row:nth-child(3) > div.col-right:nth-child(1) > div.col-filter-wrap:nth-child(1) > div.col-filter:nth-child(1) > div.row.row-bedrooms.p-no-gutter:nth-child(1) > div.btn.btn-toggle.toggle-sm:nth-child(4)')
                    .click('div#root > div.app.ferdy:nth-child(1) > div.p-home-body-scroll:nth-child(1) > div.colmask.right-menu:nth-child(2) > div.col-left:nth-child(1) > div.col-second:nth-child(2) > div.p-rails:nth-child(1) > div.rails:nth-child(1) > div.p-list:nth-child(1) > div.p-filter:nth-child(2) > div.row.filter:nth-child(1) > div.filter-content-container:nth-child(1) > div.filter-row:nth-child(3) > div.col-right:nth-child(1) > div.col-filter-wrap:nth-child(1) > div.col-filter:nth-child(1) > div.row.row-bedrooms.p-no-gutter:nth-child(1) > div.btn.btn-toggle.toggle-sm:nth-child(5)')
                    .wait(2000)
                    .evaluate((home) => {
                      let nodelist = document.querySelectorAll('.list-item-container > div'), total = 0, l = nodelist.length;
                      for(let node of nodelist){
                        text = node.innerText
                        cur = text ? text.match(/\$\d+,\d+/)[0].replace(/[$,]/g, '') : '0'
                        total += eval(cur)
                      }
                      return {averagePrice: total/(l||1), numberOfUnits: l}
                    }, home.averagePrice)
                    .then(home => {
                      results.push({'four_br': home});
                      return nightmare.end();
                    })
                    .then(_ => {
                      cb();
                    })
                    .catch(err => {
                      cb();
                      return nightmare.end();
                    })
                })
                .catch(err => {
                  cb();
                  return nightmare.end()
                })
            })
            .catch(err => {
              cb();
              return nightmare.end();
            })
        })
        .catch(err => {
          console.log(err);
          return nightmare.end();
        })
    }, function(err) {
      cb(err);
    })
  }, 10);

  cargo.push({link: 'https://www.padmapper.com/', location: item.address}, err => {if (err) console.log(err);})

  return new Promise(res => {
    cargo.drain = _ => {
      let temp = {}, total = 0, cont = ['one_br', 'two_br', 'three_br', 'four_br'], c = 0;
      for(let i of results) {
        temp = {...temp, ...i}
        total += item.bedroom.map(x => parseInt(x)).indexOf(c+1) > -1 ? eval(i[cont[c]].averagePrice) : 0
        c++
      }
      temp['parking spot'] = 150
      item.income = temp
      item.totalIncome = (total + 150)
      res(item);
    }
  })

}

module.exports = getIncomes;
