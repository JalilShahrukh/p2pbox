import React, { Component } from 'react'; 

class Campaign extends Component { 
  render() {
    return ( 
    <div className="Campaign">
      <img id="logo" src="https://s3.amazonaws.com/boxchatprofiles/otherimages/DataPair.png"></img>
      <a id="View" href="https://github.com/DataPair/DataPair" class="btn btn-outline btn-lg" onclick="_gaq.push(['_trackEvent', 'exit', 'header', 'GitHub']);"><span class="fa fa-github"></span> View on GitHub</a>
    </div>
    ); 
  }
}

export default Campaign;  