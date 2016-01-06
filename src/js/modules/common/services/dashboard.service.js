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
        return $http.get( BACKEND.baseURL + '/dashboard')
          .success(function (res) {
            $rootScope.dashboards = res;
          })
          .error(function (err) {
            console.log(err);
          });
      }

      function saveDashboard(dashboard, id) {
        if (id == undefined) {
          return $http.post( BACKEND.baseURL + '/create/dashboard', dashboard)
            .success(function (res) {
              dashboard;
            })
            .error(function (err) {
              console.log(err);
            });
        }

        return $http.put( BACKEND.baseURL + '/update/dashboard/'+ id, dashboard)
          .success(function (res) {
            dashboard;
          })
          .error(function (err) {
            console.log(err);
          });
      }

      dashboardService.getDashboards = getDashboards;
      dashboardService.saveDashboard = saveDashboard;

      return dashboardService;
    }

})();
