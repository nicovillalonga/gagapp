angular.module('dashboardCtrl', [])
	.controller('dashController', ['$rootScope', '$scope', '$routeParams', 'Dashboards', '$timeout', '$window',
	function($rootScope, $scope, $routeParams, Dashboards, $timeout, $window) {

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
					animation: 100,
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
	    	//listen for updated localStorage (when setItem)
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
	}]);