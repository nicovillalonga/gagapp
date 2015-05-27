angular.module('mainCtrl', [])
	.controller('mainController', ['$rootScope', '$location', '$window', 'Auth', 'User', function($rootScope, $location, $window, Auth, User) {
		var vm = this;

		// get info if a person is logged in
		vm.loggedIn = Auth.isLoggedIn();		
		
		// check to see if a user is logged in on every request
		$rootScope.$on('$routeChangeStart', function() {
			vm.loggedIn = Auth.isLoggedIn();

			if(vm.loggedIn){
				vm.username = $window.sessionStorage.getItem('username');
				if($location.path() === '/')
					$location.path('/users');
			}/* else {
				$location.path('/login');
			}*/

			/* get user information on route change
			Auth.getUser();.success(function(data) {
				vm.user = data;
			});*/
		});

		vm.goToLogin = function() {
			$location.path('/login');
		};

		vm.doLogin = function() {
			vm.processing = true;
			// clear the error
			vm.error = '';
			login(vm.loginData.username, vm.loginData.password);
		};



		function login(username, password) {
			Auth.login(username, password).success(function(data) {
				vm.processing = false;
				// if a user successfully logs in, redirect to users page
				if (data.success) {
					$window.sessionStorage.setItem('username', username);
					vm.isLoggedIn = true;
					$location.path('/users');
				} else
					vm.error = data.message;
			});
		};


		// function to handle logging out
		vm.doLogout = function() {
			Auth.logout();
			// reset all user info
			vm.user = {};
			$window.sessionStorage.removeItem('username');
			$location.path('/login');
		};


		vm.doRegister = function() {
			vm.processing = true;
			vm.error = '';

			Auth.register(vm.registerData.email, vm.registerData.username, vm.registerData.password).success(function(data) {
				vm.processing = false;
				// if a user successfully logs in, redirect to users page
				if (data.success !== false) {
					login(vm.registerData.username, vm.registerData.password);
				} else {
					vm.error = data.message;
				}
			});
		};


		vm.sendRegister = function() {
			var userData;
			User.getByUsername(vm.registerData.username).success(function(data) {
				if(data.length !== 0) {
					vm.error = 'Username already in use';
				} else {
					userData = {
						email: vm.registerData.email,
						//email: 'nicovilllalonga90@gmail.com',
						username: vm.registerData.username,
						password: vm.registerData.password
					};

					User.create(userData).success(function(data) {
						console.log(data);
						if(data.success === false) {
							//vm.error = data.message;
							vm.error = 'Email already in use';
						} else {
							Auth.sendRegister(vm.registerData.email, vm.registerData.username).error(function(data){
								console.log(data);
							});
							$location.path('/sendRegister');
						}
					});
				}
			});			
		}

	}]);