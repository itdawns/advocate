var _ = require('lodash'),
	yaml = require('js-yaml'),
	Component = require('./component');

var templates = require('../compiled/templates');

function Structure(options) {
	this.name = options.name;
	this.structure = options.structure;
}

Structure.prototype.componentTree = function() {
	
	// iterate the mounted component and 
	function componentizer(obj) {
		var mounts = _.map(obj.mounts, componentizer);

		var component = new Component({
			name: obj.component,
		});
		_.map(mounts, function(v) { return component.mount(v); });
		return component;
	}

	// 1. we begin with an array of mounts...
	return _.map(this.structure, componentizer);
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
	load: function (options) {
		path = options && options.path || 'config/components/';
		ext = options && options.ext || /.yaml$/;

		return new Promise(function (resolve, reject) {
			require('./util').loaddir(path, ext).then(function(data) {
				//Create Structure Object
				var structureObjects = _.mapValues(data, function (src, path) {
					var _options = _.assign({name: path}, Loader.process(src));

					return new Structure(_options);
				});
				resolve(structureObjects);
			}, reject);
		})
	},

	process: function(src) {
		return {
			structure: yaml.safeLoad(src)
		};
	},
}

module.exports = Structure;
module.exports.load = Loader.load;