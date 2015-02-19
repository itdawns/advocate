#!/usr/bin/env node

var program = require('commander');

var generate = require('./lib/commands/generate')
var scaffold = require('./lib/commands/scaffold')

program
	.version('1.0.0')


program
	.command('scaffold')
	.description('Generate configuration files for a template, component or structure')
	.action(scaffold);

program
	.command('generate [path]')
	.description('Generate website')
	.action(generate);

program.on('*', function (command) {
    this.commands.some(function (command) {
      return command._name === process.argv[0];
    }) || this.help();
  })

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
