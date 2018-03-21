let House = require("./house");

const FindHouses = () => {
    return new Promise((resolve, reject) => {
        House.find({}, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    })
}

exports.Find = FindHouses;
