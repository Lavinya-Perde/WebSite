"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    // Galeri resimleri
    const galleryImages = [
        { src: '/gallery/galeri1.jpg', alt: 'Rustik perde uygulaması' },
        { src: '/gallery/galeri2.jpg', alt: 'Tül perde montajı' },
        { src: '/gallery/galeri3.jpg', alt: 'Stor perde sistemi' },
        { src: '/gallery/galeri4.jpg', alt: 'Halı döşeme' },
        { src: '/gallery/galeri5.jpg', alt: 'Duvar kağıdı uygulaması' },
        { src: '/gallery/galeri6.jpg', alt: 'Kurumsal proje' },
    ];

    // ✅ Token kontrolü - Sayfa yüklendiğinde
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await fetch('/api/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token })
                    });
                    const data = await response.json();
                    setIsLoggedIn(data.valid);
                } catch (error) {
                    setIsLoggedIn(false);
                }
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        // --- SLIDER MANTIĞI ---
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide') as NodeListOf<HTMLElement>;
        const totalSlides = slides.length;

        if (totalSlides > 0) {
            if (slides[0]) {
                slides[0].classList.add('active');
            }

            const nextSlide = () => {
                slides[currentSlide]?.classList.remove('active');
                currentSlide = (currentSlide + 1) % totalSlides;
                slides[currentSlide]?.classList.add('active');
            };

            const interval = setInterval(nextSlide, 4000);
            return () => clearInterval(interval);
        }
    }, []);

    // --- SMOOTH SCROLL MANTIĞI ---
    useEffect(() => {
        const anchors = document.querySelectorAll('a[href^="#"]');

        const handleScroll = (e: Event) => {
            e.preventDefault();

            const anchor = e.currentTarget as HTMLAnchorElement;
            const href = anchor.getAttribute('href');

            if (href) {
                const target = document.querySelector(href);
                if (target) {
                    setMenuOpen(false);
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        };

        anchors.forEach(anchor => {
            anchor.addEventListener('click', handleScroll);
        });

        return () => {
            anchors.forEach(anchor => {
                anchor.removeEventListener('click', handleScroll);
            });
        };
    }, []);

    return (
        <>
            <header>
                <nav>
                    <div className="logo-container">
                        <Image
                            width={60}
                            height={60}
                            src="/logo.png"
                            alt="Lavinya Perde Logo"
                            className="logo"
                            priority
                        />
                        <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>LAVİNYA PERDE</span>
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
                        <li><a href="#anasayfa">Ana Sayfa</a></li>
                        <li><a href="#hizmetler">Hizmetler</a></li>
                        <li><a href="#galeri">Galeri</a></li>
                        <li><a href="#hakkimizda">Hakkımızda</a></li>
                        <li><a href="#iletisim">İletişim</a></li>
                        {/* ✅ Sadece giriş yapılmışsa göster */}
                        {isLoggedIn && <li><a href="/perde-hesaplama">Hesaplama</a></li>}
                    </ul>
                </nav>
            </header>

            {/* ... Geri kalan kodlar aynı ... */}
            <section id="anasayfa" className="hero">
                <div className="hero-slider">
                    <div className="slide active"></div>
                    <div className="slide"></div>
                    <div className="slide"></div>
                    <div className="slide"></div>
                    <div className="slide"></div>
                </div>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>Evinize Zarafet Katın</h1>
                    <p>Profesyonel Perde ve Dekorasyon Çözümleri</p>
                    <a href="#iletisim" className="cta-button">Hemen İletişime Geçin</a>
                </div>
            </section>

            <section id="hizmetler">
                <h2 className="section-title">Hizmetlerimiz</h2>
                <div className="services-grid">
                    <div className="service-card">
                        <div className="service-icon">🪟</div>
                        <h3>Fon Perde</h3>
                        <p>Kaliteli kumaşlar ve özel dikim ile evinize uygun fon perdeler</p>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">✨</div>
                        <h3>Tül Perde</h3>
                        <p>Işık geçiren zarif tül perdelerle mekanlarınıza ferahlık katın</p>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">🔲</div>
                        <h3>Stor Perde</h3>
                        <p>Modern ve pratik stor perde sistemleri</p>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">🏠</div>
                        <h3>Halı</h3>
                        <p>Kaliteli ve şık halı modelleri ile mekanlarınıza sıcaklık</p>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">🎨</div>
                        <h3>Duvar Kağıdı</h3>
                        <p>Modern desenler ve renklerle duvarlarınıza yeni bir soluk</p>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">🔧</div>
                        <h3>Montaj Hizmeti</h3>
                        <p>Profesyonel ölçüm ve montaj hizmeti</p>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">💼</div>
                        <h3>Kurumsal Çözümler</h3>
                        <p>Otel, ofis ve toplu konutlar için özel projeler</p>
                    </div>
                </div>
            </section>

            <section id="galeri">
                <h2 className="section-title">Referans Çalışmalarımız</h2>
                <div className="gallery-grid">
                    {galleryImages.map((image, index) => (
                        <div key={index} className="gallery-item" data-title={image.alt}>
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    ))}
                </div>
            </section>

            <section id="hakkimizda">
                <h2 className="section-title">Hakkımızda</h2>
                <div className="about-content">
                    <div className="about-text">
                        <h3>Lavinya Perde</h3>
                        <p>Yıllardır perde ve dekorasyon sektöründe hizmet veren Lavinya Perde, kaliteli ürünler ve güler yüzlü
                            hizmet anlayışıyla müşterilerine en iyi çözümleri sunmaktadır.</p>
                        <p>Geniş kumaş seçeneklerimiz, profesyonel ekibimiz ve müşteri memnuniyeti odaklı yaklaşımımızla evinize
                            değer katıyoruz.</p>
                        <p>Her projede özenle çalışıyor, detaylara dikkat ediyor ve mekanlarınızı hayalinizdeki gibi
                            tasarlıyoruz.</p>
                    </div>
                    <div className="about-image">🏠</div>
                </div>
            </section>

            <section id="iletisim">
                <h2 className="section-title">İletişim</h2>
                <div className="contact-grid">
                    <div className="contact-item">
                        <div className="contact-icon">📱</div>
                        <h3>Telefon</h3>
                        <p><a href="tel:+905055102287">+90 505 510 22 87</a></p>
                    </div>
                    <div className="contact-item">
                        <div className="contact-icon">📧</div>
                        <h3>E-posta</h3>
                        <p><a href="mailto:info@lavinyaperde.com">info@lavinyaperde.com</a></p>
                    </div>
                    <div className="contact-item">
                        <div className="contact-icon">📍</div>
                        <h3>Adres</h3>
                        <p>Balıkesir, Türkiye</p>
                    </div>
                    <div className="contact-item">
                        <div className="contact-icon">🕐</div>
                        <h3>Çalışma Saatleri</h3>
                        <p>Pzt-Cmt: 09:00 - 18:00<br />Pazar: Kapalı</p>
                    </div>
                </div>
            </section>

            <footer>
                <p>&copy; 2026 Lavinya Perde. Tüm hakları saklıdır.</p>
            </footer>
        </>
    );
}