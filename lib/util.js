var nodedir = require('node-dir');

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
    }
};