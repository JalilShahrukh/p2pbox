import React, { Component } from 'react'; 

class Info extends Component { 
  render() {
    return (
      <div className="container marketing">

      <hr className="featurette-divider"></hr>

        <div className="row featurette" id="Features">
          <div className="col-md-7">
            <h2 className="featurette-heading">Features.</h2> 
            {/* <span className="text-muted">It'll blow your mind.</span></h2> */}
            <p className="lead">Data Pair is a proof of concept that serves static assets over a peer to peer delivery network powered by WebRTC (images) and WebSockets (signaling). 
            <br/>
            <br/>
            WebRTC (Web Real-Time Communications) is a technology which enables Web applications and sites to capture and optionally stream audio and/or video media, as well as to exchange arbitrary data between browsers without requiring an intermediary.
            <br/>
            <br/>
            The set of standards that comprises WebRTC makes it possible to share data and perform teleconferencing peer-to-peer, without requiring that the user install plug-ins or any other third-party software. WebRTC consists of several interrelated APIs and protocols which work together to achieve this. </p>
          </div>
          <div className="col-md-5">
            <img className="featurette-image img-responsive center-block" data-src="holder.js/500x500/auto" alt="500x500" src="https://s3.amazonaws.com/boxchatprofiles/otherimages/Globe.gif" data-holder-rendered="true"></img>
          </div>
        </div>
  
        <hr className="featurette-divider"></hr>
  
        <div className="row featurette" id="Results">
          <div className="col-md-7 col-md-push-5">
            <h2 className="featurette-heading">Results.</h2> 
            <p className="lead">After simulating high traffic volumes from AWS S3 buckets and measuring overall request volume, concurrent load, and maximum requests per second vs. latency of Data Pair library results showed NAT traversal times decreased by more than 2% when Data Pair was implemented.</p>
          </div>
          <div className="col-md-5 col-md-pull-7">
            <img className="featurette-image img-responsive center-block" data-src="holder.js/500x500/auto" alt="500x500" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzUwMHg1MDAvYXV0bwpDcmVhdGVkIHdpdGggSG9sZGVyLmpzIDIuNi4wLgpMZWFybiBtb3JlIGF0IGh0dHA6Ly9ob2xkZXJqcy5jb20KKGMpIDIwMTItMjAxNSBJdmFuIE1hbG9waW5za3kgLSBodHRwOi8vaW1za3kuY28KLS0+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48IVtDREFUQVsjaG9sZGVyXzE2NDc1Yzk5YjQ3IHRleHQgeyBmaWxsOiNBQUFBQUE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LWZhbWlseTpBcmlhbCwgSGVsdmV0aWNhLCBPcGVuIFNhbnMsIHNhbnMtc2VyaWYsIG1vbm9zcGFjZTtmb250LXNpemU6MjVwdCB9IF1dPjwvc3R5bGU+PC9kZWZzPjxnIGlkPSJob2xkZXJfMTY0NzVjOTliNDciPjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRUVFRUVFIi8+PGc+PHRleHQgeD0iMTg1LjEyNSIgeT0iMjYxLjEiPjUwMHg1MDA8L3RleHQ+PC9nPjwvZz48L3N2Zz4=" data-holder-rendered="true"></img>
          </div>
        </div>
  
        <hr className="featurette-divider"></hr>
  
        <div className="row featurette" id="Contribute">
          <div className="col-md-7">
            <h2 className="featurette-heading">Help us improve. <span className="text-muted">Star, fork and pull.</span></h2>
            <p className="lead">WebRTC is a vibrant and dynamic ecosystem with a variety of open source projects and frameworks that can help you maximize efficiency in your products. Data Pair is one of the best out there and you can contribute to the source code yourself! Just star, fork and pull the repository. Reach out to us with feedback and any inquiries you may have.</p>
          </div>
          <div className="col-md-5">
            <img className="featurette-image img-responsive center-block" data-src="holder.js/500x500/auto" alt="500x500" src="https://s3.amazonaws.com/boxchatprofiles/otherimages/fork.gif" data-holder-rendered="true"></img>
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
            <img className="img-circle" src="https://s3.amazonaws.com/boxchatprofiles/profile/David.jpg" alt="David" width="140" height="140"></img>
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
          <p className="pull-right"><a href="#DataPair">Back to top</a></p>
          <p id="copyright">© 2018 Data Pair, Inc</p>
        </footer> 
      </div>
    ); 
  }
}

export default Info; 