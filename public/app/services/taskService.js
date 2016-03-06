angular.module('taskService', [])
	.factory('Task', ['$http', '$window',
	function($http, $window) {

		/*function getDashboard(id) {
			return $http.get('/api/dashboard/' + id);
		};*/

		function remove(_id) {
			return $http.delete('/api/task/' + _id );
		};

		function createTask(dashId) {
			var task = {
				dashId: dashId,
				index: 0,
		  		sprint: 0,
				storyPoints: 0,
				priority: 0,
				name: "Nueva Task",
				description: "Nueva Task description",
				asignedTo: ""
			}

			return $http.post('/api/task', task);
		};

		return {
			createTask: createTask,
			remove: remove
		}
	}]);