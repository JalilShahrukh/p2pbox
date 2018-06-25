// Initialize sockets

let initiator = false;
let config = null;
console.log('Running index.js')

const socket = io.connect('http://localhost:3000');
const input = document.getElementById('input');

input.addEventListener('click', () => {
    // socket.emit('message', 'Hi there!');
    dataChannel.send('Wait....whats up bitch????')
})

socket.on('message', (input) => {
    // console.log('Message received:', input);
    signalingMessageCallback(input);
})

socket.on('created', () => {
    initiator = true;
    // console.log('I created the room')
})

socket.on('joined', () => {
    // initiator = false;
    // console.log('Im the second to join')
    createPeerConnection();
})

socket.on('ready', () => {
    // console.log('Now I know the server is ready')
    createPeerConnection();
})


let pc;
let dataChannel;

createPeerConnection = () => {
    console.log('Creating peer connection!');
    pc = new RTCPeerConnection(config);
    pc.onicecandidate = (event) => {
        console.log('onicecandidate triggered!');
        if (event.candidate) {
            console.log('onicecandidate event is:', event.candidate);
            sendMessage({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            })
        }
        else console.log('Out of candidates');
    }
    if (initiator) {
        // Create the data channel, label it messages
        dataChannel = pc.createDataChannel('messages');
        // Set up handlers for new data channel
        onDataChannelCreated(dataChannel)

        // Create offer, then pass to onLocalDescription
        // (which sets as local description and sends it)
        pc.createOffer(onLocalDescription, logError);
    }
    else {
        // Create an ondatachannel handler to respond
        // when the data channel from the other client arrives
        pc.ondatachannel = (event) => {
            dataChannel = event.channel
            onDataChannelCreated(dataChannel);
        }
    }
}

signalingMessageCallback = (message) => {
    if (message.type === 'candidate') {
        // console.log('Received icecandidate:', message.candidate);
        pc.addIceCandidate(new RTCIceCandidate({candidate: message.candidate}));
        console.log('After ice, RD sdp is:', pc.remoteDescription.sdp)
    }
    else if (message.type === 'answer') {
        console.log('Received answer:', message);
        pc.setRemoteDescription(new RTCSessionDescription(message), () => {}, logError);
        console.log('After answer, RD sdp is:', pc.remoteDescription.sdp)
    }
    else if (message.type === 'offer') {
        console.log('Received offer:', message);
        pc.setRemoteDescription(new RTCSessionDescription(message), () => {}, logError)
        console.log('After offer, RD sdp is:', pc.remoteDescription.sdp);
        pc.createAnswer(onLocalDescription, logError);
    }
}

onDataChannelCreated = channel => {
    console.log('Called onDataChannelCreated');
    channel.onopen = () => {
        console.log('Channel opened');
    }

    channel.onclose = () => {
        console.log('Channel closed');
    }

    channel.onmessage = message => {
        console.log('Received this message through WebRTC:', message.data);
    }
}

onLocalDescription = desc => {
    pc.setLocalDescription(desc, () => {
        console.log('Sending local description:', pc.localDescription);
        sendMessage(pc.localDescription)
    }, logError);
}

sendMessage = message => {
    socket.emit('message', message);
}

logError = err => {
    console.log('Error:', err);
}
