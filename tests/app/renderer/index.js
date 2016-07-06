"use strict";

const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;
const rq = require("../../../index.js");

let tests = {
    rq: () => rq("./module.js"),
    electron: () => typeof rq.electron("webFrame").setZoomFactor === "function",
    remote: () => rq.remote("./module.js"),
    defaultAlias: () => rq.renderer("./module.js"),
    custom1: () => rq.custom1("./module.js"),
    custom2: () => rq.custom2("./module.js"),
    custom3: () => {
        rq.set("custom3", "./custom/");
        return rq.custom3("./module.js");
    }
};

function createHandler (id, test) {
    ipcRenderer.on(id, () => {
        let res;
        try {
            res = test();
        } catch (err) {
            res = ["error", err.message];
        }
        ipcRenderer.send(id, res);
    });
}

for (var id in tests) {
    createHandler(id, tests[id]);
}
