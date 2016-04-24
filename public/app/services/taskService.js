angular.module('taskService', [])
	.factory('Task', ['$http', '$window',
	function($http, $window) {

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

		function deleteTask(id, task) {
			return $http.delete('/api/task/' + id + '/' + task.dashId + '/' + task.listName);
		};

		return {
			createTask: createTask,
			deleteTask: deleteTask
		}
	}]);