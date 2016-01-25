/**=========================================================
 * Module: Underscore.js
 * Service to provide for the underscore library
 =========================================================*/
 
(function() {
    'use strict';

    angular
        .module('monitoring')
        .factory('_', _);
    
    _.$inject = ['$window'];
    function _($window) {
       return $window._;
    }

})();