// ==UserScript==
// @name         Custom Event Dispatchers
// @namespace    hardy.network.monitor
// @version      0.5
// @description  Monitor Fetch, XHR and websocket calls and if document is ready for injecting scripts
// @author       Hardy [2131687]
// @match        *://*/*
// @run-at       document-start
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';
    let xhrListener = false;
    let fetchListener = false;
    let websocketListener = false;

    let documentListener;
    function addXHRListener() {
        if (xhrListener === true) return;
        const origOpen = XMLHttpRequest.prototype.open;
        const origSend = XMLHttpRequest.prototype.send;
        window.XMLHttpRequest.prototype.open = function() {
            this.url = arguments[1];
            this.addEventListener('load', function() {
                let detail = {};
                detail.callType = "xhr";
                detail.url = this.url;
                detail.body = this.requestBody;
                if (this.responseType === "" || this.responseType === "text") {
                    detail.response = this.responseText;
                } else {
                    detail.response = this.response;
                }
                //whatever the response was
                window.dispatchEvent(new CustomEvent("hardy-xhr", { detail }));
            });
            return origOpen.apply(this, arguments);
        };
        window.XMLHttpRequest.prototype.send = function (body) {
            this.requestBody = body;
            return origSend.apply(this, arguments);
        };
        xhrListener = true;
    }
    function addFetchListener() {
        if (fetchListener === true) return;
        fetchListener = true;

        let original_fetch = unsafeWindow.fetch;
        unsafeWindow.fetch = async (url, init) => {
            let response = await original_fetch(url, init)
            let respo = response.clone();
            try {
                respo.text().then((info) => {
                    const details = {"fetch" : {"url": url}};
                    details.body = init.body? init.body: '';
                    details.json = isJsonString(info)? JSON.parse(info): {"data": info};
                    window.dispatchEvent(new CustomEvent("hardy-fetch", {
                        "detail": details
                    }));
                });
            } catch(error) {
                console.log(`Fetch Interceptor Error: ${error}`);
            }
            return response;
        };
    }
    function addWebsocketListener() {
        if (websocketListener === true) return;
        websocketListener = true;
        const nativeWebSocket = unsafeWindow.WebSocket;
        unsafeWindow.WebSocket = function(...args) {
            const socket = new nativeWebSocket(...args);
            socket.addEventListener("message", (t)=> {
                let detail = {};
                detail.callType = "websocket";
                detail.url = socket.url;
                detail.response = t.data;
                window.dispatchEvent(new CustomEvent("hardy-socket", {
                    "detail": detail
                }));
            });
            return socket;
        }
    }
    function addDocumentListener() {
        //made to deal with error while applying querySelector when document is null
        documentListener = setInterval(()=> {
            if (document.head) {
                window.dispatchEvent(new CustomEvent("hardy-documentAvailable", {
                }));
                clearInterval(documentListener);
            }
        }, 400);
    }
    function isJsonString(str) {
        if (!str || str === "") return false;

        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    addXHRListener();
    addFetchListener();
    addWebsocketListener();
    addDocumentListener();
})();
