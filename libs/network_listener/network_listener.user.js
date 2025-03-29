// ==UserScript==
// @name         Custom Event Dispatchers
// @namespace    hardy.network.monitor
// @version      0.6
// @description  Monitor Fetch, XHR, and WebSocket calls.
// @author       Hardy [2131687]
// @match        *://*/*
// @run-at       document-start
// @grant        unsafeWindow
// ==/UserScript==

(function () {
    "use strict";

    let listeners = {
        xhr: false,
        fetch: false,
        websocket: false,
    };

    function dispatchCustomEvent(type, detail) {
        window.dispatchEvent(new CustomEvent(`hardy-${type}`, { detail }));
    }

    function addXHRListener() {
        if (listeners.xhr) return;
        listeners.xhr = true;

        const origOpen = XMLHttpRequest.prototype.open;
        const origSend = XMLHttpRequest.prototype.send;
        window.XMLHttpRequest.prototype.open = function () {
            this.url = arguments[1];
            this.addEventListener('load', function () {
                dispatchCustomEvent("xhr", {
                    url: this.url,
                    body: this.requestBody,
                    response: this.responseType === "" || this.responseType === "text" ? this.responseText : this.response,
                });
            });
            return origOpen.apply(this, arguments);
        };
        window.XMLHttpRequest.prototype.send = function (body) {
            this.requestBody = body;
            return origSend.apply(this, arguments);
        };
    }



    function addFetchListener() {
        if (listeners.fetch) return;
        listeners.fetch = true;

        const originalFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = async (url, init = {}) => {
            let response = await originalFetch(url, init);
            let clonedResponse = response.clone();

            clonedResponse.text().then((text) => {
                dispatchCustomEvent("fetch", {
                    url,
                    body: init.body || null,
                    response: text
                });
            }).catch(console.error);

            return response;
        };
    }

    function addWebSocketListener() {
        if (listeners.websocket) return;
        listeners.websocket = true;

        const NativeWebSocket = unsafeWindow.WebSocket;
        unsafeWindow.WebSocket = function (...args) {
            const socket = new NativeWebSocket(...args);
            socket.addEventListener("message", (event) => {
                dispatchCustomEvent("socket", {
                    url: socket.url || "unknown",
                    response: event.data,
                });
            });
            return socket;
        };
    }

    addXHRListener();
    addFetchListener();
    addWebSocketListener();

})();
