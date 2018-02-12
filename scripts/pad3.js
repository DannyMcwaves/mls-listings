var Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });

nightmare
  .goto('https://www.padmapper.com/')
  .type('.animate-shake', '63 Innes Ave toronto \u000d')
  .wait(3000)
  .click('.gm-style-pbc')
  .click('.gmnoprint > div > div > button:nth-child(3)')
  .wait(1000)
  .click('.gmnoprint > div > div > button:nth-child(3)')
  .wait(1000)
  .click('.gmnoprint > div > div > button:nth-child(3)')
  .wait(1000)
  .evaluate()
  .end()
  .then((text) => {
    console.log(text);
  })
  .catch((error) => {
    console.error('Search failed:', error);
  });

  // .evaluate(() => (
  //   new Promise((resolve, reject) => {
  //     setTimeout(() => resolve(document.querySelector('.list-item-container')), 2000);
  //   })
  // ))
