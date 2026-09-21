export interface ProjectItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  category?: string;
  badge?: string;
}

export interface ProjectSection {
  id: string;
  title: string;
  colorType: "green" | "yellow" | "magenta" | "white";
  items: ProjectItem[];
}

export interface ToolItem {
  name: string;
  url: string;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  handle?: string;
  type?: "x" | "lens" | "arweave" | "ethereum" | "email" | "generic";
}

export interface PersonalSiteData {
  name: string;
  title: string;
  bio: string;
  university: {
    name: string;
    url: string;
  };
  tools: ToolItem[];
  favoriteToolHighlight?: string; // e.g. "unit"
  favoriteToolUrl?: string;
  sections: ProjectSection[];
  socials: SocialLink[];
  datePublished: string;
}
