/**=========================================================
 * Module: DemoDatepickerDemoController.js
 * Provides a simple demo for bootstrap datepicker
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('PeriodDatepickerController', PeriodDatepickerController);
    
    /* @ngInject */
    PeriodDatepickerController.$inject = ['$rootScope', '$scope'];
    function PeriodDatepickerController($rootScope, $scope) {
      $scope.openedTo = $scope.openedFrom = false;

      $scope.today = function() {
        $scope.dt = new Date();
      };
      $scope.today();

      $scope.clear = function () {
        $scope.dt = null;
      };

      // Disable weekend selection
      $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      };

      $scope.toggleMin = function() {
        $scope.minDate = new Date('2015-06-01T00:00:00.000Z');
      };
      $scope.toggleMin();

      $scope.toggleFrom = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.openedFrom = !$scope.openedFrom;
      };

      $scope.toggleTo = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.openedTo = !$scope.openedTo;
      };

      $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };

      $scope.initDate = $scope.today();
      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];

    }
})();
