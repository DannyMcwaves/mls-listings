const Nightmare = require('nightmare')

const longTermBtn = '#root > div > div > div > div > div.col-second > div > div > div > div.p-filter > div > div > div:nth-child(2) > div > div.col-filter-wrap > div > div > div:nth-child(1)'
const onebr = '#root > div > div > div > div > div.col-second > div > div > div > div.p-filter > div > div > div:nth-child(3) > div > div.col-filter-wrap > div > div > div:nth-child(2)'
const twobr = '#root > div > div > div > div > div.col-second > div > div > div > div.p-filter > div > div > div:nth-child(3) > div > div.col-filter-wrap > div > div > div:nth-child(3)'
const threebr = '#root > div > div > div > div > div.col-second > div > div > div > div.p-filter > div > div > div:nth-child(3) > div > div.col-filter-wrap > div > div > div:nth-child(4)'
const fourbr = '#root > div > div > div > div > div.col-second > div > div > div > div.p-filter > div > div > div:nth-child(3) > div > div.col-filter-wrap > div > div > div:nth-child(5)'
const zoomOut = '.gmnoprint.gm-bundled-control.gm-bundled-control-on-bottom > div > div > button:nth-child(3)'

const scrapeRentalData = async (address) => {
	console.log(`Scrapeing ${address} padmapper`)
	const nightmare = new Nightmare({ show: false, width: 1400, height: 900 })
	try {
		const result = await nightmare
			.goto('https://www.padmapper.com/apartments/toronto-on')
			.wait(1000)
			.type('input[name="locationSearch"]', `${address}, Toronto, ON, Canada \u000d`)
			.wait(3000)
			.click(longTermBtn)
			.wait(500)
			.click(onebr)
			.wait(500)
			.click(twobr)
			.wait(500)
			.click(threebr)
			.wait(500)
			.click(fourbr)	
			.evaluate(function() {
				var elements = Array.from(document.getElementsByClassName('row p-no-gutter list-item-full'));

				return elements.map(function(element) {
	
					const textsplit = element.innerText.split('·')
					const priceBr = textsplit[0].split('\n')
					// pricebr = [ '$2,800', '3 Bedrooms ' ]
					// or [ '$1,900 - $2,400', '3 Bedrooms' ]
					let price = 0
					if (priceBr[0].includes('-')) {
						const priceRange = priceBr[0].split('-')
						price = (parseInt(priceRange[0]) + parseInt(priceRange[1])) / 2
					} else {
						price = parseInt(priceBr[0].replace(/\D+/g, ""))
					}
					const br = parseInt(priceBr[1])
					return {
						br, price
					}
				})
			})
			.end()
		
		return result
	} catch(e) {
		console.error(e)
		return null
	}
}

const scrapeOneBrRentalData = async (address) => {
	console.log(`Scrapeing ${address} padmapper`)
	const nightmare = new Nightmare({ show: false, width: 1400, height: 900 })
	try {
		const result = await nightmare
			.goto('https://www.padmapper.com/apartments/toronto-on')
			.wait(1000)
			.type('input[name="locationSearch"]', `${address}, Toronto, ON, Canada \u000d`)
			.wait(3000)
			.click(longTermBtn)
			.wait(500)
			.click(onebr)
			.wait(2500)
			.evaluate(function() {
				var elements = Array.from(document.getElementsByClassName('row p-no-gutter list-item-full'));

				return elements.map(function(element) {
	
					const textsplit = element.innerText.split('·')
					const priceBr = textsplit[0].split('\n')
					// pricebr = [ '$2,800', '3 Bedrooms ' ]
					// or [ '$1,900 - $2,400', '3 Bedrooms' ]
					let price = 0
					if (priceBr[0].includes('-')) {
						const priceRange = priceBr[0].split('-')
						price = (parseInt(priceRange[0]) + parseInt(priceRange[1])) / 2
					} else {
						price = parseInt(priceBr[0].replace(/\D+/g, ""))
					}
					let br = 1
					return {
						br, price
					}
				})
			})
			.end()
		
		return result
	} catch(e) {
		console.error(e)
		return null
	}
}

const scrapeTwoBrRentalData = async (address) => {
	console.log(`Scrapeing ${address} padmapper`)
	const nightmare = new Nightmare({ show: false, width: 1400, height: 900 })
	try {
		const result = await nightmare
			.goto('https://www.padmapper.com/apartments/toronto-on')
			.wait(1000)
			.type('input[name="locationSearch"]', `${address}, Toronto, ON, Canada \u000d`)
			.wait(3000)
			.click(longTermBtn)
			.wait(500)
			.click(twobr)
			.wait(2500)
			.evaluate(function() {
				var elements = Array.from(document.getElementsByClassName('row p-no-gutter list-item-full'));

				return elements.map(function(element) {
	
					const textsplit = element.innerText.split('·')
					const priceBr = textsplit[0].split('\n')
					// pricebr = [ '$2,800', '3 Bedrooms ' ]
					// or [ '$1,900 - $2,400', '3 Bedrooms' ]
					let price = 0
					if (priceBr[0].includes('-')) {
						const priceRange = priceBr[0].split('-')
						price = (parseInt(priceRange[0]) + parseInt(priceRange[1])) / 2
					} else {
						price = parseInt(priceBr[0].replace(/\D+/g, ""))
					}
					let br = 2
					return {
						br, price
					}
				})
			})
			.end()
		
		return result
	} catch(e) {
		console.error(e)
		return null
	}
}

