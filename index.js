"use strict";

const path = require("path");

let rq = (module) => require.main.require(module);

rq.root = (module) => rq(path.join("../../", module));

rq.renderer = (module) => rq(path.join("../renderer/", module));

rq.main = (module) => rq(path.join("../main/", module));
rq.browser = rq.main;

rq.remote = (module) => {
    if (process.type === "renderer") {
        return require("electron").remote.require(module);
    } else {
        // fallback on rq.main if main process
        return rq.main(module);
    }
};

rq.set = (key, root) => {
    rq[key] = (module) => require(path.join(root, module));
};

module.exports = rq;
