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
    one_br: {
      averagePrice: String,
      numberOfUnits: Number
    },
    two_br: {
      averagePrice: String,
      numberOfUnits: Number
    },
    three_br: {
      averagePrice: String,
      numberOfUnits: Number
    },
    four_br: {
      averagePrice: String,
      numberOfUnits: Number
    },
    parking_spot: String
  },
  totalIncome: String,
  totalExpenses: String,
  operatingCashFlow: String,
  pricePerUnit: String
}

let homeSchema = new Schema(schemaDef);

let Home = _mongoose.model('Home', homeSchema);

exports.default = Home;
