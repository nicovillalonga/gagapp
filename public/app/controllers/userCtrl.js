angular.module('userCtrl', ['userService', 'socketService'])

	// controller applied to user creation page
	.controller('userCreateController', ['$scope', '$rootScope', '$location', '$window', 'User', 'Auth', 'socket',
	function($scope, $rootScope, $location, $window, User, Auth, socket) {
		
		if (!$window.sessionStorage.getItem('token')) {
			$location.path('/login');
		}

		// variable to hide/show elements of the view
		// differentiates between create or edit pages
		$scope.type = 'create';

		$rootScope.$on('registerFinishEvt', function(evt, message) {
			$scope.message = message;
		});

		// function to create a user
		$scope.saveUser = function() {
			$scope.processing = true;
			// clear the message
			$scope.message = '';
			$rootScope.$broadcast('sendRegisterEvt', $scope.userData);
		};
	}])

	// controller applied to user edit page
	.controller('userEditController', ['$scope', '$routeParams', 'User', 'socket',
	function($scope, $routeParams, User, socket) {
		var userId = $routeParams.user_id;
		
		// variable to hide/show elements of the view
		// differentiates between create or edit pages
		$scope.type = 'edit';
		// get the user data for the user you want to edit
		// $routeParams is the way we grab data from the URL
		User.get(userId)
		.then(function(user) {
			$scope.userData = user.data;
		})
		.catch(function(err) {
			console.log(err);
		});

		// function to save the user
		$scope.saveUser = function() {
			var exists;
			$scope.processing = true;
			$scope.message = '';

			User.getByUsername($scope.userData.username)
			.then(function(data) {
				exists = data.data.length > 0;
				$scope.message = exists ? 'Username already in use' : $scope.message;
				(!exists && updateUser());
			})
			.catch(function(err) {
				$scope.message = 'Error while getting user';
			});

			function updateUser() {
				User.update($routeParams.user_id, $scope.userData)
				.then(function(user) {
					$scope.processing = false;
					socket.emit('user:new', user.data);
					// clear the form
					$scope.userData = {};
					$scope.message = user.data.message;
				})
				.catch(function(err) {
					console.log(err);
					$scope.message = err;
				});
			}
		};
	}])

	// user controller for the main page
	// inject the User factory
	.controller('userController', ['$scope', 'User', 'socket',
	function($scope, User, socket) {
		// funtion to get all the users
		$scope.getAllUsers = function(){			
			// set a processing variable to show loading things
			$scope.processing = true;
			// grab all the users at page load
			User.all()
			.then(function(users) {
				// when all the users come back, remove the processing variable
				$scope.processing = false;
				$scope.users = users.data;
			})
			.catch(function(err) {
				console.log(err);
			});
		}

		$scope.getAllUsers();

		// this metod will emited by the server
		socket.on('user:update', function (data) {
			console.log('userController: ' + data);
			$scope.getAllUsers();
		});

		// function to delete a user
		$scope.deleteUser = function(id) {
			
			// accepts the user id as a parameter
			User.delete(id)
			.then(function() {
				// call server to do broadcast emit (everyone else)
				socket.emit('user:delete', {});
				// update for the client who delete
				$scope.getAllUsers();
			});
		};
	}]);
