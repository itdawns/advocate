var loaders = require('../loaders'),
	_ = require('lodash');

function generate() {

    console.log("Generate!");

    Promise.all([
            loaders('structure').load(),
            loaders('component').load(),
        ])
        .then(function (loaded) {
            console.log('Ready')
            var components = loaded[0],
                structures = loaded[1];


            _(structures).tap(console.log).invoke('yaml').tap(console.log).value();

        }).catch(function(error) {
            console.error(error.stack);
        })

}

module.exports = generate;