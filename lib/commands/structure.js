var Structure = require('../structure');

function structure() {
    Structure.load().then(
        function win(loaded) {
            console.log('Loaded Structures');
            console.log(JSON.stringify(loaded, false, 4));
        }, 
        function fail(err) {
            console.error('Error Loading Structures: ', err);
        }
    );
}

module.exports = structure;