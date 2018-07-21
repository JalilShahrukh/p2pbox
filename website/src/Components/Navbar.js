import React, { Component } from 'react';

class NavBar extends Component { 
  render() { 
    return ( 
      <nav className="navbar navbar-inverse navbar-static-top">
        <div className="container-fluid container topnav">
          <div className="nav navbar-nav navbar-left">
            <a className="navbar-brand" id="DataPair">Data Pair</a>
            <img className="navbar-brand" id="DataLogo" src="https://s3.amazonaws.com/boxchatprofiles/otherimages/Logo.png"></img>
          </div>
          
          <div className="nav navbar-nav navbar-right navbar-collapse collapse">
            <a className="navbar-brand" href="#Features">Features</a>
            <a className="navbar-brand" href="#Results">Results</a>
            <a className="navbar-brand" href="#Contribute">Contribute</a>
            <a className="navbar-brand" href="#Team">Team</a>
            <div className="btn">
              <a className="github-button" href="https://github.com/DataPair" data-show-count="true" aria-label="Follow Data Pair on GitHub">Star</a>
            </div>
          </div> 
        </div>  
      </nav>
    );
  }
}

export default NavBar;