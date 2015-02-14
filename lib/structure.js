var _ = require('lodash'),
	yaml = require('js-yaml'),
	util = require('./util')
	Component = require('./component');

function StructureNode(name) {
	this.name = name;
	this.depth = 0;
	this._component = Component.get(name);
	this._children = [];
	this._parent = null;
}

StructureNode.Link = function(node, mount) {
	node._children.push(mount);
	mount.depth = node.depth + 1;
	mount._parent = node;
};

StructureNode.prototype.children = function() {
	return this._children;
};

StructureNode.prototype.depthFirst = function* () {
	yield this;

	for (var key in this._children) {
		yield* this._children[key].depthFirst();
	};
}


function Structure(name, structure) {
	this.name = name;
	this.structure = this.build(structure);
}

Structure.prototype.build = function(structure) {

	// iterates mounts, creates objects, links to parents
	function componentizer(obj, parent) {
		var node = new StructureNode(obj.component);
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

Structure.prototype.walk = function* () {
	for (var key in this.structure) {
		yield* this.structure[key].depthFirst(0);
	};
}

Structure.prototype.config = function(reducer, mapper) {
	_.reduce(this.structure, function(sum, node) {
		return reducer(sum, res);
	})
};

StructureNode.prototype.config = function() {
	var results = _.invoke(this._children, 'config');

	var obj = {
		component: this.name
	};
	obj = _.assign(obj, this._component.metadata('config'))
	return [obj, results];
};

Structure.prototype.yaml = function() {
	var config =
	_.flattenDeep(
		_.invoke(this.structure, 'config')
	);
	console.log(yaml.dump(config, {indent: 2}));
	return;

	var yamlstr = "";
	var indent = '..';
	var padding;
	for (var node of this.walk()) {
    	padding = _.repeat(indent, node.depth);
		yamlstr += `${padding}- ${node.name}:\n`;
		yamlstr += node._component.yaml('config').replace(/(?:\r\n|\r|\n|^)/g, function(match) { return `${match}${indent}${padding}`; });
		yamlstr += '\n';
		yamlstr += `${indent}${padding}mounts:\n`;
    }

    return yamlstr;
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