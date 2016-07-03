"use strict";

const expect = require("chai").expect;
const rq = require("../index.js");

describe("main process", function () {

    it("should import a module with rq()", function () {
        const mod = rq("./module.js");
        expect(mod).to.equal("main");
    });

    it("should import an electron module", function () {
        const app = rq.electron("app");
        expect(app.getName).to.be.a("function");
    });

    it("should import a module with the rq.remote() alias (main process)", function () {
        const mod = rq.remote("./module.js");
        expect(mod).to.equal("main");
    });

    it("should use a default alias", function () {
        const mod = rq.renderer("./module.js");
        expect(mod).to.equal("renderer");
    });

    it("should use an alias defined in package.json", function () {
        const mod = rq.custom1("./module.js");
        expect(mod).to.equal("custom");
    });

    it("should set and use a custom alias", function () {
        rq.set("custom2", "./custom/");
        const mod = rq.custom2("./module.js");
        expect(mod).to.equal("custom");
    });
});
