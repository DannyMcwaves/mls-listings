const Nightmare = require('nightmare')
const House = require('../db/house')
const mongoose = require('mongoose')

const scrapeHouseLink = require('./scrapeHouseLink')

//const scrapeRentalData = require('./scrapeRentalData')
const scrapeOneBrRentalData = require('./scrapeRentalData').scrapeOneBrRentalData
const scrapeTwoBrRentalData = require('./scrapeRentalData').scrapeTwoBrRentalData
const scrapeThreeBrRentalData = require('./scrapeRentalData').scrapeThreeBrRentalData
const scrapeFourBrRentalData = require('./scrapeRentalData').scrapeFourBrRentalData

const scrapeOneBrRentalDataZoom = require('./scrapeRentalData').scrapeOneBrRentalDataZoom
const scrapeTwoBrRentalDataZoom = require('./scrapeRentalData').scrapeTwoBrRentalDataZoom
const scrapeThreeBrRentalDataZoom = require('./scrapeRentalData').scrapeThreeBrRentalDataZoom
const scrapeFourBrRentalDataZoom = require('./scrapeRentalData').scrapeFourBrRentalDataZoom

const getExpenses = require('./mlsHelpers').getExpenses
const getIncomeFromData = require('./mlsHelpers').getIncomeFromData
const removeDuplicate = require('./mlsHelpers').removeDuplicate

const Promise = require('bluebird')

//mongoose.connect('mongodb://albert:td0ttd0t@localhost:27017/mls_listings')
mongoose.connect('mongodb://localhost:27017/mls_listings')
/**
 * mlsLinkToDb = function
 * Takes a link (Url)
 * This link goes to a torontomls.net website
 * Which contains >= 1 house properties
 * scrapeHouseLink() uses nightmare.js to scrape the website info
 * And returns an array of house objects created from the scraped info
 * THEN it inserts the scraped house objects into the DB
 *  
 * Then houses WITH bedroom + unit info
 * They need more info from padmapper (avg rental income for the bedrooms)
 * scrapeRentalData() takes the address of the house + its units and bedrooms
 * And uses nightmare.js to scrape rental properties that are relevant to that house object
 * And gets the avg income for the houses 
 * And updates the db object
 */
const mlsLinkToDb = async (url) => {
	const houseList = await scrapeHouseLink(url).catch((e) => {throw e})

	let houseArray = []
	let housesWithUnitInfo = []
	let zz = 0

	houseList.forEach(h => {
		const { data } = h // data is the object containing the data

		let unit = null
		if (!data.unitAndBr.err.error) {
			unit = data.unitAndBr.units.length
		}

		const expenses = getExpenses(data.sqft, data.heat)

		let gas = expenses.gas
		let hydro = expenses.hydro

		//let price = parseInt(data.price.replace(/\D+/g, ""))

		const house = {
			address: data.address || null,
			mls: data.mls || null,
      price: data.price || null,
			clientRemarks: data.clientRemarks || null,
			sqft: data.sqft,
      gas,
      hydro,
      taxes: data.taxes || null,
			unitAndBr: data.unitAndBr || null,
			income: { totalIncome: 0 },
			unit,
			url
		}
		houseArray.push(house)
		
		if (!house.unitAndBr.err.error) {
			housesWithUnitInfo.push(house)
		}
	})

	try {
		await insertHouses(houseArray)
	} catch(e) {
		mongoose.disconnect()
		throw e
	}

	/**
	 * This line, takes the array of housesWithUnitInfo
	 * And the rentalDataPromise function
	 * and runs the nightmare scrapeing code one after the other
	 */
	const rentalDataArray = await Promise.mapSeries(housesWithUnitInfo, rentalDataPromise)
		.catch((err) => {
			console.log('swag')
			return null
		})

	// here check if the house has rental info for each unit
	// if not then try running it again but with another zoom out
	// then update the house db obj


	let updateHousePromises = []

	for (var i = 0; i < rentalDataArray.length; i++) {
		const rentalIndex = rentalDataArray[i]
		const houseIndex = housesWithUnitInfo[i]

		const income = getIncomeFromData(rentalIndex, houseIndex.unitAndBr.units)
		const address = houseIndex.address
		let newGas = 0
		let newHydro = 0
		if (income.totalIncome > 0 && houseIndex.gas === 0 && houseIndex.hydro === 0) {
			newGas = income.totalIncome * 0.02
			newHydro = income.totalIncome * 0.02
			// now update the object with these values if needs updating
		}

		updateHousePromises.push(updateHouseWithIncome(address, income, newGas, newHydro))
	}

	try {
		await Promise.all(updateHousePromises)
	}
	catch(e) {
		mongoose.disconnect()
		console.log(e)
	}	

	console.log('awaited')
	mongoose.disconnect()
}

