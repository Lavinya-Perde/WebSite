"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Fon Perde", href: "/fon-perde" },
    { label: "Tül Perde", href: "/tul-perde" },
    { label: "Stor & Jaluzi", href: "/stor-perde" },
    { label: "Halı", href: "/hali" },
    { label: "Duvar Kağıdı", href: "/duvar-kagidi" },
    { label: "Montaj Hizmeti", href: "/montaj-hizmeti" },
];

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) { setIsLoggedIn(false); return; }
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

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    const handleLinkClick = () => setMenuOpen(false);

    return (
        <>
            <header
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    transition: "background 0.35s ease, box-shadow 0.35s ease",
                    background: scrolled ? "rgba(250,246,238,0.94)" : "rgba(250,246,238,0.82)",
                    backdropFilter: "blur(10px)",
                    boxShadow: scrolled ? "0 1px 0 rgba(27,42,65,0.1)" : "none",
                }}
            >
                <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2.5rem", height: 76 }}>
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }} onClick={handleLinkClick}>
                        <Image width={40} height={40} src="/logo.png" alt="Lavinya Perde Logo" priority style={{ objectFit: "contain" }} />
                        <span style={{ fontSize: "1.02rem", fontWeight: 600, color: "#1b2a41", letterSpacing: 2 }}>
                            LAVİNYA PERDE
                        </span>
                    </Link>

                    {/* Masaüstü menü */}
                    <nav style={{ display: "flex", alignItems: "center", gap: "2.2rem", maxWidth: "none", padding: 0 }} className="desktop-nav">
                        {navLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    color: pathname === item.href ? "#1b2a41" : "rgba(27,42,65,0.62)",
                                    textDecoration: "none",
                                    fontSize: "0.82rem",
                                    fontWeight: 500,
                                    letterSpacing: "0.03em",
                                    transition: "color 0.3s",
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div style={{ display: "flex", alignItems: "center", gap: "1.1rem" }}>
                        <Link href="/iletisim" className="header-cta cta-button" style={{ display: "none", fontSize: "0.78rem", padding: "0.6rem 1.3rem" }}>
                            Teklif Alın
                        </Link>

                        {/* Hamburger */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Menüyü aç/kapat"
                            className="hamburger-btn"
                            style={{
                                background: "transparent",
                                border: "1px solid rgba(27,42,65,0.28)",
                                width: 44,
                                height: 40,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 5,
                                cursor: "pointer",
                            }}
                        >
                            <span style={{ display: "block", width: 20, height: 1.5, background: "#1b2a41" }} />
                            <span style={{ display: "block", width: 20, height: 1.5, background: "#1b2a41" }} />
                            <span style={{ display: "block", width: 20, height: 1.5, background: "#1b2a41" }} />
                        </button>
                    </div>
                </div>
            </header>

            <style jsx global>{`
                @media (max-width: 1080px) {
                    .desktop-nav { display: none !important; }
                    .header-cta { display: none !important; }
                }
                @media (min-width: 1081px) {
                    .hamburger-btn { display: none !important; }
                    .header-cta { display: inline-flex !important; }
                }
            `}</style>

            {/* Overlay */}
            <div
                onClick={() => setMenuOpen(false)}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.6)",
                    zIndex: 1998,
                    opacity: menuOpen ? 1 : 0,
                    pointerEvents: menuOpen ? "all" : "none",
                    transition: "opacity 0.35s",
                }}
            />

            {/* Drawer */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    width: 340,
                    maxWidth: "88vw",
                    height: "100vh",
                    background: "#faf6ee",
                    zIndex: 1999,
                    transform: menuOpen ? "translateX(0)" : "translateX(100%)",
                    transition: "transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)",
                    display: "flex",
                    flexDirection: "column",
                    padding: "1.75rem 1.75rem",
                    overflow: "hidden",
                    borderLeft: "1px solid rgba(27,42,65,0.12)",
                    boxShadow: "-16px 0 40px rgba(27,42,65,0.18)",
                }}
            >
                <button
                    onClick={() => setMenuOpen(false)}
                    aria-label="Menüyü kapat"
                    style={{
                        position: "absolute",
                        top: "1.25rem",
                        right: "1.25rem",
                        background: "transparent",
                        border: "1px solid rgba(27,42,65,0.25)",
                        width: 36,
                        height: 36,
                        color: "#1b2a41",
                        fontSize: "0.95rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2,
                    }}
                >✕</button>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(27,42,65,0.12)", marginTop: "1rem" }}>
                    <Image src="/logo.png" alt="Lavinya Perde" width={40} height={40} style={{ objectFit: "contain" }} />
                    <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1b2a41", letterSpacing: 2 }}>LAVİNYA PERDE</span>
                </div>

                <div style={{ flex: 1, overflowY: "auto" }}>
                    {[
                        ...navLinks,
                        { label: "İletişim", href: "/iletisim" },
                        ...(isLoggedIn ? [
                            { label: "Hesaplama", href: "/perde-hesaplama" },
                            { label: "Admin Panel", href: "/admin" },
                        ] : []),
                    ].map((item, i) => (
                        <div key={item.href} style={{ borderBottom: "1px solid rgba(27,42,65,0.1)", display: "flex", alignItems: "center", gap: "1rem" }}>
                            <span style={{ fontSize: "0.65rem", color: "rgba(27,42,65,0.4)", fontWeight: 600, minWidth: 18 }}>{String(i + 1).padStart(2, "0")}</span>
                            <Link
                                href={item.href}
                                onClick={handleLinkClick}
                                style={{
                                    display: "block",
                                    padding: "0.95rem 0",
                                    textDecoration: "none",
                                    color: "rgba(27,42,65,0.85)",
                                    fontSize: "1.05rem",
                                    fontWeight: 500,
                                }}
                            >
                                {item.label}
                            </Link>
                        </div>
                    ))}
                </div>

                <div style={{ display: "flex", gap: "1.1rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(27,42,65,0.12)" }}>
                    <a href="https://wa.me/905055102287" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(27,42,65,0.65)", display: "flex" }}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                    <a href="https://instagram.com/lavinya.perde" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(27,42,65,0.65)", display: "flex" }}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    </a>
                    <a href="tel:+905055102287" style={{ color: "rgba(27,42,65,0.65)", fontSize: "0.9rem", fontWeight: 500, marginLeft: "auto", textDecoration: "none" }}>
                        0505 510 22 87
                    </a>
                </div>
            </div>
        </>
    );
}
