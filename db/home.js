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
  hydro: String,
  gas: String,
  expenses : {
    taxes: String,
    gas: String,
    hydro: String,
    heat: String
  },
  income: {
    '1 bedrooms': String,
    '2 bedrooms': String,
    '3 bedrooms': String,
    '4 bedrooms': String,
    'parking spot': String
  },
  totalIncome: String,
  totalExpenses: String,
  operatingCashFlow: String,
  pricePerUnit: String
}

let homeSchema = new Schema(schemaDef);

let Home = _mongoose.model('Home', homeSchema);

exports.default = Home;
