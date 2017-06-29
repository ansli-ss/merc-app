
var h = require('../../../index.js').h;
var hg = require('../../../index.js');
var Router = require('../../lib/router/index');
var FocusHook = require('../../lib/focus-hook.js');
var ESCAPE = 27;

module.exports = link;

function link(uri, text, isSelected, listState) {
    var className = (listState.editing ? 'editing' : '');
    return h('li', {className: className}, [
        Router.anchor({
            className: isSelected ? 'selected' : '',
            href: uri,
            'ev-dblclick': hg.send(listState.channels.startEdit)
        }, text),
        h('input.list-edit', {
            value: listState.title,
            name: 'title',
            'ev-focus': listState.editing ? FocusHook() : null,
            'ev-keydown': hg.sendKey(
                listState.channels.cancelEdit, null, {key: ESCAPE}),
            'ev-event': hg.sendSubmit(listState.channels.finishEdit),
            'ev-blur': hg.sendSubmit(listState.channels.finishEdit)
        })
    ]);
}