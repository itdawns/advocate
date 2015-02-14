
var _ = require('lodash');
var commands = require('./lib/commands');

// Proxy The Command into ./lib/commands

// Args
var argv = require('minimist')(process.argv.slice(2));
var cmd = argv['_'][0];

// Valid Command?
if (typeof cmd !== 'string' || typeof commands[cmd] !== 'object') {
    cmd = 'help';
}

return commands[cmd].run(argv);