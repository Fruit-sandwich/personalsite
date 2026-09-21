import React, { useState, useEffect, useRef } from "react";
import { OmarchyTheme, OMARCHY_THEMES } from "../themes";
import { PersonalSiteData } from "../types";
import {
  Search,
  Command,
  Palette,
  ExternalLink,
  Mic,
  Edit3,
  Sparkles,
  Terminal,
  X,
  Layers,
  Download,
} from "lucide-react";
import { sound } from "../utils/sound";

interface QuickshellLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: OmarchyTheme;
  onSelectTheme: (theme: OmarchyTheme) => void;
  siteData: PersonalSiteData;
  onOpenIdentity?: () => void;
  onOpenVoice?: () => void;
  onOpenEdit?: () => void;
}

export const QuickshellLauncher: React.FC<QuickshellLauncherProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  siteData,
  onOpenVoice,
  onOpenEdit,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      sound.playBlip(980);
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle keyboard shortcut Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        sound.playClick();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Flatten searchable commands & items
  const allItems: {
    id: string;
    type: "theme" | "project" | "action";
    title: string;
    subtitle: string;
    aliases?: string[];
    action: () => void;
    icon: React.ReactNode;
    badge?: string;
    disabled?: boolean;
  }[] = [
    // Theme options
    ...OMARCHY_THEMES.map((th) => ({
      id: `theme-${th.id}`,
      type: "theme" as const,
      title: `Theme: ${th.name}`,
      subtitle: th.tagline,
      action: () => {
        sound.playSwitch();
        onSelectTheme(th);
        onClose();
      },
      icon: <Palette className="w-4 h-4" style={{ color: th.accent }} />,
      badge: currentTheme.id === th.id ? "Active" : "Apply",
    })),

    // Actions
    {
      id: "action-download-backup",
      type: "action" as const,
      title: "Download Portfolio JSON Backup",
      subtitle: "Save full portfolio configuration as a downloadable .json file",
      aliases: ["backup", "download", "export", "json", ":export", ":backup"],
      action: () => {
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
        onClose();
      },
      icon: <Download className="w-4 h-4 text-[#3eed00]" />,
      badge: "JSON Backup",
    },
    {
      id: "action-edit",
      type: "action" as const,
      title: "Site Content Editor",
      subtitle: "Managed directly in source codebase (builder mode)",
      aliases: ["edit", ":edit", "update", "customize", "modify"],
      action: () => {},
      disabled: true,
      icon: <Edit3 className="w-4 h-4 text-zinc-500" />,
      badge: "Builder Only",
    },
    ...(onOpenVoice
      ? [
          {
            id: "action-voice",
            type: "action" as const,
            title: "Voice Dictation // Gemini Transcribe",
            subtitle: "Record microphone audio and update bio with AI",
            aliases: ["voice", "dictate", "record", "ai", "transcribe"],
            action: () => {},
            disabled: true,
            icon: <Mic className="w-4 h-4 text-zinc-500" />,
            badge: "Builder Only",
          },
        ]
      : []),

    // Projects
    ...siteData.sections.flatMap((sec) =>
      sec.items.map((item) => ({
        id: `proj-${item.id}`,
        type: "project" as const,
        title: item.title,
        subtitle: `${sec.title} • ${item.url}`,
        action: () => {
          sound.playClick();
          window.open(item.url, "_blank", "noopener,noreferrer");
          onClose();
        },
        icon: <ExternalLink className="w-4 h-4 text-[#3eed00]" />,
        badge: item.badge || sec.title,
      }))
    ),
  ];

  const q = query.trim().toLowerCase();
  const filteredItems = allItems.filter((item) => {
    if (!q) return true;
    if (item.title.toLowerCase().includes(q)) return true;
    if (item.subtitle.toLowerCase().includes(q)) return true;
    if (item.aliases && item.aliases.some((alias) => alias.toLowerCase().includes(q) || q.includes(alias.toLowerCase()))) {
      return true;
    }
    return false;
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      sound.playClick(0.9);
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      sound.playClick(1.1);
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex] && !filteredItems[selectedIndex].disabled) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-4 bg-black/75 backdrop-blur-md animate-fade-in font-terminal">
      {/* Background click to dismiss */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Launcher Window */}
      <div className="w-full max-w-2xl rounded-2xl bg-[#141418] border border-zinc-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Launcher Top Search Input */}
        <div className="p-3 sm:p-4 bg-[#18181e] border-b border-zinc-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search commands, projects, themes..."
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-sans"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-black/50 border border-zinc-700 text-[10px] text-zinc-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto space-y-1 flex-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No matching commands or projects found.
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={item.disabled ? undefined : item.action}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between p-2.5 rounded-xl transition-colors text-xs ${
                  item.disabled
                    ? "opacity-35 cursor-not-allowed select-none"
                    : selectedIndex === idx
                    ? "bg-white/10 text-white shadow-sm cursor-pointer"
                    : "text-zinc-300 hover:bg-white/5 cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/5 shrink-0">
                    {item.icon}
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-white tracking-tight truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">{item.subtitle}</p>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className="ml-2 px-2 py-0.5 text-[10px] rounded font-mono uppercase tracking-wider shrink-0 border"
                    style={{
                      borderColor: currentTheme.accent,
                      color: currentTheme.accent,
                      backgroundColor: "rgba(0,0,0,0.4)",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Info */}
        <div className="px-4 py-2 bg-[#101014] border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
            <span style={{ color: currentTheme.accent }}>palette</span>
          </div>
        </div>
      </div>
    </div>
  );
};
