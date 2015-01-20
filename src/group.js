'use strict';

var path = require('path');
var through = require('through');
var gutil = require('gulp-util');
var json3 = require('json3');
var parse = require('./parse');

var PLUGIN_NAME = 'ecstatic';

function Group(name, groupFunction) {
    var data = [];
    var firstFile;

    function processEndStream() {
        var groups = groupFunction(data, firstFile);

        if (Array.isArray(groups)) {
            groups.forEach(function forEachGroup(group) {
                this.push(group);
            }.bind(this));
        } else {
            this.push(groups);
        }
    }

    function processFile(file) {
        if (!firstFile) {
            firstFile = file;
            var transformedPath = [path.dirname(file.path), name + '.json'].join(path.sep);
            firstFile.path = transformedPath;
        }

        data.push(json3.parse(file.contents.toString()));
    }

    return through(processFile, processEndStream)
}

module.exports = Group;
