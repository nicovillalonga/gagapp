angular.module('homeCtrl', [])

	.controller('homeController', ['$location', function($location) {
		var vm = this;

		vm.login = function() {
			$location.path('/login');
		};
	}]);