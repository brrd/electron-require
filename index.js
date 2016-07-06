"use strict";

const electron = require("electron");
const path = require("path");
const app = process.type === "browser" ? electron.app : electron.remote.app;
const appRelPath = path.relative(__dirname, app.getAppPath());

let rq = (module) => require.main.require(module);

let _electron = (module) => {
    if (electron[module]) {
        return electron[module];
    } else if (process.type === "renderer" && electron.remote[module]) {
        return electron.remote[module];
    }
    throw new Error(`${module} is not a valid electron module`);
};

let _remote = (module) => {
    if (process.type === "renderer") {
        return electron.remote.require(module);
    } else {
        // fallback on rq if process isnt renderer
        return rq(module);
    }
};

let _set = (arg1, arg2) => {
    if (arg1 == null) throw Error("Undefined key is not allowed in rq.set()");
    
    // Supports multiple declaration: [{ key, path }, { key, path }]
    if (typeof arg1 === "object") {
        for (let key in arg1) {
            rq.set(key, arg1[key]);
        }
    } else {
        let key = arg1;

        // Replace template strings in path
        const replaceStr = (str) => {
            let re = /%{([A-Za-z]*)}/g;
            let match;
            const replaceValue = (fullStr, name) => {
                let replacement = name === "app" ? app.getAppPath() : app.getPath(name);
                return fullStr.replace(`%{${name}}`, replacement);
            };
            while ((match = re.exec(str)) !== null) {
                str = replaceValue(str, match[1]);
            }
            return str;
        };
        let dir = replaceStr(arg2);

        // Create the method
        rq[key] = (module) => {
            let modulePath;
            if (!path.isAbsolute(dir)) {
                modulePath = "./" + path.join(appRelPath, dir, module);
            } else {
                modulePath = path.join(dir, module);
            }
            return require(modulePath);
        };
    }
};

// Immutable properties
Object.defineProperties(rq, {
    "electron": { value: _electron },
    "remote": { value: _remote },
    "set": { value: _set }
});

// Set default config
rq.set({
    "root": "",
    "renderer": "app/renderer",
    "main": "app/main",
    "browser": "app/main"
});

// Load custom config from package.json (if exists)
let pkg = rq.root("package.json");
if (pkg["electron-require"]) {
    rq.set(pkg["electron-require"]);
}

module.exports = rq;
