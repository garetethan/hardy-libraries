# libraries

**Sample Use of Listeners**

Install the script and then put any of below snippets as per need.

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
