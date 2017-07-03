'use strict';

var hg = require('../../../../index.js');
var h = require('../../../../index.js').h;

var document = require('global/document');

var Router = require('../../../lib/router/index');

var TodoItem = require('./todo-item.js');
var ListItem = require('../todo-list/todo-list-item.js');

module.exports = TodoApp;
// opts - initial state
function TodoApp(opts) {

    opts = opts || {};

    var state = hg.state({
        todos: hg.varhash(opts.todos || {}, TodoItem),
        route: Router(),
        field: hg.struct({
            text: hg.value(opts.field && opts.field.text || '')
        }),
        listName: hg.varhash(opts.listItems || {}, ListItem),
        channels: {
            setTodoField: setTodoField,
            add: add,
            clearCompleted: clearCompleted,
            toggleAll: toggleAll,
            destroy: destroy
        }
    });

    TodoItem.onDestroy.asHash(state.todos, function onDestroy(ev) {
        destroy(state, ev);
    });

    return state;
}

// channels:

function setTodoField(state, data) {
    state.field.text.set(data.newTodo);
}

function add(state, data) {
    data.newTodo = state.field.text();
    if (data.newTodo.trim() === '') {
        return;
    }

    var todo = TodoItem({
        title: data.newTodo.trim()
    });
    state.todos.put(todo.id(), todo);
    state.field.text.set('');
}

function clearCompleted(state) {
    Object.keys(state.todos).forEach(function clear(key) {
        if (TodoItem.isCompleted(state.todos[key])) {
            destroy(state, state.todos[key]());
        }
    });
}

function toggleAll(state, value) {
    Object.keys(state.todos).forEach(function toggle(key) {
        TodoItem.setCompleted(state.todos[key], value.toggle);
    });
}

function destroy(state, opts) {
    state.todos.delete(opts.id);
}

TodoApp.render = function render(state, listState) {
    return h('.todomvc-wrapper', {
        style: { visibility: 'hidden' }
    }, [
        h('h1', {}, listState.title),
        h('section#todoapp.todoapp', [
            hg.partial(mainSection,
                state.todos, state.channels),
            hg.partial(header, state.field, state.channels)
        ])
    ]);
};

function header(field, channels) {
    return h('header#header.header', {
        'ev-event': hg.sendChange(channels.setTodoField)
    }, [
        h('button.add-new#add-new', {
            'ev-click': hg.sendSubmit(channels.add)
        }, 'ADD'),
        h('input#new-todo.new-todo', {
            placeholder: 'Add ToDo',
            autofocus: true,
            value: field.text,
            name: 'newTodo'
        })

    ]);
}

function mainSection(todos, channels) {

    var todosList = objectToArray(todos);
    var allCompleted = todosList.every(function isComplete(todo) {
        return todo.completed;
    });

    return h('section#main.main', { hidden: !todosList.length }, [
        h('input#toggle-all.toggle-all', {
            type: 'checkbox',
            name: 'toggle',
            checked: allCompleted,
            'ev-change': hg.sendValue(channels.toggleAll)
        }),
        h('label', { htmlFor: 'toggle-all' }, 'Mark all as complete'),
        h('ul#todo-list.todolist', todosList
            .map(function renderItem(todo) {
                return TodoItem.render(todo, channels);
            }))
    ]);
}

function objectToArray(obj) {
    return Object.keys(obj).map(function toItem(k) {
        return obj[k];
    });
}
