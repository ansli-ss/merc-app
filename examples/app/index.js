'use strict';

var hg = require('../../index');
var h = require('../../index').h;

var styles = require('./styles.js');

var LoginComponent = require('./login-component.js');
var TodoComponent = require('./todo-component.js')
var document = require('global/document');
var window = require('global/window');

var TimeTravel = require('../../time-travel.js');

var RCSS = require('rcss');
RCSS.injectAll();

function App() {
    var state = hg.state({
        message: hg.value(''),
        loginDone: hg.value(false),
        loginComponent: LoginComponent(),
        todoComponent: TodoComponent()
    });

    LoginComponent.onSuccess(state.loginComponent, onSuccess);

    return state;

    function onSuccess(opts) {
        state.loginDone.set(true);

        if (opts.type === 'login') {
            state.message.set('Congrats login' +
                'user: ' + opts.user.email + ' password: ' +
                opts.user.password);
        } else if (opts.type === 'register') {
            state.message.set('Congrats register' +
                'user: ' + opts.user.email + ' password: ' +
                opts.user.password);
        }
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
            href: '/mercury/examples/app/style.css'
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
        state.loginDone ?
            TodoComponent.render(state.todoComponent, route) :
            LoginComponent.render(state.loginComponent),
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