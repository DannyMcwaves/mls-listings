'use strict';

let _mongoose = require('mongoose');

let Schema = _mongoose.Schema;

let schemaDef = {
  mls: String,
  address: String,
  price: String,
  units: Number,
}

let homeSchema = new Schema(schemaDef);

let Home = _mongoose.model('Home', homeSchema);

exports.default = Home;
