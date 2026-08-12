"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useInView, useScroll, animate, type Variants } from "framer-motion";
import { ScrollChoreography } from "@/components/ui/scroll-choreography";

/* Basit, tutarlı çizgi ikon seti — emoji yerine */
const icons: Record<string, React.ReactNode> = {
    fon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16" /><path d="M6 4c0 6-2 8-2 14M18 4c0 6 2 8 2 14M12 4v16M8.5 4c.5 6-1 9-1 14M15.5 4c-.5 6 1 9 1 14" />
        </svg>
    ),
    tul: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16" /><path d="M6 4c1 5 3 5 3 10s-2 5-1 10M12 4c1 5-1 6-1 10s2 5 1 10M18 4c-1 5-3 5-3 10s2 5 1 10" />
        </svg>
    ),
    stor: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="1" /><path d="M4 9h16M4 13.5h16" />
        </svg>
    ),
    hali: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3.5" y="5" width="17" height="14" rx="1" /><rect x="7" y="8.5" width="10" height="7" rx="0.5" />
        </svg>
    ),
    duvar: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20V6a2 2 0 0 1 2-2h6l8 8v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" /><path d="M12 4v8h8" />
        </svg>
    ),
    montaj: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.65 2.65-2.35-.65-.65-2.35Z" />
        </svg>
    ),
    whatsapp: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
    ),
    phone: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    ),
    pin: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
        </svg>
    ),
};

const serviceCards = [
    { href: "/fon-perde", icon: "fon", title: "Fon Perde", desc: "Kaliteli kumaşlar ve özel dikimle mekana uygun fon perdeler", folder: "fon-perde" },
    { href: "/tul-perde", icon: "tul", title: "Tül Perde", desc: "Işığı yumuşatan, zarif tül perdelerle ferah bir görünüm", folder: "tul-perde" },
    { href: "/stor-perde", icon: "stor", title: "Stor ve Jaluzi", desc: "Pratik kullanım ve modern çizgiler bir arada", folder: "stor-perde" },
    { href: "/hali", icon: "hali", title: "Halı", desc: "Dokusuyla ve deseniyle mekana sıcaklık katan halı modelleri", folder: "hali" },
    { href: "/duvar-kagidi", icon: "duvar", title: "Duvar Kağıdı", desc: "Geniş desen seçenekleriyle duvarlara yeni bir karakter", folder: "duvar-kagidi" },
    { href: "/montaj-hizmeti", icon: "montaj", title: "Montaj Hizmeti", desc: "Ölçümden kuruluma kadar özenli ve garantili işçilik", folder: "montaj" },
];

const statItems = [
    { value: 10, suffix: "+", label: "Yıllık Deneyim" },
    { value: 2500, suffix: "+", label: "Tamamlanan Proje" },
    { value: 60, suffix: "+", label: "Kumaş & Model Seçeneği" },
    { value: 100, suffix: "%", label: "Garantili Montaj" },
];

const processSteps = [
    { n: "01", t: "Keşif", d: "Yerinde ölçüm ve ihtiyaç analizi" },
    { n: "02", t: "Seçim", d: "Kumaş, renk ve model danışmanlığı" },
    { n: "03", t: "Üretim", d: "Özel ölçüde dikim ve hazırlık" },
    { n: "04", t: "Montaj", d: "Garantili kurulum ve teslim" },
];

const aboutBadges = ["10+ Yıllık Deneyim", "Yerinde Ölçüm", "Geniş Kumaş Arşivi", "Garantili Montaj"];

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
    }),
};

function StatCounter({ value, suffix, label, index }: { value: number; suffix: string; label: string; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString("tr-TR"));

    useEffect(() => {
        if (!isInView) return;
        const controls = animate(count, value, { duration: 1.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] });
        return controls.stop;
    }, [isInView, value, index, count]);

    return (
        <motion.div
            ref={ref}
            className="st-stat"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            <p className="st-stat-value">
                <motion.span>{rounded}</motion.span>{suffix}
            </p>
            <p className="st-stat-label">{label}</p>
        </motion.div>
    );
}

