var rafListen = require('../../lib/raf-listen.js');
var localStorage = window.localStorage;
var ListItem = require('./todo-list/todo-list-item.js');


module.exports = ListItemsComponent;


function ListItemsComponent(localStorageName) {
    var storedState = localStorage.getItem(localStorageName);
    var initialState = storedState ? JSON.parse(storedState) : null;

    var listItem = ListItem(initialState);

    rafListen(listItem, function onChange(value) {
        localStorage.setItem(localStorageName,
            JSON.stringify(value));
    });

    return listItem;
}