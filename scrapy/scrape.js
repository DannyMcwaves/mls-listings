
// const Nightmare = require('nightmare');
// const nightmare = Nightmare({ show: 'true' });

let request = require('request');
let parser = require('cheerio');
let cargo = require('../scripts/padmapper');
let save = require('../db/server').Save
let async = require('async');

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


const parseWebPage = webpage => {
  /**
   * fields to scrape include;
   * address - 'formitem.vertical', the very first one.
   * price
   * mls number
   * number of units,
   */
  let $ = parser.load(webpage);
  let container = []

  $('div.link-item').each((i, elem) => {

    let address = $(elem).find('div.report-container > div.report-container.status-new > div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1)').text().trim() || $(elem).find('div.report-container > div.report-container.status-sc > div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1)').text().trim()

    let price = $(elem).find('div.report-container > div.report-container.status-new > div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div > span:nth-child(1) > span').text().trim() || $(elem).find('div.report-container > div.report-container.status-sc > div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div > span:nth-child(1) > span').text().trim()

    let units = eval($(elem).find('div.report-container > div.report-container.status-new > div.formitem.form.viewform > div > div:nth-child(3) > div > div:nth-child(1) > span:nth-child(1) > span').text().trim()) || eval($(elem).find('div.report-container > div.report-container.status-sc > div.formitem.form.viewform > div > div:nth-child(3) > div > div:nth-child(1) > span:nth-child(1) > span').text().trim())

    let squarefoot = $(elem).find('div.report-container > div.report-container.status-new > div.formitem.form.viewform > div > div:nth-child(3) > div > div:nth-child(1) > span:nth-child(9) > span').text().trim() || $(elem).find('div.report-container > div.report-container.status-sc > div.formitem.form.viewform > div > div:nth-child(3) > div > div:nth-child(1) > span:nth-child(9) > span').text().trim()
    
    let heat = $(elem).find('div.report-container > div.report-container.status-new > div.formitem.form.viewform > div > div:nth-child(3) > div > div:nth-child(1) > div:nth-child(5) > span > span').text() || $(elem).find('div.report-container > div.report-container.status-sc > div.formitem.form.viewform > div > div:nth-child(3) > div > div:nth-child(1) > div:nth-child(5) > span > span').text().trim()

    let gas = $(elem).find('div.report-container > div.report-container.status-new > div.formitem.form.viewform > div > div:nth-child(3) > div > div:nth-child(3) > span:nth-child(4) > span').text() || $(elem).find('div.report-container > div.report-container.status-sc > div.formitem.form.viewform > div > div:nth-child(3) > div > div:nth-child(3) > span:nth-child(4) > span').text()

    let hydro = $(elem).find('div.report-container > div.report-container.status-new > div.formitem.form.viewform > div > div:nth-child(3) > div > div:nth-child(3) > span:nth-child(3) > span').text() || $(elem).find('div.report-container > div.report-container.status-sc > div.formitem.form.viewform > div > div:nth-child(3) > div > div:nth-child(3) > span:nth-child(3) > span').text()

    let item = {
      mls: $(elem).attr('id'),
      address,
      squarefoot,
      price,
      heat,
      units,
      hydro,
      gas,
      annualMortgageExpense: 'https://www.ratehub.ca/best-mortgage-rates',
      noi: '$34,691.91',
      expenses: {
        taxes: $(elem).find('div.report-container > div.report-container.status-new > div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > span:nth-child(1) > span').text() || $(elem).find('div.report-container > div.report-container.status-sc > div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > span:nth-child(1) > span').text(),
        gas: '$100.00',
        hydro: '$115.00',
        heat: '$18.88'
      },
    };
    item.totalExpenses = '$' + (eval(item.expenses.taxes.substr(1).replace(/,/g, '') || '0') + eval(item.expenses.gas.substr(1).replace(/,/g, '')) + eval(item.expenses.hydro.substr(1).replace(/,/g, ''))),
    item.operatingCashFlow = item.noi,
    item.pricePerUnit = '$' + (eval(item.price.substr(1).replace(/,/g, '')) / item.units)
    
    container.push(item);
  });

  return Promise.resolve(container);

}

const getIncomes = (items, cb) => {
  // [first, ...rest] = items.address.split(' ');
  cargo(items.address).then(data => {
    let temp = {}, total = 0, cont = ['one_br', 'two_br', 'three_br', 'four_br'], c = 0;
    for(let i of data) {
      temp = {...temp, ...i}
      total += eval(i[cont[c]].averagePrice)
      c++
    }
    temp['parking spot'] = '$150'
    items.income = temp
    items.totalIncome = '$' + (total + 150)
    return items;
  }).then(data => {
    save(data).then(data => {
      console.log(data);
    }).catch(err => {
      console.log(err);
    })
  }).catch(err => {
    console.log(err);
  })
}

const saveObjectIntoDb = objectList => {
  async.each(objectList, getIncomes);
}

module.exports = url => {
  getWebPage(url).then(data => {
    return parseWebPage(data)
  }).then(parsedObject => {
    saveObjectIntoDb(parsedObject)
  }).catch(err => {
    console.log(err);
  })
}
