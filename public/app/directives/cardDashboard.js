'use strict';
angular.module('cardDash', [])
.directive('cardDashboard', function() {
	return {
		//restrict: 'A',
		scope: {
			text: '@',
			select: '&',
			remove: '&'
		},
		templateUrl: 'app/views/pages/dashboards/cardDashboard.html'
	};
});