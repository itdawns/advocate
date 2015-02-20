var loaders = require('../loaders');
var _ = require('lodash');

var inquirer = require('inquirer')
var util = require('../util');


// Scaffold Command
function section(arg) {

    util.setProjectDir(util.pathArg(arg), true);

    // Load all of the structures.


    load()
        .then(function(renderables) {

            var choices = [];

            _.forIn(renderables['structures'], function(value, key) {
                choices.push(`Structure ${choices.length}: ${key}`);
            });

            _.forIn(renderables['components'], function(value, key) {
                choices.push(`Component ${choices.length}: ${key}`);
            });


            console.dir(choices);

            inquirer.prompt([{
                name: 'section',
                type: 'list',
                message: 'Pick a section to add',
                choices: choices
            }], function(answers) {
                console.log(answers);
            });

        })
        .catch(function(error) {
            console.error(error.stack);
        });


    return;
}

function load()
{
    return Promise.all([
        loaders('component').load(),
        loaders('structure').load(),
    ])
    .then(function (loaded) {
        return {
            components: loaded[0],
            structures: loaded[1],
        };
    }).catch(function(error) {
        console.error(error.stack);
    })
}

module.exports = section;