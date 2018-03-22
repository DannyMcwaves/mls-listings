const getExpenses = (sqft, heat) => {
	if (sqft && heat) {
		// get value from sqft
		const squarefoot = sqft.split('-')
		const sqftNum = (parseInt(squarefoot[0]) + parseInt(squarefoot[1])) / 2
		
		// take sqftNum and heat type and you get value for gas and hydro 
		if (heat.includes('Water') || heat.includes('Forced Air') || heat.includes('Radiant')) {
			// gas = (20+0.13*AK1*0.113+(-0.01)*AK1*0.113+0.054*AK1*0.113+0.11*AK1*0.113)*1.13
			// hydro = (0.031*B5)+(0.027*B5)
			gas = parseFloat((20+0.13*sqftNum*0.113+(-0.01)*sqftNum*0.113+0.054*sqftNum*0.113+0.11*sqftNum*0.113)*1.13)
			hydro = parseFloat((0.031*sqftNum)+(0.027*sqftNum))
			return {
				gas, hydro
			}
		} 
		// TBD else if (heat.includes('Electric')) {}
		else {
			// need rental income and 4% of that is the expenses...do this client side...
			return {
				gas: 0,
				hydro: 0
			}
		}
	} else {
		return {
			gas: 0,
			hydro: 0
		}
	}
}

exports.getExpenses = getExpenses

const getIncomeFromData = (arrayOfPrices, units) => {
	let onebr = 0;
	let onecount = 0;
	let twobr = 0;
	let twocount = 0;
	let threebr = 0;
	let threecount = 0;
	let fourbr = 0;
	let fourcount = 0;

	let income = {
		onebr: { totalUnits: 0, avgPrice: 0	},
		twobr: { totalUnits: 0, avgPrice: 0	},
		threebr: { totalUnits: 0, avgPrice: 0 },
		fourbr: { totalUnits: 0, avgPrice: 0 }
	}

	// first add them
	// check if units are the same
	//const doubleCheckArray = removeDuplicate(arrayOfPrices)
	//doubleCheckArray.forEach(r => {
	arrayOfPrices.forEach(r => {
		if (r !== null) {
			if (r.br === 1) {
				onebr += r.price
				onecount++
			}
			if (r.br === 2) {
				twobr += r.price
				twocount++
			}
			if (r.br === 3) {
				threebr += r.price
				threecount++
			}
			if (r.br >= 4) {
				fourbr += r.price
				fourcount++
			}
		}
	})

	income.onebr.avgPrice = onebr / onecount || 0
	income.onebr.totalUnits = onecount || 0
	income.twobr.avgPrice = twobr / twocount || 0
	income.twobr.totalUnits = twocount || 0
	income.threebr.avgPrice = threebr / threecount || 0
	income.threebr.totalUnits = threecount || 0
	income.fourbr.avgPrice = fourbr / fourcount || 0
	income.fourbr.totalUnits = fourcount || 0

	// calculate total income with units array
	// units = [1, 2] or [3] or [2,2,3] or [1,4]
	let unitIncome = {
		totalIncome: 0
	}
	removeDuplicate(units).forEach(u => {
		if (u === 1) {
			unitIncome.onebr = income.onebr
		} else if (u === 2) {
			unitIncome.twobr = income.twobr
		} else if (u === 3) {
			unitIncome.threebr = income.threebr
		} else if (u >= 4) {
			unitIncome.fourbr = income.fourbr
		}
	})

	units.forEach(u => {
		if (u === 1) {
			unitIncome.totalIncome += income.onebr.avgPrice
		} else if (u === 2) {
			unitIncome.totalIncome += income.twobr.avgPrice
		} else if (u === 3) {
			unitIncome.totalIncome += income.threebr.avgPrice
		} else if (u >= 4) {
			unitIncome.totalIncome += income.fourbr.avgPrice
		}
	})
	
	return unitIncome
}

const removeDuplicate = (arr) => {
	const helperMap = {};
	const result = [];

	for (let i = 0; i < arr.length; i++) {
		const item = arr[i];

		if (!helperMap[item]) {
			result[result.length] = item;

			helperMap[item] = true;
		}
	}

	return result;
};

exports.getIncomeFromData = getIncomeFromData
exports.removeDuplicate = removeDuplicate
