
let push = require('./padmapper');

push('Lappin Ave').then(data => {
    console.log(data)
}).catch(err => {
    console.log(err);
})

push('Dovercourt Rd').then(data => {
    console.log(data)
}).catch(err => {
    console.log(err);
})
