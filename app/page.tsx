"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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
    const [sliderImages, setSliderImages] = useState<string[]>([
        '/slider1.jpg',
        '/slider2.jpg',
        '/slider3.jpg',
        '/slider4.jpg',
        '/slider5.jpg',
    ]);
    const [cardBgImages, setCardBgImages] = useState<string[]>([]);

    // Slider ve hizmet kartı görsellerini yükle
    useEffect(() => {
        const loadImages = async () => {
            try {
                // Tüm Vercel Blob görsellerini topla
                const allImages: string[] = [];
                const allFolders = ['slider', 'gallery', ...serviceCards.map(s => s.folder)];
                const uniqueFolders = [...new Set(allFolders)];

                await Promise.all(uniqueFolders.map(async (folder) => {
                    try {
                        const response = await fetch(`/api/images?service=${folder}`);
                        if (response.ok) {
                            const data = await response.json();
                            if (data.images && data.images.length > 0) {
                                const paths = data.images.map((img: { path: string }) => img.path);
                                if (folder === 'slider') {
                                    setSliderImages(paths);
                                }
                                allImages.push(...paths);
                            }
                        }
                    } catch {
                        // Sessizce devam et
                    }
                }));

                // Tüm görselleri karıştırıp her kart için bir tane ata
                if (allImages.length > 0) {
                    const shuffled = allImages.sort(() => Math.random() - 0.5);
                    const assigned = serviceCards.map((_, i) => shuffled[i % shuffled.length]);
                    setCardBgImages(assigned);
                }
            } catch (error) {
                console.error('Error loading images:', error);
            }
        };

        loadImages();
    }, []);

    // Slider geçişi
    const goToSlide = (index: number) => {
        const slides = document.querySelectorAll('.slide') as NodeListOf<HTMLElement>;
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        const newIndex = (currentSlide + 1) % sliderImages.length;
        goToSlide(newIndex);
    };

    const prevSlide = () => {
        const newIndex = currentSlide === 0 ? sliderImages.length - 1 : currentSlide - 1;
        goToSlide(newIndex);
    };

    useEffect(() => {
        // İlk slide'ı aktif yap
        const slides = document.querySelectorAll('.slide') as NodeListOf<HTMLElement>;
        if (slides.length > 0 && slides[0]) {
            slides[0].classList.add('active');
        }

        const heroSection = document.querySelector('.hero') as HTMLElement;
        let interval: NodeJS.Timeout | null = null;

        // Intersection Observer - Slider görünür değilken durdur
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Görünür olduğunda interval'ı başlat
                        if (!interval) {
                            interval = setInterval(() => {
                                setCurrentSlide(prev => {
                                    const newIndex = (prev + 1) % sliderImages.length;
                                    const slides = document.querySelectorAll('.slide') as NodeListOf<HTMLElement>;
                                    slides.forEach((slide, i) => {
                                        slide.classList.toggle('active', i === newIndex);
                                    });
                                    return newIndex;
                                });
                            }, 8000);
                        }
                    } else {
                        // Görünür değilse interval'ı durdur
                        if (interval) {
                            clearInterval(interval);
                            interval = null;
                        }
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (heroSection) {
            observer.observe(heroSection);
        }

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

    return (
        <>
            {/* HERO SLIDER - TAM EKRAN */}
            <section id="anasayfa" className="hero">
                <div className="hero-slider">
                    {sliderImages.map((src, index) => (
                        <div key={index} className="slide">
                            <Image
                                src={src}
                                alt={`Slider ${index + 1}`}
                                fill
                                priority={index < 2}
                                loading={index < 2 ? "eager" : "lazy"}
                                quality={50}
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
                    <a href="/iletisim" className="cta-button">
                        <span>Hemen İletişime Geçin</span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </a>
                </div>
                <button className="slider-btn slider-btn-prev" onClick={prevSlide} aria-label="Önceki Slide">
                    ‹
                </button>
                <button className="slider-btn slider-btn-next" onClick={nextSlide} aria-label="Sonraki Slide">
                    ›
                </button>
                <div className="scroll-indicator"></div>
            </section>

            {/* HİZMETLER */}
            <section id="hizmetler">
                <div className="section-header">
                    <h2 className="section-title">Hizmetlerimiz</h2>
                    <p className="section-subtitle">Kaliteli ürünler ve profesyonel hizmet anlayışı ile yanınızdayız</p>
                </div>
                <div className="services-grid">
                    {serviceCards.map((service, index) => (
                        <a key={index} href={service.href} className="service-card">
                            {cardBgImages[index] && (
                                <>
                                    <Image
                                        src={cardBgImages[index]}
                                        alt=""
                                        fill
                                        quality={30}
                                        loading="lazy"
                                        style={{ objectFit: 'cover' }}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="service-card-bg"
                                    />
                                    <div className="service-card-overlay"></div>
                                </>
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

        </>
    );
}