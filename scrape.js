
// const Nightmare = require('nightmare');
// const nightmare = Nightmare({ show: 'true' });

let request = require('request');
let parser = require('cheerio');
let url = 'http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=ded66b6ce5fb4ed3af5881fc990c151e&App=TREB';
let url2 = 'http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=dac85d3bfcea45608d96be99c34e95e4&App=TREB';

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
    container.push({
      'MSL': $(elem).attr('id'),
      'ADDRESS': $(elem).find('div.report-container > div.report-container.status-new > div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1)').text().trim(),
      'PRICE': $(elem).find('div.report-container > div.report-container.status-new > div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div > span:nth-child(1) > span').text().trim(),
      'UNITS': eval($(elem).find('div.report-container > div.report-container.status-new > div.formitem.form.viewform > div > div:nth-child(3) > div > div:nth-child(1) > span:nth-child(1) > span').text().trim())
    });
  });

  return Promise.resolve(container);

}

getWebPage(url2).then(data => {
  return parseWebPage(data);
}).then(parsed => {
  console.log(parsed);
}).catch(err => {
  console.log(err);
})
