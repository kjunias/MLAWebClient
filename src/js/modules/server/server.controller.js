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
      init();

      
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

      $scope.getLocalDateString = function (dateStr) {
        var date = new Date(dateStr);
        return date.toLocaleDateString();
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

      $scope.deleteSnapShot = function (snapshot) {
        memoryleaks.deleteSnapShot(snapshot)
        .then(function () {
          setTimeout(refreshSnapshots, 500); 
        });
      };

      $scope.createSnapshot = function () {
        memoryleaks.createSnapshot()
        .then(function () {
          setTimeout(refreshSnapshots, 500); 
        });
      };

      function deleteUnitsLogs(unit) {
        memoryleaks.deleteUnitsLogs(unit)
        .then(function () {
          unit._deleteUnitLogs = false;
        });
      }

      function init () {
        refreshReporters();
        refreshUnits();
        refreshSnapshots();
      }

      function refreshReporters () {
        sc.reporters = _.sortBy($rootScope.reporters, function(item) { return item._source.idReporters});
      }

      function refreshUnits () {
        sc.units = _.sortBy($rootScope.units, function(item) { return item.idUnits});
      }

      function refreshSnapshots () {
        sc.snapshots = $rootScope.snapshots;
        console.log('===> refreshSnapshots: ', sc.snapshots);
      }

      function deleteReportersLogs(reporter) {
        memoryleaks.deleteReporterLogs(reporter)
        .then(function (response) {
          reporter._deleteReporterLogs = false
        });
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
