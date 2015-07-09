angular.module('userApp', [
	'ngAnimate',
	'app.routes',
	'authService',
	'mainCtrl',
	'userCtrl',
	'verifyCtrl',
	'userService',
	'socketService'
])

	// application configuration to integrate token into requests
	.config(['$httpProvider', function($httpProvider) {
		// attach our auth interceptor to the http requests
		$httpProvider.interceptors.push('AuthInterceptor');
	}]);