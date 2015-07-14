/**=========================================================
 * Module: SidebarController.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('SidebarController', SidebarController);
    
    SidebarController.$inject = ['$rootScope', '$scope', '$http', 'colors', 'flotOptions', '$timeout'];
    function SidebarController($rootScope, $scope, $http, colors, flotOptions, $timeout) {
      var vm = this;
      $rootScope.reportersLoaded = false;
      vm.title = 'MemoryLeaks Web Client';
      vm.text = 'AngularJS Web Application for the Mediatrix Units MemoryLeaks Metrics';

      $scope.reporterClick= reporterClick;

      function reporterClick(reporter) {
        $rootScope.currentReporter = reporter;
        $rootScope.$emit('reporter.selected', $rootScope.currentReporter);
      }
    }
}) ();
