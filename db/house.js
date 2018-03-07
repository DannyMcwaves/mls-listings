const mongoose = require('mongoose')
mongoose.Promise = global.Promise
let Schema = mongoose.Schema

let houseSchema = new Schema({
	address: {
		type: String,
		unique: true,
		index: true
	},
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
	},
	income: {
		onebr: { totalUnits: Number, avgPrice: Number },
		twobr: { totalUnits: Number, avgPrice: Number },
		threebr: { totalUnits: Number, avgPrice: Number },
		fourbr: { totalUnits: Number, avgPrice: Number}
	}
})

module.exports = mongoose.model('House', houseSchema)