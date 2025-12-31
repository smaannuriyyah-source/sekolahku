import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pendaftaran = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        gender: 'Laki-laki',
        nisn: '',
        birth_place: '',
        birth_date: '',
        nik: '',
        religion: '',
        father_name: '',
        mother_name: '',
        address: '',
        phone_number: '',
        origin_school: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const apiBase = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api';
            const response = await fetch(`${apiBase}/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                window.scrollTo(0, 0);
            } else {
                alert(data.error || 'Terjadi kesalahan saat pendaftaran.');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Gagal menghubungi server server.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F3F4F6',
                padding: '20px'
            }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                        backgroundColor: '#fff',
                        padding: '40px',
                        borderRadius: '16px',
                        textAlign: 'center',
                        maxWidth: '500px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#DCFCE7',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px auto',
                        color: '#16A34A'
                    }}>
                        <CheckCircle size={40} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '10px' }}>Pendaftaran Berhasil!</h2>
                    <p style={{ color: '#4B5563', marginBottom: '30px' }}>
                        Data Anda telah kami terima. Silakan tunggu informasi selanjutnya dari panitia PPDB melalui WhatsApp.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            backgroundColor: '#2563EB',
                            color: '#fff',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Kembali ke Beranda
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', padding: '40px 20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '10px' }}>Formulir PPDB Online</h1>
                    <p style={{ color: '#4B5563' }}>Silakan isi data diri calon peserta didik baru dengan benar dan lengkap.</p>
                </div>

                <form onSubmit={handleSubmit} style={{
                    backgroundColor: '#fff',
                    padding: '40px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    {/* Data Pribadi */}
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #E5E7EB' }}>
                            Data Pribadi Siswa
                        </h3>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>Nama Lengkap *</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>NISN</label>
                                    <input
                                        type="number"
                                        name="nisn"
                                        value={formData.nisn}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        placeholder="Opsional jika belum ada"
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>NIK *</label>
                                    <input
                                        type="number"
                                        name="nik"
                                        value={formData.nik}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Tempat Lahir *</label>
                                    <input
                                        type="text"
                                        name="birth_place"
                                        value={formData.birth_place}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Tanggal Lahir *</label>
                                    <input
                                        type="date"
                                        name="birth_date"
                                        value={formData.birth_date}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Jenis Kelamin *</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        required
                                    >
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Agama *</label>
                                    <select
                                        name="religion"
                                        value={formData.religion}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        required
                                    >
                                        <option value="">Pilih Agama...</option>
                                        <option value="Islam">Islam</option>
                                        <option value="Kristen">Kristen</option>
                                        <option value="Katolik">Katolik</option>
                                        <option value="Hindu">Hindu</option>
                                        <option value="Buddha">Buddha</option>
                                        <option value="Konghucu">Konghucu</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Orang Tua */}
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #E5E7EB' }}>
                            Data Orang Tua / Wali
                        </h3>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Nama Ayah Kandung *</label>
                                    <input
                                        type="text"
                                        name="father_name"
                                        value={formData.father_name}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Nama Ibu Kandung *</label>
                                    <input
                                        type="text"
                                        name="mother_name"
                                        value={formData.mother_name}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>No. WhatsApp Orang Tua / Wali *</label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    placeholder="Contoh: 081234567890"
                                    required
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Alamat Lengkap *</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                                    placeholder="Nama Jalan, RT/RW, Desa/Kelurahan, Kecamatan, Kota/Kabupaten"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Data Sekolah Asal */}
                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #E5E7EB' }}>
                            Data Sekolah Asal
                        </h3>
                        <div>
                            <label style={labelStyle}>Asal Sekolah (SMP/MTs) *</label>
                            <input
                                type="text"
                                name="origin_school"
                                value={formData.origin_school}
                                onChange={handleChange}
                                style={inputStyle}
                                placeholder="Nama Sekolah Asal"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            backgroundColor: isLoading ? '#9CA3AF' : '#2563EB',
                            color: '#fff',
                            padding: '14px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="spin" size={20} /> Memproses...
                            </>
                        ) : (
                            <>
                                <Send size={20} /> Kirim Pendaftaran
                            </>
                        )}
                    </button>

                    <style>{`
                        .spin { animation: spin 1s linear infinite; }
                        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    `}</style>
                </form>
            </div>
        </div>
    );
};

const labelStyle = {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px'
};

const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: '#F9FAFB'
};

export default Pendaftaran;
