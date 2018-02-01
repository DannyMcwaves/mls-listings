"use strict";

let db = require('./db');
let Home = require('./home');

const saveHome = homeObject => {
    // homeObject is the object scraped from sites.
    // instantiate the Home constructor from the Home model.
    let home = new Home.default(homeObject);

    return new Promise((resolve, reject) => {
        home.save((err, res) => {
            if(err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    })
}

exports.Save = saveHome;
