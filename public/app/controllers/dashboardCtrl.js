angular.module('dashboardCtrl', [])
	.controller('dashController', ['$scope', '$routeParams', 'Dashboards', '$timeout', '$window', 'ModalService',
	function($scope, $routeParams, Dashboards, $timeout, $window, ModalService) {

		var dashId = parseInt($routeParams.dashboard);

		$scope.lists = Dashboards.getDashboard(dashId).lists;

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
					//setData: _setData,
					onAdd: handleAdd,
					onUpdate: handleUpdate
				});
			});
		});

		 function handleUpdate(evt) {
	        Dashboards.updateIndexes(evt.from.id, null, evt.oldIndex, evt.newIndex);
	    }

		function handleAdd(evt) {
	        Dashboards.updateIndexes(evt.from.id, evt.to.id, evt.oldIndex, evt.newIndex);
	    };

	    angular.element($window).on('storage', function(evt) {
	    	var store;
	    	//listen for updated localStorage (only for setItem)
		    if (event.key === 'listsUpdated' && evt.newValue) {
		      store = JSON.parse(evt.newValue);
		      $scope.lists = store.lists;
		      Dashboards.updateActualLists(store.lists);
		      $scope.$apply();
		    }
  		});

		/*function _setData(dataTransfer, dragEl) {
        	dataTransfer.setData('index', dragEl.textContent);
    	};*/

    	$scope.showModal = function(target) {
		    ModalService.showModal({
			    templateUrl: "app/views/pages/dashboards/modal.html",
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