'use strict';

var h = require('../../../index').h;

var styles = require('../styles/styles.js');

var rafListen = require('../../lib/raf-listen.js');
var localStorage = window.localStorage;
var partial = require("vdom-thunk");
var TodoApp = require('./todo-app/todo-app');

var Router = require('../../lib/router/index');

var routeView = Router.render;

var menu = require('./todo-list/todo-list.js');
var renderTable = require('./todo-app/todo-table');

module.exports = TodoComponent;


function TodoComponent(localStorageName) {
    var storedState = localStorage.getItem(localStorageName);
    var initialState = storedState ? JSON.parse(storedState) : null;

    var todoApp = TodoApp(initialState);

    rafListen(todoApp, function onChange(value) {
        localStorage.setItem(localStorageName,
            JSON.stringify(value));
    });

    return todoApp;
}

function renderBase() {
    return h('div', {
        className: 'welcome-todo'
    }, 'Welcome to ToDo list!');
}

TodoComponent.render = function(state, state2, listState, listState2) {
    console.log('todocomp render');
    return h('div', {}, [
        h('aside.sidebar', {}, [
            partial(menu, state, state2, listState, listState2)
        ]),
        h('main', {
            style: {
                float: 'right',
                width: '60%'
            }
        }, [
            routeView({
                '/app': renderBase.bind(this),
                '/app/table1': renderTable.bind(this, state, listState),
                '/app/table2': renderTable.bind(this, state2, listState2)
              //  '/app/table3': renderTable.bind(this, state, 'List 3')
            }, state)
        ])
    ]);
};
