angular.module('modalDashCtrl', [])
	.controller('modalDashController', ['$scope', '$routeParams', '$timeout', '$element', '$window', 'Dashboards', 'close',
	function($scope, $routeParams, $timeout, $element, $window, Dashboards, close) {
		
		console.log('modalDash');
		var background;
		var modalContent;
		var modalContentClicked = false;
		

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
			removeEventListener('keydown', closeOnEscape);
			close(false, 500);
		});
	}]);