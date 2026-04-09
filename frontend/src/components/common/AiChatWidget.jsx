import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { aiAPI } from '../../services/api';

const AiChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi! I can help with product search, order tracking, shipping, and returns.'
    }
  ]);

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setMessage('');
    setLoading(true);

    try {
      const { data } = await aiAPI.chat({ message: trimmed });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: data?.data?.text || 'Sorry, I could not process that.' }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'AI assistant is temporarily unavailable. Please try again.' }
      ]);
      console.error('AI chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div
          style={{
            position: 'fixed',
            right: 20,
            bottom: 90,
            width: 340,
            maxWidth: 'calc(100vw - 24px)',
            height: 430,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 14,
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              padding: '12px 14px',
              borderBottom: '1px solid #eef2f7',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <strong>SmartShop Assistant</strong>
            <button onClick={() => setOpen(false)} style={{ border: 0, background: 'transparent', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ padding: 12, overflowY: 'auto', flex: 1 }}>
            {messages.map((item, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: 8,
                  display: 'flex',
                  justifyContent: item.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    background: item.role === 'user' ? '#2563eb' : '#f3f4f6',
                    color: item.role === 'user' ? '#fff' : '#111827',
                    padding: '8px 10px',
                    borderRadius: 10,
                    maxWidth: '80%',
                    whiteSpace: 'pre-wrap',
                    fontSize: 14
                  }}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: 10, borderTop: '1px solid #eef2f7', display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about products, orders, returns..."
              style={{
                flex: 1,
                border: '1px solid #d1d5db',
                borderRadius: 10,
                padding: '10px 12px',
                fontSize: 14
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                border: 0,
                borderRadius: 10,
                background: '#2563eb',
                color: '#fff',
                width: 42,
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: 0,
          background: '#2563eb',
          color: '#fff',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
          zIndex: 1000,
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center'
        }}
      >
        <MessageCircle size={22} />
      </button>
    </>
  );
};

export default AiChatWidget;
