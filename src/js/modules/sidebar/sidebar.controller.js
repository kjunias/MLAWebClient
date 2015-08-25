/**=========================================================
 * Module: SidebarController.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('SidebarController', SidebarController);
    
    SidebarController.$inject = ['$rootScope', '$scope', '$http', 'colors', 'flotOptions', '$timeout', 'VERSION'];
    function SidebarController($rootScope, $scope, $http, colors, flotOptions, $timeout, VERSION) {
      var vm = this;
      $rootScope.reportersLoaded = false;
      vm.title = 'MemoryLeaks Web Client';
      vm.text = 'AngularJS Web Application for the Mediatrix Units MemoryLeaks Metrics';
      vm.version = VERSION;

      $scope.reporterClick= reporterClick;

      function reporterClick(reporter) {
        $rootScope.currentReporter = reporter;
        $rootScope.$emit('reporter.selected', $rootScope.currentReporter);
      }
    }
}) ();
