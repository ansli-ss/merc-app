'use strict';

var hg = require('../../index');
var h = require('../../index').h;

var styles = require('./styles/styles.js');

var AuthorizationComponent = require('./authorization-component/authorization.js');
var TodoComponent = require('./todo-component/todo-component.js');

var document = require('global/document');
var window = require('global/window');
var Router = require('../lib/router/index');
var TimeTravel = require('../../time-travel.js');

var RCSS = require('rcss');
RCSS.injectAll();

function App() {
    var state = hg.state({
        message: hg.value(''),
        authDone: hg.value(false),
        route: Router(),
        authorizationComponent: AuthorizationComponent(),
        todoComponent: TodoComponent()
    });

    AuthorizationComponent.onSuccessLogin(state.authorizationComponent, onSuccess);
    AuthorizationComponent.onSuccessRegister(state.authorizationComponent, onSuccess);

    return state;

    function onSuccess() {
        state.authDone.set(true);
    }

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
        h('header.main-header', {}, [
            h('a',{
              href: '/app',
              className: 'logo'
            }, [
                h('i', {
                    className: 'fa fa-bars'
                })
            ])
        ]),
        state.authDone ?
            TodoComponent.render(state.todoComponent, route) :
            AuthorizationComponent.render(state.authorizationComponent),
        h('footer', {
            //  className: styles.footer.className
        })
    ]);
};


var app = window.app = App();
var history = TimeTravel(app);
window.undo = history.undo;
window.redo = history.redo;
hg.app(document.body, app, App.render);