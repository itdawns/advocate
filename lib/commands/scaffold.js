var loaders = require('../loaders');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var inquirer = require('inquirer')


// Scaffold Command
function scaffold(args) {

    var dir = fixPathArg(args);

    var success = setProjectDir(dir);

    var hasStructure = hasProjectStructure();

    var prompt = false;

    if ( hasProjectStructure() || hasNothing() ) {
        return makeStructure();
    }

    inquirer.prompt([{
        name: 'force',
        type: 'confirm',
        message: 'Directory not empty, continue anyways?'
    }], function(answers) {
        if (answers.force) {
            makeStructure();
        }
    });


    // layoutProjectStructure(process.cwd());

    return;


    Promise.all([
        loaders('structure').load(),
        loaders('component').load(),
    ])
    .then(function (loaded) {
        console.log('Ready')
        var components = loaded[0],
            structures = loaded[1];


        _(structures).tap(console.log).invoke('yaml').tap(console.log).value();

	}).catch(function(error) {
        console.error(error.stack);
    })
}

module.exports = scaffold;




// deals with commander parameter
function fixPathArg(arg) {
    if (_.isString(arg)) {
        return path.resolve(process.cwd(), arg);
    }

    return process.cwd();
}

function setProjectDir(path) {

    if (!fs.existsSync(path)) {
        console.log('Directory does not exist:  \'%s\'', path);
        throw new Error("path not found")
    }

    process.chdir(path);

    return true;
}

// project directory structure
var scaffoldDirs = ['components', 'content', 'pages'];


function hasProjectStructure() {
    var dirsExist = _(scaffoldDirs).every(function(dir) {
        return fs.existsSync(dir);
    });

    return dirsExist;
}


function hasNothing() {
    return fs.readdirSync(process.cwd()).length === 0;
}


function makeStructure() {
    console.log('Making Structure');
    // make dirs that don't exist
    _.forEach(scaffoldDirs, function (dir) {
        console.log(dir);
        if (fs.existsSync(dir) === false) {
            fs.mkdirSync(dir);
        }
    });
}