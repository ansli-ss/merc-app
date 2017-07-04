'use strict';

var hg = require('mercury');

var Login = require('./login/login-render.js');
var Register = require('./register/register-render.js');

AuthorizationComponent.onSuccessLogin = Login.onSuccess;
AuthorizationComponent.onSuccessRegister = Register.onSuccess;

module.exports = AuthorizationComponent;

function AuthorizationComponent() {
    return hg.state({
        emailError: hg.value(''),
        passwordError: hg.value(''),
        registerMode: hg.value(false),
        channels: {
            switchMode: switchMode,
            login: Login,
            register: Register
        }
    });
}

function switchMode(state, registerMode) {
    state.registerMode.set(registerMode);
}

AuthorizationComponent.render = function (state) {
    return state.registerMode ?
        Register.render(state) :
        Login.render(state);
};