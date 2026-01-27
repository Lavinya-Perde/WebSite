"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function PerdeHesaplama() {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [genislik, setGenislik] = useState<string>("");
    const [yukseklik, setYukseklik] = useState<string>("");
    const [perdetipi, setPerdetip] = useState<string>("tul");
    const [pileTipi, setPileTipi] = useState<string>("3");
    const [sonuc, setSonuc] = useState<{
        kumasGenisligi: number;
        kumasYuksekligi: number;
        toplamMetrekare: number;
        tahminiTutar: number;
    } | null>(null);


    useEffect(() => {
        async function verifyToken() {
            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/";
                return;
            }
            const response = await fetch('/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });
            if (!response.ok) {
                //window.location.href = "/";
                return;
            }
        }
        verifyToken();
    }, []);
    const hesapla = () => {
        const g = parseFloat(genislik);
        const y = parseFloat(yukseklik);

        if (!g || !y || g <= 0 || y <= 0) {
            alert("Lütfen geçerli ölçüler girin!");
            return;
        }

        // Pile katsayısı
        const pileKatsayisi = parseFloat(pileTipi);

        // Kumaş genişliği = Pencere genişliği × Pile katsayısı
        const kumasGenisligi = g * pileKatsayisi;

        // Kumaş yüksekliği = Pencere yüksekliği + 20cm (dikiş payı ve kıvrım)
        const kumasYuksekligi = y + 20;

        // Toplam metrekare
        const toplamMetrekare = (kumasGenisligi * kumasYuksekligi) / 10000;

        // Tahmini fiyat (m² başına ortalama fiyat)
        let birimFiyat = 0;
        switch (perdetipi) {
            case "fon":
                birimFiyat = 150; // TL/m²
                break;
            case "tul":
                birimFiyat = 100; // TL/m²
                break;
            case "stor":
                birimFiyat = 200; // TL/m²
                break;
            default:
                birimFiyat = 150;
        }

        const tahminiTutar = toplamMetrekare * birimFiyat;

        setSonuc({
            kumasGenisligi: Math.round(kumasGenisligi),
            kumasYuksekligi: Math.round(kumasYuksekligi),
            toplamMetrekare: parseFloat(toplamMetrekare.toFixed(2)),
            tahminiTutar: Math.round(tahminiTutar),
        });
    };

    const temizle = () => {
        setGenislik("");
        setYukseklik("");
        setPerdetip("tul");
        setPileTipi("3");
        setSonuc(null);
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

            {/* HESAPLAMA SAYFASI */}
            <div style={{ minHeight: "100vh", background: "#1a1a1a", paddingTop: "120px" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
                    {/* Başlık */}
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <h1 style={{ fontSize: "2.5rem", color: "#b89dd4", marginBottom: "1rem" }}>
                            Perde En-Boy Hesaplama
                        </h1>
                        <p style={{ color: "#b0b0b0", fontSize: "1.1rem" }}>
                            Pencere ölçülerinizi girerek ihtiyacınız olan kumaş miktarını hesaplayın
                        </p>
                    </div>

                    {/* Form Kartı */}
                    <div
                        style={{
                            background: "#252525",
                            borderRadius: "20px",
                            padding: "2.5rem",
                            border: "1px solid rgba(139, 102, 158, 0.2)",
                            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        {/* Perde Tipi Seçimi */}
                        <div style={{ marginBottom: "2rem" }}>
                            <label
                                style={{
                                    display: "block",
                                    color: "#b89dd4",
                                    fontSize: "1.1rem",
                                    marginBottom: "0.75rem",
                                    fontWeight: "600",
                                }}
                            >
                                Perde Tipi
                            </label>
                            <select
                                value={perdetipi}
                                onChange={(e) => setPerdetip(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "1rem",
                                    fontSize: "1rem",
                                    borderRadius: "10px",
                                    border: "2px solid rgba(139, 102, 158, 0.3)",
                                    background: "#1f1f1f",
                                    color: "#e0e0e0",
                                    cursor: "pointer",
                                }}
                            >
                                <option value="fon">Fon Perde</option>
                                <option value="tul">Tül Perde</option>
                                <option value="stor">Stor Perde</option>
                            </select>
                        </div>

                        {/* Pencere Genişliği */}
                        <div style={{ marginBottom: "2rem" }}>
                            <label
                                style={{
                                    display: "block",
                                    color: "#b89dd4",
                                    fontSize: "1.1rem",
                                    marginBottom: "0.75rem",
                                    fontWeight: "600",
                                }}
                            >
                                Pencere Genişliği (cm)
                            </label>
                            <input
                                type="number"
                                value={genislik}
                                onChange={(e) => setGenislik(e.target.value)}
                                placeholder="Örn: 200"
                                style={{
                                    width: "100%",
                                    padding: "1rem",
                                    fontSize: "1rem",
                                    borderRadius: "10px",
                                    border: "2px solid rgba(139, 102, 158, 0.3)",
                                    background: "#1f1f1f",
                                    color: "#e0e0e0",
                                }}
                            />
                        </div>

                        {/* Pencere Yüksekliği */}
                        <div style={{ marginBottom: "2rem" }}>
                            <label
                                style={{
                                    display: "block",
                                    color: "#b89dd4",
                                    fontSize: "1.1rem",
                                    marginBottom: "0.75rem",
                                    fontWeight: "600",
                                }}
                            >
                                Pencere Yüksekliği (cm)
                            </label>
                            <input
                                type="number"
                                value={yukseklik}
                                onChange={(e) => setYukseklik(e.target.value)}
                                placeholder="Örn: 240"
                                style={{
                                    width: "100%",
                                    padding: "1rem",
                                    fontSize: "1rem",
                                    borderRadius: "10px",
                                    border: "2px solid rgba(139, 102, 158, 0.3)",
                                    background: "#1f1f1f",
                                    color: "#e0e0e0",
                                }}
                            />
                        </div>

                        {/* Pile Tipi */}
                        <div style={{ marginBottom: "2rem" }}>
                            <label
                                style={{
                                    display: "block",
                                    color: "#b89dd4",
                                    fontSize: "1.1rem",
                                    marginBottom: "0.75rem",
                                    fontWeight: "600",
                                }}
                            >
                                Pile Katsayısı
                            </label>
                            <select
                                value={pileTipi}
                                onChange={(e) => setPileTipi(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "1rem",
                                    fontSize: "1rem",
                                    borderRadius: "10px",
                                    border: "2px solid rgba(139, 102, 158, 0.3)",
                                    background: "#1f1f1f",
                                    color: "#e0e0e0",
                                    cursor: "pointer",
                                }}
                            >
                                <option value="1.5">1.5 Kat</option>
                                <option value="2">2 Kat</option>
                                <option value="2.5">2.5 Kat</option>
                                <option value="3">3 Kat</option>
                            </select>
                            <small style={{ color: "#888", fontSize: "0.9rem", marginTop: "0.5rem", display: "block" }}>
                                Pile katsayısı perdenin ne kadar kıvrımlı olacağını belirler
                            </small>
                        </div>

                        {/* Butonlar */}
                        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                            <button
                                onClick={hesapla}
                                style={{
                                    flex: 1,
                                    background: "linear-gradient(135deg, #8b669e 0%, #6d5380 100%)",
                                    color: "white",
                                    padding: "1rem 2rem",
                                    border: "2px solid rgba(184, 157, 212, 0.3)",
                                    borderRadius: "50px",
                                    fontSize: "1.1rem",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    transition: "all 0.3s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-3px)";
                                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(139, 102, 158, 0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                Hesapla
                            </button>
                            <button
                                onClick={temizle}
                                style={{
                                    flex: 1,
                                    background: "transparent",
                                    color: "#b89dd4",
                                    padding: "1rem 2rem",
                                    border: "2px solid rgba(184, 157, 212, 0.5)",
                                    borderRadius: "50px",
                                    fontSize: "1.1rem",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    transition: "all 0.3s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(139, 102, 158, 0.1)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                }}
                            >
                                Temizle
                            </button>
                        </div>
                    </div>

                    {/* Sonuç Kartı */}
                    {sonuc && (
                        <div
                            style={{
                                marginTop: "2rem",
                                background: "linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%)",
                                borderRadius: "20px",
                                padding: "2rem",
                                border: "2px solid rgba(139, 102, 158, 0.4)",
                                boxShadow: "0 15px 50px rgba(139, 102, 158, 0.2)",
                            }}
                        >
                            <h2
                                style={{
                                    color: "#b89dd4",
                                    fontSize: "1.8rem",
                                    marginBottom: "1.5rem",
                                    textAlign: "center",
                                }}
                            >
                                📊 Hesaplama Sonuçları
                            </h2>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                                <div
                                    style={{
                                        background: "rgba(139, 102, 158, 0.1)",
                                        padding: "1.5rem",
                                        borderRadius: "15px",
                                        border: "1px solid rgba(139, 102, 158, 0.2)",
                                    }}
                                >
                                    <div style={{ color: "#888", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                                        Kumaş Genişliği
                                    </div>
                                    <div style={{ color: "#fff", fontSize: "1.8rem", fontWeight: "bold" }}>
                                        {sonuc.kumasGenisligi} cm
                                    </div>
                                </div>

                                <div
                                    style={{
                                        background: "rgba(139, 102, 158, 0.1)",
                                        padding: "1.5rem",
                                        borderRadius: "15px",
                                        border: "1px solid rgba(139, 102, 158, 0.2)",
                                    }}
                                >
                                    <div style={{ color: "#888", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                                        Kumaş Yüksekliği
                                    </div>
                                    <div style={{ color: "#fff", fontSize: "1.8rem", fontWeight: "bold" }}>
                                        {sonuc.kumasYuksekligi} cm
                                    </div>
                                </div>

                                <div
                                    style={{
                                        background: "rgba(139, 102, 158, 0.1)",
                                        padding: "1.5rem",
                                        borderRadius: "15px",
                                        border: "1px solid rgba(139, 102, 158, 0.2)",
                                    }}
                                >
                                    <div style={{ color: "#888", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                                        Toplam Metrekare
                                    </div>
                                    <div style={{ color: "#fff", fontSize: "1.8rem", fontWeight: "bold" }}>
                                        {sonuc.toplamMetrekare} m²
                                    </div>
                                </div>

                                <div
                                    style={{
                                        background: "linear-gradient(135deg, #8b669e 0%, #6d5380 100%)",
                                        padding: "1.5rem",
                                        borderRadius: "15px",
                                        border: "2px solid rgba(184, 157, 212, 0.3)",
                                    }}
                                >
                                    <div style={{ color: "#e0e0e0", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                                        Tahmini Tutar
                                    </div>
                                    <div style={{ color: "#fff", fontSize: "1.8rem", fontWeight: "bold" }}>
                                        ₺{sonuc.tahminiTutar.toLocaleString("tr-TR")}
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    marginTop: "1.5rem",
                                    padding: "1rem",
                                    background: "rgba(139, 102, 158, 0.05)",
                                    borderRadius: "10px",
                                    border: "1px solid rgba(139, 102, 158, 0.1)",
                                }}
                            >
                                <p style={{ color: "#b0b0b0", fontSize: "0.9rem", textAlign: "center", margin: 0 }}>
                                    ⚠️ Bu hesaplama tahminidir. Kesin fiyat için lütfen bizimle iletişime geçin.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Bilgilendirme */}
                    <div
                        style={{
                            marginTop: "3rem",
                            padding: "2rem",
                            background: "rgba(139, 102, 158, 0.05)",
                            borderRadius: "15px",
                            border: "1px solid rgba(139, 102, 158, 0.2)",
                        }}
                    >
                        <h3 style={{ color: "#b89dd4", marginBottom: "1rem", fontSize: "1.3rem" }}>
                            💡 Nasıl Ölçüm Yapılır?
                        </h3>
                        <ul style={{ color: "#b0b0b0", lineHeight: "1.8", paddingLeft: "1.5rem" }}>
                            <li>Pencere genişliğini ray başlangıcından ray bitişine kadar ölçün</li>
                            <li>Pencere yüksekliğini raydan zemine veya istediğiniz uzunluğa kadar ölçün</li>
                            <li>Pile katsayısı perdenin ne kadar kıvrımlı olacağını belirler (2 kat standart)</li>
                            <li>Hesaplamaya otomatik olarak 20cm dikiş ve kıvrım payı eklenir</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer>
                <p>&copy; 2026 Lavinya Perde. Tüm hakları saklıdır.</p>
            </footer>
        </>
    );
}