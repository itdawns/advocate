var _ = require('lodash'),
    yaml = require('js-yaml');

var util = require('../util');
var Component = require('../classes/component');

module.exports = {

	_process: function(data) {
		// Split the YAML Header and Template Body
		var res = new Object();
		var regex = /<\?([\s\S]+?)\?>/g;

		var src = data.replace(regex, function (match, metadata) {
			res.metadata = yaml.safeLoad(metadata);
			return '';
		});

		res.template = _.template(src.trim());

		return res;
	},

	load: function(path) {
		path = path || 'components/';
		var ext = /.html$/;

		var _this = this;
		return Promise.all([
			util.loaddir(path, ext)
		]).then(function(data) {
			data = data[0];
			console.log(`Found ${_(data).size()} Components`)

			_(data)
				.mapValues(_this._process)
				.forEach(function(obj, key) {
					_this.set(key, new Component(obj));
				});

			return _this.all();
		});
	},

};