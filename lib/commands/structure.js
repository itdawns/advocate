var Structure = require('../structure'),
	_ = require('lodash');

function structure() {
    Structure.load()
    	.then(function win(structures) {
            console.log(`Loaded ${_.size(structures)} Structures`);
            console.dir(structures);
            
    	}).catch(function fail(err) {
            console.error('Error Loading Structures: ', err);
        });
}

module.exports = structure;