/**=========================================================
 * Module: SyslogController.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('SyslogController', SyslogController);
    
    SyslogController.$inject = ['$rootScope', '$scope', '$http', 'syslog', 'DTOptionsBuilder', 'BACKEND'];
    function SyslogController($rootScope, $scope, $http, syslog, DTOptionsBuilder, BACKEND) {
      var sc = this;

      $scope.dtOptions = DTOptionsBuilder.newOptions()
      .withLanguage({
        "sLengthMenu":     "_MENU_ entries / page",
        "sLoadingRecords": "Loading...",
        "sProcessing":     "Processing...",
        "sSearch":         "Filter:"
      })
//      .withButtons(['excel'])
      .withOption('fnDrawCallback', function(){
        setTimeOrder();
      });

      $scope.timeOrder = 'asc';

      $scope.getLocalDate= function (date) {
        return new Date(date).toLocaleString();
      };

      $scope.onSyslogDateChange = function () {
        $rootScope.syslogRange.from.setHours(0,0,0);
        $rootScope.syslogRange.to.setHours(23,59,59);
      }

      $scope.refreshLogs = function () {
        var promise = syslog.getSyslogData($scope.getParams())
        if (promise) {
          promise.then(function () {
            console.log('Loaded data');
          });
        }
        return promise;
      };

      $scope.addMoreLogs = function () {
        var promise = syslog.addSyslogData($scope.getParams())
        if(promise) {
          promise.then(function () {
            console.log('Added more data');
          });
        }
      };

      $scope.syslogSearch = function () {
        var params = {query: $scope.syslogQuery};
        var promise = syslog.getSyslogData(params);
        if (promise) {
          promise.then(function () {
            console.log('Loaded data');
          });
        }
      };

      $scope.getParams = function () {
        return {
          query: $scope.syslogQuery,
          order: $scope.timeOrder
        };
      };

      $scope.sortByTime = function () {
        $scope.orderChanged = true;
        
        if ($scope.timeOrder == "asc") {
          $scope.timeOrder = "desc";
        } else if ($scope.timeOrder == "desc") {
          $scope.timeOrder = "asc";
        }

        $scope.refreshLogs().then()
      };

      function setTimeOrder () {
        if ($scope.orderChanged) {
          $scope.orderChanged = false;
          setTimeout( function () {
            var table = $('#DataTables_Table_0').DataTable();
            table = $('#DataTables_Table_0').DataTable();
            table.order([0, $scope.timeOrder ]).draw();
          } , 1000);
        }
      }
    }
})();
