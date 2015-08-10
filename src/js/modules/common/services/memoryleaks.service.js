/**=========================================================
 * Module: MemoryleaksService.js
 * Memoryleaks data service
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .service('memoryleaks', MemoryleaksService);

    MemoryleaksService.$inject = ['$rootScope', '$http', 'BACKEND'];
    function MemoryleaksService($rootScope, $http, BACKEND) {
      var memLeaksService = this;
      $rootScope.reporters = {
        active: [],
        inactive: []
      };

      $rootScope.dbStatus = {
        currentQueryStats: {
          init: true,
          query_total: 0,
          query_time: 0,
          index_total: 0,
          index_time: 0
        }
      };

      init();

      function init() {
        $rootScope.dbStatus.lastQueryStats = $rootScope.dbStatus.currentQueryStats;
        getUnits()
        .then(getModels())
        .then(getSerials())
        .then(getLoads())
        .then(getUnitsIPv4s())
        .then(getConfigs())
        .then(getReporters());
      }

      function getReporters() {
        return $http.get( BACKEND.baseURL + '/reporters')
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
        return $http.get( BACKEND.baseURL + '/units')
          .success(function (res) {
            $rootScope.units = formatData('idUnits', res);
          })
          .error(function (err) {
            console.log(err);
          });
      }
      function getModels() {
        return $http.get( BACKEND.baseURL + '/models')
          .success(function (res) {
            $rootScope.models = formatData('idModel', res);
          })
          .error(function (err) {
            console.log(err);
          });
      }

      function getSerials() {
        return $http.get( BACKEND.baseURL + '/serials')
          .success(function (res) {
            $rootScope.serials = formatData('idSerial', res);
          })
          .error(function (err) {
            console.log(err);
          });
      }


      function getLoads() {
        return $http.get( BACKEND.baseURL + '/loads')
          .success(function (res) {
            $rootScope.loads = formatData('idLoadVersion', res);
          })
          .error(function (err) {
            console.log(err);
          });
      }


      function getUnitsIPv4s() {
        return $http.get( BACKEND.baseURL + '/unitsipv4s')
          .success(function (res) {
            $rootScope.unitsIPv4s = formatData('idIPv4', res);
          })
          .error(function (err) {
            console.log(err);
          });
      }

      function getConfigs() {
        return $http.get( BACKEND.baseURL + '/configs')
          .success(function (res) {
            $rootScope.configs = formatData('idCurrentConfiguration', res);
          })
          .error(function (err) {
            console.log(err);
          });
      }

      function formatData(idField, rawData) {
        var dataObj = {};
        for (var i in rawData) {
          dataObj[rawData[i]._source[idField]] = rawData[i]._source;
        }

        return dataObj;
      }

      function getDatabaseStatus() {
        return $http.get( BACKEND.baseURL + '/db/stats')
          .success(function (res) {
            var lastQueryStats = $rootScope.dbStatus.currentQueryStats;
            $rootScope.dbStatus = res;
            var currentQueryStats = {
              query_total: $rootScope.dbStatus._all.total.search.query_total,
              query_time: $rootScope.dbStatus._all.total.search.query_time_in_millis,
              index_total: $rootScope.dbStatus._all.total.search.query_time_in_millis,
              index_time: $rootScope.dbStatus._all.total.search.query_time_in_millis
            };

            $rootScope.dbStatus.lastQueryStats = lastQueryStats;
            $rootScope.dbStatus.currentQueryStats = currentQueryStats;

          })
          .error(function (err) {
            console.log(err);
          });

      }

      function getUnitByMACAddress (MACAddress) {
        return _.find($rootScope.units, function (item) {
          return item.MACAddress == MACAddress;
        });
      }

      function saveReporter (currentReporterToSet) {
        return $http.post( BACKEND.baseURL + '/update/reporters/' + currentReporterToSet.idReporters, currentReporterToSet)
          .success(function (res) {
            console.log('Saved reporter: ', res);
            init();
          })
          .error(function (err) {
            console.log(err);
          });
      }

      memLeaksService.saveReporter = saveReporter;      
      memLeaksService.getUnitByMACAddress = getUnitByMACAddress;      
      memLeaksService.getDatabaseStatus = getDatabaseStatus;      
      return memLeaksService;
    }

})();
