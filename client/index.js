/****************************************************************************
* GLOBAL VARIABLES
****************************************************************************/

var config = null; //Initial config, changed to persons. 

var localConnection; 
var remoteConnection; 
var sendChannel; 
var ReceiveChannel;

var receiveBuffer = [];  
var receivedSize = 0; 

var initiator = false; //Changed to true when first person enters room.
var bitrateDiv = document.querySelector('div#bitrate'); //Used to display stats of file transfer. 
var fileInput = document.querySelector('input#fileInput'); //Takes in any file.
var downloadAnchor = document.querySelector('a#download'); //Lets you download file. 
var sendProgress = document.querySelector('progress#sendProgress'); //Progress on file sent. 
var receiveProgress = document.querySelector('progress#receiveProgress'); //Progress on file Received. Same as send.
var statusMessage = document.querySelector('span#status'); //Used to display status of file. 
var bytesPrev = 0;//Used to calculate bitrate. 
var timeStampStart; //Start of timestamp. 
var timestampPrev = 0;//Used to check time stamp. 
var bitrateMax = 0; //Used to update max bitrate. 
var statsInterval = null;//Use for Receive data channel function.
var appendTo = document.querySelector('div#received'); //Div to append recieved object to.
var getButton = document.querySelector('button#get'); //Button for getting video. 
var video = document.querySelector('div#videoPlayer'); //Div to append video to. 

/****************************************************************************
* Handle get request for video. 
****************************************************************************/

// getButton.addEventListener('click', () => { 
//   fetch('/video')
// 	.then((response) => {
// 		return response.json();
// 	}).then((myJson) => {
// 		console.log(myJson);
// 	}); 
// }); 

/****************************************************************************
* FileInput
****************************************************************************/

handleInputFile = () => { 
  var file = fileInput.files[0]; //If the user selects just one file, it is then only necessary to consider the first file of the list.
  if (!file) console.log('Files must be selected.')
  else createPeerConnection(); 
}

fileInput.addEventListener('change', handleInputFile, false); //Invoke callback on change of input file.

/****************************************************************************
* Signaling server
****************************************************************************/

const socket = io.connect('http://localhost:3000');

// socket.on('message', (input) => {
//   signalingMessageCallback(input);
// }); 

socket.on('created', () => {
  initiator = true;
  console.log('You are the initiator.'); 
}); 

socket.on('joined', () => {
  //createPeerConnection();
  console.log('You just joined the room.');
});

// socket.on('ready', () => {
//   console.log('Establishing connection with new peer.'); 
//   //createPeerConnection();
// });

/****************************************************************************
* WebRTC peer connection and data channel
****************************************************************************/

//Sends a message to the signaling server. 
function sendMessage(message) {
  console.log('Client sending message: ', message);
  socket.emit('message', message);
}

createPeerConnection = () => {
  localConnection = new RTCPeerConnection(config); //Initialize new connection for local. 
  console.log('Created local peer connection object.'); 
  
  sendChannel = localConnection.createDataChannel('sendDataChannel'); //Create send data channel for local connection.
  console.log('Created send data channel.'); 

  sendChannel.onopen = onSendChannelStateChange; //Change state when channel is opened. 
  sendChannel.onclose = onSendChannelStateChange; //Change state when channel is close;

  localConnection.onicecandidate = (e) => { //Add an icecandidate to localConnection. 
    onIceCandidate(localConnection, e); 
  }; 

  localConnection.createOffer().then( //Create an offer for the local connection. 
    gotDescription1, 
    onSessionDescriptionError
  );  

  remoteConnection = new RTCPeerConnection(config); //Initialize new connection for remote. 
  remoteConnection.onicecandidate = (e) => { //Add an icecandidate to remoteConnection. 
    onIceCandidate(remoteConnection, e);   
  }

  /*The RTCPeerConnection.ondatachannel property is an EventHandler which specifies a 
  function which is called when the datachannel event occurs on an RTCPeerConnection.*/
  remoteConnection.ondatachannel = receiveChannelCallback; 

  //The disabled property sets or returns whether a file upload button should be disabled, or not.
  //fileInput.disabled = true; 
}

//Session decription error. 
onSessionDescriptionError = (error) => { 
  console.log('Failed to create session description: ' + error.toString()); 	
}

//Check if the connection is local or remote. 
localOrRemote = (pc) => { 
  return (pc === localConnection) ? remoteConnection : localConnection; 
}

//Get name of connection wether local or remote. 
nameOfConnection = (pc) => { 
  return (pc === localConnection) ? 'localConnection' : 'remoteConnection'; 
}

//Adds ice candidate to corresponding peer connection, local or remote. 
onIceCandidate = (pc, event) => { 
  localOrRemote(pc).addIceCandidate(event.candidate)
   .then(() => { 
     onAddIceCandidateSuccess(pc);  
   }).catch((err) => { 
     onAddIceCandidateError(pc); 
   }); 
  console.log(nameOfConnection(pc) + 'ICE candidate: \n' + (event.candidate ? event.candidate : '(null)')); 
}

