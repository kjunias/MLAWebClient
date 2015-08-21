/**=========================================================
 * Module: Constant.js
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('naut')
    .constant('BACKEND', {
      'baseURL': 'http://localhost:5555'
      // 'baseURL': 'http://192.168.38.1:5555'
      // 'baseURL': 'http://192.168.40.38:5555'
    })
    .constant('MEDIA_QUERY', {
      'desktopLG': 1200,
      'desktop':   992,
      'tablet':    768,
      'mobile':    480
    });

})();
