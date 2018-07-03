const express = require('express'); 
const socketIO = require('socket.io'); 
const http = require('http'); 
const path = require('path');
const app = express(); 
const server = http.Server(app); 
const io = socketIO(server);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './../client/index.html'));
});

app.get('/myJS', (req, res) => {
    res.sendFile(path.join(__dirname, './../client/index.js'))
})

io.on('connection', function(socket) {
    socket.join('myroom2');
    let clientsInRoom = io.sockets.adapter.rooms['myroom2'];
    let numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
    console.log('numClients is', numClients);

    if (numClients === 1) {
        socket.emit('created');
    }
   
    if (numClients === 2) {
        console.log('initiating the CPC');
        socket.emit('joined');
        /// Below is the double-call from codelabs, not necessary
        // io.sockets.in('myroom2').emit('ready');
        socket.broadcast.emit('ready');
    }
    // console.log('Now connected to new socket');

    socket.on('message', (messageReceived) => {
        // console.log(messageReceived);
        // socket.emit('message', 'you sent a message');
        socket.broadcast.emit('message', messageReceived);
    })
    // console.log('numClients is', numClients);
})

server.listen(3000);