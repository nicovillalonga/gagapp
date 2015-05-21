angular.module('verifyCtrl', [])
	.controller('verifyController', ['$window', '$routeParams', 'Auth', 'User', function($window, $routeParams, Auth, User) {

		var vm = this,
			username = $routeParams.username;

		vm.verifyed = false;

		(function verifyUser() {
			User.getByUsername(username).success(function(user) {
				if(user.length === 0) {
					console.log('length === 0 ' + user);
					//No se puede verificar el user
				} else {
					console.log(user);
					vm.verifyed = true;
				}
			});
		})();

	}]);