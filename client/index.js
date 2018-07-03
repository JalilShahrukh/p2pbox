let initiator = false;
let config = null;
let imageArray = Object.values(document.getElementsByTagName('img'));

let pc;
let dataChannel;

const socket = io.connect('http://localhost:3000');

socket.on('message', (input) => {
    signalingMessageCallback(input);
})

socket.on('created', () => {
    initiator = true;
    getImagesFromServer();
})

socket.on('joined', () => {
    createPeerConnection();
})

socket.on('ready', () => {
    createPeerConnection();
})

////////////////////////////////////////////////////// Photo functions //////////////////////////////////////////////////////

/// For base initiator
function getImagesFromServer() {
    imageArray.forEach(image => {
        image.id === 'image1' ? image.setAttribute('src', 'https://source.unsplash.com/pHANr-CpbYM/800x600') :
        image.setAttribute('src', 'https://source.unsplash.com/3Z70SDuYs5g/800x600');
    })
}

function sendAllPhotos() {
    imageArray.forEach(image => {
        console.log('Sending', image.id);
        sendPhoto(image);
    })
}

function sendPhoto(image) {
    const data = getImageData(image);
    // console.log('Image data is:', data);
    const CHUNK_LEN = 64000;
    const totalChunks = data.length / CHUNK_LEN;
    // console.log('This many chunks to send:', totalChunks);

    let start;
    let end;
    for (let i = 0; i < totalChunks; i++) {
        // console.log('Sending chunk', i);
        start = i * CHUNK_LEN;
        end = (i + 1) * CHUNK_LEN;
        dataChannel.send(data.slice(start, end));
    }
    dataChannel.send('finished');
    // console.log('Finished sending that photo');
}

function getImageData(image) {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    context.canvas.width = image.width;
    context.canvas.height = image.height;
    context.drawImage(image, 0, 0, image.width, image.height);
    return canvas.toDataURL('image/jpeg')
}

function receiveData() {
    let imageData = '';
    let counter = 0;
    let dataString;
    return function onMessage(data) {
        dataString = data.data.toString();
        // console.log('Running onMessage, dataString is:', dataString);
        if (dataString.slice(0, 8) !== 'finished') {
            // console.log('Adding this datastring in');
            imageData += dataString;
        } else {
            // console.log('Finished, calling setImage');
            setImage(imageData, counter);
            counter++;
            imageData = '';
        }
    }
}

function setImage(imageData, counter) {
    // console.log('In setImage');
    imageArray[counter].src = imageData;
}

////////////////////////////////////////////////////// Signaling functions //////////////////////////////////////////////////////

