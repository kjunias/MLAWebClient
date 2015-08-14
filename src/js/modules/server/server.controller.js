/**=========================================================
 * Module: ServerController.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('ServerController', ServerController);
    
    ServerController.$inject = ['$rootScope', '$scope', '$http', '$modal', 'colors', 'flotOptions', '$timeout', 'serverStatus', 'memoryleaks', 'BACKEND'];
    function ServerController($rootScope, $scope, $http, $modal, colors, flotOptions, $timeout, serverStatus, memoryleaks, BACKEND) {
      var sc = this;
      sc.reporters = _.sortBy($rootScope.reporters.active.concat($rootScope.reporters.inactive), function(item) { return item._source.idReporters});
      sc.units = _.sortBy($rootScope.units, function(item) { return item.idUnits});

      $scope.getUnitIP = function (idUnits) {
        return _.find($rootScope.unitsIPv4s, function (item) {
          return idUnits === item.idUnits;
        }).IPv4;
      };

      $scope.getUnitModel = function (idModel) {
        return _.find($rootScope.models, function (item) {
          return idModel === item.idModel;
        }).model;
      };

      $scope.deleteReportersData = function () {
        for (var rep in sc.reporters) {
          var reporter = sc.reporters[rep];
          if (reporter._deleteReporterLogs) {
            deleteReportersLogs(reporter);
          }

          if (reporter._deleteReporter) {
            deleteReporter(reporter, rep);
          }
        }
      };

      $scope.deleteUnitsData = function () {
        for (var u in sc.units) {
          var unit= sc.units[u];
          if (unit._deleteUnitLogs) {
            deleteUnitsLogs(unit);
          }

          if (unit._deleteUnit) {
            deleteUnit(unit, u);
          }
        }
      };

      function deleteReportersLogs(reporter) {
        console.log("1 =====> deleteReportersLogs: ", reporter);
      }

      function deleteReporter(reporter, index) {
        memoryleaks.deleteReporter(reporter)
        .then(function () {
          sc.reporters.splice(index, 1);
        });
      }

      function deleteUnit(unit, index) {
        memoryleaks.deleteUnit(unit)
        .then(function () {
          memoryleaks.getUnits().then(function() {
            sc.units.splice(index, 1);
          });
        });
      }
    }
})();
