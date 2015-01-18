'use strict';

var React = require('react/addons');
var json3 = require('json3');

var Bootstrap = React.createClass({
    render: function render() {
        return React.createElement(
            'script',
            {
                dangerouslySetInnerHTML: {
                    __html: [
                        'window.Ecstatic = {};',
                        'window.Ecstatic.props=' + json3.stringify(this.props.props) + ';',
                        'document.addEventListener(\'DOMContentLoaded\', function() {',
                            'React.render(React.createElement(window.Components.' + this.props.componentName + ', window.Ecstatic.props), document.querySelector(\'#ecstatic\'))',
                        '});'
                    ].join('')
                }
            }
        );
    }
});

module.exports = Bootstrap;
