
var h = require('../../../index.js').h;
var Router = require('../../lib/router/index');

module.exports = link;

function link(uri, text, isSelected) {
    return h('li', [
        Router.anchor({
            className: isSelected ? 'selected' : '',
            href: uri
        }, text)
    ]);
}