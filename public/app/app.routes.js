angular.module('app.routes', ['ngRoute'])
	.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider
		
		// home page route
		.when('/', {
			templateUrl : 'app/views/pages/login.html',
			controller : 'mainController'
		})

		// login page
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
			controller : 'mainController'
		})

		// show all users
		.when('/users', {
			templateUrl: 'app/views/pages/users/all.html',
			controller: 'userController'
		})

		// form to create a new user
		// same view as edit page
		.when('/users/create', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userCreateController'
		})

		// page to edit a user
		.when('/users/:user_id', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userEditController'
		})

		.when('/sendRegister/', {
			templateUrl: 'app/views/pages/sendRegister.html',
		})

		.when('/register', {
			templateUrl: 'app/views/pages/register.html',
			controller: 'mainController'
		})

		.when('/verify/:username', {
			templateUrl: 'app/views/pages/verify.html',
			controller: 'verifyController'
		})

		.when('/verifyError', {
			templateUrl: 'app/views/pages/verifyError.html'
		})

		.when('/dashboards', {
			templateUrl: 'app/views/pages/dashboards/all.html',
			controller: 'dashController'
		})

		.when('/dashboards/:dashboard', {
			templateUrl: 'app/views/pages/dashboards/single.html',
			controller: 'dashController'
		})

		.otherwise({
			templateUrl: '/app/views/pages/notFound.html'
		});
		

		// get rid of the hash in the URL
		$locationProvider.html5Mode(true);
	}]);