const mongoose = require('mongoose')
mongoose.Promise = global.Promise
let Schema = mongoose.Schema

let houseSchema = new Schema({
	address: {
		type: String,
		unique: true,
		index: true
	},
	url: String,
	mls: String,
	price: Number,
	sqft: String,
	clientRemarks: String,
	gas: String,
	heat: String,
	hydro: String,
	taxes: Number,
	capRate: Number,
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
		fourbr: { totalUnits: Number, avgPrice: Number},
		totalIncome: Number
	}
})

module.exports = mongoose.model('House', houseSchema)