angular.module('drawEverywhere')
  .directive('canvasDraw', function(socket){
    return {
      restrict: 'A',
      link: function(scope, element, attrs){
        // Retrieves the node in the DOM representing the <canvas> element
        var canvas = element[0];

        // <canvas> element has a getContext() method for rendering context and drawing. 
        // Pass '2d' to render 2D graphics
        var ctx = canvas.getContext('2d');

        // Set width and height of canvas here. Important step for proper X and Y coordinates during drawing.
          // Otherwise, if set with CSS styling, X and Y coordinates will be inaccurate.
        canvas.width = 600;
        canvas.height = 400;

        // Mouse coordinates (start for mousedown and end for mousemove)
        var startX, startY, endX, endY;

        // Mousemove event to draw will not be activated until mousedown event is registered
        var startDrawing = false;

        // Random color function
        var generateRandomColor = function(){
          // Set r,g,b values to 255 for white.
          var r = 255, g = 255, b = 255;

          // Since canvas is white, generate a random color that is not equal to white, or RGB(255, 255, 255).
          while(r===255 && g===255 && b===255){
            r = Math.floor(Math.random() * 256);
            g = Math.floor(Math.random() * 256);
            b = Math.floor(Math.random() * 256);
          }
          var randomColor = 'RGB(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ')';
          return randomColor;
        }

        var color = generateRandomColor();

        // draw function will do the actual canvas drawing
        var draw = function(moveX, moveY, lineToX, lineToY, color){
          // Begin canvas path to initialize drawing
          ctx.beginPath()
          // Initial mouse location
          ctx.moveTo(moveX, moveY);
          // Draw line to new mouse location
          ctx.lineTo(lineToX, lineToY);
          // Set color of line
          ctx.strokeStyle = color;
          // Executes the drawing stroke
          ctx.stroke();
          // Close path to finish drawing
          ctx.closePath();
        }

        // New start and end XY coordinates from another user are sent here
          // Socket executes draw function with data from the other user's drawing movements
        socket.on('draw', function(data){
          return draw(data.startX, data.startY, data.endX, data.endY, data.color);
        });

        element.bind('mousedown', function(event){
          // event.offset if using Chrome, otherwise second half of statement if using Firefox
          startX = event.offsetX || event.clientX - $(event.target).offset().left;
          startY = event.offsetY || event.clientY - $(event.target).offset().top;

          startDrawing = true;
        });

        element.bind('mousemove', function(event){
          if(startDrawing){
            endX = event.offsetX || event.clientX - $(event.target).offset().left;
            endY = event.offsetY || event.clientY - $(event.target).offset().top;

            // Invoke draw function with start and end coordinates
            draw(startX, startY, endX, endY, color);

            // Send all start and end XY coordinates
              // This will then execute socket.on('draw') above
            socket.emit('drawing', { 
              startX: startX,
              startY: startY,
              endX: endX,
              endY: endY,
              color: color
            });

            // Previous end X and Y coordinates become the new start coordinates
            startX = endX;
            startY = endY;
          }
        });

        element.bind('mouseup', function(event){
          // End drawing during mousemove
          startDrawing = false;
        });
      }
    }
  });
