import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import SideDrawer from './SideDrawer';
import Card from 'react-bootstrap/Card';
import { ChatState } from '../context/chatProvider';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';

function Friends() {
  const {
    selectedChat,
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  const [currentUser, setCurrentUser] = useState('');
  const [show, setShow] = useState(false);

  const fetchChats = async () => {
    if (!user) return;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get('http://localhost:5000/api/chat', config);
      setChats(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  }, [user]);

  return (
    <div style={{ marginTop: '1rem', padding: '20px', backgroundColor: '#9dc2ed' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
  <h1 style={{ margin: '0', color: '#333', marginRight: '250px' }}>Friends</h1>
  <FaSearch
    className="search-icon"
    size='3rem'
    color='black'
    style={{
      border: 'none',
      padding: '5px 10px',
      borderRadius: '5px',
      cursor: 'pointer',
    }}
    onClick={() => {
      setShow(true);
    }}
  />
</div>
      {chats.map((chat, index) => {
        const friend = chat.users.find((user) => user._id !== currentUser._id);
        if (!chat.latestMessage) {
          return null;
        }
        return (
          <Card
            key={index}
            className="chatListCard"
            style={{ marginTop: '15px', color: '#333',backgroundColor: selectedChat === chat ? '#c4e1fa' : 'white'   }}
            onClick={() => {
              setSelectedChat(chat);
            }}
          >
            <Card.Body>
              <Row>
                <Col style={{ margin: '0' }} xs={2}>
                  <Card.Img
                    src={friend.pic}
                    style={{
                      height: '50px',
                      width: '50px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                </Col>
                <Col>
                  <Card.Title style={{ fontWeight: 'bold', color: '#333' }}>{friend.name}</Card.Title>
                  <Card.Text style={{ color: '#777' }}>{chat.latestMessage.content}</Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
      })}
      <SideDrawer show={show} setShow={setShow} />
    </div>
  );
}

export default Friends;
