const getDataFromHtml = (child) => {
	// TURNING THE SCRAPED HTML INNERTEXT INTO AN OBJECT
	let data = {}

	let wrLocation

	/*
	* Top section
	* Getting "Address" "Listing price" "Taxes" "Bedrooms" "Washrooms"
	*/
	const topz = child[0].children[0].children[1].innerText

	const topText = topz.split('\n')

	data.address = topText[0]
	
	for (var i = 0; i < topText.length; i++) {
		const str = topText[i]

		if (str.includes('List')) {
			data.price = parseInt(str.match(/\d/g).join(""))
		}
		if (str.includes('Taxes')) {
			data.taxes = parseFloat(str.match(/\d+,\d+\.\d+/)[0].replace(',',''))
		}
		if (str.includes('Bedrooms')) {
			let br = 0
			let brString = str.substring(str.indexOf(':') + 1, str.length)
			if (brString.includes('+')) {
				let brs = brString.split('+')
				brs.forEach(b => {
					let brNumParse = parseInt(b)
					br += brNumParse
				})
				data.bedrooms = br
			} else {
				data.bedrooms = parseInt(brString)
			}

			//data.bedrooms = str.substring(str.indexOf(':') + 1, str.length)
		}
		if (str.includes('Washrooms')) {
			data.washrooms = parseInt(str.substring(str.indexOf(':') + 1, str.length))
			data.wrLocation = topText[i + 1].split(',')
		}
	}

	/*
	* MLS is below photo. Getting MLS string
	*/
	const mls = child[1].children[0].children[0].innerText
	data.mls = mls.substring(mls.indexOf(':') + 1, mls.length);

	/*
	* middle is the 1st column in the middle section
	* Getting "Kitchens" "Heat" "Square footage" from this section
	*/
	const middle = child[2].children[0].children[0].innerText.split('\n')

	for (var i = 0; i < middle.length; i++) {
		const str = middle[i]

		if (str.includes('Kitchens')) {
			let kitchens = 0
			let kitchensString = str.substring(str.indexOf(':') + 1, str.length)
			if (kitchensString.includes('+')) {
				let kits = kitchensString.split('+')
				kits.forEach(k => {
					let kitchenNumParse = parseInt(k)
					kitchens += kitchenNumParse
				})
				data.kitchens = kitchens
			} else {
				data.kitchens = parseInt(kitchensString)
			}
		}

		if (str.includes('Heat')) {
			if (str.indexOf(':') + 1 === str.length) {
				data.heat = null
			} else {
				data.heat = str.substring(str.indexOf(':') + 1, str.length)
			}
		}
		if (str.includes('Apx Sqft')) {
			if (str.indexOf(':') + 1 === str.length) {
				data.sqft = null
			} else {
				data.sqft = str.substring(str.indexOf(':') + 1, str.length)
			}
		}
	}

	// this isn't being used but it's the 2nd column in the middle section
	const middle2 = child[2].children[0].children[1].innerText.split('\n')

	/*
	* Middle3 is the 3rd column in the middle section
	* Getting "Hydro" and "Gas" values
	*/
	const middle3 = child[2].children[0].children[2].innerText.split('\n')

	for (var i = 0; i < middle3.length; i++) {
		const str = middle3[i]
		if (str.includes('Hydro')) {
			// check if empty
			if (str.indexOf(':') + 1 === str.length) {
				data.hydro = null
			} else {
				data.hydro = str.substring(str.indexOf(':') + 1, str.length)
			}
		}
		if (str.includes('Gas')) {
			// check if empty
			if (str.indexOf(':') + 1 === str.length) {
				data.gas = null
			} else {
				data.gas = str.substring(str.indexOf(':') + 1, str.length)
			}
		}
	}

	/**
	* Client Remarks is just some text at the bottom of the house listing
	*/
	const clientRmrks = child[7].innerText

	data.clientRemarks = clientRmrks.substring(clientRmrks.indexOf(':') + 1, clientRmrks.length)
	
	return data
}

exports.getDataFromHtml = getDataFromHtml