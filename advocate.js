#!/usr/bin/env node

var program = require('commander');

var scaffold = require('./lib/commands/scaffold')
var section = require('./lib/commands/section')
var generate = require('./lib/commands/generate')

program
	.version('1.0.0')


program
	.command('scaffold')
	.description('Generate configuration files for a template, component or structure')
	.action(scaffold);

program
	.command('section')
	.description('Add templates and sections to your project ')
	.action(section);

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
