angular.module('mainCtrl', [])
	.controller('mainController', ['$scope', '$rootScope', '$location', '$window', 'Auth', 'User', 'socket',
	function($scope, $rootScope, $location, $window, Auth, User, socket) {

		// get info if a person is logged in
		$scope.loggedIn = Auth.isLoggedIn();
		
		// check to see if a user is logged in on every request
		$rootScope.$on('$routeChangeStart', function() {
			$scope.loggedIn = Auth.isLoggedIn();

			if($scope.loggedIn){
				$scope.username = $window.sessionStorage.getItem('username');
				if($location.path() === '/')
					$location.path('/users');
			}
		});

		$scope.goToDashboards = function() {
			$location.path('/dashboards');
		};

		$scope.goToLogin = function() {
			$location.path('/login');
		};

		$scope.doLogin = function() {
			$scope.processing = true;
			// clear the error
			$scope.error = '';
			login($scope.loginData.username, $scope.loginData.password);
		};



		function login(username, password) {
			Auth.login(username, password).success(function(data) {
				$scope.processing = false;
				// if a user successfully logs in, redirect to users page
				if (data.success) {
					$window.sessionStorage.setItem('username', username);
					$scope.isLoggedIn = true;
					$location.path('/users');
				} else
					$scope.error = data.message;
			});
		};


		// function to handle logging out
		$scope.doLogout = function() {
			Auth.logout();
			// reset all user info
			$scope.user = {};
			$window.sessionStorage.removeItem('username');
			$location.path('/login');
		};


		$scope.doRegister = function() {
			$scope.processing = true;
			$scope.error = '';

			Auth.register($scope.registerData.email, $scope.registerData.username, $scope.registerData.password).success(function(data) {
				$scope.processing = false;
				// if a user successfully logs in, redirect to users page
				if (data.success !== false) {
					login($scope.registerData.username, $scope.registerData.password);
				} else {
					$scope.error = data.message;
				}
			});
		};


		$scope.sendRegister = function() {
			var userData = {
		            email: $scope.registerData.email,
					//email: 'nicovilllalonga90@gmail.com',
					username: $scope.registerData.username,
					password: $scope.registerData.password
				};

			$scope.error = '';
			$scope.processing = true;
			/**TODO: refactor function in a service (same logic in usercreateCtrl)*/
			User.create(userData).success(function(data) {
				console.log(data);				
				if(data.success === false) {
					//$scope.error = data.message;
					$scope.processing = false;
					$scope.error = data.message;
				} else {
					Auth.sendRegister($scope.registerData.email, $scope.registerData.username).success(function(data) {
						console.log('socket: ' + data);	
						socket.emit('user:new', {
							user:   {
							            email: $scope.registerData.email,										
										username: $scope.registerData.username,
										password: $scope.registerData.password
									}
						});					
						$scope.processing = false;
						$location.path('/sendRegister');
					})
					.error(function(data){
						$scope.processing = false;
						$scope.error = data.message;
					});
				}
			});
			
		}
	}]);