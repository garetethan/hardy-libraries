class SourTable {
    // table = table element. Not selector, but the element itself.
    // excludedColumns = array of column indexes to exclude from sorting. Index starts at 0.
    // keysForAttributes = object of key-value pairs. Key is the column index, value is the attribute key to sort by. for example, if you want to sort by the "data-last_active" attribute in column 2, then the key,value pair would be would be {"col_2": "data_last_active"}
    // more examples: {"col_2": "data_last_active", "col_3": "data_outofhosp_in"}
    // dynamic = whether you expect the table to add or remove elements after being initialised or not.
    constructor(table, excludedColumns = [], keysForAttributes = {}) {
        if (!(table instanceof HTMLElement)) {
            throw new Error("SourTable: Invalid table element provided.");
        }
        if (!Array.isArray(excludedColumns) || !excludedColumns.every(Number.isInteger)) {
            throw new Error("SourTable: excludedColumns must be an array of integers.");
        }
        if (typeof keysForAttributes !== "object" || keysForAttributes === null) {
            throw new Error("SourTable: keysForAttributes must be a valid object.");
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
        if (this.table.querySelector("thead")) {
            return Array.from(this.table.querySelectorAll("tbody tr"));
        } else {
            let rows = this.table.querySelectorAll("tr");
            return rows.length > 1 ? Array.from(rows).slice(1) : [];
        }
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
                    arrowsDiv = this.createElement("div", { "class": "sourtable-arrow-container" });
                    th.appendChild(arrowsDiv);
                }
                arrowsDiv.innerHTML = `<div class="sourtable-arrow-up"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path  d="M18.2 13.3L12 7l-6.2 6.3c-.2.2-.3.5-.3.7s.1.5.3.7s.4.3.7.3h11c.3 0 .5-.1.7-.3s.3-.5.3-.7s-.1-.5-.3-.7"/></svg></div><div class="sourtable-arrow-down"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path  d="M5.8 9.7L12 16l6.2-6.3c.2-.2.3-.5.3-.7s-.1-.5-.3-.7s-.4-.3-.7-.3h-11c-.3 0-.5.1-.7.3s-.3.4-.3.7s.1.5.3.7"/></svg></div>`;
                th.setAttribute("data-sourtable-order", "asc");
            }
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
        let rows = this.getBody();
        const isKeyAttr = typeof key === 'string' && key !== '' && key.startsWith('attr=');
        let keyAttr = "";
        if (isKeyAttr) {
            keyAttr = key.split('attr=')[1];
        }
        ///
        let rowIndex = 0;
        for (const row of rows) {
            const index = `index_${rowIndex}`;
            row.setAttribute("data-sourtable-row-index", index);

            const tdList = row.querySelectorAll("td");
            const relevantTd = tdList[colIndex];

            if (isKeyAttr) {
                const attrVal = relevantTd.getAttribute(keyAttr);
                if (attrVal) {
                    let parsed;
                    if (this.customParseFunctions[`col_${colIndex}`]) {
                        parsed = this.customParseFunctions[`col_${colIndex}`](attrVal);
                    } else {
                        parsed = this.parseText(attrVal);
                    }
                    array.push([index, parsed]);
                } else {
                    throw new Error(`SourTable: Key argument does not equate to a valid attribute! ATTRIBUTE_KEY: ${keyAttr}, ROW_INDEX: ${index}`);
                    return;
                }
            } else {
                const text = relevantTd.innerText;
                let parsed;
                    if (this.customParseFunctions[`col_${colIndex}`]) {
                        parsed = this.customParseFunctions[`col_${colIndex}`](text);
                    } else {
                        parsed = this.parseText(text);
                    }
                array.push([index, parsed]);
            }
            rowIndex += 1;
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
        const tbody = this.table.querySelector("tbody") || this.table;
        const last_element = tbody.querySelector(`tr[data-sourtable-row-index="${indexOfLast}"]`);
        tbody.appendChild(last_element);
        array.splice(-1);
        for (const index_n_text of array) {
            const index = index_n_text[0];
            tbody.insertBefore(tbody.querySelector(`tr[data-sourtable-row-index="${index}"]`), last_element);
        }

    }
    addCSS() {
        if (!document.querySelector("style#sourtable-style")) {
            const style = this.createElement("style", { id: "sourtable-style" });
            style.innerHTML = `.sourtable-arrow-container{display:inline-flex;flex-direction:column;margin-left:.3em;vertical-align:middle;height:1em;width:.8em;justify-content:space-between}.sourtable-arrow-down,.sourtable-arrow-up{flex:1;min-height:0;display:flex;align-items:center;justify-content:center}.sourtable-arrow-down svg,.sourtable-arrow-up svg{width:100%;height:100%;fill:currentColor;opacity:.3;max-height:.5em}.sourtable-arrow-down.filled svg,.sourtable-arrow-up.filled svg{opacity:1!important}.sourtable-header{cursor:pointer!important}`;
            document.head.appendChild(style);
        }
    }
    initiate() {
        this.resetIndicatorArrows();
        this.addListeners();
        this.addCSS();
    }
    addCustomParseFunction(colIndex, parseFunction) {
        this.customParseFunctions[`col_${colIndex}`] = parseFunction;
    }
    disengage() {
        const headerRow = this.getHeader();
        headerRow.querySelectorAll("th.sourtable-header").forEach(th => {
            th.removeEventListener("click", (event) => this.sortClickHandler(event));
            th.classList.remove("sourtable-header");
            const arrowsDiv = th.querySelector(".sourtable-arrow-container");
            if (arrowsDiv) {
                arrowsDiv.remove();
            }
        });
    }
    createElement(nodeType, attributes = {}) {
        const element = document.createElement(nodeType);
        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
        }
        return element;
    }
    parseText(text) {
        try {
            let stripped = text.replace(/[$,£]/g, "").replace(/\s/g, '');
            if (stripped.at(-1) === ".") stripped = stripped.slice(0, -1);
            let float = parseFloat(stripped);
            return isNaN(float) ? text : float;
        } catch (error) {
            console.error("SourTableFunctions.parseText: Error parsing text.", error);
            return text;
        }
    }
}
