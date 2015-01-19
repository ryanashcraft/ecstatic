'use strict';

var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');
var json3 = require('json3');
var parse = require('./parse');

var PLUGIN_NAME = 'ecstatic';

function Group(groupFunction) {
    return through.obj(function(file, enc, cb) {
        var parsed;

        try {
            parsed = parse(file);
        } catch (e) {
            cb(new gutil.PluginError(PLUGIN_NAME, 'Failed to parse ' + file.relative + ' (' + e.message + ')'));
        }

        var groups = groupFunction(parsed, file.path);

        groups.forEach(function forEachGroup(group, i) {
            var groupFile = file.clone();
            groupFile.path = group.path + '.json';
            groupFile.contents = new Buffer(json3.stringify(group));
            this.push(groupFile);
        }.bind(this));
    });
}

module.exports = Group;
