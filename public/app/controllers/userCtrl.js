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
			//little hack to get email, since is not geting value from ng-model
			//TODO: fix this.
			$scope.userData.email = $scope.userForm.email.$modelValue;
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
		var initialUserValue;
		// variable to hide/show elements of the view
		// differentiates between create or edit pages
		$scope.type = 'edit';

		User.get(userId)
		.then(function(user) {
			$scope.userData = {username: user.data.username, password: user.data.password};
			initialUserValue = {username: user.data.username, password: user.data.password};
		})
		.catch(function(err) {
			console.log(err);
		});

		// function to save the user
		$scope.saveUser = function() {
			var exists;
			var usernameInput = $scope.userForm.username;
			var passwordInput = $scope.userForm.password;
			var dataToUpdate = {};

			//check if the input value was changed and if its different from initial value, then save it in dataToUpdate
			if(usernameInput.$dirty && usernameInput.$modelValue !== initialUserValue.username) dataToUpdate.username = usernameInput.$modelValue;
			if(passwordInput.$dirty && passwordInput.$modelValue !== initialUserValue.password) dataToUpdate.password = passwordInput.$modelValue;

			$scope.processing = true;
			$scope.message = '';

			//dataToUpdate has no property, hence there was no new value in inputs.
			if(Object.getOwnPropertyNames(dataToUpdate).length === 0) {
				$scope.message = 'Change data to update';
			} else {
				User.getByUsername($scope.userData.username)
				.then(function(data) {
					exists = userExists(data.data);
					$scope.message = exists ? 'Username already in use' : $scope.message;
					(!exists && updateUser());
				})
				.catch(function(err) {
					$scope.message = 'Error while getting user';
				});
			}

			function userExists(data) {
				return (data.length > 0 && dataToUpdate.username !== undefined ? data[0].username === dataToUpdate.username : false);
			}

			function updateUser() {
				User.update($routeParams.user_id, dataToUpdate)
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
		};

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
