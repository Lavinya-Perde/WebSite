"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

const serviceCards = [
    { href: "/fon-perde", icon: "🪟", title: "Fon Perde", desc: "Kaliteli kumaşlar ve özel dikim ile evinize uygun fon perdeler", folder: "fon-perde" },
    { href: "/tul-perde", icon: "✨", title: "Tül Perde", desc: "Işık geçiren zarif tül perdelerle mekanlarınıza ferahlık", folder: "tul-perde" },
    { href: "/stor-perde", icon: "🔲", title: "Stor ve Jaluzi", desc: "Modern ve pratik stor ve jaluzi sistemleri", folder: "stor-perde" },
    { href: "/hali", icon: "🏠", title: "Halı", desc: "Kaliteli ve şık halı modelleri ile mekanlarınıza sıcaklık", folder: "hali" },
    { href: "/duvar-kagidi", icon: "🎨", title: "Duvar Kağıdı", desc: "Modern desenler ve renklerle duvarlarınıza yeni soluk", folder: "duvar-kagidi" },
    { href: "/montaj-hizmeti", icon: "🔧", title: "Montaj Hizmeti", desc: "Profesyonel ölçüm ve montaj hizmeti", folder: "montaj" },
];

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [prevSlide, setPrevSlide] = useState<number>(-1);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [isAnimating, setIsAnimating] = useState(false);
    const [sliderImages, setSliderImages] = useState<string[]>([
        '/slider1.jpg',
        '/slider2.jpg',
        '/slider3.jpg',
        '/slider4.jpg',
        '/slider5.jpg',
    ]);
    const [serviceBgImages, setServiceBgImages] = useState<Record<string, string>>({});

    // Slider ve hizmet kartı görsellerini yükle
    useEffect(() => {
        const loadImages = async () => {
            try {
                const folderImages: Record<string, string[]> = {};
                const allFolders = ['slider', 'gallery', ...serviceCards.map(s => s.folder)];
                const uniqueFolders = [...new Set(allFolders)];

                await Promise.all(uniqueFolders.map(async (folder) => {
                    try {
                        const response = await fetch(`/api/images?service=${folder}`);
                        if (response.ok) {
                            const data = await response.json();
                            if (data.images && data.images.length > 0) {
                                const paths = data.images.map((img: { path: string }) => img.path);
                                folderImages[folder] = paths;
                                if (folder === 'slider') {
                                    setSliderImages(paths);
                                }
                            }
                        }
                    } catch { /* sessizce devam */ }
                }));

                const allImages = Object.values(folderImages).flat();
                const bgImages: Record<string, string> = {};
                serviceCards.forEach((card) => {
                    const own = folderImages[card.folder];
                    if (own && own.length > 0) {
                        bgImages[card.folder] = own[Math.floor(Math.random() * own.length)];
                    } else if (allImages.length > 0) {
                        bgImages[card.folder] = allImages[Math.floor(Math.random() * allImages.length)];
                    }
                });
                setServiceBgImages(bgImages);
            } catch (error) {
                console.error('Error loading images:', error);
            }
        };
        loadImages();
    }, []);

    // Slide değiştir
    const changeSlide = (newIndex: number, dir: 'next' | 'prev') => {
        if (isAnimating || newIndex === currentSlide) return;
        setPrevSlide(currentSlide);
        setDirection(dir);
        setIsAnimating(true);
        setCurrentSlide(newIndex);
        setTimeout(() => {
            setPrevSlide(-1);
            setIsAnimating(false);
        }, 1200);
    };

    const nextSlide = () => {
        const newIndex = (currentSlide + 1) % sliderImages.length;
        changeSlide(newIndex, 'next');
    };

    const prevSlideHandler = () => {
        const newIndex = currentSlide === 0 ? sliderImages.length - 1 : currentSlide - 1;
        changeSlide(newIndex, 'prev');
    };

    // Otomatik geçiş
    useEffect(() => {
        const heroSection = document.querySelector('.hero') as HTMLElement;
        let interval: NodeJS.Timeout | null = null;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (!interval) {
                            interval = setInterval(() => {
                                setCurrentSlide(prev => {
                                    const newIndex = (prev + 1) % sliderImages.length;
                                    setPrevSlide(prev);
                                    setDirection('next');
                                    setIsAnimating(true);
                                    setTimeout(() => {
                                        setPrevSlide(-1);
                                        setIsAnimating(false);
                                    }, 1200);
                                    return newIndex;
                                });
                            }, 8000);
                        }
                    } else {
                        if (interval) { clearInterval(interval); interval = null; }
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (heroSection) observer.observe(heroSection);

        return () => {
            if (interval) clearInterval(interval);
            if (heroSection) observer.unobserve(heroSection);
        };
    }, [sliderImages.length]);

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

    // SCROLL-REVEAL ANİMASYONLARI
    useEffect(() => {
        const revealElements = document.querySelectorAll('.reveal');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target); // Bir kez tetikle
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
        );

        revealElements.forEach(el => observer.observe(el));

        return () => {
            revealElements.forEach(el => observer.unobserve(el));
        };
    }, []);

    return (
        <>
            {/* HERO SLIDER — perdecimustafa.com 3 katmanlı efekt */}
            <section id="anasayfa" className="hero">
                {/* Keyframe'ler direkt burada — Next.js CSS optimizasyonundan etkilenmez */}
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes slideLeaveUp   { from{transform:translateY(0)}      to{transform:translateY(-100%)} }
                    @keyframes slideLeaveDown { from{transform:translateY(0)}      to{transform:translateY(100%)}  }
                    @keyframes slideEnterUp   { from{transform:translateY(100%)}   to{transform:translateY(0)}     }
                    @keyframes slideEnterDown { from{transform:translateY(-100%)}  to{transform:translateY(0)}     }
                    @keyframes containerZoomIn  { from{transform:scale(0.5)} to{transform:scale(1.0)} }
                    @keyframes containerZoomOut { from{transform:scale(1.0)} to{transform:scale(0.5)} }
                    @keyframes imgCounterZoomIn  { from{transform:scale(1.25)} to{transform:scale(1.0)}  }
                    @keyframes imgCounterZoomOut { from{transform:scale(1.0)}  to{transform:scale(1.25)} }
                `}} />
                <div className="hero-slider">
                    {sliderImages.map((src, index) => {
                        const isCurrent = index === currentSlide;
                        const isPrev    = index === prevSlide;
                        if (!isCurrent && !isPrev) return null;

                        /* role değiştiğinde key değişir → React tamamen remount eder → animasyon yeniden başlar */
                        const role = isCurrent && isAnimating ? 'entering'
                                   : isCurrent              ? 'idle'
                                   : isPrev && isAnimating  ? 'leaving'
                                   :                          'hidden';
                        const uniqueKey = `${src}-${role}`;

                        const dur = '1.4s cubic-bezier(0.77,0,0.175,1) forwards';

                        /* KAT 1: Dış sarmalayıcı — dikey translateY */
                        const wrapStyle: React.CSSProperties = {
                            position: 'absolute', top: 0, left: 0,
                            width: '100%', height: '100%',
                            overflow: 'hidden',
                            zIndex: isCurrent ? 2 : 1,
                            willChange: 'transform',
                            animation: role === 'entering'
                                ? (direction === 'next' ? `slideEnterUp ${dur}` : `slideEnterDown ${dur}`)
                                : role === 'leaving'
                                ? (direction === 'next' ? `slideLeaveUp ${dur}` : `slideLeaveDown ${dur}`)
                                : 'none',
                        };

                        /* KAT 2: Orta konteyner — dramatik scale(0.5 ↔ 1.0) */
                        const containerStyle: React.CSSProperties = {
                            width: '100%', height: '100%',
                            willChange: 'transform',
                            transformOrigin: 'center center',
                            animation: role === 'entering'
                                ? `containerZoomIn ${dur}`
                                : role === 'leaving'
                                ? `containerZoomOut ${dur}`
                                : 'none',
                        };

                        /* KAT 3: İç görsel — counter-scale (1.25 ↔ 1.0) */
                        const imgWrapStyle: React.CSSProperties = {
                            position: 'relative',
                            width: '100%', height: '100%',
                            overflow: 'hidden',
                            willChange: 'transform',
                            transformOrigin: 'center center',
                            animation: role === 'entering'
                                ? `imgCounterZoomIn ${dur}`
                                : role === 'leaving'
                                ? `imgCounterZoomOut ${dur}`
                                : 'none',
                        };

                        return (
                            <div key={uniqueKey} style={wrapStyle}>
                                <div style={containerStyle}>
                                    <div style={imgWrapStyle}>
                                        <Image
                                            src={src}
                                            alt={`Slider ${index + 1}`}
                                            fill
                                            priority={index < 2}
                                            loading={index < 2 ? 'eager' : 'lazy'}
                                            quality={70}
                                            placeholder="blur"
                                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxYTFhMWEiLz48L3N2Zz4="
                                            style={{ objectFit: 'cover' }}
                                            sizes="100vw"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>


                <div className="hero-overlay" />
                <div className="hero-content">
                    <h1 className="hero-title">Evinize Zarafet Katın</h1>
                    <p className="hero-subtitle">Profesyonel Perde ve Dekorasyon Çözümleri</p>
                    <a href="/iletisim" className="cta-button">
                        <span>Hemen İletişime Geçin</span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </div>

                <button className="slider-btn slider-btn-prev" onClick={prevSlideHandler} aria-label="Önceki Slide">&#8249;</button>
                <button className="slider-btn slider-btn-next" onClick={nextSlide} aria-label="Sonraki Slide">&#8250;</button>

                {/* Nokta göstergeleri */}
                <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 4, display: 'flex', gap: 8 }}>
                    {sliderImages.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => changeSlide(i, i > currentSlide ? 'next' : 'prev')}
                            style={{
                                width: i === currentSlide ? 28 : 10,
                                height: 10,
                                borderRadius: 5,
                                background: i === currentSlide ? '#b89dd4' : 'rgba(255,255,255,0.4)',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.4s ease',
                                padding: 0,
                            }}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>

                <div className="scroll-indicator" />
            </section>

            {/* HİZMETLER */}
            <section id="hizmetler">
                <div className="section-header reveal reveal-up">
                    <h2 className="section-title">Hizmetlerimiz</h2>
                    <p className="section-subtitle">Kaliteli ürünler ve profesyonel hizmet anlayışı ile yanınızdayız</p>
                </div>
                <div className="services-grid">
                    {serviceCards.map((service, index) => (
                        <a
                            key={index}
                            href={service.href}
                            className={`service-card reveal ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'} reveal-delay-${(index % 3) + 1}`}
                        >
                            {serviceBgImages[service.folder] && (
                                <img
                                    src={serviceBgImages[service.folder]}
                                    alt=""
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        opacity: 1,
                                        zIndex: 0,
                                        pointerEvents: 'none',
                                        transition: 'transform 0.55s ease',
                                    }}
                                />
                            )}
                            <div className="service-icon">{service.icon}</div>
                            <h3>{service.title}</h3>
                            <p>{service.desc}</p>
                        </a>
                    ))}
                </div>
            </section>

            {/* HAKKIMIZDA */}
            <section id="hakkimizda">
                <div className="about-container">
                    <div className="about-content reveal reveal-left">
                        <h2 className="section-title">Hakkımızda</h2>
                        <h3>Lavinya Perde</h3>
                        <p>Yıllardır perde ve dekorasyon sektöründe hizmet veren Lavinya Perde, kaliteli ürünler ve güler yüzlü hizmet anlayışıyla müşterilerine en iyi çözümleri sunmaktadır.</p>
                        <p>Geniş kumaş seçeneklerimiz, profesyonel ekibimiz ve müşteri memnuniyeti odaklı yaklaşımımızla evinize değer katıyoruz.</p>
                        <ul className="about-features">
                            <li className="reveal reveal-left reveal-delay-2">✓ 10+ Yıllık Deneyim</li>
                            <li className="reveal reveal-left reveal-delay-3">✓ Profesyonel Ekip</li>
                            <li className="reveal reveal-left reveal-delay-4">✓ Kaliteli Ürünler</li>
                            <li className="reveal reveal-left reveal-delay-5">✓ Müşteri Memnuniyeti</li>
                        </ul>
                    </div>
                    <div className="about-image reveal reveal-right">
                        <div className="about-image-placeholder">🏠</div>
                    </div>
                </div>
            </section>

        </>
    );
}