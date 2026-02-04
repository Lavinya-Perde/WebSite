"use client";

import { useEffect } from "react";

export default function IletisimPage() {
    useEffect(() => {
        document.title = "İletişim | Lavinya Perde";
    }, []);

    return (
        <div className="contact-page">
            <section className="contact-hero">
                <div className="contact-hero-content">
                    <h1>İletişim</h1>
                    <p>Bizimle iletişime geçin, size en uygun çözümü sunalım.</p>
                </div>
            </section>

            <section className="contact-content">
                <div className="contact-grid">
                    <div className="contact-info">
                        <h2>İletişim Bilgilerimiz</h2>

                        <div className="info-item">
                            <div className="info-icon">📍</div>
                            <div className="info-text">
                                <h3>Adres</h3>
                                <p>Bahçelievler, Mehmetcik Cd. No:60/A</p>
                                <p>10100 Altıeylül / Balıkesir</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">📞</div>
                            <div className="info-text">
                                <h3>Telefon</h3>
                                <a href="tel:+905555555555">0555 555 55 55</a>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">🕐</div>
                            <div className="info-text">
                                <h3>Çalışma Saatleri</h3>
                                <p>Pazartesi - Cumartesi: 09:00 - 19:00</p>
                                <p>Pazar: Kapalı</p>
                            </div>
                        </div>

                        <a
                            href="https://www.google.com/maps/dir//Lavinya+Perde,+Bah%C3%A7elievler,+Mehmetcik+Cd.+No:60%2FA,+10100+Alt%C4%B1eyl%C3%BCl%2FBal%C4%B1kesir/@39.6323099,27.8955978,14z"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="directions-button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                            </svg>
                            Yol Tarifi Al
                        </a>
                    </div>

                    <div className="map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3072.5!2d27.8860732!3d39.6344197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b0bb1a0e7c5037%3A0xc783bdbb20bf23bc!2sLavinya%20Perde!5e0!3m2!1str!2str!4v1707000000000!5m2!1str!2str"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Lavinya Perde Konum"
                        />
                    </div>
                </div>
            </section>

            <style jsx>{`
                .contact-page {
                    min-height: 100vh;
                    background: #0a0a0a;
                    padding-top: 80px;
                }

                .contact-hero {
                    background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
                    color: white;
                    padding: 4rem 2rem;
                    text-align: center;
                    border-bottom: 1px solid rgba(139, 102, 158, 0.2);
                }

                .contact-hero-content {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .contact-hero h1 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }

                .contact-hero p {
                    font-size: 1.1rem;
                    line-height: 1.6;
                    opacity: 0.95;
                    color: #b0b0b0;
                }

                .contact-content {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 3rem 2rem;
                }

                .contact-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    gap: 3rem;
                    min-height: 500px;
                }

                .contact-info {
                    background: #1a1a1a;
                    padding: 2.5rem;
                    border-radius: 20px;
                    border: 1px solid rgba(139, 102, 158, 0.2);
                }

                .contact-info h2 {
                    color: #ffffff;
                    font-size: 1.5rem;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid rgba(139, 102, 158, 0.3);
                }

                .info-item {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .info-icon {
                    font-size: 1.5rem;
                    width: 50px;
                    height: 50px;
                    background: rgba(139, 102, 158, 0.2);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .info-text h3 {
                    color: #b89dd4;
                    font-size: 1rem;
                    margin-bottom: 0.3rem;
                }

                .info-text p,
                .info-text a {
                    color: #b0b0b0;
                    font-size: 0.95rem;
                    line-height: 1.5;
                    text-decoration: none;
                }

                .info-text a:hover {
                    color: #b89dd4;
                }

                .directions-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    width: 100%;
                    margin-top: 2rem;
                    background: linear-gradient(135deg, #8b669e 0%, #6d5380 100%);
                    color: white;
                    padding: 1.2rem 2rem;
                    border-radius: 50px;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 1.1rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 30px rgba(139, 102, 158, 0.4);
                    border: 2px solid transparent;
                }

                .directions-button:hover {
                    background: linear-gradient(135deg, #9b76ae 0%, #7d6390 100%);
                    transform: translateY(-3px);
                    box-shadow: 0 15px 40px rgba(139, 102, 158, 0.6);
                    border-color: rgba(184, 157, 212, 0.3);
                }

                .directions-button:active {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 25px rgba(139, 102, 158, 0.5);
                }

                .directions-button svg {
                    flex-shrink: 0;
                }

                .map-container {
                    border-radius: 20px;
                    overflow: hidden;
                    border: 1px solid rgba(139, 102, 158, 0.2);
                    min-height: 500px;
                }

                .map-container iframe {
                    display: block;
                }

                @media (max-width: 968px) {
                    .contact-grid {
                        grid-template-columns: 1fr;
                    }

                    .map-container {
                        min-height: 400px;
                    }
                }

                @media (max-width: 768px) {
                    .contact-hero {
                        padding: 3rem 1.5rem;
                    }

                    .contact-hero h1 {
                        font-size: 1.8rem;
                    }

                    .contact-content {
                        padding: 2rem 1rem;
                    }

                    .contact-info {
                        padding: 1.5rem;
                    }

                    .map-container {
                        min-height: 350px;
                    }
                }
            `}</style>
        </div>
    );
}
