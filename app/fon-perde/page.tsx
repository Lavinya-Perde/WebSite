"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FonPerdePage() {
    // SEO için sayfa başlığını güncelle
    useEffect(() => {
        document.title = "Fon Perde Modelleri | Lavinya Perde";
    }, []);
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // API'den görselleri yükle
    useEffect(() => {
        const loadImages = async () => {
            try {
                const response = await fetch('/api/images?service=fon-perde');
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
                    <h1>Fon Perde Koleksiyonumuz</h1>
                    <p>Kaliteli kumaşlar ve özel dikim ile evinize uygun fon perdeler. Geniş renk ve desen seçenekleriyle mekanlarınıza zarafet katın.</p>
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
                )}
            </section>

            <section className="service-cta">
                <div className="service-cta-content">
                    <h3>Fon Perde İçin Teklif Alın</h3>
                    <p>Profesyonel ekibimiz size en uygun çözümü sunmak için hazır</p>
                    <Link href="/iletisim" className="cta-button">
                        Teklif Alın
                    </Link>
                </div>
            </section>
        </div>
    );
}
