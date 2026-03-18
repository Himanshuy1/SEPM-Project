import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { getChatHistory, getConversations } from '../services/messageService';

const Chat = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { socket, onlineUsers } = useSocket();

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, [user]);

    useEffect(() => {
        if (userId) {
            fetchHistory();
        }
    }, [userId, user]);

    useEffect(() => {
        if (socket) {
            socket.on('receiveMessage', (message) => {
                if (message.sender === userId || message.receiver === userId) {
                    setMessages((prev) => [...prev, message]);
                }
                // Refresh conversations to show new message or update order (optional)
                fetchConversations();
            });

            socket.on('messageSent', (message) => {
                if (message.receiver === userId) {
                    setMessages((prev) => [...prev, message]);
                }
            });

            return () => {
                socket.off('receiveMessage');
                socket.off('messageSent');
            };
        }
    }, [socket, userId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchConversations = async () => {
        try {
            if (user?.token) {
                const data = await getConversations(user.token);
                setConversations(data);
            }
        } catch (err) {
            console.error('Error fetching conversations:', err);
        }
    };

    const fetchHistory = async () => {
        setLoading(true);
        try {
            if (user?.token && userId) {
                const data = await getChatHistory(userId, user.token);
                setMessages(data);
            }
        } catch (err) {
            console.error('Error fetching history:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !userId) return;

        socket.emit('sendMessage', {
            senderId: user._id,
            receiverId: userId,
            text: newMessage
        });

        setNewMessage('');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const isOnline = (id) => onlineUsers.includes(id);

    return (
        <div className="chat-page glass" style={{ display: 'flex', height: '80vh', gap: '1px', padding: 0, overflow: 'hidden' }}>
            {/* Sidebar - Conversations */}
            <div style={{ width: '300px', borderRight: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 'var(--space-md)', borderBottom: '1px solid var(--border-light)' }}>
                    <h3 className="text-gradient">Messages</h3>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {conversations.length === 0 && (
                        <p style={{ padding: 'var(--space-md)', textAlign: 'center', color: 'var(--text-muted)' }}>No conversations yet.</p>
                    )}
                    {conversations.map((contact) => (
                        <div
                            key={contact._id}
                            onClick={() => navigate(`/chat/${contact._id}`)}
                            style={{
                                padding: 'var(--space-md)',
                                cursor: 'pointer',
                                backgroundColor: userId === contact._id ? 'rgba(255,255,255,0.1)' : 'transparent',
                                borderBottom: '1px solid var(--border-light)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                    {contact.email[0].toUpperCase()}
                                </div>
                                {isOnline(contact._id) && (
                                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#4ade80', border: '2px solid black' }}></div>
                                )}
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{contact.email}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{contact.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                {userId ? (
                    <>
                        <div style={{ padding: 'var(--space-md)', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h4 style={{ margin: 0 }}>{conversations.find(c => c._id === userId)?.email || 'Chat'}</h4>
                                <span style={{ fontSize: '0.8rem', color: isOnline(userId) ? '#4ade80' : 'var(--text-muted)' }}>
                                    {isOnline(userId) ? 'Online' : 'Offline'}
                                </span>
                            </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {loading ? (
                                <p style={{ textAlign: 'center' }}>Loading messages...</p>
                            ) : (
                                <>
                                    {messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                alignSelf: msg.sender === user._id ? 'flex-end' : 'flex-start',
                                                maxWidth: '70%',
                                                padding: '10px 15px',
                                                borderRadius: '15px',
                                                backgroundColor: msg.sender === user._id ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                                color: 'white',
                                                fontSize: '0.95rem',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                            }}
                                        >
                                            {msg.text}
                                            <div style={{ fontSize: '0.65rem', opacity: 0.7, marginTop: '5px', textAlign: 'right' }}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        <form onSubmit={handleSendMessage} style={{ padding: 'var(--space-md)', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '10px 15px',
                                    borderRadius: '25px',
                                    border: '1px solid var(--border-light)',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ borderRadius: '25px', padding: '10px 25px' }}
                                disabled={!newMessage.trim()}
                            >
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
