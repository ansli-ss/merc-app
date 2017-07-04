
var h = require('mercury').h;
var link = require('../../partials/link.js');
var ListItem = require('./todo-list-item.js');

var ROOT_URI = String(document.location.pathname);

var TABLE1_URI = ROOT_URI + '/home-todo';
var TABLE2_URI = ROOT_URI + '/work-todo';

module.exports = menu;

function menu(homeState, workState, homeListState, workListState) {
    return h('ul', [
        ListItem.render(homeState, homeListState, TABLE1_URI, 'Home List'),
        ListItem.render(workState, workListState, TABLE2_URI, 'Work List')
    ]);
}