/**=========================================================
 * Module: Constant.js
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('naut')
    .constant('VERSION', {
      number: '0.0.3',
      startDate: '2015-08-25',
      endDate: 'Now'
    })
    .constant('BACKEND', {
      'baseURL': 'http://monitoring.media5corp.com:8080'
    })
    .constant('MEDIA_QUERY', {
      'desktopLG': 1200,
      'desktop':   992,
      'tablet':    768,
      'mobile':    480
    });

})();
