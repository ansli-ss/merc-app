'use strict';

var path = require('path');
var indexhtmlify = require('indexhtmlify');
var browserify = require('browserify');

var examplesDir = path.join(__dirname, '..', 'src');
var examplesTasks = [
    browserifyTask('app')
];

module.exports = examplesTasks;

function browserifyTask(folder) {
    var task = {
        src: path.join(examplesDir, folder, 'index.js'),
        dest: path.join(examplesDir, folder, 'index.html'),
        type: 'browserify',
        name: folder,
        createStream: createStream
    };

    return task;

    function createStream() {
        var stream = browserifyBundle(task.src);
        var result = stream.pipe(indexhtmlify({}));

        stream.on('error', function onError(err) {
            result.emit('error', err);
        });

        return result;
    }
}


function browserifyBundle(source) {
    var b = browserify();
    b.add(source);
    return b.bundle();
}
