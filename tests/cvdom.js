

//process.env.CDEBUG = "info";


const PATH = require("path");
const FS = require("fs");
const _ = require("lodash");
const ASSERT = require("assert");
var CVDOM = require("..");
const LIB = CVDOM.makeLib();
CVDOM = CVDOM.forLib(LIB);


var TESTS = {
    "01": true,
    "02": true,
    "03": true,
    "04": true,
    "05": true
};


describe('cvdom', function() {

    if (TESTS["01"])
    it('01-View', function (done) {
        var cvdom = new CVDOM();
        return cvdom.parseFile(
            PATH.join(__dirname, "01-View/template.htm"),
            function (err) {
                if (err) return done(err);

                return done();
            }
        );
    });

});
