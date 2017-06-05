'use strict';

var hg = require('../../index.js');
var h = require('../../index.js').h;
var styles = require('./styles.js');

module.exports = render;

function render(state) {
    return state.registerMode ?
        renderRegister(state) :
        renderLogin(state);
}

function renderLogin(state) {
    var channels = state.channels;

    return h('div', {
        'ev-event': hg.sendSubmit(channels.login)
    }, [
        h('div', {
          className: 'login-box'
        },[
            h('form', {
                className: 'email-login'
            }, [
                inputField({
                    name: 'email',
                    type: 'email',
                    placeholder: 'Email',
                    required: 'required',
                    error: state.emailError
                }),
                inputField({
                    name: 'password',
                    type: 'password',
                    placeholder: 'Password',
                    required: 'required',
                    error: state.passwordError
                }),
                h('div', {
                    className: 'u-form-group'
                }, [
                    h('button', 'Log in')
                ])
            ]),
            h('div', {
                className: 'u-form-group'
            }, [
                h('a', {
                    'ev-click': hg.send(channels.switchMode,
                        !state.registerMode)
                }, 'Sign Up')
            ])
        ])
    ]);
}

function renderRegister(state) {
    var channels = state.channels;

    return h('div', {
        'ev-event': hg.sendSubmit(channels.register)
    }, [
        h('div', {
          className: 'login-box'
        }, [
            h('form', {
                className: 'email-signup'
            }, [
                inputField({
                    name: 'email',
                    type: 'email',
                    placeholder: 'Email',
                    error: state.emailError
                }),
                inputField({
                    name: 'password',
                    type: 'password',
                    placeholder: 'Password',
                    error: state.passwordError
                }),
                inputField({
                    name: 'repeatPassword',
                    type: 'password',
                    placeholder: 'Confirm Password',
                    error: state.passwordError
                }),
                h('div', {
                    className: 'u-form-group'
                }, [
                    h('button', 'Sign Up')
                ])
            ]),
            h('div', {
                className: 'u-form-group'
            }, [
                h('a', {
                    'ev-click': hg.send(channels.switchMode,
                        !state.registerMode)
                }, 'Log In')
            ])
        ])
    ]);
}

function inputField(opts) {
    opts.className = opts.error ?
        styles.inputError.className && styles.inputWidth.className : styles.block.className && styles.inputWidth.className;
    return h('div', {
        className: 'u-form-group'
    }, [
        h('input', opts),
        h('div', {
            className: styles.error.className
        }, [
            opts.error
        ])
    ]);
}
