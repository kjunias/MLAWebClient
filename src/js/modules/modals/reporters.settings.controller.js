/**=========================================================
 * Module: ReportersSettingsController.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('ReportersSettingsController', ReportersSettingsController);
    
    ReportersSettingsController.$inject = ['$rootScope', '$scope', '$modalInstance', 'colors', '_', 'memoryleaks', 'editableOptions', 'editableThemes', 'BACKEND'];
    function ReportersSettingsController($rootScope, $scope, $modalInstance,  colors, _, memoryleaks, editableOptions, editableThemes, BACKEND) {
      var ctrl = this;
      $scope.currentReporterToSet = $rootScope.currentReporter;
      $scope.reportersToSet = $rootScope.reporters.active.concat($rootScope.reporters.inactive);
      $scope.statusOptions = ['active', 'inactive'];

      $scope.toggleReporterStatus = function () {
        if ($scope.currentReporterToSet._source.settings.status === $scope.reporterStatusOptions[0]) {
          $scope.currentReporterToSet._source.settings.status = $scope.reporterStatusOptions[1]
        }else if($scope.currentReporterToSet._source.settings.status === $scope.reporterStatusOptions[1]) {
          $scope.currentReporterToSet._source.settings.status = $scope.reporterStatusOptions[0]
        }
      }

      $scope.getMacAddress = function (unit) {
        if (unit.idUnits) {
          return $rootScope.units[unit.idUnits].MACAddress;
        }
        return null;
      };

      $scope.saveUnit = function (data, unit) {
        console.log('saveUnit', data, unit);
      };

      $scope.addUnit = function () {
        console.log('addUnit');
        $scope.unitToAdd = {
          "idUnits": null,
          "IPv4": null,
          "pollingInterval": null,
          "status": "active"
        };
        $scope.currentReporterToSet._source.settings.units.push($scope.unitToAdd);
      };

      $scope.saveSetting = function (task) {
        $modalInstance.close('closed');
      };

      $scope.modalCancel = function () {
        ctrl.taskEdition = false;
        $modalInstance.dismiss('cancel');
      };

      $modalInstance.result.then(function () {
        console.log("Saving reporters settings");
      }, function () {
        console.log("Cancelling reporters settings");
      });
    }
})();
