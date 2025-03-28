# Libraries

## Table of Contents
- [Network Listener](#network-listener)
  - [Sample Use of Listeners](#sample-use-of-listeners)
- [Sourtable](#sourtable)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Initializing a Sortable Table](#initializing-a-sortable-table)
    - [Constructor Parameters](#constructor-parameters)
    - [Methods](#methods)
      - [`initiate()`](#initiate)
      - [`addCustomParseFunction(colIndex, parseFunction)`](#addcustomparsefunctioncolindex-parsefunction)
  - [Sorting Behavior](#sorting-behavior)
  - [Notes](#notes)
  - [Example Usage](#example-usage)
- [Wait For Element To Exist](#wait-for-element-to-exist)

## Network Listener

### Sample Use of Listeners

Install the [script](https://github.com/sid-the-sloth1/libraries/blob/main/libs/network%20listener.js) and then use any of the following snippets in your own code or Userscripts as needed.

```javascript
// Fetch Interceptor
window.addEventListener("hardy-fetch", (t) => {
    let detail = t.detail;
    console.log(detail);
    // Do whatever with the detail variable.
});

// XHR Interceptor
window.addEventListener("hardy-xhr", (t) => {
    let detail = t.detail;
    console.log(detail);
    // Do whatever with the detail variable.
});

// Socket Interceptor
window.addEventListener("hardy-socket", (t) => {
    let detail = t.detail;
    console.log(detail);
    // Do whatever with the detail variable.
});
```

## Sourtable

**A lightweight JavaScript library for sorting HTML tables without removing event listeners.**

Sourtable.js ensures event listeners remain intact by using `appendChild` and `insertBefore` instead of modifying `innerHTML`.


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
Initializes sorting functionality, adding event listeners and sorting indicators (up/down arrows next to column headers).

```javascript
sourtable.initiate();
```

#### `addCustomParseFunction(colIndex, parseFunction)`
Allows specifying a custom parsing function for a column before sorting.

**Parameters:**
- `colIndex` *(Number)*: The index of the column to apply the function to.
- `parseFunction` *(Function)*: A function that takes a string input and returns a sortable value.

**Example:**
```javascript
sourtable.addCustomParseFunction(1, function(text) {
    return SourtableFunctions.parseText(text);
});
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

[View Script](https://github.com/sid-the-sloth1/libraries/blob/main/libs/waitForElement.js)

```javascript
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

