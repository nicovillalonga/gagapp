angular.module('dashboardsCtrl', [])
	.controller('allDashController', ['$scope', '$location', '$window', 'Dashboards', 'ModalService',
	function($scope, $location, $window, Dashboards, ModalService) {

		var user = $window.sessionStorage.getItem('username');

		Dashboards.getAllDashboards(user).success(function(dashboards) {
			separateDashboards(dashboards);
		}).error(function(err) {
			console.log('Error on loading dashboards', err);
		});

		function isUser(usr) {
			return usr === user;
		};

		function separateDashboards(dashboards) {
			$scope.ownedDashboards = dashboards.filter(function(dash) {
				return isUser(dash.owner);
			});

			$scope.participantDashboards = dashboards.filter(function(dash) {
				return dash.participants.some(function(participant) {
					return isUser(participant.username);
				});
			});
		};

		$scope.selectDashboard = function(typeDash, index) {
			var dashboard = typeDash === 'owner' ? $scope.ownedDashboards : $scope.participantDashboards;
			var id = dashboard[index]._id;
			$location.path('/dashboard/' + id);
		};

		$scope.removeDash = function(index) {
			var id = $scope.ownedDashboards[index]._id;
			Dashboards.remove(id);
			$scope.ownedDashboards.splice(index, 1);
		};

		$scope.modalDashboard = function() {
		    ModalService.showModal({
			    templateUrl: "app/views/pages/dashboards/modalDashboard.html",
			    controller: "modalController",
			    inputs: {
			    	dashId: null,
			    	target: null,
			    	index: null
			    }
			}).then(function(modal) {
			    modal.element.modal();
			    modal.close.then(function(result) {
			    	Dashboards.getAllDashboards(user)
			    	.success(function(data) {
			    		separateDashboards(data);
			    	});
			    });
			}).catch(function(error) {
				console.log(error)
			});
		};
	}]);