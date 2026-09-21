import React, { useState } from "react";
import { ProjectSection, SocialLink } from "../types";
import { OmarchyTheme } from "../themes";
import { ExternalLink, Terminal, Folder, Hash } from "lucide-react";
import { sound } from "../utils/sound";

interface ProjectsListProps {
  sections: ProjectSection[];
  socials: SocialLink[];
  currentTheme: OmarchyTheme;
  onOpenIdentity?: () => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  sections,
  socials,
  currentTheme,
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");

  const handleTabSelect = (tab: string) => {
    sound.playBlip(1050);
    setActiveTab(tab);
  };

  const getSectionAccent = (colorType: ProjectSection["colorType"]) => {
    switch (colorType) {
      case "yellow":
        return currentTheme.accentTertiary;
      case "magenta":
        return currentTheme.accentSecondary;
      case "green":
        return currentTheme.accent;
      case "white":
      default:
        return currentTheme.text;
    }
  };

  // Filter out redundant "find me" section since socials has its own dedicated pane
  const validSections = sections.filter(
    (s) => s.id !== "socials" && !s.title.toLowerCase().includes("find me")
  );

  const totalItems = validSections.reduce((acc, s) => acc + s.items.length, 0) + socials.length;

  const displayedSections =
    activeTab === "all"
      ? validSections
      : validSections.filter((s) => s.id === activeTab);

  const showSocials = activeTab === "all" || activeTab === "connect";

