
var h = require('mercury').h;
var TodoApp = require('./todo-app.js');

module.exports = renderTable;

function renderTable(state, listState) {
    return h('div', {}, [
        TodoApp.render(state, listState)
    ]);
}
