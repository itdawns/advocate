var loaders = require('../loaders');
var util = require('../util');
var _ = require('lodash');

var inquirer = require('inquirer')


// Scaffold Command
function scaffold(arg) {

    util.setProjectDir(util.pathArg(arg));

    if ( util.validateProjectDir() || util.hasNothing() ) {
        return util.makeStructure();
    }

    inquirer.prompt([{
        name: 'force',
        type: 'confirm',
        message: 'Directory not empty, continue anyways?'
    }], function(answers) {
        if (answers.force) {
            util.makeStructure();
        }
    });


    return;


}

module.exports = scaffold;





