function parseText(inp) {
    if (typeof inp === "string") {
        let stripped = inp.replace(/[$,]/g, "").replace(/\s/g, '');
        if (stripped.at(-1) === ".") stripped = stripped.slice(0, -1);
        let float = parseFloat(stripped);
        return isNaN(float) ? inp : float;
    }
    return inp;
}

function sortTable(table, col, key, ord) {
    const tbody = table.querySelector("tbody");
    const trList = tbody.querySelectorAll("tr");
    let index = 0;
    let array = [];
    for (const tr of trList) {
        const tdList = tr.querySelectorAll("td");
        const relevantTd = tdList[col];
        tr.setAttribute("data-index_element", `index_${index}`);
        if (!isNaN(parseInt(key)) && parseInt(key) == col) {
            const text = relevantTd.innerText;
            array.push([index, parseText(text)]);

        } else if (key.startsWith("attr=")) {
            const attrKey = key.split("attr=")[1];
            const attr = relevantTd.getAttribute(attrKey);
            if (attr) {
                array.push([index, parseText(attr)]);
            } else {
                console.log("Table Sorter: Key argument does not equate to a valid attribute!"); // Append message instead of logging
                return;
            }
        } else {
            console.log("Table Sorter: Key argument is not valid!"); // Append message instead of logging
            return;
        }
        index += 1;
    }
    if (ord === "asc") {
        if (typeof array[0][1] === "string") {
            array.sort(function (a, b) {
                return a[1].localeCompare(b[1]);
            })
        } else {
            array.sort(function (a, b) {
                return a[1] - b[1];
            })
        }
    } else if (ord === "dec") {
        if (typeof array[0][1] === "string") {
            array.sort(function (a, b) {
                return b[1].localeCompare(a[1]);
            })
        } else {
            array.sort(function (a, b) {
                return b[1] - a[1];
            })
        }
    } else {
        console.log("Table Sorter: Order argument is not valid!"); // Append message instead of logging
        return;
    }

    const indexOfLast = array[array.length - 1][0];
    const last_element = tbody.querySelector(`tr[data-index_element="index_${indexOfLast}"]`);
    tbody.appendChild(last_element);
    array.splice(-1);
    for (const sub of array) {
        const num = sub[0];
        tbody.insertBefore(tbody.querySelector(`tr[data-index_element="index_${num}"]`), last_element);
    }
}