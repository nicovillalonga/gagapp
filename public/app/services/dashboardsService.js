angular.module('dashboardsService', [])
	.factory('Dashboards', ['$window',
	function($window) {

		var actualDash;
		var dashboards = [
			{
				"id" : 1,
				"text" : "dashboard 1",
				"lists" : [
					{
						"id" : 1,
						"name" : "Todo",
						"tasks" : [
							{
								"id" : 1,
								"index": 0,
								"text" : "task 1"
							},
							{
								"id" : 8,
								"index": 2,
								"text" : "task 8"
							},
							{
								"id" : 10,
								"index": 1,
								"text" : "task 10"
							}
						]
					},
					{
						"id" : 2,
						"name" : "Progress",
						"tasks" : [
							{
								"id" : 2,
								"index": 0,
								"text" : "task 2"
							}
						]
					},
					{
						"id" : 3,
						"name" : "Done",
						"tasks" : []
					}
				]
			},
			{
				"id" : 2,
				"text" : "dashboard 2",
				"lists" : [
					{
						"id" : 4,
						"name" : "Todo",
						"tasks" : [
							{
								"id" : 3,
								"text" : "task 3"
							}
						]
					}
				]
			},
			{
				"id" : 3,
				"text" : "dashboard 3",
				"lists" : []
			}
		];

		function getAllDashboards() {
			return dashboards;
		};

		function _sortDashboard(lists) {
			lists.forEach(function(list) {
				list.tasks.sort(function(a, b) {
					return a.index - b.index;
				});
			});
		};

		function getDashboard(id) {
			//if($window.localStorage(''))
			var dashboard = dashboards.find(function(dash) {
				return dash.id === id;
			});
			//store actual dashboard for further use.
			//getDashboard is first function called in dashController.
			_sortDashboard(dashboard.lists);
			actualDash = dashboard;
			return dashboard;
		};

		function updateIndexes(listName, listNameTarget, oldIndex, newIndex) {
			var tasksTarget;
			var store = {
				"dashboard" : actualDash.id
			};
			var list = actualDash.lists.slice().find(function(list) {
				return list.name === listName;
			});
			var tasks = list.tasks;

			//if listNameTarget === null -> the sort is in the same list
			//else sorting among two lists
			if(listNameTarget === null) {
				//move the selected element from its original position to new index position.
				tasks.splice(newIndex, 0, tasks.splice(oldIndex, 1)[0]);
			} else {
				tasksTarget = actualDash.lists.find(function(list) {
					return list.name === listNameTarget;
				}).tasks;

				//remove element from original list and insert to target list
				tasksTarget.splice(newIndex, 0, tasks.splice(oldIndex, 1)[0]);
				//update the indexes of the target list
				_setListIndexes(tasksTarget, newIndex);
			}

			//update the indexes of original list
			_setListIndexes(tasks, newIndex);

			//saves the updated lists to localStorage to update other users lists
			store.lists = actualDash.lists;
			$window.localStorage.setItem('listsUpdated', JSON.stringify(store));
		};

		function _setListIndexes(tasks, index) {
			var length = tasks.length;
			var i;

			if(tasks.length === 0) {
				return;
			}

			for (i = index; i < length; i++) {
				tasks[i].index = i;
			};
		}

		function updateActualLists(lists) {
			actualDash.lists = lists;
		};

		return {
			getAllDashboards: getAllDashboards,
			getDashboard: getDashboard,
			updateIndexes: updateIndexes,
			updateActualLists: updateActualLists
		}

	}]);
