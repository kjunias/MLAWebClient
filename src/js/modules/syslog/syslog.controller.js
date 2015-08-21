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
      init();

      function init () {

      }
      
      $scope.getUnitIP = function (idUnits) {
        return _.find($rootScope.unitsIPv4s, function (item) {
          return idUnits === item.idUnits;
        }).IPv4;
      };

    }
})();
