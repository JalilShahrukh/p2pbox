const express = require('express'); 
const socketIO = require('socket.io'); 
const http = require('http'); 
const path = require('path');
const app = express(); 
const server = http.Server(app); 
const io = socketIO(server);
const mongoose = require('mongoose');
const imageController = require('./imageController');
const bodyParser = require('body-parser'); 
const fs = require('fs'); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

const uri = 'mongodb://starfish4:admin1@ds039441.mlab.com:39441/starfish4';
mongoose.connect(uri);
mongoose.connection.once('open', () => { 
  console.log('Connected to Database'); 
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './../client/index.html'));
});

app.get('/image', (req, res) => { 
  res.sendFile(path.join(__dirname, './../client/scene.jpg'));
});

app.get('/css', (req, res) => { 
  res.sendFile(path.join(__dirname, './../client/styles.css'));
});

app.get('/myJS', (req, res) => {
  console.log('Found new route');
  res.sendFile(path.join(__dirname, './../client/index.js'))
});

//app.get('/getFile', imageController.findImage); 

app.get('/video', function(req, res) { 
  const path = 'demo/demo.mp4'; //Change to actual route. 
  const stat = fs.statSync(path); //Provides information about a file.
  const fileSize = stat.size; //Size of file. 
  const range = req.headers.range; //The Range HTTP request header indicates the part of a document that the server should return.

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }//end if
}); 

io.on('connection', function(socket) {
    socket.join('myroom2');
    var clientsInRoom = io.sockets.adapter.rooms['myroom2'];
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;

    if (numClients === 1) {
        socket.emit('created');
    }
   
    if (numClients === 2) {
        console.log('initiating the CPC');
        socket.emit('joined');
        io.sockets.in('myroom2').emit('ready');
        socket.broadcast.emit('ready');
    }
    // console.log('Now connected to new socket');

    socket.on('message', (messageReceived) => {
        // console.log(messageReceived);
        // socket.emit('message', 'you sent a message');
        socket.broadcast.emit('message', messageReceived);
    })

    console.log('numClients is', numClients);
})

server.listen(3000, () => console.log('Listening on port 3000'));