function ServiceParallaxImage({ src, alt }: { src: string; alt: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

    return (
        <div ref={ref} className="st-service-media">
            <motion.div className="st-service-media-inner" style={{ y }}>
                <Image src={src} alt={alt} fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: "cover" }} loading="lazy" />
            </motion.div>
        </div>
    );
}

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [sliderImages, setSliderImages] = useState<string[]>([
        '/slider/slider1.jpg',
        '/slider/slider2.jpg',
        '/slider/slider3.jpg',
        '/slider/slider4.jpg',
        '/slider/slider5.jpg',
        '/slider/slider6.jpg',
    ]);
    const [serviceBgImages, setServiceBgImages] = useState<Record<string, string>>({});

    // Slider ve hizmet görsellerini yükle
    useEffect(() => {
        const loadImages = async () => {
            try {
                const folderImages: Record<string, string[]> = {};
                const allFolders = ['slider', 'gallery', ...serviceCards.map(s => s.folder)];
                const uniqueFolders = [...new Set(allFolders)];

                await Promise.all(uniqueFolders.map(async (folder) => {
                    try {
                        const response = await fetch(`/api/images?service=${folder}`);
                        if (response.ok) {
                            const data = await response.json();
                            if (data.images && data.images.length > 0) {
                                const paths = data.images.map((img: { path: string }) => img.path);
                                folderImages[folder] = paths;
                                if (folder === 'slider') {
                                    setSliderImages(paths);
                                }
                            }
                        }
                    } catch { /* sessizce devam */ }
                }));

                const localFallback = ['/gallery/galeri1.jpg', '/gallery/galeri2.jpg', '/gallery/galeri3.jpg', '/gallery/galeri4.jpg', '/gallery/galeri5.jpg', '/gallery/galeri6.jpg'];
                const allImages = Object.values(folderImages).flat();
                const pool = allImages.length > 0 ? allImages : localFallback;
                const bgImages: Record<string, string> = {};
                serviceCards.forEach((card, i) => {
                    const own = folderImages[card.folder];
                    if (own && own.length > 0) {
                        bgImages[card.folder] = own[Math.floor(Math.random() * own.length)];
                    } else {
                        bgImages[card.folder] = pool[i % pool.length];
                    }
                });
                setServiceBgImages(bgImages);
            } catch (error) {
                console.error('Error loading images:', error);
            }
        };
        loadImages();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % sliderImages.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [sliderImages.length]);

    const marqueeItems = [...serviceCards, ...serviceCards];

    return (
        <div className="studio-home">
            {/* HERO — tek görsel, ortalanmış editoryal başlık */}
            <section id="anasayfa" className="st-hero">
                <div className="st-hero-slider">
                    <motion.div
                        key={sliderImages[currentSlide]}
                        className="st-hero-slide is-active"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <Image
                            src={sliderImages[currentSlide]}
                            alt={`Slider ${currentSlide + 1}`}
                            fill
                            priority={currentSlide === 0}
                            quality={70}
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxYTFhMWEiLz48L3N2Zz4="
                            className="st-hero-slide-img"
                            sizes="100vw"
                        />
                    </motion.div>
                </div>
                <div className="st-hero-scrim" />
                <div className="st-hero-copy">
                    <motion.div
                        className="st-hero-rule"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8 }}
                    />
                    <motion.span
                        className="st-eyebrow"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Balıkesir Perde &amp; Dekorasyon Atölyesi
                    </motion.span>
                    <motion.h1
                        className="st-hero-title"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        Evinize <em>kendi</em><br />kumaşını bulun
                    </motion.h1>
                    <motion.div
                        className="st-hero-rule"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    />
                    <motion.a
                        href="/iletisim"
                        className="st-btn"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Ücretsiz Keşif Talep Et
                    </motion.a>
                </div>
            </section>

            {/* KAYAN ŞERİT — hizmet isimleri sonsuz döngüde kayar */}
            <div className="st-marquee">
                <div className="st-marquee-track">
                    {marqueeItems.map((item, i) => (
                        <span className="st-marquee-item" key={`${item.href}-${i}`}>
                            {item.title}
                            <span className="st-marquee-dot" aria-hidden="true">✦</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* İSTATİSTİKLER — tek satır şerit */}
            <section className="st-stats">
                {statItems.map((stat, i) => (
                    <StatCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} index={i} />
                ))}
            </section>

            {/* MANİFESTO — tek büyük alıntı */}
            <section className="st-quote">
                <motion.p
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={fadeUp}
                >
                    Perde tek başına bir ürün değil,<br />bir mekanın son dokunuşudur.
                </motion.p>
                <motion.span
                    className="st-quote-attr"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={fadeUp}
                    custom={1}
                >
                    — Lavinya Perde, 10 yılı aşkın süredir Balıkesir&apos;de
                </motion.span>
            </section>

            {/* HİZMETLER — zig-zag sıra sıra tanıtım */}
            <section id="hizmetler" className="st-services">
                <div className="st-section-head">
                    <span className="st-eyebrow st-eyebrow-dark">Hizmetlerimiz</span>
                    <h2>Ölçümden montaja, tek elden</h2>
                </div>
                {serviceCards.map((service, index) => (
                    <motion.a
                        key={service.href}
                        href={service.href}
                        className={`st-service-row${index % 2 === 1 ? ' is-reverse' : ''}`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeUp}
                    >
                        {serviceBgImages[service.folder] && (
                            <ServiceParallaxImage src={serviceBgImages[service.folder]} alt={service.title} />
                        )}
                        <div className="st-service-copy">
                            <span className="st-service-icon">{icons[service.icon]}</span>
                            <span className="st-service-num">{String(index + 1).padStart(2, "0")}</span>
                            <h3>{service.title}</h3>
                            <p>{service.desc}</p>
                            <span className="st-service-link">İncele →</span>
                        </div>
                    </motion.a>
                ))}
            </section>

            {/* SÜREÇ — arka planda soluk dev numaralarla yatay liste */}
            <section id="surec" className="st-process">
                <div className="st-section-head">
                    <span className="st-eyebrow">Çalışma Sürecimiz</span>
                    <h2>Keşiften montaja dört adım</h2>
                </div>
                <div className="st-process-list">
                    {processSteps.map((step, i) => (
                        <motion.div
                            key={step.n}
                            className="st-process-item"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.4 }}
                            variants={fadeUp}
                            custom={i}
                        >
                            <span className="st-process-bg" aria-hidden="true">{step.n}</span>
                            <h3>{step.t}</h3>
                            <p>{step.d}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ATÖLYEDEN — kaydırmayla koreografi kuran görsel vitrin */}
            <section className="showcase-section">
                <div className="st-section-head st-section-head-centered">
                    <span className="st-eyebrow">Atölyeden</span>
                    <h2>Gerçek projelerimizden kesitler</h2>
                </div>
                <ScrollChoreography
                    images={{
                        topLeft: "/gallery/galeri1.jpg",
                        topRight: "/gallery/galeri6.jpg",
                        bottomLeft: "/gallery/galeri3.jpg",
                        bottomRight: "/gallery/galeri4.jpg",
                    }}
                />
            </section>

            {/* HAKKIMIZDA — tek sütun, ortalanmış */}
            <section id="hakkimizda" className="st-about">
                <motion.div
                    className="st-about-image"
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7 }}
                >
                    <Image src="/gallery/galeri2.jpg" alt="Lavinya Perde atölyesinden bir kesit" fill style={{ objectFit: "cover" }} sizes="100vw" />
                </motion.div>
                <div className="st-about-copy">
                    <span className="st-eyebrow st-eyebrow-dark">Hakkımızda</span>
                    <h2>Lavinya Perde</h2>
                    <p>Balıkesir&apos;de yıllardır perde ve dekorasyon üzerine çalışıyoruz. Kumaş seçiminden dikime, montajdan sonrasına kadar süreci birlikte yürütüyoruz. Geniş kumaş arşivimiz ve deneyimli montaj ekibimizle evinize uzun süre eskimeyen bir dokunuş katıyoruz.</p>
                    <div className="st-about-badges">
                        {aboutBadges.map((item, i) => (
                            <motion.span
                                key={item}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.4 }}
                                variants={fadeUp}
                                custom={i}
                            >
                                {item}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </section>

            {/* KAPANIŞ — iki sütun: başlık/metin solda, iletişim kartı sağda */}
            <section className="st-cta">
                <div className="st-cta-text">
                    <span className="st-eyebrow">Ücretsiz Keşif</span>
                    <h2>Mekanınız için doğru<br />kumaşı birlikte bulalım</h2>
                    <p>Uzman ekibimiz yerinde ölçüm alsın, size özel teklifi hazırlayalım. İlk görüşme tamamen ücretsizdir.</p>
                    <a href="https://wa.me/905055102287" target="_blank" rel="noopener noreferrer" className="st-btn st-btn-light">
                        {icons.whatsapp}
                        <span>WhatsApp&apos;tan Yazın</span>
                    </a>
                </div>
                <div className="st-cta-card">
                    <div className="st-cta-card-row">
                        <span className="st-cta-icon">{icons.phone}</span>
                        <div>
                            <span className="st-cta-label">Telefon</span>
                            <a href="tel:+905055102287">0505 510 22 87</a>
                        </div>
                    </div>
                    <div className="st-cta-card-row">
                        <span className="st-cta-icon">{icons.pin}</span>
                        <div>
                            <span className="st-cta-label">Adres</span>
                            <span>Bahçelievler, Mehmetcik Cd. No:60/A, Altıeylül / Balıkesir</span>
                        </div>
                    </div>
                    <div className="st-cta-card-row">
                        <span className="st-cta-icon">{icons.fon}</span>
                        <div>
                            <span className="st-cta-label">Çalışma Saatleri</span>
                            <span>Pzt – Cmt: 09:00 – 19:00</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
