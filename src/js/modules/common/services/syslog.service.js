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
        .then(getSyslogData)
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

      function getSyslogData() {
        if (typeof $rootScope.currentSyslogUnit === 'undefined') {
          return null;
        }

        $rootScope.syslogDataLoading = true;
        return $http.get(BACKEND.baseURL + '/syslog/logs/'+ $rootScope.currentSyslogUnit, {
          params: {
            from: $rootScope.syslogRange.from.toISOString(),
            to: $rootScope.syslogRange.to.toISOString()
          }
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

      syslogService.getSyslogUnits = getSyslogUnits;
      syslogService.getSyslogData = getSyslogData;
      
      return syslogService;
    }

})();
