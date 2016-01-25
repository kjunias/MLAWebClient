/**=========================================================
 * Module: ColorsRun
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('monitoring')
        .run(appRun);

    appRun.$inject = ['$rootScope', 'colors'];
    function appRun($rootScope, colors) {
      // Request brand colors from templates e.g {{colorByName('info')}}
      $rootScope.colorByName = colors.byName;
    }

})();
