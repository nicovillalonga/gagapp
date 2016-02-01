'use strict';
angular.module('cardTask', [])
.directive('cardTask', function() {
	return {
		restrict: 'A',
		scope: {
			name: '@'
		},
		templateUrl: 'app/views/pages/dashboards/cardTask.html'
	};
});