

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
    "05": true,
    "06": true,
    "07": true,
    "99.01": true
};


describe('cvdom', function() {

    const options = {
        "controlAttributes": {
            "prefix": "component:",
            "remove": true
        }
    };

    function compare (resultPath, chscript, controllingState) {

//console.log("result", result);
//process.stderr.write("[[[ " + JSON.stringify(result, null, 4) + " ]]]\n\n");

        var result = render(chscript, controllingState);
        var html = VTREE_TO_HTML(result);
        if (WRITE) {
            FS.writeFileSync(PATH.join(__dirname, resultPath + ".json"), JSON.stringify(result, null, 4), "utf8");
            FS.writeFileSync(PATH.join(__dirname, resultPath + ".chscript.js"), chscript, "utf8");
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
            options,
            function (err, chscript) {
                if (err) return done(err);
                compare("01-View/result-1", chscript, {
                    "$views": {
                        "default": true
                    }
                });
                compare("01-View/result-2", chscript, {
                    "$views": {
                    }
                });
                return done();
            }
        );
    });

    if (TESTS["02"])
    it('02-Views', function (done) {
        return CVDOM.html2hscript(
            FS.readFileSync(PATH.join(__dirname, "02-Views/template.htm"), "utf8").replace(/^\s*|\s*$/g, ""),
            options,
            function (err, chscript) {
                if (err) return done(err);
                compare("02-Views/result-1", chscript, {
                    "$views": {
                    }
                });
                compare("02-Views/result-2", chscript, {
                    "$views": {
                        "default": true
                    }
                });
                compare("02-Views/result-3", chscript, {
                    "$views": {
                        "alternative": true
                    }
                });
                compare("02-Views/result-4", chscript, {
                    "$views": {
                        "default": true,
                        "alternative": true
                    }
                });
                return done();
            }
        );
    });

    if (TESTS["03"])
    it('03-Section', function (done) {
        return CVDOM.html2hscript(
            FS.readFileSync(PATH.join(__dirname, "03-Section/template.htm"), "utf8").replace(/^\s*|\s*$/g, ""),
            options,
            function (err, chscript) {
                if (err) return done(err);
                compare("03-Section/result-1", chscript, {
                    "item": [
                        {
                            "$views": {
                                "default": true
                            },
                            "label": "Item 1"
                        },
                        {
                            "$views": {
                                "default": true
                            },
                            "label": "Item 2"
                        }
                    ]
                });
                return done();
            }
        );
    });

    if (TESTS["04"])
    it('04-Sections', function (done) {
        return CVDOM.html2hscript(
            FS.readFileSync(PATH.join(__dirname, "04-Sections/template.htm"), "utf8").replace(/^\s*|\s*$/g, ""),
            options,
            function (err, chscript) {
                if (err) return done(err);
                compare("04-Sections/result-1", chscript, {
                    "item": [
                        {
                            "$views": {
                                "default": true,
                                "active": false
                            },
                            "label": "Item 1"
                        },
                        {
                            "$views": {
                                "active": true
                            },
                            "label": "Item 2"
                        }
                    ]
                });
                return done();
            }
        );
    });

    if (TESTS["05"])
    it('05-SectionWithViews', function (done) {
        return CVDOM.html2hscript(
            FS.readFileSync(PATH.join(__dirname, "05-SectionWithViews/template.htm"), "utf8").replace(/^\s*|\s*$/g, ""),
            options,
            function (err, chscript) {
                if (err) return done(err);
                compare("05-SectionWithViews/result-1", chscript, {
                    "$views": {
                        "focus": true
                    },
                    "item": [
                        {
                            "$views": {
                                "default": true,
                                "active": false,
                                "focus": false
                            },
                            "label": "Item 1"
                        },
                        {
                            "$views": {
                                "active": true
                            },
                            "label": "Item 2"
                        },
                        {
                            "$views": {
                                "active": true,
                                "focus": false
                            },
                            "label": "Item 3"
                        }
                    ]
                });
                return done();
            }
        );
    });

    if (TESTS["06"])
    it('06-DataBasedAttributes', function (done) {
        return CVDOM.html2hscript(
            FS.readFileSync(PATH.join(__dirname, "06-DataBasedAttributes/template.htm"), "utf8").replace(/^\s*|\s*$/g, ""),
            {
                "controlAttributes": {
                    "prefix": "data-component-",
                    "remove": true
                }
            },
            function (err, chscript) {
                if (err) return done(err);
                compare("06-DataBasedAttributes/result-1", chscript, {
                    "$views": {
                        "focus": true
                    },
                    "item": [
                        {
                            "$views": {
                                "active": true
                            },
                            "label": "Item 1"
                        }
                    ]
                });
                return done();
            }
        );
    });

    if (TESTS["07"])
    it('07-InlineScripts', function (done) {
        return CVDOM.html2hscript(
            FS.readFileSync(PATH.join(__dirname, "07-InlineScripts/template.htm"), "utf8").replace(/^\s*|\s*$/g, ""),
            {
                "controlAttributes": {
                    "prefix": "data-component-",
                    "remove": true,
                    "scriptLocations": {
                        "window": true
                    }
                }
            },
            function (err, chscript, components, inlineScripts) {
                if (err) return done(err);
                var context = {};
                var scriptFunc = new Function ("context", inlineScripts[0].code);
                scriptFunc(context);
                var controllingState = context.getData();
                compare("07-InlineScripts/result-1", chscript, controllingState);
                return done();
            }
        );
    });


    if (TESTS["99.01"])
    it('99-ZeroSystem-01', function (done) {
        return CVDOM.html2hscript(
            FS.readFileSync(PATH.join(__dirname, "99-ZeroSystem-01/template.htm"), "utf8").replace(/^\s*|\s*$/g, ""),
            {
                "controlAttributes": {
                    "prefix": "data-component-",
                    "remove": true,
                    "scriptLocations": {
                        "window": true
                    }
                }
            },
            function (err, chscript, components, inlineScripts) {
                if (err) return done(err);
                compare("99-ZeroSystem-01/result-1", chscript, {
                    "$anchors": function (name) {
                        var h = LIB.h;
                        var ch = null;
                        if (name === "filter") {
                            ch = LIB.ch({
                                "options": "[Options 1, Options 2, Options 3]"
                            });
                        } else
                        if (name === "table") {
                            ch = LIB.ch({
                                "row": [
                                    {
                                        "$views": {
                                            "default": true
                                        },
                                        "title": "Item 1",
                                        "url": "http://test.com/item1"
                                    },
                                    {
                                        "$views": {
                                            "default": true
                                        },
                                        get: function (name) {
                                            if (name === "title") return "Item 2";
                                            return "";
                                        }
                                    }                                    
                                ]
                            });
                        }
                        return eval(components[name].chscript);
                    }
                });
                compare("99-ZeroSystem-01/result-2", components["filter"].chscript, {
                    "options": "[Options 1, Options 2]"
                });
                compare("99-ZeroSystem-01/result-3", components["table"].chscript, {
                    "row": [
                        {
                            "$views": {
                                "default": true
                            },
                            "title": "Item 1",
                            "url": "http://test.com/item1"
                        }
                    ]
                });
                return done();
            }
        );
    });

});
