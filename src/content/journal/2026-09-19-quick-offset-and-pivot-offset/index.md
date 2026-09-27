---
slug: quick-offset-and-pivot-offset
title: "Quick Offset and Pivot Offset"
date: 2026-09-19
subtitle: "Motion Toolset 02: additive edits in Sequencer"
format: VIDEO
category: "TOOLS"
youtube: Q5bp2fYnkDY
source:
  platform: youtube
  url: https://youtu.be/Q5bp2fYnkDY
---

First pass at two tools from the motion toolset I'm developing for Control Rig and Sequencer: a delta tool I've been calling quick offset, with a falloff to ease changes in and out, and a pivot offset locator. Both depend on the rig from [Motion Toolset 01](/journal/ikfk-match-and-sequencer-shortcuts) switching between IK and FK without popping.

The test starts by baking the animation onto the rig. Because the match holds, I can turn IK on for the whole range and nothing on the body changes; the original motion, in pink, stays lined up as I scrub. Ctrl+F keys FK and Ctrl+Shift+F keys IK, for the whole range or a selected one, since the switch is keyed on every frame.

For broad changes I still use Sequencer's layers. With the body, feet and pole vectors in a selection set, Ctrl+D creates a layer. In this clip the feet go through the floor, so I raise them in world space on the layer and merge it back down.

Quick offset is a really fast additive layer. Before touching anything, T arms a snapshot of the whole body's curves. After you make a change, the snapshot shows as a ghost so you can compare, and Y shows the delta: which frames changed and by how much. You mark an in and an out, pick the falloff (linear, sharp, wide, or ease in and out, which is my default) and Shift+D applies it. It handles mixed edits too: an IK change on frame 78 and an FK change on frame 91 get eased in, blended between, and eased out.

The pivot offset pins the right foot. Pressing 6 opens the toolset where the mouse is. I create a locator, move it to the toe and constrain the foot to it, with translation pinned and X and Y rotation locked, so the foot can only rotate on Z around the toe. After applying that across the range and removing the locator, the change is committed and quick offset eases it in and out.

This is an MVP. The idea was a quick way to make these small changes without having to select a range first, the way you do with a global offset tool. Some of the workflow still needs tightening: selecting the locator takes a workaround because I keep Control Rig selection locked on, and switching back to FK before applying can get confusing.
