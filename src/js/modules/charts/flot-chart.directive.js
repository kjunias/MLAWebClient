/**=========================================================
 * Module: FlotChartDirective.js
 * Initializes the Flot chart plugin and handles data refresh
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
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
          callback: '=',
          src: '='
        },
        link: linkFunction
      };
      
      function linkFunction(scope, element, attributes) {
        var height, plot, plotArea, width;
        var heightDefault = 400;

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
            return plot.draw();
          } else {
            plot = init();
            onSerieToggled(scope.series);
            return plot;
          }
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
        
        function onSrcChanged(src) {

          if( src ) {

            $http.get(src)
              .success(function (data) {

                $timeout(function(){
                  scope.dataset = data;
                });

            }).error(function(){
              $.error('Flot chart: Bad request.');
            });
            
          }
        }
        scope.$watch('src', onSrcChanged);

        element.bind('plotselected', function (evt, ranges) {
          console.log('===> plot selection: ', plot, ranges);
          // clamp the zooming to prevent eternal zoom

          if (ranges.xaxis.to - ranges.xaxis.from < 0.00001) {
            ranges.xaxis.to = ranges.xaxis.from + 0.00001;
          }

          if (ranges.yaxis.to - ranges.yaxis.from < 0.00001) {
            ranges.yaxis.to = ranges.yaxis.from + 0.00001;
          }

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

        })
      }

    }

})();
