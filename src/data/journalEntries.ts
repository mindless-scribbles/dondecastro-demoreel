export interface ArticleParagraph {
  type: "p";
  dropcap?: boolean;
  html: string;
}

export interface ArticleQuote {
  type: "quote";
  text: string;
}

export interface ArticleImage {
  type: "image";
  src: string;
  alt: string;
  caption: string;
}

export interface ArticleVideo {
  type: "video";
  provider: "youtube";
  videoId: string;
  title?: string;
  caption?: string;
}

export type ArticleBlock =
  | ArticleParagraph
  | ArticleQuote
  | ArticleImage
  | ArticleVideo;

export interface JournalEntry {
  slug: string;
  title: string;
  id: string;
  tags: string[];
  image: string;
  cellClass: string;
  hasPage: boolean;
  year?: number;
  format?: string;
  category?: string;
  heroImage?: string;
  subtitle?: string;
  article?: ArticleBlock[];
  video?: boolean;
}

export const journalEntries: JournalEntry[] = [
  {
    slug: "character-fx-demo-reel",
    title: "Character FX Demo Reel",
    id: "[001]",
    tags: ["2026", "VIDEO", "FILM/TRAILERS/COMMERCIALS"],
    image: "https://i.ytimg.com/vi/_6fQY8wwXQs/maxresdefault.jpg",
    cellClass: "cell-1",
    hasPage: true,
    video: true,
    year: 2026,
    format: "VIDEO",
    category: "FILM/TRAILERS/COMMERCIALS",
    heroImage: "https://i.ytimg.com/vi/_6fQY8wwXQs/maxresdefault.jpg",
    subtitle: "Character Effects Demo Reel",
    article: [
      {
        type: "video",
        provider: "youtube",
        videoId: "_6fQY8wwXQs",
        title: "Character FX Demo Reel",
        caption: "Watch on YouTube",
      },
      {
        type: "p",
        dropcap: true,
        html: `Character FX Demo Reel`,
      },
    ],
  },
  {
    slug: "mocap-avatar-way-of-water",
    title: "Motion Capture Workflows: Avatar way of water",
    id: "[002]",
    tags: ["2024", "MOCAP", "FILM"],
    image: "https://i.ytimg.com/vi/4ca-ywgyVdE/sddefault.jpg",
    cellClass: "cell-2",
    hasPage: true,
    video: true,
    year: 2024,
    format: "VIDEO",
    category: "FILM",
    heroImage: "https://i.ytimg.com/vi/4ca-ywgyVdE/sddefault.jpg",
    subtitle: "Notes from the mocap pipeline",
    article: [
      {
        type: "video",
        provider: "youtube",
        videoId: "4ca-ywgyVdE",
        title: "Motion Capture Workflows: Avatar way of water",
        caption: "Watch on YouTube",
      },
      {
        type: "p",
        dropcap: true,
        html: `Way of Water put the entire motion edit process underwater — literally. Scope spanned RIGGING, CHARACTER SETUP, TRACK, REFINE EDIT, RETARGET, MOTION CLEANUP, and animation, plus mentoring and training the team on best practices with the Lightstorm mocap toolset, working closely with other teams to troubleshoot any motion-related issues, and partnering with production to hit delivery goals through every phase. Also drove R&D for editing workflows on the Motion Edit team (import/export of scenes) and developed the pipeline for delivery and ingestion of motion between internal teams and vendors.`,
      },
      {
        type: "p",
        html: `0:00 UNDERWATER MOCAP — By far one of the coolest parts of the experience of working on Way of Water. The challenge when working with underwater mocap was being able to see the data when splashes and bubbles dirtied up the marker data, and — when editing — being mindful to maintain all the subtleties of underwater movement.`,
      },
      {
        type: "p",
        html: `0:21 LIVE ACTION INTEGRATION — Helped with R&D on the Simulcam Spyder Cam setup. A mix of active-marker and normal capture workflows. Matchmove and contact cleanup between live action and CG characters.`,
      },
      {
        type: "p",
        html: `0:40 CHARACTER CONTACT CLEANUP — One of the biggest challenges of this film, as a motion editor, was the difference in scales between the actors/troupe and the characters they were playing. An amazing cast of troupe would play multiple characters for each scene, so we came up with a retargeting map flexible enough to reuse across pairings without building a bespoke character/actor map for each one. Spider (Jack Champion) grew probably about a foot and a half from the start of production through the end — a whole pipeline and workflow had to be created to deal with his growth spurt, so we could continue working and still update assets and motions in previously prepped files for the director to shoot cameras on stage.`,
      },
      {
        type: "p",
        html: `1:00 CREATURE CONFORM — Conforming performances to creatures that were animated post-capture. The challenge was to stay true to the intent of the performance while editing the motions as needed to make them look like they were in control and had proper riding mechanics.`,
      },
      {
        type: "p",
        html: `1:10 MOTION STITCHING / FULL-LOAD CLEANUP — Before we broke into shots, the lab built loads that gave the director a file to lens the film. Often, editorial delivered vidref for stitches, the sequence team laid out a first pass, and motion edit cleaned up the stitches into one continuous motion — giving the director the flexibility to move around and shoot the scene as it played out.`,
      },
      {
        type: "p",
        html: `1:23 ENVIRONMENT SHOOT PREP / CONTACT CLEANUP — Working closely with the prop and set builders on stage to make sure we were building props and sets at the proper scale. Providing motion files for the motion-control team converting set animation for synced performance during capture. Scale depended on who the characters were and the actors who were going to play them. In motion edit we often had to mix different scales to get the best solve motion possible as the base, then edit to the environment — which may have changed in size because the overall scale of the scene was changed after capture, and/or because environments were still actively changing throughout production.`,
      },
      {
        type: "p",
        html: `1:37 ABOVE-SURFACE IN-TANK MOCAP — SHOT TEMPLATES — Matchmove live-action Spider and edit/animate the CG characters for interaction, validating the spatial location so that it works in 3D.`,
      },
      {
        type: "p",
        html: `1:44 ABOVE-SURFACE IN-TANK MOCAP — DATA RECOVERY — A true unique challenge of Way of Water was water. Data between the water and the surface gets lost, especially when performers move through the layer of spheres we put in the water to avoid reflection. Track, cleanup, and account for any missing data. Retarget and clean up all the contacts between the characters. Make sure they are on the animated Ilu properly.`,
      },
    ],
  },
  {
    slug: "gameplay-animation-and-vfx-testing",
    title: "Gameplay Animation and VFX testing",
    id: "[003]",
    tags: ["2025", "VIDEO", "ANIM/VFX"],
    image: "https://i.ytimg.com/vi/nNjQQSVLxb0/maxresdefault.jpg",
    cellClass: "cell-3",
    hasPage: true,
    video: true,
    year: 2025,
    format: "VIDEO",
    category: "ANIM/VFX",
    heroImage: "https://i.ytimg.com/vi/nNjQQSVLxb0/maxresdefault.jpg",
    subtitle: "Unreal VFX Gameplay",
    article: [
      {
        type: "video",
        provider: "youtube",
        videoId: "nNjQQSVLxb0",
        title: "Gameplay Animation and VFX testing",
        caption: "Watch on YouTube",
      },
      {
        type: "p",
        dropcap: true,
        html: `Going through the UE Magic VFX class from <a href="https://www.cgcircuit.com/tutorial/ue5-magic-vfx-gameplay-blueprints-niagara-houdini" rel="noopener" target="_blank">CG Circuit</a> — a hands-on pass through gameplay blueprints, Niagara, and Houdini integration in Unreal. Character assets are from FAB, made by Lilpupinduy. Animation and character rigging done in UNREAL 5.6.`,
      },
      {
        type: "p",
        html: `Created a custom CONTROL RIG with its own backward solve for the main character — the backward solve being the piece that made the rest of the workflow flexible.`,
      },
      {
        type: "p",
        html: `Animated the character's fireball attack entirely inside Unreal.`,
      },
      {
        type: "p",
        html: `The charge animation is a stitch — animation and motion combined and cleaned so the transitions read as one take. Having a backward solve gave a lot of flexibility in moving between states: going from idle to action and blending back into idle.`,
      },
    ],
  },
  {
    slug: "keyframe-animation-in-unreal",
    title: "Keyframe Animation in Unreal",
    id: "[004]",
    tags: ["2026", "VIDEO", "ANIM"],
    image: "https://i.ytimg.com/vi/VS_ePmFCEw4/maxresdefault.jpg",
    cellClass: "cell-4",
    hasPage: true,
    video: true,
    year: 2026,
    format: "VIDEO",
    category: "ANIM",
    heroImage: "https://i.ytimg.com/vi/VS_ePmFCEw4/maxresdefault.jpg",
    subtitle: "Blocking through spline in Unreal 5.7",
    article: [
      {
        type: "video",
        provider: "youtube",
        videoId: "VS_ePmFCEw4",
        title: "Keyframe Animation in Unreal",
        caption: "Watch on YouTube",
      },
      {
        type: "p",
        dropcap: true,
        html: `First pass blocking. Blocking plus. Spline pass animation. All done in UNREAL 5.7.`,
      },
    ],
  },
  {
    slug: "monolith-data",
    title: "Monolith Data",
    id: "[005]",
    tags: ["2022", "ARCHITECTURE", "VOID"],
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1000&auto=format&fit=crop",
    cellClass: "cell-5",
    hasPage: false,
  },
  {
    slug: "chroma-shift",
    title: "Chroma Shift",
    id: "[006]",
    tags: ["2023", "BRAND", "ECHO"],
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    cellClass: "cell-6",
    hasPage: false,
  },
  {
    slug: "tesseract-protocol",
    title: "Tesseract Protocol",
    id: "[007]",
    tags: ["2024", "DEV", "KERNEL_SYS"],
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop",
    cellClass: "cell-7",
    hasPage: false,
  },
  {
    slug: "virtual-spatial",
    title: "Virtual Spatial",
    id: "[008]",
    tags: ["2023", "AR/VR", "META"],
    image:
      "https://images.unsplash.com/photo-1504253163759-c23fccaebb55?q=80&w=1200&auto=format&fit=crop",
    cellClass: "cell-8",
    hasPage: false,
  },
  {
    slug: "system-failure",
    title: "System Failure",
    id: "[009]",
    tags: ["2021", "GLITCH", "ARCHIVE"],
    image:
      "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1400&auto=format&fit=crop",
    cellClass: "cell-9",
    hasPage: false,
  },
  {
    slug: "protocol-zero",
    title: "Protocol Zero",
    id: "[010]",
    tags: ["2024", "UI/UX", "SECTOR"],
    image:
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1200&auto=format&fit=crop",
    cellClass: "cell-10",
    hasPage: false,
  },
  {
    slug: "quantum-flux",
    title: "Quantum Flux",
    id: "[011]",
    tags: ["2023", "SIM", "DATA"],
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    cellClass: "cell-11",
    hasPage: false,
  },
  {
    slug: "omni-network",
    title: "Omni Network",
    id: "[012]",
    tags: ["2024", "WEB", "GLOBAL"],
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
    cellClass: "cell-12",
    hasPage: false,
  },
];
