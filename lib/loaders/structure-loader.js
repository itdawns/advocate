var _ = require('lodash'),
    yaml = require('js-yaml');

var util = require('../util');
var Structure = require('../classes/structure');

var _structure = {

	_process_conf: function(file_contents) {

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

		file_contents = file_contents.replace(/\s*$/, '');

		return yaml.safeLoad(file_contents);
	},

	load: function(path) {
		path = path || 'config/components/';
		var _this = this;

		// load files in dir recursively
		return Promise.all([
				util.loaddir(path, /.ya?ml$/),
				util.loaddir(path, /.conf$/)
			]).then(function (results) {
				console.log(`Found ${_(results[0]).size() + _(results[1]).size()} Structures`);

				var data = _.assign(
					_.mapValues(results[0], yaml.safeLoad),
					_.mapValues(results[1], _this._process_conf));

				console.log(`Loaded ${_(data).size()} Structures`);

				_.forEach(data, function (v, key) {
					_this.set(new Structure(key, v));
				});

				return _this.all();
			});
	}
};

module.exports = _structure;