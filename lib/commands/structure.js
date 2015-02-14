var Structure = require('../structure'),
	_ = require('lodash');

function structure() {
    Structure.load()
    	.then(function win(structures) {
            console.log(`Loaded ${_.size(structures)} Structures: [${ _.keys(structures).join(', ') }]`);

            for (var structure in structures) {            	
	            for (var node of structures[structure].depthFirst()) {
	            	var str = _.repeat(' ', node.depth) + node.node.name;
            		console.log(str);
	            }
            }

    	}).catch(function fail(err) {
            console.error('Error Loading Structures: ', err);
        });
}

module.exports = structure;