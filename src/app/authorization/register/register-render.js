

var hg = require('../../../../index.js');
var h = require('../../../../index.js').h;
var styles = require('../../styles/styles.js');

var validEmail = require('valid-email');
var WeakmapEvent = require('../../../lib/weakmap-event.js');
var onSuccess = WeakmapEvent();
Register.onSuccess = onSuccess.listen;

var inputField = require('../../partials/input-field.js');
var resetErrors = require('../../partials/reset-errors.js');

module.exports = Register;

function Register(state, user) {
    resetErrors(state);
    var email = user.email;

    if (!validEmail(email)) {
        return state.emailError.set('Invalid email');
    }

    if (user.password !== user.repeatPassword) {
        return state.passwordError.set('Password not same');
    }

    if (user.password.length <= 6) {
        return state.passwordError.set('Password too small');
    }

    onSuccess.broadcast(state);
}

Register.render = function (state) {
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
};