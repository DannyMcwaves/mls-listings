let request = require('request');
let parser = require('cheerio');

const parseWebPage = async webpage => {
  /**
   * fields to scrape include;
   * address - 'formitem.vertical', the very first one.
   * price
   * mls number
   * number of units,
   */
  let $ = await parser.load(webpage);
  let container = []

  $('div.link-item').each((i, elem) => {
    let item = {
      mls: $(elem).attr('id'),
      address: $(elem).find('div.report-container > div.report-container.status-new > div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1)').text().trim(),
      price: $(elem).find('div.report-container > div.report-container.status-new > div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div > span:nth-child(1) > span').text().trim(),
      apartmentValue: $(elem).find('div.report-container > div.report-container.status-new > div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div > span:nth-child(1) > span').text().trim(),
      units: eval($(elem).find('div.report-container > div.report-container.status-new > div.formitem.form.viewform > div > div:nth-child(3) > div > div:nth-child(1) > span:nth-child(1) > span').text().trim()) || 0,
      annualMortgageExpense: 'https://www.ratehub.ca/best-mortgage-rates',
      noi: '$34,691.91',
      expenses: {
        taxes: $(elem).find('div.report-container > div.report-container.status-new > div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > span:nth-child(1) > span').text() || '$0',
        gas: '$100.00',
        hydro: '$115.00',
        heat: '$18.88'
      },
      webpage,
    };
    item.totalExpenses = '$' + (eval(item.expenses.taxes.substr(1).replace(/,/g, '')) + eval(item.expenses.gas.substr(1).replace(/,/g, '')) + eval(item.expenses.hydro.substr(1).replace(/,/g, ''))),
    item.operatingCashFlow = item.noi,
    item.pricePerUnit = '$' + (eval(item.price.substr(1).replace(/,/g, '')) / item.units)
    container.push(item);
    console.log(item);
    console.log(container);
    console.log('hey')
  });
  console.log('hi')
}

parseWebPage('http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=ded66b6ce5fb4ed3af5881fc990c151e&App=TREB');
