angular.module('dashboardsService', [])
	.factory('Dashboards', ['$http', '$window',
	function($http, $window) {

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
								"name" : "task 1",
								"description" : "el text de la story 1",
								"comments" : [],
								"activities" : []
							},
							{
								"id" : 8,
								"index": 2,
								"name" : "task 8",
								"description" : "el text de la story 8",
								"comments" : [],
								"activities" : []
							},
							{
								"id" : 10,
								"index": 1,
								"name" : "task 10",
								"description" : "el text de la story 10",
								"comments" : [],
								"activities" : []
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
								"name" : "task 2",
								"description" : "el text de la story 2",
								"comments" : [],
								"activities" : []
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
								"name" : "task 3",
								"description" : "el text de la story 3",
								"comments" : [],
								"activities" : []
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
			//return dashboards;			
			return $http.get('/api/dashboards');
		};

		function _sortDashboard(lists) {
			lists.forEach(function(list) {
				list.tasks.sort(function(a, b) {
					return a.index - b.index;
				});
			});
		};

		function getDashboard(id) {
			var storage = JSON.parse($window.localStorage.getItem('listsUpdated'));
			
			return $http.get('/api/dashboard/' + id);

			/* NEED MIGRATION

			if(storage !== null && storage.dashboard === id) {
				//if there is data in localStorage then retrieve and save (it was not saved before)
				dashboard.lists = storage.lists;
			} else {
				//sort dashboard's lists by index
				_sortDashboard(dashboard.lists);
			}
			//store actual dashboard for further use.
			actualDash = dashboard;

			return dashboard;

			*/
		};

		function createDashboard(text, owner) {
			return $http.post('/api/dashboards', {"text": text, "owner": owner});			
		};

		function updateIndexes(listName, listNameTarget, oldIndex, newIndex) {
			var tasksTarget;
			var store = {
				"dashboard" : actualDash._id
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
			_setListIndexes(tasks, oldIndex);

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

		function getTask(listName, taskId) {
			return actualDash.lists.find(function(list) {
					return list.name === listName;
				}).tasks.find(function(task) {
					return task.id === taskId;
				});
		};

		return {
			createDashboard: createDashboard,
			getAllDashboards: getAllDashboards,
			getDashboard: getDashboard,
			getTask: getTask,
			updateIndexes: updateIndexes,
			updateActualLists: updateActualLists
		}

	}]);
