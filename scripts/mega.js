// need info (url links) from email
	// - get the links that are needed
	// - organize that data 
	// - export a function that gets that data
	// - insert into db, with checks and shit

// call db for torontomls links and then for each link...

// call skrape with link

// save to db

// need income from padmapper

// update db

// this is the functionality for the db


// here is the function
const mongoose = require('mongoose')
const Mlslink = require('../db/mlslink')
const mlsScrape = require('../scrapy/skrape')

const mega = async () => {

	// 1. get mls links from db

	const mlslinks = await Mlslink.find({})
	//console.log(mlslinks)

	// 2. call skrape with link

	mlsScrape(mlslinks[1].link)
	// mlslinks.forEach(m => {
	// 	mlsScrape(m)
	// })



	//mongoose.connection.close()
}

mega()