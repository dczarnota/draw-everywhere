angular.module('drawEverywhere')
  .directive('canvasDraw', function(socket, RandomColorFactory, ClearCanvasFactory){
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

        // Mousemove event to draw will not be activated until mousedown event is registered (this will toggle startDrawing to true)
        var startDrawing = false;

        // Create unique random color for each user
        var color = RandomColorFactory.generateRandomColor();

        // This variable will capture the state of the canvas 
        var currentCanvas;

        // draw function will do the actual canvas drawing
        var draw = function(moveX, moveY, lineToX, lineToY, color){
          // Begin canvas path to initialize drawing
          ctx.beginPath();
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
          // Capture state of current canvas as a data url
          currentCanvas = canvas.toDataURL();
          // Socket sends state of current canvas
          socket.emit('stateOfCanvas', {
            currentCanvas: currentCanvas
          });
        };

        // This function takes the currentCanvas data url and translates the information as an image to display on the <canvas> html element. 
          // Therefore, a new user will see what was already drawn before he/she connected
        var loadCanvas = function(currentCanvas){
          var imageObj = new Image();
          imageObj.onload = function() {
            ctx.drawImage(this, 0, 0);
          };
          imageObj.src = currentCanvas;
        };

        // On mousedown event for the canvas element
        element.bind('mousedown', function(event){
          // If browser is Chrome, then: event.offsetX
          // Else if browser is Firefox, then: event.clientX - $(event.target).offset().left;
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

            // Send all start and end XY coordinates to socket
              // This will then execute socket.on('draw')
            socket.emit('drawing', { 
              startX: startX,
              startY: startY,
              endX: endX,
              endY: endY,
              color: color,
              currentCanvas: currentCanvas
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

      // Event listener for clear canvas button. Will clear the canvas for the user
      document.getElementById('btn-clear').addEventListener('click', function(){
        ClearCanvasFactory.clearCanvas(ctx, canvas);  
      }, false);


       //Socket IO Events

       // Socket executes draw function with data from the other user's drawing movements
       socket.on('draw', function(data){
         draw(data.startX, data.startY, data.endX, data.endY, data.color);
       });

       // Socket listens for new client connection
       socket.on('connect', function(){
        // On new connection, load the current state of the canvas
        socket.on('loadCanvas', function(data){
          loadCanvas(data.currentCanvas);
        })
       });

      }
    }
  });
