/**=========================================================
 * Module: CustomDashboardModalController.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('monitoring')
        .controller('CustomDashboardModalController', CustomDashboardModalController);
    
    CustomDashboardModalController.$inject = ['$rootScope', '$scope', '$modalInstance', 'colors', '_', 'memoryleaks', 'dashboard',  'editableOptions', 'editableThemes', 'BACKEND'];
    function CustomDashboardModalController($rootScope, $scope, $modalInstance,  colors, _, memoryleaks, dashboard, editableOptions, editableThemes, BACKEND) {
      var ctrl = this;
      
      $scope.reportersToSet = $rootScope.reporters;
      $scope.statusOptions = ['active', 'inactive'];
      editableOptions.theme = 'bs3';

      function reloadDashboard(currentDashboard) {
        dashboard.getDashboards()
        .then( function () {
          if (currentDashboard != undefined) {
            $rootScope.$emit('dashboard.selected', currentDashboard);
          }
        })
      }

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

      $scope.addUnit = function (units) {
        $scope.unitToAdd = {
          IPv4: null,
          MACAddress: null,
        };
        units.push($scope.unitToAdd);
      };

      $scope.checkIPv4 = function (data, unit, units) {
        var ipFormat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!data || !data.match(ipFormat)) {
          rowform.$visible = true;
          return 'Enter valid IP';
        }
        if (angular.equals(unit, $scope.unitToAdd) && findUnit('IPv4', data, units) ) {
          return 'Already exists!';
        }
      };

      function findUnit (prop, value, units) {
        return _.find(units, function (item) {
          return item[prop] === value;
        });
      }

      $scope.checkMACAddress = function (data, unit, units) {
        var MACFormat = /^([0-9a-f]{2}){5}([0-9a-f]{2})$/;
        if (!data || !data.match(MACFormat)) {
          rowform.$visible = true;
          return 'Enter valid MACAddress';
        }
        if (angular.equals(unit, $scope.unitToAdd) && findUnit('MACAddress', data, units) ) {
          return 'Already exists!';
        }
      };

      $scope.cancelEditRow = function (unit, unitsArray) {
        var MACFormat = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/;
        if (angular.equals(unit, $scope.unitToAdd)) {
          var index = unitsArray.indexOf(unit);
          unitsArray.splice(index, 1);
        }
      };

      $scope.removeUnit = function (index, unitsArray) {
        unitsArray.splice(index, 1);
      };

      $scope.saveDashboard = function () {
        dashboard.saveDashboard($rootScope.currentDashboard._source, $rootScope.currentDashboard._id);
        $modalInstance.close('closed');
      };


      $scope.modalCancel = function () {
        $rootScope.currentDashboard = $rootScope.previousDashboard;
        $modalInstance.dismiss('cancel');
      };

      $modalInstance.result.then(function () {
        console.log("Saved dashboard");
        reloadDashboard($rootScope.currentDashboard);
      }, function () {
        $rootScope.currentDashboard = $rootScope.previousDashboard;
        console.log("Cancelled creating dashboard");
      });
    }
})();
