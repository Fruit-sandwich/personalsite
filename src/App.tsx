import React, { useState, useEffect } from "react";
import { PersonalSiteData } from "./types";
import { INITIAL_SITE_DATA } from "./data/defaultData";
import { OmarchyTheme, OMARCHY_THEMES } from "./themes";
import { QuickshellBar } from "./components/QuickshellBar";
import { HeroPortrait } from "./components/HeroPortrait";
import { BioSection } from "./components/BioSection";
import { ProjectsList } from "./components/ProjectsList";
import { QuickshellLauncher } from "./components/QuickshellLauncher";
import { SiteEditorModal } from "./components/SiteEditorModal";
import { VoiceTranscribeModal } from "./components/VoiceTranscribeModal";
import { Terminal, Command, Palette, Sparkles, Layers, Download } from "lucide-react";
import { sound } from "./utils/sound";

const STORAGE_KEY = "dennis_mabuka_personal_site_v5";
const THEME_STORAGE_KEY = "dm_portfolio_theme_v2";

export default function App() {
  const [siteData, setSiteData] = useState<PersonalSiteData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.sections)) {
          parsed.sections = parsed.sections.filter(
            (s: { id?: string; title?: string }) =>
              s.id !== "socials" && !s.title?.toLowerCase().includes("find me")
          );
        }
        return parsed;
      }
    } catch (e) {
      console.warn("Could not read site data:", e);
    }
    return INITIAL_SITE_DATA;
  });

  const [currentTheme, setCurrentTheme] = useState<OmarchyTheme>(() => {
    try {
      const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY);
      const found = OMARCHY_THEMES.find((t) => t.id === savedThemeId);
      if (found) return found;
    } catch (e) {
      console.warn(e);
    }
    return OMARCHY_THEMES[0]; // Default: Omarchy Emerald
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => sound.getEnabled());

  const handleToggleSound = () => {
    const next = sound.toggle();
    setSoundEnabled(next);
  };

  // Apply CSS custom properties whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--theme-bg", currentTheme.bg);
    root.style.setProperty("--theme-bar-bg", currentTheme.barBg);
    root.style.setProperty("--theme-border", currentTheme.border);
    root.style.setProperty("--theme-accent", currentTheme.accent);
    root.style.setProperty("--theme-accent-secondary", currentTheme.accentSecondary);
    root.style.setProperty("--theme-accent-tertiary", currentTheme.accentTertiary);
    root.style.setProperty("--theme-text", currentTheme.text);
    root.style.setProperty("--theme-glow", currentTheme.glowColor);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme.id);
    } catch (e) {
      console.warn(e);
    }
  }, [currentTheme]);

  // Keyboard shortcut: only Cmd/Ctrl+K (avoid capturing Space which conflicts with native Omarchy OS launcher)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        sound.playBlip(900);
        setIsLauncherOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Variable Font Swell Tactile Audio:
  // Dynamically attach audio feedback whenever hovering over variable-font elements
  useEffect(() => {
    let lastSwellTime = 0;
    const SWELL_COOLDOWN = 60; // ms to avoid audio jitter on rapid cursor jitter

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        ".font-variable-title, .font-variable-heading, .font-variable-link, .font-variable-bio-link"
      );
      if (!target) return;

      const now = Date.now();
      if (now - lastSwellTime < SWELL_COOLDOWN) return;
      lastSwellTime = now;

      if (target.classList.contains("font-variable-title")) {
        sound.playSwell("heavy");
      } else if (target.classList.contains("font-variable-heading")) {
        sound.playSwell("medium");
      } else if (target.classList.contains("font-variable-bio-link") || target.classList.contains("font-variable-link")) {
        sound.playSwell("light");
      }
    };

    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  const handleSaveData = (newData: PersonalSiteData) => {
    setSiteData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error("Failed to save site data:", e);
    }
  };

  const handleResetData = () => {
    sound.playClick();
    setSiteData(INITIAL_SITE_DATA);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyVoiceBio = (transcription: string) => {
    const updated = {
      ...siteData,
      bio: `${siteData.bio}\n\n${transcription}`,
      datePublished: new Date().toISOString(),
    };
    handleSaveData(updated);
  };

  const handleDownloadBackup = () => {
    sound.playSuccess();
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(siteData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `dennis-mabuka-portfolio-${new Date().toISOString().split("T")[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans antialiased transition-colors duration-500"
      style={{
        backgroundColor: currentTheme.bg,
        color: currentTheme.text,
      }}
    >
      {/* Floating Quickshell Island Bar */}
      <QuickshellBar
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        onOpenLauncher={() => setIsLauncherOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-9 space-y-6 sm:space-y-8">
        {/* Landing Hero Section: SVG Hero Portrait carries prominent weight next to short bio */}
        <section
          id="hero"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center"
        >
          {/* Hero SVG Portrait - 7 of 12 columns for visual supremacy */}
          <div className="lg:col-span-7 flex justify-center order-1 lg:order-2">
            <HeroPortrait currentTheme={currentTheme} />
          </div>

          {/* Short Bio Column - 5 of 12 columns */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <BioSection
              data={siteData}
              currentTheme={currentTheme}
              onOpenEdit={() => setIsEditorOpen(true)}
              onOpenVoice={() => setIsVoiceOpen(true)}
              onOpenLauncher={() => setIsLauncherOpen(true)}
            />
          </div>
        </section>

        {/* Selected Works & Explorations - Compact Quickshell Terminal Window */}
        <section id="projects" className="pt-1">
          <ProjectsList
            sections={siteData.sections}
            socials={siteData.socials}
            currentTheme={currentTheme}
          />
        </section>
      </main>

      {/* Minimal Bottom Status Dock */}
      <footer className="w-full border-t border-zinc-800/80 bg-black/40 py-4 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5" style={{ color: currentTheme.accent }} />
            <span>
              &copy; {new Date().getFullYear()} {siteData.name} • Digital Artist &amp; Designer
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsLauncherOpen(true);
              }}
              className="hover:text-zinc-300 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Menu & Search"
            >
              <Command className="w-3.5 h-3.5" style={{ color: currentTheme.accent }} />
              <span>Menu</span>
            </button>
            <span className="text-zinc-700">&bull;</span>
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="hover:underline cursor-pointer flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
              title="Download portfolio JSON backup"
            >
              <Download className="w-3 h-3" style={{ color: currentTheme.accent }} />
              <span>Backup JSON</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Menu / Launcher Modal */}
      <QuickshellLauncher
        isOpen={isLauncherOpen}
        onClose={() => setIsLauncherOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        siteData={siteData}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenEdit={() => setIsEditorOpen(true)}
      />

      {/* Site Editor Modal */}
      <SiteEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        data={siteData}
        onSave={handleSaveData}
        onReset={handleResetData}
      />

      {/* Voice Transcription Modal (Gemini 3.5 Transcribe) */}
      <VoiceTranscribeModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onApplyTranscription={handleApplyVoiceBio}
      />
    </div>
  );
}
