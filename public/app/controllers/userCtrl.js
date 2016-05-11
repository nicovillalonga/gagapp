angular.module('userCtrl', ['userService', 'socketService'])

	// controller applied to user creation page
	.controller('userCreateController', ['$scope', '$location', '$window', 'User', 'Auth', 'socket',
	function($scope, $location, $window, User, Auth, socket) {
		
		if (!$window.sessionStorage.getItem('token')) {
			$location.path('/login');
		}

		// variable to hide/show elements of the view
		// differentiates between create or edit pages
		$scope.type = 'create';
		// function to create a user
		$scope.saveUser = function() {
			$scope.processing = true;
			// clear the message
			$scope.message = '';
			// use the create function in the userService
			/**TODO: refactor function in a service (same logic in mainCtrl)*/
			User.create($scope.userData).success(function(data) {
				console.log(data);
				if(data.success === false) {
					//$scope.error = data.message;
					$scope.processing = false;
					$scope.message = data.message;
				} else {
					$scope.message = 'user created! -- sending verification email to ' + $scope.userData.email;
					Auth.sendRegister($scope.userData.email, $scope.userData.username).success(function(data) {
						$scope.processing = false;
						socket.emit('user:new', data);
						$location.path('/sendRegister');
					})
					.error(function(data){
						$scope.processing = false;
						$scope.message = data.message;
					});
				}
			}).error(function(err) {
				console.log(err);
			});
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
		User.get(userId).success(function(data) {
			$scope.userData = data;
		});

		// function to save the user
		$scope.saveUser = function() {
			var exists;
			$scope.processing = true;
			$scope.message = '';

			User.getByUsername($scope.userData.username)
			.success(function (data) {
				exists = data.length > 0;
				if (!exists || (exists && data[0]._id === userId)) {
					User.update($routeParams.user_id, $scope.userData)
					.success(function(data) {
						$scope.processing = false;
						socket.emit('user:new', data);
						// clear the form
						$scope.userData = {};
						// bind the message from our API to $scope.message
						$scope.message = data.message;
					})
					.error(function(err) {
						$scope.message = 'Error while updating user';
					});
				} else {
					$scope.message = 'Username already in use';
				}				
			})
			.error(function(err) {
				$scope.message = 'Error while getting user';
			});
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
			User.all().success(function(data) {
				// when all the users come back, remove the processing variable
				$scope.processing = false;
				// bind the users that come back to $scope.users
				$scope.users = data;
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
			User.delete(id).success(function(data) {
				// get all users to update the table
				// you can also set up your api
				// to return the list of users with the delete call
				/*User.all().success(function(data) {
					$scope.processing = false;
					$scope.users = data;
				});*/

				// call server to do broadcast emit (everyone else)
				socket.emit('user:delete', {});
				// update for the client who delete
				$scope.getAllUsers();
			});
		};
	}]);