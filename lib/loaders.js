var _ = require('lodash');

// Base Loader
function Loader() {
	this._loaded = new Object;
}

Loader.prototype.set = function(key, value) {
	return this._loaded[key] = value;
}

Loader.prototype.get = function(key) {
	return this._loaded[key];
}

Loader.prototype.all = function() {
	return this._loaded;
}

Loader.prototype.load = function() {
	throw new Error("Custom Loader requires a 'load' method");
}

module.exports = _.memoize(function(loader) {
	var _loader = require(`./loaders/${loader}-loader.js`);

	function proto() {
		Loader.call(this);
	}
	proto.prototype = _.create(Loader.prototype, _loader);

	return new proto();
});