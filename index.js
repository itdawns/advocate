// Script Entry Points

var _ = require('lodash'),
    yaml = require('js-yaml'),
    Component = require('./lib/component'),
    Structure = require('./lib/structure'),
    fs = require('fs');

var commands = {
    
    compile: function(options) {        
        console.log('Compiling All Components');

        Component.Loader.loaddir(function(loaded) {
            var src = _.map(loaded, function(v, k) {
                return "module.exports['"+k+"'] = " + v.source() + ";";
            });

            var path = __dirname + '/compiled/templates.js';
            fs.writeFile(path, src.join("\n"), function(err) {
                if (err) throw err;

                console.log('saved: ' + path);
            });
        })
    },

    // node index.js render ...
    render: function() {
        _.map(templates, function(v, k) {
            console.log(v());
        });
    },

    // structure
    structure: function() {
        Structure.Loader.loaddir(function(loaded) {
            console.log(JSON.stringify(loaded, false, 4));

            var renderer = loaded['navbar'].renderer();
            console.log(renderer());

            // console.log(JSON.stringify(loaded['navbar'].componentTree(), false, 4));
        });
    },

    // node index.js config ...
    config: function() {
        console.log('Config');
    },
}


// Args
var argv = require('minimist')(process.argv.slice(2));


// Does the command exist?
if (typeof commands[argv['_'][0]] === 'function') {
    return commands[argv._[0]](argv);
} else {
    console.log('Invalid Command "' + argv['_'][0] + '"');    
}


var assembler = new Assembler();


var async = require('async');
var Assembler = require('./lib/assembler');

// feed components into assembler to compile
function loadComponents(done) {
    
}

// feed configs into assembler
function loadConfigs(done) {

}

// assemble shit
function assemble() {
    assembler.newConfig();
    return assembler.assemble();
}

//Load
async.parallel([loadComponents, loadConfigs], assemble);
