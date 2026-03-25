"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function LoadingCurtain() {
    const [phase, setPhase] = useState<"hidden" | "closed" | "opening" | "done">("hidden");
    const calledRef = useRef(false);

    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;

        // Adım 1: Göster (kapalı perde)
        setPhase("closed");

        // Adım 2: 800ms sonra açılış animasyonunu başlat
        const t1 = setTimeout(() => setPhase("opening"), 800);

        // Adım 3: Animasyon bittikten sonra kaldır
        const t2 = setTimeout(() => setPhase("done"), 2400);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    if (phase === "hidden" || phase === "done") return null;

    const isOpening = phase === "opening";

    return (
        <>
            <style>{`
                @keyframes curtainLeft {
                    0%   { transform: translateX(0) scaleX(1); }
                    100% { transform: translateX(-105%) scaleX(0.92); }
                }
                @keyframes curtainRight {
                    0%   { transform: translateX(0) scaleX(1); }
                    100% { transform: translateX(105%) scaleX(0.92); }
                }
                @keyframes logoFadeIn {
                    0%   { opacity: 0; transform: translate(-50%, -46%) scale(0.9); }
                    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
                @keyframes logoFadeOut {
                    0%   { opacity: 1; }
                    100% { opacity: 0; }
                }
                .lc-left  { animation: ${isOpening ? "curtainLeft  1.35s cubic-bezier(0.76,0,0.24,1) forwards" : "none"}; }
                .lc-right { animation: ${isOpening ? "curtainRight 1.35s cubic-bezier(0.76,0,0.24,1) forwards" : "none"}; }
                .lc-logo  { animation: ${isOpening ? "logoFadeOut 0.5s ease 0.15s forwards" : "logoFadeIn 0.6s ease forwards"}; }
            `}</style>

            {/* Wrapper */}
            <div style={{ position:"fixed", inset:0, zIndex:99999, display:"flex", pointerEvents:"all" }} aria-hidden="true">

                {/* SOL PERDE */}
                <div
                    className="lc-left"
                    style={{
                        width: "50%",
                        height: "100%",
                        position: "relative",
                        overflow: "hidden",
                        transformOrigin: "right center",
                        /* Kadife kırmızı perde benzeri gradient */
                        background: `
                            repeating-linear-gradient(
                                to right,
                                rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.0) 6px,
                                rgba(0,0,0,0.12) 6px, rgba(0,0,0,0.0) 12px,
                                rgba(255,255,255,0.06) 12px, rgba(255,255,255,0.0) 18px,
                                rgba(0,0,0,0.08) 18px, rgba(0,0,0,0.0) 24px
                            ),
                            linear-gradient(
                                to bottom,
                                #1a0a2e 0%, #2a0a1e 25%, #1a0520 50%, #0d0215 75%, #0a0a18 100%
                            )
                        `,
                    }}
                >
                    {/* Sağ kenar dramatik gölge */}
                    <div style={{
                        position:"absolute", top:0, right:0, width:50, height:"100%",
                        background:"linear-gradient(to right, transparent, rgba(0,0,0,0.7))",
                    }} />
                    {/* Üst mor aksan */}
                    <div style={{
                        position:"absolute", top:0, left:0, right:0, height:4,
                        background:"linear-gradient(90deg, #3d1a5e, #8b669e, #b89dd4, #8b669e, #3d1a5e)",
                    }} />
                </div>

                {/* ORTA LOGO */}
                <div
                    className="lc-logo"
                    style={{
                        position:"absolute",
                        left:"50%",
                        top:"50%",
                        transform:"translate(-50%, -50%)",
                        zIndex:10,
                        display:"flex",
                        flexDirection:"column",
                        alignItems:"center",
                        gap:"1rem",
                        pointerEvents:"none",
                        whiteSpace:"nowrap",
                    }}
                >
                    <Image
                        src="/logo.png"
                        alt="Lavinya Perde"
                        width={95}
                        height={95}
                        priority
                        style={{ objectFit:"contain", filter:"drop-shadow(0 0 28px rgba(184,157,212,0.95))" }}
                    />
                    <span style={{
                        fontFamily:"'Poppins', sans-serif",
                        fontSize:"1.45rem",
                        fontWeight:700,
                        letterSpacing:6,
                        color:"#fff",
                        textShadow:"0 0 30px rgba(184,157,212,0.9), 0 2px 8px rgba(0,0,0,0.8)",
                    }}>
                        LAVİNYA PERDE
                    </span>
                </div>

                {/* SAĞ PERDE */}
                <div
                    className="lc-right"
                    style={{
                        width:"50%",
                        height:"100%",
                        position:"relative",
                        overflow:"hidden",
                        transformOrigin:"left center",
                        background:`
                            repeating-linear-gradient(
                                to right,
                                rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.0) 6px,
                                rgba(0,0,0,0.12) 6px, rgba(0,0,0,0.0) 12px,
                                rgba(255,255,255,0.06) 12px, rgba(255,255,255,0.0) 18px,
                                rgba(0,0,0,0.08) 18px, rgba(0,0,0,0.0) 24px
                            ),
                            linear-gradient(
                                to bottom,
                                #1a0a2e 0%, #2a0a1e 25%, #1a0520 50%, #0d0215 75%, #0a0a18 100%
                            )
                        `,
                    }}
                >
                    {/* Sol kenar gölge */}
                    <div style={{
                        position:"absolute", top:0, left:0, width:50, height:"100%",
                        background:"linear-gradient(to left, transparent, rgba(0,0,0,0.7))",
                    }} />
                    {/* Üst mor aksan */}
                    <div style={{
                        position:"absolute", top:0, left:0, right:0, height:4,
                        background:"linear-gradient(90deg, #3d1a5e, #8b669e, #b89dd4, #8b669e, #3d1a5e)",
                    }} />
                </div>
            </div>
        </>
    );
}
