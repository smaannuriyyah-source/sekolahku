import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, FileText, User, Users, FolderOpen, ClipboardList, Plus, Edit, Trash2, X, Loader2 } from 'lucide-react';
import { usersAPI } from '../services/api';

const UsersPage = () => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        role: 'penulis'
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            if (parsedUser.role !== 'admin') {
                window.location.href = '/dashboard';
            }
        }
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await usersAPI.getAll();
            if (data.users) setUsers(data.users);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password;
                await usersAPI.update(editingUser.id, updateData);
            } else {
                await usersAPI.create(formData);
            }
            fetchUsers();
            closeModal();
        } catch (error) {
            console.error('Failed to save user:', error);
            alert('Gagal menyimpan pengguna');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus pengguna ini?')) return;
        try {
            await usersAPI.delete(id);
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Gagal menghapus pengguna');
        }
    };

    const openModal = (userItem = null) => {
        if (userItem) {
            setEditingUser(userItem);
            setFormData({
                username: userItem.username,
                password: '',
                name: userItem.name,
                role: userItem.role
            });
        } else {
            setEditingUser(null);
            setFormData({ username: '', password: '', name: '', role: 'penulis' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({ username: '', password: '', name: '', role: 'penulis' });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const getRoleBadge = (role) => {
        const colors = {
            admin: '#DC2626',
            penulis: '#2563EB'
        };
        return { backgroundColor: colors[role] || '#6B7280', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'capitalize' };
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
                        <li style={{ marginBottom: '10px' }}>
                            <Link to="/dashboard/users" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', textDecoration: 'none', fontWeight: '500' }}>
                                <Users size={20} /> Pengguna
                            </Link>
                        </li>
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
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111827' }}>Pengguna</h2>
                        <button onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#16A34A', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                            <Plus size={20} /> Tambah Pengguna
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
                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Nama</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Username</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Role</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Belum ada pengguna</td>
                                        </tr>
                                    ) : (
                                        users.map(userItem => (
                                            <tr key={userItem.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                                <td style={{ padding: '12px', fontSize: '0.9rem', color: '#111827' }}>{userItem.name}</td>
                                                <td style={{ padding: '12px', fontSize: '0.9rem', color: '#6B7280' }}>{userItem.username}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <span style={getRoleBadge(userItem.role)}>{userItem.role}</span>
                                                </td>
                                                <td style={{ padding: '12px' }}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => openModal(userItem)} style={{ padding: '6px', backgroundColor: '#EFF6FF', color: '#2563EB', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                                            <Edit size={16} />
                                                        </button>
                                                        {userItem.id !== user?.id && (
                                                            <button onClick={() => handleDelete(userItem.id)} style={{ padding: '6px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
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
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#111827' }}>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna'}</h3>
                            <button onClick={closeModal} style={{ padding: '4px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>Nama</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>Username</label>
                                <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
                                    Password {editingUser && '(Kosongkan jika tidak ingin mengubah)'}
                                </label>
                                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!editingUser} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>Role</label>
                                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', boxSizing: 'border-box' }}>
                                    <option value="penulis">Penulis</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={closeModal} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#fff', color: '#374151', cursor: 'pointer', fontWeight: '500' }}>Batal</button>
                                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#16A34A', color: '#fff', cursor: 'pointer', fontWeight: '500' }}>Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
