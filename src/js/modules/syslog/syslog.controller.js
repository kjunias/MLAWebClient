/**=========================================================
 * Module: SyslogController.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('SyslogController', SyslogController);
    
    SyslogController.$inject = ['$rootScope', '$scope', '$http', '$modal', 'colors', 'flotOptions', '$timeout', 'serverStatus', 'memoryleaks', 'BACKEND'];
    function SyslogController($rootScope, $scope, $http, $modal, colors, flotOptions, $timeout, serverStatus, memoryleaks, BACKEND) {
      var sc = this;

      $scope.getLocalDate= function (date) {
        return new Date(date).toLocaleString();
      };

      $scope.onSyslogDateChange = function () {
        $rootScope.syslogRange.from.setHours(0,0,0);
        $rootScope.syslogRange.to.setHours(23,59,59);
      }
    }
})();
