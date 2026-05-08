# Dhika’s Bullet Hell Project

**Version 1.0.0**  
*A Touhou-inspired danmaku framework built from scratch in JavaScript*

![Project Status](https://img.shields.io/badge/Status-Early_Development-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-green)

A modular, scalable 2D bullet hell framework focused on clean architecture, data-driven design, and long-term extensibility. What started as simple experimentation has evolved into a lightweight engine-like structure capable of supporting complex danmaku patterns and gameplay systems.

---

## Overview

This project began as a personal coding experiment and gradually transformed into a structured **Touhou-inspired bullet hell framework**. Instead of focusing on quick hardcoded content, the emphasis has always been on building solid, reusable systems first.

The framework prioritizes:
- Separation of logic and rendering
- Data-driven enemy and projectile behavior
- Responsive design across devices
- Future-proof architecture for characters, patterns, and mechanics

It is **not yet a complete game**, but it already functions as a solid foundation for one.

---

## Core Features

### 🎮 Gameplay Systems
- Responsive 2D bullet hell gameplay with normalized logical coordinates
- Modular character system with unique shooting behaviors
- Advanced projectile factory system (`makePlayerBullet`, `makeEnemyBullet`)
- Rich bullet pattern library (spread, ring, spiral, wave, zigzag, tracking, etc.)
- Structured wave progression with miniboss and boss encounters

### 🛠️ Architecture Highlights
- **Responsive Layout System**: Dynamic viewport scaling with consistent gameplay across resolutions
- **Character Registry**: Easy addition of new playable characters with unique abilities
- **Enemy Variant System**: Data-driven enemies with movement, patterns, and drop tables
- **Trail Rendering Engine**: Configurable, performant projectile trails
- **Boss Phase Framework**: Multi-phase encounters with transitions and escalation
- **Upgrade & Reward System**: Power-ups, barriers, speed boosts, and floating text feedback

### 🎨 Visual & Polish
- Dynamic projectile trails and visual effects
- Phase indicators, HP bars, and attack warnings
- Device-aware input handling (keyboard + trackpad/mobile)

---

## Currently Playable Characters

- **Reimu** — Homing needles with elegant trails
- **Marisa** — High-power Yin-Yang orb shots

*Future characters (placeholders ready):* Yukari, Youmu, Reisen, and more.

---

## Bosses

**Yuyuko Saigyouji** — Fully implemented final boss with multiple phases featuring:
- Radial rings
- Spiral patterns
- Layered spreads
- Dynamic difficulty escalation

---

## Project Structure & Philosophy

The codebase emphasizes **systems over content**. Most mechanics are built as configurable, reusable modules rather than one-off scripts. This makes balancing, expansion, and maintenance significantly easier as the project grows.

Key principles:
- Build foundations first
- Prefer data-driven design
- Keep logic and rendering separate
- Design for iteration and scalability

---

## How to Run

1. Clone the repository
2. Open `index.html` in a modern browser (recommended: Chrome/Edge)
3. Play!

*No build step required — pure vanilla JavaScript + HTML5 Canvas.*

---

## Controls

- Using a **MousePad** from below the **gameframe**.
- Later controls will be added.

---

## Roadmap

- More playable characters with unique mechanics
- Scoring system & survival modes
- Additional bosses and stages
- Sound & music integration
- Level editor / pattern tool (long-term)
- Mobile touch controls improvement
- Save system & unlocks

---

## Changelog

### Version 1.0.0 (8/5/26)
- Initial public framework release
- Responsive layout system
- Character & projectile architecture
- Yuyuko boss with multi-phase patterns
- Wave progression system
- Trail rendering engine
- Upgrade and reward systems

*See [CHANGELOG.md](CHANGELOG.md) for detailed history.*

---

## Final Notes

This project was built with curiosity, persistence, and the joy of learning through creation.

> "Using available tools. Building with available understanding. Learning through creation itself."

— Dhika

---

## License

Licensed under the MIT License.
See LICENSE for more information.

---

**Made with ❤️ by Dhika**
