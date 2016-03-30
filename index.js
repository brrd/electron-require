"use strict";

const electron = require("electron");
const path = require("path");
const app = process.type === "browser" ? electron.app : electron.remote.app;
const appRelPath = path.relative(__dirname, app.getAppPath());

let rq = (module) => require.main.require(module);

let remote = (module) => {
    if (process.type === "renderer") {
        return require("electron").remote.require(module);
    } else {
        // fallback on rq if process isnt renderer
        return rq(module);
    }
};

let set = (arg1, arg2) => {
    if (arg1 == null) throw Error("Undefined key is not allowed in rq.set()");
    // Supports multiple declaration: [{ key, path }, { key, path }]
    if (typeof arg1 === "object") {
        for (let key in arg1) {
            rq.set(key, arg1[key]);
        }
    } else {
        let key = arg1;
        let dir = arg2;
        if (!path.isAbsolute(dir)) {
            dir = path.join(appRelPath, dir);
        }
        rq[key] = (module) => require(path.join(dir, module));
    }
};

// Immutable properties
Object.defineProperties(rq, {
    "remote": { value: remote },
    "set": { value: set }
});

// Set default config
rq.set({
    "root": "",
    "renderer": "app/renderer",
    "main": "app/main",
    "browser": "app/main"
});

module.exports = rq;
