let express = require('express');
let router = express.Router();
let findHomes = require('../db/client').Find;

/* GET home page. */
router
    .get('/', function(req, res) {
        findHomes().then(data => {
            res.send(data);
        }).catch(err => {
            throw new Error(err);
        })
    })

module.exports = router;
