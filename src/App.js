import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase'
import RoomList from './components/RoomList'
import MessageList from './components/MessageList'
import User from './components/User'

var config = {
  apiKey: "AIzaSyBAaW9_hM4BHhPehRY3olFsxZi14eR5YAI",
  authDomain: "my-firebase-react-chatapp.firebaseapp.com",
  databaseURL: "https://my-firebase-react-chatapp.firebaseio.com",
  projectId: "my-firebase-react-chatapp",
  storageBucket: "my-firebase-react-chatapp.appspot.com",
  messagingSenderId: "914805713857"
};

firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRoom: '',
      user: ''
    };

    this.setActiveRoom = this.setActiveRoom.bind(this);
    this.setUser = this.setUser.bind(this);
  }

  setActiveRoom(room) {
    this.setState({ activeRoom: room });
  }

  setUser(user) {
    this.setState({ user: user });
  }

  render() {
    return (
      <div className="container bg-secondary">
          <header className="row bg-warning">
            <div className="col-4">
              <h2>Bloc React Chat App</h2>
            </div>
            <div className="col-8">
              <nav className="navbar">
              <a className="nav-link" href="#">Rooms</a>
              <a className="nav-link" href="#">About</a>
              <a className="nav-link" href="#">Contact</a>
                <ul className="nav">
                  <li className="nav-item">
                    <User firebase={firebase} currentUser={this.state.user} setUser={this.setUser} />
                  </li>
                </ul>
              </nav>
            </div>
          </header>
        <div>
          <h1>Welcome to the Chat!</h1>
          <h2>{this.state.activeRoom.name || "Select Chat Room"}</h2>
          <RoomList firebase={firebase} setActiveRoom={this.setActiveRoom} />
          { this.state.activeRoom ?
            (<MessageList firebase={firebase} setActiveRoom={this.state.activeRoom.key}  currentUser={this.state.user ? this.state.user.displayName : 'Guest'} />) : (null)
          }
        </div>
      </div>
    );
  }
}

export default App;
