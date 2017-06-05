'use strict';

var hg = require('../../../index');
var h = require('../../../index').h;

var styles = require('../styles/styles.js');

var rafListen = require('../../lib/raf-listen.js');
var localStorage = window.localStorage;

var TodoApp = require('./todo-app.js');

var Router = require('../../lib/router/index');

var routeView = Router.render;

module.exports = TodoComponent;

var ROOT_URI = String(document.location.pathname);

var TABLE1_URI = ROOT_URI + '/table1';
var TABLE2_URI = ROOT_URI + '/table2';
var TABLE3_URI = ROOT_URI + '/table3';

var RCSS = require('rcss');
RCSS.injectAll();

function TodoComponent() {
    var storedState = localStorage.getItem('todos-mercury@11');
    var initialState = storedState ? JSON.parse(storedState) : null;

    var todoApp = TodoApp(initialState);

    rafListen(todoApp, function onChange(value) {
        localStorage.setItem('todos-mercury@11',
            JSON.stringify(value));
    });

    return todoApp;
}

function link(uri, text, isSelected) {
    return h('li', [
        Router.anchor({
            className: isSelected ? 'selected' : '',
            href: uri
        }, text)
    ]);
}

function menu(state) {
    return h('ul', [
        link(TABLE1_URI, 'List 1', state.route === TABLE1_URI),
        link(TABLE2_URI, 'List 2', state.route === TABLE2_URI),
        link(TABLE3_URI, 'List 3', state.route === TABLE3_URI)
    ])
}
function renderBase() {
    return h('div', {
        className: 'welcome-todo'
    }, 'Welcome to ToDo list!');
}
function renderTable(state, listName) {
    return h('div', {}, [
        TodoApp.render(state, listName)
    ]);
}

TodoComponent.render = function(state) {
    return h('div', {
        //  className: styles.mainContent.className
    }, [
        h('aside.sidebar', {
            //  className: styles.sidebar.className
        }, [
            menu(state)
        ]),
        h('main', {
            //    className: styles.main.className
            style: {
                float: 'right',
                width: '60%'
            }
        }, [
            routeView({
                '/app': renderBase.bind(null),
                '/app/table1': renderTable.bind(null, state, 'List 1'),
                '/app/table2': renderTable.bind(null, state, 'List 2'),
                '/app/table3': renderTable.bind(null, state, 'List 3')
            }, state)
        ])
    ]);
};
