"use strict";

const expect = require("chai").expect;
const rq = require("../index.js");
const electron = require("electron");
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

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

    it("should use an alias defined in package.json with template strings", function () {
        const mod = rq.custom2("./module.js");
        expect(mod).to.equal("custom");
    });

    it("should set and use a custom alias", function () {
        rq.set("custom3", "./custom/");
        const mod = rq.custom3("./module.js");
        expect(mod).to.equal("custom");
    });
});

describe("renderer process", function () {
    this.timeout(10000);

    let win;

    before(function (done) {
        win = new BrowserWindow({
            show: false
        });
        win.webContents.on("did-finish-load", () => done());
        win.loadURL(`file://${__dirname}/app/renderer/index.html`);
        win.on("closed", () => {
            win = null;
        });
    });

    after(function () {
        win.destroy();
    });

    function pull (id, done, test) {
        ipcMain.on(id, (event, arg) => {
            if (arg[0] === "error") {
                throw new Error("[Raised in renderer process] " + arg[1]);
            }
            test(arg);
            done();
        });
        win.webContents.send(id);
    }

    it("should import a module with rq()", function (done) {
        pull("rq", done, (arg) => {
            expect(arg).to.equal("renderer");
        });
    });

    it("should import an electron module", function (done) {
        pull("electron", done, (arg) => {
            expect(arg).to.equal(true);
        });
    });

    it("should import a remote module with rq.remote() (renderer process)", function (done) {
        pull("remote", done, (arg) => {
            expect(arg).to.equal("main");
        });
    });

    it("should use a default alias", function (done) {
        pull("defaultAlias", done, (arg) => {
            expect(arg).to.equal("renderer");
        });
    });

    it("should use an alias defined in package.json", function (done) {
        pull("custom1", done, (arg) => {
            expect(arg).to.equal("custom");
        });
    });

    it("should use an alias defined in package.json with template strings", function (done) {
        pull("custom2", done, (arg) => {
            expect(arg).to.equal("custom");
        });
    });

    it("should set and use a custom alias", function (done) {
        pull("custom3", done, (arg) => {
            expect(arg).to.equal("custom");
        });
    });
});
