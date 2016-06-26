angular.module('dashboardsService', [])
	.factory('Dashboards', ['$http', '$window',
	function($http, $window) {

		var actualDash;

		function addParticipants(id, participants) {
			return $http.put('/api/dashboard/' + id, participants);
		}

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

		function getTask(listName, taskId) {
			return actualDash.lists.find(function(list) {
					return list.name === listName;
				}).tasks.find(function(task) {
					return task._id === taskId;
				});
		}

		function getActualDashboard() {
			return actualDash;
		}

		function setActualDashboard(dashboard) {
			actualDash = dashboard;
		}		

		return {
			addParticipants: addParticipants,
			createDashboard: createDashboard,
			getAllDashboards: getAllDashboards,
			remove: remove,
			getDashboard: getDashboard,
			getTask: getTask,
			getActualDashboard: getActualDashboard,
			setActualDashboard: setActualDashboard
		};

	}]);
