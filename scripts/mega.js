/**
 * This file calls the database for torontomls links
 * Then for each link, calls nightmare scraper to turn house info into db object
 * then if there is unit and br info, scrapes padmapper for rental income, and updates db object
 */
const mongoose = require('mongoose')
const Mlslink = require('../db/mlslink')
const mlsScrape = require('../scrapy/skrape')

const mega = async () => {

	const mlslinks = await Mlslink.find({})

	for (let i = 2; i < mlslinks.length; i++) {
		const link = mlslinks[i].link

		setTimeout(() => {
			mlsScrape(link)
			console.log(i, 'hi')
		}, 10000 * i)
		console.log(i)
	}

}

const scrapeOneLink = () => {}

mega()