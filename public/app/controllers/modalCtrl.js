angular.module('modalCtrl', [])
	.controller('modalController', ['$scope', '$routeParams', '$timeout', '$element', 'Dashboards', 'dashId', 'target', 'close',
	function($scope, $routeParams, $timeout, $element, Dashboards, dashId, target, close) {

		//var backdrop;
		var taskId = parseInt(target.currentTarget.id);
		var listName = target.currentTarget.parentNode.id;
		var task = Dashboards.getTask(listName, taskId);

		$scope.taskText = task.text;
		console.log(target);
		console.log('sampleController');
		

		/*$timeout(function() {
			//register the click outside the modal to destroy since its not implemented
			backdrop = document.querySelector('.fade');
			backdrop.addEventListener('click', function(e) {
				this.parentNode.removeChild(backdrop);
				//destroy the controller to remove the listener esc key pressed
				$scope.$destroy();
			});
		});*/

		$scope.close = function(result) {
			console.log(result);
	 		close(result, 500);
		};

		//allow close modal on escape key press	
		addEventListener('keydown', closeOnEscape);

		function closeOnEscape(e) {
			var ev = e.keyCode || e.which;
			if(ev === 27){
				$element.modal('hide');
				close(false, 500);
			}
		};

		//remove escape key press listener when modal is closed
		$scope.$on('$destroy', function(){
			removeEventListener('keydown', closeOnEscape);
		});
	}]);