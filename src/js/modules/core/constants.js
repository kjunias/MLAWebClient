/**=========================================================
 * Module: Constant.js
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('monitoring')
    .constant('VERSION', {
      number: '0.0.4',
      startDate: '2016-01-19',
      endDate: 'Now'
    })
    .constant('BACKEND', {
      // 'baseURL': 'http://monitoring.media5corp.com:8080'
      'baseURL': 'http://localhost:8080'
    })
    .constant('MEDIA_QUERY', {
      'desktopLG': 1200,
      'desktop':   992,
      'tablet':    768,
      'mobile':    480
    });

})();
