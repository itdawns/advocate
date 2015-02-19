var _ = require('lodash'),
	yaml = require('js-yaml');

var loaders = require('../loaders');

function Structure(name, structure) {
	console.log('Structure Constructor ', name);
	this.name = name;
	this.structure = this.build(structure);
}

Structure.prototype.build = function(structure) {

	// iterates mounts, creates objects, links to parents
	function componentizer(obj, parent) {
		var node = new StructureNode().wrapComponent(obj.component);
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

// Structure.prototype.config = function(reducer, mapper) {
// 	_.reduce(this.structure, function(sum, node) {
// 		return reducer(sum, res);
// 	})
// };

Structure.prototype.yaml = function() {

	var yamlstr = "";
	var indent = '..';
	var padding;

	for (var node of this.walk()) {
    	padding = _.repeat(indent, node.depth);
		yamlstr += `${padding}- ${node.name}:\n`;
		yamlstr += node._renderable.yaml('config').replace(/(?:\r\n|\r|\n|^)/g, function(match) { return `${match}${indent}${padding}`; });
		yamlstr += '\n';
		yamlstr += `${indent}${padding}mounts:\n`;
    }

    return yamlstr;
};


module.exports = Structure;



function StructureNode() {
	this.depth = 0;
	this._children = [];
	this._parent = null;
}

StructureNode.prototype.wrapComponent = function(name) {
	this.name = name;
	// this._renderable = loaders.Components.get(name);
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

StructureNode.prototype.config = function() {
	var results = _.invoke(this._children, 'config');

	var obj = {
		component: this.name
	};
	obj = _.assign(obj, this._renderable.metadata('config'))
	return [obj, results];
};