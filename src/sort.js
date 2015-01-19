'use strict';

var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');
var json3 = require('json3');
var parse = require('./parse');

var PLUGIN_NAME = 'ecstatic';

function Sort(sortFunction, outputName) {
    return through.obj(function(file, enc, cb) {
        var parsed;

        try {
            parsed = parse(file);
        } catch (e) {
            cb(new gutil.PluginError(PLUGIN_NAME, 'Failed to parse ' + file.relative + ' (' + e.message + ')'));
        }

        var sortedFiles = sortFunction(parsed);

        file.path = path.join(file.base, outputName);
        file.contents = new Buffer(json3.stringify(sortedFiles));
        cb(null, file)
    });
}

module.exports = Sort;
