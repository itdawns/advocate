var _ = require('lodash'),
    yaml = require('js-yaml'),
    Component = require('./component'),
    Structure = require('./structure'),
    fs = require('fs');

var commands = {
    help: {
        usage: 'displays this message.',
        run: function() {
            // print usage (ES6 template string)
            var usage = `\n\nAdvocate Usage: iojs advocate.js [COMMAND]\n${_.map(commands, function(v, k) { return `\n\t${k}: ${v.usage}`; }).join('') }\n`;
            console.log(usage);
        }
    },

    compile: {
        usage: 'compiles all components from ./components into ./compiled/templates.js',
        run: require('./commands/compile'),
    },

    // structure
    structure: {
        usage: 'structure',
        run: require('./commands/structure'),
    },

    // node index.js render ...
    render: {
        usage: 'render',
        run: function() {
            _.map(templates, function(v, k) {
                console.log(v());
            });
        },
    },

    // node index.js config ...
    config: {
        usage: 'config',
        run: function() {
            console.log('Config');
            Structure.load(function(loaded) {
                console.log(JSON.stringify(loaded['navbar'].componentTree(), false, 4));
            });
        },
    },
}
module.exports = commands;