function createPeerConnection() {
    // console.log('Creating peer connection!');
    pc = new RTCPeerConnection(config);
    pc.onicecandidate = (event) => {
        if (event.candidate) {
            // console.log('onicecandidate event is:', event.candidate);
            sendMessage({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            })
        }
        // else console.log('Out of candidates');
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

function signalingMessageCallback(message) {
    if (message.type === 'candidate') {
        // console.log('Received icecandidate:', message.candidate);
        pc.addIceCandidate(new RTCIceCandidate({candidate: message.candidate}));
    }
    else if (message.type === 'answer') {
        // console.log('Received answer:', message);
        pc.setRemoteDescription(new RTCSessionDescription(message), () => {}, logError);
    }
    else if (message.type === 'offer') {
        // console.log('Received offer:', message);
        pc.setRemoteDescription(new RTCSessionDescription(message), () => {}, logError)
        pc.createAnswer(onLocalDescription, logError);
    }
}

function onDataChannelCreated(channel) {
    channel.onopen = () => {
        // console.log('Channel opened');
        if (initiator) {
            sendAllPhotos();           
        } 
    }

    channel.onclose = () => {
        // console.log('Channel closed');
    }

    channel.onmessage = receiveData();
}

function onLocalDescription(desc) {
    pc.setLocalDescription(desc, () => {
        // console.log('Sending local description:', pc.localDescription);
        sendMessage(pc.localDescription)
    }, logError);
}

////////////////////////////////////////////////////// Messaging functions //////////////////////////////////////////////////////

function sendMessage(message) {
    socket.emit('message', message);
}

function logError(err) {
    console.log('Error:', err);
}

//On receive message callback. 
onReceiveMessageCallback = (event) => { 
	receiveBuffer.push(event.data); //Push event data to the buffer. 
	receivedSize += event.data.byteLength; //Keep track of the bytes sent. 

	receiveProgress.value = receivedSize; //HTML attribute is updated with size that's sent. 

	//Signaling protocol is told about the expected file size (and name, hash, etc). 
	var file = fileInput.files[0]; //Already mentioned but if the user selects just one file, it is then only necessary to consider the first file of the list.
	if (receivedSize === file.size) { //File has finished transferring. 
		var received = new window.Blob(receiveBuffer); //A Blob object represents a file-like object of immutable, raw data. Blobs represent data that isn't necessarily in a JavaScript-native format. 
		receiveBuffer = []; //Empty bufffer. 

		//Blob URI/URL was created by JavaScript, refers to data that your browser currently has in memory (only in current page). 
		/*A blob: URL does not refer to data that exists on the server, it refers to data that your browser currently has in memory, for the current page. 
		It will not be available on other pages, it will not be available in other browsers, and it will not be available from other computers.
		It is possible convert a blob: URL into a data: URL, at least in Chrome. You can use an AJAX request to "fetch" the data from the blob: 
		URL (even though it's really just pulling it out of your browser's memory, not making an HTTP request).*/
		downloadAnchor.href = URL.createObjectURL(received); //Set link to received file.
		downloadAnchor.download = file.name; 
		downloadAnchor.textContent = 'Click to download \'' + file.name + '\' (' + file.size + 'bytes)'; 
		downloadAnchor.style.display = 'block';  

		//Calculate bitrate to be displayed. 
		var bitrate = Math.round(receivedSize * 8 /((new Date()).getTime() - timeStampStart));
		bitrateDiv.innerHTML = '<strong>Average Bitrate:</strong> ' + bitrate + ' kbits/sec (max: ' + bitrateMax + ' kbits/sec)'; 

		if (statsInterval) { 
			window.clearInterval(statsInterval); //Method clears a timer. 
			statsInterval = null; 
		}//end if

		closeDataChannels(); 
	}
}

displayStats = () => { 
  var display = function(bitrate) { 
    bitrateDiv.innerHTML = '<strong>Current Bitrate: </string> ' + bitrate + ' kbits/sec'; //Display bitrate. Attribute in HTML.
  } 

  if (remoteConnection && remoteConnection.iceConnectionState === 'connected') { 
    if (adapter.browserDetails.browser === 'chrome') { 
      /*method getStats() asynchronously requests an RTCStatsReport object which provides 
      statistics about incoming traffic on the owning RTCPeerConnection, returning a 
      Promise whose fulfillment handler will be called once the results are available.*/
      remoteConnection.getStats().then(function(stats) { 
        //Search for active candiate pair. 
        let activeCandidatePair; 
        stats.forEach(function(report) { 
          if (report.type === 'transport') { 
            activeCandidatePair = stats.get(report.selectedCandidatePairId); 
          }//end if
        }); 
        if (activeCandidatePair) { 
          if (timestampPrev === activeCandidatePair) return; //If timestamPrev matches return out. ?

          //Calculate current bitrate. 
          var bytesNow = activeCandidatePair.bytesReceived; //Property on stats object. 
          var bitrate = Math.round((bytesNow - bytesPrev)*8/(activeCandidatePair.timestamp - timestampPrev)); //https://blog.frame.io/2017/03/06/calculate-video-bitrates/
          display(bitrate); //Function used to display.
          timestampPrev = activeCandidatePair.timestamp; //Reset previous timestamp.  
          bytesPrev = bytesNow; //Reset previous bytes. 
          if (bitrate > bitrateMax) bitrateMax = bitrate; //Change bitrateMax; 
        }//end if
      });
    }//end chrome browser if
  }//end connection if 
}

closeDataChannels = () => { 
	console.log('Closing data channels.'); 
	sendChannel.close(); 
	console.log('Closed data channel with label: ' + sendChannel.label); 
	if (ReceiveChannel) { 
		ReceiveChannel.close();
		console.log('Closed data channel with label: ' + ReceiveChannel.label); 
	}//end if 
	localConnection.close(); 
	remoteConnection.close(); 
	localConnection = null; 
	remoteConnection = null; 
	console.log('Closed peer connection.'); 
	
	//Reset fileInput to enter new file. 
	fileInput.disabled = false; 
}