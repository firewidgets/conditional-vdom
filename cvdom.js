

exports.makeLib = function () {
    return {
        path: require("path"),
        fs: require("fs"),
        _: require("lodash"),
        cvdom: exports
    }    
}


exports.forLib = function (LIB) {

    const EVENTS = require("events");

    
    var CVDOM = function () {
        var cvdom = this;

        cvdom.parseFile = function (path, options, callback) {

            return callback(null);
        }
    }
    
    return CVDOM;
}
