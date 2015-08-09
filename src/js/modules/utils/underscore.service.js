/**=========================================================
 * Module: ColorsService.js
 * Services to retrieve global colors
 =========================================================*/
 
(function() {
    'use strict';

    angular
        .module('naut')
        .factory('_', _);
    
    _.$inject = ['$window'];
    function _($window) {
       return $window._;
    }

})();