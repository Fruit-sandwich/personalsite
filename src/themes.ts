export interface ThemeConfig {
  id: string;
  name: string;
  tagline: string;
  bg: string;
  cardBg: string;
  barBg: string;
  border: string;
  accent: string;          // Primary neon / highlight
  accentSecondary: string; // Supporting color
  accentTertiary: string;  // Tertiary accent
  text: string;
  textMuted: string;
  glowColor: string;
}

export type OmarchyTheme = ThemeConfig;

export const COLOR_THEMES: ThemeConfig[] = [
  {
    id: "emerald",
    name: "Emerald",
    tagline: "Cyber-neon emerald & magenta accents",
    bg: "#121214",
    cardBg: "#18181b",
    barBg: "#151518",
    border: "rgba(143, 255, 0, 0.25)",
    accent: "#8fff00",
    accentSecondary: "#ff0ae4",
    accentTertiary: "#ffed00",
    text: "#f4f4f5",
    textMuted: "#a1a1aa",
    glowColor: "rgba(143, 255, 0, 0.35)",
  },
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    tagline: "Midnight cyan & electric lavender",
    bg: "#16161e",
    cardBg: "#1a1b26",
    barBg: "#13141c",
    border: "rgba(125, 207, 255, 0.25)",
    accent: "#7dcfff",
    accentSecondary: "#bb9af7",
    accentTertiary: "#ff9e64",
    text: "#c0caf5",
    textMuted: "#7aa2f7",
    glowColor: "rgba(125, 207, 255, 0.35)",
  },
  {
    id: "catppuccin-mocha",
    name: "Catppuccin Mocha",
    tagline: "Soft lavender, rosewater & peach",
    bg: "#181825",
    cardBg: "#1e1e2e",
    barBg: "#14141e",
    border: "rgba(180, 190, 254, 0.25)",
    accent: "#b4befe",
    accentSecondary: "#f5c2e7",
    accentTertiary: "#fab387",
    text: "#cdd6f4",
    textMuted: "#a6adc8",
    glowColor: "rgba(180, 190, 254, 0.35)",
  },
  {
    id: "purplewave",
    name: "Purplewave",
    tagline: "Synthwave violet & vivid rose",
    bg: "#100c18",
    cardBg: "#181224",
    barBg: "#0d0914",
    border: "rgba(192, 132, 252, 0.3)",
    accent: "#c084fc",
    accentSecondary: "#f43f5e",
    accentTertiary: "#22d3ee",
    text: "#f3e8ff",
    textMuted: "#d8b4fe",
    glowColor: "rgba(192, 132, 252, 0.4)",
  },
  {
    id: "gruvbox-dark",
    name: "Gruvbox Hard",
    tagline: "Warm retro amber & forest green",
    bg: "#1d2021",
    cardBg: "#282828",
    barBg: "#181a1b",
    border: "rgba(184, 187, 38, 0.25)",
    accent: "#b8bb26",
    accentSecondary: "#fabd2f",
    accentTertiary: "#fe8019",
    text: "#ebdbb2",
    textMuted: "#a89984",
    glowColor: "rgba(184, 187, 38, 0.35)",
  },
];

export const OMARCHY_THEMES = COLOR_THEMES;
