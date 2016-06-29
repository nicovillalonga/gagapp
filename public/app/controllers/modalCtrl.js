angular.module('modalCtrl', [])
	.controller('modalController', ['$scope', '$routeParams', '$timeout', '$element', '$window', 'Dashboards', 'Task', 'User', 'dashId', 'target', 'index', 'close',
	function($scope, $routeParams, $timeout, $element, $window, Dashboards, Task, User, dashId, target, index, close) {

		var taskId;
		var listName;
		var task;

		activate();

		function activate() {
			$scope.usersList = [];
			$scope.selectedParticipants = [];
			var userLogged = $window.sessionStorage.getItem('username');			
			
			Dashboards.getDashboard(dashId)
			.then(function(dash) {
				$scope.participants = dash.data.participants;	
				if (userLogged === dash.data.owner) {
					User.all().then(function(users) {
						angular.forEach(users.data, function(user) {
							if (user.username !== userLogged && !isParticipant(user.username)) {
								$scope.usersList.push(user);
							}
						});
					});
				}
			}).catch(function(err) {
				console.log('Error' + err);
			});							
		};		

		function isParticipant(username) {
			return $scope.participants.indexOf(username) >= 0;
		};

		if(dashId && target) {
			taskId = target.currentTarget.id;
			listName = target.currentTarget.parentNode.id;
			task = Dashboards.getTask(listName, taskId);

			console.log('task', task);

			$scope.taskName = task.name;
			$scope.taskDescription = task.description;
			$scope.activities = task.activities;
		}


		/*var background;
		var modalContent;
		var modalContentClicked = false;

		$timeout(function() {
			//register the click outside the modal to destroy since its not implemented
			modalContent = document.querySelector('.modal-content');
			background = document.querySelector('.fade');

			//set click listener to modal content to avoid destroy when its clicked
			modalContent.addEventListener('click', setModalContentClicked);

			function setModalContentClicked(e) {
				console.log('modal-content', e);
				modalContentClicked = true;
			};

			//set click listener to modal background to destroy
			background.addEventListener('click', backgroundClicked);

			function backgroundClicked(e) {
				console.log('background', e);
				if(!modalContentClicked) {
					console.log(modalContentClicked);
					$element.modal('hide');
					close(false, 500);
					//destroy the controller to remove the listener esc key pressed
					$scope.$destroy();
				}

				modalContentClicked = false;
			};
		});*/
		$scope.selectParticipant = function(username) {
			var idx = $scope.selectedParticipants.indexOf(username);

		    // is currently selected
		    if (idx > -1) {
		      $scope.selection.splice(idx, 1);
		    }

		    // is newly selected
		    else {
		      $scope.selectedParticipants.push(username);
		    }
		}

		$scope.inviteParticipant = function() {			
			if ($scope.selectedParticipants.length > 0) {
				var dataToUpdate = {};
				dataToUpdate.participants = $scope.selectedParticipants;
				Dashboards.addParticipants(dashId, dataToUpdate)
				.then(function(dash) {
					$scope.message = dash.data.message;	
					$scope.close();				
				});
			}
		};

		$scope.createDashboard = function() {
			var user = $window.sessionStorage.getItem('username');

			Dashboards.createDashboard($scope.dashName, user)
			.catch(function(err){
				console.log(err);
			});
			$scope.close();
		};

		$scope.createTask = function() {
			var name = document.querySelector('.name').value;
			var description = document.querySelector('.description').value;
			var task = {
				dashId: dashId,
				name: name,
				description: description,
				index: index
			};

			Task.createTask(task)
			.then(function(dash) {
				$scope.taskSuccess = true;
				$scope.close();
			}).catch(function(err) {
				console.log('Error on creating Task ' + err);
			});
		};

		$scope.close = function() {
			$element.modal('hide');
			$scope.$destroy();
		};

		$scope.delete = function() {
			var taskToDelete = {
				dashId: dashId,
				listName: listName
			};

			Task.deleteTask(taskId, taskToDelete)
			.then(function(task) {
				$scope.taskSuccess = true;
				$scope.close();
			}).catch(function(err) {
				console.log('Error on deleting Task ' + err);
			});
		}

		//allow close modal on escape key press
		addEventListener('keydown', closeOnEscape);

		function closeOnEscape(e) {
			var ev = e.keyCode || e.which;
			if(ev === 27){
				$scope.close();
			}
		};

		//remove escape key press listener when modal is closed
		$scope.$on('$destroy', function(){
			removeEventListener('keydown', closeOnEscape);
			close($scope.taskSuccess, 500);
		});

		function saveActivity(type, text) {
			var date = new Date();
			date = date.toString().split(' ').slice(0, -2).join(' ');
			var newActivity = {
				"date": date,
				"user": $window.sessionStorage.getItem('username'),
				"type": type,
				"text": text
			};

			Task.saveActivity(newActivity, taskId, listName)
			.then(function(data) {
				console.log('data', data);
				console.log('$scope.activities', $scope.activities);
				$scope.activities.push(data.data.activity);
				console.log('$scope.activities', $scope.activities);
			});
		};

		$scope.saveDescription = function(evt) {
			var description = document.querySelector('.description').value;
			saveActivity('description', description);
		};

		$scope.saveComment = function(evt) {
			var comment = document.querySelector('.comment').value;
			saveActivity('comment', comment);
		};
	}]);
