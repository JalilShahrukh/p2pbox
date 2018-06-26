// Initialize sockets

let initiator = false;
let config = null;
console.log('Running index.js');
var img = document.getElementById('image'); 
var imgContext = img.getContext('2d'); 
var imgHeight = img.height; 
var imgWidth = img.width; 

const socket = io.connect('http://localhost:3000');
// document.getElementById('image').src = './scene.jpg'; 

input.addEventListener('click', () => {
    // socket.emit('message', 'Hi there!');
    // dataChannel.send('Wait....whats up bitch????')
    console.log('Hello'); 
    let link = document.createElement('li'); 
    link.innerText = 'Hello';  
    document.getElementById('list').appendChild(link);
    sendData();
})

socket.on('message', (input) => {
    // console.log('Message received:', input);
    signalingMessageCallback(input);
})

socket.on('created', () => {
    initiator = true;
    var img = document.createElement('div');
    img.src = '/image';  
    document.getElementById('container').appendChild(img); 
    // renderImage(); 
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

// renderImage = () => { 
//   document.getElementById('image').src = '/image'; 
// }

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

var fileInput = document.querySelector('input#fileInput');

sendData = () => { 
  var file = fileInput.files[0]; 
  var chunkSize = 64000; 
  var sliceFile = (offset) => { 
    var reader = new window.FileReader(); 
    reader.onload = (() => {
      return (e) => {
        dataChannel.send(e.target.result); 
        dataChannel.send('Welcome to data channel bitch.');
        if (file.size > offset + e.target.result.byteLength) {
          window.setTimeout(sliceFile, 0, offset + chunkSize); 
        }//end if
      }
    })(file); 
    var slice = file.slice(offset, offset + chunkSize); 
    reader.readAsArrayBuffer(slice);
  };
  sliceFile(0);  
}

sendPhoto = () => { 
  //Split data channel message in chunks of this byte length.
  var CHUNK_LEN = 64000; 
  console.log('width and height ', imgWidth, imgHeight);
  
  var photo = imgContext.getImageData(0, 0, imgWidth, imgHeight);
  len = img.data.byteLength; 
  n = len / CHUNK_LEN | 0; 

  console.log('Sending a total of ' + len + ' byte(s)');

  if (!dataChannel) {
    logError('Connection has not been initiated. ' +
      'Get two peers in the same room first');
    return;
  } else if (dataChannel.readyState === 'closed') {
    logError('Connection was lost. Peer closed the connection.');
    return;
  }//end if else

  dataChannel.send(len); 

  //Split the photo and send in chunks of about 64KB.
  for (var i = 0; i < n; i++) { 
    var start = i * CHUNK_LEN;
    end = (i+1) * CHUNK_LEN; 
    console.log(start + '-' + (end-1));
    dataChannel.send(img.data.subarray(start, end)); 
  }//end for

  //Send the remainer, if any.
  if (len % CHUNK_LEN) { 
    console.log('You just got data from data channel bitch!'); 
    console.log('last' + len % CHUNK_LEN + 'bytes(s)'); 
    dataChannel.send(img.data.subarray(n * CHUNK_LEN)); 
  } else { 
    console.log('No data for you!'); 
  }//end if else
}

function receieveDataChromeFactory() { 
  var buf, count; 
  return function onmessage(event) { 
    if (typeof event.data === 'string') { 
      buf = window.buf = new Uint8ClampedArray(parseInt(event.data));
      count = 0; 
      console.log('Expecting a total of ' + buf.byteLength + ' bytes'); 
      return; 
    }//end if

    var data = new Uint8ClampedArray(event.data);
    buf.set(data, count); 

    count += data.byteLength;
    console.log('count: ' + count); 

    if (count === buf.byteLength) {
      console.log('Done. Rendering photo.');
      renderPhoto(buf);  
    }//end if
  }
}

function renderPhoto(data) { 
  var canvas = document.createElement('canvas');
  canvas.width = imgWidth; 
  canvas.height = imgHeight; 
  canvas.classList.add('incomingPhoto');
  //trail is the element holding the incoming images
  trail.insertBefore(canvas, trail.firstChild); 

  var context = canvas.getContext('2d'); 
  var img = context.createImageData(imgWidth, imgHeight);
  img.data.set(data); 
  context.putImageData(img, 0, 0); 
}

logError = err => {
    console.log('Error:', err);
}
