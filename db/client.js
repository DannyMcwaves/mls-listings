"use strict";

let Home = require("./home");

const FindHomes = () => {
    return new Promise((resolve, reject) => {
        Home.default.find({}, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    })
}

exports.Find = FindHomes;
