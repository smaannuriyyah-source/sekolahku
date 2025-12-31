import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, FileText, User, Users, FolderOpen, ClipboardList, Loader2, Lock } from 'lucide-react';
import { profileAPI } from '../services/api';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profileData, setProfileData] = useState({ name: '', username: '' });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await profileAPI.get();
            if (data.user) {
                setProfile(data.user);
                setProfileData({ name: data.user.name, username: data.user.username });
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const data = await profileAPI.update(profileData);
            if (data.user) {
                setProfile(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                setMessage({ type: 'success', text: 'Profile berhasil diperbarui' });
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            setMessage({ type: 'error', text: 'Gagal memperbarui profile' });
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Password baru tidak cocok' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password minimal 6 karakter' });
            return;
        }

        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await profileAPI.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setMessage({ type: 'success', text: 'Password berhasil diubah' });
        } catch (error) {
            console.error('Failed to change password:', error);
            setMessage({ type: 'error', text: 'Gagal mengubah password. Pastikan password lama benar.' });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
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
                            <Link to="/dashboard/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', textDecoration: 'none', fontWeight: '500' }}>
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
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111827', marginBottom: '30px' }}>Profile Saya</h2>

                    {message.text && (
                        <div style={{
                            backgroundColor: message.type === 'success' ? '#F0FDF4' : '#FEF2F2',
                            color: message.type === 'success' ? '#16A34A' : '#DC2626',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            fontSize: '0.9rem'
                        }}>
                            {message.text}
                        </div>
                    )}

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#16A34A' }} />
                        </div>
                    ) : (
                        <>
                            <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '30px', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>Informasi Profile</h3>
                                <form onSubmit={handleUpdateProfile}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>Nama</label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>Username</label>
                                        <input
                                            type="text"
                                            value={profileData.username}
                                            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                            required
                                            disabled
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', boxSizing: 'border-box', backgroundColor: '#F9FAFB', cursor: 'not-allowed' }}
                                        />
                                        <p style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '4px' }}>Username tidak dapat diubah</p>
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>Role</label>
                                        <input
                                            type="text"
                                            value={profile?.role || ''}
                                            disabled
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', boxSizing: 'border-box', backgroundColor: '#F9FAFB', cursor: 'not-allowed', textTransform: 'capitalize' }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            backgroundColor: saving ? '#9CA3AF' : '#16A34A',
                                            color: '#fff',
                                            cursor: saving ? 'not-allowed' : 'pointer',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        {saving && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                                        {saving ? 'Menyimpan...' : 'Update Profile'}
                                    </button>
                                </form>
                            </div>

                            <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '30px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Lock size={20} /> Ubah Password
                                </h3>
                                <form onSubmit={handleChangePassword}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>Password Lama</label>
                                        <input
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>Password Baru</label>
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            required
                                            minLength="6"
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>Konfirmasi Password Baru</label>
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            required
                                            minLength="6"
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            backgroundColor: saving ? '#9CA3AF' : '#DC2626',
                                            color: '#fff',
                                            cursor: saving ? 'not-allowed' : 'pointer',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        {saving && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                                        {saving ? 'Mengubah...' : 'Ubah Password'}
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