const scrapeThreeBrRentalData = async (address) => {
	console.log(`Scrapeing ${address} padmapper`)
	const nightmare = new Nightmare({ show: false, width: 1400, height: 900 })
	try {
		const result = await nightmare
			.goto('https://www.padmapper.com/apartments/toronto-on')
			.wait(1000)
			.type('input[name="locationSearch"]', `${address}, Toronto, ON, Canada \u000d`)
			.wait(3000)
			.click(longTermBtn)
			.wait(500)
			.click(threebr)
			.wait(2500)
			.evaluate(function() {
				var elements = Array.from(document.getElementsByClassName('row p-no-gutter list-item-full'));

				return elements.map(function(element) {
	
					const textsplit = element.innerText.split('·')
					const priceBr = textsplit[0].split('\n')
					// pricebr = [ '$2,800', '3 Bedrooms ' ]
					// or [ '$1,900 - $2,400', '3 Bedrooms' ]
					let price = 0
					if (priceBr[0].includes('-')) {
						const priceRange = priceBr[0].split('-')
						price = (parseInt(priceRange[0]) + parseInt(priceRange[1])) / 2
					} else {
						price = parseInt(priceBr[0].replace(/\D+/g, ""))
					}
					let br = 3
					return {
						br, price
					}
				})
			})
			.end()
		
		return result
	} catch(e) {
		console.error(e)
		return null
	}
}

const scrapeFourBrRentalData = async (address) => {
	console.log(`Scrapeing ${address} padmapper`)
	const nightmare = new Nightmare({ show: false, width: 1400, height: 900 })
	try {
		const result = await nightmare
			.goto('https://www.padmapper.com/apartments/toronto-on')
			.wait(1000)
			.type('input[name="locationSearch"]', `${address}, Toronto, ON, Canada \u000d`)
			.wait(3000)
			.click(longTermBtn)
			.wait(500)
			.click(fourbr)
			.wait(2500)
			.evaluate(function() {
				var elements = Array.from(document.getElementsByClassName('row p-no-gutter list-item-full'));

				return elements.map(function(element) {
	
					const textsplit = element.innerText.split('·')
					const priceBr = textsplit[0].split('\n')
					// pricebr = [ '$2,800', '3 Bedrooms ' ]
					// or [ '$1,900 - $2,400', '3 Bedrooms' ]
					let price = 0
					if (priceBr[0].includes('-')) {
						const priceRange = priceBr[0].split('-')
						price = (parseInt(priceRange[0]) + parseInt(priceRange[1])) / 2
					} else {
						price = parseInt(priceBr[0].replace(/\D+/g, ""))
					}
					let br = 4
					return {
						br, price
					}
				})
			})
			.end()
		
		return result
	} catch(e) {
		console.error(e)
		return null
	}
}

exports.scrapeTwoBrRentalData = scrapeTwoBrRentalData
exports.scrapeThreeBrRentalData = scrapeThreeBrRentalData
exports.scrapeFourBrRentalData = scrapeFourBrRentalData
exports.scrapeOneBrRentalData = scrapeOneBrRentalData
// module.exports = scrapeRentalData

const scrapeOneBrRentalDataZoom = async (address) => {
	console.log(`Scrapeing ${address} padmapper`)
	const nightmare = new Nightmare({ show: false, width: 1400, height: 900 })
	try {
		const result = await nightmare
			.goto('https://www.padmapper.com/apartments/toronto-on')
			.wait(1000)
			.type('input[name="locationSearch"]', `${address}, Toronto, ON, Canada \u000d`)
			.wait(3000)
			.click(zoomOut)
			.wait(500)
			.click(longTermBtn)
			.wait(500)
			.click(onebr)
			.wait(2500)
			.evaluate(function() {
				var elements = Array.from(document.getElementsByClassName('row p-no-gutter list-item-full'));

				return elements.map(function(element) {
	
					const textsplit = element.innerText.split('·')
					const priceBr = textsplit[0].split('\n')
					// pricebr = [ '$2,800', '3 Bedrooms ' ]
					// or [ '$1,900 - $2,400', '3 Bedrooms' ]
					let price = 0
					if (priceBr[0].includes('-')) {
						const priceRange = priceBr[0].split('-')
						price = (parseInt(priceRange[0]) + parseInt(priceRange[1])) / 2
					} else {
						price = parseInt(priceBr[0].replace(/\D+/g, ""))
					}
					let br = 1
					return {
						br, price
					}
				})
			})
			.end()
		
		return result
	} catch(e) {
		console.error(e)
		return null
	}
}

