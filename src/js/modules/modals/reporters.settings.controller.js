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
      editableOptions.theme = 'bs3';

      $scope.$watch('currentReporterToSet', function (newValue) {
        initReportersSettings();
      }, true);

      function initReportersSettings() {
        $scope.currentReporterToSet._source.settings.LAN =  $rootScope.reportersMappings[$scope.currentReporterToSet._source.settings.LAN] || $scope.currentReporterToSet._source.settings.LAN
        var units = $scope.currentReporterToSet._source.settings.units;
        for (var unit in units) {
          if(getMacAddress(units[unit])) {
            units[unit].MACAddress = getMacAddress(units[unit]).toUpperCase();
          }
        }
      }

      $scope.toggleReporterStatus = function () {
        if ($scope.currentReporterToSet._source.settings.status === $scope.reporterStatusOptions[0]) {
          $scope.currentReporterToSet._source.settings.status = $scope.reporterStatusOptions[1];
        }else if($scope.currentReporterToSet._source.settings.status === $scope.reporterStatusOptions[1]) {
          $scope.currentReporterToSet._source.settings.status = $scope.reporterStatusOptions[0];
        }
      };

      function getMacAddress (unit) {
        if (unit.idUnits && $rootScope.units[unit.idUnits]) {
          return $rootScope.units[unit.idUnits].MACAddress;
        }
        return null;
      };

      $scope.saveUnit = function (data, unit) {
        angular.extend(unit, data);
        delete unit.$$hashKey
        if (angular.equals(unit, $scope.unitToAdd)) {
          var actualUnit = memoryleaks.getUnitByMACAddress(unit.MACAddress);
          if(actualUnit) {
            unit.idUnits = actualUnit.idUnits;
            console.log('getUnit: ', actualUnit, unit);
          }
        }
      };

      $scope.addUnit = function () {
        $scope.unitToAdd = {
          idUnits: null,
          IPv4: null,
          MACAddress: null,
          pollingInterval: null,
          status: "active"
        };
        $scope.currentReporterToSet._source.settings.units.push($scope.unitToAdd);
      };

      $scope.checkIPv4 = function (data, unit) {
        var ipFormat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!data || !data.match(ipFormat)) {
          rowform.$visible = true;
          return 'Enter valid IP';
        }
        if (angular.equals(unit, $scope.unitToAdd) && findUnit('IPv4', data) ) {
          return 'Already exists!';
        }
      };

      function findUnit (prop, value) {
        return _.find($scope.currentReporterToSet._source.settings.units, function (item) {
          return item[prop] === value;
        });
      }

      $scope.checkMACAddress = function (data, unit) {
        var MACFormat = /^([0-9A-F]{2}){5}([0-9A-F]{2})$/;
        if (!data || !data.match(MACFormat)) {
          rowform.$visible = true;
          return 'Enter valid MACAddress';
        }
        if (angular.equals(unit, $scope.unitToAdd) && findUnit('MACAddress', data) ) {
          return 'Already exists!';
        }
      };

      $scope.cancelEditRow = function (unit) {
        var MACFormat = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/;
        if (angular.equals(unit, $scope.unitToAdd)) {
          var units = $scope.currentReporterToSet._source.settings.units;
          var index = units.indexOf(unit);
          units.splice(index, 1);
        }
      };

      $scope.saveReportersSettings = function () {
        formatReportersSettings();
        memoryleaks.saveReporter($scope.currentReporterToSet._source);
        $modalInstance.close('closed');
      };

      function formatReportersSettings() {
        console.log('pollingInterval: ', $scope.currentReporterToSet._source.settings.pollingInterval); 
        var units = $scope.currentReporterToSet._source.settings.units;
        for (var unit in units) {
          delete units[unit]['MACAddress'];
          delete units[unit]['$$hashKey'];     
        }
      }

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