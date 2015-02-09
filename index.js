// Script Entry Points

var yaml = require('js-yaml');

var commands = {

    // node index.js render ...        
    compile: function(options) {        
        console.log('Compiling All Components');

        require('./lib/component').loadAll(function(err, loaded) {
            //console.log(loaded);
            console.log(yaml.dump(loaded))
        });
    },

    // node index.js render ...
    render: function() {
        console.log('Render');
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
