const House = require('../db/house')
const mongoose = require('mongoose')
var Nightmare = require('nightmare'),
co = require('co'),
nightmare = Nightmare({
	show: false
});

mongoose.connect('mongodb://localhost:27017/mls_listings')

const getPutAvgIncome = (address, unit) => {

	co.wrap(run)(address, unit)
  .then(function(result) {

		let onebr = 0;
		let onecount = 0;
		let twobr = 0;
		let twocount = 0;
		let threebr = 0;
		let threecount = 0;
		let fourbr = 0;
		let fourcount = 0;

		let income = {
			onebr: { totalUnits: 0, avgPrice: 0	},
			twobr: { totalUnits: 0, avgPrice: 0	},
			threebr: { totalUnits: 0, avgPrice: 0 },
			fourbr: { totalUnits: 0, avgPrice: 0 }
		}

		// first add them
		result.forEach(r => {
			if (r !== null) {
				if (r.br === 1) {
					onebr += r.price
					onecount++
				}
				if (r.br === 2) {
					twobr += r.price
					twocount++
				}
				if (r.br === 3) {
					threebr += r.price
					threecount++
				}
				if (r.br >= 4) {
					fourbr += r.price
					fourcount++
				}
			}
		})

		income.onebr.avgPrice = onebr / onecount || 0
		income.onebr.totalUnits = onecount || 0
		income.twobr.avgPrice = twobr / twocount || 0
		income.twobr.totalUnits = twocount || 0
		income.threebr.avgPrice = threebr / threecount || 0
		income.threebr.totalUnits = threecount || 0
		income.fourbr.avgPrice = fourbr / fourcount || 0
		income.fourbr.totalUnits = fourcount || 0

		House.findOneAndUpdate(
			{address}, 
			{ $set: { income }}, 
			{ new: true }, 
			(err, doc) => {
				if (err) console.log(err)
				else {
					console.log(doc)
					mongoose.disconnect()
				}
			})
		}, function(err) {
			if (err) console.log(err)
		});

}

var run = function*(address, unit) {

	const longTermBtn = '#root > div > div > div > div > div.col-second > div > div > div > div.p-filter > div > div > div:nth-child(2) > div > div.col-filter-wrap > div > div > div:nth-child(1)'
	const onebr = '#root > div > div > div > div > div.col-second > div > div > div > div.p-filter > div > div > div:nth-child(3) > div > div.col-filter-wrap > div > div > div:nth-child(2)'
	const twobr = '#root > div > div > div > div > div.col-second > div > div > div > div.p-filter > div > div > div:nth-child(3) > div > div.col-filter-wrap > div > div > div:nth-child(3)'
	const threebr = '#root > div > div > div > div > div.col-second > div > div > div > div.p-filter > div > div > div:nth-child(3) > div > div.col-filter-wrap > div > div > div:nth-child(4)'
	const fourbr = '#root > div > div > div > div > div.col-second > div > div > div > div.p-filter > div > div > div:nth-child(3) > div > div.col-filter-wrap > div > div > div:nth-child(5)'
	const zoomOut = '.gmnoprint.gm-bundled-control.gm-bundled-control-on-bottom > div > div > button:nth-child(3)'

  var result = yield nightmare
    .goto('https://www.padmapper.com/')
		.click('.animate-shake')
    .type('.animate-shake', `${address}, Toronto, ON, Canada \u000d`)
    .wait(4000)
		.click(zoomOut)
		.wait(500)
		.click(zoomOut)
		.wait(500)
		.click(zoomOut)
		.wait(500)
		.click(longTermBtn)
		.wait(500)
		.click(onebr)
		.wait(500)
		.click(twobr)
		.wait(500)
		.click(threebr)
		.wait(500)
		.click(fourbr)
		.wait(500)

    .evaluate(function(unit) {
			var elements = Array.from(document.getElementsByClassName('row p-no-gutter list-item-full'));

			return elements.map(function(element) {

				const textsplit = element.innerText.split('·')
				const priceBr = textsplit[0].split('\n')
				// pricebr = [ '$2,800', '3 Bedrooms ' ]
				const price = parseInt(priceBr[0].replace(/\D+/g, ""))
				const br = parseInt(priceBr[1])

				let x = []

				for (let i = 0; i < unit.units.length; i++) {
					const u = unit.units[i] // bedroom size
					if (u < 4) {
						if (br === u) {
							return {
								br, price
							}
						}
					} else if (u >= 4) {
						if (br >= u) {
							return {
								br, price
							}
						}
					}
				}
			  return
			})
    }, unit);

  yield nightmare.end();

  return result;
};

exports.padScrape = getPutAvgIncome