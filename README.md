# libraries
## Index
- [Network Listeners](#network-listener)
- [Sourtable: Table Sorter](#sourtable)
- [Wait For Element To Exist](#wait-for-element-to-exist)

## Network Listener
**Sample Use of Listeners**

Install the [script](https://github.com/sid-the-sloth1/libraries/blob/main/libs/network%20listener.js) and then put any of below snippets in your own code/Userscripts as per need.

```javascript

//Fetch Interceptor
    window.addEventListener("hardy-fetch", (t) => {
        let detail = t.detail;
        console.log(detail);
        //do whatever with detail variable.
    });

    //XHR Intercept
    window.addEventListener("hardy-xhr", (t) => {
        let detail = t.detail;
        console.log(detail);
        //do whatever with detail variable.
    });

    //socket Intercept
    window.addEventListener("hardy-socket", (t) => {
        let detail = t.detail;
        console.log(detail);
        //do whatever with detail variable.
    });
    
```


## Sourtable
**The purpose of this is to sort a simple table while not removing any listeners, which is why instead of innerHTML, I used appendChild and insertBefore methods as they retain the listeners.**


Sourtable.js is a lightweight JavaScript library that adds dynamic sorting to HTML tables. It allows users to exclude specific columns from sorting, sort by custom attributes, and define custom parsing functions for column values.

### Installation

To use Sourtable.js, include the script in your project, preferably before the closing `<body>` tag for optimal performance:

```html
<script src="path/to/sourtable.js"></script>
```

### Usage

#### Initializing a Sortable Table

To make a table sortable, initialize the `Sourtable` class with the table element:

```javascript
const table = document.querySelector("#myTable");
const sourtable = new Sourtable(table);
sourtable.initiate();
```

#### Constructor Parameters

```javascript
new Sourtable(table, excludedColumns = [], keysForAttributes = {});
```

- `table` *(HTMLElement)*: The table element to be made sortable.
- `excludedColumns` *(Array)*: An array of column indexes (starting from 0) that should not be sortable.
- `keysForAttributes` *(Object)*: An object where keys are column indexes (as `col_index`) and values are attribute names to sort by.

**Example:**
```javascript
const sourtable = new Sourtable(table, [1], {"col_2": "data-last_active"});
sourtable.initiate();
```
This will exclude column 1 from sorting and sort column 2 using the `data-last_active` attribute.

### Methods

#### `initiate()`
Initializes the sorting functionality, adding event listeners and sorting indicators (up/down arrows next to column headers).

```javascript
sourtable.initiate();
```

#### `addCustomParseFunction(colIndex, parseFunction)`
Allows specifying a custom parsing function for a column before sorting.

**Parameters:**
- `colIndex` *(Number)*: The index of the column to apply the function to.
- `parseFunction` *(Function)*: The function that takes a string input and returns a sortable value.

**Example:**
```javascript
sourtable.addCustomParseFunction(1, function(text) {
    return SourtableFunctions.parseText(text);
});
```

### Internal Utility Functions

#### `SourtableFunctions.createElement(nodeType, attributes)`
Creates an HTML element with specified attributes.

**Example:**
```javascript
const div = SourtableFunctions.createElement("div", {class: "container"});
```

#### `SourtableFunctions.parseText(text)`
Parses a text string, removing special characters and converting it to a number if possible.

**Example:**
```javascript
const parsedValue = SourtableFunctions.parseText("$1,234.56"); // Returns 1234.56
```

### Sorting Behavior

Clicking a column header toggles between ascending (`asc`) and descending (`desc`) order. By default, sorting starts in ascending order. If sorting by an attribute, the script extracts its value instead of the cell text.

### Notes
- The first row of the table is always considered the header.
- Default sorting is based on text or numerical values.
- Columns can be sorted based on custom attributes if specified.

### Example Usage

```javascript
const table = document.querySelector("#myTable");
const sourtable = new Sourtable(table, [0], {"col_2": "data-last_active"});
sourtable.addCustomParseFunction(1, (text) => parseFloat(text.replace("%", "")));
sourtable.initiate();
```
This example excludes column 0 from sorting, sorts column 2 by `data-last_active`, and parses percentages in column 1.




## Wait For Element To Exist

[Link](https://github.com/sid-the-sloth1/libraries/blob/main/libs/waitForElement.js)
```js
 waitForPageLoad().then(() => {
     cacheInventoryItems();
 });
waitForElement(`form[action^="/Bank/Deposit"]`).then((element) => {
    const parent = element.parentNode.parentNode;
    const deposit_input = element.querySelector("input");
    showTaxRateOnBank(parent, deposit_input);
    deposit_input.addEventListener('input', function(event) {
        showTaxRateOnBank(parent, event.target);
    });
}).catch(error => {
    console.log(error);
});
```
