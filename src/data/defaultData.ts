import { PersonalSiteData } from "../types";

export const DEFAULT_SITE_DATA: PersonalSiteData = {
  name: "Dennis Mabuka",
  title: "Digital Artist from East Africa",
  bio: "I'm a Digital Artist from East Africa.\nStudied at the University of Nairobi.\nBig fan of Opensource & enthusiastic explorer at the intersection of art & technology.\nMy favorite tools are blender, inkscape, ComfyUi and currently fascinated with unit.",
  university: {
    name: "University of Nairobi",
    url: "https://physics.uonbi.ac.ke/admission-content-type/bachelor-science-microprocessor-technology-and-instrumentation",
  },
  tools: [
    {
      name: "blender",
      url: "https://www.blender.org/",
    },
    {
      name: "inkscape",
      url: "https://inkscape.org/",
    },
    {
      name: "ComfyUi",
      url: "https://www.comfy.org/",
    },
  ],
  favoriteToolHighlight: "unit",
  favoriteToolUrl: "https://unit.software/",
  datePublished: "2026-09-21T12:44:54.771Z",
  sections: [
    {
      id: "explorations",
      title: "Recent explorations",
      colorType: "yellow",
      items: [
        {
          id: "proj-1789993821952",
          title: "Luchamon Digiposters",
          url: "https://kutawala.github.io/Luchamon-digiposters/",
          description:
            "Self contained dynamic drawing that morphs every 24 hrs as a tribute to the Luchamon nft project on Ethereum.",
          badge: "dynamic SVG",
        },
        {
          id: "proj-1789993685753",
          title: "World Cup",
          url: "https://kutawala.github.io/worldcup/",
          description:
            "World cup themed dynamic art that followed the tournament changing according to the standings.",
          badge: "Experimental",
        },
        {
          id: "proj-1789993631089",
          title: "The quiet phone",
          url: "https://kutawala.github.io/thequietphone/",
          description:
            "Experimental Arweave native programmable art. A smartphone that refuses to notify you when you are with real humans.",
          badge: "Experimental Art",
        },
        {
          id: "exp-1",
          title: "The Lattice",
          url: "https://thelattice.ar.io/",
          description: "Decentralized on-chain gateway and art ecosystem on Arweave.",
          badge: "Featured",
        },
        {
          id: "exp-2",
          title: "Portraits that grow old over 30 years",
          url: "https://aging-portraits_arlink.ar.io/",
          description: "Generative algorithms and evolving dynamic portrait experiments.",
          badge: "Generative",
        },
        {
          id: "exp-3",
          title: "The Virtues story",
          url: "https://thevirtues_thelattice.ar.io/",
          description: "Interactive narrative exploring mythology, ethos, and digital craft.",
          badge: "Narrative",
        },
        {
          id: "exp-4",
          title: "The Virtues Art Collection",
          url: "https://bazar.arweave.net/#/collection/FPVtW1HL5Myy8x2V9OF3um8aeSXaOPgwoWOwizZ2t7A/assets/",
          description: "Curated atomic assets and digital art editions on Bazar.",
          badge: "Collection",
        },
        {
          id: "exp-5",
          title: "Permabite Nairobi",
          url: "https://nairobi_thelattice.arweave.net/",
          description: "Permaweb node & regional creative technology showcase.",
          badge: "East Africa",
        },
        {
          id: "exp-6",
          title: "Exploring SVG art in Unit",
          url: "https://odysee.com/@Riotgear:5/Importing-svgs-into-unit:f?r=7A5js92BoquV5EUNssZTYvYM9HfwvLTK",
          description: "Deep dive video tutorial on importing scalable vector graphics into Unit.",
          badge: "Video Tutorial",
        },
      ],
    },
    {
      id: "works",
      title: "Works",
      colorType: "magenta",
      items: [
        {
          id: "wrk-1",
          title: "Video Tutorials, Essays & Workflow Videos",
          url: "https://www.youtube.com/@RIOTGEAR3D",
          description: "video library of Blender3D tutorials and other opensource creative software",
          badge: "Education",
        },
        {
          id: "wrk-4",
          title: "Gumroad store",
          url: "https://riotgear.gumroad.com/",
          description: "Blender brushes, procedural materials, and SVG design assets.",
          badge: "Assets",
        },
        {
          id: "wrk-5",
          title: "3D Art Portfolio",
          url: "https://www.artstation.com/smotherland",
          description: "High-resolution renders, character designs, and concept art.",
          badge: "Artstation",
        },
      ],
    },
    {
      id: "collections",
      title: "Available collections",
      colorType: "green",
      items: [
        {
          id: "proj-1789994657268",
          title: "Let your Light so shine",
          url: "https://www.transient.xyz/mint/let-your-light-so-shine-1",
          description: "1/1 artwork",
          badge: "Minting",
        },
        {
          id: "proj-1789994517252",
          title: "You're the GOAT?",
          url: "https://www.transient.xyz/mint/oh-youre-the-goat",
          description: "1/1 Artwork",
          badge: "Minting",
        },
        {
          id: "proj-1789994232494",
          title: "luchamon Digiposters",
          url: "https://www.transient.xyz/nfts/base/0xb8acdd902bd68bfca398ce29fcadfc87a97e780d/1",
          description:
            "A 10,000 in 1 artwork that changes every 24 hours while allowing for color customisation by the collector. It is a tribute to the Luchamon nft project on ethereum.",
          badge: "Minting",
        },
        {
          id: "col-1",
          title: "Urban Legends",
          url: "https://www.transient.xyz/mint/urban_legends",
          description: "Limited series exploring African folklore and modern cyber-folklore.",
          badge: "Minting",
        },
      ],
    },
  ],
  socials: [
    {
      id: "x",
      label: "X (Twitter)",
      url: "https://x.com/RIOTG3AR",
      handle: "@RIOTG3AR",
      type: "x",
    },
    {
      id: "lens",
      label: "Lens",
      url: "https://hey.xyz/u/riotgear",
      handle: "@riotgear",
      type: "lens",
    },
    {
      id: "email",
      label: "Email",
      url: "mailto:dennismabuka@proton.me",
      handle: "dennismabuka@proton.me",
      type: "email",
    },
  ],
};

export const INITIAL_SITE_DATA = DEFAULT_SITE_DATA;
