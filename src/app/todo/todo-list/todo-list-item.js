'use strict';

var hg = require('../../../../index.js');
var h = require('../../../../index.js').h;

var WeakmapEvent = require('../../../lib/weakmap-event.js');

var link = require('../../partials/link.js');

var DestroyEvent = WeakmapEvent();

ListItem.onDestroy = DestroyEvent.listen;
ListItem.setCompleted = function setCompleted(s, x) {
    s.completed.set(x);
};
ListItem.isCompleted = function isCompleted(s) {
    return s.completed();
};

module.exports = ListItem;

function ListItem(item) {
    var item = item || {};
    return hg.state({
        title: hg.value(item.title),
        editing: hg.value(item.editing || false),
        channels: {
            startEdit: startEdit,
            cancelEdit: cancelEdit,
            finishEdit: finishEdit
        }
    });
}

function startEdit(state) {
    state.editing.set(true);
}

function finishEdit(state, data) {
    if (state.editing() === false) {
        return;
    }

    state.editing.set(false);
    state.title.set(data.title);

    if (data.title.trim() === '') {
        DestroyEvent.broadcast(state, {
            id: state.id()
        });
    }
}

function cancelEdit(state) {
    state.editing.set(false);
}

ListItem.render = function render(state, listState, tableUri, defaultListName) {
    var listName = listState.title || defaultListName;
    return h( 'div', {}, [
        link(tableUri, listName, state.route === tableUri, listState)
    ])

};
