import React, { Component } from 'react'; 

class Info extends Component { 
  render() {
    return (
      <div className="container marketing">

      <hr id="Features" className="featurette-divider"></hr>

        <div className="row featurette">
          <div className="col-md-7">
            <h2 className="featurette-heading">Overview.</h2> 
            {/* <span className="text-muted">It'll blow your mind.</span></h2> */}
            <p className="lead">Data Pair is a proof of concept that serves static assets over a peer to peer CDN powered by WebRTC and WebSockets. 
            <br/>
            <br/>
            Data Pair uses WebSockets to coordinate the signaling process between potential peers in real-time, and WebRTC to send static assets directly between peers.
      
            Once a client has finished downloading, they become a part of the CDN, available to send data to new clients. As server traffic increases, the CDN's capacity increases as well.</p>
          </div>
          <div className="col-md-5">
            <img id="WebRTClogo" className="featurette-image img-responsive center-block" data-src="holder.js/500x500/auto" alt="500x500" src="https://s3.amazonaws.com/boxchatprofiles/otherimages/WebRTC.jpg" data-holder-rendered="true"></img>
          </div>
        </div>
  
        <hr id="Started" className="featurette-divider"></hr>
  
        <div className="row featurette">
          <div className="col-md-7">
            <h2 className="featurette-heading">Getting started. </h2>
            <p className="lead">Data Pair is easy to implement: a node module for your server file, an UNPKG script for the client side, and custom tags for images that you'd like distributed through the network.</p>
            <p className="lead">Once you've done this, Data Pair takes care of the rest: maintaining the network of available peers that can send assets and choosing one to pair with an incoming client, using WebSockets to automate WebRTC signaling between peers, and handling transmission of images through RTCDataChannel.</p>
            <div id="started">
              <img src="https://s3.amazonaws.com/boxchatprofiles/otherimages/Getting+started.png"></img>
            </div>
          </div>
          <div className="col-md-5">
            <a href="https://github.com/DataPair/DataPair"><img id="blueGithub" className="featurette-image img-responsive center-block" data-src="holder.js/500x500/auto" alt="500x500" src="https://s3.amazonaws.com/boxchatprofiles/otherimages/github.png" data-holder-rendered="true"></img></a>
          </div>
        </div>
  
        <hr className="featurette-divider"></hr>
        
        <div className="row" id="Team">
          <div className="col-sm-3">
            <img className="img-circle" src="https://s3.amazonaws.com/boxchatprofiles/profile/Ben.jpg" alt="Ben" width="140" height="140"></img>
            <h3>Ben Hawley</h3>
            <a class="btn btn-social-icon btn-github" href="https://github.com/BenjaminHawley"><span class="fa fa-github"></span></a>
            <span></span>
            <a class="btn btn-social-icon btn-linkedin" href="https://www.linkedin.com/in/benchawley/"><span class="fa fa-linkedin"></span></a>
          </div>
          <div className="col-sm-3">
            <img className="img-circle" src="https://s3.amazonaws.com/boxchatprofiles/profile/DavidD.jpg" alt="David" width="140" height="140"></img>
            <h3>Dave DeStefano</h3>
            <a class="btn btn-social-icon btn-github" href="https://github.com/david-dest01"><span class="fa fa-github"></span></a>
            <span></span>
            <a class="btn btn-social-icon btn-linkedin" href="https://www.linkedin.com/in/d-destefano/"><span class="fa fa-linkedin"></span></a>
          </div>
        
          <div className="col-sm-3">
            <img className="img-circle" src="https://s3.amazonaws.com/boxchatprofiles/profile/Shahrukh.jpg" alt="Shahrukh" width="140" height="140"></img>
            <h3>Shahrukh Jalil</h3>
            <a class="btn btn-social-icon btn-github" href="https://github.com/jalilshahrukh"><span class="fa fa-github"></span></a>
            <span></span>
            <a class="btn btn-social-icon btn-linkedin" href="https://www.linkedin.com/in/jalilshahrukh/"><span class="fa fa-linkedin"></span></a>
          </div>
          <div className="col-sm-3">
            <img className="img-circle" src="https://s3.amazonaws.com/boxchatprofiles/profile/Mahfuz.jpg" alt="Mahfuz" width="140" height="140"></img>
            <h3>Mahfuz Kabir</h3>
            <a class="btn btn-social-icon btn-github" href="https://github.com/mahfuzk"><span class="fa fa-github"></span></a>
            <span></span>
            <a class="btn btn-social-icon btn-linkedin" href="https://www.linkedin.com/in/mahfuzkabir/"><span class="fa fa-linkedin"></span></a>
          </div>
        </div>
  
        <hr className="featurette-divider"></hr>
        <footer>
          <div id="footerimg">
            <img id="dataLogoFooter" src="https://s3.amazonaws.com/boxchatprofiles/otherimages/DataPair.png"></img>
          </div>
          <p id="copyright">© Copyright 2018 <a href="https://github.com/DataPair/DataPair"><strong>Data Pair</strong></a>. Distributed under the <a href="https://github.com/DataPair/DataPair/blob/master/license.md"><strong>MIT License</strong></a>.</p>
        </footer> 
      </div>
    ); 
  }
}
export default Info; 