angular.module('taskService', [])
	.factory('Task', ['$http', '$window',
	function($http, $window) {

		/*function getDashboard(id) {
			return $http.get('/api/dashboard/' + id);
		};*/

		function remove(_id) {
			return $http.delete('/api/task/' + _id );
		};

		function createTask(task) {
			var newTask = {
				dashId: task.dashId,
				index: task.index,
				name: task.name,
				description: task.description,
		  		sprint: 0,
				storyPoints: 0,
				priority: 0,
				asignedTo: ""
			}

			return $http.post('/api/task', task);
		};

		return {
			createTask: createTask,
			remove: remove
		}
	}]);
	