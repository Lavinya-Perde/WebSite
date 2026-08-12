"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MontajHizmetiPage() {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // SEO için sayfa başlığını güncelle
    useEffect(() => {
        document.title = "Profesyonel Montaj Hizmeti | Lavinya Perde";
    }, []);

    // API'den görselleri yükle
    useEffect(() => {
        const loadImages = async () => {
            try {
                const response = await fetch('/api/images?service=montaj');
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
                    <h1>Profesyonel Montaj Hizmetimiz</h1>
                    <p>Uzman ekibimizle profesyonel ölçüm ve montaj hizmeti. Tüm ürünlerimiz için özenli kurulum garantisi.</p>
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
                                    alt={`Montaj ${index + 1}`}
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
                    <h3>Montaj İçin Randevu Alın</h3>
                    <p>Profesyonel ekibimiz size en uygun çözümü sunmak için hazır</p>
                    <Link href="/iletisim" className="cta-button">
                        Teklif Alın
                    </Link>
                </div>
            </section>

        </div>
    );
}
