/**=========================================================
 * Module: DashboardController.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('DashboardController', DashboardController);
    
    DashboardController.$inject = ['$rootScope', '$scope', '$http', 'colors', 'flotOptions', '$timeout'];
    function DashboardController($rootScope, $scope, $http, colors, flotOptions, $timeout) {
      var vm = this;
      vm.title = 'MemoryLeaks Web Client';
      vm.text = 'AngularJS Web Application for the Mediatrix Units MemoryLeaks Metrics';
      $rootScope.chartLoading = false;
      $rootScope.currentPeriod = {
        from : new Date(),
        to: new Date()
      }

      $rootScope.reportersMappings = {'192.168.4.108':'192.168.8.1',
                                      '192.168.4.127':'192.168.27.1',
                                      '192.168.4.112':'192.168.12.1',
                                      '192.168.4.128':'192.168.28.1',
                                      '192.168.4.96':'192.168.25.1',
                                    };
      $rootScope.currentPeriod.from.setHours(0,0,0);      
      $rootScope.$on('reporter.selected', onReporterSelect);

      // Some numbers for demo
      vm.loadProgressValues = function() {
        vm.progressVal = [0,0,0,0];
        // helps to show animation when values change
        $timeout(function(){
          vm.progressVal[0] = 60;
          vm.progressVal[1] = 34;
          vm.progressVal[2] = 22;
          vm.progressVal[3] = 76;
        });
      };

      // Pie Charts
      // ----------------------------------- 

      vm.piePercent1 = 75;
      vm.piePercent2 = 50;
      vm.pieOptions = {
          animate:{
              duration: 700,
              enabled: true
          },
          barColor: colors.byName('warning'),
          trackColor: colors.byName('info'),
          scaleColor: false,
          lineWidth: 10,
          lineCap: 'circle'
      };

      // Dashboard charts
      // ----------------------------------- 

      // Spline chart
      vm.splineChartOpts = angular.extend({}, flotOptions['default'], {
        series: {
          lines: {
            show: true,
            lineWidth: 2
          }
        },
        height: 420,
        legend: {
            show: false
        },
        xaxis:{
          mode: 'time',
          timezone: "browser",
          axisLabel: 'Time'
        },
        yaxis:{
          axisLabel: 'Mememory Usage (%)'
        }
      });

      getLeaksData();

      function onReporterSelect(event, data) {
        getLeaksData();
      }

      vm.refreshChart = function (event) {
        getLeaksData();
      }

      function getLeaksData() {
        if (typeof $rootScope.currentReporter != 'undefined') {
          $rootScope.chartLoading = true;
          // $http.get('http://192.168.38.1:5555/reporters/'+ $rootScope.currentReporter._source.idReporters +'/unitsdata?from=' + $rootScope.currentPeriod.from.toISOString()
          $http.get('http://localhost:5555/reporters/'+ $rootScope.currentReporter._source.idReporters +'/unitsdata?from=' + $rootScope.currentPeriod.from.toISOString()
            + '&to=' + $rootScope.currentPeriod.to.toISOString())
            .success(function (res) {
              vm.splineData = generateLeaksSeries(res);
            })
            .error(function (err) {
              console.log(err);
            })
            .finally(function () {
              $rootScope.chartLoading = false;
            });
        }
      }


      vm.areaSplineSeries = [];

      function generateLeaksSeries(rawData) {
        var leaksSeries = []
        var i = 0;
        for (var unit in rawData) {
          leaksSeries[i] = {
            'label': rawData[unit].IPV4,
            'color': getRandomColor(),
            'index':i,
            'data': []
          };

          vm.areaSplineSeries[i] = true;

          var unitData = rawData[unit].data
          for (var d in unitData) {
            leaksSeries[i].data.push([new Date(unitData[d].date).getTime(), ((unitData[d].dcmMemInUse * 100)/(unitData[d].dcmMemTotal * 1.00))])
          }

          i++;
        }

        return leaksSeries;
      }

      function getRandomColor () {
        var color = '#'+Math.floor(Math.random()*16777215).toString(16);
        return color;
      }

      // Small line chart
      // ----------------------------------- 
      vm.smallChartOpts = angular.extend({}, flotOptions['default'], {
        points: {
          show: true,
          radius: 1
        },
        series: {
          lines: {
            show: true,
            fill: 1,
            lineWidth: 1,
            fillColor: { colors: [ { opacity: 0.4 }, { opacity: 0.4 } ] }
          }
        },
        grid: {
            show: true
        },
        legend: {
            show: true
        },
        xaxis: {
            tickDecimals: 0
        }
      });
      vm.smallChartData1 = [{
        'label': '',
        'color': colors.byName('success'),
        'data': [
          ['1', 8],['2', 10],['3', 12],['4', 13],['5', 13],['6', 12],['7', 11],['8', 10],['9', 9],['10', 8],['11', 8],['12', 9],['13', 10],['14', 9],['15', 8]
        ]
      }];
      vm.smallChartData2 = [{
        'label': '',
        'color': colors.byName('warning'),
        'data': [
          ['1', 9],['2', 10],['3', 9],['4', 11],['5', 12],['6', 11],['7', 10],['8', 9],['9', 8],['10', 8],['11', 8],['12', 10],['13', 12],['14', 13],['15', 13]
        ]
      }];
      // Sparkline
      // ----------------------------------- 
      
      vm.sparkValues1 = [2,3,4,6,6,5,6,7,8,9,10];
      vm.sparkValues2 = [2,3,4,1,2,3,5,4,9,6,1];
      vm.sparkValues3 = [6,5,1,2,6,9,8,7,4,5,6,9];
      vm.sparkOptions = {
        barColor:      colors.byName('gray'),
        height:        15,
        barWidth:      5,
        barSpacing:    3,
        chartRangeMin: 0
      };

      vm.sparkValuesLine = [1,3,4,7,5,9,4,4,7,5,9,6,4];
      vm.sparkOptionsLine = {
        chartRangeMin: 0,
        type:               'line',
        height:             '80',
        width:              '100%',
        lineWidth:          '2',
        lineColor:          colors.byName('purple'),
        spotColor:          '#888',
        minSpotColor:       colors.byName('purple'),
        maxSpotColor:       colors.byName('purple'),
        fillColor:          '',
        highlightLineColor: '#fff',
        spotRadius:         '3',
        resize:             'true'
      };

    }
})();
