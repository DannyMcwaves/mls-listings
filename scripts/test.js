const scrapeHouseLink = require('./scrapeHouseLink')

const doIt = async (url) => {
	const x = await scrapeHouseLink(url)
	x.forEach(xx => {
		//console.log(xx)
		console.log({units: xx.data.unitAndBr, address: xx.data.address})
	})
}

doIt('http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=dac795bf9c9045c79e6a94a76be789f6&App=TREB')