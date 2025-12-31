import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import img1 from '../assets/images/1.webp';
import img2 from '../assets/images/2.webp';
import img3 from '../assets/images/3.webp';

// Use localhost in development, empty string (relative) in production
const API_URL = import.meta.env.DEV ? 'http://localhost:3001' : '';

// Fallback slides when no articles exist
const fallbackSlides = [
    {
        id: 'fallback-1',
        image: img3,
        title: "Sistem Penerimaan Murid Baru",
        subtitle: "Tahun Pelajaran 2026/2027",
        desc: "Bergabunglah dengan kami untuk membentuk generasi Ulil Albab yang unggul dan berakhlak mulia.",
        cta: "Daftar Sekarang",
        link: "/pendaftaran",
        isArticle: false
    },
    {
        id: 'fallback-2',
        image: img1,
        title: "Prestasi Gemilang Siswa",
        subtitle: "Juara Umum Tk. Kabupaten",
        desc: "Siswa SMA Annuriyyah terus mengukir prestasi di bidang akademik maupun non-akademik.",
        cta: "Lihat Prestasi",
        link: "#blog",
        isArticle: false
    },
    {
        id: 'fallback-3',
        image: img2,
        title: "Lingkungan Belajar Kondusif",
        subtitle: "Fasilitas Lengkap & Modern",
        desc: "Didukung dengan laboratorium, perpustakaan, dan fasilitas penunjang pembelajaran lainnya.",
        cta: "Selengkapnya",
        link: "#about",
        isArticle: false
    }
];

const Hero = () => {
    const [current, setCurrent] = useState(0);
    const [slides, setSlides] = useState(fallbackSlides);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                const response = await fetch(`${API_URL}/api/public/articles?limit=5`);
                const data = await response.json();

                if (data.articles && data.articles.length > 0) {
                    const articleSlides = data.articles.map(article => ({
                        id: article.id,
                        image: article.thumbnail ? `${API_URL}${article.thumbnail}` : img1,
                        title: article.title,
                        subtitle: article.category_name || 'Berita Terbaru',
                        desc: article.content
                            ? article.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                            : 'Baca selengkapnya...',
                        cta: "Baca Artikel",
                        link: `/article/${article.id}`,
                        isArticle: true
                    }));
                    setSlides(articleSlides);
                }
            } catch (error) {
                console.error('Failed to fetch articles for hero:', error);
                // Keep fallback slides
            } finally {
                setLoading(false);
            }
        };
        fetchLatestPosts();
    }, []);

    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000); // 6 seconds per slide
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    if (loading) {
        return (
            <section style={{
                position: 'relative',
                height: '100vh',
                width: '100%',
                backgroundColor: '#111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Loader2 size={48} style={{ color: '#F59E0B', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </section>
        );
    }

    return (
        <section style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', backgroundColor: '#000' }}>

            {/* Slider Content */}
            <div style={{ position: 'relative', height: '100%', zIndex: 10 }}>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={current}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {/* Background Image of the Slide */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${slides[current].image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'brightness(0.3)' // Darken for text readability
                        }}></div>

                        {/* Text Content */}
                        <div className="container" style={{ position: 'relative', zIndex: 20, color: '#fff', textAlign: 'center' }}>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            >
                                <p style={{
                                    fontSize: '1.2rem',
                                    color: '#F59E0B',
                                    fontWeight: '600',
                                    marginBottom: '10px',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase'
                                }}>
                                    {slides[current].subtitle}
                                </p>
                                <h1 style={{
                                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                                    fontWeight: '700',
                                    marginBottom: '20px',
                                    fontFamily: 'var(--font-heading)',
                                    lineHeight: '1.1',
                                    maxWidth: '900px',
                                    margin: '0 auto 20px auto'
                                }}>
                                    {slides[current].title}
                                </h1>
                                <p style={{
                                    fontSize: '1.1rem',
                                    maxWidth: '600px',
                                    margin: '0 auto 40px auto',
                                    color: '#E5E7EB',
                                    lineHeight: '1.6'
                                }}>
                                    {slides[current].desc}
                                </p>

                                {slides[current].isArticle ? (
                                    <Link
                                        to={slides[current].link}
                                        style={{
                                            padding: '15px 40px',
                                            fontSize: '1.1rem',
                                            display: 'inline-block',
                                            textDecoration: 'none',
                                            color: '#fff',
                                            backgroundColor: '#16A34A',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        {slides[current].cta}
                                    </Link>
                                ) : slides[current].link.startsWith('/') ? (
                                    <Link
                                        to={slides[current].link}
                                        style={{
                                            padding: '15px 40px',
                                            fontSize: '1.1rem',
                                            display: 'inline-block',
                                            textDecoration: 'none',
                                            color: '#fff',
                                            backgroundColor: '#F59E0B',
                                            borderRadius: '8px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {slides[current].cta}
                                    </Link>
                                ) : (
                                    <a
                                        href={slides[current].link}
                                        style={{
                                            padding: '15px 40px',
                                            fontSize: '1.1rem',
                                            display: 'inline-block',
                                            textDecoration: 'none',
                                            color: '#fff',
                                            backgroundColor: '#F59E0B',
                                            borderRadius: '8px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {slides[current].cta}
                                    </a>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div style={{
                    position: 'absolute',
                    bottom: '50px',
                    right: '50px',
                    display: 'flex',
                    gap: '20px',
                    zIndex: 30
                }}>
                    <button onClick={prevSlide} style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        cursor: 'pointer',
                        backdropFilter: 'blur(5px)'
                    }}>
                        <ArrowLeft size={24} />
                    </button>
                    <button onClick={nextSlide} style={{
                        background: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000',
                        cursor: 'pointer'
                    }}>
                        <ArrowRight size={24} />
                    </button>
                </div>

                {/* Slide Indicators (Dots) */}
                <div style={{
                    position: 'absolute',
                    bottom: '50px',
                    left: '50px',
                    display: 'flex',
                    gap: '10px',
                    zIndex: 30
                }}>
                    {slides.map((_, idx) => (
                        <div
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            style={{
                                width: current === idx ? '40px' : '10px',
                                height: '4px',
                                backgroundColor: current === idx ? '#16A34A' : 'rgba(255,255,255,0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Hero;

