
// const Nightmare = require('nightmare');
// const nightmare = Nightmare({ show: 'true' });

let request = require('request');
let parser = require('cheerio');
let save = require('../db/server').Save

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
      'mls': $(elem).attr('id'),
      'address': $(elem).find('div.report-container > div.report-container.status-new > div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1)').text().trim(),
      'price': $(elem).find('div.report-container > div.report-container.status-new > div.formitem.form.viewform > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div > span:nth-child(1) > span').text().trim(),
      'units': eval($(elem).find('div.report-container > div.report-container.status-new > div.formitem.form.viewform > div > div:nth-child(3) > div > div:nth-child(1) > span:nth-child(1) > span').text().trim())
    });
  });

  return Promise.resolve(container);

}

const saveObjectIntoDb = objectList => {
  for(let i of objectList) {
    save(i).then(data => {
      console.log(data._id);
    }).catch(err => {
      console.log(err);
    })
  }
  return Promise.resolve('saved into db');
}

module.exports = url => {
  getWebPage(url).then(data => {
    return parseWebPage(data)
  }).then(parsedObject => {
    return saveObjectIntoDb(parsedObject)
  }).then(done => {
    console.log(done);
  }).catch(err => {
    console.log(err);
  })
}
