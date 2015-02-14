var _ = require('lodash'),
    fs = require('fs'),
    Component = require('../component');


function compile(options) {        
    console.log('Compiling All Components');

    Component.load()
        .then(function(loaded) {
            var compiledsrc = _.map(loaded, function(v, k) {
                return "module.exports['"+k+"'] = " + v.source() + ";";
            });

            var path = __dirname + '/../../compiled/templates.js';
            console.log('Saving To: ' + path);

            fs.writeFileSync(path, compiledsrc.join("\n"));
            console.log('saved: ' + path);
        })
        .catch(function fail(err) {
            console.error('Error Loading Components:', err);
        });
};

module.exports = compile;