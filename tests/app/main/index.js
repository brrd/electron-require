"use strict";

const electron = require("electron");
const app = electron.app;
const Mocha = require("mocha");

app.on("ready", function () {
    const mocha = new Mocha({});
    mocha.addFile("./tests/tests.js");
    mocha.run();
});
