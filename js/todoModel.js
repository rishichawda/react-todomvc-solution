/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};

(function () {
	'use strict';

	var Utils = app.Utils;
	// Generic "model" object. You can use whatever
	// framework you want. For this application it
	// may not even be worth separating this logic
	// out, but we do this to demonstrate one way to
	// separate out parts of your application.
	app.TodoModel = function (key) {
		this.key = key;
		this.todos = Utils.store(key);
		this.onChanges = [];
	};

	app.TodoModel.prototype.subscribe = function (onChange) {
		this.onChanges.push(onChange);
	};

	app.TodoModel.prototype.inform = function () {
		Utils.store(this.key, this.todos);
		this.onChanges.forEach(function (cb) {
			cb();
		});
	};

	app.TodoModel.prototype.addTodo = function (title) {

		var beautify_datetime = (datetime) => {
			var current_time = datetime[4].split(':');
			current_time = current_time[0] + ' : ' + current_time[1];
			var current_date = datetime[0] + ', ' + datetime[1] + ' ' + datetime[2];
			return current_date + ' ( ' + current_time + ' )';
		}

		var get_equality = (title) => {
			var title_arr = title.split(' ');
			var matches = [];

			function checkFromList(sometodofromlist, index) {
				var bstr = sometodofromlist.title.split(' ');
				var counter = 0;
				title_arr.map((inputstrletter) => {
					bstr.filter((data) => {
						if (data === inputstrletter) {
							counter++;
						}
					});
				});
				if (counter >= (title_arr.length) / 2) {
					matches.push(index);
				}
			}
			this.todos.map(checkFromList);
			return matches;
		}

		var matched_todos = get_equality(title);

		if (matched_todos.length > 0) {
			alert('Is this similar to your todo item ' + (parseInt(matched_todos[0]) + 1) + '?');
		} else {
			var current_datetime = Date().split(' ').slice(0, 5);
			this.todos = this.todos.concat({
				id: Utils.uuid(),
				title: title,
				completed: false,
				time: beautify_datetime(current_datetime)
			});

			this.inform();
		}

	};

	app.TodoModel.prototype.sortTodoList = function (data) {
		this.todos = this.todos.reverse();
		this.inform();
	}

	app.TodoModel.prototype.toggleAll = function (checked) {
		// Note: it's usually better to use immutable data structures since they're
		// easier to reason about and React works very well with them. That's why
		// we use map() and filter() everywhere instead of mutating the array or
		// todo items themselves.
		this.todos = this.todos.map(function (todo) {
			return Utils.extend({}, todo, {
				completed: checked
			});
		});

		this.inform();
	};

	app.TodoModel.prototype.toggle = function (todoToToggle) {
		this.todos = this.todos.map(function (todo) {
			return todo !== todoToToggle ?
				todo :
				Utils.extend({}, todo, {
					completed: !todo.completed
				});
		});

		this.inform();
	};

	app.TodoModel.prototype.destroy = function (todo) {
		this.todos = this.todos.filter(function (candidate) {
			return candidate !== todo;
		});

		this.inform();
	};

	app.TodoModel.prototype.save = function (todoToSave, text) {
		this.todos = this.todos.map(function (todo) {
			return todo !== todoToSave ? todo : Utils.extend({}, todo, {
				title: text
			});
		});

		this.inform();
	};

	app.TodoModel.prototype.clearCompleted = function () {
		this.todos = this.todos.filter(function (todo) {
			return !todo.completed;
		});

		this.inform();
	};

})();