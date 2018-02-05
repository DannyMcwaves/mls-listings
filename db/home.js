'use strict';

let _mongoose = require('mongoose');

let Schema = _mongoose.Schema;

let schemaDef = {
  mls: String,
  address: String,
  price: String,
  squarefoot: String,
  units: Number,
  heat: String,
  annualMortgageExpense: String,
  noi: String,
  expenses : {
    taxes: String,
    gas: String,
    hydro: String,
    heat: String
  },
  totalExpenses: String,
  operatingCashFlow: String,
  pricePerUnit: String
}

let homeSchema = new Schema(schemaDef);

let Home = _mongoose.model('Home', homeSchema);

exports.default = Home;
