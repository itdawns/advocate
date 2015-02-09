var _ = require('lodash'),
	yaml = require('js-yaml');
	loader = require('./loader');


function Component(options) {	
	this.options = options;
}


Component.prototype.render = function() {
	this.options.template(arguments);
};


Component.fromString = function(src, name) {

	var options = {
		name: name
	};
	var meta = "";

	// Extract the YAML Header
	var configRegex = /<\?([\s\S]+?)\?>/g;
	src = src.replace(configRegex, function (match, metasrc) {
		meta = metasrc;
	});

	//parse the yaml
	options.meta = yaml.safeLoad(meta) || new Object();

	//parse the template
	// options.template = _.template(src);

	//return a new component
	return new Component(options);
};


Component.loadAll = function(done) {
	loader.load('components/', /.html$/, function templates(err, strings) {
        if (err) throw err;
        var c = _(strings).map(Component.fromString).value();
        done(null, c);
    });
};


module.exports = Component;