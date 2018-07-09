const express = require('express'); 
const socketIO = require('socket.io'); 
const http = require('http'); 
const path = require('path');
const app = express(); 
const server = http.Server(app); 
const io = socketIO(server);
const aws = require('./awsController.js'); 

const inits = new Initiators();
const initList = inits.list;
let initNumber = 0;
const cutoff = 2;
const currentSenders = {};

function Initiators() {
    this.list = {};
    this.head = false;
    this.tail = false;
    this.nextUp = false;
}

Initiators.prototype.add = function(sID) {
    // List deconstruction
    list = this.list;
    // Make new node
    let newNode = new Node(sID);
    list[sID] = newNode;
    // If not first node
    if (this.head) {
        // Deconstruction
        head = this.head;
        tail = this.tail;
        // Add pointers from head/tail to this node
        list[tail].next = sID;
        // console.log('head is', head);
        list[head].prev = sID;
        // Add pointers from this node to head/tail
        newNode.next = head;
        newNode.prev = tail;  
        // Make new tail
        this.tail = sID;
    }  else { // If first node
        this.head = newNode.id;
        this.tail = newNode.id;
        this.nextUp = newNode.id
        newNode.next = sID;
        newNode.prev = sID;
    }
}

Initiators.prototype.remove = function(sID) {
    console.log('Removing', sID);
    // Deconstruction
    list = this.list;
    tail = this.tail;
    head = this.head;
    nextUp = this.nextUp;
    // Get linked IDs
    let prev = list[sID].prev;
    let next = list[sID].next;
    if (next === sID) { 
        // If only node, remove head/tail/nextUp
        this.head = false;
        this.tail = false;
        this.nextUp = false;
    } else {
        // Change links
        if (nextUp === sID) this.nextUp = next;
        if (tail === sID) this.tail = prev;
        if (head === sID) this.head = next;
        // Get linked nodes
        let prevNode = list[prev];
        let nextNode = list[next];
        prevNode.next = next;
        nextNode.prev = prev;
    }
    // Remove
    delete list[sID];
}

function Node(sID,avail = true) {
    this.id = sID,
    this.available = avail,
    this.next = sID,
    this.prev = sID
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './../client/index.html'));
});

app.get('/css', (req, res) => { 
  res.sendFile(path.join(__dirname, './../client/stylesheet.css')); 
});

app.get('/images', aws.getImages); 

app.get('/myJS', (req, res) => {
    res.sendFile(path.join(__dirname, './../client/index.js'))
}); 

app.get('/images', (req, res) => {
    console.log('Made correct get request')
    res.sendFile(path.join(__dirname, './../Images/gooddog.jpeg'))
    // res.sendFile(path.resolve('./../Images/gooddog.jpeg'));
})

io.on('connection', function(socket) {
    console.log('Welcome', socket.id);
    getData();

    socket.on('sendy', () => {
        // console.log('Guess who is sendy:', socket.id);
        inits.add(socket.id); 
        if (currentSenders[socket.id]) {
            delete currentSenders[socket.id];
            console.log('After removal, current senders is:', Object.keys(currentSenders));
        } 
        initNumber++;
        // console.log(initNumber, 'are available');
    })

    socket.on('disconnect', () => {
        if (initList[socket.id]) {
            inits.remove(socket.id);
            initNumber--;
            console.log(initNumber, 'are available');
        } 
        if (currentSenders[socket.id]) {
            io.to(currentSenders[socket.id]).emit('fromServer');
            delete currentSenders[socket.id];
            console.log('After removal, current senders is:', Object.keys(currentSenders));
        } 
    })

    socket.on('message', (messageReceived, recipient) => {
        io.to(recipient).emit('message', messageReceived);
    })

    function getData() {
        if (initNumber < cutoff) {
            socket.emit('fromServer');
        }
        else {
            let assigned = false;
            let unavailCounter = 0;
            while (!assigned) {
                console.log('nextUp is:', inits.nextUp);
                if (initList[inits.nextUp].available) {
                    // Start the connection;
                    console.log('Initiating a connection between', socket.id, 'and', inits.nextUp);
                    socket.emit('receiver', inits.nextUp);
                    io.to(inits.nextUp).emit('sender', socket.id);
                    // Remove the sender as an initiator and add to current senders
                    currentSenders[inits.nextUp] = socket.id;
                    console.log('After addition, current senders is:', Object.keys(currentSenders));
                    inits.remove(inits.nextUp);
                    initNumber--;
                    // console.log(initNumber, 'are available');
                    // Iterate nextUp and mark them as assigned
                    inits.nextUp = initList[inits.nextUp].next;
                    assigned = true;
                } else {
                    unavailCounter++;
                    inits.nextUp = initList[inits.nextUp].next;
                    if (unavailCounter > 5) {
                        console.log('Too many unavailable');
                        socket.emit('fromServer');
                        assigned = true;
                    }
                }
            }
        }
    }
})

server.listen(3000);

