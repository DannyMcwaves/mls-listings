
let scrapy = require('./scrape');

let url = 'http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=ded66b6ce5fb4ed3af5881fc990c151e&App=TREB';
let url2 = 'http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=dac85d3bfcea45608d96be99c34e95e4&App=TREB';
let url3 = 'http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=421f88db54b34781b2035e1be9679818&App=TREB';

scrapy(url);
// scrapy(url2);
// scrapy(url3);
