import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Programs from '../components/Programs';
import Admissions from '../components/Admissions';
import FounderHistory from '../components/FounderHistory';
import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';
import FloatingSocials from '../components/FloatingSocials'; // New
import { Monitor, Home as HomeIcon, BookOpen } from 'lucide-react';

const Home = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <About />
            <Programs />
            {/* Facilities Section */}
            <section className="section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #F3F4F6' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 className="section-title">Fasilitas Lengkap</h2>
                        <p className="section-subtitle">Menunjang kegiatan belajar mengajar yang efektif.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', alignItems: 'flex-start' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '60px', height: '60px', backgroundColor: '#F0FDF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#16A34A' }}>
                                <Monitor size={30} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Laboratorium Modern</h3>
                            <p style={{ fontSize: '0.95rem', color: '#6B7280', maxWidth: '280px', margin: '0 auto' }}>
                                Lab Komputer, Lab Bahasa Multimedia, dan Lab IPA yang lengkap.
                            </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '60px', height: '60px', backgroundColor: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#2563EB' }}>
                                <HomeIcon size={30} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Boarding School</h3>
                            <p style={{ fontSize: '0.95rem', color: '#6B7280', maxWidth: '280px', margin: '0 auto' }}>
                                Asrama Pondok Pesantren bagi siswa/siswi dari luar kota dengan biaya terjangkau.
                            </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '60px', height: '60px', backgroundColor: '#FFFBEB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#D97706' }}>
                                <BookOpen size={30} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Fasilitas Penunjang</h3>
                            <p style={{ fontSize: '0.95rem', color: '#6B7280', maxWidth: '280px', margin: '0 auto' }}>
                                Perpustakaan, Aula, Hotspot Area, dan Ruang Kelas ber-LCD Projector.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <FounderHistory />
            <BlogSection />
            <Admissions />
            <Footer />
            <FloatingSocials />
        </>
    );
};

export default Home;
