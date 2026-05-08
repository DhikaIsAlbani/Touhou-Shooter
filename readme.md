「 Dhika’s Bullet Hell Project — Development Documentation 」

By — Dhika. 


---

Overview

This project began from simple experimentation with coding and game systems.
At first, the intention was not to create a polished or fully completed game, but to explore how far a self-built system could evolve through direct implementation, iteration, and experimentation.

Over time, the project gradually evolved from:

> “trying to code something interesting”



into:

> “building a structured bullet hell framework.”



The current direction strongly reflects Touhou-inspired danmaku design philosophy while also functioning as a personal exploration of scalable game architecture and modular gameplay systems.  

The project is still considered early-stage, but its internal structure already behaves more like a lightweight engine framework than a simple experimental prototype.


---

Core Direction

The framework currently focuses on:

2D bullet hell gameplay,

modular enemy systems,

scalable wave progression,

configurable projectile behavior,

responsive input handling,

and future extensibility.


The overall design philosophy consistently prioritizes:

> “building systems first, then expanding content.”



rather than relying on short-term hardcoded implementation.

This approach allows the project to scale more safely as additional mechanics, characters, enemies, and visual systems are added later.


---

Responsive Layout Architecture

One of the most important foundations already implemented is the responsive layout system. 

The project supports:

dynamic viewport scaling,

logical coordinate normalization,

mobile and desktop behavior separation,

adaptive trackpad positioning,

and centered layout scaling.


The game internally operates on fixed logical dimensions while visual rendering scales dynamically according to viewport size.

Movement input is normalized against scaling values:

dx /= LAYOUT.scale;
dy /= LAYOUT.scale;

This ensures gameplay consistency across different resolutions and devices by separating gameplay calculations from rendered screen scale.

The layout architecture already demonstrates:

separation between rendering and logic,

device-aware input handling,

and scalable screen adaptation.



---

Character System

Playable characters are structured through a registry-based architecture:

const CHARACTERS = { ... }

Each character contains independent shooting behavior and future extensibility through:

shoot(p)

functions.

Currently implemented characters:

Reimu

Marisa


Additional placeholder characters already exist for future expansion:

Yukari

Youmu

Reisen




This structure allows future implementation of:

alternate shot types,

unique abilities,

focused movement systems,

upgrades,

passive mechanics,

and character-specific playstyles.



---

Projectile Architecture

Projectile handling is centralized through dedicated bullet factory systems:

makePlayerBullet()
makeEnemyBullet()

rather than direct manual spawning logic.

The projectile system already supports:

textures,

scaling,

rotation,

trail rendering,

wave movement,

steering behavior,

tracking bullets,

and configurable projectile properties.




This creates the foundation of a reusable projectile framework suitable for increasingly complex danmaku patterns.


---

Trail Rendering System

The framework already contains configurable projectile trail definitions:

TRAIL_DEFS

Trail behavior includes:

configurable colors,

spacing,

opacity falloff,

particle length,

and render scaling.


This system allows weapons and attacks to develop distinct visual identities while also improving readability during dense projectile scenarios.

Examples currently include:

Reimu needle trails,

Yin-Yang orb glow effects,

layered fading visuals.



---

Enemy Variant Architecture

Enemy behavior is organized through:

ENEMY_VARIANTS

Each enemy definition may contain:

movement behavior,

bullet properties,

pattern pools,

projectile visuals,

upgrade probabilities,

and special attributes.


This transforms enemies into configurable data-driven entities rather than isolated scripted encounters.



The architecture significantly simplifies:

balancing,

encounter design,

progression tuning,

and future content expansion.



---

Bullet Pattern Systems

The framework already implements multiple projectile pattern behaviors:

spread,

straight,

wave,

burst,

autoTrack,

ring,

zigzag,

spiral,

and boss-specific phase logic.




Boss scripting currently includes:

bossPhase1
bossPhase2

which introduces:

attack transitions,

escalating difficulty,

dynamic pattern switching,

and encounter pacing.


The existence of dedicated boss phase logic marks the transition from simple mechanic experimentation into structured encounter design.


---

Wave Progression Structure

Enemy encounters are organized through structured wave definitions:

const WAVES = [...]

The project now contains:

escalation pacing,

enemy sequencing,

miniboss intervals,

boss encounters,

and progression layering.


This transforms the framework from:

> “isolated gameplay systems”



into:

> “designed gameplay flow.”






---

Boss Layer

The current framework already supports:

dedicated boss HP bars,

phase indicators,

transition events,

visual warnings,

and specialized attack scripting.


The implemented final boss:

> Yuyuko Saigyouji



strongly reflects classic Touhou-inspired danmaku aesthetics through:

radial projectile rings,

spiral pressure patterns,

layered spreads,

and phase escalation mechanics.



---

Upgrade and Reward Systems

Additional gameplay systems already implemented include:

temporary speed boosts,

projectile size upgrades,

barriers,

item drops,

floating feedback text,

and timed effect management.


These systems create gameplay progression loops beyond simple shooting mechanics and establish the basis for future scoring, survival, and resource systems.


---

Design Philosophy

The most notable aspect of the project is not merely the implemented features, but the underlying mindset visible throughout the architecture.

The framework consistently demonstrates:

system-oriented thinking,

modular separation,

scalability,

reusable structures,

and future extensibility.


The development approach prioritizes:

> “building foundations capable of evolving later”



rather than short-term implementation focused only on immediate visual results.

Most systems appear to be developed incrementally through experimentation and iterative construction rather than strict pre-planned design.


---

Current Project Identity

At its current stage, the project can best be described as:

a Touhou-inspired bullet hell framework,

an experimental danmaku sandbox,

a scalable JavaScript gameplay architecture project,

and a personal exploration of system design through direct creation.


It is not yet a finished game.

However, the framework already contains:

> the structural foundation of one.




---

Final Notes

This project was not built from perfection.

It was built from:

experimentation,

curiosity,

improvisation,

persistence,

and direct exploration.


"Using available tools.
Building with available understanding.
Learning through creation itself."

And in many cases, that is exactly how long-term personal projects begin.