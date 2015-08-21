/**=========================================================
 * Module: SyslogController.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('SyslogController', SyslogController);
    
    SyslogController.$inject = ['$rootScope', '$scope', '$http', '$modal', 'colors', 'flotOptions', '$timeout', 'serverStatus', 'syslog', 'BACKEND'];
    function SyslogController($rootScope, $scope, $http, $modal, colors, flotOptions, $timeout, serverStatus, syslog, BACKEND) {
      var sc = this;

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
            console.log('=========> syslog!!!!');
          });
        }
      }
    }
})();
