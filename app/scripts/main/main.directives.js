angular.module('drawEverywhere')
  .directive('canvasDraw', function(){
    return {
      restrict: 'E',
      templateUrl: '/app/scripts/templates/canvasDraw-template.html'
    }
  });
