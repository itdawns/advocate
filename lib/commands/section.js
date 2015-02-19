var loaders = require('../loaders');
var _ = require('lodash');

var inquirer = require('inquirer')
var util = require('../util');


// Scaffold Command
function section(arg) {

    util.setProjectDir(util.pathArg(arg), true);


    inquirer.prompt([{
        name: 'section',
        type: 'list',
        message: 'Pick a section to add',
        choices: function getchoices() {
            return ['a', 'b', 'c', 'e','f','g','aaa'];
        }
    }], function(answers) {
        if (answers.force) {
        }
    });


    return;
}

module.exports = section;