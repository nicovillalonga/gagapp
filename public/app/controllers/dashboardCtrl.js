angular.module('dashboardCtrl', [])
	.controller('dashController', ['$scope', '$routeParams', '$timeout', '$window', 'Dashboards', 'ModalService', 'Task',
	function($scope, $routeParams, $timeout, $window, Dashboards, ModalService, Task) {

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
		}, 700);

		 function handleUpdate(evt) {
	        Dashboards.updateIndexes(evt.from.id, null, evt.oldIndex, evt.newIndex);
	    }

		function handleAdd(evt) {
	        Dashboards.updateIndexes(evt.from.id, evt.to.id, evt.oldIndex, evt.newIndex);
	    };

    	$scope.showModal = function(type, target) {
    		var view = type === "view" ? "modalTask.html" : "createTask.html";
    		var template = "app/views/pages/dashboards/" + view;
		    ModalService.showModal({
			    templateUrl: template,
			    controller: "modalController",
			    inputs: {
			    	dashId: dashId,
			    	target: target
			    }
			}).then(function(modal) {
			    modal.element.modal();
			    /*modal.close.then(function(result) {
			    });*/
			}).catch(function(error) {
				console.log(error)
			});
		};

		$scope.createTask = function() {
			Task.createTask(dashId).success(function(dash) {
				console.log('Success on creating Task ');
			}).error(function(err) {
				console.log('Error on creating Task ' + err);
			});
		}
	}]);