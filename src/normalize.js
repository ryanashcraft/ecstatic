'use strict';

var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');
var json3 = require('json3');
var parse = require('./parse');

var PLUGIN_NAME = 'ecstatic';

function normalize() {
    return through.obj(function(file, enc, cb) {
        var data = parse(file);
        file.contents = new Buffer(json3.stringify(data));
        var transformedPath = [path.dirname(file.path), path.basename(file.path, path.extname(file.path)) + '.json'].join(path.sep);
        file.path = transformedPath;
        cb(null, file);
    });
}

module.exports = normalize;
