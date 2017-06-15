
var h = require('../../../../index').h;
var link = require('../../partials/link.js');

var ROOT_URI = String(document.location.pathname);

var TABLE1_URI = ROOT_URI + '/table1';
var TABLE2_URI = ROOT_URI + '/table2';
var TABLE3_URI = ROOT_URI + '/table3';

module.exports = menu;

function menu(state) {
    return h('ul', [
        link(TABLE1_URI, 'List 1', state.route === TABLE1_URI),
        link(TABLE2_URI, 'List 2', state.route === TABLE2_URI),
        link(TABLE3_URI, 'List 3', state.route === TABLE3_URI)
    ])
}