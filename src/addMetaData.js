'use strict';

var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');
var json3 = require('json3');
var parse = require('./parse');

var PLUGIN_NAME = 'ecstatic';

function addMetaData(basePath, groupName) {
    return through.obj(function(file, enc, cb) {
        var filePath = file.path;
        var relativePath = filePath.replace(new RegExp('^' + basePath), '');
        var relativePathWithoutExtension = relativePath.replace(new RegExp(path.extname(relativePath) + '$'), '');
        var headMetaData = new Buffer('');

        if (groupName) {
            headMetaData = new Buffer('[[' + groupName + ']]\r\n');
        }

        var data = json3.parse(file.contents.toString());
        data.path = relativePathWithoutExtension;
        file.contents = new Buffer(json3.stringify(data));
        cb(null, file);
    });
}

module.exports = addMetaData;
