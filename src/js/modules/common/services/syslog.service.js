/**=========================================================
 * Module: SyslogService.js
 * Syslog data service
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .service('syslog', SyslogleaksService);

    SyslogleaksService.$inject = ['$rootScope', '$http', 'BACKEND'];
    function SyslogleaksService($rootScope, $http, BACKEND) {
      var syslogService = this;

      init();

      function init() {
        $rootScope.syslogDataLoading = false;
        $rootScope.syslogUnits = [];
        $rootScope.syslogRange = {
          from: new Date(),
          to: new Date()
        };

        $rootScope.syslogRange.from.setDate($rootScope.syslogRange.from.getDate() - 1);      
        getSyslogUnits()
        .then(function () {
          return getSyslogData();
        })
      }

      function getSyslogUnits() {
        return $http.get( BACKEND.baseURL + '/syslog/units')
          .success(function (res) {
            $rootScope.syslogUnits = res;
            $rootScope.currentSyslogUnit = $rootScope.syslogUnits[0];
          })
          .error(function (err) {
            console.log(err);
          });
      }

      function getSyslogData(parameters) {
        if (typeof $rootScope.currentSyslogUnit === 'undefined') {
          return null;
        }

        $rootScope.syslogDataLoading = true;
        
        var params = {
          from: $rootScope.syslogRange.from.toISOString(),
          to: $rootScope.syslogRange.to.toISOString()
        };

        if (parameters) {
          if (parameters.query) {
            params.matchPhrase = parameters.query;
          }
          if (parameters.order) {
            params.order = parameters.order;
          }
        }


        return $http.get(BACKEND.baseURL + '/syslog/logs/'+ $rootScope.currentSyslogUnit, {
          params: params
        })
        .success(function (res) {
          $rootScope.currentSyslogLogs = res;
        })
        .error(function (err) {
          console.log(err);
        })
        .finally(function () {
          $rootScope.syslogDataLoading = false;
        });
      }

      function addSyslogData(parameters) {
        if (typeof $rootScope.currentSyslogUnit === 'undefined') {
          return null;
        }

        $rootScope.syslogDataLoading = true;

        var params = {
          from: $rootScope.currentSyslogLogs[$rootScope.currentSyslogLogs.length -1]._source['@timestamp'],
          to: $rootScope.syslogRange.to.toISOString(),
        };

        if (parameters) {
          if (parameters.query) {
            params.matchPhrase = parameters.query;
          }
          if (parameters.order) {
            params.order = parameters.order;
          }
        }

        if (matchPhrase) {
          params.matchPhrase = matchPhrase;
        }

        return $http.get(BACKEND.baseURL + '/syslog/logs/'+ $rootScope.currentSyslogUnit, {
          params: params
        })
        .success(function (res) {
          $rootScope.currentSyslogLogs = $rootScope.currentSyslogLogs.concat(res);
        })
        .error(function (err) {
          console.log(err);
        })
        .finally(function () {
          $rootScope.syslogDataLoading = false;
        });
      }

      syslogService.getSyslogUnits = getSyslogUnits;
      syslogService.getSyslogData = getSyslogData;
      syslogService.addSyslogData = addSyslogData;
      
      return syslogService;
    }

})();
