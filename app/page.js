"use client"; // Hamburger menü ve slider'ın çalışması için bu satır ŞART

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
    // --- STATE TANIMLAMALARI ---
    const [menuOpen, setMenuOpen] = useState(false); // Mobil menü açık mı?
    const [currentSlide, setCurrentSlide] = useState(0); // Hangi slayttayız?

    // --- SLIDER AYARLARI ---
    const totalSlides = 5; // Kaç resmin var?

    // Otomatik Slider Geçişi (5 saniyede bir)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 5000);
        return () => clearInterval(timer);
    }, [totalSlides]);

    return (
        <>
            {/* --- HEADER & NAVİGASYON --- */}
            <header>
                <nav>
                    <div className="logo-container">
                        {/* Logo Resmin Varsa Buraya img etiketi koyabilirsin */}
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                            LAVİNYA PERDE
                        </span>
                    </div>

                    {/* Hamburger Butonu */}
                    <div
                        className={`hamburger ${menuOpen ? 'active' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>

                    {/* Menü Linkleri */}
                    <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
                        {['anasayfa', 'hizmetler', 'galeri', 'hakkimizda', 'iletisim'].map((item) => (
                            <li key={item}>
                                <Link
                                    href={`#${item}`}
                                    onClick={() => setMenuOpen(false)} // Tıklayınca menüyü kapat
                                >
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>

            {/* --- HERO SLIDER BÖLÜMÜ --- */}
            <section className="hero" id="anasayfa">
                <div className="hero-slider">
                    {/* Slider Resimleri */}
                    {[...Array(totalSlides)].map((_, index) => (
                        <div
                            key={index}
                            className={`slide ${index === currentSlide ? 'active' : ''}`}
                        >
                            {/* Not: CSS'te .slide:nth-child(...) ile resimleri tanımladık.
                  Burada sadece div'leri oluşturuyoruz. */}
                        </div>
                    ))}
                </div>

                <div className="hero-overlay"></div>

                <div className="hero-content">
                    <h1>Evinize Zarafet Katın</h1>
                    <p>Profesyonel Perde ve Dekorasyon Çözümleri</p>
                    <Link href="#iletisim" className="cta-button">
                        Hemen İletişime Geçin
                    </Link>
                </div>
            </section>

            {/* --- HİZMETLER --- */}
            <section id="hizmetler">
                <h2 className="section-title">Hizmetlerimiz</h2>
                <div className="services-grid">
                    <div className="service-card">
                        <div className="service-icon">🏠</div>
                        <h3>Ev Tekstili</h3>
                        <p>Evinizin havasını değiştirecek modern çözümler.</p>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">✨</div>
                        <h3>Özel Tasarım</h3>
                        <p>Sizin zevkinize özel dikim perdeler.</p>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">🔧</div>
                        <h3>Montaj</h3>
                        <p>Profesyonel ekibimizle hızlı ve temiz montaj.</p>
                    </div>
                </div>
            </section>

            {/* --- GALERİ --- */}
            <section id="galeri">
                <h2 className="section-title">Galeri</h2>
                <div className="gallery-grid">
                    <div className="gallery-item"></div>
                    <div className="gallery-item"></div>
                    <div className="gallery-item"></div>
                </div>
            </section>

            {/* --- HAKKIMIZDA --- */}
            <section id="hakkimizda">
                <h2 className="section-title">Hakkımızda</h2>
                <div className="about-content">
                    <div className="about-text">
                        <h3>Biz Kimiz?</h3>
                        <p>
                            Lavinya Perde olarak yıllardır sektörde güven ve kaliteyi
                            temsil ediyoruz. Müşteri memnuniyeti odaklı çalışmamızla
                            evinize değer katıyoruz.
                        </p>
                    </div>
                    <div className="about-image">🏢</div>
                </div>
            </section>

            {/* --- İLETİŞİM --- */}
            <section id="iletisim">
                <h2 className="section-title">İletişim</h2>
                <div className="contact-grid">
                    <div className="contact-item">
                        <div className="contact-icon">📞</div>
                        <h3>Telefon</h3>
                        <p><a href="tel:+905555555555">+90 555 555 55 55</a></p>
                    </div>
                    <div className="contact-item">
                        <div className="contact-icon">📍</div>
                        <h3>Adres</h3>
                        <p>İstanbul, Türkiye</p>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer>
                <p>&copy; 2024 Lavinya Perde. Tüm hakları saklıdır.</p>
            </footer>
        </>
    );
}