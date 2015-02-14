var _ = require('lodash'),
	yaml = require('js-yaml'),
	util = require('./util')
	Component = require('./component');

var templates = require('../compiled/templates');

function StructureNode(component) {
	this._component = component;
	this._children = [];
	this._parent = null;
}

StructureNode.Link = function(node, mount) {
	node._children.push(mount);
	mount._parent = node;
};

StructureNode.prototype.children = function() {
	return this._children;
};


function Structure(name, structure) {
	this.name = name;
	this.structure = this.build(structure);
}

Structure.prototype.build = function(structure) {
	
	// iterates mounts, creates objects, links to parents
	function componentizer(obj, parent) {
		var node = new StructureNode(Component.get(obj.component));
		parent && StructureNode.Link(parent, node);

		_.forEach(obj.mounts, function(mount) {
			componentizer(mount, node);
		})

		return node;
	}

	// 1. we begin with an array of mounts...	
	return _.map(structure, function(mount) {
		return componentizer(mount, null);
	});
}



// todo wtf dunno??
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

function load(options) {
	path = options && options.path || 'config/components/';
	ext = options && options.ext || /.yaml$/;

	// load files in dir recursively
	return util.loaddir(path, ext)
		.then(function (files) {
			// build structure trees from each file;
			return _.mapValues(files, function (file_contents, name) {
				return new Structure(name, yaml.safeLoad(file_contents));
			});
		});
}

module.exports = Structure;
module.exports.load = load;