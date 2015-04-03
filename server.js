var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 8080;

server.listen(port, function(){
  console.log('Listening on port:' + port);
});

// Serve all client files
app.use(express.static(__dirname + '/'));

var latestCanvas;

// Setup socket.io connection
io.on('connection', function(socket){

  // Socket sends all start and end XY data points across websockets to update canvas drawing
  socket.on('drawing', function(data){
    socket.broadcast.emit('draw', { 
      startX: data.startX,
      startY: data.startY,
      endX: data.endX,
      endY: data.endY,
      color: data.color
    });
  });

  // On any changes to the canvas, socket will update latestCanvas with the current version of the canvas
  socket.on('stateOfCanvas', function(data){
    latestCanvas = data.currentCanvas;  
  });

  // When a new user connects, send latestCanvas data
  socket.emit('loadCanvas', {
    currentCanvas: latestCanvas
  });
});
