'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

let _mongoose = require('mongoose');

let _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//let DBurl = 'mongodb://localhost:27017/mls_listings';
let DBurl = 'mongodb://albert:td0ttd0t@localhost:27017/mls_listings';

_mongoose2.default.connect(DBurl);

let db = _mongoose2.default.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  console.log("database server is active");
});

db.on("close", function () {
  console.log("Database is closed now");
});

exports.default = db;
