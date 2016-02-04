angular.module('dashboardsCtrl', [])
	.controller('allDashController', ['$scope', '$location', '$window', 'Dashboards', 'ModalService',
	function($scope, $location, $window, Dashboards, ModalService) {

		if($window.localStorage.getItem('listsUpdated') !== null) {
			$window.localStorage.removeItem('listsUpdated');
		}

		$scope.dashboards = Dashboards.getAllDashboards();

		$scope.selectDashboard = function(index) {
			var id = $scope.dashboards[index].id;
			$location.path('/dashboard/' + id);
		};

		$scope.removeDash = function(index) {
			$scope.dashboards.splice(index, 1);
		};

		$scope.modalDashboard = function() {
		    ModalService.showModal({
			    templateUrl: "app/views/pages/dashboards/modalDashboard.html",
			    controller: "modalController",
			    inputs: {
			    	dashId: null,
			    	target: null
			    }
			}).then(function(modal) {
			    modal.element.modal();
			    modal.close.then(function(result) {

			    });
			}).catch(function(error) {
				console.log(error)
			});
		};
	}]);