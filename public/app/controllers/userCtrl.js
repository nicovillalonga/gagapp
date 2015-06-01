angular.module('userCtrl', ['userService'])

	// controller applied to user creation page
	.controller('userCreateController', ['User', '$location', '$window', function(User, $location, $window) {
		
		if (!$window.sessionStorage.getItem('token')) {
			$location.path('/login');
		}

		var vm = this;

		// variable to hide/show elements of the view
		// differentiates between create or edit pages
		vm.type = 'create';
		// function to create a user
		vm.saveUser = function() {
			vm.processing = true;
			// clear the message
			vm.message = '';
			// use the create function in the userService
			User.create(vm.userData).success(function(data) {
				vm.processing = false;
				// clear the form
				vm.userData = {};
				vm.message = data.message;
			});
		};
	}])

	// controller applied to user edit page
	.controller('userEditController', ['$routeParams', 'User', function($routeParams, User) {
		var vm = this,
			userId = $routeParams.user_id;
			
		// variable to hide/show elements of the view
		// differentiates between create or edit pages
		vm.type = 'edit';
		// get the user data for the user you want to edit
		// $routeParams is the way we grab data from the URL
		User.get(userId).success(function(data) {
			vm.userData = data;
		});

		// function to save the user
		vm.saveUser = function() {
			var existe;
			vm.processing = true;
			vm.message = '';
			/*User.get(vm.userData.username)

				.success(function(data) {
					vm.message = 'Username already exists';
				})

				.error(function(data) {*/
					// call the userService function to update
			User.getByUsername(vm.userData.username).success(function (data) {
				existe = data.length > 0 ? true : false;
				if (!existe || (existe && data[0]._id === userId)) {
					User.update($routeParams.user_id, vm.userData).success(function(data) {
						vm.processing = false;
						// clear the form
						vm.userData = {};
						// bind the message from our API to vm.message
						vm.message = data.message;
					});
					//});
				} else {
					vm.message = 'Username already in use';
				}				
			});

		};
	}])

	// user controller for the main page
	// inject the User factory
	.controller('userController', ['User', function(User) {
		var vm = this;
			
		// set a processing variable to show loading things
		vm.processing = true;
		// grab all the users at page load
		User.all().success(function(data) {
			// when all the users come back, remove the processing variable
			vm.processing = false;
			console.log(data);
			// bind the users that come back to vm.users
			vm.users = data;
		});

		// function to delete a user
		vm.deleteUser = function(id) {
			vm.processing = true;
			// accepts the user id as a parameter
			User.delete(id).success(function(data) {
				// get all users to update the table
				// you can also set up your api
				// to return the list of users with the delete call
				User.all().success(function(data) {
					vm.processing = false;
					vm.users = data;
				});
			});
		};
	}]);