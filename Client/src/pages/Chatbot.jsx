import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import aiService from "../services/aiService";

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi there! I'm your AI student assistant. How can I help you with your studies today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: "user", content: input };
        const newMessages = [...messages, userMessage];

        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            // We only send the last few messages to keep it efficient, OR the whole history
            // Here we send the whole history for better context
            const data = await aiService.chatWithAI(newMessages, user.token);
            setMessages([...newMessages, { role: "assistant", content: data.reply }]);
        } catch (err) {
            console.error(err);
            setMessages([...newMessages, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot-container animate-fade-in">
            <div className="chatbot-header">
                <h1 className="text-gradient">AI Student Assistant</h1>
                <p className="text-muted">Your 24/7 companion for academic queries and study tips.</p>
            </div>

            <div className="glass-card chatbot-card">
                <div className="chat-window">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message-wrapper ${msg.role}`}>
                            <div className={`message-bubble ${msg.role}`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="message-wrapper assistant">
                            <div className="message-bubble assistant loading-bubble">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="chat-input-form">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Ask me anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                    />
                    <button type="submit" className="btn btn-primary send-btn" disabled={loading || !input.trim()}>
                        Send
                    </button>
                </form>
            </div>

            <style jsx="true">{`
        .chatbot-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 0 1rem;
          height: calc(100vh - 160px);
          display: flex;
          flex-direction: column;
        }

        .chatbot-header {
          text-align: center;
          margin-bottom: 1.5rem;
          flex-shrink: 0;
        }

        .chatbot-card {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        .chat-window {
          flex-grow: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        /* Custom Scrollbar */
        .chat-window::-webkit-scrollbar {
          width: 6px;
        }
        .chat-window::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-window::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .message-wrapper {
          display: flex;
          width: 100%;
        }

        .message-wrapper.user {
          justify-content: flex-end;
        }

        .message-wrapper.assistant {
          justify-content: flex-start;
        }

        .message-bubble {
          max-width: 80%;
          padding: 0.8rem 1.2rem;
          border-radius: 15px;
          font-size: 0.95rem;
          line-height: 1.5;
          word-wrap: break-word;
        }

        .message-bubble.user {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          border-bottom-right-radius: 2px;
        }

        .message-bubble.assistant {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
          border-bottom-left-radius: 2px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .chat-input-form {
          display: flex;
          gap: 0.8rem;
          flex-shrink: 0;
          background: rgba(0, 0, 0, 0.2);
          padding: 0.5rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chat-input {
          flex-grow: 1;
          background: transparent;
          border: none;
          color: white;
          padding: 0.6rem 1rem;
          outline: none;
          font-family: inherit;
        }

        .send-btn {
          padding: 0.6rem 1.5rem;
          border-radius: 10px;
        }

        .loading-bubble {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
        }

        .dot {
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default Chatbot;
