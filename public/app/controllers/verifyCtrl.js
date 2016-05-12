angular.module('verifyCtrl', [])
	.controller('verifyController', ['$scope', '$window', '$routeParams', 'Auth', 'User',
	function($scope, $window, $routeParams, Auth, User) {

		var username = $routeParams.username;

		$scope.verifyed = false;

		(function verifyUser() {
			User.getByUsername(username)
			.then(function(user) {
				if(user.data.length === 0) {
					console.log('length === 0 ' + user);
					//No se puede verificar el user
				} else {
					console.log(user);
					$scope.verifyed = true;
				}
			});
		})();

	}]);