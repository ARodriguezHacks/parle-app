import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase/app';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import User from './components/User';
import { Container, Row, Col, Nav, Navbar, Button } from 'react-bootstrap';

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
      activeRoomName: '',
      user: '',
      editingRoom: false,
      roomChange: '',
    };

    this.setActiveRoom = this.setActiveRoom.bind(this);
    this.setUser = this.setUser.bind(this);
    this.roomsRef = firebase.database().ref('rooms');
    this.messagesRef = firebase.database().ref('messages');
  }

  setActiveRoom(room) {
    this.setState({
       activeRoom: room,
       activeRoomName: room.name, 
      });
  }

  setUser(user) {
    this.setState({ user: user });
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  /* Set the width of the side navigation to 0 */
  closeNav(e) {
    e.preventDefault();
    document.getElementById("mySidenav").style.width = "0";
  }

  editingRoom(e) {
    e.preventDefault();
    this.setState({
      editingRoom: true,
      roomChange: this.state.activeRoomName
    });
  }

  handleRoomChange(e) {
    this.setState({
      roomChange: e.target.value
    });
  }

  updateRoom(e) {
    e.preventDefault();
    this.roomsRef.child(this.state.activeRoom.key).update({name: this.state.roomChange});

    this.setState({
      editingRoom: false,
      activeRoomName: this.state.roomChange,
      roomChange: ''
    });
  }

  cancelSave(e) {
    e.preventDefault();
    this.setState({
      editingRoom: false,
      roomChange: ''
    });
  }

  deleteRoom(e) {
    e.preventDefault();
    var roomToDelete = this.roomsRef.child(this.state.activeRoom.key);
    var roomToDeleteName = this.state.activeRoom.name;

    var output = [];

    this.messagesRef.on('value', (snapshot) => {
      snapshot.forEach( (childSnapshot) => {
        var mysnap = childSnapshot.val();
        mysnap.key = childSnapshot.key;
        output.push(mysnap);
      });
    });

    output.filter( childitem => {
      if (childitem.roomId === roomToDelete) {
        var removeMessage = this.messagesRef.child(childitem.key);
        removeMessage.remove();
      }
      return null;
    });

    roomToDelete.remove(function(error) {
      alert(error ? "failed" : roomToDeleteName + " successfully deleted!");
    });

    this.setState({
      activeRoom: '',
      activeRoomName: ''
    });    
  }

  render() {
    return (
      <div>
        <Navbar className="d-flex justify-content-between">
          <Navbar.Brand>Parle!</Navbar.Brand>
          <Nav>
            <li>
              <User firebase={firebase} currentUser={this.state.user} setUser={this.setUser} />
            </li>
          </Nav>
        </Navbar>
        <Container className="bg-secondary">

          <div className="mobile">
            {this.state.activeRoom ?
              (<div>
                <h3>Current room: {this.state.activeRoomName}</h3>
                <button onClick={this.openNav} className="btn btn-info mobile">{`< Change Room`}</button>
                <div>
                  <Button variant="success" onClick={ (e) => this.editingRoom(e)}>Edit</Button>
                  <Button variant="danger" onClick={ (e) => this.deleteRoom(e)}>Delete</Button>
                </div>
              </div>) : 
              (<div>
                <h2>Select Room to get started!</h2>
                <button onClick={this.openNav} className="btn btn-info mobile">{`< Select Room`}</button>
              </div>)
            }

            { this.state.editingRoom ?
              (<form onSubmit={ (e) => this.updateRoom(e) }>
                <input type="text" id="editingRoom" value={this.state.roomChange} onChange={ (e) => this.handleRoomChange(e) } />
                <button type="submit">Save</button>
                <button type="submit" onClick={(e) => this.cancelSave(e)}>Cancel</button>
              </form>) : null
            }            
            { this.state.activeRoom ?
                (<MessageList firebase={firebase} setActiveRoom={this.state.activeRoom.key}  currentUser={this.state.user ? this.state.user.displayName : 'Guest'} />) : (null)
            }
            
            <div id="mySidenav" className="sidenav text-center">
              <button className="closebtn" onClick={this.closeNav}>&times;</button>
                <RoomList firebase={firebase} activeRoom={this.state.activeRoom} activeRoomName={this.state.activeRoomName} setActiveRoom={this.setActiveRoom} currentUser={this.state.user} />
            </div>
          </div>

          <div className="non-mobile">
            <Row>
              <Col>
              { this.state.activeRoom ?
              (<div>
                <h3>Current room: {this.state.activeRoomName}</h3>
                <div>
                  <Button variant="success" className="mb-1" onClick={ (e) => this.editingRoom(e)}>Edit</Button>
                  <Button variant="danger"className="mb-1" onClick={ (e) => this.deleteRoom(e)}>Delete</Button>
                </div>
               </div>) : (<h3>Click on a room to get started!</h3>)
              }
              { this.state.editingRoom ?
                (<form onSubmit={ (e) => this.updateRoom(e) }>
                  <input type="text" id="editingRoom" value={this.state.roomChange} onChange={ (e) => this.handleRoomChange(e) } />
                  <button type="submit">Save</button>
                  <button type="submit" onClick={(e) => this.cancelSave(e)}>Cancel</button>
                </form>) : null}
                <RoomList firebase={firebase} activeRoom={this.state.activeRoom} activeRoomName={this.state.activeRoomName} setActiveRoom={this.setActiveRoom} currentUser={this.state.user} />
              </Col>
              <Col>
                { this.state.activeRoom ?
                    (<MessageList firebase={firebase} setActiveRoom={this.state.activeRoom.key}  currentUser={this.state.user ? this.state.user.displayName : 'Guest'} />) : (null)
                }
              </Col>
            </Row>
            </div>
        </Container>
      </div>
    );
  }
}

export default App;
