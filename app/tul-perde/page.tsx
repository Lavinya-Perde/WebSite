"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TulPerdePage() {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // SEO için sayfa başlığını güncelle
    useEffect(() => {
        document.title = "Tül Perde Modelleri | Lavinya Perde";
    }, []);

    // API'den görselleri yükle
    useEffect(() => {
        const loadImages = async () => {
            try {
                const response = await fetch('/api/images?service=tul-perde');
                if (response.ok) {
                    const data = await response.json();
                    if (data.images && data.images.length > 0) {
                        const urls = data.images.map((img: { path: string }) => img.path);
                        setImages(urls);
                    }
                }
            } catch (error) {
                console.error('Error loading images:', error);
            } finally {
                setLoading(false);
            }
        };

        loadImages();
    }, []);

    return (
        <div className="service-page">
            <section className="service-hero">
                <div className="service-hero-content">
                    <h1>Tül Perde Koleksiyonumuz</h1>
                    <p>Işık geçiren zarif tül perdelerle mekanlarınıza ferahlık. Modern ve klasik desenlerle her tarza uygun seçenekler.</p>
                </div>
            </section>

            <section className="service-gallery">
                {loading ? (
                    <div className="loading-indicator">
                        <div className="spinner"></div>
                        <p>Yükleniyor...</p>
                    </div>
                ) : images.length === 0 ? (
                    <div className="empty-state">
                        <p>Henüz görsel eklenmedi</p>
                    </div>
                ) : (
                    <div className="gallery-container">
                        {images.map((image, index) => (
                            <div key={`${image}-${index}`} className="service-gallery-item">
                                <Image
                                    src={image}
                                    alt={`Tül Perde ${index + 1}`}
                                    fill
                                    quality={75}
                                    loading="lazy"
                                    style={{ objectFit: 'cover' }}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="service-cta">
                <div className="service-cta-content">
                    <h3>Tül Perde İçin Teklif Alın</h3>
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
                    padding-top: 80px;
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

                .service-hero h1 {
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

                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                    color: #666;
                    font-size: 1.2rem;
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
                    .service-hero {
                        padding: 3rem 1.5rem;
                    }

                    .service-hero h1 {
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
