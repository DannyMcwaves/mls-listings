'use strict';

let _mongoose = require('mongoose');

let Schema = _mongoose.Schema;

let schemaDef = {
  mls: String,
  address: String,
  price: Number,
  squarefoot: String,
  house: {
    units: {
      number: Number,
      unit_1: Number || null,
      unit_2: Number || null,
      unit_3: Number || null,
      unit_4: Number || null
    },
  },
  bedroom: Array,
  heat: String,
  annualMortgageExpense: String,
  noi: Number,
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
