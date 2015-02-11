var _ = require('lodash'),
	yaml = require('js-yaml'),
	loadDir = require('./load-dir'),
	Component = require('./component');

var templates = require('../compiled/templates');

function Structure(options) {
	this.name = options.name;
	this.structure = options.structure;
}

Structure.prototype.componentTree = function() {
	
	// iterate the mounted component and 
	function componentProps(component) {		
		var name;
		var children = _.first(component, function(prop, key) {			
			name = key;
			return mountwalker(prop);
		});
		return new Component({
			name: name,
			children: children
		});
	}
	
	// iterate the array of mounts
	function mountwalker(arr) {
		return _.map(arr, function(component) {
			return componentProps(component);
		});
	}

	return mountwalker(this.structure);
}

Structure.prototype.renderer = function() {
	return _renderer(this.structure);
}


var _renderer = function(arr, name) {
	var deeper = _.map(arr, function (obj, index) {
		return _.mapValues(obj, _renderer);
	});


	return function() {
		var inner = _.reduce(deeper, function(res1, obj) { 
			return res1.concat(_.reduce(obj, function(res2, fn) {				
				return res2.concat(fn());
			}, ""));
		}, "");
		
		if (_.isUndefined(name)) 
			return inner;

		return templates[name]({ mountpoint: inner });
	}
};

var Loader = {
	loaddir: function(options, cb) {
		if (_.isUndefined(cb)) {
			cb = options;
			options = {};
		}

		options = _.defaults(options, {
			path: 'config/components/',
			ext: /.yaml$/,
		});

		
		var onLoaded = function(data) {
			return _.mapValues(data, function (src, path) {
				var _options = _.assign({name: path}, Loader.process(src));

				return new Structure(_options);
			});
	    }

		loadDir(options.path, options.ext, _.flow(onLoaded, cb));
	},

	process: function(src) {
		return {
			structure: yaml.safeLoad(src)
		};
	},
}

module.exports = Structure;
module.exports.Loader = Loader;