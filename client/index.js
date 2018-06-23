// Initialize sockets

// const   
let initiator = true;
console.log('Running index.js')

const socket = io.connect('http://localhost:3000');
const input = document.getElementById('input');

input.addEventListener('click', () => {
    socket.emit('message', 'Hi there!');
})

socket.on('message', (input) => {
    console.log(input);
})

socket.on('joined', () => {
    initiator = false;
    console.log('Im the second to join')
    createPeerConnection();
})

socket.on('ready', () => {
    console.log('Now I know the server is ready')
    createPeerConnection();
})

function createPeerConnection() {
    console.log('Creating a peer connection');
}