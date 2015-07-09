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
            _assets: Route.require('icons', 'toaster', 'animate')
          }
        })
        .state('app.dashboard', {
          url: '/dashboard',
          templateUrl: Route.base('dashboard.html'),
          resolve: {}
        })
      // Layout dock
      .state('app-dock', {
        url: '/dock',
        abstract: true,
        templateUrl: Route.base('app-dock.html'),
        resolve: {
          assets: Route.require('icons', 'toaster', 'animate')
        }
      })
        .state('app-dock.dashboard', {
          url: '/dashboard',
          templateUrl: Route.base('dashboard.html'),
          resolve: {
          }
        })
      // Layout full height
      .state('app-fh', {
        url: '/fh',
        abstract: true,
        templateUrl: Route.base('app-fh.html'),
        resolve: {
          assets: Route.require('icons', 'toaster', 'animate')
        }

      })
        .state('app-fh.columns', {
          url: '/columns',
          templateUrl: Route.base('layout.columns.html')
        })
    }

})();

