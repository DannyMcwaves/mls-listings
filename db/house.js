const mongoose = require('mongoose')
mongoose.Promise = global.Promise
let Schema = mongoose.Schema

let houseSchema = new Schema({
	address: String,
	mls: String,
	price: String,
	sqft: String,
	clientRemarks: String,
	gas: String,
	heat: String,
	hydro: String,
	taxes: Number,
	unitAndBr: {
		err: {
			error: Boolean,
			message: [String]
		},
		units: [Number]
	}
})

module.exports = mongoose.model('House', houseSchema)