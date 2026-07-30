# Dhika's Bullet Hell Project

**Version 1.1.0**  
A Touhou-inspired Bullet Hell Game & Framework built with Vanilla JavaScript

[![Project Status](https://img.shields.io/badge/Status-Playable_Early_Development-blue)](https://img.shields.io/badge/Status-Playable_Early_Development-blue)
[![Version](https://img.shields.io/badge/Version-1.1.0-green)](https://img.shields.io/badge/Version-1.1.0-green)

A lightweight Touhou-inspired bullet hell game built entirely with HTML, CSS, and Vanilla JavaScript. The project combines a modular gameplay framework with an expanding playable game, emphasizing clean architecture, reusable systems, and long-term scalability.

---

## Overview

Originally started as a programming experiment, the project has grown into a fully playable bullet hell prototype featuring multiple playable characters, structured stage progression, menu navigation, save functionality, and modular gameplay systems.

The philosophy remains the same:

- Build reusable systems before content.
- Keep gameplay data-driven.
- Separate UI, layout, and gameplay logic.
- Design for long-term expansion.

Current architecture is divided into three major systems:

- `layout.js` — Responsive scaling and input layout.
- `script.js` — Core gameplay engine.
- `menu.js` — Menu, Story Mode, Save, Pause, Character Selection, and Settings.

---

## Core Features

### Gameplay

- 26-wave campaign
- Multiple miniboss encounters
- Final boss with multiple phases
- Five playable characters
- Unique shooting mechanics
- Character-specific projectiles
- Dynamic enemy patterns
- Projectile trail system
- Enemy HP bars
- Boss HP bar
- Floating combat feedback

### Characters

Currently playable:

- Reimu Hakurei
- Marisa Kirisame
- Yukari Yakumo
- Youmu Konpaku
- Reisen Udongein Inaba

Each character uses independent shooting logic and projectile behavior.

---

## Enemy Systems

- Fairy enemies
- Spirit enemies
- Youkai minibosses
- Final boss (Yuyuko Saigyouji)

Supported bullet patterns include:

- Straight
- Spread
- Wave
- Burst
- Ring
- Spiral
- Zigzag
- Auto Tracking
- Boss-exclusive attacks

---

## Story System

- Startup screen
- Main Menu
- Story Mode
- Continue Save
- Character Selection
- Settings
- Pause Menu
- Exit to Lobby

Progress is automatically saved between waves.

---

## Progression Systems

- Barrier pickups
- Golden Heart revival system
- Temporary Speed Boost
- Temporary Shot Size Boost
- Character upgrades
- Wave progression
- Reward drops

---

## Responsive Systems

- Automatic viewport scaling
- Desktop support
- Mobile touch controls
- Separate trackpad mode
- Dynamic HUD positioning

---

## Audio Framework

The project includes a modular audio manager ready for future implementation.

Planned support:

- Background Music
- Sound Effects
- Character Voices
- Boss Themes

---

## Controls

### Desktop

- Mouse movement via Trackpad
- Space / X → Bomb
- Pause through Settings shortcut

### Mobile

- Touch Trackpad
- Bomb Button
- Pause Button

---

## Project Structure
- index.html
- layout.js
- Responsive layout
- Scaling
- Trackpad handling
- script.js
- Gameplay
- Waves
- Characters
- Enemies
- Bullets
- Bosses
- Items
- Save system
- menu.js
- Startup
- Lobby
- Story
- Character Selection
- Settings
- Pause

---

## Roadmap

- Endless Mode
- Complete Bomb Ultimate system
- Sound implementation
- Voice implementation
- Additional stages
- More Touhou characters
- Scoring system
- Difficulty selection
- Replay system
- Achievements

---

## Changelog

### Version 1.1.0

- Added complete menu framework
- Added Story Mode flow
- Added Character Selection
- Added Settings system
- Added Pause Menu
- Added Save / Continue system
- Added Bomb placeholder mechanic
- Added Golden Heart revival
- Added Item Drop system
- Added Character textures
- Added Enemy textures
- Added Cloud background system
- Added Audio framework
- Expanded campaign to 26 waves
- Improved mobile responsiveness
- Refactored architecture into Layout, Gameplay, and Menu systems

---

## Final Notes

This project continues to serve two goals:

- Building a polished Touhou-inspired bullet hell game.
- Learning software architecture through practical game development.

> *"Using available tools. Building with available understanding. Learning through creation itself."*

— Dhika

---

Licensed under the MIT License.

Made with ❤️ by Dhika
