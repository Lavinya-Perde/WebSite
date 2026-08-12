"use client";

import { useEffect } from "react";

const iconProps = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, width: 20, height: 20 };

const PinIcon = () => (
    <svg {...iconProps}><path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.3" /></svg>
);
const PhoneIcon = () => (
    <svg {...iconProps}><path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z" /></svg>
);
const ClockIcon = () => (
    <svg {...iconProps}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>
);

export default function IletisimPage() {
    useEffect(() => {
        document.title = "İletişim | Lavinya Perde";
    }, []);

    return (
        <div className="contact-page">
            <section className="contact-hero">
                <div className="contact-hero-content">
                    <h1>İletişim</h1>
                    <p>Ölçüm randevusu, ürün bilgisi veya teklif için bize ulaşın.</p>
                </div>
            </section>

            <section className="contact-content">
                <div className="contact-grid">
                    <div className="contact-info">
                        <h2>İletişim Bilgilerimiz</h2>

                        <div className="info-item">
                            <div className="info-icon"><PinIcon /></div>
                            <div className="info-text">
                                <h3>Adres</h3>
                                <p>Bahçelievler, Mehmetcik Cd. No:60/A</p>
                                <p>10100 Altıeylül / Balıkesir</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon"><PhoneIcon /></div>
                            <div className="info-text">
                                <h3>Telefon</h3>
                                <a href="tel:+905055102287">0505 510 22 87</a>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon"><ClockIcon /></div>
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
                            className="directions-link"
                        >
                            <div className="info-icon"><PinIcon /></div>
                            <div className="info-text">
                                <h3>Yol Tarifi Al</h3>
                                <p>Google Maps ile yol tarifi alın</p>
                            </div>
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
        </div>
    );
}
