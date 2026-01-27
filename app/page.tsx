"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    // Slider resimleri
    const sliderImages = [
        '/slider1.jpg',
        '/slider2.jpg',
        '/slider3.jpg',
        '/slider4.jpg',
        '/slider5.jpg',
    ];

    // Galeri resimleri
    const galleryImages = [
        { src: '/gallery/galeri1.jpg', alt: 'Rustik perde uygulaması' },
        { src: '/gallery/galeri2.jpg', alt: 'Tül ve fon perde montajı' },
        { src: '/gallery/galeri3.jpg', alt: 'Stor perde sistemi' },
        { src: '/gallery/galeri4.jpg', alt: 'Halı döşeme' },
        { src: '/gallery/galeri5.jpg', alt: 'Duvar kağıdı uygulaması' },
        { src: '/gallery/galeri6.jpg', alt: 'Kurumsal proje' },
    ];

    // Token kontrolü
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            
            if (!token) {
                setIsLoggedIn(false);
                return;
            }

            try {
                const response = await fetch('/api/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });
                
                const data = await response.json();
                setIsLoggedIn(data.valid === true);
            } catch (error) {
                setIsLoggedIn(false);
            }
        };
        checkAuth();
    }, []);

    // Slider resimlerini arka planda preload et
    useEffect(() => {
        // İlk resim zaten priority ile yükleniyor, diğerlerini sonradan yükle
        const preloadImages = () => {
            sliderImages.slice(1).forEach((src) => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = src;
                document.head.appendChild(link);
            });
        };

        // Sayfa yüklendikten 500ms sonra diğer resimleri yükle
        const timer = setTimeout(preloadImages, 500);
        return () => clearTimeout(timer);
    }, [sliderImages]);

    useEffect(() => {
        // SLIDER MANTIĞI
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

            const interval = setInterval(nextSlide, 5000);
            return () => clearInterval(interval);
        }
    }, []);

    // SMOOTH SCROLL
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
            {/* HEADER */}
            <header>
                <nav>
                    <div className="logo-container">
                        <Image
                            width={50}
                            height={50}
                            src="/logo.png"
                            alt="Lavinya Perde Logo"
                            className="logo"
                            priority
                        />
                        <span className="logo-text">LAVİNYA PERDE</span>
                    </div>

                    <div
                        className={`hamburger ${menuOpen ? 'active' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>

                    <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
                        <li><a href="#anasayfa">Ana Sayfa</a></li>
                        <li><a href="#hizmetler">Hizmetlerimiz</a></li>
                        <li><a href="#galeri">Galeri</a></li>
                        <li><a href="#hakkimizda">Hakkımızda</a></li>
                        <li><a href="#iletisim">İletişim</a></li>
                        {isLoggedIn && <li><a href="/perde-hesaplama">Hesaplama</a></li>}
                    </ul>
                </nav>
            </header>

            {/* HERO SLIDER - TAM EKRAN */}
            <section id="anasayfa" className="hero">
                <div className="hero-slider">
                    {sliderImages.map((src, index) => (
                        <div key={index} className="slide">
                            <Image
                                src={src}
                                alt={`Slider ${index + 1}`}
                                fill
                                priority={index === 0}
                                loading={index === 0 ? "eager" : "lazy"}
                                placeholder="blur"
                                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxYTFhMWEiLz48L3N2Zz4="
                                style={{ objectFit: 'cover' }}
                                sizes="100vw"
                            />
                        </div>
                    ))}
                </div>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">Evinize Zarafet Katın</h1>
                    <p className="hero-subtitle">Profesyonel Perde ve Dekorasyon Çözümleri</p>
                    <a href="#iletisim" className="cta-button">
                        <span>Hemen İletişime Geçin</span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </a>
                </div>
                <div className="scroll-indicator"></div>
            </section>

            {/* HİZMETLER */}
            <section id="hizmetler">
                <div className="section-header">
                    <h2 className="section-title">Hizmetlerimiz</h2>
                    <p className="section-subtitle">Kaliteli ürünler ve profesyonel hizmet anlayışı ile yanınızdayız</p>
                </div>
                <div className="services-grid">
                    <div className="service-card">
                        <div className="service-icon">🪟</div>
                        <h3>Fon Perde</h3>
                        <p>Kaliteli kumaşlar ve özel dikim ile evinize uygun fon perdeler</p>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">✨</div>
                        <h3>Tül Perde</h3>
                        <p>Işık geçiren zarif tül perdelerle mekanlarınıza ferahlık</p>
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
                        <p>Modern desenler ve renklerle duvarlarınıza yeni soluk</p>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">🔧</div>
                        <h3>Montaj Hizmeti</h3>
                        <p>Profesyonel ölçüm ve montaj hizmeti</p>
                    </div>
                </div>
            </section>

            {/* GALERİ */}
            <section id="galeri">
                <div className="section-header">
                    <h2 className="section-title">Çalışmalarımız</h2>
                    <p className="section-subtitle">Gerçekleştirdiğimiz projelerden örnekler</p>
                </div>
                <div className="gallery-grid">
                    {galleryImages.map((image, index) => (
                        <div key={index} className="gallery-item">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="gallery-overlay">
                                <p>{image.alt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* HAKKIMIZDA */}
            <section id="hakkimizda">
                <div className="about-container">
                    <div className="about-content">
                        <h2 className="section-title">Hakkımızda</h2>
                        <h3>Lavinya Perde</h3>
                        <p>Yıllardır perde ve dekorasyon sektöründe hizmet veren Lavinya Perde, kaliteli ürünler ve güler yüzlü hizmet anlayışıyla müşterilerine en iyi çözümleri sunmaktadır.</p>
                        <p>Geniş kumaş seçeneklerimiz, profesyonel ekibimiz ve müşteri memnuniyeti odaklı yaklaşımımızla evinize değer katıyoruz.</p>
                        <ul className="about-features">
                            <li>✓ 10+ Yıllık Deneyim</li>
                            <li>✓ Profesyonel Ekip</li>
                            <li>✓ Kaliteli Ürünler</li>
                            <li>✓ Müşteri Memnuniyeti</li>
                        </ul>
                    </div>
                    <div className="about-image">
                        <div className="about-image-placeholder">🏠</div>
                    </div>
                </div>
            </section>

            {/* İLETİŞİM */}
            <section id="iletisim">
                <div className="section-header">
                    <h2 className="section-title">İletişim</h2>
                    <p className="section-subtitle">Bizimle iletişime geçin</p>
                </div>
                <div className="contact-grid">
                    <div className="contact-card">
                        <div className="contact-icon">📱</div>
                        <h3>Telefon</h3>
                        <a href="tel:+905055102287">+90 505 510 22 87</a>
                    </div>
                    <div className="contact-card">
                        <div className="contact-icon">📧</div>
                        <h3>E-posta</h3>
                        <a href="mailto:info@lavinyaperde.com">info@lavinyaperde.com</a>
                    </div>
                    <div className="contact-card">
                        <div className="contact-icon">📍</div>
                        <h3>Adres</h3>
                        <p>Balıkesir, Türkiye</p>
                    </div>
                    <div className="contact-card">
                        <div className="contact-icon">🕐</div>
                        <h3>Çalışma Saatleri</h3>
                        <p>Pzt-Cmt: 09:00 - 18:00<br/>Pazar: Kapalı</p>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer>
                <div className="footer-content">
                    <p>&copy; 2026 Lavinya Perde. Tüm hakları saklıdır.</p>
                </div>
            </footer>
        </>
    );
}