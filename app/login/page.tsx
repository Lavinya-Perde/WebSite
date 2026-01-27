"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasyon
    if (!email || !password) {
        alert("Lütfen tüm alanları doldurun!");
        return;
    }

    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            // ✅ JSON olarak parse et
            const data = await response.json();
            localStorage.setItem("token", data.token);
            router.push("/perde-hesaplama");
        } else {
            const error = await response.json();
            alert(error.error || "Hatalı kullanıcı adı veya şifre!");
        }
    } catch (error) {
        console.error("Login hatası:", error);
        alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
};

    return (
        <>
            {/* NAVBAR */}
            <header>
                <nav>
                    <div className="logo-container">
                        <Image
                            width={60}
                            height={60}
                            src="/logo.png"
                            alt="Lavinya Perde Logo"
                            className="logo"
                            priority
                        />
                        <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>LAVİNYA PERDE</span>
                    </div>

                    {/* Hamburger Butonu */}
                    <div
                        className={`hamburger ${menuOpen ? 'active' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>

                    {/* Menü Linkleri */}
                    <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
                        <li><a href="/#anasayfa">Ana Sayfa</a></li>
                        <li><a href="/#hizmetler">Hizmetler</a></li>
                        <li><a href="/#galeri">Galeri</a></li>
                        <li><a href="/#hakkimizda">Hakkımızda</a></li>
                        <li><a href="/#iletisim">İletişim</a></li>
                        <li><a href="/perde-hesaplama">Hesaplama</a></li>
                    </ul>
                </nav>
            </header>

            {/* LOGIN SAYFASI */}
            <div
                style={{
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #1a1a1a 0%, #2a1a2a 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem",
                    paddingTop: "120px",
                }}
            >
                <div
                    style={{
                        maxWidth: "450px",
                        width: "100%",
                        background: "#252525",
                        borderRadius: "25px",
                        padding: "3rem",
                        border: "2px solid rgba(139, 102, 158, 0.3)",
                        boxShadow: "0 20px 60px rgba(139, 102, 158, 0.2)",
                    }}
                >
                    {/* Logo ve Başlık */}
                    <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                        <div
                            style={{
                                width: "80px",
                                height: "80px",
                                margin: "0 auto 1.5rem",
                                background: "linear-gradient(135deg, #8b669e 0%, #6d5380 100%)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2.5rem",
                                border: "3px solid rgba(184, 157, 212, 0.3)",
                            }}
                        >
                            🔐
                        </div>
                        <h1 style={{ fontSize: "2rem", color: "#b89dd4", marginBottom: "0.5rem" }}>
                            Yönetici Girişi
                        </h1>
                        <p style={{ color: "#b0b0b0", fontSize: "1rem" }}>
                            Hesabınıza giriş yapın
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin}>
                        {/* E-posta */}
                        <div style={{ marginBottom: "1.5rem" }}>
                            <label
                                htmlFor="text"
                                style={{
                                    display: "block",
                                    color: "#b89dd4",
                                    fontSize: "0.95rem",
                                    marginBottom: "0.5rem",
                                    fontWeight: "600",
                                }}
                            >
                                Kullanıcı Adı
                            </label>
                            <div style={{ position: "relative" }}>
                                <span
                                    style={{
                                        position: "absolute",
                                        left: "1rem",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        fontSize: "1.2rem",
                                    }}
                                >
                                    👤
                                </span>
                                <input
                                    id="email"
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Kullanıcı adınızı girin"
                                    style={{
                                        width: "100%",
                                        padding: "1rem 1rem 1rem 3rem",
                                        fontSize: "1rem",
                                        borderRadius: "12px",
                                        border: "2px solid rgba(139, 102, 158, 0.3)",
                                        background: "#1f1f1f",
                                        color: "#e0e0e0",
                                        transition: "all 0.3s",
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = "rgba(184, 157, 212, 0.6)";
                                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139, 102, 158, 0.1)";
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = "rgba(139, 102, 158, 0.3)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                />
                            </div>
                        </div>

                        {/* Şifre */}
                        <div style={{ marginBottom: "2rem" }}>
                            <label
                                htmlFor="password"
                                style={{
                                    display: "block",
                                    color: "#b89dd4",
                                    fontSize: "0.95rem",
                                    marginBottom: "0.5rem",
                                    fontWeight: "600",
                                }}
                            >
                                Şifre
                            </label>
                            <div style={{ position: "relative" }}>
                                <span
                                    style={{
                                        position: "absolute",
                                        left: "1rem",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        fontSize: "1.2rem",
                                    }}
                                >
                                    🔒
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{
                                        width: "100%",
                                        padding: "1rem 3rem 1rem 3rem",
                                        fontSize: "1rem",
                                        borderRadius: "12px",
                                        border: "2px solid rgba(139, 102, 158, 0.3)",
                                        background: "#1f1f1f",
                                        color: "#e0e0e0",
                                        transition: "all 0.3s",
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = "rgba(184, 157, 212, 0.6)";
                                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139, 102, 158, 0.1)";
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = "rgba(139, 102, 158, 0.3)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute",
                                        right: "1rem",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "1.2rem",
                                    }}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        {/* Giriş Butonu */}
                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                background: "linear-gradient(135deg, #8b669e 0%, #6d5380 100%)",
                                color: "white",
                                padding: "1rem",
                                border: "2px solid rgba(184, 157, 212, 0.3)",
                                borderRadius: "12px",
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                cursor: "pointer",
                                transition: "all 0.3s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 10px 30px rgba(139, 102, 158, 0.4)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            Giriş Yap
                        </button>
                    </form>
                </div>
            </div>

            {/* FOOTER */}
            <footer style={{ marginTop: "0" }}>
                <p>&copy; 2026 Lavinya Perde. Tüm hakları saklıdır.</p>
            </footer>
        </>
    );
}