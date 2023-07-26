# libraries
## Index
- [Network Listeners](#network-listener)
- [Table Sorter](#table-sort)

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
## Table Sort
**The purpose of this is to sort a simple table while not removing any listeners, which is why instead of innerHTML, I used appendChild and insertBefore methods as they retain the listeners.**

```javascript
sortTable(tableNode, column_which_has_the_key, key, sort_order);
```
**tableNode**: The table (not the selector, but the element itself) which has to be sorted. (Type: Node)

**column_which_has_the_key**: The column with respect to which the table is to be sorted. (Type: Integer)

**key**: This seperate argument is needed in case the sorting does not have to be done as per the value in cells, but an html attribute of the cell, eg:
```html
<tr>
   <td name_id="456234325">Peter</td>
   <td>Darker</td>
   <td>33</td>
</tr>
<tr>
   <td name_id="390342342">Zebra</td>
   <td>Crossing</td>
   <td>999</td>
</tr>



In this case the key argument will be a string: "attr=name_id"
Otherwise the key argument will be an integer which shall be equal to column_which_has_the_key
```

**sort_order**: "asc" or "dec" (Type: String)
