angular.module('gapp', [
	'ngAnimate',
	'app.routes',
	'angularModalService',
	'mainCtrl',
	'userCtrl',
	'verifyCtrl',
	'dashboardsCtrl',
	'dashboardCtrl',
	'modalCtrl',
	'cardDash',
	'cardTask',
	'dashboardsService',
	'authService',
	'userService',
	'socketService'
])
// application configuration to integrate token into requests
.config(['$httpProvider', function($httpProvider) {
	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');
}]);