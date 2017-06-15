'use strict';

var hg = require('../../index');
var h = require('../../index').h;

var styles = require('./styles/styles.js');

var AuthorizationComponent = require('./authorization/authorization.js');
var TodoComponent = require('./todo/todo.js');

var document = require('global/document');
var window = require('global/window');
var Router = require('../lib/router/index');
var TimeTravel = require('../../time-travel.js');

var partial = require("vdom-thunk");

var RCSS = require('rcss');
RCSS.injectAll();

function App() {
    var state = hg.state({
        authorizationDone: hg.value(false),
        route: Router(),
        authorizationComponent: AuthorizationComponent(),
        todoComponent: TodoComponent('todos-mercury@11'),
        todoComponent2: TodoComponent('todos-mercury@112')
    });

    AuthorizationComponent.onSuccessLogin(state.authorizationComponent, onSuccess);
    AuthorizationComponent.onSuccessRegister(state.authorizationComponent, onSuccess);

    return state;

    function onSuccess() {
        state.authorizationDone.set(true);
    }

}

function renderMainView(state, route) {
    return state.authorizationDone ?
        TodoComponent.render(state.todoComponent, state.todoComponent2,  route) :
        AuthorizationComponent.render(state.authorizationComponent);
}

App.render = function render(state, route) {

    return h('div', [
        h('link', {
            rel: 'stylesheet',
            href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
        }),
        h('link', {
            rel: 'stylesheet',
            href: '/mercury/src/app/styles/style.css'
        }),
        partial(header),
        renderMainView(state, route),
        partial(footer)
    ]);
};

function header() {
    return h('header.main-header', {}, [
        h('a',{
            href: '/app',
            className: 'logo'
        }, [
            h('i', {
                className: 'fa fa-bars'
            })
        ])
    ]);
}

function footer() {
    return h('footer.main-footer', {});
}

var app = window.app = App();
var history = TimeTravel(app);
window.undo = history.undo;
window.redo = history.redo;
hg.app(document.body, app, App.render);