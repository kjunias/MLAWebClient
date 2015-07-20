/**=========================================================
 * Module: MemoryleaksService.js
 * Memoryleaks data service
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .service('memoryleaks', MemoryleaksService);

    MemoryleaksService.$inject = ['$rootScope', '$http'];
    function MemoryleaksService($rootScope, $http) {
      var memLeaksService = this;
      $rootScope.reporters = {
        active: [],
        inactive: []
      };

      init();

      function init() {
        getReporters();
        getUnits();
        getModels();
        getSerials();
        getLoads();
        getUnitsIPv4s();
        getConfigs();
      }

      function getReporters() {
        // $http.get('http://192.168.38.1:5555/reporters')
        $http.get('http://localhost:5555/reporters')
        // $http.get('http://192.168.40.38:5555/reporters')
          .success(function (res) {
            for (var i in res) {
              var aWeekAgo = new Date();
              aWeekAgo.setDate(aWeekAgo.getDate() - 7);
              var rep = res[i];
              if (new Date(rep._source.lastValidDate) < aWeekAgo) {
                $rootScope.reporters.inactive.push(rep);
              } else {
                $rootScope.reporters.active.push(rep);
              }
            }

            if ($rootScope.reporters.active.length > 0 ) {
              $rootScope.currentReporter = $rootScope.reporters.active[0];
              $rootScope.$emit('reporter.selected', $rootScope.currentReporter);
            }

          })
          .error(function (err) {
            console.log(err);
          });
      }

      function getUnits() {
        // $http.get('http://192.168.38.1:5555/units')
        $http.get('http://localhost:5555/units')
        // $http.get('http://192.168.40.38:5555/units')
          .success(function (res) {
            $rootScope.units = res;
          })
          .error(function (err) {
            console.log(err);
          });
      }

      function getModels() {
        // $http.get('http://192.168.38.1:5555/models')
        $http.get('http://localhost:5555/models')
        // $http.get('http://192.168.40.38:5555/models')
          .success(function (res) {
            $rootScope.models = res;
          })
          .error(function (err) {
            console.log(err);
          });
      }

      function getSerials() {
        // $http.get('http://192.168.38.1:5555/serials')
        $http.get('http://localhost:5555/serials')
        // $http.get('http://192.168.40.38:5555/serials')
          .success(function (res) {
            $rootScope.serials = res;
          })
          .error(function (err) {
            console.log(err);
          });
      }


      function getLoads() {
        // $http.get('http://192.168.38.1:5555/loads')
        $http.get('http://localhost:5555/loads')
        // $http.get('http://192.168.40.38:5555/loads')
          .success(function (res) {
            $rootScope.loads = res;
          })
          .error(function (err) {
            console.log(err);
          });
      }


      function getUnitsIPv4s() {
        // $http.get('http://192.168.38.1:5555/unitsipv4s')
        $http.get('http://localhost:5555/unitsipv4s')
        // $http.get('http://192.168.40.38:5555/unitsipv4s')
          .success(function (res) {
            $rootScope.unitsIPv4s = res;
          })
          .error(function (err) {
            console.log(err);
          });
      }

      function getConfigs() {
        // $http.get('http://192.168.38.1:5555/configs')
        $http.get('http://localhost:5555/configs')
        // $http.get('http://192.168.40.38:5555/configs')
          .success(function (res) {
            $rootScope.configs = res;
            console.log("configs: ", $rootScope.configs);
          })
          .error(function (err) {
            console.log(err);
          });
      }

      return memLeaksService;
    }

})();
