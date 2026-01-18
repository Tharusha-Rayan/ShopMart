
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { messageAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import { SendIcon, MailIcon, UserIcon, PackageIcon } from '../components/icons';
import './MessagesPage.css';

const MessagesPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data } = await messageAPI.getConversations();
      setConversations(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch conversations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const { data } = await messageAPI.getMessages(conversationId);
      setMessages(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch messages');
      console.error(error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data } = await messageAPI.send({
        conversationId: selectedConversation._id,
        content: newMessage
      });
      
      setMessages([...messages, data.data]);
      setNewMessage('');
      toast.success('Message sent');
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    }
  };

  const startConversation = async (sellerId, productId) => {
    try {
      const { data } = await messageAPI.createConversation({
        seller: sellerId,
        product: productId
      });
      setSelectedConversation(data.data);
      fetchConversations();
    } catch (error) {
      toast.error('Failed to start conversation');
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div className="messages-page">
      <div className="container">
        <h1>Messages</h1>

        <div className="messages-container">
          {/* Conversations List */}
          <div className="conversations-list">
            <Card>
              <h3><MailIcon /> Conversations</h3>
              {conversations.length > 0 ? (
                <div className="conversation-items">
                  {conversations.map(conv => (
                    <div
                      key={conv._id}
                      className={`conversation-item ${selectedConversation?._id === conv._id ? 'active' : ''}`}
                      onClick={() => setSelectedConversation(conv)}
                    >
                      <div className="conversation-avatar">
                        <UserIcon />
                      </div>
                      <div className="conversation-info">
                        <div className="conversation-header">
                          <h4>{conv.otherUser?.name}</h4>
                          <span className="conversation-time">
                            {new Date(conv.lastMessage?.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="conversation-preview">
                          {conv.product?.name && <><PackageIcon /> {conv.product.name}</>}
                        </p>
                        <p className="conversation-last-message">
                          {conv.lastMessage?.content?.substring(0, 50)}...
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="unread-badge">{conv.unreadCount}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No conversations yet</p>
                </div>
              )}
            </Card>
          </div>

          {/* Messages Area */}
          <div className="messages-area">
            {selectedConversation ? (
              <Card className="messages-card">
                <div className="messages-header">
                  <div className="conversation-details">
                    <h3>{selectedConversation.otherUser?.name}</h3>
                    {selectedConversation.product && (
                      <p className="product-ref">
                        <PackageIcon /> {selectedConversation.product.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="messages-list">
                  {messages.map(msg => (
                    <div
                      key={msg._id}
                      className={`message ${msg.sender._id === user.id ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">
                        <p>{msg.content}</p>
                        <span className="message-time">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <form className="message-input-form" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="message-input"
                  />
                  <Button type="submit" variant="primary">
                    <SendIcon /> Send
                  </Button>
                </form>
              </Card>
            ) : (
              <Card className="messages-card">
                <div className="empty-state">
                  <MailIcon size={64} />
                  <h3>Select a conversation</h3>
                  <p>Choose a conversation from the left to start messaging</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;



