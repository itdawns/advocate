var Structure = require('../structure'),
    Component = require('../component')
	_ = require('lodash');

function structure() {
    Component.load()
    	.then(Structure.load)
    	.then(function win(structures) {
            console.log(`Loaded ${_.size(structures)} Structures: [${ _.keys(structures).join(', ') }]`);

            for (var key in structures) {
            	console.log(structures[key].yaml());
            }

    	}).catch(function fail(err) {
            console.error('Error Loading Structures: ', err);
        });
}

module.exports = structure;