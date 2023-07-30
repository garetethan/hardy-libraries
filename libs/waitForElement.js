function waitForElement(selector) {
    return new Promise(resolve => {
        function tempFunc() {
            let element = document.querySelector(selector);
            if (element) {
                return resolve(element);
            } else {
                setTimeout(tempFunc, 1000);
            }
        }
        tempFunc();
    });
}
