angular.module('dashboardsCtrl', [])
	.controller('allDashController', ['$scope', '$location', '$window', 'Dashboards', 'ModalService',
	function($scope, $location, $window, Dashboards, ModalService) {

		if($window.localStorage.getItem('listsUpdated') !== null) {
			$window.localStorage.removeItem('listsUpdated');
		}

		var user = $window.sessionStorage.getItem('username');

		Dashboards.getAllDashboards(user).success(function(dashboards) {			
			$scope.dashboards = dashboards;
		}).error(function(err) {
			console.log('Error on loading dashboards', err);
		})

		$scope.selectDashboard = function(index) {
			var id = $scope.dashboards[index]._id;
			$location.path('/dashboard/' + id);
		};

		$scope.removeDash = function(index) {		
			var id = $scope.dashboards[index]._id;	
			Dashboards.remove(id);
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
			    	Dashboards.getAllDashboards()
			    	.success(function(data) {
			    		$scope.dashboards = data;
			    	});
			    });
			}).catch(function(error) {
				console.log(error)
			});
		};
	}]);