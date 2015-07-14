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

      init();

      function init() {
        console.log("=====> Init memLeaksService");
        getReporters();
      }

      function getReporters() {
        $http.get('http://localhost:5555/reporters')
          .success(function (res) {
            $rootScope.reporters = res;
          })
          .error(function (err) {
            console.log(err);
          });
      }

      return memLeaksService;
    }

})();
