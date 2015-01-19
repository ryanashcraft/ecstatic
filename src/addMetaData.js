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

        var tailMetaData = new Buffer('\r\npath = "' + relativePathWithoutExtension + '"');
        file.contents = Buffer.concat([headMetaData, file.contents, tailMetaData]);
        cb(null, file);
    });
}

module.exports = addMetaData;
