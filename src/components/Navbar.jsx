import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '#about' },
        { name: 'Programs', path: '#programs' },
        { name: 'Blog', path: '#blog' },
        { name: 'SPMB', path: '#spmb' },
    ];

    // Dynamic Styles
    const navClass = scrolled
        ? {
            bg: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
            blur: 'blur(12px)',
            shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            textColor: '#111827',
            logoColor: '#111827',
            padding: '15px 0'
        }
        : {
            bg: 'transparent',
            blur: 'none',
            shadow: 'none',
            textColor: '#ffffff', // White at top (presuming Hero is dark/image)
            logoColor: '#ffffff',
            padding: '25px 0'
        };

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
            backgroundColor: navClass.bg,
            backdropFilter: navClass.blur,
            boxShadow: navClass.shadow,
            padding: navClass.padding,
            transition: 'all 0.3s ease'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                {/* Logo */}
                <Link to="/" style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: navClass.logoColor,
                    textDecoration: 'none',
                    transition: 'color 0.3s'
                }}>
                    SMA Annuriyyah
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <ul style={{ display: 'flex', gap: '30px', marginRight: '20px' }}>
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                {link.path.startsWith('/') ? (
                                    <Link to={link.path} style={{
                                        color: navClass.textColor,
                                        fontSize: '0.95rem',
                                        fontWeight: '500',
                                        textDecoration: 'none',
                                        transition: 'color 0.3s',
                                        textShadow: scrolled ? 'none' : '0 2px 4px rgba(0,0,0,0.3)'
                                    }}>
                                        {link.name}
                                    </Link>
                                ) : (
                                    <a href={link.path} style={{
                                        color: navClass.textColor,
                                        fontSize: '0.95rem',
                                        fontWeight: '500',
                                        textDecoration: 'none',
                                        transition: 'color 0.3s',
                                        textShadow: scrolled ? 'none' : '0 2px 4px rgba(0,0,0,0.3)'
                                    }}>
                                        {link.name}
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>

                    <Link to="/pendaftaran" style={{
                        padding: '8px 20px',
                        backgroundColor: scrolled ? '#F59E0B' : 'rgba(245, 158, 11, 0.9)',
                        color: '#ffffff',
                        borderRadius: '99px',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s',
                        textDecoration: 'none',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.3)'
                    }}>
                        Daftar SPMB
                    </Link>

                    <Link to="/login" style={{
                        padding: '8px 25px',
                        backgroundColor: scrolled ? '#16A34A' : '#ffffff',
                        color: scrolled ? '#ffffff' : '#111827',
                        borderRadius: '99px',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s',
                        textDecoration: 'none',
                        border: scrolled ? 'none' : '2px solid transparent'
                    }}>
                        Login
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} style={{
                    cursor: 'pointer',
                    color: isOpen ? '#111827' : navClass.textColor
                }}>
                    {isOpen ? <X size={28} style={{ zIndex: 1002, position: 'relative' }} /> : <Menu size={28} />}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '70%',
                height: '100vh',
                backgroundColor: '#ffffff',
                boxShadow: '-10px 0 20px rgba(0,0,0,0.1)',
                padding: '80px 30px',
                transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s ease-in-out',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                zIndex: 1001
            }}>
                {navLinks.map((link) => (
                    link.path.startsWith('/') ? (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            style={{
                                fontSize: '1.2rem',
                                color: '#111827',
                                fontWeight: '600',
                                borderBottom: '1px solid #F3F4F6',
                                paddingBottom: '15px',
                                textDecoration: 'none'
                            }}
                        >
                            {link.name}
                        </Link>
                    ) : (
                        <a
                            key={link.name}
                            href={link.path}
                            onClick={() => setIsOpen(false)}
                            style={{
                                fontSize: '1.2rem',
                                color: '#111827',
                                fontWeight: '600',
                                borderBottom: '1px solid #F3F4F6',
                                paddingBottom: '15px',
                                textDecoration: 'none'
                            }}
                        >
                            {link.name}
                        </a>
                    )
                ))}

                <Link to="/pendaftaran"
                    onClick={() => setIsOpen(false)}
                    style={{
                        marginTop: '10px',
                        textAlign: 'center',
                        backgroundColor: '#F59E0B',
                        color: '#ffffff',
                        padding: '12px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.3)'
                    }}
                >
                    Daftar PPDB Sekarang
                </Link>

                <Link to="/login"
                    onClick={() => setIsOpen(false)}
                    style={{
                        textAlign: 'center',
                        backgroundColor: '#16A34A',
                        color: '#ffffff',
                        padding: '12px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        textDecoration: 'none'
                    }}
                >
                    Login
                </Link>
            </div>

            {/* Overlay Backdrop for Mobile */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 1000
                    }}
                />
            )}

            {/* Responsive Styles Injection */}
            <style>{`
        @media (max-width: 900px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @media (min-width: 901px) {
          .mobile-toggle { display: none !important; }
        }
      `}</style>
        </nav>
    );
};

export default Navbar;
