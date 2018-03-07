const mongoose = require('mongoose')
mongoose.Promise = global.Promise
let Schema = mongoose.Schema

let mlslinkSchema = new Schema({
	link: {
		type: String,
		unique: true
	}
})

module.exports = mongoose.model('Mlslink', mlslinkSchema)