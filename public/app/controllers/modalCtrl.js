angular.module('modalCtrl', [])
	.controller('modalController', ['$scope', '$routeParams', '$timeout', '$element', '$window', 'Dashboards', 'Task', 'dashId', 'target', 'index', 'close',
	function($scope, $routeParams, $timeout, $element, $window, Dashboards, Task, dashId, target, index, close) {
		
		var taskId;
		var listName;
		var task;

		function init(){
			if(dashId && target) {
				taskId = target.currentTarget.id;
				listName = target.currentTarget.parentNode.id;
				task = Dashboards.getTask(listName, taskId);

				$scope.taskName = task.name;
				$scope.taskDescription = task.description;
				$scope.activities = task.activities;
			}			
		};

		init();
		

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

		$scope.createDashboard = function() {
			var user = $window.sessionStorage.getItem('username');

			Dashboards.createDashboard($scope.dashName, user);
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

			Task.createTask(task).success(function(dash) {
				$scope.taskCreated = true;
				$scope.close();
			}).error(function(err) {
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

			Task.deleteTask(taskId, taskToDelete).success(function(dash) {
				$scope.close();
			}).error(function(err) {
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
			close($scope.taskCreated, 500);
		});

		function saveActivitie(type, activitie) {
			var id = Math.floor((Math.random() * 100) + 1);
			var date = new Date();
			date = date.toString().split(' ').slice(0, -2).join(' ');
			var newActivitie = {
				"id": id,
				"date": date,
				"user": $window.sessionStorage.getItem('username'),
				"type": type,
				"activitie": activitie
			};
			
			task.activities.push(newActivitie);
		};

		$scope.saveDescription = function(evt) {
			var description = document.querySelector('.description').value;
			saveActivitie('description', description);
		};

		$scope.saveComment = function(evt) {
			var comment = document.querySelector('.comment').value;
			saveActivitie('comment', comment);
		};
	}]);