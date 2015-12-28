/**=========================================================
 * Module: RoutesConfig.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .config(routesConfig);

    routesConfig.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider', 'RouteProvider'];
    function routesConfig($locationProvider, $stateProvider, $urlRouterProvider, Route) {

      // use the HTML5 History API
      $locationProvider.html5Mode(false);

      // Default route
      $urlRouterProvider.otherwise('/app/dashboard');

      // Application Routes States
      $stateProvider
        .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: Route.base('app.html'),
          resolve: {
            _assets: Route.require('icons', 'screenfull', 'sparklines', 'slimscroll', 'toaster', 'animate', 'numeral', 'underscore')
          }
        })
        .state('app.dashboard', {
          url: '/dashboard',
          templateUrl: Route.base('dashboard.html'),
          resolve: {
            assets: Route.require('flot-chart', 'flot-chart-plugins', 'easypiechart', 'xeditable')
          }
        })
        .state('app.dashboardcustom', {
          url: '/dashboardcustom',
          templateUrl: Route.base('dashboardcustom.html'),
          resolve: {
            assets: Route.require('flot-chart', 'flot-chart-plugins', 'easypiechart', 'xeditable')
          }
        })
        .state('app.server', {
          url: '/server',
          templateUrl: Route.base('server.html'),
          resolve: {
            assets: Route.require('easypiechart', 'xeditable')
          }
        })
        .state('app.syslog', {
          url: '/syslog',
          templateUrl: Route.base('syslog.html'),
          resolve: {
            assets: Route.require('datatables')
          }
        })
        // Single Page Routes
        .state('page', {
          url: '/page',
          templateUrl: Route.base('page.html'),
          resolve: {
            assets: Route.require('icons', 'animate')
          }
        })
        .state('page.recover', {
          url: '/recover',
          templateUrl: Route.base('page.recover.html')
        })
        .state('page.lock', {
          url: '/lock',
          templateUrl: Route.base('page.lock.html')
        })
        // Layout dock
        .state('app-dock', {
          url: '/dock',
          abstract: true,
          templateUrl: Route.base('app-dock.html'),
          controller: ['$rootScope', '$scope', function($rootScope, $scope) {
            $rootScope.app.layout.isDocked = true;
            $scope.$on('$destroy', function() {
              $rootScope.app.layout.isDocked = false;
            });
            // we can't use dropdown when material and docked
            // main content overlaps dropdowns (forced for demo)
            $rootScope.app.layout.isMaterial = false;
          }],
          resolve: {
            assets: Route.require('icons', 'screenfull', 'sparklines', 'slimscroll', 'toaster', 'animate')
          }
        })
        .state('app-dock.dashboard', {
          url: '/dashboard',
          templateUrl: Route.base('dashboard.html'),
          resolve: {
            assets: Route.require('flot-chart', 'flot-chart-plugins', 'easypiechart')
          }
        })
        // Layout full height
        .state('app-fh', {
          url: '/fh',
          abstract: true,
          templateUrl: Route.base('app-fh.html'),
          resolve: {
            assets: Route.require('icons', 'screenfull', 'sparklines', 'slimscroll', 'toaster', 'animate')
          }
        });
      }
})();

