import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogPost from '../components/BlogPost';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.DEV ? 'http://localhost:3001' : '';

const AllPosts = () => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ page: 1, limit: 9, totalPages: 1 });
    const [filters, setFilters] = useState({
        page: 1,
        limit: 9,
        category_id: '',
        search: ''
    });

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/api/public/categories`);
                const data = await response.json();
                if (data.categories) {
                    setCategories(data.categories);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch Articles
    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    page: filters.page,
                    limit: filters.limit,
                    ...(filters.category_id && { category_id: filters.category_id }),
                    ...(filters.search && { search: filters.search })
                });

                const response = await fetch(`${API_URL}/api/public/articles?${queryParams}`);
                const data = await response.json();

                if (data.articles) {
                    setArticles(data.articles);
                    setMeta(data.meta);
                }
            } catch (error) {
                console.error('Failed to fetch articles:', error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchArticles, 300); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [filters]);

    const handleCategoryChange = (catId) => {
        setFilters(prev => ({ ...prev, category_id: catId, page: 1 }));
    };

    const handleSearchChange = (e) => {
        setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= meta.totalPages) {
            setFilters(prev => ({ ...prev, page: newPage }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getImageUrl = (article) => {
        if (article.thumbnail) {
            return `${API_URL}${article.thumbnail}`;
        }
        return `https://placehold.co/600x400/e2e8f0/475569?text=${encodeURIComponent(article.category_name || 'News')}`;
    };

    const getExcerpt = (content) => {
        if (!content) return '';
        const stripped = content.replace(/<[^>]*>/g, '');
        return stripped.substring(0, 100) + (stripped.length > 100 ? '...' : '');
    };

    return (
        <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <div className="container" style={{ marginTop: '120px', flex: 1, marginBottom: '60px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '15px' }}>Berita & Artikel Sekolah</h1>
                    <p style={{ color: '#6B7280', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        Ikuti perkembangan terbaru, prestasi siswa, dan informasi penting lainnya dari SMA Annuriyyah.
                    </p>
                </div>

                {/* Filters & Search */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    marginBottom: '40px',
                    alignItems: 'center'
                }}>
                    {/* Search Bar */}
                    <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input
                            type="text"
                            placeholder="Cari artikel..."
                            value={filters.search}
                            onChange={handleSearchChange}
                            style={{
                                width: '100%',
                                padding: '12px 12px 12px 45px',
                                borderRadius: '99px',
                                border: '1px solid #E5E7EB',
                                fontSize: '1rem',
                                outline: 'none',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                        />
                    </div>

                    {/* Category Pills */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                            onClick={() => handleCategoryChange('')}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '99px',
                                border: '1px solid',
                                borderColor: filters.category_id === '' ? '#2563EB' : '#E5E7EB',
                                backgroundColor: filters.category_id === '' ? '#EFF6FF' : '#fff',
                                color: filters.category_id === '' ? '#2563EB' : '#4B5563',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                        >
                            Semua
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '99px',
                                    border: '1px solid',
                                    borderColor: filters.category_id === cat.id ? '#2563EB' : '#E5E7EB',
                                    backgroundColor: filters.category_id === cat.id ? '#EFF6FF' : '#fff',
                                    color: filters.category_id === cat.id ? '#2563EB' : '#4B5563',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Articles Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <div className="loader" style={{
                            width: '40px', height: '40px', border: '3px solid #E5E7EB',
                            borderTopColor: '#2563EB', borderRadius: '50%', margin: '0 auto',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                    </div>
                ) : articles.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#6B7280' }}>
                        <p style={{ fontSize: '1.1rem' }}>Tidak ada artikel ditemukan.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                        <AnimatePresence>
                            {articles.map((article, idx) => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <BlogPost
                                        id={article.id}
                                        image={getImageUrl(article)}
                                        date={new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        title={article.title}
                                        excerpt={getExcerpt(article.content)}
                                        category={article.category_name}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Pagination */}
                {meta.totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '60px' }}>
                        <button
                            onClick={() => handlePageChange(meta.page - 1)}
                            disabled={meta.page === 1}
                            style={{
                                padding: '10px 20px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                backgroundColor: '#fff',
                                color: meta.page === 1 ? '#9CA3AF' : '#374151',
                                cursor: meta.page === 1 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Previous
                        </button>

                        {[...Array(meta.totalPages)].map((_, idx) => (
                            <button
                                key={idx + 1}
                                onClick={() => handlePageChange(idx + 1)}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '8px',
                                    border: '1px solid',
                                    borderColor: meta.page === idx + 1 ? '#2563EB' : '#E5E7EB',
                                    backgroundColor: meta.page === idx + 1 ? '#2563EB' : '#fff',
                                    color: meta.page === idx + 1 ? '#fff' : '#374151',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                {idx + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(meta.page + 1)}
                            disabled={meta.page === meta.totalPages}
                            style={{
                                padding: '10px 20px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                backgroundColor: '#fff',
                                color: meta.page === meta.totalPages ? '#9CA3AF' : '#374151',
                                cursor: meta.page === meta.totalPages ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>

            <Footer />
        </div>
    );
};

export default AllPosts;
