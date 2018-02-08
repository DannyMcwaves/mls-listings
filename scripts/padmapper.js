var Nightmare = require('nightmare');
const async = require('async');
const parser = require('cheerio');

let getUrl = (url, beds) => {
  temp = url.split('=')
  let first = temp[0], second = '=-79.47377073922002,43.668797179752616,-79.44278586067998,43.6925710446461';
  let uri = first.split('?').join(`/${beds}-beds?`) + second
  console.log(uri);
  return uri;
  
}

const getBedRooms = location => {
  let nightmare = new Nightmare();
  nightmare
    .goto('https://www.padmapper.com/')
    .type('.animate-shake', `${location} toronto \u000d`)
    .wait(3000)
    .evaluate(() => {
      let url = document.location.href;
      return url
    })
    .end()
    .then(url => {
      push(getUrl(url, 1), 1);
      push(getUrl(url, 2), 2);
      push(getUrl(url, 3), 3);
      push(getUrl(url, 4), 4);
    })  
    .catch(err => {
      console.log(err);
    })

  return new Promise((res, rej) => {
    cargo.drain = _ => {
      res(results);
    }
  }) 

}

var results = [];
let selectors = '#root > div > div > div > div > div.col-second > div > div > div > div.row.p-no-gutter > div.row.p-no-gutter.list-scroll > div > div:nth-child(1) > div.image-container > div.price > span.text';
var cargo = async.cargo(function(tasks, cb) {
  async.each(tasks, function(url, cb) {
    var nightmare = Nightmare(), result;
    nightmare.goto(url.link)
      .wait(4000)
      .evaluate(sel => {
        return document.querySelector(sel).textContent
        // return 'dunno'
      }, selectors)
      .then(function(title) {
        results.push({[url.id + ' bedrooms'] : title});
        return nightmare.end();
      })
      .then(function() {
        cb();
      })
      .catch(err => {
        console.log(err);
      })
  }, function(err) {
    cb(err);
  })
}, 3);

/*
cargo.drain = function () {
  console.dir(results);
};
*/

let push = (url, id) => {
  cargo.push({
    link: url, id},
    err => {if (err) console.log(err);} 
  )
}


module.exports = getBedRooms