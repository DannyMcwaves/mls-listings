const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: 'true' });

nightmare
  .goto('http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=ded66b6ce5fb4ed3af5881fc990c151e&App=TREB')
  .wait(2000)
  .evaluate(() => {
    let allHomes = document.querySelectorAll('div.link-item')

    return allHomes
  })
  .end()
  .then((x) => {
    console.log(JSON.stringify(x))
  })
  .catch((error) => {
    console.error('search failed')
  });
