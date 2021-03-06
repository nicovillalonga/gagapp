angular.module('authService', [])

	// ===================================================
	// auth factory to login and get information
	// inject $http for communicating with the API
	// inject $q to return promise objects
	// inject AuthToken to manage tokens
	// ===================================================
	.factory('Auth', ['$http', '$q', '$window', 'AuthToken', function($http, $q, $window, AuthToken) {
		// create auth factory object
		var authFactory = {};

		// log a user in
		authFactory.login = function(username, password) {
			// return the promise object and its data
			return $http.post('/api/authenticate', {username: username, password: password})
				.success(function(data) {
					AuthToken.setToken(data.token, data.rol);
					return data;
				}).error(function(err) {
					console.log(err);
				});
		};

		// log a user out by clearing the token
		authFactory.logout = function() {
			// clear the token
			AuthToken.setToken();
		};

		// check if a user is logged in
		// checks if there is a local token
		authFactory.isLoggedIn = function() {
			return AuthToken.hasToken();
		};

		// check in session storage if rol is 'admin'
		authFactory.isAdmin = function() {
			return $window.sessionStorage.getItem('rol') === 'admin';
		};

		// get the logged in user
		authFactory.getUser = function() {
			if (AuthToken.getToken())
				return $http.get('/api/me', { cache: true });
			else
				return $q.reject({ message: 'User has no token.' });
		};

		authFactory.sendRegister = function(email, username) {
			return $http.post('/api/sendRegister/:email/:username', {"email": email, "username": username});
		};

		authFactory.register = function(email, username, password) {
			return $http.post('/api/register', {"email": email, "username": username, "password": password});
		};



		// return auth factory object
		return authFactory;
	}])




	// ===================================================
	// factory for handling tokens
	// inject $window to store token client-side
	// ===================================================
	.factory('AuthToken', ['$window', function($window) {
		var authTokenFactory = {};

		// get the token out of session storage
		authTokenFactory.getToken = function() {
			return $window.sessionStorage.getItem('token');
		};

		// check if session storage has token
		authTokenFactory.hasToken = function() {
			return $window.sessionStorage.getItem('token') !== null;
		};

		// function to set token or clear token
		// if a token is passed, set the token
		// if there is no token, clear it from session storage
		authTokenFactory.setToken = function(token, rol) {
			if (token) {
				$window.sessionStorage.setItem('token', token);
				$window.sessionStorage.setItem('rol', rol);
			}
			else {
				$window.sessionStorage.removeItem('token');
			}
		};


		return authTokenFactory;
	}])




	// ===================================================
	// application configuration to integrate token into requests
	// ===================================================
	.factory('AuthInterceptor', ['$q', '$location', 'AuthToken', function($q, $location, AuthToken) {
		var interceptorFactory = {};

		// this will happen on all HTTP requests
		interceptorFactory.request = function(config) {
			// grab the token
			var token = AuthToken.getToken();
			// if the token exists, add it to the header as x-access-token
			if (token)
				config.headers['x-access-token'] = token;

			return config;
		};

		// happens on response errors
		interceptorFactory.responseError = function(response) {
			// if our server returns a 403 forbidden response
			if (response.status == 403) {
				AuthToken.setToken();
				$location.path('/login');
			}

			// return the errors from the server as a promise
			return $q.reject(response);
		};



		return interceptorFactory;
	}]);
