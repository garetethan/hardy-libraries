let saved = JSON.parse(GM_getValue("prefs", `{"checkbox": {}, "input": {}, "select": {}}`));
    const options = {"checkbox": {"option1": {"name": "Selection Option 1", "def": "yes"}, "option2": {"name": "Selection Option 2", "def": "no"}}, "input": {"api_key": {"name": "Enter Your APIkey here", "def": "N/A"}, "booobies": {"name": "Show your boobies", "def": "I will nots"}}, "select": {"car_pref": {"name": "Choose your fav car", "def": "rr", "options": [["bmw", "B M W"], ["audi", "AUDI"], ["rr", "Rolls Royce"]]}}};
    GM_registerMenuCommand("Preferences", ()=> {
        createPreferencesBox();
    });
    function createPreferencesBox() {
        const prefBox = document.querySelector('#hardy_pref_box_q-links');
        if (!prefBox) {
            const box = createElement("div", {"id": "hardy_pref_box_q-links", "class": "hardy_modal_dialog"});
            box.innerHTML = `<div class="hardy_modal"><div class="hardy_modal_header"><label>Preferences</label></div><div style="text-align: right;"><button class="hardy_modal_close">Close</button></div><div style="overflow: auto;"><div class="hardy_modal_content"></div></div></div>`;
            box.querySelector(".hardy_modal_close").addEventListener("click", ()=> {
                box.remove();
            });
            let html = ``;
            const checkboxes = options.checkbox;
            for (const checkbox in checkboxes) {
                const info = checkboxes[checkbox].name;
                html += `<label>${info}: </label><input type="checkbox" name="${checkbox}"${preferenceHandler("checkbox", checkbox, checkboxes[checkbox].def, "")}><br>`;
            }
            const inputs = options.input;
            for (const input in inputs) {
                const info = inputs[input].name;
                html += `<label>${info}: </label><input type="text" name="${input}" value="${preferenceHandler("input", input, inputs[input].def, "")}">`
            }
            const selects = options.select;
            for (const select in selects) {
                const info = selects[select].name;
                const ops = selects[select].options;
                html += `<label>${info}: </label><select name="${select}"><option value="def_">Choose an option</option>`;
                for (const op of ops) {
                    html += `<option value="${op[0]}"${preferenceHandler("select", select, selects[select].def, op[0])}>${op[1]}</option>`;
                }
                html += "</select>";
            }
            html += `<button class="hardy-save-prefs">Save</button>`;
            box.querySelector(".hardy_modal_content").innerHTML = html;
            document.body.insertBefore(box, document.body.firstChild);
            box.querySelector(".hardy-save-prefs").addEventListener("click", ()=> {
                const inputs = box.querySelectorAll("input");
                for (const input of inputs) {
                    const inpType = input.getAttribute("type");
                    const name = input.getAttribute("name");
                    if (inpType === "checkbox") {
                        if (input.checked === true) {
                            saved.checkbox[name] = "yes";
                        } else {
                            saved.checkbox[name] = "no";
                        }
                    } else if (inpType === "text") {
                        const val = input.value;
                        if (!val || val === "" || typeof val === "undefined" || val === null) {
                            saved.input[name] = "N/A";
                        } else {
                            saved.input[name] = val;
                        }
                    }
                }
                const selects = box.querySelectorAll("select");
                for (const select of selects) {
                    const name = select.getAttribute("name");
                    saved.select[name] = select.value;
                }
                GM_setValue("prefs", JSON.stringify(saved));
            });
        }
    }
    function preferenceHandler(inpType, name, def, opt) {
        if (inpType === "checkbox") {
            if (saved.checkbox[name]) {
                if (saved.checkbox[name] === "yes") {
                    return " checked";
                } else {
                    return "";
                }
            } else {
                saved.checkbox[name] = def;
                if (def === "yes") {
                    return " checked";
                } else {
                    return "";
                }
            }
        } else if (inpType === "input") {
            if (saved.input[name]) {
                return saved.input[name];
            } else {
                saved.input[name] = def;
                return def;
            }
        } else if (inpType === "select") {
            if (saved.select[name]) {
                if (saved.select[name] !== "N/A" && saved.select[name] === opt) {
                    return " selected";
                } else {
                    return "";
                }
            } else {
                saved.select[name] = def;
                if (opt === def) {
                    return " selected";
                } else {
                    return "";
                }
            }
        }
    }
    function createElement(tagName, attributes) {
        const element = document.createElement(tagName);
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        return element;
    }
    GM_addStyle(`.hardy_modal_dialog{position:fixed;z-index:10211;padding-top:6px;left:0;top:0;width:100%;height:100%;background-color:rgba(0,0,0,.4)}.hardy_modal{position:absolute;top:40%;left:50%;height:70%;transform:translate(-50%,-50%);background-color:#fff;width:30rem;border-radius:.5rem;overflow:auto}.hardy_modal_close{padding:2px 5px;text-align:right;background-color:#b06b6b;border-radius:2px;margin:5px;color:#fff}.hardy_modal_content label{margin:5px 0}.hardy_modal_content input[type=checkbox]{margin:5px;padding:4px}.hardy_modal_content input[type=text]{border-radius:3px;padding:3px;display:block;width:80%}.hardy_modal_content select{padding:6px;font-size:16px;border-radius:4px;margin:6px 4px}.hardy-save-prefs{background-color:#008000e8;color:#fff;display:block;padding:4px 9px;border-radius:4px}.hardy_modal_content{margin:4px;display:block;padding:7px}.hardy_modal_header{background-color:#000;text-align:center;color:#fff;border-radius:6px 6px 0 0;padding:5px;width:100%}`);
