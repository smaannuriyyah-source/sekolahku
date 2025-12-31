import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import img1 from '../assets/images/1.webp';
import RevealOnScroll from './RevealOnScroll';
import BlogPost from './BlogPost';

const API_URL = import.meta.env.DEV ? 'http://localhost:3001' : '';

const BlogSection = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(`${API_URL}/api/public/articles?limit=3`);
                const data = await response.json();
                if (data.articles) {
                    setPosts(data.articles);
                }
            } catch (error) {
                console.error('Failed to fetch articles:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    const getImageUrl = (article) => {
        if (article.thumbnail) {
            return `${API_URL}${article.thumbnail}`;
        }
        return img1; // Default fallback image
    };

    const getExcerpt = (content) => {
        if (!content) return '';
        // Strip HTML tags and get first 100 chars
        const stripped = content.replace(/<[^>]*>/g, '');
        return stripped.substring(0, 100) + (stripped.length > 100 ? '...' : '');
    };

    return (
        <section id="blog" className="section-padding" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '50px' }}>
                    <div>
                        <p style={{ textTransform: 'uppercase', color: '#B45309', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: '600' }}>Berita & Artikel</p>
                        <h2 className="section-title" style={{ textAlign: 'left', margin: 0 }}>Latest from School</h2>
                    </div>

                    <Link to="/allpost" className="btn btn-outline" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>View All Posts</Link>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ width: '40px', height: '40px', border: '3px solid #E5E7EB', borderTopColor: '#16A34A', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
                    </div>
                ) : posts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                        <p>Belum ada artikel yang dipublikasikan.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        {posts.map((post, idx) => (
                            <RevealOnScroll key={post.id} delay={idx * 0.2}>
                                <BlogPost
                                    id={post.id}
                                    image={getImageUrl(post)}
                                    date={formatDate(post.created_at)}
                                    title={post.title}
                                    excerpt={getExcerpt(post.content)}
                                    category={post.category_name}
                                />
                            </RevealOnScroll>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </section>
    );
};

export default BlogSection;

