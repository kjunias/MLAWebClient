/**=========================================================
 * Module: SettingsService
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('monitoring')
        .service('settings', settings);
    /* @ngInject */
    function settings($rootScope, $localStorage, $translate) {
      /*jshint validthis:true*/
      var self = this;

      self.init = init;
      self.loadAndWatch = loadAndWatch;
      self.availableThemes = availableThemes;
      self.setTheme = setTheme;

      /////////////////

      self.themes = [
        {name: 'primary',   sidebar: 'bg-white',   sidebarHeader: 'bg-primary bg-light',   brand: 'bg-primary',   topbar:  'bg-primary'},
        {name: 'purple',    sidebar: 'bg-white',   sidebarHeader: 'bg-purple bg-light',    brand: 'bg-purple',    topbar:  'bg-purple'},
        {name: 'success',   sidebar: 'bg-white',   sidebarHeader: 'bg-success bg-light',   brand: 'bg-success',   topbar:  'bg-success'},
        {name: 'warning',   sidebar: 'bg-white',   sidebarHeader: 'bg-warning bg-light',   brand: 'bg-warning',   topbar:  'bg-warning'},
        {name: 'info',      sidebar: 'bg-white',   sidebarHeader: 'bg-info bg-light',      brand: 'bg-info',      topbar:  'bg-info'},
        // {name: 'danger',    sidebar: 'bg-white',   sidebarHeader: 'bg-danger bg-light',    brand: 'bg-danger',    topbar:  'bg-danger'},
        // {name: 'pink',      sidebar: 'bg-white',   sidebarHeader: 'bg-pink bg-light',      brand: 'bg-pink',      topbar:  'bg-pink'},
        // {name: 'amber',     sidebar: 'bg-white',   sidebarHeader: 'bg-amber bg-light',     brand: 'bg-amber',     topbar:  'bg-amber'},
      ];

      function init() {
        // Global settings
        $rootScope.app = {
          name:          'MemoryLeaks',
          description:   'MemoryLeaks WebClients',
          date:          new Date(),
          dateStr:       new Date().toLocaleString(),
          year:          new Date().getFullYear(),
          month:         new Date().getMonth(),
          day:          new Date().getDate(),
          views: {
            animation: 'ng-fadeInLeft2'
          },
          layout: {
            isFixed: false,
            isBoxed: false,
            isDocked: false
          },
          sidebar: {
            isOffscreen: false,
            isMini: false
          },
          footer: {
            hidden: false
          },
          themeId: 0,
          // default theme
          theme: {
            name:          'info',
            sidebar:       'bg-white',
            sidebarHeader: 'bg-info bg-light',
            brand:         'bg-info',
            topbar:        'bg-info'
          }
        };      
      }

      function loadAndWatch() {
        // Load current settings from local storage
        if( angular.isDefined($localStorage.settings) )
          $rootScope.app = $localStorage.settings;
        else
          $localStorage.settings = $rootScope.app;

        $rootScope.$watch('app.layout', function () {
          $localStorage.settings = $rootScope.app;
        }, true);
        $rootScope.app.date = new Date();
      }

      function availableThemes() {
        return self.themes;
      }

      function setTheme(idx) {
        $rootScope.app.theme = this.themes[idx];
      }

    }
    settings.$inject = ['$rootScope', '$localStorage', '$translate'];

})();
