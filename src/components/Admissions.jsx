import React from 'react';
import { CheckCircle, DollarSign, Calendar, Send } from 'lucide-react';

const Admissions = () => {
    return (
        <section id="spmb" className="section" style={{ backgroundColor: '#fff' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <p style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', color: '#F59E0B', marginBottom: '10px' }}>Bergabunglah Bersama Kami</p>
                    <h2 className="section-title">Informasi SPMB 2026/2027</h2>
                    <p className="section-subtitle">Sistem Penerimaan Murid Baru SMA Annuriyyah Bumiayu</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>

                    {/* Card Biaya */}
                    <div style={{
                        padding: '30px',
                        borderRadius: '16px',
                        border: '1px solid #E5E7EB',
                        backgroundColor: '#F9FAFB'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <DollarSign size={24} color="#F59E0B" /> Rincian Biaya
                        </h3>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem', color: '#4B5563' }}>
                            <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Seragam (Khusus, OR, Jas)</span> <strong>Rp 600.000</strong></li>
                            <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tes Pemetaan & MOS</span> <strong>Rp 125.000</strong></li>
                            <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Kegiatan Kesiswaan/OSIS</span> <strong>Rp 150.000</strong></li>
                            <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Pengembangan Komputer</span> <strong>Rp 150.000</strong></li>
                            <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Badge & Atribut</span> <strong>Rp 75.000</strong></li>
                            <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>SPP Bulan Juli 2026</span> <strong>Rp 100.000</strong></li>
                            <li style={{ borderTop: '1px solid #D1D5DB', paddingTop: '10px', marginTop: '5px', display: 'flex', justifyContent: 'space-between', color: '#111827', fontWeight: 'bold' }}>
                                <span>TOTAL</span> <span>Rp 1.200.000</span>
                            </li>
                        </ul>
                    </div>

                    {/* Card Syarat */}
                    <div style={{
                        padding: '30px',
                        borderRadius: '16px',
                        border: '1px solid #E5E7EB',
                        backgroundColor: '#ffffff'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CheckCircle size={24} color="#F59E0B" /> Syarat Pendaftaran
                        </h3>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem', color: '#4B5563' }}>
                            <li>• Mengisi Formulir Pendaftaran</li>
                            <li>• Fotokopi Ijazah/SKL SMP/MTs (Legalisir)</li>
                            <li>• Fotokopi KTP Orang Tua (2 Lembar)</li>
                            <li>• Fotokopi Kartu Keluarga (2 Lembar)</li>
                            <li>• Fotokopi Akta Kelahiran</li>
                            <li>• Fotokopi KIP/PKH (Jika Ada)</li>
                        </ul>
                    </div>

                    {/* Card Beasiswa */}
                    <div style={{
                        padding: '30px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #111827 0%, #1E3A8A 100%)',
                        color: '#ffffff'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#F59E0B' }}>
                            Beasiswa Berprestasi
                        </h3>
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontWeight: '600', color: '#FCD34D' }}>Ranking 1</p>
                            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Bebas Uang Daftar Ulang & SPP 6 Bulan</p>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontWeight: '600', color: '#FCD34D' }}>Ranking 2</p>
                            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Bebas Uang Daftar Ulang & SPP 3 Bulan</p>
                        </div>
                        <div style={{ marginBottom: '0' }}>
                            <p style={{ fontWeight: '600', color: '#FCD34D' }}>Ranking 3</p>
                            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Uang Daftar Ulang Diskon 50%</p>
                        </div>
                    </div>

                </div>

                {/* Waktu Pendaftaran */}
                <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center', marginBottom: '80px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        padding: '15px 30px',
                        backgroundColor: '#FEF3C7',
                        borderRadius: '50px',
                        color: '#92400E'
                    }}>
                        <Calendar size={20} />
                        <span style={{ fontWeight: '600' }}>Waktu Pendaftaran: Desember 2025 - Juni 2026</span>
                    </div>
                </div>

                {/* NEW CONTACT FORM */}
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', marginBottom: '80px' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '30px' }}>Ada Pertanyaan? Hubungi Kami</h3>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => e.preventDefault()}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <input
                                type="text"
                                placeholder="Nama Lengkap"
                                style={{
                                    flex: 1,
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #D1D5DB',
                                    fontSize: '0.95rem',
                                    backgroundColor: '#F9FAFB'
                                }}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                style={{
                                    flex: 1,
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #D1D5DB',
                                    fontSize: '0.95rem',
                                    backgroundColor: '#F9FAFB'
                                }}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Subjek Pesan"
                            style={{
                                width: '100%',
                                padding: '15px',
                                borderRadius: '8px',
                                border: '1px solid #D1D5DB',
                                fontSize: '0.95rem',
                                backgroundColor: '#F9FAFB'
                            }}
                        />
                        <textarea
                            placeholder="Tulis pesan Anda di sini..."
                            rows="5"
                            style={{
                                width: '100%',
                                padding: '15px',
                                borderRadius: '8px',
                                border: '1px solid #D1D5DB',
                                fontSize: '0.95rem',
                                backgroundColor: '#F9FAFB',
                                fontFamily: 'inherit'
                            }}
                        ></textarea>
                        <button
                            className="btn btn-primary"
                            style={{
                                alignSelf: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '12px 40px'
                            }}
                        >
                            Kirim Pesan <Send size={18} />
                        </button>
                    </form>
                </div>

            </div>
        </section>
    );
};

export default Admissions;
