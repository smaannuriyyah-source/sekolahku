import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, FileText, User, Users, FolderOpen, ClipboardList, Plus, Edit, Trash2, X, Loader2, Eye } from 'lucide-react';
import { reportsAPI } from '../services/api';

const ReportsPage = () => {
    const [user, setUser] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [viewingReport, setViewingReport] = useState(null);
    const [editingReport, setEditingReport] = useState(null);
    const [formData, setFormData] = useState({ title: '', photo: null });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const data = await reportsAPI.getAll();
            if (data.reports) setReports(data.reports);
        } catch (error) {
            console.error('Failed to fetch reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            if (formData.photo) {
                formDataToSend.append('photo', formData.photo);
            }

            if (editingReport) {
                await reportsAPI.update(editingReport.id, formDataToSend);
            } else {
                await reportsAPI.create(formDataToSend);
            }
            fetchReports();
            closeModal();
        } catch (error) {
            console.error('Failed to save report:', error);
            alert('Gagal menyimpan laporan');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus laporan ini?')) return;
        try {
            await reportsAPI.delete(id);
            fetchReports();
        } catch (error) {
            console.error('Failed to delete report:', error);
            alert('Gagal menghapus laporan');
        }
    };

    const openModal = (report = null) => {
        if (report) {
            setEditingReport(report);
            setFormData({ title: report.title, photo: null });
        } else {
            setEditingReport(null);
            setFormData({ title: '', photo: null });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingReport(null);
        setViewingReport(null);
        setFormData({ title: '', photo: null });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
                            <Link to="/dashboard/articles" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', color: '#374151', textDecoration: 'none', fontWeight: '500' }}>
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
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111827' }}>Laporan</h2>
                        <button onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#16A34A', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                            <Plus size={20} /> Tambah Laporan
                        </button>
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
                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Penulis</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Tanggal</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Belum ada laporan</td>
                                        </tr>
                                    ) : (
                                        reports.map(report => (
                                            <tr key={report.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                                <td style={{ padding: '12px', fontSize: '0.9rem', color: '#111827' }}>{report.title}</td>
                                                <td style={{ padding: '12px', fontSize: '0.9rem', color: '#6B7280' }}>{report.author_name}</td>
                                                <td style={{ padding: '12px', fontSize: '0.9rem', color: '#6B7280' }}>{formatDate(report.created_at)}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => setViewingReport(report)} style={{ padding: '6px', backgroundColor: '#F0FDF4', color: '#16A34A', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                                            <Eye size={16} />
                                                        </button>
                                                        <button onClick={() => openModal(report)} style={{ padding: '6px', backgroundColor: '#EFF6FF', color: '#2563EB', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                                            <Edit size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(report.id)} style={{ padding: '6px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
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

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '500px' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#111827' }}>{editingReport ? 'Edit Laporan' : 'Tambah Laporan'}</h3>
                            <button onClick={closeModal} style={{ padding: '4px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>Judul Laporan</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>Foto (Opsional)</label>
                                <input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={closeModal} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#fff', color: '#374151', cursor: 'pointer', fontWeight: '500' }}>Batal</button>
                                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#16A34A', color: '#fff', cursor: 'pointer', fontWeight: '500' }}>Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {viewingReport && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#111827' }}>Detail Laporan</h3>
                            <button onClick={closeModal} style={{ padding: '4px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '4px' }}>Judul</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827' }}>{viewingReport.title}</p>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '4px' }}>Penulis</p>
                                <p style={{ fontSize: '1rem', color: '#111827' }}>{viewingReport.author_name}</p>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '4px' }}>Tanggal</p>
                                <p style={{ fontSize: '1rem', color: '#111827' }}>{formatDate(viewingReport.created_at)}</p>
                            </div>
                            {viewingReport.photo && (
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '8px' }}>Foto</p>
                                    <img src={viewingReport.photo} alt={viewingReport.title} style={{ width: '100%', borderRadius: '8px' }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsPage;
