angular.module('dashboardCtrl', [])
	.controller('dashController', ['$scope', '$location', '$routeParams',
	function($scope, $location, $routeParams) {

		$scope.dashboards = [
			{
				"id" : 1,
				"text" : "dashboard 1",
				"lists" : [
					{
						"name" : "Todo",
						"tasks" : [
							{
								"id" : 1,
								"index": 0,
								"text" : "task 1"
							},
							{
								"id" : 9,
								"index": 1,
								"text" : "task 9"
							}
						]
					},
					{
						"name" : "Progress",
						"tasks" : [
							{
								"id" : 2,
								"index": 0,
								"text" : "task 2"
							}
						]
					},
					{
						"name" : "Done",
						"tasks" : []
					}
				]
			},
			{
				"id" : 2,
				"text" : "dashboard 2",
				"lists" : [
					{
						"name" : "Todo",
						"tasks" : [
							{
								"id" : 3,
								"text" : "task 3"
							}
						]
					}
				]
			},
			{
				"id" : 3,
				"text" : "dashboard 3",
				"lists" : []
			}
		];

		if($routeParams.dashboard) {
			$scope.lists = $scope.dashboards[$routeParams.dashboard-1].lists;
		}

		$scope.selectDashboard = function(index) {
			var id = $scope.dashboards[index].id;
			$location.path('/dashboards/' + id);
		};

		$scope.removeDash = function(index) {
			$scope.dashboards.splice(index, 1);
		};

		window.onload = function() {
			var lists = $scope.dashboards[0].lists;
			var el;
			lists.forEach(function(list) {
				el = document.getElementById(list.name);
				Sortable.create(el, {
					group: 'sort-list',
					animation: 100,
					onSort: handleSorting,
					onMove: handleMoving,
					setData: _setData
				});
			});
		};

		function handleSorting(evt) {
			console.log('handleSorting');
			console.log(evt);
		};

		function handleMoving(evt) {
			console.log('handleMoving');
		};

		function _setData(dataTransfer, dragEl) {
			console.log(dataTransfer);
			console.log(dragEl);
        	dataTransfer.setData('index', dragEl.textContent);
			console.log(dataTransfer);
    	};
	}]);