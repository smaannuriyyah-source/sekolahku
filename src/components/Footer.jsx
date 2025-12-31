import React from 'react';
import { Phone, MapPin, Instagram, Globe } from 'lucide-react';
import logo from '../assets/images/logo.png';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#111827', color: '#ffffff', paddingTop: '80px', paddingBottom: '30px' }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '40px',
                    marginBottom: '60px'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                            <img src={logo} alt="Logo" style={{ height: '50px', filter: 'brightness(0) invert(1)' }} />
                            <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>SMA ANNURIYYAH</h3>
                        </div>
                        <p style={{ color: '#9CA3AF', marginBottom: '20px', lineHeight: '1.6' }}>
                            Membentuk Generasi ULIL ALBAB (Unggul, Ilmiah, Amaliyah, Ibadah dan Bertanggung Jawab).
                        </p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <a href="https://instagram.com/smaannuriyyahbmy" target="_blank" rel="noreferrer" style={{ color: '#ffffff' }}><Instagram size={24} /></a>
                            <a href="https://www.smaannuriyyahbmy.sch.id" target="_blank" rel="noreferrer" style={{ color: '#ffffff' }}><Globe size={24} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#F59E0B' }}>Kontak Kami</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#9CA3AF' }}>
                                <MapPin size={20} style={{ flexShrink: 0, color: '#F59E0B' }} />
                                <span>Jl. Yudakerti Dh Jl. Bandung No. 55 Bumiayu, Brebes, Jawa Tengah</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9CA3AF' }}>
                                <Phone size={20} style={{ color: '#F59E0B' }} />
                                <span>0881-2945-090 (Admin)</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#F59E0B' }}>Menu Utama</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <li><a href="#about" style={{ color: '#9CA3AF', transition: '0.3s' }}>Profil Sekolah</a></li>
                            <li><a href="#programs" style={{ color: '#9CA3AF', transition: '0.3s' }}>Program Unggulan</a></li>
                            <li><a href="#spmb" style={{ color: '#9CA3AF', transition: '0.3s' }}>Info SPMB</a></li>
                            <li><a href="#" style={{ color: '#9CA3AF', transition: '0.3s' }}>Kontak</a></li>
                        </ul>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid #1F2937',
                    paddingTop: '30px',
                    textAlign: 'center',
                    color: '#6B7280',
                    fontSize: '0.9rem'
                }}>
                    <p>© {new Date().getFullYear()} SMA Annuriyyah Bumiayu. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
