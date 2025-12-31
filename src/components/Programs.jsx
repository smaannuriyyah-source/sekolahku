import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Importing images
import img1 from '../assets/images/1.webp';
import img2 from '../assets/images/2.webp';
import img3 from '../assets/images/3.webp';
import RevealOnScroll from './RevealOnScroll';

const Programs = () => {
    const [activeTab, setActiveTab] = useState('unggulan');
    const [currentImage, setCurrentImage] = useState(0);

    const programImages = [img3, img1, img2];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % programImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    // Data from brochure
    const programs = [
        "Program MABIT (Malam Bimbingan Iman & Taqwa)",
        "Program SABSAH (Sabtu Sehat)",
        "Program Bimbingan BTQ (Baca Tulis Al-Qur'an)",
        "Boarding School (Pesantren An-Nuriyyah)"
    ];

    const extracurriculars = [
        "Pramuka & Paskibra",
        "Futsal & Bola Voli",
        "Komputer & Multimedia",
        "Seni Tari & Hadroh",
        "PMR (Palang Merah Remaja)",
        "English Club (ACC)"
    ];

    const displayList = activeTab === 'unggulan' ? programs : extracurriculars;

    return (
        <section id="programs" className="section-padding" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="container">

                <div style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <p style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', color: '#6B7280', marginBottom: '10px' }}>Pengembangan Diri</p>
                        <h2 style={{ fontSize: '2.5rem', maxWidth: '500px' }}>Program Unggulan & Ekstrakurikuler</h2>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => setActiveTab('unggulan')}
                            className={activeTab === 'unggulan' ? 'btn btn-primary' : 'btn btn-outline'}
                            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                        >
                            Program Unggulan
                        </button>
                        <button
                            onClick={() => setActiveTab('ekstra')}
                            className={activeTab === 'ekstra' ? 'btn btn-primary' : 'btn btn-outline'}
                            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                        >
                            Ekstrakurikuler
                        </button>
                    </div>
                </div>

                {/* Main Content Grid: Fixed explicit grid style */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '60px', alignItems: 'center' }}>

                    {/* List */}
                    <div>
                        <ul style={{ borderTop: '1px solid #E5E7EB' }}>
                            {displayList.map((item, index) => (
                                <li key={index} style={{
                                    padding: '25px 0',
                                    borderBottom: '1px solid #E5E7EB',
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#111827',
                                    fontWeight: '500',
                                    transition: 'all 0.3s'
                                }}>
                                    <div style={{ width: '20px', height: '1px', backgroundColor: '#111827', marginRight: '15px' }}></div>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        {/* Decorative Crosshair Grid */}
                        <div style={{ marginTop: '50px', position: 'relative' }}>
                            <div className="crosshair"></div>
                            <div className="crosshair" style={{ position: 'absolute', top: '50px', left: '0' }}></div>
                        </div>
                    </div>

                    {/* Right Image Slider: Wrapped correctly in RevealOnScroll */}
                    <RevealOnScroll delay={0.3}>
                        <div style={{ position: 'relative', height: '500px' }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '90%',
                                height: '90%',
                                backgroundColor: '#fff',
                                padding: '10px',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                overflow: 'hidden'
                            }}>
                                <AnimatePresence mode='wait'>
                                    <motion.img
                                        key={currentImage}
                                        src={programImages[currentImage]}
                                        alt="Kegiatan Siswa"
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </AnimatePresence>

                                {/* Slider Indicators */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    display: 'flex',
                                    gap: '10px',
                                    zIndex: 10
                                }}>
                                    {programImages.map((_, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setCurrentImage(idx)}
                                            style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                backgroundColor: idx === currentImage ? '#16A34A' : 'rgba(255,255,255,0.8)',
                                                cursor: 'pointer',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Dark Overlay Box */}
                            <div style={{
                                position: 'absolute',
                                bottom: '40px',
                                left: '-20px',
                                width: '320px',
                                backgroundColor: '#111827',
                                color: '#fff',
                                padding: '30px',
                                borderRadius: '4px',
                                zIndex: 20
                            }}>
                                <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    {activeTab === 'unggulan'
                                        ? "Kami menyediakan program khusus untuk membentuk karakter islami dan kemandirian siswa."
                                        : "Wadah bagi siswa untuk menyalurkan bakat dan minat di bidang olahraga, seni, dan teknologi."}
                                </p>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>

            </div>
        </section>
    );
};

export default Programs;
