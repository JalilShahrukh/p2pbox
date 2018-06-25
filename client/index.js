// Initialize sockets

console.log('Running index.js');
let initiator = true;

var configuration = {
  'iceServers': [{
    'urls': 'stun:stun.l.google.com:19302'
  }]
};

/****************************************************************************
* Signaling server
****************************************************************************/

const socket = io.connect('http://localhost:3000');
const input = document.getElementById('input');
const upload = document.getElementById('upload'); 

upload.addEventListener('click', () => {
  var file = document.getElementById('getval').files[0]; 
  var reader = new FileReader(); 
  reader.onloadend = function() { 
    document.getElementById('image').style.backgroundImage = "url(" + reader.result + ")";
  }
  if (file) reader.readAsDataURL(file); 
}); 

//Add Event Listener to input button.
input.addEventListener('click', () => {
  socket.emit('message', 'Hi there!');
});

//Message to be sent. 
socket.on('message', (input) => {
    console.log(input);
});

//First person to enter the room. 
socket.on('ready', () => {
  console.log('Socket is ready.'); 
  createPeerConnection(initiator, configuration);     
});

//Second person to enter the room. 
socket.on('joined', () => {
    initiator = false;
    console.log('Im the second to join')
    createPeerConnection(initiator, configuration);
});

/****************************************************************************
* WebRTC peer connection and data channel
****************************************************************************/

var peerConn;
var dataChannel; 

function createPeerConnection(isInitiator, config) { 
  console.log('Creating Peer connection as initiator?', isInitiator, 'config:', config);
  peerConn = new RTCPeerConnection(config);

  peerConn.onicecandidate = function(event) { 
    console.log('icecandidate event:', event);
    if (event.candidate) { 
      sendMessage({ 
        type: 'candidate',
        label: event.candidate.sdpMLineIndex, 
        id: event.candidate.sdpMid, 
        candidate: event.candidate.candidate
      }); 
    } else { 
      console.log('End of candidates.'); 
    }//end if else
  }

  if (isInitiator) { 
    console.log('Creating Data Channel'); 
    dataChannel = peerConn.createDataChannel('photos'); 
    onDataChannelCreated(dataChannel);

    console.log('Creating an offer.'); 
    peerConn.createOffer(onLocalSessionCreated, logError); 
  } else { 
    peerConn.ondatachannel = function(event) { 
      console.log('ondatachannel', event.channel); 
      dataChannel = event.channel; 
      onDataChannelCreated(dataChannel);   
    }
  }//end if else
}

/**
* Send message to signaling server
*/
function sendMessage(message) {
  console.log('Client sending message: ', message);
  socket.emit('message', message);
}

function onDataChannelCreated(channel) { 
  console.log('onDataChannelCreated:', channel); 
  channel.onopen = function() { 
    console.log('Channel opened.'); 
  }

  channel.onclose = function() { 
    console.log('Channel closed.');   
  }
}

function onLocalSessionCreated(desc) { 
  console.log('local session created:', desc); 
  peerConn.setLocalDescription(desc, () => { 
    console.log('send local desc:', peerConn);
  }, logError);
}

function singalingMessageCallback(message) { 
  if (message.type === 'offer') { 
      console.log('Got offer. Sending answer to peer.');
      peerConn.setRemoteDescription(new RTCSessionDescription(message), logError);
      peerConn.createAnswer(onLocalSessionCreated, logError); 
  } else if (message.type === 'answer') { 
      console.log('Got answer.'); 
      peerConn.setRemoteDescription(new RTCSessionDescription(message), logError); 
  } else if (message.type === 'candidate') { 
      peerConn.addIceCandidate(new RTCIceCandidate({
        candidate: message.candidate
    }));
  }
}

function logError(err) {
  if (!err) return;
  if (typeof err === 'string') {
    console.warn(err);
  } else {
    console.warn(err.toString(), err);
  }//end if else 
}