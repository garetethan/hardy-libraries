// ==UserScript==
// @name         Network Call Listener
// @namespace    hardy.network.monitor
// @version      0.1
// @description  Monitor Fetch, XHR and websocket calls
// @author       Hardy [2131687]
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    var xhrListener = false;
    var fetchListener = false;
    var websocketListener = false;
    function addXHRListener() {
        if (xhrListener === true) return;
        const origOpen = XMLHttpRequest.prototype.open;
        const origSend = XMLHttpRequest.prototype.send;
        window.XMLHttpRequest.prototype.open = function() {
            this.url = arguments[1];
            this.addEventListener('load', function() {
                let detail = {};
                detail.url = this.url;
                detail.body = this.requestBody;
                detail.response = this.responseText;
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
        let original_fetch = window.fetch;
        window.fetch = async (url, init) => {
            let returned = await original_fetch(url, init)
            let copy = returned.clone();
            let detail = {};
            try {
                copy.json().then((data) => {
                    detail.response = data;
                    detail.url = url;
                    detail.body = {};
                    if (init.body) {
                        try {
                            for (const key of init.body.keys()) {
                                detail.body[key] = init.body.get(key);
                            }
                        } catch(error) {}
                    }
                    window.dispatchEvent(new CustomEvent("hardy-fetch", {"detail": detail}));
                });
            } catch (error) {
                copy.text().then(data=> {
                    detail.response = data;
                    detail.url = url;
                    detail.body = {};
                    if (init.body) {
                        try {
                            for (const key of init.body.keys()) {
                                detail.body[key] = init.body.get(key);
                            }
                        } catch(error) {}
                    }
                    window.dispatchEvent(new CustomEvent("hardy-fetch", {"detail": detail}));
                });
            }
            return returned;
        }
    }
    function addWebsocketListener() {
        if (websocketListener === true) return;
        websocketListener = true;
        const nativeWebSocket = window.WebSocket;
        window.WebSocket = function(...args) {
            const socket = new nativeWebSocket(...args);
            socket.addEventListener("message", (t)=> {
                let detail = {};
                detail.url = socket.url;
                detail.response = t.data;
                window.dispatchEvent(new CustomEvent("hardy-socket", {
                    "detail": detail
                }));
            });
            return socket;
        }
    }
    addXHRListener();
    addFetchListener();
    addWebsocketListener();

})();
