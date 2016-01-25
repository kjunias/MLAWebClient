/**=========================================================
 * Module: FlotChartDirective.js
 * Initializes the Flot chart plugin and handles data refresh
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('monitoring')
        .directive('flot', flot);
    
    flot.$inject = ['$rootScope', '$http', '$timeout'] ;
    function flot($rootScope, $http, $timeout) {
      
      return {
        restrict: 'EA',
        template: '<div></div>',
        scope: {
          dataset: '=?',
          options: '=',
          series: '=?bind',
          plotselected: '=',
          callback: '='
        },
        link: linkFunction
      };
      
      function linkFunction(scope, element, attributes) {
        var height, plot, plotArea, width;
        var heightDefault = 400;

        scope.isZoomed = false;
        scope.zoomRanges = [];
        scope.initialRanges = {};

        plot = null;

        width = attributes.width || '100%';
        height = attributes.height || heightDefault;

        plotArea = $(element.children()[0]);
        plotArea.css({
          width: width,
          height: height
        });

        function init() {
          var plotObj;
          if(!scope.dataset || !scope.options) return;
          plotObj = $.plot(plotArea, scope.dataset, scope.options);
          scope.$emit('plotReady', plotObj);
          if (scope.callback) {
            scope.callback(plotObj, scope);
          }

          return plotObj;
        }

        function onDatasetChanged(dataset) {
          if (plot) {
            plot.setData(dataset);
            plot.setupGrid();
            plot.draw();
          } else {
            plot = init();
            onSerieToggled(scope.series);
            plot;
          }

          scope.initialRanges = {
            xaxis: {
              from: plot.getAxes().xaxis.min,
              to: plot.getAxes().xaxis.max
            },
            yaxis: {
              from: plot.getAxes().yaxis.min,
              to: plot.getAxes().yaxis.max
            }
          };

          // scope.zoomRanges[0] = scope.initialRanges;

          // console.log('01 ====> unZoom: ', scope.initialRanges);
        }

        scope.$watchCollection('dataset', onDatasetChanged, true);

        function onSerieToggled (series) {
          if( !plot || !series ) return;
          var someData = plot.getData();
          /*jshint -W089 */
          for(var sName in series) {
            angular.forEach(series[sName], toggleFor(sName));
          }
          
          plot.setData(someData);
          plot.draw();
          
          function toggleFor(sName) {
            return function (s, i){
              if(someData[i] && someData[i][sName])
                someData[i][sName].show = s;
            };
          }
        }
        scope.$watch('series', onSerieToggled, true);

        element.bind('plotselected', function( event, ranges) {
          zoom(event, ranges);

          scope.isZoomed = true;
          scope.zoomRanges.push(ranges);

          console.log('1 ====> zoom: ', scope.isZoomed, scope.zoomRanges);

        });

        function zoom(evt, ranges) {
          $.each(plot.getXAxes(), function(_, axis) {
            var opts = axis.options;
            opts.min = ranges.xaxis.from;
            opts.max = ranges.xaxis.to;
          });

          $.each(plot.getYAxes(), function(_, axis) {
            var opts = axis.options;
            opts.min = ranges.yaxis.from;
            opts.max = ranges.yaxis.to;
          });

          plot.setupGrid();
          plot.draw();
          plot.clearSelection();
        }

        element.on('dblclick', unZoom);

        function unZoom (eventData, handler) {
          if (scope.isZoomed && scope.zoomRanges.length === 0) {
            console.log('2 ====> unZoom: ', scope.isZoomed, scope.zoomRanges);
            zoom(eventData, scope.initialRanges);
            scope.isZoomed = false;
            return;
          }

          if (!scope.isZoomed) {
            return;
          }

          var ranges = scope.zoomRanges.pop();
            
          zoom(eventData, ranges);
        }
      }
    }

})();
