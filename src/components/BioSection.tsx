import React from "react";
import { PersonalSiteData } from "../types";
import { OmarchyTheme } from "../themes";
import { ExternalLink, Sparkles, MapPin } from "lucide-react";

interface BioSectionProps {
  data: PersonalSiteData;
  currentTheme: OmarchyTheme;
  onOpenEdit?: () => void;
  onOpenVoice?: () => void;
  onOpenLauncher?: () => void;
}

export const BioSection: React.FC<BioSectionProps> = ({
  data,
  currentTheme,
}) => {
  const firstName = data.name.split(" ")[0] || data.name;
  const lastName = data.name.split(" ").slice(1).join(" ") || "";

  return (
    <div className="flex flex-col justify-center space-y-4 sm:space-y-6 w-full font-sans">
      {/* Location & Status Indicator */}
      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full border bg-black/40 backdrop-blur-sm"
          style={{
            borderColor: currentTheme.border,
            color: currentTheme.text,
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: currentTheme.accent }}
          />
          <MapPin className="w-3 h-3 text-zinc-400" />
          <span className="text-zinc-300">Nairobi, Kenya</span>
        </span>
      </div>

      {/* Main Name Heading with Variable Font (Roboto Flex) */}
      <div className="space-y-1">
        <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95] text-white">
          <span className="font-variable-title block text-white select-none">
            {firstName}
          </span>
          {lastName && (
            <span className="font-variable-title block text-white/90 select-none">
              {lastName}
            </span>
          )}
        </h1>
        <p
          className="pt-2 text-sm sm:text-base font-mono tracking-wide flex items-center gap-2 font-medium"
          style={{ color: currentTheme.accent }}
        >
          <span>{data.title}</span>
        </p>
      </div>

      {/* Narrative Bio */}
      <div className="text-sm sm:text-base leading-relaxed text-zinc-300 font-sans space-y-3">
        <p>
          I&apos;m a Digital Artist from East Africa, studied at the{" "}
          <a
            href={data.university.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-variable-bio-link underline decoration-current/30 hover:decoration-current inline-flex items-center gap-0.5 font-medium transition-colors"
            style={{ color: currentTheme.accent }}
          >
            <span>{data.university.name}</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
          .
        </p>
        <p className="text-zinc-400">
          Big fan of open-source and an enthusiastic explorer at the intersection of art and digital technology.
        </p>
        <p className="text-zinc-300">
          My favorite tools are{" "}
          {data.tools.map((tool, idx) => (
            <React.Fragment key={tool.name}>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-variable-bio-link inline-flex items-center px-0.5 font-medium transition-colors"
                style={{ color: currentTheme.accent }}
              >
                {tool.name}
              </a>
              {idx < data.tools.length - 1 ? ", " : " "}
            </React.Fragment>
          ))}
          {data.favoriteToolHighlight && data.favoriteToolUrl && (
            <>
              and currently fascinated with{" "}
              <a
                href={data.favoriteToolUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-variable-bio-link font-medium inline-flex items-center px-0.5 transition-colors"
                style={{ color: currentTheme.accentSecondary }}
              >
                {data.favoriteToolHighlight}
              </a>
              .
            </>
          )}
        </p>
      </div>

      {/* Clean Minimal Tool Pills */}
      <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs font-mono">
        {data.tools.map((tool) => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all inline-flex items-center gap-1.5"
          >
            <span>{tool.name}</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-50" />
          </a>
        ))}
        {data.favoriteToolHighlight && (
          <a
            href={data.favoriteToolUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-lg border text-xs font-medium transition-all inline-flex items-center gap-1.5"
            style={{
              borderColor: `${currentTheme.accentSecondary}50`,
              color: currentTheme.accentSecondary,
              backgroundColor: `${currentTheme.accentSecondary}10`,
            }}
          >
            <Sparkles className="w-3 h-3 text-[#ffed00]" />
            <span>{data.favoriteToolHighlight}</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        )}
      </div>
    </div>
  );
};
