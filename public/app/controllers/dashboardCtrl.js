angular.module('dashboardCtrl', [])
	.controller('dashController', ['$scope', '$routeParams', 'Dashboards', '$timeout',
	function($scope, $routeParams, Dashboards, $timeout) {

		$scope.lists = Dashboards.getDashboard(0).lists;

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
					onSort: handleSorting
				});
			});
		});

		function handleSorting(evt) {
			console.log('handleSorting');
			console.log(evt);
		};

		function _setData(dataTransfer, dragEl) {
			console.log(dataTransfer);
        	dataTransfer.setData('index', dragEl.textContent);
			console.log(dataTransfer);
    	};

	}]);