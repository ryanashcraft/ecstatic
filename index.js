'use strict';

var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');
var json3 = require('json3');
var PluginError = gutil.PluginError;
var React = require('react/addons');
var Bootstrap = require('./components/Bootstrap');

var PLUGIN_NAME = 'ecstatic';

function Ecstatic(options) {
    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
        }

        if (file.isBuffer()) {
            var contents = file.contents.toString();
            var parsed;
            try {
                parsed = json3.parse(contents);
            } catch (e) {
                cb(new gutil.PluginError(PLUGIN_NAME, 'Failed to parse ' + file.relative));
                return;
            }

            var relativePath = path.dirname(file.relative);
            var props = React.addons.update(
                parsed,
                {
                    __ecstatic: {
                        $set: {
                            relativePath: relativePath
                        }
                    },
                    global: {
                        $set: options.globalProps || {}
                    }
                }
            );

            var head = React.renderToStaticMarkup(React.createElement(options.headComponent, props));
            var body = React.renderToString(React.createElement(options.bodyComponent, props));
            var bootstrap = React.renderToStaticMarkup(React.createElement(Bootstrap, {
                props: props,
                componentName: options.bodyComponent.displayName
            }));

            var rendered = [
                '<!DOCTYPE html>',
                '<html>',
                head,
                '<body>',
                '<div id="ecstatic">',
                body,
                '</div>',
                bootstrap,
                '</body>',
                '</html>'
            ].join('');

            file.contents = new Buffer(rendered);
        }

        if (file.isStream()) {
            cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return;
        }

        var transformedPath = [path.dirname(file.path), path.basename(file.path, path.extname(file.path)) + '.html'].join(path.sep);
        file.path = transformedPath;

        cb(null, file);
    });
};

module.exports = Ecstatic;
