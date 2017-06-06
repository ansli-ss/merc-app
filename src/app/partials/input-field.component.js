
var h = require('../../../index.js').h;
var styles = require('../styles/styles.js');

module.exports = inputField;

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
