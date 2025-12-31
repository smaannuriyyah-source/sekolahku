import React from 'react';

const PrincipalMessage = () => {
    return (
        <section className="section" style={{ backgroundColor: '#ffffff' }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '50px',
                    alignItems: 'center'
                }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '100%',
                            height: '400px',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                        }}>
                            {/* Placeholder image since we don't have the real file */}
                            <img
                                src="https://ui-avatars.com/api/?name=Faqihudin+Amaith&background=0F172A&color=fff&size=400"
                                alt="Faqihudin Amaith"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div style={{
                            position: 'absolute',
                            bottom: '-30px',
                            right: '-30px',
                            backgroundColor: '#F59E0B',
                            padding: '30px',
                            borderRadius: '20px',
                            color: '#ffffff',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Faqihudin Amaith</h3>
                            <p style={{ margin: 0, opacity: 0.9 }}>Kepala Sekolah</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="section-title" style={{ textAlign: 'left' }}>Sambutan Kepala Sekolah</h2>
                        <p style={{ fontSize: '1.1rem', color: '#64748B', marginBottom: '20px' }}>
                            "Pendidikan adalah tiket untuk masa depan. Hari esok dimiliki oleh orang-orang yang mempersiapkan dirinya hari ini."
                        </p>
                        <p style={{ color: '#334155', marginBottom: '20px' }}>
                            Assalamu'alaikum Warahmatullahi Wabarakatuh.
                        </p>
                        <p style={{ color: '#334155', marginBottom: '30px' }}>
                            Selamat datang di website resmi SMA Annuriyyah Bumiayu. Website ini kami hadirkan sebagai media informasi dan komunikasi bagi seluruh civitas akademika dan masyarakat umum. Kami berkomitmen untuk mencetak generasi yang tidak hanya cerdas secara intelektual, tetapi juga memiliki akhlak yang mulia.
                        </p>
                        <a href="#" className="btn btn-outline" style={{ color: '#0F172A', borderColor: '#0F172A' }}>
                            Baca Selengkapnya
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PrincipalMessage;
