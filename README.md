# Libraries

## Table of Contents
- [Network Listener](#network-listener)
  - [Sample Use of Listeners](#sample-use-of-listeners)
- [SourTable](#sourtable)
  - [Usage](#usage)
    - [Initializing a Sortable Table](#initializing-a-sortable-table)
    - [Constructor Parameters](#constructor-parameters)
  - [Methods](#methods)
    - [`initiate()`](#initiate)
    - [`addCustomParseFunction(colIndex,-parseFunction)`](#addcustomparsefunctioncolindex-parsefunction)
  - [Sorting Behavior](#sorting-behavior)
  - [Notes](#notes)
  - [Example Usage](#example-usage)
- [Wait For Element To Exist](#wait-for-element-to-exist)
  - [Features](#features)
  - [Usage](#usage-1)
    - [`waitForElement(selector,-duration-=-800,-maxTries-=-20,-multiple-=-false)`](#waitforelementselector-duration--800-maxtries--20-multiple--false)
    - [`waitForPageLoad()`](#waitforpageload)

## Network Listener

### Sample Use of Listeners

Install the [script](https://github.com/sid-the-sloth1/libraries/blob/main/libs/network%20listener.js) and then use any of the following snippets in your own code or Userscripts as needed. It takes away the need of monkeypatching in all your tools again and again to read the network calls.

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

## SourTable

**A lightweight and simple JavaScript library for sorting HTML tables without removing event listeners.**

SourTable.js ensures event listeners remain intact by using `appendChild` and `insertBefore` instead of modifying `innerHTML`.

[Link to the JS File](https://github.com/sid-the-sloth1/libraries/blob/main/libs/SourTable.js)

### Usage

#### Initializing a Sortable Table

To make a table sortable, initialize the `SourTable` class with the table element:

```javascript
window.addEventListener("load", () => {
  const table = document.getElementById("myTable");
  const sourTable = new SourTable(table);
  sourTable.initiate();
});
```

#### Constructor Parameters

```javascript
new SourTable(table, (excludedColumns = []), (keysForAttributes = {}));
```

- `table` _(HTMLElement)_: The table element to be made sortable.
- `excludedColumns` _(Array)_: An array of column indexes (starting from 0) that should not be sortable.
- `keysForAttributes` _(Object)_: An object where keys are column indexes (as `col_index`) and values are attribute names to sort by.

**Example:**
```html
<tr>
	<td>Alice</td>
	<td>25</td>
	<td data-salary="50000">$50,000</td>
	<td>USA</td>
</tr>
<tr>
	<td>Bob</td>s
	<td>30</td>
	<td data-salary="60000">$60,000</td>
	<td>Canada</td>
</tr>
```

```javascript
const sourtable = new SourTable(table, [1], { "col_2": "data-salary" });
sourtable.initiate();
```

This will exclude column 1 from sorting and sort column 2 using the `data-salary` attribute instead of innerText of the cells.

### Methods

#### `initiate()`

Initializes sorting functionality, adding event listeners and sorting indicators (up/down arrows next to column headers).

```javascript
sourtable.initiate();
```

#### `addCustomParseFunction(colIndex, parseFunction)`

- Allows specifying a custom parsing function for a column before sorting. SourTable has an inbuilt function to parse the text, but if it does not correctly the parse the text in your case, you can use a custom function to parse text in a particular row.
- For example, if your column contains percentage values in brackets `(49.8)%`, SourTable might not correctly parse and sort it, you can use a custom function to parse the text to extract `49.8` from the text and turn it into a float, so that the table can be correctly sorted.

**Parameters:**

- `colIndex` _(Number)_: The index of the column to apply the function to.
- `parseFunction` _(Function)_: A function that takes a string input and returns a sortable value.

**Example:**

```javascript
sourtable.addCustomParseFunction(1, function (text) {
	const num_only = text.trim().replace(/[()%]/g, '');
	return parseFloat(num_only);
});
```

#### `disengage()`

Removes the "click" event listeners and sorting indicators from the table. You will have to manually set the sourtable instance to `null` if you wish to destroy the instance altogether.

**Example:**

```javascript
window.addEventListener("load", () => {
  let table = new SourTable(document.getElementById("myTable")); // use let. If you use const you will get an error if you try to set it to null later on.
  table.initiate();
  document.getElementById("disengage").addEventListener("click", () => {
      table.disengage();
      table = null;
    });
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
const sourtable = new SourTable(table, [0], { "col_2": "data-salary" });
sourtable.addCustomParseFunction(1, (text) =>
  parseFloat(text.replace("%", ""))
);
sourtable.initiate();
```

This example excludes column 0 from sorting, sorts column 2 by `data-salary`, and parses percentages in column 1.

## Wait For Element To Exist

[View Script](https://github.com/sid-the-sloth1/libraries/blob/main/libs/waitForElement.js)

## Features
- **`waitForElement`**: Waits for an element to appear in the DOM before resolving.
- **`waitForPageLoad`**: Ensures the page is fully loaded (simulates `@run_at: document-start`) before proceeding.

## Usage

### `waitForElement(selector, duration = 800, maxTries = 20, multiple = false)`
Waits for an element to be available in the DOM before resolving.

#### Parameters:
- `selector` (string) - The CSS selector of the element to wait for.
- `duration` (number, optional) - Interval time in milliseconds between each check (default: `800ms`).
- `maxTries` (number, optional) - Maximum number of attempts before timing out (default: `20`).
- `multiple` (boolean, optional) - If `true`, waits for multiple elements and returns a NodeList (default: `false`).

#### Returns:
A `Promise` that resolves when the element(s) appear or rejects if the element is not found within the limit.

#### Example Usage:

##### Wait for a button and click it:
```javascript
waitForElement('button#submit-btn')
    .then(button => button.click())
    .catch(error => console.error('Button not found:', error));
```

##### Wait for a dynamically loaded image and update its source:
```javascript
waitForElement('img#dynamic-image')
    .then(image => image.src = 'https://example.com/new-image.jpg')
    .catch(error => console.error('Image not found:', error));
```
#### Wait for multiple elements(**document.querySelectorAll**) and log the elements of returned NodeList
```javascript
waitForElement('ul#item-list li', 500, 30, true)
    .then(items => items.forEach(item => console.log('Item:', item.textContent)))
    .catch(error => console.error('Items not found:', error));
```

### `waitForPageLoad()`
Ensures the document is fully loaded before executing further scripts.

#### Returns:
A `Promise` that resolves when the document is ready.

#### Example:
##### Log a message when the page loads:
```javascript
waitForPageLoad().then(() => {
	console.log('Page has fully loaded.');
});
```

