import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

class NavBar extends Component { 
  render() { 
    return ( 
      <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">PeerBox</a>
        </div> 
      </nav>
    );
  }
}

export default NavBar;