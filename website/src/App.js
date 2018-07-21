import React, { Component } from 'react';
import './css/App.css';
import './css/bootstrap.css';
import './css/bootstrap.min.css';
import './css/bootstrap-social.css'; 
import Info from './Components/Info';
import NavBar from './Components/Navbar';
import Campaign from './Components/Campaign';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        <Campaign />
        <Info />
      </div>
    );
  }
}

export default App;