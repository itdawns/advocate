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
	console.log(structure);
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

function txtReader(file_contents) {

	var lastdepth = 0;

	file_contents = file_contents.replace(/^\s*/gm, function(match) {
		var alteration = "";

		//If we move deeper, Add a 'mounts:' key linking from the current scope to the next scope

		if (match.length > lastdepth) {
			alteration = `${_.repeat(' ', lastdepth + 2)}mounts:\n`;
			lastdepth = match.length;
		}

		return alteration + `${match}- component: `;
	});

	console.log(file_contents);

	file_contents = file_contents.replace(/\s*$/, '');

	return yaml.safeLoad(file_contents);
}

function load(options) {
	path = options && options.path || 'config/components/';

	// load files in dir recursively
	return function (resolve, reject) {
		Promise.all([
			// console.log('hello'),
			util.loaddir(path, /.ya?ml$/),
			util.loaddir(path, /.txt$/)
		]).then(function (results) {
			// build structure trees from each file;
			var structsa = _.mapValues(results[0], function (file_contents, name) {
				return new Structure(name, yaml.safeLoad(file_contents));
			});


			var structsb = _.mapValues(results[1], function (file_contents, name) {
				return new Structure(name, txtReader(file_contents));
			});
			console.log(structsa);
			console.log(structsb['navbar2'].yaml());

			return _.assign(structsa, structsb);

		}).then(resolve, reject);
	}
}

module.exports = Structure;
module.exports.load = load;