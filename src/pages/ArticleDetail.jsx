import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, Calendar, User, Tag, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.DEV ? 'http://localhost:3001' : '';

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`${API_URL}/api/public/articles/${id}`);
                const data = await response.json();

                if (data.error) {
                    setError(data.error);
                } else if (data.article) {
                    setArticle(data.article);
                }
            } catch (err) {
                console.error('Failed to fetch article:', err);
                setError('Gagal memuat artikel');
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getThumbnailUrl = () => {
        if (article?.thumbnail) {
            return `${API_URL}${article.thumbnail}`;
        }
        return `https://placehold.co/1200x600/e2e8f0/475569?text=${encodeURIComponent(article?.category_name || 'Article')}`;
    };

    if (loading) {
        return (
            <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
                <Navbar />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                    <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#16A34A' }} />
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !article) {
        return (
            <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
                <Navbar />
                <div className="container" style={{ marginTop: '120px', textAlign: 'center', padding: '60px 0' }}>
                    <h1 style={{ fontSize: '2rem', color: '#111827', marginBottom: '16px' }}>Artikel Tidak Ditemukan</h1>
                    <p style={{ color: '#6B7280', marginBottom: '24px' }}>{error || 'Artikel yang Anda cari tidak tersedia'}</p>
                    <Link to="/allpost" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#16A34A',
                        color: '#fff',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '500'
                    }}>
                        <ArrowLeft size={18} /> Kembali ke Semua Artikel
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
            <Navbar />

            {/* Hero Section with Thumbnail */}
            <div style={{
                marginTop: '80px',
                height: '400px',
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${getThumbnailUrl()})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'flex-end'
            }}>
                <div className="container" style={{ paddingBottom: '40px' }}>
                    {article.category_name && (
                        <span style={{
                            backgroundColor: '#16A34A',
                            color: '#fff',
                            padding: '6px 16px',
                            borderRadius: '99px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            marginBottom: '16px',
                            display: 'inline-block'
                        }}>
                            {article.category_name}
                        </span>
                    )}
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        color: '#fff',
                        marginTop: '16px',
                        lineHeight: '1.3',
                        maxWidth: '800px'
                    }}>
                        {article.title}
                    </h1>
                    <div style={{ display: 'flex', gap: '24px', marginTop: '20px', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={16} /> {formatDate(article.created_at)}
                        </span>
                        {article.author_name && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <User size={16} /> {article.author_name}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <div className="container" style={{ marginTop: '-30px', marginBottom: '60px' }}>
                <article style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    padding: '40px',
                    maxWidth: '900px'
                }}>
                    {/* Back Button */}
                    <Link to="/allpost" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#6B7280',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        marginBottom: '24px'
                    }}>
                        <ArrowLeft size={16} /> Kembali ke Semua Artikel
                    </Link>

                    {/* Content */}
                    <div
                        style={{
                            fontSize: '1.1rem',
                            lineHeight: '1.8',
                            color: '#374151'
                        }}
                        dangerouslySetInnerHTML={{ __html: article.content || '<p>Tidak ada konten</p>' }}
                    />
                </article>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>

            <Footer />
        </div>
    );
};

export default ArticleDetail;
