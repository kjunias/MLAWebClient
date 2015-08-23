/**=========================================================
 * Module: SyslogController.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('SyslogController', SyslogController);
    
    SyslogController.$inject = ['$rootScope', '$scope', '$http', 'syslog', 'DTOptionsBuilder', 'BACKEND'];
    function SyslogController($rootScope, $scope, $http, syslog, DTOptionsBuilder, BACKEND) {
      var sc = this;

      $scope.dtOptions = DTOptionsBuilder.newOptions()
      .withLanguage({
        "sLengthMenu":     "_MENU_ entries / page",
        "sLoadingRecords": "Loading...",
        "sProcessing":     "Processing...",
        "sSearch":         "Filter:"
      });

      $scope.getLocalDate= function (date) {
        return new Date(date).toLocaleString();
      };

      $scope.onSyslogDateChange = function () {
        $rootScope.syslogRange.from.setHours(0,0,0);
        $rootScope.syslogRange.to.setHours(23,59,59);
      }

      $scope.refreshLogs = function () {
        var promise = syslog.getSyslogData()
        if(promise) {
          promise.then(function () {
            console.log('Loaded data');
          });
        }
      }

      $scope.addMoreLogs = function () {
        var promise = syslog.addSyslogData()
        if(promise) {
          promise.then(function () {
            console.log('Added more data');
          });
        }
      }
    }
})();
