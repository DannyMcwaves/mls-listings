const rentalDataPromise = require('./mlsHelpers').rentalDataPromise

const doIt = async () => {

    const unit = {
        address: '89 Ashburnham Rd',
        mls: 'C4108834',
        price: 899000,
        clientRemarks: 'Attention Investors! Rental Opportunity Or Reno Family Home. Delightful Quiet One Way South Street, No Traffic From St. Clair Ave With Large Yard. Front Yard Parking With City Permit - Annual Cost. Walkout From Front Cantina To Front Yard Parking. 9Ft Ceilings On Main Level, Large Covered Veranda, Bay Window In Living Room, Updated Roof. Steps To St.Clair, Ttc & Great Restaurants, Schools, Fr. Immersion, Place Of Worship, Stroll To Wychwood Barns & Patios!\nExtras:3 Refrigerators, 2 Electric Stoves, 1 Gas Stove , 1 Washer, 1 Dryer (Rental Gas Boiler - Radiant Heating $129.02 & Rental Hot Water Tank)\n',
        sqft: null,
        gas: 0,
        hydro: 0,
        taxes: 3797.85,
        unitAndBr: { err: { error: false, message: [] }, units: [ 1,2,3,4 ] },
        income: { totalIncome: 0 },
        unit: [1],
        url: 'http://v3.torontomls.net/Live/Pages/Public/Link.aspx?Key=abba064fefdf42e386c38ddcffca81e0&App=TREB'
    }

    const x = await rentalDataPromise(unit)
    console.log(x)
}

doIt()