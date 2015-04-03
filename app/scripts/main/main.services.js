angular.module('drawEverywhere')
  .factory('socket', function($rootScope){
    
    // Connect to websocket
    var socket = io.connect();
    return {
      on: function(eventName, callback){
        socket.on(eventName, function(){
          var args = arguments;
          $rootScope.$apply(function(){
            callback.apply(socket, args);
          });
        });
      },
      emit: function(eventName, data, callback){
        socket.emit(eventName, data, function(){
          var args = arguments;
          $rootScope.$apply(function(){
            if(callback){
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  })

  .factory('RandomColorFactory', function(){
    // Generates random color for each user
    return {
      generateRandomColor: function(){
        // Set r,g,b values to 255 for white.
        var r = 255, g = 255, b = 255;
        var randomColor;

        // Since canvas is white, generate a random color that is not equal to white, or RGB(255, 255, 255).
        while(r===255 && g===255 && b===255){
          r = Math.floor(Math.random() * 256);
          g = Math.floor(Math.random() * 256);
          b = Math.floor(Math.random() * 256);
        }
        randomColor = 'RGB(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ')';
        return randomColor;
      }
    }
  })

  .factory('ClearCanvasFactory', function(){
    return {
      clearCanvas: function(context, canvas){
        return context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  });
