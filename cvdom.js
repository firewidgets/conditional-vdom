

exports.makeLib = function () {
    return {
        path: require("path"),
        fs: require("fs"),
        _: require("lodash"),
        cvdom: exports,
        html2hscript: require("html2chscript"),
        h: require("virtual-dom/h"),
        ch: require("./ch")
    }
}


exports.forLib = function (LIB) {

    function html2chscript (html, options, callback) {

        html = html.replace(/^\s*|\s*$/g, "");

        return LIB.html2hscript(html, options, function (err, chscript, components, inlineScripts) {
            if (err) return callback(err);

            var cjsCode = [];
            cjsCode.push('module.exports = {');
            cjsCode.push(  'getLayout: function () {');
            cjsCode.push(    'return {');
            cjsCode.push(      'buildVTree: function (h, ch) {');
            cjsCode.push(        'return ' + chscript + ';');
            cjsCode.push(      '}');
            cjsCode.push(    '};');
            cjsCode.push(  '},');
            cjsCode.push(  'getComponents: function () {');
            cjsCode.push(    'return {');
            Object.keys(components).forEach(function (id, i) {
                cjsCode.push(      (i>0?",":"") + '"' + id + '": {');
                cjsCode.push(        'buildVTree: function (h, ch) {');
                cjsCode.push(          'return ' + components[id].chscript + ';');
                cjsCode.push(        '}');
                cjsCode.push(      '}');
            });
            cjsCode.push(  '  };');
            cjsCode.push(  '},');
            cjsCode.push(  'getScripts: function () {');
            cjsCode.push('var scripts = {};');
            inlineScripts.forEach(function (inlineScript) {
                cjsCode.push('if (!scripts["' + inlineScript.id + '"]) { scripts["' + inlineScript.id + '"] = {}; }');
                cjsCode.push('scripts["' + inlineScript.id + '"]["' + inlineScript.location + '"] = function (exports) {');
                    cjsCode.push(inlineScript.code);
                cjsCode.push('};');
            });
            cjsCode.push('return scripts;');
            cjsCode.push(  '}');
            cjsCode.push('};');

            return callback(null, chscript, components, inlineScripts, cjsCode.join("\n"));
        });
    }

    return {
        html2chscript: html2chscript,

        // DEPRECATED
        html2hscript: html2chscript
    };
}

