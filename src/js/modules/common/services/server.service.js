/**=========================================================
 * Module: ServerService.js
 * Server data service
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .service('serverStatus', ServerStatusService);

    ServerStatusService.$inject = ['$rootScope', '$http', 'BACKEND'];
    function ServerStatusService($rootScope, $http,  BACKEND) {
      var serverStatusService = this;
      $rootScope.serverStatus = {};

      init();

      function init() {
        getServerStatus();
      }

      function getServerStatus() {
        return $http.get( BACKEND.baseURL + '/server/info')
          .success(function (res) {
            $rootScope.serverStatus = res;
          })
          .error(function (err) {
            console.log(err);
          });
      }

      serverStatusService.getServerStatus = getServerStatus;

      return serverStatusService;
    }

})();
