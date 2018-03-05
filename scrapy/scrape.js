
// const Nightmare = require('nightmare');
// const nightmare = Nightmare({ show: 'true' });

let request = require('request');
let parser = require('cheerio');
let cargo = require('../scripts/padmapper');
let save = require('../db/server').Save;
let async = require('async');
let Pool = require('threads').Pool;
let page = require('./page');
let pool = new Pool(5);

const getWebPage = url => {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if(res.statusCode == 200 && body) {
        resolve(body)
      } else {
        reject(err);
      }
    })
  })
}

function* parse($, elem) {
  /**
   * fields to scrape include;
   * address - 'formitem.vertical', the very first one.
   * price
   * mls number
   * number of units,
   */

  let address = $(elem).find('div.report-container > div.report-container > div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1)').text().trim()

  let price = $(elem).find('div.report-container > div.report-container > div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div > span:nth-child(1) > span').text().trim()

  let units = eval($(elem).find('div.report-container > div.report-container > div.formitem.form.viewform > div > div:nth-child(3) > div > div:nth-child(1) > span:nth-child(1) > span').text().trim())

  let squarefoot = $(elem).find('div.report-container > div.report-container > div.formitem.form.viewform > div > div:nth-child(3) > div > div:nth-child(1) > span:nth-child(9) > span').text().trim()

  let heat = $(elem).find('div.report-container > div.report-container > div.formitem.form.viewform > div > div:nth-child(3) > div > div:nth-child(1) > div:nth-child(5) > span > span').text()

  let bedroom = $(elem).find('div.report-container > div.report-container > div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(5) > div.formitem.formgroup.vertical > span:nth-child(2) > span').text().split('+')

  let gas = $(elem).find('div.report-container > div.report-container > div.formitem.form.viewform > div > div:nth-child(3) > div > div:nth-child(3) > span:nth-child(4) > span').text()

  let hydro = $(elem).find('div.report-container > div.report-container > div.formitem.form.viewform > div > div:nth-child(3) > div > div:nth-child(3) > span:nth-child(3) > span').text()

  let taxes = $(elem).find('div.report-container > div.report-container > div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > span:nth-child(1) > span.value').text()
  let house = {
    units:{
      number: units,
      unit_1: parseInt(bedroom[0]) || null,
      unit_2: parseInt(bedroom[1]) || null,
      unit_3: parseInt(bedroom[2]) || null,
      unit_4: parseInt(bedroom[3]) || null
    }
  }

  let item = {
    mls: $(elem).attr('id'),
    address,
    squarefoot,
    price: eval(price.replace(/[$,]/g, '')),
    heat,
    house,
    hydro,
    gas,
    bedroom,
    annualMortgageExpense: 'https://www.ratehub.ca/best-mortgage-rates',
    noi: 34691.90,
    expenses: {
      taxes: eval(taxes.replace(/[$,]/g, '')) || 0,
      gas: 100.00,
      hydro: 115.00,
      heat: 18.88
    },
  };

  item.totalExpenses = (item.expenses.taxes || 0) + item.expenses.gas + item.expenses.hydro + item.expenses.heat,

  item.operatingCashFlow = item.noi,

  item.pricePerUnit = item.price / units

  yield item

}

function* parseWebPage(webpage) {

  let $ = parser.load(webpage);

  links = $('div.link-item').toArray();

  for(let i of links) {
    yield* parse($, $(i));
  }

}

const getIncomes = (items) => {
  cargo(items).then(data => {
    console.log(data);
  }).catch(err => {
    console.log(err);
  })
}

pool
  .on('done', function(job, message) {
    saveObjectIntoDb(message);
  })
  .on('error', function(job, error) {
    console.error('Job errored:', error);
  })
  .on('finished', function() {
    console.log('Everything done, shutting down the thread pool.');
    pool.killAll();
  });

const saveObjectIntoDb = objectList => {
  save(objectList).then(data => {console.log(data)}).catch(err => {console.log(err)});
}

module.exports = url => {

  getWebPage(url).then(data => {
    for (let i of parseWebPage(data)) {
      pool
      .run(__dirname + '/../scripts/pad3.js')
      .send(i)
    }
  });
}
