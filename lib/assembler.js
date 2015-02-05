var _ = require('lodash');
var yaml = require('js-yaml');

function Assembler() {
	_.templateSettings.interpolate = /{{=([\s\S]+?)}}/g;
	_.templateSettings.evaluate = /{{([\s\S]+?)}}/g;
	_.templateSettings.escape = /{{-([\s\S]+?)}}/g;
	_.templateSettings.variable = 'data';
	
	this.meta = {};
}

Assembler.prototype.stripMeta = function(src, key) {	
	var configRegex = /<\?([\s\S]+?)\?>/g;

	var template = src.replace(configRegex, function replace(match, config) {
		this.meta[key] = yaml.safeLoad(config);
	}.bind(this))

	return template;
};

Assembler.prototype.compile = function(src) {
	var self = this;
	this.components = _(src)
		.map(function(k, v) { this.stripMeta(k, v) }.bind(self))
		.map(_.template).value();

};

Assembler.prototype.config = function(src) {
	this.config = _(src).map(yaml.safeLoad);
	console.log(this.config);
}

Assembler.prototype.newConfig = function() {
	console.log(this.meta);
	var flat = _(this.meta).flatten().value();
	console.log(flat);
}

Assembler.prototype.assemble = function() {

	// _(this.config).map(function(v, k) {
	// 	self.components[k]()
	// }).value();
};

module.exports = Assembler;