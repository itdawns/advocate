var path = require('path');
var dir = require('node-dir');

module.exports = {

	load: function (root, ext, cb) {
		var data = {};

		dir.readFiles(root, { match: ext}, 
			function onFile(err, content, filename, next) {				
		        if (err) throw err;		        
		        data[filename.replace(root, '').replace(ext, '')] = content;
		        next();
		    },
		    function onComplete(err, files) {
		        if (err) throw err;		        
                cb(null, data);
		    });
	}
};