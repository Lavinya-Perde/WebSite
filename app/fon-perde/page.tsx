"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";

export default function FonPerdePage() {
    const [images, setImages] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Her sayfada yüklenecek görsel sayısı
    const IMAGES_PER_PAGE = 12;

    // Toplam görsel havuzu (bunları public klasörüne yükleyeceksiniz)
    const allImages = [
        '/services/fon-perde/fon1.jpg',
        '/services/fon-perde/fon2.jpg',
        '/services/fon-perde/fon3.jpg',
        '/services/fon-perde/fon4.jpg',
        '/services/fon-perde/fon5.jpg',
        '/services/fon-perde/fon6.jpg',
        '/services/fon-perde/fon7.jpg',
        '/services/fon-perde/fon8.jpg',
        '/services/fon-perde/fon9.jpg',
        '/services/fon-perde/fon10.jpg',
        '/services/fon-perde/fon11.jpg',
        '/services/fon-perde/fon12.jpg',
        '/services/fon-perde/fon13.jpg',
        '/services/fon-perde/fon14.jpg',
        '/services/fon-perde/fon15.jpg',
        '/services/fon-perde/fon16.jpg',
        '/services/fon-perde/fon17.jpg',
        '/services/fon-perde/fon18.jpg',
        '/services/fon-perde/fon19.jpg',
        '/services/fon-perde/fon20.jpg',
        // Daha fazla görsel ekleyebilirsiniz
    ];

    // İlk yükleme
    useEffect(() => {
        loadMoreImages();
    }, []);

    // Sonsuz scroll için Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && hasMore && !loading) {
                    loadMoreImages();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, loading, page]);

    const loadMoreImages = useCallback(() => {
        if (loading || !hasMore) return;

        setLoading(true);

        // Simüle edilmiş yükleme gecikmesi (gerçek API'de bu olmayacak)
        setTimeout(() => {
            const startIndex = (page - 1) * IMAGES_PER_PAGE;
            const endIndex = startIndex + IMAGES_PER_PAGE;
            const newImages = allImages.slice(startIndex, endIndex);

            if (newImages.length > 0) {
                setImages(prev => [...prev, ...newImages]);
                setPage(prev => prev + 1);
            }

            if (endIndex >= allImages.length) {
                setHasMore(false);
            }

            setLoading(false);
        }, 500);
    }, [page, loading, hasMore]);

    return (
        <div className="service-page">
            {/* Header */}
            <header className="service-header">
                <nav className="service-nav">
                    <Link href="/#hizmetler" className="back-button">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Geri Dön
                    </Link>
                    <h1>Fon Perde</h1>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="service-hero">
                <div className="service-hero-content">
                    <h2>Fon Perde Koleksiyonumuz</h2>
                    <p>Kaliteli kumaşlar ve özel dikim ile evinize uygun fon perdeler. Geniş renk ve desen seçenekleriyle mekanlarınıza zarafet katın.</p>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="service-gallery">
                <div className="gallery-container">
                    {images.map((image, index) => (
                        <div key={`${image}-${index}`} className="service-gallery-item">
                            <Image
                                src={image}
                                alt={`Fon Perde ${index + 1}`}
                                fill
                                quality={75}
                                loading="lazy"
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    ))}
                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div className="loading-indicator">
                        <div className="spinner"></div>
                        <p>Yükleniyor...</p>
                    </div>
                )}

                {/* Observer Target */}
                <div ref={observerTarget} className="observer-target"></div>

                {/* End Message */}
                {!hasMore && images.length > 0 && (
                    <div className="end-message">
                        <p>Tüm görseller yüklendi</p>
                    </div>
                )}
            </section>

            {/* Contact CTA */}
            <section className="service-cta">
                <div className="service-cta-content">
                    <h3>Fon Perde İçin Teklif Alın</h3>
                    <p>Profesyonel ekibimiz size en uygun çözümü sunmak için hazır</p>
                    <Link href="/#iletisim" className="cta-button">
                        İletişime Geçin
                    </Link>
                </div>
            </section>

            <style jsx>{`
                .service-page {
                    min-height: 100vh;
                    background: #0a0a0a;
                }

                .service-header {
                    background: rgba(10, 10, 10, 0.95);
                    backdrop-filter: blur(10px);
                    box-shadow: 0 2px 20px rgba(139, 102, 158, 0.3);
                    border-bottom: 1px solid rgba(139, 102, 158, 0.2);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .service-nav {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 1rem 2rem;
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }

                .back-button {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #b89dd4;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.3s;
                }

                .back-button:hover {
                    color: #8b669e;
                    gap: 0.3rem;
                }

                .service-nav h1 {
                    font-size: 1.5rem;
                    color: #ffffff;
                    margin: 0;
                }

                .service-hero {
                    background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
                    color: white;
                    padding: 4rem 2rem;
                    text-align: center;
                    border-bottom: 1px solid rgba(139, 102, 158, 0.2);
                }

                .service-hero-content {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .service-hero h2 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }

                .service-hero p {
                    font-size: 1.1rem;
                    line-height: 1.6;
                    opacity: 0.95;
                }

                .service-gallery {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 3rem 2rem;
                }

                .gallery-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .service-gallery-item {
                    position: relative;
                    width: 100%;
                    padding-bottom: 100%;
                    background: #1a1a1a;
                    border-radius: 20px;
                    overflow: hidden;
                    border: 1px solid rgba(139, 102, 158, 0.2);
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
                    transition: transform 0.4s, box-shadow 0.4s, border-color 0.4s;
                }

                .service-gallery-item:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 10px 30px rgba(139, 102, 158, 0.4);
                    border-color: #8b669e;
                }

                .loading-indicator {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    padding: 2rem;
                    color: #b0b0b0;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #8b669e;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .observer-target {
                    height: 20px;
                }

                .end-message {
                    text-align: center;
                    padding: 2rem;
                    color: #b0b0b0;
                    font-size: 1.1rem;
                }

                .service-cta {
                    background: #1a1a1a;
                    color: white;
                    padding: 4rem 2rem;
                    text-align: center;
                    border-top: 1px solid rgba(139, 102, 158, 0.2);
                }

                .service-cta-content {
                    max-width: 600px;
                    margin: 0 auto;
                }

                .service-cta h3 {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                    color: #b89dd4;
                }

                .service-cta p {
                    font-size: 1.1rem;
                    margin-bottom: 2rem;
                    opacity: 0.9;
                    color: #b0b0b0;
                }

                .cta-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #8b669e 0%, #6d5380 100%);
                    color: white;
                    padding: 1rem 2.5rem;
                    border-radius: 50px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s;
                    box-shadow: 0 10px 30px rgba(139, 102, 158, 0.4);
                }

                .cta-button:hover {
                    background: linear-gradient(135deg, #6d5380 0%, #8b669e 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 15px 40px rgba(139, 102, 158, 0.6);
                }

                @media (max-width: 768px) {
                    .service-nav {
                        padding: 1rem;
                    }

                    .service-nav h1 {
                        font-size: 1.2rem;
                    }

                    .service-hero {
                        padding: 3rem 1.5rem;
                    }

                    .service-hero h2 {
                        font-size: 1.8rem;
                    }

                    .gallery-container {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 1rem;
                    }

                    .service-cta h3 {
                        font-size: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
}
