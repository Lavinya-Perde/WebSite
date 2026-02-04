"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === "/";

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
            } catch {
                setIsLoggedIn(false);
            }
        };
        checkAuth();
    }, []);

    // Menü linkine tıklandığında menüyü kapat
    const handleLinkClick = () => {
        setMenuOpen(false);
    };

    return (
        <header className="main-header">
            <nav>
                <Link href="/" className="logo-container">
                    <Image
                        width={50}
                        height={50}
                        src="/logo.png"
                        alt="Lavinya Perde Logo"
                        className="logo"
                        priority
                    />
                    <span className="logo-text">LAVİNYA PERDE</span>
                </Link>

                <div
                    className={`hamburger ${menuOpen ? 'active' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>

                <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
                    <li><Link href={isHomePage ? "#anasayfa" : "/#anasayfa"} onClick={handleLinkClick}>Ana Sayfa</Link></li>
                    <li><Link href={isHomePage ? "#hizmetler" : "/#hizmetler"} onClick={handleLinkClick}>Hizmetlerimiz</Link></li>
                    <li><Link href={isHomePage ? "#galeri" : "/#galeri"} onClick={handleLinkClick}>Galeri</Link></li>
                    <li><Link href={isHomePage ? "#hakkimizda" : "/#hakkimizda"} onClick={handleLinkClick}>Hakkımızda</Link></li>
                    <li><Link href="/iletisim" onClick={handleLinkClick}>İletişim</Link></li>
                    {isLoggedIn && <li><Link href="/perde-hesaplama" onClick={handleLinkClick}>Hesaplama</Link></li>}
                    {isLoggedIn && <li><Link href="/admin" onClick={handleLinkClick}>Admin Panel</Link></li>}
                </ul>
            </nav>

            <style jsx>{`
                .main-header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    background: rgba(10, 10, 10, 0.95);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(139, 102, 158, 0.2);
                }

                nav {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 2rem;
                    height: 80px;
                }

                .logo-container {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    text-decoration: none;
                    color: inherit;
                }

                .logo-text {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #ffffff;
                }

                .nav-links {
                    display: flex;
                    list-style: none;
                    gap: 2.5rem;
                    margin: 0;
                    padding: 0;
                }

                .nav-links li a {
                    color: #b0b0b0;
                    text-decoration: none;
                    font-weight: 500;
                    transition: color 0.3s;
                    position: relative;
                }

                .nav-links li a:hover {
                    color: #b89dd4;
                }

                .nav-links li a::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: linear-gradient(90deg, #8b669e, #b89dd4);
                    transition: width 0.3s;
                }

                .nav-links li a:hover::after {
                    width: 100%;
                }

                .hamburger {
                    display: none;
                    flex-direction: column;
                    cursor: pointer;
                    gap: 5px;
                    z-index: 1001;
                }

                .bar {
                    width: 25px;
                    height: 3px;
                    background-color: #b89dd4;
                    transition: 0.3s;
                    border-radius: 2px;
                }

                @media (max-width: 768px) {
                    nav {
                        padding: 0 1.5rem;
                    }

                    .nav-links {
                        position: fixed;
                        right: -100%;
                        top: 0;
                        flex-direction: column;
                        background: rgba(10, 10, 10, 0.98);
                        backdrop-filter: blur(10px);
                        width: 70%;
                        height: 100vh;
                        justify-content: center;
                        transition: 0.3s ease-in-out;
                        box-shadow: -5px 0 25px rgba(139, 102, 158, 0.3);
                        z-index: 999;
                        border-left: 1px solid rgba(139, 102, 158, 0.2);
                        gap: 2rem;
                        padding: 0;
                    }

                    .nav-links.active {
                        right: 0;
                    }

                    .nav-links li {
                        text-align: center;
                    }

                    .nav-links li a {
                        font-size: 1.2rem;
                    }

                    .hamburger {
                        display: flex;
                    }

                    .hamburger.active .bar:nth-child(2) {
                        opacity: 0;
                    }

                    .hamburger.active .bar:nth-child(1) {
                        transform: translateY(8px) rotate(45deg);
                    }

                    .hamburger.active .bar:nth-child(3) {
                        transform: translateY(-8px) rotate(-45deg);
                    }
                }
            `}</style>
        </header>
    );
}
