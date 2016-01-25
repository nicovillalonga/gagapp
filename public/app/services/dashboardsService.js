angular.module('dashboardsService', [])
	.factory('Dashboards', ['$http',
	function($http) {

		var dashboards = [
			{
				"id" : 1,
				"text" : "dashboard 1",
				"lists" : [
					{
						"name" : "Todo",
						"tasks" : [
							{
								"id" : 1,
								"index": 0,
								"text" : "task 1"
							},
							{
								"id" : 9,
								"index": 1,
								"text" : "task 9"
							}
						]
					},
					{
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

		function getDashboard(id) {
			return dashboards[id];
		};

		return {
			getAllDashboards: getAllDashboards,
			getDashboard: getDashboard
		}

	}]);
