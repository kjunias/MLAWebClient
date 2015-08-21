/**=========================================================
 * Module: SidebarController.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('SidebarController', SidebarController);
    
    SidebarController.$inject = ['$rootScope', '$scope', '$http', 'colors', 'flotOptions', '$timeout', 'syslog'];
    function SidebarController($rootScope, $scope, $http, colors, flotOptions, $timeout, syslog) {
      var sidebar = this;
      $rootScope.reportersLoaded = false;
      sidebar.title = 'MemoryLeaks Web Client';
      sidebar.text = 'AngularJS Web Application for the Mediatrix Units MemoryLeaks Metrics';

      $scope.reporterClick = function (reporter) {
        $rootScope.currentReporter = reporter;
        $rootScope.$emit('reporter.selected', $rootScope.currentReporter);
      };

      $scope.syslogUnitClick = function (unit) {
        $rootScope.currentSyslogUnit = unit;
        syslog.getSyslogData();
      }
    }
}) ();
