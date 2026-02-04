"use client";

export default function Footer() {
    return (
        <footer className="main-footer">
            <div className="footer-content">
                <p>&copy; 2026 Lavinya Perde. Tüm hakları saklıdır.</p>
            </div>

            <style jsx>{`
                .main-footer {
                    background: linear-gradient(180deg, #0a0a0a 0%, #050505 100%);
                    color: #b0b0b0;
                    padding: 2rem;
                    text-align: center;
                    border-top: 1px solid rgba(139, 102, 158, 0.2);
                }

                .footer-content {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .footer-content p {
                    margin: 0;
                    font-size: 0.95rem;
                }
            `}</style>
        </footer>
    );
}
