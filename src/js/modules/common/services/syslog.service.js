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
      $rootScope.syslogUnits = [];


      init();

      function init() {
        getSyslogUnits()
      }

      function getSyslogUnits() {
        return $http.get( BACKEND.baseURL + '/syslog/units')
          .success(function (res) {
            $rootScope.syslogUnits = res;
            $rootScope.currentSyslogUnit = $rootScope.syslogUnits[0];
            console.log("=================> $rootScope.syslogUnits: ", $rootScope.syslogUnits);
          })
          .error(function (err) {
            console.log(err);
          });
      }

      syslogService.getSyslogUnits = getSyslogUnits;
      
      return syslogService;
    }

})();
