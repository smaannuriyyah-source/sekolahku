import React from 'react';
import { Quote } from 'lucide-react';
// Importing images
import imgFounder from '../assets/images/5.webp'; // Using a placeholder image from assets
import RevealOnScroll from './RevealOnScroll';

const FounderHistory = () => {
    return (
        <section className="section" style={{ backgroundColor: '#ffffff' }}>
            <div className="container">
                <RevealOnScroll>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '60px',
                        alignItems: 'center'
                    }}>

                        {/* Left: Image/Card */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '100%',
                                height: '450px',
                                backgroundColor: '#f1f5f9',
                                borderRadius: '2px', // Square/Sharp corners as per reference style
                                overflow: 'hidden',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                            }}>
                                {/* Note: In a real scenario, this would be the founder's photo from the brochure. 
                      Using a generic asset or placeholder here as instructed. */}
                                <img
                                    src="https://ui-avatars.com/api/?name=Abu+Nur+Jazuli&background=111827&color=fff&size=500" // Placeholder fallback
                                    // src={imgFounder} // Uncomment if 5.webp is the founder
                                    alt="KH. Abu Nur Jazuli Nahrawi Amaith"
                                    loading="lazy"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

                            {/* Name Card */}
                            <div style={{
                                position: 'absolute',
                                bottom: '-30px',
                                right: '20px',
                                backgroundColor: '#B45309', // Darker Gold/Bronze
                                padding: '25px',
                                color: '#ffffff',
                                maxWidth: '300px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
                            }}>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>
                                    KH. Abu Nur Jazuli Nahrawi Amaith
                                </h3>
                                <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '0.9rem', fontStyle: 'italic' }}>
                                    Al-Hafidz Al-Maghfurlah - Pendiri Yayasan
                                </p>
                            </div>
                        </div>

                        {/* Right: History Text */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                <Quote size={40} color="#F59E0B" style={{ opacity: 0.5 }} />
                                <h2 className="section-title" style={{ textAlign: 'left', margin: 0 }}>Sejarah Pendiri</h2>
                            </div>

                            <p style={{ fontSize: '1.1rem', color: '#111827', fontWeight: '500', marginBottom: '20px' }}>
                                "Perjalanan panjang dari majelis taklim hingga menjadi lembaga pendidikan formal yang diakui."
                            </p>

                            <div style={{ color: '#4B5563', lineHeight: '1.8' }}>
                                <p style={{ marginBottom: '20px' }}>
                                    Pesantren An-Nuriyyah memiliki sejarah perkembangan yang panjang, berawal dari rintisan majelis taklim dan tahfiz Al-Qur’an oleh <strong>KH. Abu Nur Jazuli Amaith Al-Hafidz</strong> sejak tahun 1940-an.
                                </p>
                                <p style={{ marginBottom: '20px' }}>
                                    Hingga akhirnya diakui secara resmi pada <strong>1 April 1974</strong>. Kemudian pesantren ini secara bertahap memperluas cakupan pendidikannya dengan mendirikan SMP An-Nuriyyah (1978) dan <strong>SMA An-Nuriyyah (1982)</strong>.
                                </p>
                                <p>
                                    Hal ini dilakukan sebagai upaya untuk memberikan bekal ilmu dan keterampilan Al-Qur’an serta pendidikan umum yang lebih komprehensif dan berkelanjutan bagi para santri.
                                </p>
                            </div>

                            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #E5E7EB' }}>
                                <p style={{ fontStyle: 'italic', color: '#6B7280' }}>Legacy yang terus hidup dalam setiap generasi Ulil Albab.</p>
                            </div>
                        </div>

                    </div>
                </RevealOnScroll>
            </div>
        </section>
    );
};

export default FounderHistory;
