let head = false;
let headTimer = setInterval(() => {
    if (document.head) {
        head = true;
        clearInterval(headTimer);
    }
}, 300);
let waitObj = {};

function waitForElement(selector, duration, maxTries, identifier, allOrOne = 0) {
    return new Promise(function(resolve, reject) {
        const value = Math.floor(Math.random() * 1000000000);
        waitObj[identifier] = value;
        let attempts = 0;
        const intervalId = setInterval(() => {
            if (attempts > maxTries) {
                clearInterval(intervalId);
                reject(`Selector Listener Expired: ${selector}, Reason: Dead bcoz u didnt cum on time!!!!`);
            } else if (waitObj[identifier] !== value) {
                clearInterval(intervalId);
                reject(`Selector Listener Expired: ${selector}, Reason: Dead coz u didnt luv me enough and got another SeLecTor!!!!`);
            }
            if (head) {
                if (allOrOne === 0) {
                    const element = document.querySelector(selector);
                    if (element) {
                        clearInterval(intervalId);
                        resolve(element);
                    }
                } else if (allOrOne === 1) {
                    const element = document.querySelectorAll(selector);
                    if (element.length > 0) {
                        clearInterval(intervalId);
                        resolve(element);
                    }
                }
            }
            attempts += 1;
        }, duration);
    });
}
