var async = require('async');

var Loader = require('./lib/loader');
var Assembler = require('./lib/assembler');

var assembler = new Assembler();

function loadComponents(done) {
    Loader.load('components/', /.html$/, function templates(err, src) {
        if (err) throw err;

        assembler.compile(src);
        done();
    });
}

function loadConfigs(done) {
    Loader.load('./config', /.yaml$/, function configs(err, src) {
        if (err) throw err;    
        
        assembler.config(src);
        done();
    });
}

function assemble() {
    assembler.newConfig();
    return assembler.assemble();
}

async.parallel([loadComponents, loadConfigs], assemble);
