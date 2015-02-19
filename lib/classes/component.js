var _ = require('lodash'),
	yaml = require('js-yaml')

// Component Class
function Component(options) {
	this.options = _.defaults(options, this._defaults);
}

Component.prototype._defaults = {
	metadata: null,
};

Component.prototype.metadata = function(key) {
	var obj = this.options.metadata;

	if (typeof key !== 'undefined' && typeof this.options.metadata[key] !== 'undefined') {
		obj = this.options.metadata[key]
	}

	if (_.size(obj) == 0)
		return {};

	return obj;
}

Component.prototype.yaml = function(key) {
	return yaml.safeDump(obj).trim();
}

Component.prototype.source = function() {
	return this.options.template.source;
}

Component.prototype.render = function() {
	return this.options.template(arguments);
}

module.exports = Component;


// Generates a JS module of component templates
// function _export(components) {
//     var compiledsrc = _.map(components, function(v, k) {
//         return "module.exports['"+k+"'] = " + v.source() + ";";
//     });

//     var path = __dirname + '/../../compiled/templates.js';
//     console.log('Saving To: ' + path);

//     fs.writeFileSync(path, compiledsrc.join("\n"));
//     console.log('saved: ' + path);
// }