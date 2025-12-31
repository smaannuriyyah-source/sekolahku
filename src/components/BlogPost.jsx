import React from 'react';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogPost = ({ id, image, date, title, excerpt, category }) => (
    <Link to={`/article/${id}`} className="blog-card" style={{
        backgroundColor: '#fff',
        border: '1px solid #E5E7EB',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        display: 'block',
        textDecoration: 'none',
        borderRadius: '8px',
        overflow: 'hidden'
    }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
        <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
            <img src={image} alt={title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: '#fff',
                padding: '5px 10px',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#111827',
                borderRadius: '4px'
            }}>
                {category || 'NEWS'}
            </div>
        </div>

        <div style={{ padding: '25px' }}>
            <div style={{ display: 'flex', gap: '15px', color: '#6B7280', fontSize: '0.85rem', marginBottom: '15px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><User size={14} /> Admin</span>
            </div>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', lineHeight: '1.4', color: '#111827', fontWeight: '700' }}>{title}</h3>
            <p style={{ color: '#4B5563', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>{excerpt}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#111827', fontWeight: '600', fontSize: '0.9rem' }}>
                Read More <ArrowRight size={16} />
            </div>
        </div>
    </Link>
);

export default BlogPost;
