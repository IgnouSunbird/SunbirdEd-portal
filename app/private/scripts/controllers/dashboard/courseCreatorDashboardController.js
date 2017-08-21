'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller: courseAdminCreationDashboard
 * @description: courseDashboardCtrl controller of the playerApp
 * @author: nilesh_m@tekditechnologies.com
 */
angular.module('playerApp')
    .controller('courseCreatorDashboardCtrl',
    	['$rootScope', '$scope', 'dashboardService', '$timeout', '$state', '$stateParams', 'toasterService',
    	'permissionsService', 'learnService', function ($rootScope, $scope, dashboardService, $timeout, $state, $stateParams, toasterService, permissionsService, learnService) {

    	// Initialize variables
		var courseDashboard = this;
		courseDashboard.chartHeight   = 110;
  		courseDashboard.myCoursesList = [];
  		courseDashboard.courseIdentifier = '';
  		courseDashboard.filterTimePeriod = '7d';
  		courseDashboard.filterQueryTextMsg = '7 days';

  		// Dataset - consumption
  		courseDashboard.dataset   = 'consumption';
  		courseDashboard.graphShow = 0;

  		// Variables to show loader/errorMsg/warningMsg
  		courseDashboard.showLoader = true;
  		courseDashboard.showError  = false;
  		courseDashboard.errorMsg   = '';
  		courseDashboard.showWarningMsg = false;

		/**
		 * @Function to load dashboard
		 * @params apis request body
		 * @return void
		 */
		function getCourseDashboardData(){
			// Build request body
			courseDashboard.filterTimePeriod = courseDashboard.filterTimePeriod ? courseDashboard.filterTimePeriod : '7d';
			var request = {
				courseId: courseDashboard.courseIdentifier,
				timePeriod: courseDashboard.filterTimePeriod
			};

			// Call dashboard service
			dashboardService.getCourseDashboardData(request, courseDashboard.dataset).then(function (apiResponse) {
				if (apiResponse && apiResponse.responseCode === 'OK'){
					courseDashboard.consumptionNumericData = [];
					courseDashboard.data   = [];

					// To print block data
					angular.forEach(apiResponse.result.snapshot,function(numericData, key){
						if (key != 'course.consumption.users_completed'){
							dashboardService.secondsToMin(numericData)
						}
						courseDashboard.consumptionNumericData.push(numericData);
					})

					// To print line chart
					var bucketkeys = [];
					angular.forEach(apiResponse.result.series, function(bucketData, key) {
	                  	if (bucketkeys.indexOf(key) == -1) {
	                    	bucketkeys.push(key);
	                    	var dataArray = [];
	                   		var labels    = [];
	                    	var data      = [];

	                   		angular.forEach(bucketData.buckets, function(bucketValue, bucketKey) {
	                      		dataArray.push(bucketValue.value);
	                      		labels.push(bucketValue.key_name);
	                    	})

	                    	data.push(dataArray);
	                    	var options = dashboardService.getChartOptions(bucketData.name);
	                    	var colors  = dashboardService.getChartColors('consumption');
	                    	var series  = [bucketData.name];

	                   		var found = false;
	                    	for (var j = 0; j < courseDashboard.data.length; j++) {
	                      		if (courseDashboard.data[j][5] == bucketData.group_id) {
	                        		found = true;
	                        		break;
	                      		}
	                    	}
	                    	if (found == true) {
	                      		var d = courseDashboard.data[j][2];
	                      		courseDashboard.data[j][2].push(dataArray);
	                      		//courseDashboard.data.push
	                    	} else {
	                      		courseDashboard.data.push([series, labels, data, colors, options, bucketData.group_id]);
	                    	}
	                  	}
	                });

					courseDashboard.showLoader = false;
					courseDashboard.showError  = false;
				} else {
					// Show error div
					courseDashboard.showErrors(apiResponse);
				}
				console.log('Response received');
			}).catch(function (apiResponse) {
				// Show error div
				courseDashboard.showErrors(apiResponse);
			});
		}

		/**
		 * @Function onAfterFilterChange
		 * @Description load data based on selected filter
		 * @Params item
		 * @Return {[type]} [description]
		 */
		courseDashboard.onAfterFilterChange = function (item){
			// Check old filter value. If old value and new filter value are same
			if (courseDashboard.filterTimePeriod === angular.element(item).data('timeperiod')){
				console.log('avoid same apis call twice');
				return false;
			}

			courseDashboard.filterTimePeriod   = angular.element(item).data('timeperiod');
			courseDashboard.filterQueryTextMsg = angular.element(item).data('timeperiod-text');
			courseDashboard.showLoader         = true;
			getCourseDashboardData();
		};

		/**
		 * @Function loadData
		 * @Description load data
		 * @Params
		 * @Return void
		 */
		courseDashboard.loadData = function(){
			// Get list of my courses
			learnService.enrolledCourses($rootScope.userId).then(function (apiResponse) {
	            if (apiResponse && apiResponse.responseCode === 'OK') {
	            	if (apiResponse.result.courses.length > 0){
	            		courseDashboard.myCoursesList = apiResponse.result.courses;
	               		var firstChild = _.first(_.values(courseDashboard.myCoursesList), 1);
	               		courseDashboard.courseIdentifier = firstChild.courseId;
	               		getCourseDashboardData('7d');
	            	}else {
	            		courseDashboard.showLoader = false;
	            		courseDashboard.showWarningMsg = true;
	            	}

	            } else {
	            	// Show error div
					courseDashboard.showErrors(apiResponse);
	            }
	        }).catch(function (apiResponse) {
	            // Show error div
				courseDashboard.showErrors(apiResponse);
	        });
		};

		/**
		 * @function showErrors
		 * @description show error messages
		 * @param {object} [apiResponse]
		 */
		courseDashboard.showErrors = function(apiResponse){
			courseDashboard.showError  = true;
			courseDashboard.showLoader = false;
			courseDashboard.errorMsg   = apiResponse.params.errmsg;
			toasterService.error(apiResponse.params.errmsg);
		};

		courseDashboard.onAfterCourseChange = function(courseId){
			if (courseDashboard.courseIdentifier == courseId){
				console.log('avoid same apis call twice');
				return false;
			}

			courseDashboard.courseIdentifier = courseId;
			courseDashboard.showLoader       = true;
			getCourseDashboardData();
		}

		/**
		 * @Function initMyCoursesDropdown
		 * @Description show list my courses
		 * @return  {[type]}  [description]
		 */
		courseDashboard.initDropdwon = function(){
			$('#myCoursesListFilter').dropdown({
				onChange: function(){}
			});
		};

      	courseDashboard.nextGraph = function() {
        	courseDashboard.graphShow++;
      	}

      	courseDashboard.previousGraph = function() {
        	courseDashboard.graphShow--;
      	}
	}])
