angular.module('dashboardsService', [])
	.factory('Dashboards', ['$http', '$window',
	function($http, $window) {

		var actualDash;

		function getAllDashboards(owner) {
			return $http.get('/api/dashboards/' + owner);
		}

		function remove(_id) {
			return $http.delete('/api/dashboard/' + _id );
		}

		function _sortDashboard(lists) {
			lists.forEach(function(list) {
				list.tasks.sort(function(a, b) {
					return a.index - b.index;
				});
			});
		}

		function getDashboard(id) {
			return $http.get('/api/dashboard/' + id);
		}

		function createDashboard(text, owner) {
			return $http.post('/api/dashboards', {"text": text, "owner": owner});
		}

		function updateIndexes(listName, listNameTarget, oldIndex, newIndex) {
			var listTarget,
				tasksTarget,
				listToUpdate = [];
			var list = actualDash.lists.slice().find(function(list) {
				return list.name === listName;
			});
			var tasks = list.tasks;

			//if listNameTarget === null -> the sort is in the same list
			//else sorting among two lists
			if(listNameTarget === null) {
				//move the selected element from its original position to new index position.
				tasks.splice(newIndex, 0, tasks.splice(oldIndex, 1)[0]);
			} else {
				listTarget =  actualDash.lists.find(function(list) {
					return list.name === listNameTarget;
				});
				tasksTarget = listTarget.tasks;

				//remove element from original list and insert to target list
				tasksTarget.splice(newIndex, 0, tasks.splice(oldIndex, 1)[0]);
				//update the indexes of the target list
				_setListIndexes(tasksTarget, newIndex);
				listToUpdate.push(listTarget);
			}

			//update the indexes of original list
			_setListIndexes(tasks, oldIndex);
			listToUpdate.push(list);
			return $http.put('/api/updateTaskIndexes/', {"lists": listToUpdate});
		}

		function _setListIndexes(tasks, index) {
			var length = tasks.length;
			var i = index > 0 ? index-1 : 0;

			if(tasks.length > 0) {
				for (i; i < length; i++) {
					tasks[i].index = i;
				}
			}
		}

		function getTask(listName, taskId) {
			return actualDash.lists.find(function(list) {
					return list.name === listName;
				}).tasks.find(function(task) {
					return task._id === taskId;
				});
		}

		function setActualDashboard(dashboard) {
			actualDash = dashboard;
		}

		return {
			createDashboard: createDashboard,
			getAllDashboards: getAllDashboards,
			remove: remove,
			getDashboard: getDashboard,
			getTask: getTask,
			updateIndexes: updateIndexes,
			setActualDashboard: setActualDashboard
		};

	}]);
