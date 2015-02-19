var nodedir = require('node-dir');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');


module.exports = {
    loaddir: function (root, ext) {
        return new Promise(function(resolve, reject) {
            var data = {};

            var onFile = function(err, content, filename, next) {
                if (err) return reject(err);

                data[filename.replace(root, '').replace(ext, '')] = content;
                next();
            }

            var onComplete = function(err, files) {
                if (err) return reject(err);

                return resolve(data);
            }

            nodedir.readFiles(root, { match: ext }, onFile, onComplete);
        });
    },


    // deals with commander parameter

    pathArg: function(arg) {
        if (_.isString(arg)) {
            return path.resolve(process.cwd(), arg);
        }

        return process.cwd();
    },

    // sets working directory for modification
    setProjectDir: function(dir, validate) {
        dir = this.pathArg(dir);

        if (!fs.existsSync(dir)) {
            console.log('Directory does not exist:  \'%s\'', dir);
            throw new Error("path not found")
        }

        process.chdir(dir);

        if (typeof validate !== 'undefined' && validate && !this.validateProjectDir()) {
            throw new Error('Your current directory is not an advocate project.')
        }

        return true;
    },

    // project directory structure
    scaffoldDirs: ['components', 'content', 'pages'],


    validateProjectDir: function() {
        var dirsExist = _(this.scaffoldDirs).every(function(dir) {
            return fs.existsSync(dir);
        });

        return dirsExist;
    },

    makeStructure: function() {
        console.log('Making Structure');
        // make dirs that don't exist
        _.forEach(this.scaffoldDirs, function (dir) {
            console.log(dir);
            if (fs.existsSync(dir) === false) {
                fs.mkdirSync(dir);
            }
        });
    },

    hasNothing: function() {
        return fs.readdirSync(process.cwd()).length === 0;
    }

};