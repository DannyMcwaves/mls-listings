var Nightmare = require('nightmare');
const async = require('async');

const getIncomes = addr => {

  var results = [];

  var cargo = async.cargo(function(tasks, cb) {
    async.each(tasks, function(url, cb) {
      var nightmare = Nightmare();
      nightmare.goto(url.link)
        .type('.animate-shake', `${url.location} Toronto, ON, Canada \u000d`)
        .wait(3000)
        .click('div#root > div.app.ferdy:nth-child(1) > div.p-home-body-scroll:nth-child(1) > div.colmask.right-menu:nth-child(2) > div.col-left:nth-child(1) > div.col-second:nth-child(2) > div.p-rails:nth-child(1) > div.rails:nth-child(1) > div.p-list:nth-child(1) > div.p-filter:nth-child(2) > div.row.filter:nth-child(1) > div.filter-content-container:nth-child(1) > div.filter-row:nth-child(3) > div.col-right:nth-child(1) > div.col-filter-wrap:nth-child(1) > div.col-filter:nth-child(1) > div.row.row-bedrooms.p-no-gutter:nth-child(1) > div.btn.btn-toggle.toggle-sm:nth-child(2)')
        .wait(4000)
        .evaluate(() => {
          let selectors = '#root > div > div > div > div > div.col-second > div > div > div > div.row.p-no-gutter > div.row.p-no-gutter.list-scroll > div > div:nth-child(1) > div.image-container > div.price > span.text';
          return document.querySelector(selectors).textContent
        })
        .then((home) => {
          results.push({'1 bedrooms' : home});
          nightmare
            .click('div#root > div.app.ferdy:nth-child(1) > div.p-home-body-scroll:nth-child(1) > div.colmask.right-menu:nth-child(2) > div.col-left:nth-child(1) > div.col-second:nth-child(2) > div.p-rails:nth-child(1) > div.rails:nth-child(1) > div.p-list:nth-child(1) > div.p-filter:nth-child(2) > div.row.filter:nth-child(1) > div.filter-content-container:nth-child(1) > div.filter-row:nth-child(3) > div.col-right:nth-child(1) > div.col-filter-wrap:nth-child(1) > div.col-filter:nth-child(1) > div.row.row-bedrooms.p-no-gutter:nth-child(1) > div.btn.btn-toggle.toggle-sm:nth-child(2)')
            .click('div#root > div.app.ferdy:nth-child(1) > div.p-home-body-scroll:nth-child(1) > div.colmask.right-menu:nth-child(2) > div.col-left:nth-child(1) > div.col-second:nth-child(2) > div.p-rails:nth-child(1) > div.rails:nth-child(1) > div.p-list:nth-child(1) > div.p-filter:nth-child(2) > div.row.filter:nth-child(1) > div.filter-content-container:nth-child(1) > div.filter-row:nth-child(3) > div.col-right:nth-child(1) > div.col-filter-wrap:nth-child(1) > div.col-filter:nth-child(1) > div.row.row-bedrooms.p-no-gutter:nth-child(1) > div.btn.btn-toggle.toggle-sm:nth-child(3)')
            .wait(4000)
            .evaluate(() => {
              let selectors = '#root > div > div > div > div > div.col-second > div > div > div > div.row.p-no-gutter > div.row.p-no-gutter.list-scroll > div > div:nth-child(1) > div.image-container > div.price > span.text';
              return document.querySelector(selectors).textContent
            })
            .then((home) => {
              results.push({'2 bedrooms': home});
              nightmare
                .click('div#root > div.app.ferdy:nth-child(1) > div.p-home-body-scroll:nth-child(1) > div.colmask.right-menu:nth-child(2) > div.col-left:nth-child(1) > div.col-second:nth-child(2) > div.p-rails:nth-child(1) > div.rails:nth-child(1) > div.p-list:nth-child(1) > div.p-filter:nth-child(2) > div.row.filter:nth-child(1) > div.filter-content-container:nth-child(1) > div.filter-row:nth-child(3) > div.col-right:nth-child(1) > div.col-filter-wrap:nth-child(1) > div.col-filter:nth-child(1) > div.row.row-bedrooms.p-no-gutter:nth-child(1) > div.btn.btn-toggle.toggle-sm:nth-child(3)')
                .click('div#root > div.app.ferdy:nth-child(1) > div.p-home-body-scroll:nth-child(1) > div.colmask.right-menu:nth-child(2) > div.col-left:nth-child(1) > div.col-second:nth-child(2) > div.p-rails:nth-child(1) > div.rails:nth-child(1) > div.p-list:nth-child(1) > div.p-filter:nth-child(2) > div.row.filter:nth-child(1) > div.filter-content-container:nth-child(1) > div.filter-row:nth-child(3) > div.col-right:nth-child(1) > div.col-filter-wrap:nth-child(1) > div.col-filter:nth-child(1) > div.row.row-bedrooms.p-no-gutter:nth-child(1) > div.btn.btn-toggle.toggle-sm:nth-child(4)')
                .wait(4000)
                .evaluate(() => {
                  let selectors = '#root > div > div > div > div > div.col-second > div > div > div > div.row.p-no-gutter > div.row.p-no-gutter.list-scroll > div > div:nth-child(1) > div.image-container > div.price > span.text';
                  return document.querySelector(selectors).textContent
                })
                .then(home => {
                  results.push({'3 bedrooms': home});
                  nightmare
                    .click('div#root > div.app.ferdy:nth-child(1) > div.p-home-body-scroll:nth-child(1) > div.colmask.right-menu:nth-child(2) > div.col-left:nth-child(1) > div.col-second:nth-child(2) > div.p-rails:nth-child(1) > div.rails:nth-child(1) > div.p-list:nth-child(1) > div.p-filter:nth-child(2) > div.row.filter:nth-child(1) > div.filter-content-container:nth-child(1) > div.filter-row:nth-child(3) > div.col-right:nth-child(1) > div.col-filter-wrap:nth-child(1) > div.col-filter:nth-child(1) > div.row.row-bedrooms.p-no-gutter:nth-child(1) > div.btn.btn-toggle.toggle-sm:nth-child(4)')
                    .click('div#root > div.app.ferdy:nth-child(1) > div.p-home-body-scroll:nth-child(1) > div.colmask.right-menu:nth-child(2) > div.col-left:nth-child(1) > div.col-second:nth-child(2) > div.p-rails:nth-child(1) > div.rails:nth-child(1) > div.p-list:nth-child(1) > div.p-filter:nth-child(2) > div.row.filter:nth-child(1) > div.filter-content-container:nth-child(1) > div.filter-row:nth-child(3) > div.col-right:nth-child(1) > div.col-filter-wrap:nth-child(1) > div.col-filter:nth-child(1) > div.row.row-bedrooms.p-no-gutter:nth-child(1) > div.btn.btn-toggle.toggle-sm:nth-child(5)')
                    .wait(4000)
                    .evaluate(() => {
                      let selectors = '#root > div > div > div > div > div.col-second > div > div > div > div.row.p-no-gutter > div.row.p-no-gutter.list-scroll > div > div:nth-child(1) > div.image-container > div.price > span.text';
                      return document.querySelector(selectors).textContent
                    })
                    .then(home => {
                      results.push({'4 bedrooms': home});
                      return nightmare.end();
                    })
                    .then(_ => {
                      cb();
                    })
                    .catch(err => {
                      let last = results[2]['3 bedrooms']
                      results.push({'4 bedrooms': '$'+(eval(last.substr(1).replace(/[$,]/g, '')) + 2530)})
                      cb();
                      return nightmare.end();
                    })
                })
                .catch(err => {
                  let last = results[1]['2 bedrooms'].substr(1).replace(/[$,]/g, '')
                  results.push({'3 bedrooms': '$'+(eval(last) + 1160)})
                  results.push({'4 bedrooms': '$'+(eval(last) + 2530)})
                  cb();
                  return nightmare.end()
                })
            })
            .catch(err => {
              let last = results[0]['1 bedrooms']
              results.push({'2 bedrooms': '$'+(eval(last.substr(1).replace(/[$,]/g, '')) + 1160)})
              results.push({'3 bedrooms': '$'+(eval(last.substr(1).replace(/[$,]/g, '')) + 2530)})
              results.push({'4 bedrooms' : '$'+(eval(last.substr(1).replace(/[$,]/g, '')) + 3711)})
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
  }, 4);

  cargo.push({link: 'https://www.padmapper.com/', location: addr}, err => {if (err) console.log(err);})
  
  return new Promise(res => {
    cargo.drain = _ => {
      res(results);
    }
  })

}

module.exports = getIncomes;
