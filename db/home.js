'use strict';

let _mongoose = require('mongoose');

let Schema = _mongoose.Schema;

let schemaDef = {
  mls: String,
  address: String,
  price: Number,
  squarefoot: String,
  units: Number,
  heat: String,
  annualMortgageExpense: String,
  noi: String,
  hydro: String,
  gas: String,
  expenses : {
    taxes: String,
    gas: Number,
    hydro: Number,
    heat: Number
  },
  income: {
    'one_br': {
      averagePrice: Number,
      numberOfUnits: Number
    },
    'two_br': {
      averagePrice: Number,
      numberOfUnits: Number
    },
    'three_br': {
      averagePrice: Number,
      numberOfUnits: Number
    },
    'four_br': {
      averagePrice: Number,
      numberOfUnits: Number
    },
    'parking spot': Number
  },
  totalIncome: Number,
  totalExpenses: Number,
  operatingCashFlow: Number,
  pricePerUnit: Number
}

let homeSchema = new Schema(schemaDef);

let Home = _mongoose.model('Home', homeSchema);

exports.default = Home;
