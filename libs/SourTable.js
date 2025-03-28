const SourtableFunctions = {
    "createElement": function (nodeType, attributes = {}) {
        if (typeof nodeType !== "string") {
            console.error("SourtableFunctions.createElement: Invalid nodeType provided.");
            return null;
        }
        try {
            const element = document.createElement(nodeType);
            for (const [key, value] of Object.entries(attributes)) {
                element.setAttribute(key, value);
            }
            return element;
        } catch (error) {
            console.error("SourtableFunctions.createElement: Failed to create element.", error);
            return null;
        }
    },
    "parseText": function (text) {
        if (typeof text !== "string") return text;

        try {
            let stripped = text.replace(/[$,£]/g, "").replace(/\s/g, '');
            if (stripped.at(-1) === ".") stripped = stripped.slice(0, -1);
            let float = parseFloat(stripped);
            return isNaN(float) ? text : float;
        } catch (error) {
            console.error("SourtableFunctions.parseText: Error parsing text.", error);
            return text;
        }
    }
};

class Sourtable {
    // table = table element. Not selector, but the element itself.
    // excludedColumns = array of column indexes to exclude from sorting. Index starts at 0.
    // keysForAttributes = object of key-value pairs. Key is the column index, value is the attribute key to sort by. for example, if you want to sort by the "data-last_active" attribute in column 2, then the key,value pair would be would be {"col_2": "data_last_active"}
    // more examples: {"col_2": "data_last_active", "col_3": "data_outofhosp_in"}
    // dynamic = whether you expect the table to add or remove elements after being initialised or not.
    constructor(table, excludedColumns = [], keysForAttributes={}) {
        if (!(table instanceof HTMLElement)) {
            throw new Error("Sourtable: Invalid table element provided.");
        }
        if (!Array.isArray(excludedColumns) || !excludedColumns.every(Number.isInteger)) {
            throw new Error("Sourtable: excludedColumns must be an array of integers.");
        }
        if (typeof keysForAttributes !== "object" || keysForAttributes === null) {
            throw new Error("Sourtable: keysForAttributes must be a valid object.");
        }
        
        this.table = table;
        this.excludedColumns = excludedColumns;
        this.keysForAttributes = keysForAttributes;
        this.customParseFunctions = {};
    }

    getHeader() {
        return this.table.querySelector("tr"); // First row is always the header
    }

