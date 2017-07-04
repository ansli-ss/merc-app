'use strict';

var hg = require('mercury');
var h = require('mercury').h;

var styles = require('./styles/styles.js');

var AuthorizationComponent = require('./authorization/authorization.js');
var TodoComponent = require('./todo/todo.js');
var ListItemsComponent = require('./todo/list-items.js');
var window = require('global/window');
var localStorage = window.localStorage;
var document = require('global/document');


var TimeTravel = require('../../time-travel.js');

var partial = require('vdom-thunk');

function App() {
    var state = hg.state({
        authorizationDone: hg.value(false),
        authorizationComponent: AuthorizationComponent()
    });

    AuthorizationComponent.onSuccessLogin(state.authorizationComponent, onSuccess);
    AuthorizationComponent.onSuccessRegister(state.authorizationComponent, onSuccess);

    return state;

    function onSuccess(opts) {
        state.authorizationDone.set(true);
        if (opts.type === 'login') {
            var loggedIn = localStorage.getItem(opts.user.email);
            var loggedInPass  = JSON.parse(loggedIn);
            if (loggedInPass === opts.user.password) {
                document.body.innerHTML = '';
                hg.app(document.body, AppAuthDone(opts), AppAuthDone.render);
            } else {
                alert('Incorrect password!');
            }
        } else if (opts.type === 'register') {
            localStorage.setItem(opts.user.email, JSON.stringify(opts.user.password));
            document.body.innerHTML = '';
            hg.app(document.body, AppAuthDone(opts), AppAuthDone.render);
        }
    }
}

function AppAuthDone(opts) {
    var state = hg.state({
        todoComponentHome: TodoComponent(opts.user.email + 'home'),
        todoComponentWork: TodoComponent(opts.user.email + 'work'),
        listItemsComponentHome: ListItemsComponent(opts.user.email + 'home-list'),
        listItemsComponentWork: ListItemsComponent(opts.user.email + 'work-list')
    });
    return state;
}

AppAuthDone.render = function(state) {
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
        TodoComponent.render(state.todoComponentHome, state.todoComponentWork, state.listItemsComponentHome, state.listItemsComponentWork),
        partial(footer)
    ]);
};

App.render = function render(state) {

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
        AuthorizationComponent.render(state.authorizationComponent),
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