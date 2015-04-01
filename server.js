var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(8080, function(){
  console.log('Listening on port:8080');
});

// Serve all client files
app.use(express.static(__dirname + '/'));

// Setup socket.io connection
io.on('connection', function(socket){
  console.log('Socket connected.');

  // Listens for socket.emit in main.directives.js
    // Socket sends all start and end XY data points across websockets to update canvas drawing
  socket.on('drawing', function(data){
    console.log('data: '+data.startX, data.startY, data.endX, data.endY);

    socket.broadcast.emit('draw', { 
      startX: data.startX,
      startY: data.startY,
      endX: data.endX,
      endY: data.endY,
    });
  });
});
