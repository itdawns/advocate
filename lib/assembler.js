var _ = require('lodash');

function Assembler() {

}

Assembler.prototype.loadComponent = function(data) {
	var self = this;
	this.components = _(data)
		.map(function(k, v) { this.stripMeta(k, v) }.bind(self))
		.map(_.template).value();

};

Assembler.prototype.assemble = function() {

	// _(this.config).map(function(v, k) {
	// 	self.components[k]()
	// }).value();
};

module.exports = Assembler;