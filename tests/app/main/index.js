"use strict";

const Mocha = require("mocha");

// TODO: test renderer process

const mocha = new Mocha({});
mocha.addFile("./tests/tests.js");
mocha.run();
