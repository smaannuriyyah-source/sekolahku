import React, { useState } from 'react';
import { Share2, Instagram, Globe, Phone, X } from 'lucide-react';
import Chatbot from './Chatbot';
import nuriMascot from '../assets/images/nuri_mascot.png';

const FloatingSocials = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const socials = [
        {
            icon: <Phone size={20} />,
            label: 'WhatsApp',
            color: '#25D366',
            href: 'https://wa.me/628812945090'
        },
        {
            icon: <Instagram size={20} />,
            label: 'Instagram',
            color: '#E1306C',
            href: 'https://instagram.com/smaannuriyyahbmy'
        },
        {
            icon: <Globe size={20} />,
            label: 'Website',
            color: '#3B82F6',
            href: 'https://www.smaannuriyyahbmy.sch.id'
        }
    ];

    return (
        <>
            <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

            {/* Container for Buttons - Align items to bottom right */}
            <div className="floating-socials" style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, display: 'flex', alignItems: 'flex-end', gap: '15px' }}>
                <style>{`
                    @media (max-width: 480px) {
                        .floating-socials {
                            right: 15px !important;
                            bottom: 20px !important;
                            gap: 10px !important;
                        }
                    }
                `}</style>

                {/* 1. Tanya Nuri Button (Left side of the toggle) */}
                <button
                    onClick={() => setIsChatOpen(true)}
                    style={{
                        height: '50px',
                        padding: '0 25px',
                        borderRadius: '25px',
                        backgroundColor: '#ffffff',
                        color: '#22C55E', // Green text to match mascot
                        border: '2px solid #22C55E',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(34, 197, 94, 0.2)',
                        transition: 'all 0.3s ease',
                        fontFamily: 'var(--font-heading)', // Use the friendly heading font
                        fontWeight: '700',
                        fontSize: '1rem', // Slightly larger for clarity
                        letterSpacing: '0.5px'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.2)'; }}
                >
                    <img src={nuriMascot} alt="Nuri" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                    <span>Tanya Nuri</span>
                </button>

                {/* 2. Social Media Wrapper (Right side) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>

                    {/* Social Items List (Expands Upwards) */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                        alignItems: 'flex-end',
                        position: 'absolute',
                        bottom: '80px', // Starts above the main buttons
                        right: 0,
                        opacity: isOpen ? 1 : 0,
                        pointerEvents: isOpen ? 'all' : 'none',
                        transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                        {socials.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    textDecoration: 'none',
                                    backgroundColor: '#fff',
                                    padding: '10px 20px',
                                    borderRadius: '50px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.2s',
                                    color: '#374151',
                                    fontWeight: '500',
                                    fontSize: '0.9rem',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                            >
                                <span style={{ color: item.color }}>{item.icon}</span>
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Social Toggle Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: isOpen ? '#EF4444' : '#111827',
                            color: '#ffffff',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                            transition: 'all 0.3s ease',
                            transform: isOpen ? 'rotate(90deg)' : 'rotate(0)'
                        }}
                    >
                        {isOpen ? <X size={24} /> : <Share2 size={24} />}
                    </button>
                </div>

            </div>
        </>
    );
};

export default FloatingSocials;
