
import React, { useState, useEffect } from 'react';
import { messageAPI } from '../services/api';
import Card from '../components/common/Card';

import { SendIcon, MessageSquareIcon } from '../components/icons';
import './MessagingPage.css';

const MessagingPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const { data } = await messageAPI.getConversations();
      setConversations(data.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const { data } = await messageAPI.getMessages(userId);
      setMessages(data.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await messageAPI.send({
        receiver: selectedConversation._id,
        message: newMessage
      });
      setNewMessage('');
      fetchMessages(selectedConversation._id);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div className="messaging-page">
      <div className="container">
        <h1>Messages</h1>

        <div className="messaging-container">
          <Card className="conversations-panel" padding={false}>
            <div className="conversations-header">
              <h3>Conversations</h3>
            </div>
            <div className="conversations-list">
              {conversations.length === 0 ? (
                <div className="no-conversations">
                  <MessageSquareIcon />
                  <p>No conversations yet</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv._id}
                    className={`conversation-item ${selectedConversation?._id === conv._id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedConversation(conv);
                      fetchMessages(conv._id);
                    }}
                  >
                    <div className="conversation-avatar">
                      {conv.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="conversation-info">
                      <h4>{conv.name}</h4>
                      <p>Click to view messages</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="messages-panel" padding={false}>
            {selectedConversation ? (
              <>
                <div className="messages-header">
                  <h3>{selectedConversation.name}</h3>
                </div>
                <div className="messages-list">
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`message ${msg.sender === selectedConversation._id ? 'received' : 'sent'}`}
                    >
                      <p>{msg.message}</p>
                      <span className="message-time">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
                <form className="message-input" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button type="submit" variant="primary">
                    <SendIcon />
                  </Button>
                </form>
              </>
            ) : (
              <div className="no-conversation-selected">
                <MessageSquareIcon />
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;

