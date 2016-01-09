angular.module('homeCtrl', [])
	.controller('homeController', ['$location',
	function($location) {

		$scope.login = function() {
			$location.path('/login');
		};
	}]);