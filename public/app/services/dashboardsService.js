angular.module('dashboardsService', [])
	.factory('Dashboards', ['$http',
	function($http) {

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
								"index": 1,
								"text" : "task 8"
							},
							{
								"id" : 10,
								"index": 2,
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

		function sortDashboard(lists) {
			_.forEach(lists, function(list) {
				list.tasks.sort(function(a, b) {
					return a.index - b.index;
				});
			});
		};

		function getDashboard(id) {
			var dashboard = dashboards.find(function(dash) {
				return dash.id === id;
			});
			//store actual dashboard for further use.
			//getDashboard is first function called in dashController.
			actualDash = dashboard;
			sortDashboard(dashboard.lists);
			return dashboard;
		};

		function updateIndex(listName, listNameTarget, oldIndex, newIndex) {
			var tasksTarget;
			var tasks = actualDash.lists.find(function(list) {
				return list.name === listName;
			}).tasks;

			//if listNameTarget === null -> the sort is in the same list
			//else sorting among two lists
			if(listNameTarget === null) {
				//move the selected element from its original position to new index position.
				tasks.splice(newIndex, 0, tasks.splice(oldIndex, 1)[0]);
				console.log(tasks);
			} else {
				tasksTarget = actualDash.lists.find(function(list) {
					return list.name === listNameTarget;
				}).tasks;

				//remove element from original list and insert to target list;
				tasksTarget.splice(newIndex, 0, tasks.splice(oldIndex, 1)[0]);
				console.log(tasks);
				console.log(tasksTarget);
			}
		};

		return {
			getAllDashboards: getAllDashboards,
			getDashboard: getDashboard,
			updateIndex: updateIndex
		}

	}]);
