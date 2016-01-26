angular.module('dashboardCtrl', [])
	.controller('dashController', ['$scope', '$routeParams', 'Dashboards', '$timeout',
	function($scope, $routeParams, Dashboards, $timeout) {

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
					setData: _setData,
					onAdd: handleAdd,
					onUpdate: handleUpdate
				});
			});
		});

		 function handleUpdate(evt) {
	        Dashboards.updateIndex(evt.from.id, null, evt.oldIndex, evt.newIndex);
	    }

		function handleAdd(evt) {
			console.log('handleAdd');
			console.log(evt);

	        Dashboards.updateIndex(evt.from.id, evt.to.id, evt.oldIndex, evt.newIndex);
	    };

		function _setData(dataTransfer, dragEl) {
        	dataTransfer.setData('index', dragEl.textContent);
    	};
	}]);