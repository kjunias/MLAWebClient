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
        .then(getReporters())
        .then(getModels())
        .then(getSerials())
        .then(getLoads())
        .then(getUnitsIPv4s())
        .then(getSnapshots())
        .then(getConfigs());
      }

      function getReporters() {
        return $http.get( BACKEND.baseURL + '/reporters')
          .success(function (res) {
            $rootScope.reporters.active = [];
            $rootScope.reporters.inactive = [];
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

      function getSnapshots() {
        return $http.get( BACKEND.baseURL + '/snapshots')
          .success(function (res) {
            $rootScope.snapshots = res.snapshots;
          })
          .error(function (err) {
            console.log('Error getSnapshots: ', err);
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
        return $http.put( BACKEND.baseURL + '/update/reporters/' + currentReporterToSet.idReporters, currentReporterToSet)
          .success(function (res) {
            console.log('Saved reporter: ', res);
            getReporters();
          })
          .error(function (err) {
            console.log(err);
          });
      }

      function deleteReporter (reporterToDelete) {
        return $http.delete( BACKEND.baseURL + '/delete/reporters/' + reporterToDelete._source.idReporters, reporterToDelete)
          .success(function (res) {
            console.log('Deleted reporter: ', res);
            getReporters();
          })
          .error(function (err) {
            console.log(err);
          });
      }

      function deleteUnit (unit) {
        return $http.delete( BACKEND.baseURL + '/delete/units/' + unit.idUnits, unit)
          .success(function (res) {
            console.log('Deleted unit: ', res);
            getUnits();
            getUnitByMACAddress();
            getUnitsIPv4s();
          })
          .error(function (err) {
            console.log(err);
          });
      }

      function deleteUnitsLogs (unit) {
        return deleteLogs('idUnits', unit.idUnits, unit);
      }

      function deleteReporterLogs (reporter) {
        return deleteLogs('idReporters', reporter._source.idReporters, reporter);
      }

      function deleteLogs (idField, id, doc) {
        return $http.delete( BACKEND.baseURL + '/delete/logs/' + idField +'/' + id, doc)
          .success(function (res) {
            console.log('Deleted logs with ' + idField + '=' + id, res);
            init();
          })
          .error(function (err) {
            console.log(err);
          });
      }

      function deleteSnapShot (snapshot) {
        return $http.delete( BACKEND.baseURL + '/snapshots/delete/' + snapshot.snapshot, snapshot)
          .success(function (res) {
            console.log('Deleted snapshot ' + snapshot.snapshot, res);
            getSnapshots();
          })
          .error(function (err) {
            console.log(err);
          });
      }

      function createSnapshot () {
        return $http.post(BACKEND.baseURL + '/snapshot/create')
          .success(function (res) {
            console.log('Created snapshot ', res);
            getSnapshots();
          })
          .error(function (err) {
            console.log(err);
          });
      }

      memLeaksService.saveReporter = saveReporter;
      memLeaksService.deleteReporter = deleteReporter;
      memLeaksService.deleteReporterLogs = deleteReporterLogs;
      memLeaksService.deleteUnit = deleteUnit;
      memLeaksService.getReporters = getReporters;     
      memLeaksService.getUnits = getUnits;
      memLeaksService.deleteUnitsLogs = deleteUnitsLogs;
      memLeaksService.deleteSnapShot = deleteSnapShot;
      memLeaksService.createSnapshot = createSnapshot;
      memLeaksService.getUnitByMACAddress = getUnitByMACAddress;
      memLeaksService.getDatabaseStatus = getDatabaseStatus;
      return memLeaksService;
    }

})();
