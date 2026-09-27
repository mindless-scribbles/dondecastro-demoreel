---
slug: forward-limb-off-plane-roll
title: "IK/FK Match: Off-Plane Roll"
date: 2026-09-26
subtitle: "Motion Toolset 03: capturing and applying roll"
format: VIDEO
category: "RIGGING"
youtube: 6zio9Bv-p7c
source:
  platform: youtube
  url: https://youtu.be/6zio9Bv-p7c
---

This is the breakdown behind the IK/FK match from [Motion Toolset 01](/journal/ikfk-match-and-sequencer-shortcuts): the two functions I added to the forward limb, and an extra section in the pole vector calculation to fix a bug I found while testing.

The limb starts from the one Epic built in their [Rigging in Unreal Engine workshop](https://dev.epicgames.com/community/learning/talks-and-demos/jZ74/workshop-rigging-in-unreal-engine-5-6) (5.6, there may be a newer one for 5.7). The workshop builds it step by step, and it was a big help in learning how to build efficient rigs inside Unreal. I didn't want to reinvent the wheel, so I kept most of it. Two things I like: the construction step creates animation channels that can be hosted on other controls, so the IK/FK switch is available on the hand, the pole vector or the IK control, and the limb already matches well in the normal case. The legs use the same function pointed at the leg joints.

Where it stops matching is an FK pose that is out of plane. An animator might do that on purpose, and motion capture often leaves a little residual rotation on the elbow instead of a clean hinge, small enough that you can't see it while you judge the pose. When you switch to IK, the solver rotates the upper arm's twist so the limb points at the auto-generated pole vector. A small residual gives a small pop. A bad one flips the whole upper arm.

> What you're expecting is that when you flip, it looks exactly the same.

The pole vector itself is simple vector math. Take a vector from the root to the end of the limb and another from the root to the middle joint, project the second onto the first with a dot product, and push out from that point through the middle joint. A straight limb gives no triangle to work with, so the original function adds a small offset to keep a direction. Near straight, that offset caused a tiny movement every time I switched back and forth, until it finally settled. I tracked it down to this part of the pole vector math with some help from Claude.

The match fix is two functions. **Capture Roll** runs in the FK branch, after the background solve that works out what the IK would look like if you switched to it. For the upper and lower joints it reads the current FK rotation, uses an aim function to work out where the bone would end up once it is aimed at the pole vector, and takes the difference between the two quaternions (inverse and multiply). Only the twist matters, because twist is what the pole vector changes, so it splits the twist out and converts it to degrees.

**Apply Roll** runs in the IK branch. After the IK solve, it adds the captured twist back onto each joint. The transform is set with propagate to children on, so it then puts the children back where they were. In the test pose that meant rotating the upper joint 84 degrees and the lower joint 5, and switching no longer changes the arm.

With capture and apply in place, I can pose in IK, switch to FK and pose differently, and switch back without a pop. The torso has an IK/FK switch set up the same way; that gets its own breakdown.
