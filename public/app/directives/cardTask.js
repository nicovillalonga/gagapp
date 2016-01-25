'use strict';
angular.module('cardTask', [])
.directive('cardTask', function() {
	return {
		restrict: 'A',
		scope: {
			text: '@'
		},
		templateUrl: 'app/views/pages/dashboards/cardTask.html'
	};
});