const express = require('express'); 
const socket = require('socket.io'); 
const http = require('http'); 
const path = require('path');
const app = express(); 
const server = http.Server(app); 
const Initiators = require('./controller/initiatorDataStructure');

const DataPeerConfigurations = { 
  serverThreshold: 2,
  imageTransfer: true,
  geoConnect: false,
};

const inits = new Initiators();
const initList = inits.list;
let initNumber = 0;
const currentSenders = {};
let imageRequests = 0; // track server, for demonstration purposes 


////////////////////////////// Test Server Routes //////////////////////////////

app.use(express.static(path.join(__dirname, './../client')));

app.get('/images/:imageName', (req, res) => {
    imageName = req.params.imageName;
    // console.log(imageName);
    let url = ('./../Images/' + imageName + '.jpg');
    // console.log(url);
    res.sendFile(path.join(__dirname, url))
    imageRequests++
    console.log('This many total imageRequests:', imageRequests);
})

////////////////////////////// Client Configuration Inputs //////////////////////////////


DataPeerInvocation(server, DataPeerConfigurations);

////////////////////////////// Socket listeners //////////////////////////////


function DataPeerInvocation(server, DataPeerConfigurations) {

  // Default Configuration Settings
  DataPeerConfigurations = {... DataPeerConfigurations}
  DataPeerConfigurations.threshold = DataPeerConfigurations.serverThreshold || 1;
  DataPeerConfigurations.imageTransfer = DataPeerConfigurations.imageTransfer !== false; // // need to add conditions
  // asset  types if jpeg, gif
  // browser comp. 
  // device 
  //DataPeerConfigurations.geoConnect = DataPeerConfigurations.geoConnect !== false; // need to add conditions
  
  const io = socket(server);
  
  io.on('connection', function(client) {
    console.log('Welcome', client.id);
    
    client.emit('retrieve_data');

    client.on('retrieve_data', (downloaded) => {
      if (!downloaded) getData(client, io, DataPeerConfigurations);
      else console.log('We meet again!');
    });

    client.on('initButton', () => {
      console.log('initNumber:', initNumber);
      console.log('initList:', initList);
    })
    
    client.on('sendy', () => {
      inits.add(client.id); 
      if (currentSenders[client.id]) {
        delete currentSenders[client.id];
      } 
      initNumber++;
    });
    
    client.on('disconnect', () => {
      if (initList[client.id]) {
      inits.remove(client.id);
      initNumber--;
      // console.log(initNumber, 'are available');
      } 
      if (currentSenders[client.id]) {
        io.to(currentSenders[client.id]).emit('access_directly_from_server');
        delete currentSenders[client.id];
        // console.log('After removal, current senders is:', Object.keys(currentSenders));
      } 
    }); 

    client.on('message', (messageReceived, recipient) => {
      io.to(recipient).emit('message', messageReceived);
    });
  })
}

function getData(client, io) { 
  if (!DataPeerConfigurations.imageTransfer) { // Image transfer off
    console.log('imageTransfer is', DataPeerConfigurations.imageTransfer);
    client.emit('access_directly_from_server');
  } else if (initNumber < DataPeerConfigurations.serverThreshold) { // Not enough peers
    console.log('Not starting because initNumber is', initNumber, 'but threshold is', DataPeerConfigurations.serverThreshold);
    client.emit('access_directly_from_server');
  } else { // Do the peer connection
    console.log('inintnumber is', initNumber, 'threshold is', DataPeerConfigurations.serverThreshold)
    console.log('Initiating a connection between',inits.head, 'and', client.id);
    client.emit('receiver', inits.head);
    io.to(inits.head).emit('sender', client.id);
    currentSenders[inits.head] = client.id;
    // console.log('After addition, current senders is:', Object.keys(currentSenders));
    inits.remove(inits.head);
    initNumber--;
  }
}

server.listen(3000);

