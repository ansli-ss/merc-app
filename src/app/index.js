'use strict';

var hg = require('../../index');
var h = require('../../index').h;

var styles = require('./styles/styles.js');

var AuthorizationComponent = require('./authorization/authorization.js');
var TodoComponent = require('./todo/todo.js');
var ListItemsComponent = require('./todo/list-items.js');

var document = require('global/document');
var window = require('global/window');

var TimeTravel = require('../../time-travel.js');

var partial = require("vdom-thunk");

function App() {
    var state = hg.state({
        authorizationDone: hg.value(false),
        authorizationComponent: AuthorizationComponent(),
        todoComponent: TodoComponent('test'),
        todoComponent2: TodoComponent('test2'),
        listItemsComponent: ListItemsComponent('test3'),
        listItemsComponent2: ListItemsComponent('test4')
    });

    AuthorizationComponent.onSuccessLogin(state.authorizationComponent, onSuccess);
    AuthorizationComponent.onSuccessRegister(state.authorizationComponent, onSuccess);

    return state;

    function onSuccess(opts) {
        state.authorizationDone.set(true);
        if (opts.type === 'login') {
            state.todoComponent = TodoComponent(opts.user.email);
            state.listItemsComponent = ListItemsComponent(opts.user.email + '1list');
            state.todoComponent2 = TodoComponent(opts.user.email + '2');
            state.listItemsComponent2 = ListItemsComponent(opts.user.email + '2list');
        }
    }
}

function renderMainView(state) {
    return state.authorizationDone ?
        TodoComponent.render(state.todoComponent, state.todoComponent2, state.listItemsComponent, state.listItemsComponent2) :
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