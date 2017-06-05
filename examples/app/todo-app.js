'use strict';

var hg = require('../../index.js');
var h = require('../../index.js').h;

var document = require('global/document');

var Router = require('../lib/router/');
var anchor = Router.anchor;
var routeView = Router.render;

var TodoItem = require('./todo-item.js');

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
    console.log('setTodoField');
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

TodoApp.render = function render(state, listName) {
    console.log('state: ', state);
    return h('.todomvc-wrapper', {
        style: { visibility: 'hidden' }
    }, [
        h('h1', {}, listName),
        h('section#todoapp.todoapp', [
            // hg.partial(statsSection,
            //   state.todos, state.route, state.channels, state.field),
            hg.partial(mainSection,
                state.todos, state.route, state.channels),
            hg.partial(header, state.field, state.channels)
        ])
      //  hg.partial(infoFooter)
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

function mainSection(todos, route, channels) {
  // temporary solution
  var ROOT_URI_LOCAL = String(document.location.pathname);
  var COMPLETED_URI = ROOT_URI_LOCAL + '/completed';
  var ACTIVE_URI = ROOT_URI_LOCAL + '/active';
    var todosList = objectToArray(todos);

    var allCompleted = todosList.every(function isComplete(todo) {
        return todo.completed;
    });
    var visibleTodos = todosList.filter(function isVisible(todo) {
        return route === COMPLETED_URI && todo.completed ||
            route === ACTIVE_URI && !todo.completed ||
            route === ROOT_URI_LOCAL;
    });

    return h('section#main.main', { hidden: !todosList.length }, [
        h('input#toggle-all.toggle-all', {
            type: 'checkbox',
            name: 'toggle',
            checked: allCompleted,
            'ev-change': hg.sendValue(channels.toggleAll)
        }),
        h('label', { htmlFor: 'toggle-all' }, 'Mark all as complete'),
        h('ul#todo-list.todolist', visibleTodos
            .map(function renderItem(todo) {
                return TodoItem.render(todo, channels);
            }))
    ]);
}

function statsSection(todos, route, channels, fields) {
    var todosList = objectToArray(todos);
    var todosLeft = todosList.filter(function notComplete(todo) {
        return !todo.completed;
    }).length;
    var todosCompleted = todosList.length - todosLeft;
    return h('footer#footer.footer', {
        hidden: !todosList.length
    }, [
        h('span#todo-count.todo-count', [
            h('strong', String(todosLeft)),
            todosLeft === 1 ? ' item' : ' items',
            ' left'
        ]),
        h('button.clear-completed#clear-completed', {
            hidden: todosCompleted === 0,
            'ev-click': hg.send(channels.clearCompleted)
        }, 'Clear completed (' + String(todosCompleted) + ')')
    ]);
}

function link(uri, text, isSelected) {
    return h('li', [
        Router.anchor({
            className: isSelected ? 'selected' : '',
            href: uri
        }, text)
    ]);
}

function infoFooter() {
    return h('footer#info.info', [
        h('p', 'Double-click to edit a todo')
    ]);
}

function objectToArray(obj) {
    return Object.keys(obj).map(function toItem(k) {
        return obj[k];
    });
}
