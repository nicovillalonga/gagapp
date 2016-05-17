angular.module('dashboardCtrl', [])
	.controller('dashController', ['$scope', '$routeParams', '$timeout', '$window', 'Dashboards', 'ModalService', 'Task',
	function($scope, $routeParams, $timeout, $window, Dashboards, ModalService, Task) {

		var dashId = $routeParams.dashboard;
		var dashLoaded = false;

		updateDashboard();

		function updateDashboard() {
			Dashboards.getDashboard(dashId)
			.then(function(dash) {
				$scope.lists = dash.data.lists;
				dashLoaded = true;
				Dashboards.setActualDashboard(dash.data);
			}).catch(function(err) {
				console.log('Error on loading Dashboard ' + dashId, err);
			});
		};

		//need $timeout so dom finish renders before trying to getElementById
		(function createSortable() {
			if(!dashLoaded) {
				$timeout(function() {
					createSortable();
				}, 400);
			} else {
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
			}
		})();

		 function handleUpdate(evt) {
	        Dashboards.updateIndexes(evt.from.id, null, evt.oldIndex, evt.newIndex);
	    }

		function handleAdd(evt) {
	        Dashboards.updateIndexes(evt.from.id, evt.to.id, evt.oldIndex, evt.newIndex);
	    }

    	$scope.showModal = function(target, opts) {
    		var index = (opts && opts.index) || 0;
    		var view = opts && opts.type ? "createTask.html" : "modalTask.html";
    		var template = "app/views/pages/dashboards/" + view;
		    ModalService.showModal({
			    templateUrl: template,
			    controller: "modalController",
			    inputs: {
			    	dashId: dashId,
			    	target: target,
			    	index: index
			    }
			}).then(function(modal) {
			    modal.element.modal();
			    modal.close.then(function(result) {
			    	(result && updateDashboard());
			    });
			}).catch(function(error) {
				console.log(error);
			});
		};

		function getLastIndexList(listName) {
			return $scope.lists.filter(function(list) {
				return list.name === listName;
			})[0].tasks.length;
		}

		$scope.createTask = function() {
			var opts = {
				type: 'task',
				index: getLastIndexList('Backlog')
			};

			$scope.showModal(null, opts);
		};
	}]);
