import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const toPlainText = (text) =>
  text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1');

const Assistant = ({ suggestedPrompt = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to LuxeBuy. I am your personal AI shopping guide. How can I assist you in finding your next masterpiece today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [isConfiguring, setIsConfiguring] = useState(!import.meta.env.VITE_GEMINI_API_KEY);
  const chatEndRef = useRef(null);
  const promptInputRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!suggestedPrompt) return;

    setIsOpen(true);
    setInput(suggestedPrompt);
    setTimeout(() => promptInputRef.current?.focus(), 50);
  }, [suggestedPrompt]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages,
          input: input
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to connect to assistant backend');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error("Assistant Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: `My apologies, I am having trouble connecting right now. ${error.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="assistant-wrapper">
      {/* Floating Toggle Button */}
      <button className={`assistant-toggle ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l4-4V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window glass">
          <div className="chat-header">
            <h3>Luxe Assistant</h3>
            <span className="online-indicator">Online</span>
          </div>

          <div className="chat-body" style={{ position: 'relative' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`message-bubble ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {isTyping && <div className="typing-loader"><span></span><span></span><span></span></div>}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input-area">
            <input 
              ref={promptInputRef}
              type="text" 
              placeholder="Ask me anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="send-btn" onClick={handleSend}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .assistant-wrapper {
          position: fixed;
          bottom: 40px;
          right: 40px;
          z-index: 2000;
        }

        .assistant-toggle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--primary);
          color: var(--bg-dark);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(197, 160, 89, 0.4);
          transition: var(--transition);
        }

        .assistant-toggle:hover {
          transform: scale(1.1) rotate(5deg);
        }

        .assistant-toggle.active {
          background: var(--bg-card);
          color: var(--primary);
        }

        .chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          height: 500px;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chat-header {
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-header h3 {
          font-size: 1rem;
          color: var(--primary);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .online-indicator {
          font-size: 0.7rem;
          color: #4CAF50;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .online-indicator::before {
          content: '';
          width: 6px;
          height: 6px;
          background: #4CAF50;
          border-radius: 50%;
          display: inline-block;
        }

        .chat-body {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .config-pane {
          padding: 20px;
          background: rgba(197, 160, 89, 0.1);
          border: 1px solid var(--primary);
          border-radius: 12px;
          text-align: center;
        }

        .config-pane p {
          font-size: 0.9rem;
          margin-bottom: 15px;
          color: var(--text-main);
        }
        
        .config-pane input {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          background: var(--bg-dark);
          border: 1px solid var(--glass-border);
          color: var(--text-main);
          border-radius: 8px;
        }

        .config-pane button {
          width: 100%;
          padding: 10px;
          background: var(--primary);
          color: var(--bg-dark);
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .message-bubble {
          max-width: 85%;
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 0.9rem;
          line-height: 1.4;
          white-space: pre-wrap;
        }

        .message-bubble.assistant {
          align-self: flex-start;
          background: var(--glass);
          color: var(--text-main);
          border-bottom-left-radius: 4px;
        }

        .message-bubble.user {
          align-self: flex-end;
          background: var(--primary);
          color: var(--bg-dark);
          border-bottom-right-radius: 4px;
          font-weight: 500;
        }

        .chat-input-area {
          padding: 20px;
          display: flex;
          gap: 10px;
          background: rgba(0, 0, 0, 0.2);
        }

        .chat-input-area input {
          flex: 1;
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 12px;
          color: var(--text-main);
          font-family: inherit;
          outline: none;
        }

        .send-btn {
          background: var(--primary);
          border: none;
          color: var(--bg-dark);
          width: 45px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .send-btn:hover {
          background: var(--primary-dark);
        }

        .typing-loader {
          display: flex;
          gap: 4px;
          padding: 10px;
        }

        .typing-loader span {
          width: 6px;
          height: 6px;
          background: var(--text-muted);
          border-radius: 50%;
          animation: pulse 1s infinite ease-in-out;
        }

        .typing-loader span:nth-child(2) { animation-delay: 0.2s; }
        .typing-loader span:nth-child(3) { animation-delay: 0.4s; }

        @media (max-width: 500px) {
          .chat-window {
            width: calc(100vw - 40px);
            right: -20px;
          }
          .assistant-wrapper {
            right: 20px;
            bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Assistant;
