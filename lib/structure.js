var yaml = require('js-yaml');


function Structure(options) {

}

Assembler.prototype.fromString = function(src) {
	// parse yaml string
	var options = yaml.safeLoad(src);	

	//return new object
	return new Structure(options)
}

Assembler.prototype.newConfig = function() {
	console.log(this.meta);
	var flat = _(this.meta).flatten().value();
	console.log(flat);
}

Structure.prototype.method_name = function(first_argument) {
	// body...
};

module.exports = Structure;