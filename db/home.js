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
    '1 bedrooms': {
      averagePrice: String,
      numberOfUnits: Number
    },
    '2 bedrooms': {
      averagePrice: String,
      numberOfUnits: Number
    },
    '3 bedrooms': {
      averagePrice: String,
      numberOfUnits: Number
    },
    '4 bedrooms': {
      averagePrice: String,
      numberOfUnits: Number
    },
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