const scrapeTwoBrRentalDataZoom = async (address) => {
	console.log(`Scrapeing ${address} padmapper`)
	const nightmare = new Nightmare({ show: false, width: 1400, height: 900 })
	try {
		const result = await nightmare
			.goto('https://www.padmapper.com/apartments/toronto-on')
			.wait(1000)
			.type('input[name="locationSearch"]', `${address}, Toronto, ON, Canada \u000d`)
			.wait(3000)
			.click(zoomOut)
			.wait(500)
			.click(longTermBtn)
			.wait(500)
			.click(twobr)
			.wait(2500)
			.evaluate(function() {
				var elements = Array.from(document.getElementsByClassName('row p-no-gutter list-item-full'));

				return elements.map(function(element) {
	
					const textsplit = element.innerText.split('·')
					const priceBr = textsplit[0].split('\n')
					// pricebr = [ '$2,800', '3 Bedrooms ' ]
					// or [ '$1,900 - $2,400', '3 Bedrooms' ]
					let price = 0
					if (priceBr[0].includes('-')) {
						const priceRange = priceBr[0].split('-')
						price = (parseInt(priceRange[0]) + parseInt(priceRange[1])) / 2
					} else {
						price = parseInt(priceBr[0].replace(/\D+/g, ""))
					}
					let br = 2
					return {
						br, price
					}
				})
			})
			.end()
		
		return result
	} catch(e) {
		console.error(e)
		return null
	}
}

const scrapeThreeBrRentalDataZoom = async (address) => {
	console.log(`Scrapeing ${address} padmapper`)
	const nightmare = new Nightmare({ show: false, width: 1400, height: 900 })
	try {
		const result = await nightmare
			.goto('https://www.padmapper.com/apartments/toronto-on')
			.wait(1000)
			.type('input[name="locationSearch"]', `${address}, Toronto, ON, Canada \u000d`)
			.wait(3000)
			.click(zoomOut)
			.wait(500)
			.click(longTermBtn)
			.wait(500)
			.click(threebr)
			.wait(2500)
			.evaluate(function() {
				var elements = Array.from(document.getElementsByClassName('row p-no-gutter list-item-full'));

				return elements.map(function(element) {
	
					const textsplit = element.innerText.split('·')
					const priceBr = textsplit[0].split('\n')
					// pricebr = [ '$2,800', '3 Bedrooms ' ]
					// or [ '$1,900 - $2,400', '3 Bedrooms' ]
					let price = 0
					if (priceBr[0].includes('-')) {
						const priceRange = priceBr[0].split('-')
						price = (parseInt(priceRange[0]) + parseInt(priceRange[1])) / 2
					} else {
						price = parseInt(priceBr[0].replace(/\D+/g, ""))
					}
					let br = 3
					return {
						br, price
					}
				})
			})
			.end()
		
		return result
	} catch(e) {
		console.error(e)
		return null
	}
}

const scrapeFourBrRentalDataZoom = async (address) => {
	console.log(`Scrapeing ${address} padmapper`)
	const nightmare = new Nightmare({ show: false, width: 1400, height: 900 })
	try {
		const result = await nightmare
			.goto('https://www.padmapper.com/apartments/toronto-on')
			.wait(1000)
			.type('input[name="locationSearch"]', `${address}, Toronto, ON, Canada \u000d`)
			.wait(3000)
			.click(zoomOut)
			.wait(500)
			.click(longTermBtn)
			.wait(500)
			.click(fourbr)
			.wait(2500)
			.evaluate(function() {
				var elements = Array.from(document.getElementsByClassName('row p-no-gutter list-item-full'));

				return elements.map(function(element) {
	
					const textsplit = element.innerText.split('·')
					const priceBr = textsplit[0].split('\n')
					// pricebr = [ '$2,800', '3 Bedrooms ' ]
					// or [ '$1,900 - $2,400', '3 Bedrooms' ]
					let price = 0
					if (priceBr[0].includes('-')) {
						const priceRange = priceBr[0].split('-')
						price = (parseInt(priceRange[0]) + parseInt(priceRange[1])) / 2
					} else {
						price = parseInt(priceBr[0].replace(/\D+/g, ""))
					}
					let br = 4
					return {
						br, price
					}
				})
			})
			.end()
		
		return result
	} catch(e) {
		console.error(e)
		return null
	}
}

exports.scrapeTwoBrRentalDataZoom = scrapeTwoBrRentalDataZoom
exports.scrapeThreeBrRentalDataZoom = scrapeThreeBrRentalDataZoom
exports.scrapeFourBrRentalDataZoom = scrapeFourBrRentalDataZoom
exports.scrapeOneBrRentalDataZoom = scrapeOneBrRentalDataZoom