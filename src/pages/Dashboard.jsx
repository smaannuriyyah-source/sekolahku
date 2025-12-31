import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, FileText, User, Users, FolderOpen, ClipboardList, Loader2 } from 'lucide-react';


const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthAndFetch = async () => {
            const userData = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            if (userData) {
                setUser(JSON.parse(userData));
            }

            try {
                const headers = { 'Authorization': `Bearer ${token}` };

                const apiBase = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api';
                const [articlesRes, registrationsRes] = await Promise.all([
                    fetch(`${apiBase}/articles`, { headers }),
                    fetch(`${apiBase}/registrations/stats`, { headers })
                ]);

                const articlesData = await articlesRes.json();
                const registrationsData = await registrationsRes.json();

                setStats({
                    totalArticles: articlesData.articles ? articlesData.articles.length : 0,
                    totalReports: registrationsData.count || 0,
                    totalUsers: 1, // Default to 1 (admin)
                    visitors: 892 // Static for now
                });
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndFetch();
    }, [navigate]);

    const handleLogout = () => {
        // Optional: Call logout API if needed
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
            {/* Sidebar */}
            <aside style={{
                width: '250px',
                backgroundColor: '#ffffff',
                borderRight: '1px solid #E5E7EB',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ marginBottom: '40px', padding: '0 10px' }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', fontFamily: 'var(--font-heading)' }}>
                        CMS Admin
                    </h1>
                </div>

                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '10px' }}>
                            <Link to="/dashboard" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px',
                                borderRadius: '8px',
                                backgroundColor: '#EFF6FF',
                                color: '#2563EB',
                                textDecoration: 'none',
                                fontWeight: '500'
                            }}>
                                <LayoutDashboard size={20} /> Dashboard
                            </Link>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <Link to="/dashboard/articles" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px',
                                borderRadius: '8px',
                                color: '#374151',
                                textDecoration: 'none',
                                fontWeight: '500'
                            }}>
                                <FileText size={20} /> Artikel
                            </Link>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <Link to="/dashboard/categories" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px',
                                borderRadius: '8px',
                                color: '#374151',
                                textDecoration: 'none',
                                fontWeight: '500'
                            }}>
                                <FolderOpen size={20} /> Kategori
                            </Link>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <Link to="/dashboard/registrations" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px',
                                borderRadius: '8px',
                                color: '#374151',
                                textDecoration: 'none',
                                fontWeight: '500'
                            }}>
                                <ClipboardList size={20} /> Pendaftaran
                            </Link>
                        </li>
                        {user?.role === 'admin' && (
                            <li style={{ marginBottom: '10px' }}>
                                <Link to="/dashboard/users" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    color: '#374151',
                                    textDecoration: 'none',
                                    fontWeight: '500'
                                }}>
                                    <Users size={20} /> Pengguna
                                </Link>
                            </li>
                        )}
                        <li style={{ marginBottom: '10px' }}>
                            <Link to="/dashboard/profile" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px',
                                borderRadius: '8px',
                                color: '#374151',
                                textDecoration: 'none',
                                fontWeight: '500'
                            }}>
                                <User size={20} /> Profile
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#111827' }}>{user.name}</p>
                        <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>{user.role}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            width: '100%',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #E5E7EB',
                            backgroundColor: '#ffffff',
                            color: '#DC2626',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '40px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111827', marginBottom: '30px' }}>
                        Dashboard Overview
                    </h2>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#16A34A' }} />
                            <p style={{ color: '#6B7280', marginTop: '10px' }}>Memuat data...</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <h3 style={{ color: '#6B7280', fontSize: '0.9rem', fontWeight: '500', marginBottom: '10px' }}>Total Pendaftar</h3>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>{stats?.totalReports || 0}</p>
                            </div>
                            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <h3 style={{ color: '#6B7280', fontSize: '0.9rem', fontWeight: '500', marginBottom: '10px' }}>Artikel Terbit</h3>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>{stats?.totalArticles || 0}</p>
                            </div>
                            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <h3 style={{ color: '#6B7280', fontSize: '0.9rem', fontWeight: '500', marginBottom: '10px' }}>Total Pengguna</h3>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>{stats?.totalUsers || 0}</p>
                            </div>
                            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <h3 style={{ color: '#6B7280', fontSize: '0.9rem', fontWeight: '500', marginBottom: '10px' }}>Pengunjung Hari Ini</h3>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>{stats?.visitors || 0}</p>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '40px', backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>Akses Cepat</h3>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <Link to="/dashboard/registrations" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                backgroundColor: '#EFF6FF',
                                color: '#2563EB',
                                textDecoration: 'none',
                                fontWeight: '500',
                                transition: 'all 0.2s',
                                border: '1px solid #BFDBFE'
                            }}>
                                <ClipboardList size={20} /> Lihat Pendaftaran
                            </Link>
                            <Link to="/dashboard/reports" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                backgroundColor: '#F0FDF4',
                                color: '#16A34A',
                                textDecoration: 'none',
                                fontWeight: '500',
                                transition: 'all 0.2s',
                                border: '1px solid #BBF7D0'
                            }}>
                                <FileText size={20} /> Kelola Laporan
                            </Link>
                            <Link to="/dashboard/articles" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                backgroundColor: '#FEF3C7',
                                color: '#D97706',
                                textDecoration: 'none',
                                fontWeight: '500',
                                transition: 'all 0.2s',
                                border: '1px solid #FDE68A'
                            }}>
                                <FileText size={20} /> Kelola Artikel
                            </Link>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>Selamat Datang di CMS Sekolah!</h3>
                        <p style={{ color: '#4B5563', lineHeight: '1.6' }}>
                            Halo <strong>{user.name}</strong>, ini adalah panel admin untuk mengelola konten website sekolah.
                            Anda dapat menambahkan artikel, mengupdate data guru, dan memantau pendaftaran siswa baru dari sini.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
