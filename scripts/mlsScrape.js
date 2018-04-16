const Nightmare = require('nightmare')
const House = require('../db/house')
const db = require('../db/db')

const scrapeHouseLink = require('./scrapeHouseLink')

const sendMail = require('./email')

const getExpenses = require('./mlsHelpers').getExpenses
const getIncomeFromData = require('./mlsHelpers').getIncomeFromData
const removeDuplicate = require('./mlsHelpers').removeDuplicate
const rentalDataPromise = require('./mlsHelpers').rentalDataPromise

const Promise = require('bluebird')

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
	let houseList
	try {
		houseList = await scrapeHouseLink(url)
	} catch(e) {
		throw e
	}
	let houseArray = []
	let housesWithUnitInfo = []

	houseList.forEach(h => {
		const { data } = h // data is the object containing the data

		let unit = null
		if (!data.unitAndBr.err.error) {
			unit = data.unitAndBr.units.length
		}

		const expenses = getExpenses(data.sqft, data.heat)

		let gas = expenses.gas
		let hydro = expenses.hydro

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
		throw e
	}
	console.log('2');
	/**
	 * This line, takes the array of housesWithUnitInfo
	 * And the rentalDataPromise function
	 * and runs the nightmare scrapeing code one after the other
	 */
	let rentalDataArray
	try {
		rentalDataArray = await Promise.mapSeries(housesWithUnitInfo, rentalDataPromise)
	} catch (e) {
		throw e
	}

	// here check if the house has rental info for each unit
	// if not then try running it again but with another zoom out
	// then update the house db obj


	let updateHousePromises = []
	let capRateHouses = []

	// this is only for houses with income
	for (var i = 0; i < rentalDataArray.length; i++) {
		const rentalIndex = rentalDataArray[i]
		const houseIndex = housesWithUnitInfo[i]

		const income = getIncomeFromData(rentalIndex, houseIndex.unitAndBr.units)
		const address = houseIndex.address
		const url = houseIndex.url
		const tax = houseIndex.taxes / 12
		const price = houseIndex.price
		let newGas = 0
		let newHydro = 0
		let noi = 0
		let capRate = 0

		if (income.totalIncome > 0 && houseIndex.gas === 0 && houseIndex.hydro === 0) {
			newGas = income.totalIncome * 0.02
			newHydro = income.totalIncome * 0.02
			// now update the object with these values if needs updating
			noi = (income.totalIncome - (newGas + newHydro + tax)) * 12
			capRate = ((noi / price) * 100).toFixed(2)
			if (capRate > 5.5) {
				capRateHouses.push({url, address, capRate})
			}
		} else if (houseIndex.gas > 0 && houseIndex.hydro > 0) {
			noi = (income.totalIncome - (houseIndex.gas + houseIndex.hydro + tax)) * 12
			capRate = ((noi / price) * 100).toFixed(2)
			if (capRate > 5.5) {
				capRateHouses.push({url, address, capRate})
			}
		}
		// CAP RATE = 
		// have total income, have total expense (gas, hydro, tax/12)
		// can get cap rate
		// 1st get NOI (totalincome - totalexpenses) * 12
		// totalexpenses = gas + hydro + taxes

		updateHousePromises.push(updateHouseWithIncome(address, income, newGas, newHydro, capRate))
	}

	try {
		await Promise.all(updateHousePromises)
	}
	catch(e) {
		throw e
	}	

	capRateHouses.forEach(c => {
		sendMail(c.url, c.address, c.capRate)
	})

	console.log('End of mlsScrape function.')
}

const updateHouseWithIncome = (address, income, gas, hydro, capRate) => {
	return new Promise((resolve, reject) => {
		if (gas > 0 && hydro > 0) {
			House.findOneAndUpdate(
				{ address },
				{ $set: { income, gas, hydro, capRate } },
				{ new: true },
				(err, doc) => {
					if (err) reject(err)
					else resolve(doc)
				}
			)
		} else {
			House.findOneAndUpdate(
				{ address },
				{ $set: { income, capRate } },
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
mlsLinkToDb('http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=5fd54a71dfd24404b9c7d7bf8d1d0bc9&App=TREB')
//module.exports = mlsLinkToDb
