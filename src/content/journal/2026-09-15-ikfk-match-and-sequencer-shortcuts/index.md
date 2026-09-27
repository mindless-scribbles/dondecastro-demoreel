---
slug: ikfk-match-and-sequencer-shortcuts
title: "IK/FK Match and Sequencer Shortcuts"
date: 2026-09-15
subtitle: "Motion Toolset 01: the rig"
format: VIDEO
category: "RIGGING"
youtube: IeyEC2pAHmk
source:
  platform: youtube
  url: https://youtu.be/IeyEC2pAHmk
---

A quick look at a Control Rig I've been working on, with a more reliable IK/FK match, and a plugin of global shortcuts I wrote to keep me focused on the viewport while I work in Sequencer.

To test it I put two copies of the same character on top of each other, one gray and one wireframe, with the same animation, then bake the top one onto the rig with a bake I wrote for it. The arm ends up with keys on all three axes. That isn't what you want, but I did it on purpose to see whether the rig can handle how wild some retargets get.

Right-click on the arm switches it to IK, and it moves like any normal IK. Switch back and it matches. I posed the FK spine into something nobody should be doing, and the IK snapped back on for the arms and the torso without changing the pose. The legs are fully working IK as well. The spine matching is mostly there, but it still needs cleanup.

The plugin keeps my work in the viewport. The FK controls are DMC, so the viewport stays clean without a pile of control shapes. The up and down arrow keys pick-walk the hierarchy. The anim outliner only lists the control hierarchy, not every joint, so it makes a good path to walk, and holding Shift or Ctrl adds to the selection as you go. Selecting all the fingers takes a couple of keystrokes.

Still to do: resetting selected IK controls back to zero, the way the FK controls already do, and the motion edit tools this rig is built for. The match comes from two functions I added to the limb from Epic's rigging workshop, Capture Roll and Apply Roll. [Motion Toolset 03](/journal/forward-limb-off-plane-roll) breaks them down.
