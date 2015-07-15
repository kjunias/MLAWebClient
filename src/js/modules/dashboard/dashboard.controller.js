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
      $rootScope.currentPeriod = {
        from : new Date(),
        to: new Date()
      }

      $rootScope.currentPeriod.from.setHours(0,0,0);
      $rootScope.currentPeriod.to.setHours(23,59,59);

      console.log("===> initial $rootScope.currentPeriod:", $rootScope.currentPeriod);

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
          barColor: colors.byName('info'),
          // trackColor: colors.byName('inverse'),
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
        legend: {
            show: false
        },
        xaxis:{
          mode: 'time',
          axisLabel: 'Testing'
        },
        yaxis:{
          axisLabel: 'Testing'
        }
      });

      getLeaksData();

      $rootScope.$on('reporter.selected', onReporterSelect)

      function onReporterSelect(event, data) {
        getLeaksData();
      }

      function getLeaksData() {
        $http.get('http://localhost:5555/reporters/'+ $rootScope.currentReporter._source.idReporters +'/unitsdata?from=' + $rootScope.currentPeriod.from.toISOString()
          + '&to=' + $rootScope.currentPeriod.to.toISOString())
          .success(function (res) {
            console.log("=====>gotData", res);
            vm.splineData = generateLeaksSeries(res);
          })
          .error(function (err) {
            console.log(err);
          });
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
            leaksSeries[i].data.push([new Date(unitData[d].date).getTime(), unitData[d].dcmMemInUse])
          }

          i++;
        }

        return leaksSeries;
      }

      function getRandomColor () {
        var color = '#'+Math.floor(Math.random()*16777215).toString(16);
        return color;
      }

      function getSplineData() {
        return [{
          'label': '192.168.4.101',
          'color': getRandomColor(),
          'data': [
            ['1', 28],['2', 30],['3', 32],['4', 33],['5', 33],['6', 32],['7', 31],['8', 30],['9', 29],['10', 28],['11', 28],['12', 29],['13', 30],['14', 29],['15', 28]
          ]
        }, {
          'label': '192.168.4.102',
          'color': getRandomColor(),
          'data': [
            ['1', 12],['2', 14],['3', 20],['4', 16],['5', 18],['6', 14],['7', 19],['8', 24],['9', 18],['10', 14],['11', 16],['12', 15],['13', 14],['14', 16],['15', 18]
          ]
        }, {
          'label': '192.168.4.103',
          'color': getRandomColor(),
          'data': [
            ['1', 6],['2', 8],['3', 7],['4', 6],['5', 7],['6', 10],['7', 9],['8', 8],['9', 10],['10', 9],['11', 6],['12', 8],['13', 9],['14', 10],['15', 10]
          ]
        }];
      }

      $scope.$watch('app.theme.name', function(val) {
        // vm.splineData = getSplineData();
        vm.splineData = getLeaksData();
      });

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
