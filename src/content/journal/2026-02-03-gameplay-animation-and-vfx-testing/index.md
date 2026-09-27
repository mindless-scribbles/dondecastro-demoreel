---
slug: gameplay-animation-and-vfx-testing
title: "Gameplay Animation and VFX testing"
date: 2026-02-03
subtitle: "Unreal VFX Gameplay"
format: VIDEO
category: "ANIM/VFX"
youtube: nNjQQSVLxb0
source:
  platform: youtube
  url: https://youtu.be/nNjQQSVLxb0
---

Going through the UE Magic VFX class from [CG Circuit](https://www.cgcircuit.com/tutorial/ue5-magic-vfx-gameplay-blueprints-niagara-houdini) — a hands-on pass through gameplay blueprints, Niagara, and Houdini integration in Unreal. Character assets are from FAB, made by Lilpupinduy. Animation and character rigging done in UNREAL 5.6.

Created a custom CONTROL RIG with its own backward solve for the main character — the backward solve being the piece that made the rest of the workflow flexible.

Animated the character's fireball attack entirely inside Unreal.

The charge animation is a stitch — animation and motion combined and cleaned so the transitions read as one take. Having a backward solve gave a lot of flexibility in moving between states: going from idle to action and blending back into idle.
