angular.module('dashboardsCtrl', [])
	.controller('allDashController', ['$scope', '$location', 'Dashboards',
	function($scope, $location, Dashboards) {

		$scope.dashboards = Dashboards.getAllDashboards();

		$scope.selectDashboard = function(index) {
			var id = $scope.dashboards[index].id;
			$location.path('/dashboard/' + id);
		};

		$scope.removeDash = function(index) {
			$scope.dashboards.splice(index, 1);
		};
	}]);