'use strict';

var path = require('path');
var json3 = require('json3');
var toml = require('toml');

function parse(file) {
    var extension = path.extname(file.path);

    switch(extension) {
        case '.json':
            return json3.parse(file.contents.toString());
        case '.toml':
            return toml.parse(file.contents.toString());
        default:
            throw new Error('Unsupported extension ' + extension);
    }
}

module.exports = parse;
