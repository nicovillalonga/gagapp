'use strict';
angular.module('cardDash', [])
.directive('cardDashboard', function() {
	return {
		//restrict: 'A',
		scope: {
			text: '@',
			owner: '=',
			select: '&',
			remove: '&'
		},
		templateUrl: 'app/views/pages/dashboards/cardDashboard.html'
	};
});