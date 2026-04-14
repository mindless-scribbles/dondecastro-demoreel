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

export type ArticleBlock = ArticleParagraph | ArticleQuote | ArticleImage;

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
}

export const journalEntries: JournalEntry[] = [
  {
    slug: "synthetic-horizon",
    title: "Synthetic Horizon",
    id: "[001]",
    tags: ["2024", "WEBGL", "INTERNAL"],
    image:
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop",
    cellClass: "cell-1",
    hasPage: true,
    year: 2024,
    format: "WEBGL",
    category: "INTERNAL",
    heroImage:
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1600&auto=format&fit=crop",
    subtitle: "Procedural Landscapes at the Edge of Computation",
    article: [
      {
        type: "p",
        dropcap: true,
        html: 'Synthetic Horizon began as a thought experiment: can a horizon line — that most organic of natural boundaries — be generated entirely from noise, without any reference to the real world? The resulting project, archived under <span class="inline-metadata">SYS.ARCHIVE_VER_2.4</span>, is less a piece of software than an ongoing argument between mathematics and perception.',
      },
      {
        type: "p",
        html: 'Built in <span class="inline-metadata">WEBGL</span>, the terrain is a layered simplex-noise field sampled at runtime. Each frame negotiates between the aesthetic weight of atmospheric perspective and the hard geometry underneath. The system has no textures, no photography, no captured data — only a handful of constants that, when tuned, produce vistas indistinguishable from long-exposure photographs of desert ranges.',
      },
      {
        type: "quote",
        text: "The horizon is the moment when computation runs out of things to prove.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?q=80&w=1400&auto=format&fit=crop",
        alt: "Procedural terrain study",
        caption: "Fig 01.1 — Terrain Sample, 8-Octave Fractal Noise / INTERNAL",
      },
      {
        type: "p",
        html: "What makes the piece useful as research, and not just as a demo, is the failure states. At certain parameter combinations the noise collapses into visibly repeating tiles; at others the horizon vanishes into pure haze. Those breakdowns are the most informative moments — the places where the simulation reveals that it was never really a landscape to begin with, only a very convincing bluff.",
      },
    ],
  },
  {
    slug: "kinetic-archive",
    title: "Kinetic Archive",
    id: "[002]",
    tags: ["2023", "MOTION", "OBJEKT"],
    image:
      "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1400&auto=format&fit=crop",
    cellClass: "cell-2",
    hasPage: true,
    year: 2023,
    format: "MOTION",
    category: "OBJEKT",
    heroImage:
      "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1600&auto=format&fit=crop",
    subtitle: "The Mechanics of Celestial Motion",
    article: [
      {
        type: "p",
        dropcap: true,
        html: 'Kinetic Archive represents a fundamental shift in how we perceive the stasis of the past. As a part of the <span class="inline-metadata">SYS.ARCHIVE_VER_2.4</span> project, this installment focuses on the translation of lunar survey data into a fluid, temporal experience — a bridge between the cold, static remnants of space exploration and the dynamic vitality of digital interpretation.',
      },
      {
        type: "p",
        html: 'The core of the study revolves around the relationship between light and shadow on the lunar surface. By utilizing high-fidelity telemetry from the <span class="inline-metadata">2023</span> lunar reconnaissance missions, we reconstructed a topographical narrative that breathes. This isn\'t merely a video; it\'s a procedural reconstruction of motion that was never recorded, but always existed in the geometry of the craters.',
      },
      {
        type: "quote",
        text: "We are not just viewing history; we are simulating the momentum of light across a vacuum.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1400&auto=format&fit=crop",
        alt: "Spectral analysis of lunar shadow translation",
        caption: "Fig 02.1 — Spectral Analysis of Shadow Translation / GLITCH_ARCHIVE",
      },
      {
        type: "p",
        html: 'The technical execution required a custom <span class="inline-metadata">MOTION</span> engine capable of processing volumetric data in real-time. By applying <span class="inline-metadata">OBJEKT</span>-oriented shaders, we captured the shimmer of regolith under varying solar angles. The result is hauntingly precise yet artistically abstracted, intentionally blurring the line between empirical data and cinematic expression.',
      },
      {
        type: "p",
        html: "Throughout the development of [002], the concept of the archive evolved from a storage vessel into a living entity. Every pixel is bound by the laws of physics simulated within our internal environment, ensuring that even the most extreme abstractions remain tethered to the gravitational truth of their origin.",
      },
    ],
  },
  {
    slug: "neural-lattice",
    title: "Neural Lattice",
    id: "[003]",
    tags: ["2024", "AI/ML", "NEXUS"],
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    cellClass: "cell-3",
    hasPage: true,
    year: 2024,
    format: "AI/ML",
    category: "NEXUS",
    heroImage:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop",
    subtitle: "The Hidden Geometry of Machine Intelligence",
    article: [
      {
        type: "p",
        dropcap: true,
        html: 'Neural Lattice is an attempt to see inside the parts of a model that nobody looks at. Weights, biases, and the stubborn correlations between them are normally abstracted away behind inference APIs. Under <span class="inline-metadata">NEXUS</span> we treated those quantities as architecture — load-bearing members in a structure that happens to think.',
      },
      {
        type: "p",
        html: 'The visual is a projection: a small vision transformer\'s attention heads, drawn as a 3D lattice, colored by activation magnitude as a sample passes through the network. What looks at first like a loose cloud of points snaps, at certain layers, into startlingly regular <span class="inline-metadata">AI/ML</span> scaffolding — corridors, gates, and planes that persist across inputs.',
      },
      {
        type: "quote",
        text: "The model is not a black box. It is a room we forgot how to draw the floor plan of.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1400&auto=format&fit=crop",
        alt: "Neural lattice projection",
        caption: "Fig 03.1 — Attention Head Projection, Layer 6 / NEXUS",
      },
      {
        type: "p",
        html: "The goal was never interpretability in the rigorous sense — there are teams doing that work, with better tools and more patience. This project sits one step to the side: a visual argument that these systems have shape, that the shape is worth looking at, and that the first honest response to any frontier model is probably to stand back and draw it.",
      },
    ],
  },
  {
    slug: "monolith-data",
    title: "Monolith Data",
    id: "[004]",
    tags: ["2022", "ARCHITECTURE", "VOID"],
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1000&auto=format&fit=crop",
    cellClass: "cell-4",
    hasPage: false,
  },
  {
    slug: "chroma-shift",
    title: "Chroma Shift",
    id: "[005]",
    tags: ["2023", "BRAND", "ECHO"],
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    cellClass: "cell-5",
    hasPage: false,
  },
  {
    slug: "tesseract-protocol",
    title: "Tesseract Protocol",
    id: "[006]",
    tags: ["2024", "DEV", "KERNEL_SYS"],
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop",
    cellClass: "cell-6",
    hasPage: false,
  },
  {
    slug: "virtual-spatial",
    title: "Virtual Spatial",
    id: "[007]",
    tags: ["2023", "AR/VR", "META"],
    image:
      "https://images.unsplash.com/photo-1504253163759-c23fccaebb55?q=80&w=1200&auto=format&fit=crop",
    cellClass: "cell-7",
    hasPage: false,
  },
  {
    slug: "system-failure",
    title: "System Failure",
    id: "[008]",
    tags: ["2021", "GLITCH", "ARCHIVE"],
    image:
      "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1400&auto=format&fit=crop",
    cellClass: "cell-8",
    hasPage: false,
  },
  {
    slug: "protocol-zero",
    title: "Protocol Zero",
    id: "[009]",
    tags: ["2024", "UI/UX", "SECTOR"],
    image:
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1200&auto=format&fit=crop",
    cellClass: "cell-9",
    hasPage: false,
  },
  {
    slug: "quantum-flux",
    title: "Quantum Flux",
    id: "[010]",
    tags: ["2023", "SIM", "DATA"],
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    cellClass: "cell-10",
    hasPage: false,
  },
  {
    slug: "omni-network",
    title: "Omni Network",
    id: "[011]",
    tags: ["2024", "WEB", "GLOBAL"],
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
    cellClass: "cell-11",
    hasPage: false,
  },
  {
    slug: "terminal-state",
    title: "Terminal State",
    id: "[012]",
    tags: ["2022", "BRAND", "LOCAL"],
    image:
      "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=1200&auto=format&fit=crop",
    cellClass: "cell-12",
    hasPage: false,
  },
];
