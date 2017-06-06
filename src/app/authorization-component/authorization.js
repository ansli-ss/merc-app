'use strict';

var hg = require('../../../index.js');

var Login = require('./login-component/login-component-render.js');
var Register = require('./register-component/register-component-render.js');

// AuthorizationComponent.onSuccess = function(state) {
//     return state.registerMode ?
//         Register.onSuccess :
//         Login.onSuccess;
// };
AuthorizationComponent.onSuccess = Login.onSuccess;
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
    // if (state.registerMode) {
    //     AuthorizationComponent.onSuccess = Register.onSuccess;
    //     return Register.render(state);
    // } else {
    //     AuthorizationComponent.onSuccess = Login.onSuccess;
    //     return Login.render(state);
    // }
};