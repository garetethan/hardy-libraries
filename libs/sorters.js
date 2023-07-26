function getNumber(inp) {
	if (typeof inp === "string") {
		let stripped = inp.replace(/[$,]/g, "").replace("\s", '');
		let float = parseFloat(stripped);
		if (!isNaN(float)) {
			return float;
		}
	}
	return inp;
}

function sortTable(table, col, key, ord) {
	let trList = table.querySelectorAll("tr");
	let index = 0;
	let array = [];
	for (const tr of trList) {
		if (index > 0) {
			let tdList = tr.querySelectorAll("td");
			let relevantTd = tdList[col];
			if (!isNaN(parseInt(key)) && parseInt(key) == col) {
				let text = relevantTd.innerText;
				array.push([index, getNumber(text)]);
			} else if (key.startsWith("attr=")) {
				let attrKey = key.split("attr=")[1];
				let attr = relevantTd.getAttribute(attrKey);
				if (attr) {
					array.push([index, getNumber(attr)]);
				} else {
					console.log("Table Sorter: Key argument does not equate to a valid attribute!");
					return;
				}
			} else {
				console.log("Table Sorter: Key argument is not valid!");
				return;
			}
		}
		index += 1;
	}
	if (ord === "asc") {
		if (typeof array[0][1] === "string") {
			array.sort(function(a, b) {
				return a[1].localeCompare(b[1]);
			})
		} else {
			array.sort(function(a, b) {
				return a[1] - b[1];
			})
		}
	} else if (ord === "dec") {
		if (typeof array[0][1] === "string") {
			array.sort(function(a, b) {
				return b[1].localeCompare(a[1]);
			})
		} else {
			array.sort(function(a, b) {
				return b[1] - a[1];
			})
		}
	} else {
		console.log("Table Sorter: Order argument is not valid!");
		return;
	}
	let indexOfLast = array[array.length - 1][0];
	let last = trList[indexOfLast];
	table.appendChild(last);
	array.splice(-1);
	for (const sub of array) {
		let num = sub[0];
		table.insertBefore(trList[num], last);
	}
}
