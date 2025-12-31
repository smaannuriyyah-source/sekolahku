import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Loader2, Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getGeminiResponse } from '../services/aiService';
import { motion, AnimatePresence } from 'framer-motion';
import nuriMascot from '../assets/images/nuri_mascot.png';

const Chatbot = ({ isOpen, onClose }) => {
    // Debug log to ensure component is loading correctly
    console.log("Chatbot rendered, isOpen:", isOpen);

    const [messages, setMessages] = useState([
        {
            role: 'model',
            text: 'Halo! Saya Nuri, asisten AI SMA Annuriyyah. Ada yang bisa saya bantu terkait informasi sekolah?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Idle & Session State
    const [lastActivity, setLastActivity] = useState(Date.now());
    const [warningGiven, setWarningGiven] = useState(false);
    const [isIdling, setIsIdling] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false); // Only start timer after first interaction
    const [chatEnded, setChatEnded] = useState(false);
    const [feedbackMode, setFeedbackMode] = useState(false);

    // Feedback State
    const [rating, setRating] = useState(0);
    const [feedbackComment, setFeedbackComment] = useState("");
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    const messagesEndRef = useRef(null);
    const idleTimerRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, feedbackMode]);

    // Reset idle timer on any user interaction
    const resetIdleTimer = () => {
        if (chatEnded || feedbackMode) return;
        setLastActivity(Date.now());
        setWarningGiven(false);
        setIsIdling(false);
    };

    // Idle Logic Check
    useEffect(() => {
        // Only run idle check if chat is open, not ended, not loading AND has interacted
        if (!isOpen || chatEnded || feedbackMode || isLoading || !hasInteracted) return;

        const checkIdle = () => {
            const now = Date.now();
            const idleTime = now - lastActivity; // in ms

            // 1. Warning Phase (15 seconds of silence - adjusted)
            if (idleTime > 15000 && !warningGiven && !isLoading) {
                setWarningGiven(true);
                setIsIdling(true);
                setMessages(prev => [...prev, {
                    role: 'model',
                    text: 'Apakah ada pertanyaan lagi yang bisa Nuri bantu? 😊'
                }]);
            }

            // 2. Auto-End Phase (10 seconds AFTER warning, total 25s)
            if (idleTime > 25000 && warningGiven && !isLoading) {
                handleEndSession();
            }
        };

        const timer = setInterval(checkIdle, 1000); // Check every second
        return () => clearInterval(timer);
    }, [lastActivity, warningGiven, isOpen, chatEnded, feedbackMode, isLoading, hasInteracted]);

    // Update activity when input changes (User Typing Logic)
    useEffect(() => {
        if (input.trim().length > 0) {
            resetIdleTimer();
        }
    }, [input]);

    const handleEndSession = () => {
        setChatEnded(true);
        setMessages(prev => [...prev, {
            role: 'model',
            text: 'Baik Kak, karena tidak ada aktivitas, sesi chat Nuri akhiri dulu ya. Terima kasih sudah berkunjung! 🙏'
        }]);
        setTimeout(() => {
            setFeedbackMode(true);
        }, 1000); // Faster transition to feedback
    };

    const handleSend = async () => {
        if (!input.trim() || chatEnded) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        resetIdleTimer();

        // Logic check: if user answers "tidak" or "cukup" to the warning
        const lowerInput = input.toLowerCase();
        if (warningGiven) {
            const rejectionKeywords = ['tidak', 'cukup', 'makasih', 'sudah', 'ga ada', 'nope', 'no'];
            if (rejectionKeywords.some(keyword => lowerInput.includes(keyword))) {
                setChatEnded(true);
                setIsLoading(false);
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        role: 'model',
                        text: 'Sama-sama Kak! Senang bisa membantu. Jika butuh info lagi, silakan hubungi Admin ya. 👋'
                    }]);
                    setTimeout(() => setFeedbackMode(true), 1000); // Faster transition
                }, 500);
                return;
            }
        }

        try {
            // Prepare history for API
            const historyForApi = messages.map(msg => ({
                role: msg.role === 'model' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));

            const responseText = await getGeminiResponse(historyForApi, input);

            const botMessage = { role: 'model', text: responseText };
            setMessages(prev => [...prev, botMessage]);

            // Mark conversation as active/started ONLY after bot replies success
            setHasInteracted(true);
            resetIdleTimer();
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: "Maaf, terjadi kesalahan. Silakan coba lagi." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    const submitFeedback = () => {
        // Mock submission
        console.log("Feedback Submitted:", { rating, feedbackComment });
        setFeedbackSubmitted(true);
        setTimeout(() => {
            onClose(); // Close chat after submission
            // Reset states for next reopening
            setTimeout(() => {
                setMessages([{ role: 'model', text: 'Halo! Saya Nuri, asisten AI SMA Annuriyyah. Ada yang bisa saya bantu terkait informasi sekolah?' }]);
                setChatEnded(false);
                setFeedbackMode(false);
                setFeedbackSubmitted(false);
                setRating(0);
                setFeedbackComment("");
                setWarningGiven(false);
                setLastActivity(Date.now());
                setHasInteracted(false); // Reset interaction state
            }, 500);
        }, 1500); // Faster Close
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="chatbot-container"
                    style={{
                        position: 'fixed',
                        bottom: '100px',
                        right: '30px',
                        width: '350px',
                        height: '500px',
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 9999,
                        overflow: 'hidden',
                        border: '1px solid #E5E7EB'
                    }}
                >
                    <style>{`
                        @media (max-width: 480px) {
                            .chatbot-container {
                                width: 90% !important;
                                right: 5% !important;
                                left: 5% !important;
                                bottom: 100px !important;
                                height: 75vh !important;
                            }
                        }
                    `}</style>
                    {/* Header */}
                    <div style={{
                        padding: '15px 20px',
                        backgroundColor: '#ffffff', // White BG
                        color: '#1F2937', // Dark Text
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #E5E7EB'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#F3F4F6',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                border: '1px solid #E5E7EB'
                            }}>
                                <img src={nuriMascot} alt="Nuri" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#111827' }}>Nuri</h3>
                                <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isLoading ? '#EAB308' : '#22C55E' }}></span>
                                    {isLoading ? 'Mengetik...' : 'Online'}
                                </span>
                            </div>
                        </div>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '5px' }}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div style={{
                        flex: 1,
                        padding: '20px',
                        overflowY: 'auto',
                        backgroundColor: '#F9FAFB',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    }}>
                        {/* Feedback UI Mode */}
                        {feedbackMode ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '20px' }}>
                                {!feedbackSubmitted ? (
                                    <>
                                        <div>
                                            <h4 style={{ margin: '0 0 10px 0', color: '#111827' }}>Beri Rating Layanan Nuri</h4>
                                            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>Bantu Nuri jadi lebih baik lagi!</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setRating(star)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: star <= rating ? '#EAB308' : '#D1D5DB' }}
                                                >
                                                    <Star size={32} fill={star <= rating ? '#EAB308' : 'none'} />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            value={feedbackComment}
                                            onChange={(e) => setFeedbackComment(e.target.value)}
                                            placeholder="Tulis saran atau kritik..."
                                            style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', outline: 'none' }}
                                        />
                                        <button
                                            onClick={submitFeedback}
                                            disabled={rating === 0}
                                            style={{
                                                backgroundColor: rating > 0 ? '#22C55E' : '#9CA3AF',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '10px 20px',
                                                borderRadius: '20px',
                                                cursor: rating > 0 ? 'pointer' : 'not-allowed',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Kirim Feedback
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E' }}>
                                            <Send size={30} />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: '0 0 5px 0', color: '#111827' }}>Terima Kasih!</h4>
                                            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>Masukan Kakak sangat berharga.</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            /* Regular Chat Messages */
                            <>
                                {messages.map((msg, index) => (
                                    <div key={index} style={{
                                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: '85%',
                                    }}>
                                        <div style={{
                                            padding: '10px 15px',
                                            borderRadius: '12px',
                                            backgroundColor: msg.role === 'user' ? '#1E3A8A' : '#ffffff',
                                            color: msg.role === 'user' ? '#ffffff' : '#1F2937',
                                            borderTopRightRadius: msg.role === 'user' ? '4px' : '12px',
                                            borderTopLeftRadius: msg.role === 'model' ? '4px' : '12px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.5'
                                        }}>
                                            {msg.role === 'model' ? (
                                                <ReactMarkdown
                                                    components={{
                                                        a: ({ node, ...props }) => {
                                                            if (props.href && props.href.includes('wa.me')) {
                                                                return (
                                                                    <a
                                                                        {...props}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style={{
                                                                            display: 'inline-block',
                                                                            marginTop: '10px',
                                                                            backgroundColor: '#25D366',
                                                                            color: '#ffffff',
                                                                            padding: '8px 16px',
                                                                            borderRadius: '20px',
                                                                            textDecoration: 'none',
                                                                            fontWeight: '600',
                                                                            fontSize: '0.9rem',
                                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                                            transition: 'transform 0.2s',
                                                                            textAlign: 'center',
                                                                            border: '1px solid #20BD5A'
                                                                        }}
                                                                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                                                    >
                                                                        {props.children}
                                                                    </a>
                                                                );
                                                            }
                                                            return <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB', textDecoration: 'underline' }} />;
                                                        }
                                                    }}
                                                >
                                                    {msg.text}
                                                </ReactMarkdown>
                                            ) : (
                                                msg.text
                                            )}
                                        </div>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            color: '#9CA3AF',
                                            marginTop: '4px',
                                            display: 'block',
                                            textAlign: msg.role === 'user' ? 'right' : 'left'
                                        }}>
                                            {msg.role === 'user' ? 'Anda' : 'AI Admin'}
                                        </span>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div style={{ alignSelf: 'flex-start', backgroundColor: '#fff', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <div className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: '#9CA3AF', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
                                            <div className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: '#9CA3AF', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.16s' }}></div>
                                            <div className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: '#9CA3AF', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.32s' }}></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input Area */}
                    {!feedbackMode && (
                        <div style={{
                            padding: '15px',
                            backgroundColor: '#ffffff',
                            borderTop: '1px solid #E5E7EB',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                            opacity: chatEnded ? 0.5 : 1,
                            pointerEvents: chatEnded ? 'none' : 'all'
                        }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={chatEnded ? "Sesi berakhir." : "Tulis pesan..."}
                                style={{
                                    flex: 1,
                                    padding: '10px 15px',
                                    borderRadius: '20px',
                                    border: '1px solid #D1D5DB',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    backgroundColor: '#F9FAFB'
                                }}
                                disabled={isLoading || chatEnded}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim() || chatEnded}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: isLoading || !input.trim() || chatEnded ? '#E5E7EB' : '#1E3A8A',
                                    color: '#ffffff',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: isLoading || !input.trim() || chatEnded ? 'not-allowed' : 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                {isLoading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
                            </button>
                        </div>
                    )}

                    <style>{`
            @keyframes bounce {
              0%, 80%, 100% { transform: scale(0); }
              40% { transform: scale(1); }
            }
            .spin { animation: spin 1s linear infinite; }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Chatbot;
