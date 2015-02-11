var path = require('path');
var nodedir = require('node-dir');

module.exports = function (root, ext, done) {
	var data = {};
	
	var onFile = function(err, content, filename, next) {				
        if (err) throw err;		        
        data[filename.replace(root, '').replace(ext, '')] = content;
        next();
    }

    var onComplete = function(err, files) {
    	if (err) throw err;

    	done(data);
    }

	nodedir.readFiles(root, { match: ext }, onFile, onComplete);
}