
var h = require('../../../index').h;
var TodoApp = require('./todo-app.js');

module.exports = renderTable;

function renderTable(state, listName) {
    return h('div', {}, [
        TodoApp.render(state, listName)
    ]);
}
