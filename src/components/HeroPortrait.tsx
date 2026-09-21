import React, { useState, useRef, useEffect } from "react";
import { OmarchyTheme } from "../themes";
import { sound } from "../utils/sound";

interface HeroPortraitProps {
  currentTheme: OmarchyTheme;
  className?: string;
}

export const HeroPortrait: React.FC<HeroPortraitProps> = ({ currentTheme, className = "" }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isHoodieHovered, setIsHoodieHovered] = useState(false);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [hoodieColorIndex, setHoodieColorIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Available interactive accents for hoodie
  const hoodieColors = [
    currentTheme.accent,
    currentTheme.accentSecondary,
    currentTheme.accentTertiary,
    "#ffffff",
  ];
  const activeHoodieHoverColor = hoodieColors[hoodieColorIndex % hoodieColors.length];

  useEffect(() => {
    let isMounted = true;
    fetch("/portrait.svg")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load SVG");
        return res.text();
      })
      .then((text) => {
        if (isMounted) {
          setSvgContent(text);
        }
      })
      .catch((err) => {
        console.warn("Using fallback img for portrait:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Attach tactile audio & interaction handlers directly to SVG #hoodie_col element
  useEffect(() => {
    if (!svgContent || !containerRef.current) return;
    const hoodie = containerRef.current.querySelector<SVGElement>("#hoodie_col");
    if (!hoodie) return;

    const handleMouseEnter = () => {
      setIsHoodieHovered(true);
      sound.playBlip(1250);
    };

    const handleMouseLeave = () => {
      setIsHoodieHovered(false);
    };

    const handleClick = () => {
      sound.playSwitch();
      setHoodieColorIndex((prev) => (prev + 1) % hoodieColors.length);
    };

    hoodie.addEventListener("mouseenter", handleMouseEnter);
    hoodie.addEventListener("mouseleave", handleMouseLeave);
    hoodie.addEventListener("click", handleClick);

    // Audio and tactile response for "thefutureisnow" tagline
    const futureText = containerRef.current.querySelector<SVGElement>("#thefutureisnow");
    let stopMarchingSound: (() => void) | null = null;

    const handleFutureEnter = () => {
      sound.playBlip(1600);
      if (stopMarchingSound) {
        stopMarchingSound();
      }
      stopMarchingSound = sound.startMarchingAntsLoop();
    };

    const handleFutureLeave = () => {
      if (stopMarchingSound) {
        stopMarchingSound();
        stopMarchingSound = null;
      }
    };

    if (futureText) {
      futureText.addEventListener("mouseenter", handleFutureEnter);
      futureText.addEventListener("mouseleave", handleFutureLeave);
    }

    return () => {
      hoodie.removeEventListener("mouseenter", handleMouseEnter);
      hoodie.removeEventListener("mouseleave", handleMouseLeave);
      hoodie.removeEventListener("click", handleClick);
      if (futureText) {
        futureText.removeEventListener("mouseenter", handleFutureEnter);
        futureText.removeEventListener("mouseleave", handleFutureLeave);
      }
      if (stopMarchingSound) {
        stopMarchingSound();
        stopMarchingSound = null;
      }
    };
  }, [svgContent, hoodieColors.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={
        {
          "--hoodie-hover-color": activeHoodieHoverColor,
        } as React.CSSProperties
      }
      className={`relative flex items-center justify-center select-none w-full max-w-[340px] xs:max-w-[400px] sm:max-w-[460px] md:max-w-[500px] lg:max-w-[540px] mx-auto py-4 ${className}`}
    >
      {/* Ambient Theme Halo Backdrop */}
      <div
        className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-35 transition-all duration-700 pointer-events-none transform scale-95"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${activeHoodieHoverColor} 0%, ${currentTheme.accentSecondary} 40%, transparent 70%)`,
        }}
      />

      {/* Portrait Artwork Container with subtle optical depth on hover */}
      <div
        className="relative w-full transition-transform duration-300 ease-out flex justify-center items-center [&_svg]:w-full [&_svg]:h-auto [&_svg]:overflow-visible [&_svg]:drop-shadow-[0_16px_32px_rgba(0,0,0,0.6)]"
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateY(${mousePos.x * 6}deg) rotateX(${-mousePos.y * 6}deg) scale(1.02)`
            : "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)",
        }}
      >
        {svgContent ? (
          <div
            className="w-full flex justify-center items-center overflow-visible"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <img
            id="hero-vector-portrait"
            src="/portrait.svg"
            alt="Dennis Mabuka - Self Portrait Vector Artwork"
            className="w-full h-auto object-contain mx-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)] transition-all duration-500"
            loading="eager"
            decoding="async"
          />
        )}
      </div>

      {/* Subtle indicator pill when hovering the hoodie */}
      <div
        className={`absolute bottom-0 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider transition-all duration-300 pointer-events-none border ${
          isHoodieHovered
            ? "opacity-90 translate-y-0 bg-black/80 text-white border-white/20 shadow-lg"
            : "opacity-0 translate-y-2 border-transparent"
        }`}
        style={{
          color: activeHoodieHoverColor,
        }}
      >
        <span>hoodie::active</span>
      </div>
    </div>
  );
};

