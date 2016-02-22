angular.module('dashboardCtrl', [])
	.controller('dashController', ['$scope', '$routeParams', '$timeout', '$window', 'Dashboards', 'ModalService',
	function($scope, $routeParams, $timeout, $window, Dashboards, ModalService) {

		var dashId = $routeParams.dashboard;

		Dashboards.getDashboard(dashId).success(function(dash) {
			$scope.lists = dash.lists;
			Dashboards.setActualDashboard(dash);
		}).error(function(err) {
			console.log('Error on loading Dashboard ' + dashId, err);
		});

		//need $timeout so dom finish renders before trying to getElementById
		$timeout(function() {
			var lists = $scope.lists;
			var el;
			//get the lists of the model and make them sortable
			lists.forEach(function(list) {
				el = document.getElementById(list.name);
				Sortable.create(el, {
					group: 'sort-list',
					animation: 150,
					onAdd: handleAdd,
					onUpdate: handleUpdate
				});
			});
		}, 2000);

		 function handleUpdate(evt) {
	        Dashboards.updateIndexes(evt.from.id, null, evt.oldIndex, evt.newIndex);
	    }

		function handleAdd(evt) {
	        Dashboards.updateIndexes(evt.from.id, evt.to.id, evt.oldIndex, evt.newIndex);
	    };

    	$scope.showModal = function(target) {
		    ModalService.showModal({
			    templateUrl: "app/views/pages/dashboards/modalTask.html",
			    controller: "modalController",
			    inputs: {
			    	dashId: dashId,
			    	target: target
			    }
			}).then(function(modal) {
			    modal.element.modal();
			    modal.close.then(function(result) {
			    	console.log(result);
			    });
			}).catch(function(error) {
				console.log(error)
			});
		};
	}]);