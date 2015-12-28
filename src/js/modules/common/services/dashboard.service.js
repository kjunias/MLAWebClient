/**=========================================================
 * Module: DashboardService.js
 * Server data service
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .service('dashboard', DashboardService);

    DashboardService.$inject = ['$rootScope', '$http', 'BACKEND'];
    function DashboardService($rootScope, $http,  BACKEND) {
      var dashboardService = this;
      $rootScope.dashboards = [];

      init();

      function init() {
        getDashboards();
      }

      function getDashboards() {
        return $http.get( BACKEND.baseURL + '/dashboards')
          .success(function (res) {
            $rootScope.dashboards = res;
          })
          .error(function (err) {
            console.log(err);
          });
      }

      dashboardService.getDashboards = getDashboards;

      return dashboardService;
    }

})();
