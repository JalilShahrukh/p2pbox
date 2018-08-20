import React, { Component } from 'react';

class NavBar extends Component { 
  render() { 
    return ( 
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid container topnav">
          <div className="nav navbar-nav navbar-left">
            <img className="navbar-brand" id="DataLogo" src="https://s3.amazonaws.com/boxchatprofiles/otherimages/DataPair.png"></img>
          </div>
          
          <div className="nav navbar-nav navbar-right navbar-collapse collapse">
            <a className="navbar-brand" href="#Features">Features</a>
            <a className="navbar-brand" href="#Results">Results</a>
            <a className="navbar-brand" href="#Started">Get Started</a>
            <a className="navbar-brand" href="#Team">Team</a>
            <div className="btn">
              <a className="github-button" href="https://github.com/DataPair/DataPair" data-show-count="true" aria-label="Follow Data Pair on GitHub">Star</a>
            </div>
          </div> 
        </div>  
      </nav>
    );
  }
}

export default NavBar;