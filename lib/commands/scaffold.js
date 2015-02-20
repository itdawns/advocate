var loaders = require('../loaders');
var util = require('../util');
var _ = require('lodash');

var inquirer = require('inquirer')
var fs = require('fs');

// Scaffold Command
function scaffold(arg) {

    var dir = util.pathArg(arg);

    if (!fs.existsSync(dir))
        fs.mkdirSync(dir);

    util.setProjectDir(dir);

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





