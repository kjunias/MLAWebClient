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

      // console.log("1 =====> unites: ", $rootScope.units, $rootScope.unitsIPv4s);

      $scope.getUnitIP = function (idUnits) {
        return _.find($rootScope.unitsIPv4s, function (item) {
          return idUnits === item.idUnits;
        }).IPv4;
      };

      $scope.deleteReportersData = function () {
        for (var rep in sc.reporters) {
          var reporter = sc.reporters[rep];
          if (reporter._deleteReporterLogs) {
            deleteReportersLogs(reporter);
          }

          if (reporter._deleteReporter) {
            deleteReporter(reporter);
          }
        }
      };

      function deleteReportersLogs(reporter) {
        console.log("1 =====> deleteReportersLogs: ", reporter);
      }

      function deleteReporter(reporter) {
        memoryleaks.deleteReporter(reporter)
        .then(function () {
          memoryleaks.getReporters().then(function() {
            sc.reporters = _.sortBy($rootScope.reporters.active.concat($rootScope.reporters.inactive), function(item) { return item._source.idReporters});
          });
        });
      }
    }
})();