const updateHouseWithIncome = (address, income, gas, hydro) => {
	return new Promise((resolve, reject) => {
		if (gas > 0 && hydro > 0) {
			House.findOneAndUpdate(
				{ address },
				{ $set: { income, gas, hydro } },
				{ new: true },
				(err, doc) => {
					if (err) reject(err)
					else resolve(doc)
				}
			)
		} else {
			House.findOneAndUpdate(
				{ address },
				{ $set: { income } },
				{ new: true },
				(err, doc) => {
					if (err) reject(err)
					else resolve(doc)
				}
			)
		}
	})
}

const insertHouses = (houseArray) => {
	return new Promise((resolve, reject) => {
		House.collection.insert(houseArray, (err, docs) => {
			if (err) {
				reject(err)
			} 
			else {
				resolve(docs)
			}
		})
	})
}

const rentalDataPromise = async (unit) => {
	return new Promise(async (resolve, reject) => {
		const units = removeDuplicate(unit.unitAndBr.units)
		console.log(`units: ${units}`)
		let brData = []

		if (units.includes(1)) {
			console.log('scraping onebr padmapper')
			let onebr = await scrapeOneBrRentalData(unit.address).catch(e => reject(e))
			if (onebr.length < 3) {
				console.log('rescraping')
				onebr = await scrapeOneBrRentalDataZoom(unit.address).catch(e => reject(e))
			}
			brData = [
				...brData,
				...onebr
			]
		}
		if (units.includes(2)) {
			console.log('scraping twobr padmapper')
			let twobr = await scrapeTwoBrRentalData(unit.address).catch(e => reject(e))
			if (twobr.length < 3) {
				console.log('rescraping')
				twobr = await scrapeTwoBrRentalDataZoom(unit.address).catch(e => reject(e))
			}
			brData = [
				...brData,
				...twobr
			]
		}
		if (units.includes(3)) {
			console.log('scraping threebr padmapper')
			let threebr = await scrapeThreeBrRentalData(unit.address).catch(e => reject(e))
			if (threebr.length < 3) {
				console.log('rescraping')
				threebr = await scrapeThreeBrRentalDataZoom(unit.address).catch(e => reject(e))
			}
			brData = [
				...brData,
				...threebr
			]
		}
		if (units.includes(4)) {
			console.log('scraping fourbr padmapper')
			let fourbr = await scrapeFourBrRentalData(unit.address).catch(e => reject(e))
			if (fourbr.length < 3) {
				console.log('rescraping')
				fourbr = await scrapeFourBrRentalDataZoom(unit.address).catch(e => reject(e))
			}
			brData = [
				...brData,
				...fourbr
			]
		}

		if (brData) {
			resolve(brData)
		} else {
			reject('padmapper error')
		}

		//const rentalArray = await scrapeRentalData(unit.address).catch(e => reject(e))

		//console.log(rentalArray)
		// if (rentalArray) {
		// 	resolve(rentalArray)
		// } 
	})
}

//mlsLinkToDb('http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=d26cb297cfff4e1c95eb2e08b4d9f148&App=TREB')
//mlsLinkToDb('http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=fd689e2d68d54f339afb7a11f6e1980d&App=TREB')
//mlsLinkToDb('http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=a4bfa6a07670419a8ab4c7411f94dd0b&App=TREB')
//mlsLinkToDb('http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=9ce0278825d640adb54d7250c016ab0e&App=TREB')
//mlsLinkToDb('http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=9facc19d642a443483a32f3b1dd331f2&App=TREB')
//mlsLinkToDb('http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=80d895f0ece7403cbbe7496d2c2098bb&App=TREB')
//mlsLinkToDb('http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=4b8624f9d268460084000f52b9d5b97a&App=TREB')
mlsLinkToDb('http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=45b77f790488456ea05ac89203530654&App=TREB')