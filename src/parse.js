'use strict';

var path = require('path');
var json3 = require('json3');
var toml = require('toml');
var yaml = require('js-yaml');

function parse(file) {
    var extension = path.extname(file.path);

    switch(extension) {
        case '.json':
            return json3.parse(file.contents.toString());
        case '.toml':
            return toml.parse(file.contents.toString());
        case '.md':
        case '.markdown':
            return parseMarkdown(file);
        default:
            throw new Error('Unsupported extension ' + extension);
    }
}

function parseMarkdown(file) {
    var s = file.contents.toString();
    var delimeter = '---';
    var frontMatterStartDelIndex = s.indexOf(delimeter);
    var frontMatterStopDelIndex = s.indexOf(delimeter, delimeter.length);

    if (
        frontMatterStartDelIndex === -1 ||
        frontMatterStopDelIndex === -1 ||
        frontMatterStopDelIndex <= frontMatterStartDelIndex
    ) {
        throw new Error('Failed to parse ' + file.relative + ' (failed to parse YAML front matter)');
        return;
    }

    var frontMatter = s.substring(frontMatterStartDelIndex, frontMatterStopDelIndex);
    var data = yaml.load(frontMatter);
    var body = s.substring(frontMatterStopDelIndex + delimeter.length);
    data.body = body;

    return data;
}

module.exports = parse;