  return (
    <div className="w-full space-y-4 pt-4 sm:pt-6 font-mono">
      {/* Hyprland Window Container with Active Border Gradient */}
      <div
        className="rounded-2xl p-[1.5px] transition-all duration-500 shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.accent}80 0%, ${currentTheme.accentSecondary}50 50%, ${currentTheme.border} 100%)`,
          boxShadow: `0 20px 50px -10px rgba(0,0,0,0.8), 0 0 20px -5px ${currentTheme.glowColor}`,
        }}
      >
        <div className="bg-[#0c0c11]/95 backdrop-blur-xl rounded-[15px] overflow-hidden border border-white/5">
          {/* Terminal Title Bar */}
          <div className="px-3.5 py-2.5 bg-[#121218]/90 border-b border-zinc-800/90 flex flex-wrap items-center justify-between gap-3 text-xs select-none">
            {/* Left: Terminal Window Tag */}
            <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
              <Terminal className="w-3.5 h-3.5" style={{ color: currentTheme.accent }} />
              <span className="text-zinc-200 font-medium">~/works</span>
            </div>

            {/* Center: Interactive Workspace Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
              <button
                type="button"
                onClick={() => handleTabSelect("all")}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "all"
                    ? "bg-white/10 text-white font-bold border border-white/20"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                [00/all]
              </button>
              {validSections.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleTabSelect(s.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === s.id
                      ? "bg-white/10 text-white font-bold border border-white/20"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                  }`}
                  style={{
                    color: activeTab === s.id ? getSectionAccent(s.colorType) : undefined,
                  }}
                >
                  [0{idx + 1}/{s.id}]
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleTabSelect("connect")}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "connect"
                    ? "bg-white/10 text-white font-bold border border-white/20"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                [0{validSections.length + 1}/connect]
              </button>
            </div>

            {/* Right: Host Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
              <span
                className="w-1.5 h-1.5 rounded-full animate-ping"
                style={{ backgroundColor: currentTheme.accent }}
              />
              <span className="text-zinc-400">dennis@nairobi</span>
            </div>
          </div>

          {/* Terminal Command Line Header */}
          <div className="px-4 py-2 bg-[#09090e] border-b border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400 font-mono">
            <div className="flex items-center gap-2 truncate">
              <span style={{ color: currentTheme.accent }}>dennis@nairobi</span>
              <span className="text-zinc-600">:</span>
              <span className="text-zinc-300">~/works</span>
              <span className="text-zinc-500">$</span>
              <span className="text-zinc-200">ls -la</span>
            </div>
            <span className="hidden md:inline text-[11px] text-zinc-500">
              total {totalItems} items
            </span>
          </div>

          {/* Terminal Tiling Split Content Grid (3 works sections + 1 connect section = 4 balanced columns) */}
          <div
            className={`p-3 sm:p-5 grid gap-5 lg:gap-4 ${
              activeTab === "all"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-zinc-800/80"
                : "grid-cols-1"
            }`}
          >
            {displayedSections.map((section, sIdx) => {
              const accentColor = getSectionAccent(section.colorType);

              return (
                <div
                  key={section.id}
                  className={`space-y-3 ${
                    sIdx > 0 && activeTab === "all" ? "pt-4 sm:pt-0 lg:pl-4" : ""
                  }`}
                >
                  {/* Terminal Directory Title */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800/80">
                    <div className="flex items-center gap-1.5 truncate">
                      <Folder className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                      <h3
                        className="text-xs sm:text-sm tracking-wide font-bold uppercase truncate"
                        style={{ color: accentColor }}
                      >
                        {section.title}
                      </h3>
                    </div>
                    <span className="text-zinc-500 text-[10px] select-none font-mono">
                      [{section.items.length}]
                    </span>
                  </div>

                  {/* Terminal Directory Files */}
                  <ul className="space-y-1">
                    {section.items.map((item, idx) => (
                      <li key={item.id}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between gap-1.5 py-1.5 px-2 rounded-lg text-xs sm:text-sm text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-all border-l-2 border-transparent hover:border-current -mx-1"
                          title={item.description || item.title}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span className="text-zinc-600 text-[10px] select-none font-mono">
                              0{idx + 1}
                            </span>
                            <span
                              className="text-xs transition-colors font-bold select-none"
                              style={{ color: currentTheme.accent }}
                            >
                              »
                            </span>
                            <span className="font-variable-link truncate tracking-tight text-zinc-200 group-hover:text-white font-mono">
                              {item.title}
                            </span>
                          </span>

                          <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 opacity-40 group-hover:opacity-100 ml-1.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* Socials & Arweave Terminal Column */}
            {showSocials && (
              <div
                className={`space-y-3 ${
                  activeTab === "all" ? "pt-4 sm:pt-0 lg:pl-4" : ""
                }`}
              >
                {/* Connect Directory Title */}
                <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800/80">
                  <div className="flex items-center gap-1.5 truncate">
                    <Hash className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.accent }} />
                    <h3 className="text-xs sm:text-sm tracking-wide font-bold uppercase text-zinc-200 truncate">
                      CONNECT
                    </h3>
                  </div>
                  <span className="text-zinc-500 text-[10px] select-none font-mono">
                    [{socials.length}]
                  </span>
                </div>

                <ul className="space-y-1">
                  {socials.map((soc, idx) => (
                    <li key={soc.id}>
                      <a
                        href={soc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => sound.playClick()}
                        className="group flex items-center justify-between gap-1.5 py-1.5 px-2 rounded-lg text-xs sm:text-sm text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-all border-l-2 border-transparent hover:border-current -mx-1"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span className="text-zinc-600 text-[10px] select-none font-mono">
                            0{idx + 1}
                          </span>
                          <span
                            className="text-xs transition-colors font-bold select-none"
                            style={{ color: currentTheme.accent }}
                          >
                            »
                          </span>
                          <span className="font-variable-link truncate tracking-tight text-zinc-200 group-hover:text-white font-mono">
                            {soc.label}
                          </span>
                        </span>

                        <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 opacity-40 group-hover:opacity-100 ml-1.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Linux Hyprland Terminal Statusline (Neovim / Tmux Style) */}
          <div className="px-3 sm:px-4 py-1.5 bg-[#09090e] border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-[11px] text-zinc-500 font-mono gap-2">
            {/* Left Status Badges */}
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.2 rounded text-[10px] font-bold text-black select-none tracking-wide"
                style={{ backgroundColor: currentTheme.accent }}
              >
                NORMAL
              </span>
              <span className="hidden xs:inline text-zinc-400">git:(main)</span>
              <span className="text-zinc-700">|</span>
              <span className="text-zinc-400">UTF-8</span>
              <span className="hidden sm:inline text-zinc-700">|</span>
              <span className="hidden sm:inline text-zinc-400">
                {validSections.reduce((acc, s) => acc + s.items.length, 0)} files
              </span>
            </div>

            {/* Right Status Badges */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">tiled</span>
              <span
                className="inline-block w-1.5 h-3 animate-terminal-blink align-middle"
                style={{ backgroundColor: currentTheme.accent }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
