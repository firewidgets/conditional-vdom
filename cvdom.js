

exports.makeLib = function () {
    return {
        path: require("path"),
        fs: require("fs"),
        _: require("lodash"),
        cvdom: exports,
        html2hscript: require("../html2hscript"),
        h: require("virtual-dom/h"),
        ch: require("./ch")
    }
}


exports.forLib = function (LIB) {

    function html2hscript (html, callback) {

        return LIB.html2hscript(html, function (err, chscript) {

            return callback(null, chscript);
        });
    }

    return {
        html2hscript: html2hscript
    };
}