    getBody() {
        let firstRow = this.table.querySelector("tr"); // Get the first row (header)
        if (firstRow && firstRow.nextElementSibling) {
            let rows = [];
            let row = firstRow.nextElementSibling;
            while (row) {
                rows.push(row);
                row = row.nextElementSibling;
            }
            return rows;
        }
        return [];
    }
    resetIndicatorArrows() {
        const headerRow = this.getHeader();
        const headers = headerRow.querySelectorAll("th");
        for (let index = 0; index < headers.length; index++) {
            if (this.excludedColumns.indexOf(index) === -1) {
                const th = headers[index];
                let arrowsDiv = th.querySelector(".sourtable-arrow-container");
                if (!arrowsDiv) {
                    th.classList.add(`sourtable-header`);
                    th.setAttribute("data-sourtable-col-index", `index_${index}`);
                    arrowsDiv = SourtableFunctions.createElement("div", { "class": "sourtable-arrow-container" });
                    th.appendChild(arrowsDiv);
                }
                arrowsDiv.innerHTML = `<div class="sourtable-arrow-up"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path  d="M18.2 13.3L12 7l-6.2 6.3c-.2.2-.3.5-.3.7s.1.5.3.7s.4.3.7.3h11c.3 0 .5-.1.7-.3s.3-.5.3-.7s-.1-.5-.3-.7"/></svg></div><div class="sourtable-arrow-down"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path  d="M5.8 9.7L12 16l6.2-6.3c.2-.2.3-.5.3-.7s-.1-.5-.3-.7s-.4-.3-.7-.3h-11c-.3 0-.5.1-.7.3s-.3.4-.3.7s.1.5.3.7"/></svg></div>`;
                th.setAttribute("data-sourtable-order", "asc");
            }
        }
    }
    addIndicesToRows() {
        const rows = this.getBody();
        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];
            row.setAttribute("data-sourtable-row-index", `index_${index}`);
        }
    }
    addListeners() {
        const headerRow = this.getHeader();
        headerRow.querySelectorAll("th.sourtable-header").forEach(th => {
            th.addEventListener("click", (event) => this.sortClickHandler(event));
        });
    }
    sortClickHandler(event) {
        const target = event.target;
        if (target.classList.contains("sourtable-header")) {
            const colIndex = Number(target.getAttribute("data-sourtable-col-index").split("_")[1]);
            const order = target.getAttribute("data-sourtable-order");
            const newOrder = order === "asc" ? "desc" : "asc";
            let key = "";
            if (this.keysForAttributes[`col_${colIndex}`]) {
                key = `attr=${this.keysForAttributes[`col_${colIndex}`]}`;
            }
            this.sort(colIndex, newOrder, key);
            this.resetIndicatorArrows();
            const selector = order === "asc" ? "div.sourtable-arrow-up" : "div.sourtable-arrow-down";
            target.querySelector(selector).classList.add("filled");
            target.setAttribute("data-sourtable-order", newOrder);
        }
    }
    sort(colIndex, order, key = "") {
        const array = [];
        const rows = this.getBody();
        ///

        const isKeyAttr = typeof key === 'string' && key !== '' && key.startsWith('attr=');
        let keyAttr = "";
        if (isKeyAttr) {
            keyAttr = key.split('attr=')[1];
        }
        ///

        for (const row of rows) {
            const index = row.getAttribute("data-sourtable-row-index");

            const tdList = row.querySelectorAll("td");
            const relevantTd = tdList[colIndex];

            let parseFunction = SourtableFunctions.parseText;
            if (this.customParseFunctions[`col_${colIndex}`]) {
                parseFunction = this.customParseFunctions[`col_${colIndex}`];
            }
            if (isKeyAttr) {
                const attrVal = relevantTd.getAttribute(keyAttr);
                if (attrVal) {
                    array.push([index, parseFunction(attrVal)]);
                } else {
                    throw new Error(`Sourtable: Key argument does not equate to a valid attribute! ATTRIBUTE_KEY: ${keyAttr}, ROW_INDEX: ${index}`);
                    return;
                }
            } else {
                const text = relevantTd.innerText;
                array.push([index, parseFunction(text)]);
            }
        }
        if (order === "asc") {
            if (typeof array[0][1] === "string") {
                array.sort(function (a, b) {
                    return a[1].localeCompare(b[1]);
                })
            } else {
                array.sort(function (a, b) {
                    return a[1] - b[1];
                })
            }
        } else {
            if (typeof array[0][1] === "string") {
                array.sort(function (a, b) {
                    return b[1].localeCompare(a[1]);
                })
            } else {
                array.sort(function (a, b) {
                    return b[1] - a[1];
                })
            }
        }

        const indexOfLast = array[array.length - 1][0];
        const tbody = this.table.querySelector("tbody");
        const last_element = tbody.querySelector(`tr[data-sourtable-row-index="${indexOfLast}"]`);
        tbody.appendChild(last_element);
        array.splice(-1);
        for (const index_n_text of array) {
            const index = index_n_text[0];
            tbody.insertBefore(tbody.querySelector(`tr[data-sourtable-row-index="${index}"]`), last_element);
        }

    }
    initiate() {
        this.resetIndicatorArrows();
        this.addIndicesToRows();
        this.addListeners();
    }
    addCustomParseFunction(colIndex, parseFunction) {
        this.customParseFunctions[`col_${colIndex}`] = parseFunction;
    }
}
