angular.module('taskService', [])
	.factory('Task', ['$http', '$window', 'Dashboards',
	function($http, $window, Dashboards) {

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
			};

			return $http.post('/api/task', task);
		}

		function deleteTask(id, task) {
			return $http.delete('/api/task/' + id + '/' + task.dashId + '/' + task.listName);
		}

		function updateIndexes(listName, listNameTarget, oldIndex, newIndex) {
			var targetList;
			var actualDash = Dashboards.getActualDashboard();
			var list = actualDash.lists.slice().find(function(list) {
				return list.name === listName;
			});
			var reqObj = {
				"originListId": list._id,
				"oldIndex": oldIndex,
				"newIndex": newIndex
			};

			//if listNameTarget === null -> the sort is in the same list
			//else sorting among two lists
			if(listNameTarget === null) {
				return $http.post('/api/updateSingleListIndex/', reqObj);
			} else {
				targetList =  actualDash.lists.find(function(list) {
					return list.name === listNameTarget;
				});
				reqObj.targetListId = targetList._id;
				return $http.post('/api/updateMultiListIndex/', reqObj);
			}
		}

		return {
			createTask: createTask,
			updateIndexes: updateIndexes,
			deleteTask: deleteTask
		};
	}]);
