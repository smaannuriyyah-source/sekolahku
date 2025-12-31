import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, FileText, User, Users, FolderOpen, ClipboardList, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { articlesAPI } from '../services/api';

const ArticlesPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const data = await articlesAPI.getAll();
            if (data.articles) setArticles(data.articles);
        } catch (error) {
            console.error('Failed to fetch articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus artikel ini?')) return;
        try {
            await articlesAPI.delete(id);
            fetchArticles();
        } catch (error) {
            console.error('Failed to delete article:', error);
            alert('Gagal menghapus artikel');
        }
    };



    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const getStatusBadge = (status) => {
        const colors = {
            draft: '#6B7280',
            published: '#16A34A',
            archived: '#DC2626'
        };
        return { backgroundColor: colors[status] || '#6B7280', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' };
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
            <aside style={{ width: '250px', backgroundColor: '#ffffff', borderRight: '1px solid #E5E7EB', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '40px', padding: '0 10px' }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>CMS Admin</h1>
                </div>
                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '10px' }}>
                            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', color: '#374151', textDecoration: 'none', fontWeight: '500' }}>
                                <LayoutDashboard size={20} /> Dashboard
                            </Link>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <Link to="/dashboard/articles" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', textDecoration: 'none', fontWeight: '500' }}>
                                <FileText size={20} /> Artikel
                            </Link>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <Link to="/dashboard/categories" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', color: '#374151', textDecoration: 'none', fontWeight: '500' }}>
                                <FolderOpen size={20} /> Kategori
                            </Link>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <Link to="/dashboard/registrations" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', color: '#374151', textDecoration: 'none', fontWeight: '500' }}>
                                <ClipboardList size={20} /> Pendaftaran
                            </Link>
                        </li>
                        {user?.role === 'admin' && (
                            <li style={{ marginBottom: '10px' }}>
                                <Link to="/dashboard/users" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', color: '#374151', textDecoration: 'none', fontWeight: '500' }}>
                                    <Users size={20} /> Pengguna
                                </Link>
                            </li>
                        )}
                        <li style={{ marginBottom: '10px' }}>
                            <Link to="/dashboard/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', color: '#374151', textDecoration: 'none', fontWeight: '500' }}>
                                <User size={20} /> Profile
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#111827' }}>{user?.name}</p>
                        <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>{user?.role}</p>
                    </div>
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#ffffff', color: '#DC2626', cursor: 'pointer', fontWeight: '500' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            <main style={{ flex: 1, padding: '40px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111827' }}>Artikel</h2>
                        <Link to="/dashboard/articles/new" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#16A34A', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', textDecoration: 'none' }}>
                            <Plus size={20} /> Tambah Artikel
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#16A34A' }} />
                        </div>
                    ) : (
                        <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Judul</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Kategori</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Penulis</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Status</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {articles.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Belum ada artikel</td>
                                        </tr>
                                    ) : (
                                        articles.map(article => (
                                            <tr key={article.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                                <td style={{ padding: '12px', fontSize: '0.9rem', color: '#111827' }}>{article.title}</td>
                                                <td style={{ padding: '12px', fontSize: '0.9rem', color: '#6B7280' }}>{article.category_name || '-'}</td>
                                                <td style={{ padding: '12px', fontSize: '0.9rem', color: '#6B7280' }}>{article.author_name}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <span style={getStatusBadge(article.status)}>{article.status}</span>
                                                </td>
                                                <td style={{ padding: '12px' }}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => navigate(`/dashboard/articles/edit/${article.id}`)} style={{ padding: '6px', backgroundColor: '#EFF6FF', color: '#2563EB', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Edit">
                                                            <Edit size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(article.id)} style={{ padding: '6px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Delete">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ArticlesPage;
