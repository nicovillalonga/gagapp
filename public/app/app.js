angular.module('gapp', [
	'ngAnimate',
	'app.routes',
	'mainCtrl',
	'userCtrl',
	'verifyCtrl',
	'dashboardCtrl',
	'cardDash',
	'cardTask',
	'authService',
	'userService',
	'socketService'
])
// application configuration to integrate token into requests
.config(['$httpProvider', function($httpProvider) {
	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');
}]);