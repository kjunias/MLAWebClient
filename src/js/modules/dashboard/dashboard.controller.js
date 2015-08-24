/**=========================================================
 * Module: DashboardController.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('DashboardController', DashboardController);
    
    DashboardController.$inject = ['$rootScope', '$scope', '$http', '$modal', '$controller', 'colors', 'flotOptions', '$timeout', 'serverStatus', 'memoryleaks', 'BACKEND'];
    function DashboardController($rootScope, $scope, $http, $modal, $controller, colors, flotOptions, $timeout, serverStatus, memoryleaks, BACKEND) {
      var vm = this;
      vm.title = 'MemoryLeaks Web Client';
      vm.text = 'AngularJS Web Application for the Mediatrix Units MemoryLeaks Metrics';
      var SERVER_UPDATE_INTERVAL = 20 * 1000;

      $rootScope.chartLoading = true;
      $rootScope.singleSeriesToggled = false;
      $rootScope.currentPeriod = {
        from : new Date(),
        to: new Date(),
        resolution: 200
      };

      $rootScope.leaksSeries = [];
      $rootScope.showAll = true;
      vm.showSeriesLegend = [];

      $rootScope.reportersMappings = {'192.168.4.108':'192.168.8.1',
                                      '192.168.4.127':'192.168.27.2',
                                      '192.168.4.112':'192.168.12.1',
                                      '192.168.4.128':'192.168.28.1',
                                      '192.168.4.138':'192.168.38.1',
                                      '192.168.4.96':'192.168.25.1'
                                    };

      $rootScope.currentPeriod.from.setDate($rootScope.currentPeriod.from.getDate() - 1);      
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

      vm.cpuPieValue = vm.memPieValue = vm.storagePieValue = vm.dbSize = vm.dbDocCount = 0;
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

      vm.getServerStatus = function () {
        serverStatus.getServerStatus().then(function(resp) {
          vm.cpuPieValue = Math.round($rootScope.serverStatus.cpu.usage * 100);
          vm.memPieValue = Math.round(100 - $rootScope.serverStatus.mem.memFreePerc * 100);
          vm.memValue = numeral($rootScope.serverStatus.mem.memTotal - $rootScope.serverStatus.mem.memFree).format('0 b').toUpperCase();

          vm.diskPieValue = Math.round(100 - $rootScope.serverStatus.disk.freeSpace/$rootScope.serverStatus.disk.totalSpace * 100);
          vm.diskValue = numeral($rootScope.serverStatus.disk.totalSpace - $rootScope.serverStatus.disk.freeSpace).format('0 b').toUpperCase();

        });
      };

      vm.getDatabasetatus = function () {
        memoryleaks.getDatabaseStatus().then(function(resp) {
          var str = $rootScope.dbStatus._all.total.store.size.toUpperCase(); 
          var position = str.length - 2;
          
          vm.dbSize = [str.slice(0, position), ' ', str.slice(position)].join('');
          vm.dbDocCount = numeral($rootScope.dbStatus._all.total.docs.count).format('0.0 a').toUpperCase();

          updateSparkSearchkValues();
          updateSparkIndexValues();
        });
      };

      vm.reportersModalOpen = function (repSettings) {
        var modalInstance = $modal.open({
          templateUrl: '/reportersSettingsModal.html',
          controller: 'ReportersSettingsController',
          scope: $scope
        });
      };

      function bytesToSize(bytes, decimals) {
        if(bytes == 0) return '0 Byte';
        var k = 1000;
        var dm = decimals + 1 || 3;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
      }

      vm.updateStatuses =  function () {
        vm.getDatabasetatus();
        vm.getServerStatus();
      }

      vm.updateStatuses();

      setInterval(vm.updateStatuses, SERVER_UPDATE_INTERVAL);


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
          axisLabel: 'Time',
          // zoomRange: [0.1, 10]
        },
        yaxis:{
          axisLabel: 'Mememory Usage (%)',
          // zoomRange: [0.1, 10]
        },
        tooltipOpts: {
          onHover: hoverPoint
        },
        selection: {
          mode: 'xy',
          color: 'blue'
        },
        zoom: {
          interactive: true
        },
        pan: {
          interactive: true
        }
      });

      function hoverPoint (flotItem, $tooltipEl) {
        var idCurrentConfiguration = flotItem.series.data[flotItem.dataIndex][2];
        var config = $rootScope.configs[idCurrentConfiguration];
        var ipv4 = $rootScope.unitsIPv4s[config.idIPv4].IPv4;
        var loadVersion = $rootScope.loads[config.idLoadVersion].loadVersion;
        var serialNo = $rootScope.serials[config.idSerial].serialNo;

        var str = 'Time: ' + new Date(flotItem.datapoint[0]).toLocaleString() + '<br>' +
              'Mem(%): ' + flotItem.datapoint[1].toFixed(3) + '<br>' +
              'IPv4: ' + ipv4 + '<br>' +
              'Serial: ' + serialNo + '<br>' +
              'Load: ' + loadVersion + '<br>';

        $tooltipEl.text('');
        $tooltipEl.append(str);
      }

      getLeaksData();

      function onReporterSelect(event, data) {
        getLeaksData();
      }

      vm.refreshChart = function (event) {
        updateLeaksData();
      }

      function updateLeaksData() {
        erase();
        $rootScope.chartLoading = true;
        var unitsToUpdate = [];
        for (var unit in $rootScope.leaksSeries) {
          if ($rootScope.leaksSeries[unit].show) {
            unitsToUpdate.push($rootScope.leaksSeries[unit].idUnits);
          }
        }

        $http.get( BACKEND.baseURL + '/reporters/'+ encodeURI($rootScope.currentReporter._source.idReporters) +'/unitsdata/update', {
          params: {
            from: $rootScope.currentPeriod.from.toISOString(),
            to: $rootScope.currentPeriod.to.toISOString(),
            units: unitsToUpdate,
            resolution: $rootScope.currentPeriod.resolution
          }
        })
        .success(function (res) {
          updateLeaksSeries(res);
        })
        .error(function (err) {
          console.log(err);
        })
        .finally(function () {
          $rootScope.chartLoading = false;
        });
      }


      function updateLeaksSeries(rawData) {
        $rootScope.chartLoading = true;
        erase();
        if ($rootScope.leaksSeries.length === 0 ) {
          generateLeaksSeries(rawData);
          redraw();
          return;
        }

        for (var i in rawData) {
          for (var j in $rootScope.leaksSeries) {
            if (rawData[i].idUnits === $rootScope.leaksSeries[j].idUnits) {
              $rootScope.leaksSeries[j].data = [];
              var unitData = rawData[i].data;
              for (var d in unitData) {
                var x = new Date(unitData[d].date).getTime();
                var y = ((unitData[d].dcmMemInUse * 100)/(unitData[d].dcmMemTotal * 1.00));
                $rootScope.leaksSeries[j].data.push([x, y, unitData[d].idCurrentConfiguration]);
              }
            }
          }
        }

        $rootScope.chartLoading = false;
        redraw();
      }


      function getLeaksData() {
        if (typeof $rootScope.currentReporter != 'undefined') {
          $rootScope.chartLoading = true;
          $http.get( BACKEND.baseURL + '/reporters/'+ $rootScope.currentReporter._source.idReporters +'/unitsdata', {
            params: {
              from: $rootScope.currentPeriod.from.toISOString(),
              to: $rootScope.currentPeriod.to.toISOString(),
              resolution: $rootScope.currentPeriod.resolution
            }
          })
          .success(function (res) {
            generateLeaksSeries(res);
            redraw();
            $rootScope.showAll = true;
          })
          .error(function (err) {
            console.log(err);
          })
          .finally(function () {
            $rootScope.chartLoading = false;
          });
        }
      }

      function generateLeaksSeries(rawData) {
        erase();
        $rootScope.leaksSeries = [];
        var i = 0;
        for (var unit in rawData) {
          $rootScope.leaksSeries[i] = {
            'label': rawData[unit].IPV4,
            'idUnits': rawData[unit].idUnits,
            'color': getRandomColor(),
            'index':i,
            'show': true,
            'data': []
          };

          vm.showSeriesLegend[i] = $rootScope.leaksSeries[i].show;

          var unitData = rawData[unit].data
          for (var d in unitData) {
            var x = new Date(unitData[d].date).getTime();
            var y = ((unitData[d].dcmMemInUse * 100)/(unitData[d].dcmMemTotal * 1.00))
            $rootScope.leaksSeries[i].data.push([x, y, unitData[d].idCurrentConfiguration]);
          }

          i++;
        }
      }

      function getDrawableData () {
        var drawableSeries = [];
        vm.showSeriesLegend = []
        for (var unit in $rootScope.leaksSeries) {
          var unitSeries = $rootScope.leaksSeries[unit]
          vm.showSeriesLegend.push(false);
          if(unitSeries.show) {
            drawableSeries.push(unitSeries);
            vm.showSeriesLegend[unit] = unitSeries.show;
          }
        }
        return drawableSeries;
      }

      function erase() {
        vm.splineData = [];
      }

      function redraw() {
        vm.splineData = getDrawableData();
      }

      $scope.toggleLegend = function (series) {        
        var allFalse = true;
        var allTrue = true;        

        vm.showSeriesLegend[series.index] = series.show;
        $rootScope.singleSeriesToggled = true;

        if (series.show) {
          allFalse = false;

          for (var j in vm.showSeriesLegend) {
            if (!vm.showSeriesLegend[j].show) {
              allTrue = false;
              break;
            }
          }

        } else {
          allTrue = false;

          for (var i in vm.showSeriesLegend) {
            if (vm.showSeriesLegend[i].show) {
              allFalse = false;

              break;
            }
          }
        }
        redraw();
      }

      $scope.$watch('showAll', toggleAllEvent, true);

      function toggleAllEvent(currentValue, previousValue) {
        $rootScope.singleSeriesToggled = false;
        toggleAllLegend(currentValue, previousValue);
      }

      function toggleAllLegend (currentValue, previousValue) {
        if (!$rootScope.singleSeriesToggled) {
          erase();
          for (var i in vm.showSeriesLegend) {
            $rootScope.leaksSeries[i].show = vm.showSeriesLegend[i] = currentValue;
          }
          redraw();
        }
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

      vm.sparkSearchVals = [];
      vm.sparkIndexVals = [];

      vm.sparkOpts = {
        chartRangeMin: 0,
        type:               'line',
        height:             '70px',
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

      vm.sparkSearchOpts = {
        chartRangeMin: 0,
        type:               'line',
        height:             '70px',
        width:              '100%',
        lineWidth:          '2',
        lineColor:          colors.byName('info'),
        spotColor:          '#888',
        minSpotColor:       colors.byName('info'),
        maxSpotColor:       colors.byName('info'),
        fillColor:          '',
        highlightLineColor: 'green',
        spotRadius:         '3',
        resize:             'true'
      };

      vm.sparkReporterCPUOpts = angular.extend({}, vm.sparkSearchOpts, { height: '35px', fillColor: '#c0d0f0', fillOpacity: 0.25 });

      function updateSparkSearchkValues() {
        var queryCountDiff = $rootScope.dbStatus.currentQueryStats.query_time - $rootScope.dbStatus.lastQueryStats.query_time;
        var queryTimeDiff = ($rootScope.dbStatus.currentQueryStats.query_total - $rootScope.dbStatus.lastQueryStats.query_total)/1000;
        var rate = queryCountDiff/queryTimeDiff;
        
        if (vm.sparkSearchVals.length >= 20) {
          vm.sparkSearchVals.shift();
        }

        vm.sparkSearchVals.push(rate || 0);
        
      }

      function updateSparkIndexValues() {
        var indexCountDiff = $rootScope.dbStatus.currentQueryStats.index_time - $rootScope.dbStatus.lastQueryStats.index_time;
        var indexTimeDiff = ($rootScope.dbStatus.currentQueryStats.index_total - $rootScope.dbStatus.lastQueryStats.index_total)/1000;
        var rate = indexCountDiff/indexTimeDiff;
        
        if (vm.sparkIndexVals.length >= 20) {
          vm.sparkIndexVals.shift();
        }

        vm.sparkIndexVals.push(rate || 0);
      }

    }
})();
