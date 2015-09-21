

//process.env.CDEBUG = "info";


const PATH = require("path");
const FS = require("fs");
const _ = require("lodash");
const ASSERT = require("assert");
var CVDOM = require("..");
const LIB = CVDOM.makeLib();
CVDOM = CVDOM.forLib(LIB);

const VTREE_TO_HTML = require('vdom-to-html');

const WRITE = true;

var TESTS = {
    "01": true,
    "02": true,
    "03": true,
    "04": true,
    "05": true
};


describe('cvdom', function() {
    
    function compare (resultPath, result) {

//console.log("result", result);
//process.stderr.write("[[[ " + JSON.stringify(result, null, 4) + " ]]]\n\n");

        var html = VTREE_TO_HTML(result);

        if (WRITE) {
            FS.writeFileSync(PATH.join(__dirname, resultPath + ".json"), JSON.stringify(result, null, 4), "utf8");
            FS.writeFileSync(PATH.join(__dirname, resultPath + ".htm"), html, "utf8");
        }
        ASSERT.deepEqual(
            JSON.parse(JSON.stringify(result)),
            JSON.parse(FS.readFileSync(PATH.join(__dirname, resultPath + ".json"), "utf8"))
        );
    }

    function render (chscript, controllingState) {
        var h = LIB.h;
        var ch = LIB.ch(controllingState);
        return eval(chscript);
    }

    if (TESTS["01"])
    it('01-View', function (done) {
        return CVDOM.html2hscript(
            FS.readFileSync(PATH.join(__dirname, "01-View/template.htm"), "utf8").replace(/^\s*|\s*$/g, ""),
            function (err, chscript) {
                if (err) return done(err);
                compare("01-View/result-1", render(chscript, {
                    "views": [
                        "default"
                    ]
                }));
                compare("01-View/result-2", render(chscript, {
                    "views": [
                    ]
                }));
                return done();
            }
        );
    });

    if (TESTS["02"])
    it('02-Views', function (done) {
        return CVDOM.html2hscript(
            FS.readFileSync(PATH.join(__dirname, "02-Views/template.htm"), "utf8").replace(/^\s*|\s*$/g, ""),
            function (err, chscript) {
                if (err) return done(err);
                compare("02-Views/result-1", render(chscript, {
                    "views": [
                    ]
                }));
                compare("02-Views/result-2", render(chscript, {
                    "views": [
                        "default"
                    ]
                }));
                compare("02-Views/result-3", render(chscript, {
                    "views": [
                        "alternative"
                    ]
                }));
                compare("02-Views/result-4", render(chscript, {
                    "views": [
                        "default",
                        "alternative"
                    ]
                }));
                return done();
            }
        );
    });

    if (TESTS["03"])
    it('03-Section', function (done) {
        return CVDOM.html2hscript(
            FS.readFileSync(PATH.join(__dirname, "03-Section/template.htm"), "utf8").replace(/^\s*|\s*$/g, ""),
            function (err, chscript) {
                if (err) return done(err);
                compare("03-Section/result-1", render(chscript, {
                }));
                return done();
            }
        );
    });


});