//Success callback for ice candidate. 
onAddIceCandidateSuccess = () => { 
  console.log('AddIceCandidate success.'); 
}

//Failure callback for ice candidate. 
onAddIceCandidateError = (error) => { 
  console.log('Failed to add Ice Candidate: ' + error.toString()); 
}

//Set localConnection's local description, remoteConnections's local description, createAnswer from remoteConnection.
gotDescription1 = (desc) => { 
	localConnection.setLocalDescription(desc); 
	console.log('Offer from localConnection \n' + desc.sdp);
	remoteConnection.setRemoteDescription(desc); 
	remoteConnection.createAnswer()
	.then( 
		gotDescription2, 
		onSessionDescriptionError
	);
}

//Set remoteConnection's local description and localConnection's remote description. 
gotDescription2 = (desc) => { 
	remoteConnection.setLocalDescription(desc); 
	console.log('Answer from remoteConnection \n ' + desc.sdp); 
	localConnection.setRemoteDescription(desc); 
}

onLocalDescription = desc => {
  pc.setLocalDescription(desc, () => {
    console.log('Sending local description:', pc.localDescription);
    sendMessage(pc.localDescription)
  }, logError);
}

function sendData() { 
  var file = fileInput.files[0]; //If the user selects just one file, it is then only necessary to consider the first file of the list. 
	
  //Handle 0 size files.
  statusMessage.textContent = ''; //Display element in html. 
  downloadAnchor.textContent = ''; //Display element in html. 
  if (file.size === 0) { 
    bitrateDiv.innerHTML = ''; //Display element in html.
    statusMessage.textContent = 'File is empty, please select a non-empty file'; 
    //closeDataChannels(); //Called in source code no sure in applicable for us. 
    return; 
  }//end if

  sendProgress.max = file.size; //Attribute in HTML. 
  receiveProgress.max = file.size; //Attribute in HTML. 
  var chunkSize = 64000; //You can send up to 64kb chunks between same browsers, 16kb between different browsers. Firefox doesn't require chunking?
  var sliceFile = function(offset) { 
    var reader = new window.FileReader(); //Object lets web applications asynchronously read the contents of files (or raw data buffers) stored on the user's computer. 
    reader.onload = (function() { //Property contains an event handler executed when the load event is fired.
      return function(e) { 
        sendChannel.send(e.target.result); //What comes back from file reader should be sent through dataChannel.
        if (file.size > offset + e.target.result.byteLength) { //Offset is an integer called on sliceFile. 
          window.setTimeout(sliceFile, 0, offset+chunkSize); //Calls sliceFile callback. 
        }//end if 
        sendProgress.value = offset + e.target.result.byteLength; //Attribute in HTML
      }//End function.
    })(file); 
    var slice = file.slice(offset, offset + chunkSize); //Create another slice to be sent. 
    reader.readAsArrayBuffer(slice); //Read another slice. 
  }; 
  sliceFile(0); 
}

//If the send channel is opened send data. 
onSendChannelStateChange = () => { 
	var readyState = sendChannel.readyState; //ready state is an object on datachannel. 
	console.log('Send channel state is: ' + readyState); 
	if (readyState === 'open') sendData(); 
}

//Once the state changes for received in data channel call displaystats at three different points? 
onReceiveChannelStateChange = () => { 
	var readyState = receiveChannel.readyState; //ready state is an object on Receivechannel. 
	if (readyState === 'open') { 
		timeStampStart = (new Date().getTime()); //Set start timestamp to current time. 
		timestampPrev = timeStampStart; //Set prev to start. 
    statsInterval = window.setInterval(displayStats, 500); 
    window.setTimeout(displayStats, 100); 
    window.setTimeout(displayStats, 300); 
	}//end if	
}

//Handles calls for receive channel. 
receiveChannelCallback = (event) => {
	console.log('Receive channel callback.'); 
	receiveChannel = event.channel; //Channel is a property on the event object. 
	receiveChannel.binaryType = 'arraybuffer'; //The property binaryType on the RTCDataChannel interface is a DOMString which specifies the type of JavaScript object which should be used to represent binary data received on the RTCDataChannel.
	receiveChannel.onmessage = onReceiveMessageCallback; //The RTCDataChannel.onmessage property stores an EventHandler which specifies a function to be called when the message event is fired on the channel.
	receiveChannel.onopen = onReceiveChannelStateChange; //Change the state when opened.  
	receiveChannel.onclose = onReceiveChannelStateChange; //Change the state when closed. 

	receivedSize = 0; //Reset received size to 0; 
	bitrateMax = 0; //Reset bitrate to 0; 

	//downloadAnchor is the HTML/CSS object which stores information about what's being downloaded. 
	downloadAnchor.textContent = ''; 
	downloadAnchor.removeAttribute('download'); 
	if (downloadAnchor.href) { 
		URL.revokeObjectURL(downloadAnchor.href); 
		downloadAnchor.removeAttribute('href'); 
	}
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