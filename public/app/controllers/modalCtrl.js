angular.module('modalCtrl', [])
	.controller('modalController', ['$scope', '$routeParams', '$timeout', '$element', '$window', 'Dashboards', 'dashId', 'target', 'close',
	function($scope, $routeParams, $timeout, $element, $window, Dashboards, dashId, target, close) {
		
		console.log(target);
		var background;
		var modalContent;
		var modalContentClicked = false;
		var taskId = parseInt(target.currentTarget.id);
		var listName = target.currentTarget.parentNode.id;
		var task = Dashboards.getTask(listName, taskId);
		var editedTask = {};

		$scope.taskName = task.name;
		$scope.taskDescription = task.description;
		$scope.activities = task.activities;
		
		console.log('sampleController');
		

		/*$timeout(function() {
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

		$scope.close = function(result) {
	 		$scope.$destroy();
		};

		//allow close modal on escape key press	
		addEventListener('keydown', closeOnEscape);

		function closeOnEscape(e) {
			var ev = e.keyCode || e.which;
			if(ev === 27){
				$element.modal('hide');
				$scope.$destroy();
			}
		};

		//remove escape key press listener when modal is closed
		$scope.$on('$destroy', function(){
			console.log('destroy');
			removeEventListener('keydown', closeOnEscape);
			close(task, 500);
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