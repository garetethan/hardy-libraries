# libraries
## Index
- [Network Listeners](#network-listener)

## Network Listener
**Sample Use of Listeners**

Install the [script](https://github.com/sid-the-sloth1/libraries/blob/main/network%20listener.js) and then put any of below snippets in your own code/Userscripts as per need.

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
