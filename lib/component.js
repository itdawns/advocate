var _ = require('lodash'),
	yaml = require('js-yaml')

// Component Class
function Component(options) {
	this.options = _.defaults(options, this._defaults);
}

_.assign(Component.prototype, {
	constructor: Component,

	_defaults: {
		name: "",
		metadata: {},
	},
	metadata: function(key) {
		var obj = this.options.metadata;

		if (typeof key !== 'undefined' && typeof this.options.metadata[key] !== 'undefined') {
			obj = this.options.metadata[key]
		}

		if (_.size(obj) == 0)
			return {};

		return obj;
	},
	yaml: function(key) {
		return yaml.safeDump(obj).trim();
	},
	source: function() {
		return this.options.template.source;
	},
	render: function() {
		this.options.template(arguments);
	}
});

// Component Loader

var Loader = {
	_components: {},

	get: function(name) {
		return Loader._components[name];
	},

	load: function(options) {
		path = options && options.path || 'components/';
		ext = options && options.ext || /.html$/;


		return new Promise(function (resolve, reject) {
			require('./util').loaddir(path, ext).then(function(data) {
				var output = _.mapValues(data, function (src, path) {
					var _options = _.assign({name: path}, Loader.process(src));

					Loader._components[path] = new Component(_options);
					return Loader.get(path);
				});
				resolve(output);
		    }, reject);
		});
	},

	process: function(data) {
		// Split the YAML Header and Template Body
		var res = new Object();
		var regex = /<\?([\s\S]+?)\?>/g;

		var src = data.replace(regex, function (match, metadata) {
			res.metadata = yaml.safeLoad(metadata);
			return '';
		});

		res.template = _.template(src.trim());

		return res;
	},
};


module.exports = Component;
module.exports.load = Loader.load;
module.exports.get = Loader.get;