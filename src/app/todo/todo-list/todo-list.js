
var h = require('../../../../index').h;
var link = require('../../partials/link.js');
var ListItem = require('./todo-list-item.js');

var ROOT_URI = String(document.location.pathname);

var TABLE1_URI = ROOT_URI + '/table1';
var TABLE2_URI = ROOT_URI + '/table2';
var TABLE3_URI = ROOT_URI + '/table3';

module.exports = menu;

function menu(state, state2, listState, listState2) {
    return h('ul', [
        ListItem.render(state, listState, TABLE1_URI),
        ListItem.render(state, listState2, TABLE2_URI)
    ]);
}