import React, { useState, useRef, useEffect } from "react";
import { OmarchyTheme, OMARCHY_THEMES } from "../themes";
import { Command, Palette, Check, Volume2, VolumeX } from "lucide-react";
import { sound } from "../utils/sound";

interface QuickshellBarProps {
  currentTheme: OmarchyTheme;
  onSelectTheme: (theme: OmarchyTheme) => void;
  onOpenLauncher: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenIdentity?: () => void;
  onOpenVoice?: () => void;
  onOpenEdit?: () => void;
}

export const QuickshellBar: React.FC<QuickshellBarProps> = ({
  currentTheme,
  onSelectTheme,
  onOpenLauncher,
  soundEnabled,
  onToggleSound,
}) => {
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    if (themeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [themeDropdownOpen]);

  return (
    <header className="sticky top-3 sm:top-4 z-40 w-full px-3 sm:px-6 max-w-6xl mx-auto">
      <div
        className="rounded-2xl backdrop-blur-xl px-3.5 sm:px-4 py-2 flex items-center justify-between gap-3 text-xs select-none transition-all duration-300 border"
        style={{
          backgroundColor: currentTheme.barBg,
          borderColor: currentTheme.border,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.45)`,
        }}
      >
        {/* Left: Brand Identity with Subtle Geometric Marker */}
        <a
          href="#hero"
          onClick={() => sound.playClick()}
          className="flex items-center gap-2 text-zinc-200 hover:text-white transition-colors group cursor-pointer"
        >
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${currentTheme.accent}20` }}
          >
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke={currentTheme.accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 22h5l2.5-5h5l2.5 5h5L12 2z" />
              <path d="M9.5 17h5" />
            </svg>
          </div>
          <span className="font-semibold tracking-wider text-[13px] text-white font-mono">
            DENNIS MABUKA
          </span>
        </a>

        {/* Right: Theme Selector, Sound Toggle, and Command Palette */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Tactile Audio Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer text-xs flex items-center gap-1 ${
              soundEnabled
                ? "bg-white/15 text-white border-white/20 shadow-sm"
                : "bg-white/5 text-zinc-500 border-white/10 hover:text-zinc-300"
            }`}
            title={soundEnabled ? "Mute Mechanical Audio" : "Enable Tactile Mechanical Audio"}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" style={{ color: currentTheme.accent }} />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
            )}
          </button>

          {/* Theme Dropdown Toggle */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setThemeDropdownOpen((prev) => !prev);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors cursor-pointer text-xs"
              title="Change Theme"
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: currentTheme.accent }}
              />
              <span className="hidden sm:inline font-mono">{currentTheme.name}</span>
              <Palette className="w-3 h-3 text-zinc-400 ml-0.5" />
            </button>

            {themeDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl bg-[#131317] border shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                style={{ borderColor: currentTheme.border }}
              >
                <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  Color Themes
                </div>
                <div className="space-y-0.5">
                  {OMARCHY_THEMES.map((theme) => {
                    const isSelected = theme.id === currentTheme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => {
                          sound.playSwitch();
                          onSelectTheme(theme);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-left cursor-pointer ${
                          isSelected ? "bg-white/10 text-white font-medium" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: theme.accent }}
                          />
                          <span>{theme.name}</span>
                        </div>
                        {isSelected && (
                          <Check
                            className="w-3.5 h-3.5"
                            style={{ color: theme.accent }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Menu Trigger - Simple Icon */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenLauncher();
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer text-xs flex items-center justify-center"
            title="Menu"
            aria-label="Menu"
          >
            <Command className="w-3.5 h-3.5" style={{ color: currentTheme.accent }} />
          </button>
        </div>
      </div>
    </header>
  );
};
