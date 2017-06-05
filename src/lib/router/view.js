'use strict';

var routeMap = require('route-map');

module.exports = render;

function render(defn, args) {

    if (args.base) {
        console.log('check');
        defn = Object.keys(defn)
            .reduce(function applyBase(acc, str) {
                acc[args.base + str] = defn[str];
                return acc;
            }, {});
    }

    var match = routeMap(defn);

    var res = match(args.route);

    if (!res) {
        throw new Error('router: no match found');
    }

    res.params.url = res.url;
    return res.fn(res.params);
}
