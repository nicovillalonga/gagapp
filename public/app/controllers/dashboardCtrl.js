angular.module('dashboardCtrl', [])
	.controller('dashController', ['$scope', '$location', '$routeParams',
	function($scope, $location, $routeParams) {

		$scope.dashboards = [
			{
				"id" : 1,
				"text" : "dashboard 1",
				"lists" : [
					{
						"name" : "Todo",
						"tasks" : [
							{
								"id" : 1,
								"text" : "task 1"
							}
						]
					},
					{
						"name" : "Progress",
						"tasks" : [
							{
								"id" : 2,
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

		if($routeParams.dashboard) {
			$scope.lists = $scope.dashboards[$routeParams.dashboard-1].lists;
		}

		$scope.selectDashboard = function(index) {
			var id = $scope.dashboards[index].id;
			$location.path('/dashboards/' + id);
		};

		$scope.removeDash = function(index) {
			$scope.dashboards.splice(index, 1);
		};
	}]);