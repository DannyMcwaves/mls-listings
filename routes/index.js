let express = require('express');
let router = express.Router();
let findHouses = require('../db/client').Find;

/* GET home page. */
router
    .get('/', function(req, res) {
        findHouses().then(data => {
            res.send(data);
        }).catch(err => {
            throw new Error(err);
        })
    })

module.exports = router;
