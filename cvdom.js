

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

    function html2hscript (html, options, callback) {

        return LIB.html2hscript(html, options, function (err, chscript, components, inlineScripts) {

            return callback(null, chscript, components, inlineScripts);
        });
    }

    return {
        html2hscript: html2hscript
    };
}

