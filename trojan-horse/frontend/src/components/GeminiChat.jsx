import React, { useState, useRef, useEffect } from 'react';

export default function GeminiChat() {
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hello! How can I help you analyze your dashboard metrics today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Keep chat scrolled to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    // 1. Append user statement locally
    const updatedMessages = [...messages, { role: 'user', text: userText }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // 2. Transmit conversation history to backend proxy
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages // passes previous turns
        })
      });

      const data = await response.json();

      if (data.response) {
        setMessages([...updatedMessages, { role: 'model', text: data.response }]);
      } else {
        setMessages([...updatedMessages, { role: 'model', text: 'Error generating response.' }]);
      }
    } catch (err) {
      setMessages([...updatedMessages, { role: 'model', text: 'Network connection failed.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '800px', margin: '0 auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
      {/* Active Conversation Message Canvas */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            background: msg.role === 'user' ? '#0070f3' : '#f1f5f9',
            color: msg.role === 'user' ? '#fff' : '#1e293b',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            maxWidth: '75%',
            whiteSpace: 'pre-wrap'
          }}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', background: '#f1f5f9', color: '#64748b', padding: '12px 16px', borderRadius: '12px', fontSize: '14px' }}>
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Action Form */}
      <form onSubmit={handleSend} style={{ display: 'flex', padding: '16px', borderTop: '1px solid #e2e8f0', background: '#fafafa' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about dashboard analytics..."
          disabled={isLoading}
          style={{ flex: 1, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
        />
        <button type="submit" disabled={isLoading} style={{ marginLeft: '12px', padding: '10px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
          Send
        </button>
      </form>
    </div>
  );
}
