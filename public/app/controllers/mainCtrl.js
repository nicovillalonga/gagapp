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
					$location.path('/dashboards');
			}
		});

		$scope.showUsersTab = function () {
			return $scope.loggedIn && Auth.isAdmin();
		}

		$scope.doLogin = function() {
			$scope.processing = true;
			// clear the error
			$scope.message = '';
			login($scope.loginData.username, $scope.loginData.password);
		};



		function login(username, password) {
			Auth.login(username, password)
			.then(function(data) {
				$scope.processing = false;
				// if a user successfully logs in, redirect to users page
				if (data.data.success) {
					$window.sessionStorage.setItem('username', username);
					$scope.isLoggedIn = true;
					$location.path('/dashboards');
				} else
					$scope.message = data.data.message;
			});
		};

		// function to handle logging out
		$scope.doLogout = function() {
			Auth.logout();
			// reset all user info
			$scope.user = {};
			$window.sessionStorage.removeItem('username');
			$window.sessionStorage.removeItem('rol');
			$location.path('/login');
		};

		$scope.$on('sendRegisterEvt', function(evt, userData) {
			sendRegister(userData);
		});

		function sendRegister(userData) {
			User.create(userData)
			.then(function(data) {
				if(data.data.success === false) {
					$scope.processing = false;
					$scope.message = data.data.message;
				} else {
					$scope.message = 'user created! -- sending verification email to ' + userData.email;
					$rootScope.$broadcast('registerFinishEvt', $scope.message);
					authRegister(userData.email, userData.username);
				}

				$rootScope.$broadcast('registerFinishEvt', $scope.message);
			}).catch(function(err) {
				console.log(err);
				$scope.processing = false;
				//$scope.message = data.message;
				$rootScope.$broadcast('registerFinishEvt', $scope.message);
			});
		};

		function authRegister(email, username) {
			Auth.sendRegister(email, username)
			.then(function(data) {
				$scope.processing = false;
				socket.emit('user:new', data);
				$location.path('/sendRegister');
			})
			.catch(function(data){
				$scope.processing = false;
				$scope.message = data.data.message;
				$rootScope.$broadcast('registerFinishEvt', $scope.message);
			});
		};

		$scope.sendRegister = function() {
			var userData = {
	            email: $scope.registerData.email,
				//email: 'nicovilllalonga90@gmail.com',
				username: $scope.registerData.username,
				password: $scope.registerData.password
			};

			$scope.message = '';
			$scope.processing = true;
			sendRegister(userData);
		};
	}]);
