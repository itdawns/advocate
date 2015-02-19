var _ = require('lodash');

// Base Loader
var _loader = {

	_loaded: {},

	set: function(key, value) {
		return this._loaded[key] = value;
	},

	get: function(key) {
		return this._loaded[key];
	},

	all: function() {
		return this._loaded;
	},

	load: function() {
		throw new Error("Method Not Implemented");
	}
}

module.exports = _.memoize(function(loader) {
	loader = require(`./loaders/${loader}-loader.js`);
	return _.defaults(loader, _loader);
});