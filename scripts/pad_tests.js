
let push = require('./padmapper');

push('Dovercourt Rd').then(data => {
    console.log(data)
}).catch(err => {
    console.log(err);
})

// push('Prescott Ave').then(data => {
//     console.log(data)
// }).catch(err => {
//     console.log(err);
// })
