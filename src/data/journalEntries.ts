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
    slug: "forward-limb-off-plane-roll",
    title: "IK/FK Match: Off-Plane Roll",
    id: "[001]",
    tags: ["2026", "VIDEO", "RIGGING"],
    image: "https://i.ytimg.com/vi/6zio9Bv-p7c/maxresdefault.jpg",
    cellClass: "cell-1",
    hasPage: true,
    video: true,
    year: 2026,
    format: "VIDEO",
    category: "RIGGING",
    heroImage: "https://i.ytimg.com/vi/6zio9Bv-p7c/maxresdefault.jpg",
    subtitle: "Motion Toolset 03: capturing and applying roll",
    article: [
      {
        type: "video",
        provider: "youtube",
        videoId: "6zio9Bv-p7c",
        title: "Unreal IK / FK match - Forward Limb - Off Plane Functions",
        caption: "Watch on YouTube",
      },
      {
        type: "p",
        dropcap: true,
        html: `This is the breakdown behind the IK/FK match from <a href="/journal/ikfk-match-and-sequencer-shortcuts">Motion Toolset 01</a>: the two functions I added to the forward limb, and an extra section in the pole vector calculation to fix a bug I found while testing.`,
      },
      {
        type: "p",
        html: `The limb starts from the one Epic built in their <a href="https://dev.epicgames.com/community/learning/talks-and-demos/jZ74/workshop-rigging-in-unreal-engine-5-6" rel="noopener" target="_blank">Rigging in Unreal Engine workshop</a> (5.6, there may be a newer one for 5.7). The workshop builds it step by step, and it was a big help in learning how to build efficient rigs inside Unreal. I didn't want to reinvent the wheel, so I kept most of it. Two things I like: the construction step creates animation channels that can be hosted on other controls, so the IK/FK switch is available on the hand, the pole vector or the IK control, and the limb already matches well in the normal case. The legs use the same function pointed at the leg joints.`,
      },
      {
        type: "p",
        html: `Where it stops matching is an FK pose that is out of plane. An animator might do that on purpose, and motion capture often leaves a little residual rotation on the elbow instead of a clean hinge, small enough that you can't see it while you judge the pose. When you switch to IK, the solver rotates the upper arm's twist so the limb points at the auto-generated pole vector. A small residual gives a small pop. A bad one flips the whole upper arm.`,
      },
      {
        type: "quote",
        text: "What you're expecting is that when you flip, it looks exactly the same.",
      },
      {
        type: "p",
        html: `The pole vector itself is simple vector math. Take a vector from the root to the end of the limb and another from the root to the middle joint, project the second onto the first with a dot product, and push out from that point through the middle joint. A straight limb gives no triangle to work with, so the original function adds a small offset to keep a direction. Near straight, that offset caused a tiny movement every time I switched back and forth, until it finally settled. I tracked it down to this part of the pole vector math with some help from Claude.`,
      },
      {
        type: "p",
        html: `The match fix is two functions. <b>Capture Roll</b> runs in the FK branch, after the background solve that works out what the IK would look like if you switched to it. For the upper and lower joints it reads the current FK rotation, uses an aim function to work out where the bone would end up once it is aimed at the pole vector, and takes the difference between the two quaternions (inverse and multiply). Only the twist matters, because twist is what the pole vector changes, so it splits the twist out and converts it to degrees.`,
      },
      {
        type: "p",
        html: `<b>Apply Roll</b> runs in the IK branch. After the IK solve, it adds the captured twist back onto each joint. The transform is set with propagate to children on, so it then puts the children back where they were. In the test pose that meant rotating the upper joint 84 degrees and the lower joint 5, and switching no longer changes the arm.`,
      },
      {
        type: "p",
        html: `With capture and apply in place, I can pose in IK, switch to FK and pose differently, and switch back without a pop. The torso has an IK/FK switch set up the same way; that gets its own breakdown.`,
      },
    ],
  },
  {
    slug: "quick-offset-and-pivot-offset",
    title: "Quick Offset and Pivot Offset",
    id: "[002]",
    tags: ["2026", "VIDEO", "TOOLS"],
    image: "https://i.ytimg.com/vi/Q5bp2fYnkDY/maxresdefault.jpg",
    cellClass: "cell-2",
    hasPage: true,
    video: true,
    year: 2026,
    format: "VIDEO",
    category: "TOOLS",
    heroImage: "https://i.ytimg.com/vi/Q5bp2fYnkDY/maxresdefault.jpg",
    subtitle: "Motion Toolset 02: additive edits in Sequencer",
    article: [
      {
        type: "video",
        provider: "youtube",
        videoId: "Q5bp2fYnkDY",
        title: "Unreal Sequencer - QuickOffset PivotOffset",
        caption: "Watch on YouTube",
      },
      {
        type: "p",
        dropcap: true,
        html: `First pass at two tools from the motion toolset I'm developing for Control Rig and Sequencer: a delta tool I've been calling quick offset, with a falloff to ease changes in and out, and a pivot offset locator. Both depend on the rig from <a href="/journal/ikfk-match-and-sequencer-shortcuts">Motion Toolset 01</a> switching between IK and FK without popping.`,
      },
      {
        type: "p",
        html: `The test starts by baking the animation onto the rig. Because the match holds, I can turn IK on for the whole range and nothing on the body changes; the original motion, in pink, stays lined up as I scrub. Ctrl+F keys FK and Ctrl+Shift+F keys IK, for the whole range or a selected one, since the switch is keyed on every frame.`,
      },
      {
        type: "p",
        html: `For broad changes I still use Sequencer's layers. With the body, feet and pole vectors in a selection set, Ctrl+D creates a layer. In this clip the feet go through the floor, so I raise them in world space on the layer and merge it back down.`,
      },
      {
        type: "p",
        html: `Quick offset is a really fast additive layer. Before touching anything, T arms a snapshot of the whole body's curves. After you make a change, the snapshot shows as a ghost so you can compare, and Y shows the delta: which frames changed and by how much. You mark an in and an out, pick the falloff (linear, sharp, wide, or ease in and out, which is my default) and Shift+D applies it. It handles mixed edits too: an IK change on frame 78 and an FK change on frame 91 get eased in, blended between, and eased out.`,
      },
      {
        type: "p",
        html: `The pivot offset pins the right foot. Pressing 6 opens the toolset where the mouse is. I create a locator, move it to the toe and constrain the foot to it, with translation pinned and X and Y rotation locked, so the foot can only rotate on Z around the toe. After applying that across the range and removing the locator, the change is committed and quick offset eases it in and out.`,
      },
      {
        type: "p",
        html: `This is an MVP. The idea was a quick way to make these small changes without having to select a range first, the way you do with a global offset tool. Some of the workflow still needs tightening: selecting the locator takes a workaround because I keep Control Rig selection locked on, and switching back to FK before applying can get confusing.`,
      },
    ],
  },
  {
    slug: "ikfk-match-and-sequencer-shortcuts",
    title: "IK/FK Match and Sequencer Shortcuts",
    id: "[003]",
    tags: ["2026", "VIDEO", "RIGGING"],
    image: "https://i.ytimg.com/vi/IeyEC2pAHmk/maxresdefault.jpg",
    cellClass: "cell-3",
    hasPage: true,
    video: true,
    year: 2026,
    format: "VIDEO",
    category: "RIGGING",
    heroImage: "https://i.ytimg.com/vi/IeyEC2pAHmk/maxresdefault.jpg",
    subtitle: "Motion Toolset 01: the rig",
    article: [
      {
        type: "video",
        provider: "youtube",
        videoId: "IeyEC2pAHmk",
        title: "Unreal IK FK Match / Global Sequencer Shortcuts",
        caption: "Watch on YouTube",
      },
      {
        type: "p",
        dropcap: true,
        html: `A quick look at a Control Rig I've been working on, with a more reliable IK/FK match, and a plugin of global shortcuts I wrote to keep me focused on the viewport while I work in Sequencer.`,
      },
      {
        type: "p",
        html: `To test it I put two copies of the same character on top of each other, one gray and one wireframe, with the same animation, then bake the top one onto the rig with a bake I wrote for it. The arm ends up with keys on all three axes. That isn't what you want, but I did it on purpose to see whether the rig can handle how wild some retargets get.`,
      },
      {
        type: "p",
        html: `Right-click on the arm switches it to IK, and it moves like any normal IK. Switch back and it matches. I posed the FK spine into something nobody should be doing, and the IK snapped back on for the arms and the torso without changing the pose. The legs are fully working IK as well. The spine matching is mostly there, but it still needs cleanup.`,
      },
      {
        type: "p",
        html: `The plugin keeps my work in the viewport. The FK controls are DMC, so the viewport stays clean without a pile of control shapes. The up and down arrow keys pick-walk the hierarchy. The anim outliner only lists the control hierarchy, not every joint, so it makes a good path to walk, and holding Shift or Ctrl adds to the selection as you go. Selecting all the fingers takes a couple of keystrokes.`,
      },
      {
        type: "p",
        html: `Still to do: resetting selected IK controls back to zero, the way the FK controls already do, and the motion edit tools this rig is built for. The match comes from two functions I added to the limb from Epic's rigging workshop, Capture Roll and Apply Roll. <a href="/journal/forward-limb-off-plane-roll">Motion Toolset 03</a> breaks them down.`,
      },
    ],
  },
  {
    slug: "character-fx-demo-reel",
    title: "Character FX Demo Reel",
    id: "[004]",
    tags: ["2026", "VIDEO", "FILM/TRAILERS/COMMERCIALS"],
    image: "https://i.ytimg.com/vi/_6fQY8wwXQs/maxresdefault.jpg",
    cellClass: "cell-4",
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
    id: "[005]",
    tags: ["2024", "MOCAP", "FILM"],
    image: "https://i.ytimg.com/vi/4ca-ywgyVdE/sddefault.jpg",
    cellClass: "cell-5",
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
    id: "[006]",
    tags: ["2025", "VIDEO", "ANIM/VFX"],
    image: "https://i.ytimg.com/vi/nNjQQSVLxb0/maxresdefault.jpg",
    cellClass: "cell-6",
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
    id: "[007]",
    tags: ["2026", "VIDEO", "ANIM"],
    image: "https://i.ytimg.com/vi/VS_ePmFCEw4/maxresdefault.jpg",
    cellClass: "cell-7",
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
    id: "[008]",
    tags: ["2022", "ARCHITECTURE", "VOID"],
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1000&auto=format&fit=crop",
    cellClass: "cell-8",
    hasPage: false,
  },
  {
    slug: "chroma-shift",
    title: "Chroma Shift",
    id: "[009]",
    tags: ["2023", "BRAND", "ECHO"],
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    cellClass: "cell-9",
    hasPage: false,
  },
  {
    slug: "tesseract-protocol",
    title: "Tesseract Protocol",
    id: "[010]",
    tags: ["2024", "DEV", "KERNEL_SYS"],
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop",
    cellClass: "cell-10",
    hasPage: false,
  },
  {
    slug: "virtual-spatial",
    title: "Virtual Spatial",
    id: "[011]",
    tags: ["2023", "AR/VR", "META"],
    image:
      "https://images.unsplash.com/photo-1504253163759-c23fccaebb55?q=80&w=1200&auto=format&fit=crop",
    cellClass: "cell-11",
    hasPage: false,
  },
  {
    slug: "system-failure",
    title: "System Failure",
    id: "[012]",
    tags: ["2021", "GLITCH", "ARCHIVE"],
    image:
      "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1400&auto=format&fit=crop",
    cellClass: "cell-12",
    hasPage: false,
  },
];
