'use strict';

var RCSS = require('rcss');

module.exports = {
    error: RCSS.registerClass({
        color: 'red'
    }),
    inputError: RCSS.registerClass({
        borderColor: 'red',
        display: 'block'
    }),
    block: RCSS.registerClass({
        display: 'block'
    }),
    header: RCSS.registerClass({
        height: '100px',
        width: '100%',
        backgroundColor: 'gray'
    }),
    footer: RCSS.registerClass({
        position: 'fixed',
        bottom: '0',
        left: '0',
        height: '100px',
        width: '100%',
        backgroundColor: 'gray'
    }),
    center: RCSS.registerClass({
        textAlign: 'center'
    }),
    inputWidth: RCSS.registerClass({
        width: '100%'
    })
};
