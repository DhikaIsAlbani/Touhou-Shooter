// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const FRAME_W             = 600;
const FRAME_H             = 400;
const PLAYER_SIZE         = 36;
const ENEMY_SIZE          = 48;
const BULLET_SIZE         = 8;
const ENEMY_BULLET_SPEED  = 2.5;
const GOLDEN_HEARTS_MAX   = 3;   // revival charges cap — see Golden Heart drops
const BOMB_START_COUNT    = 3;   // placeholder bomb economy — see triggerBomb()
const bossBarEl    = document.getElementById('bossbar');
const bossBarFill  = document.getElementById('bossbar-fill');
const bossBarName  = document.getElementById('bossbar-name');
const bossBarPhase = document.getElementById('bossbar-phase');

// ─── AUDIO HOOK ───────────────────────────────────────────────────────────────
// Thin, safe wrapper around menu.js's AudioManager placeholder — a no-op until
// real audio files are wired up there.
function sfx(name) {
  if (typeof AudioManager !== 'undefined') AudioManager.playSFX(name);
}
function bgm(track) {
  if (typeof AudioManager !== 'undefined') AudioManager.playBGM(track);
}

// ─── CHARACTER TEXTURES ─────────────────────────────────────────────────────
const CHARACTER_TEXTURES = {
  Reimu:  './assets/characters/reimu.png',
  Marisa: './assets/characters/marisa.png',
  Yukari: './assets/characters/yukari.png',
  Youmu:  './assets/characters/youmu.png',
  Reisen: './assets/characters/reisen.png',
};

// ─── ENEMY TEXTURES ────────────────────────────────────────────────────────
const ENEMY_TEXTURES = {
  Fairy1:  './assets/enemies/fairies/icefairy',
  Spirit1: './assets/enemies/spirits/hauntedspirit',
  Fairy2:  './assets/enemies/fairies/firefairy',
  Spirit2: './assets/enemies/spirits/skullspirit',
  Fairy3:  './assets/enemies/fairies/greenfairy',
  Spirit3: './assets/enemies/spirits/firespirit',
  Fairy4:  './assets/enemies/fairies/humanfairy',
  Spirit4: './assets/enemies/spirits/lightningspirit',
  Fairy5:  './assets/enemies/fairies/ashfairy',
  Spirit5: './assets/enemies/spirits/skullfirespirit',
  Fairy6: './assets/enemies/fairies/shadowfairy',
  Spirit6: './assets/enemies/spirits/shadowspirit',
  Fairy7: './assets/enemies/fairies/crystalfairy',
  Spirit7: './assets/enemies/spirits/crystalspirit',
  Fairy8: './assets/enemies/fairies/toxicfairy',
  Spirit8: './assets/enemies/spirits/plaguespirit',
  Fairy9: './assets/enemies/fairies/celestialfairy',
  Spirit9: './assets/enemies/spirits/cosmicspirit',
  Fairy10: './assets/enemies/fairies/mechfairy',
  Spirit10: './assets/enemies/spirits/clockworkspirit',
  Youkai1: './assets/enemies/youkai/kasaobake',
  Youkai2: './assets/enemies/youkai/chochinobake',
  Youkai3: './assets/enemies/youkai/karasu',
  Youkai4: './assets/enemies/youkai/nue',
  Youkai5: './assets/enemies/youkai/kogasa',
  Yuyuko: './assets/bosses/yuyuko',
};

// ─── PLAYER BULLET TEXTURES ────────────────────────────────────────────────
const PLAYER_BULLET_TEXTURES = {
  reimu_needle: './assets/bullets/jail-talisman.gif',
  reimu_orb:    './assets/bullets/yin-yang.gif',
  // Yukari
  yukari_cube:  './assets/bullets/tesser.gif',

  // Youmu
  youmu_slash:  './assets/bullets/slasm.gif',

};
const LASER_TEXTURES = {
      // Reisen
    reisen_laser: './assets/bullets/reisenlaser.png',
    master_spark: "./assets/lasers/master_spark.png",
};
const MARISA_ORBS = [
  './assets/bullets/marisa_orb1.gif',
  './assets/bullets/marisa_orb2.gif',
  './assets/bullets/marisa_orb3.gif',
  './assets/bullets/marisa_orb4.gif',
  './assets/bullets/marisa_orb5.gif',
];

// ─── ENEMY BULLET TEXTURES ─────────────────────────────────────────────────
const ENEMY_BULLET_TEXTURES = {
  fairy_red:  './assets/bullets/enemyfire1.png',
  spirit_blue: './assets/bullets/enemyice2.png',
  fairy_gold: './assets/bullets/enemyvoid3.png',
  spirit_void: './assets/bullets/enemystar4.png',
  fairy_ice: './assets/bullets/enemyplasma5.png',
  spirit_fire: './assets/bullets/enemyruby6.png',
};

// ─── TRAIL CONFIG ─────────────────────────────────────────────────────────────
// Each bullet type can carry a trail. Keyed by trailKey string.
// colors: CSS values head→tail
const TRAIL_DEFS = {
  reimu_needle: {
    length:  7,
    spacing: 7,    // px behind head per particle
    colors:  ['#ff6644', '#dd8855', '#ccaa88', '#bbbbaa', 'rgba(200,200,180,0)'],
    size:    8,
  },
  reimu_orb: {
    length:  8,
    spacing: 6,
    colors:  ['rgba(255,255,255,0.9)', 'rgba(200,200,255,0.6)', 'rgba(150,150,220,0.3)', 'rgba(80,80,120,0)'],
    size:    6,
  },
};

// ─── REIMU UPGRADE SPEEDS ─────────────────────────────────────────────────────
const REIMU_SPEED_SLOW = 4.5;
const REIMU_SPEED_FAST = 7.5;

// ─── CHARACTER REGISTRY ───────────────────────────────────────────────────────
const CHARACTERS = {

  // ── REIMU ─────────────────────────────────────────────────────────────────
Reimu: {
  upgraded: false,

  shoot(p) {

    const spd = 7;
    const cx  = p.y + PLAYER_SIZE / 2;
    const px  = p.x + PLAYER_SIZE;

    // ── CENTER NEEDLE ─────────────────────────────────────
    state.playerBullets.push(
      makePlayerBullet(
        px + 8,
        cx - BULLET_SIZE / 2,
        spd,
        0,
        {
          color: '#ff4444',
          size: BULLET_SIZE,
          texture: 'reimu_needle',
          rotation: 90,
          renderScale: 2,
          trail: 'reimu_needle',
        }
      )
    );

    // ── ORBS ONLY AFTER UPGRADE ───────────────────────────
    if (!this.upgraded) return;

    // TOP ORB
    state.playerBullets.push(
      makePlayerBullet(
        px - 4,
        cx - 33,
        spd,
        0,
        {
          color: '#ffffff',
          size: 12,
          renderScale: 1.5,
          texture: 'reimu_orb',
          trail: 'reimu_orb',
        }
      )
    );

    // BOTTOM ORB
    state.playerBullets.push(
      makePlayerBullet(
        px - 4,
        cx + 25,
        spd,
        0,
        {
          color: '#ffffff',
          size: 12,
          renderScale: 1.5,
          texture: 'reimu_orb',
          trail: 'reimu_orb',
        }
      )
    );
  },
},

Marisa: {
  _hue: 0,

  shoot(p) {

    const spd = 7;
    const px  = p.x + PLAYER_SIZE;
    const cy  = p.y + PLAYER_SIZE / 2;

    // CENTER SHOT
    this._hue = (this._hue + 30) % 360;

    state.playerBullets.push(
      makePlayerBullet(
        px,
        cy,
        spd,
        0,
        {
          color: `hsl(${this._hue},100%,65%)`,
          size: 12,
          texture: 'marisa_orb',
        }
      )
    );

    const angle = Math.atan2(24, 150);

    // TOP ORB → DOWNWARD
    this._hue = (this._hue + 30) % 360;

    state.playerBullets.push(
      makePlayerBullet(
        px,
        cy - 24,
        spd * Math.cos(angle),
        spd * Math.sin(angle),
        {
          color: `hsl(${this._hue},100%,65%)`,
          size: 12,
          texture: 'marisa_orb',
        }
      )
    );

    // BOTTOM ORB → UPWARD
    this._hue = (this._hue + 30) % 360;

    state.playerBullets.push(
      makePlayerBullet(
        px,
        cy + 24,
        spd * Math.cos(angle),
        -spd * Math.sin(angle),
        {
          color: `hsl(${this._hue},100%,65%)`,
          size: 12,
          texture: 'marisa_orb',
        }
      )
    );
  },
},
  Yukari: {

  shoot(p) {

    const px = p.x + PLAYER_SIZE;
    const cy = p.y + PLAYER_SIZE / 2;

    [-28, 28].forEach(offset => {

      const b = makePlayerBullet(
        px,
        cy + offset,
        4.2,
        0,
        {
          texture: 'yukari_cube',
          size: 32,
          renderScale: 1,
          damage: 2.8,
          rotation: 0,
        }
      );

      b.track = true;
      b.turnSpeed = 0.025;
      b.maxTrackTime = 9999;

      state.playerBullets.push(b);
    });
  },
},
  Youmu: {

  shoot(p) {

    const slashCount =
      Math.random() < 0.5 ? 1 : 2;

    for (let i = 0; i < slashCount; i++) {

      const yOffset =
        (Math.random() - 0.5) * 180;

      const slash = makePlayerBullet(
        p.x + 180 + Math.random() * 140,
        p.y + yOffset,
        -0.5,
        0,
        {
          texture: 'youmu_slash',
          size: 64,
          renderScale: 1,
          damage: 4,
          rotation: -28,
        }
      );

      slash.life = 10;
      slash.slash = true;


      state.playerBullets.push(slash);
    }
  },
},
  Reisen: {

  shoot(p) {

    if (state.player._reisenLaser)
      return;

    const laser = makeLaser(
    p.x + PLAYER_SIZE + 0,
    p.y + PLAYER_SIZE / 2 - 3 + 0,
    {
        texture: 'reisen_laser',
        width: 1000,
        height: 64,
        damage: 0.1,
    }
);
state.player._reisenLaser = laser;
state.playerBullets.push(laser);
  },
},
};

const ENEMY_VARIANTS = {

  Fairy1: {
    color: '#ff6666',
    bulletColor: '#ff9999',
    bulletTexture: 'fairy_red',
    bulletSize: 8,
    followPlayer: false,
    patternPool: ['straight'],
    upgradeChance: 0.10,
  },

  Spirit1: {
    color: '#8888ff',
    bulletColor: '#bbbbff',
    bulletTexture: 'spirit_blue',
    bulletSize: 10,
    followPlayer: true,
    patternPool: ['wave'],
    upgradeChance: 1,
  },

  Fairy2: {
    color: '#ffaa44',
    bulletColor: '#ffdd99',
    bulletTexture: 'fairy_gold',
    bulletSize: 9,
    followPlayer: false,
    patternPool: ['spread'],
    upgradeChance: 0.18,
  },

  Spirit2: {
    color: '#cc66ff',
    bulletColor: '#eeccff',
    bulletTexture: 'spirit_void',
    bulletSize: 11,
    followPlayer: true,
    patternPool: ['autoTrack'],
    upgradeChance: 0.20,
  },

  Fairy3: {
    color: '#ff4444',
    bulletColor: '#ffaaaa',
    bulletTexture: 'fairy_red',
    bulletSize: 8,
    followPlayer: false,
    patternPool: ['burst'],
    upgradeChance: 0.22,
  },

  Spirit3: {
    color: '#66ffff',
    bulletColor: '#ccffff',
    bulletTexture: 'spirit_blue',
    bulletSize: 12,
    followPlayer: true,
    patternPool: ['wave', 'autoTrack'],
    upgradeChance: 0.25,
  },

  Fairy4: {
    color: '#ff2277',
    bulletColor: '#ff88aa',
    bulletTexture: 'fairy_gold',
    bulletSize: 10,
    followPlayer: false,
    patternPool: ['spread', 'burst'],
    upgradeChance: 0.30,
  },

  Spirit4: {
    color: '#9955ff',
    bulletColor: '#ddbbff',
    bulletTexture: 'spirit_void',
    bulletSize: 12,
    followPlayer: true,
    patternPool: ['autoTrack', 'wave'],
    upgradeChance: 0.35,
  },

  Fairy5: {
    color: '#ff0033',
    bulletColor: '#ff99aa',
    bulletTexture: 'fairy_red',
    bulletSize: 11,
    followPlayer: true,
    patternPool: ['spread', 'burst', 'straight'],
    upgradeChance: 0.40,
  },

  Spirit5: {
    color: '#5500aa',
    bulletColor: '#ddccff',
    bulletTexture: 'spirit_void',
    bulletSize: 13,
    followPlayer: true,
    patternPool: ['wave', 'burst', 'autoTrack'],
    upgradeChance: 0.45,
  },
  Fairy6: {
    color: '#ff6600', bulletColor: '#ffaa44', bulletTexture: null,
    bulletSize: 9, followPlayer: false,
    patternPool: ['spread', 'straight'], upgradeChance: 0.20,
  },
  Spirit6: {
    color: '#0066ff', bulletColor: '#44aaff', bulletTexture: null,
    bulletSize: 11, followPlayer: true,
    patternPool: ['wave', 'ring'], upgradeChance: 0.25,
  },
  Fairy7: {
    color: '#cc00ff', bulletColor: '#ee88ff', bulletTexture: null,
    bulletSize: 10, followPlayer: false,
    patternPool: ['burst', 'zigzag'], upgradeChance: 0.25,
  },
  Spirit7: {
    color: '#00ffaa', bulletColor: '#88ffcc', bulletTexture: null,
    bulletSize: 12, followPlayer: true,
    patternPool: ['spiral', 'autoTrack'], upgradeChance: 0.30,
  },
  Fairy8: {
    color: '#ff3300', bulletColor: '#ff7755', bulletTexture: null,
    bulletSize: 10, followPlayer: false,
    patternPool: ['burst', 'spread', 'straight'], upgradeChance: 0.30,
  },
  Spirit8: {
    color: '#3300ff', bulletColor: '#7766ff', bulletTexture: null,
    bulletSize: 13, followPlayer: true,
    patternPool: ['wave', 'ring', 'autoTrack'], upgradeChance: 0.35,
  },
  Fairy9: {
    color: '#ff0066', bulletColor: '#ff55aa', bulletTexture: null,
    bulletSize: 11, followPlayer: true,
    patternPool: ['spiral', 'burst', 'spread'], upgradeChance: 0.35,
  },
  Spirit9: {
    color: '#6600cc', bulletColor: '#aa55ff', bulletTexture: null,
    bulletSize: 14, followPlayer: true,
    patternPool: ['zigzag', 'ring', 'autoTrack'], upgradeChance: 0.40,
  },
  Fairy10: {
    color: '#ff2200', bulletColor: '#ff6644', bulletTexture: null,
    bulletSize: 12, followPlayer: true,
    patternPool: ['burst', 'spiral', 'spread', 'straight'], upgradeChance: 0.40,
  },
  Spirit10: {
    color: '#220088', bulletColor: '#9955ff', bulletTexture: null,
    bulletSize: 15, followPlayer: true,
    patternPool: ['wave', 'ring', 'zigzag', 'autoTrack'], upgradeChance: 0.45,
  },
  // ── Mini-bosses ──
  Youkai1: {
    name: 'Kasa Obake',
    color: '#884400', bulletColor: '#ffaa44', bulletTexture: null,
    bulletSize: 13, followPlayer: true, size: 44,
    patternPool: ['burst', 'kasaVolley', 'spread'], upgradeChance: 1.0,
  },
  Youkai2: {
    name: 'Chōchin Obake',
    color: '#006644', bulletColor: '#44ffaa', bulletTexture: null,
    bulletSize: 14, followPlayer: true, size: 64,
    patternPool: ['spiral', 'ring', 'autoTrack'], upgradeChance: 1.0,
  },
  Youkai3: {
    name: 'Karasu Tengu',
    color: '#440088', bulletColor: '#cc66ff', bulletTexture: null,
    bulletSize: 15, followPlayer: true, size: 44,
    patternPool: ['zigzag', 'burst', 'ring', 'spread'], upgradeChance: 1.0,
  },
  Youkai4: {
    name: 'Nue Houjuu',
    color: '#880022', bulletColor: '#ff5577', bulletTexture: null,
    bulletSize: 16, followPlayer: true, size: 44,
    patternPool: ['spiral', 'burst', 'ring', 'autoTrack'], upgradeChance: 1.0,
  },
  Youkai5: {
    name: 'Kogasa Tatara',
    color: '#004488', bulletColor: '#44aaff', bulletTexture: null,
    bulletSize: 16, followPlayer: true, size: 44,
    patternPool: ['ring', 'zigzag', 'spiral', 'burst', 'autoTrack'], upgradeChance: 1.0,
  },
  // ── Final Boss ──
  Yuyuko: {
    color: '#ff88cc', bulletColor: '#ffccee', bulletTexture: null,
    bulletSize: 14, followPlayer: false, size: 54,
    patternPool: ['bossPhase1'], upgradeChance: 0,
  },
};

const killCounts = {}; // tracks kills per enemy id

function vari(enemy, key, fallback) {
  const v = ENEMY_VARIANTS[enemy.id];
  return (v && v[key] !== undefined) ? v[key] : fallback;
}
function varOnDeath(enemy, key, fallback) {
  const v = ENEMY_VARIANTS[enemy.id];
  return (v && v.onDeath && v.onDeath[key] !== undefined) ? v.onDeath[key] : fallback;
}

// ─── WAVE DEFINITIONS ─────────────────────────────────────────────────────────
const WAVES = [
  // W1 — tutorial: one slow fairy
  [{ id:'Fairy1', hp:10, maxHp:10, x:650, y:180, anchorX:650, anchorY:180, patternInterval:2400, pattern:'straight' }],

  // W2 — two enemies, gentle
  [
    { id:'Fairy2',  hp:14, maxHp:14, x:520, y:100, anchorX:460, anchorY:100, patternInterval:2000, pattern:'spread'   },
    { id:'Spirit1', hp:12, maxHp:12, x:520, y:280, anchorX:460, anchorY:280, patternInterval:2200, pattern:'wave'     },
  ],

  // W3
  [
    { id:'Fairy3',  hp:18, maxHp:18, x:650, y:80,  anchorX:465, anchorY:80,  patternInterval:1800, pattern:'burst'    },
    { id:'Spirit2', hp:16, maxHp:16, x:650, y:300, anchorX:465, anchorY:300, patternInterval:1900, pattern:'autoTrack'},
  ],

  // W4
  [
    { id:'Fairy4',  hp:20, maxHp:20, x:520, y:80,  anchorX:460, anchorY:80,  patternInterval:1600, pattern:'spread'   },
    { id:'Spirit3', hp:20, maxHp:20, x:520, y:300, anchorX:460, anchorY:300, patternInterval:1700, pattern:'wave'     },
  ],

  // W5 — first mini-boss
  [{ id:'Youkai1', hp:80, maxHp:80, x:650, y:175, anchorX:465, anchorY:175, patternInterval:2600, pattern:'kasaVolley' }],

  // W6
  [
    { id:'Fairy5',  hp:24, maxHp:24, x:650, y:80,  anchorX:465, anchorY:80,  patternInterval:1500, pattern:'burst'    },
    { id:'Spirit4', hp:24, maxHp:24, x:650, y:300, anchorX:465, anchorY:300, patternInterval:1600, pattern:'autoTrack'},
  ],

  // W7
  [
    { id:'Fairy6',  hp:26, maxHp:26, x:520, y:80,  anchorX:460, anchorY:80,  patternInterval:1400, pattern:'zigzag'   },
    { id:'Spirit5', hp:28, maxHp:28, x:520, y:200, anchorX:460, anchorY:200, patternInterval:1500, pattern:'wave'     },
    { id:'Fairy6',  hp:26, maxHp:26, x:520, y:320, anchorX:460, anchorY:320, patternInterval:1400, pattern:'spread'   },
  ],

  // W8
  [
    { id:'Fairy7',  hp:28, maxHp:28, x:650, y:80,  anchorX:465, anchorY:80,  patternInterval:1300, pattern:'spiral'   },
    { id:'Spirit6', hp:30, maxHp:30, x:650, y:300, anchorX:465, anchorY:300, patternInterval:1400, pattern:'ring'     },
  ],

  // W9
  [
    { id:'Fairy8',  hp:30, maxHp:30, x:520, y:80,  anchorX:460, anchorY:80,  patternInterval:1200, pattern:'burst'    },
    { id:'Spirit7', hp:32, maxHp:32, x:520, y:200, anchorX:460, anchorY:200, patternInterval:1300, pattern:'spiral'   },
    { id:'Fairy8',  hp:30, maxHp:30, x:520, y:320, anchorX:460, anchorY:320, patternInterval:1200, pattern:'spread'   },
  ],

  // W10 — second mini-boss
  [{ id:'Youkai2', hp:110, maxHp:110, x:650, y:175, anchorX:465, anchorY:175, patternInterval:1200, pattern:'spiral' }],

  // W11
  [
    { id:'Fairy9',  hp:32, maxHp:32, x:650, y:80,  anchorX:465, anchorY:80,  patternInterval:1100, pattern:'zigzag'   },
    { id:'Spirit8', hp:34, maxHp:34, x:650, y:300, anchorX:465, anchorY:300, patternInterval:1200, pattern:'ring'     },
  ],

  // W12
  [
    { id:'Fairy10', hp:34, maxHp:34, x:520, y:80,  anchorX:460, anchorY:80,  patternInterval:1000, pattern:'burst'    },
    { id:'Spirit8', hp:36, maxHp:36, x:520, y:190, anchorX:460, anchorY:190, patternInterval:1100, pattern:'spiral'   },
    { id:'Spirit9', hp:36, maxHp:36, x:520, y:310, anchorX:460, anchorY:310, patternInterval:1100, pattern:'ring'     },
  ],

  // W13
  [
    { id:'Fairy10', hp:36, maxHp:36, x:650, y:80,  anchorX:465, anchorY:80,  patternInterval:900,  pattern:'zigzag'   },
    { id:'Spirit9', hp:38, maxHp:38, x:650, y:200, anchorX:465, anchorY:200, patternInterval:1000, pattern:'autoTrack'},
    { id:'Fairy10', hp:36, maxHp:36, x:650, y:320, anchorX:465, anchorY:320, patternInterval:900,  pattern:'spread'   },
  ],

  // W14
  [
    { id:'Spirit10', hp:42, maxHp:42, x:520, y:100, anchorX:460, anchorY:100, patternInterval:900,  pattern:'ring'     },
    { id:'Fairy10',  hp:38, maxHp:38, x:520, y:300, anchorX:460, anchorY:300, patternInterval:950,  pattern:'spiral'   },
  ],

  // W15 — third mini-boss
  [{ id:'Youkai3', hp:140, maxHp:140, x:650, y:175, anchorX:465, anchorY:175, patternInterval:1000, pattern:'ring' }],

  // W16
  [
    { id:'Spirit10', hp:44, maxHp:44, x:650, y:80,  anchorX:465, anchorY:80,  patternInterval:850,  pattern:'zigzag'   },
    { id:'Spirit10', hp:44, maxHp:44, x:650, y:300, anchorX:465, anchorY:300, patternInterval:850,  pattern:'spiral'   },
  ],

  // W17
  [
    { id:'Fairy10',  hp:42, maxHp:42, x:520, y:80,  anchorX:460, anchorY:80,  patternInterval:800,  pattern:'burst'    },
    { id:'Spirit10', hp:46, maxHp:46, x:520, y:200, anchorX:460, anchorY:200, patternInterval:850,  pattern:'ring'     },
    { id:'Fairy10',  hp:42, maxHp:42, x:520, y:320, anchorX:460, anchorY:320, patternInterval:800,  pattern:'zigzag'   },
  ],

  // W18
  [
    { id:'Spirit10', hp:48, maxHp:48, x:650, y:90,  anchorX:465, anchorY:90,  patternInterval:780,  pattern:'spiral'   },
    { id:'Fairy10',  hp:44, maxHp:44, x:650, y:200, anchorX:465, anchorY:200, patternInterval:820,  pattern:'autoTrack'},
    { id:'Spirit10', hp:48, maxHp:48, x:650, y:310, anchorX:465, anchorY:310, patternInterval:780,  pattern:'ring'     },
  ],

  // W19
  [
    { id:'Spirit10', hp:50, maxHp:50, x:520, y:80,  anchorX:460, anchorY:80,  patternInterval:750,  pattern:'ring'     },
    { id:'Spirit10', hp:50, maxHp:50, x:520, y:200, anchorX:460, anchorY:200, patternInterval:750,  pattern:'spiral'   },
    { id:'Spirit10', hp:50, maxHp:50, x:520, y:320, anchorX:460, anchorY:320, patternInterval:750,  pattern:'zigzag'   },
  ],

  // W20 — fourth mini-boss
  [{ id:'Youkai4', hp:175, maxHp:175, x:650, y:175, anchorX:465, anchorY:175, patternInterval:900, pattern:'spiral' }],

  // W21
  [
    { id:'Spirit10', hp:52, maxHp:52, x:650, y:80,  anchorX:465, anchorY:80,  patternInterval:700,  pattern:'ring'     },
    { id:'Fairy10',  hp:48, maxHp:48, x:650, y:190, anchorX:465, anchorY:190, patternInterval:750,  pattern:'burst'    },
    { id:'Spirit10', hp:52, maxHp:52, x:650, y:310, anchorX:465, anchorY:310, patternInterval:700,  pattern:'autoTrack'},
  ],

  // W22
  [
    { id:'Spirit10', hp:54, maxHp:54, x:520, y:80,  anchorX:460, anchorY:80,  patternInterval:660,  pattern:'spiral'   },
    { id:'Spirit10', hp:54, maxHp:54, x:520, y:200, anchorX:460, anchorY:200, patternInterval:660,  pattern:'ring'     },
    { id:'Fairy10',  hp:50, maxHp:50, x:520, y:320, anchorX:460, anchorY:320, patternInterval:700,  pattern:'zigzag'   },
  ],

  // W23
  [
    { id:'Fairy10',  hp:52, maxHp:52, x:650, y:80,  anchorX:465, anchorY:80,  patternInterval:630,  pattern:'burst'    },
    { id:'Spirit10', hp:56, maxHp:56, x:650, y:175, anchorX:465, anchorY:175, patternInterval:650,  pattern:'ring'     },
    { id:'Fairy10',  hp:52, maxHp:52, x:650, y:310, anchorX:465, anchorY:310, patternInterval:630,  pattern:'spread'   },
  ],

  // W24
  [
    { id:'Spirit10', hp:58, maxHp:58, x:520, y:80,  anchorX:460, anchorY:80,  patternInterval:600,  pattern:'spiral'   },
    { id:'Spirit10', hp:58, maxHp:58, x:520, y:200, anchorX:460, anchorY:200, patternInterval:600,  pattern:'zigzag'   },
    { id:'Spirit10', hp:58, maxHp:58, x:520, y:320, anchorX:460, anchorY:320, patternInterval:600,  pattern:'autoTrack'},
  ],

  // W25 — fifth mini-boss
  [{ id:'Youkai5', hp:220, maxHp:220, x:650, y:175, anchorX:465, anchorY:175, patternInterval:800, pattern:'ring' }],

  // W26 — final boss
  [{ id:'Yuyuko', hp:500, maxHp:500, x:650, y:160, anchorX:650, anchorY:160, patternInterval:700, pattern:'bossPhase1' }],
];

// ─── GAME STATE ───────────────────────────────────────────────────────────────
const state = {
  player: {
    x: 60, y: 180, targetX: 60, targetY: 180,
    hp: 5, maxHp: 5,
    barriers: 3,                 // barrier count
    goldenHearts: 0,             // revival charges — see reviveWithGoldenHeart()
    bombs: BOMB_START_COUNT,     // placeholder bomb economy — see triggerBomb()
    shootInterval: 350,
    baseShootInterval: 350,
    lastShot: 0,
    characterId: 'Reimu',
  },
  activeEffects: {               // temporary powerup timers (ms remaining)
    speedUp:  0,
    sizeUp:   0,
  },
  enemies: [],
  playerBullets: [],
  enemyBullets: [],
  dropItems: [],                 // falling pickups
  currentWave: 0,
  running: false,
  paused: false,                 // true while the pause menu (menu.js) is open
  lastTime: 0,
};

// ─── DOM REFS ─────────────────────────────────────────────────────────────────
const gameFrame = document.querySelector('.Gameframe');
const charEl    = document.querySelector('.character');
const trackpad  = document.querySelector('.mousetrackpad');
const heartsEl  = document.querySelector('.userhearts');
const enemyHPEl = document.querySelector('.enemyhealth');
const cloudLayer =
  document.querySelector('.cloud-layer');

function spawnCloud(x, y, size, speed, texture) {

  const cloud =
    document.createElement('img');

  cloud.className = 'cloud';

  cloud.src = texture;

  cloud.style.left = x + 'px';
  cloud.style.top  = y + 'px';
  cloud.style.zIndex =
  Math.random() < 0.5 ? 1 : 2;
  cloud.style.opacity =
  0.10 + Math.random() * 0.08;
  cloud.style.filter =
  `blur(${1 + Math.random() * 1.5}px)`;
  cloud.style.width = size + 'px';
  cloud.style.height = 'auto';

  cloud.style.animationDuration =
    speed + 's';

  cloudLayer.appendChild(cloud);

  // remove after drifting
  setTimeout(() => {
    cloud.remove();
  }, speed * 1000);
}

function applyCharacterTexture() {

  const id = state.player.characterId;
  const tex = CHARACTER_TEXTURES[id];

  if (tex) {

    charEl.style.background =
      `url('${tex}') center/cover no-repeat`;

    charEl.style.backgroundize = '100% 100%';
    charEl.style.imageRendering = 'pixelated';
    charEl.style.backgroundColor = 'transparent';
    charEl.style.boxShadow = 'none';
    charEl.style.width  = PLAYER_SIZE + 'px';
    charEl.style.height = PLAYER_SIZE + 'px';

  } else {

    charEl.style.background = '#fff';

  }
}
// ─── TRACKPAD ─────────────────────────────────────────────────────────────────
let lastMouseX = null, lastMouseY = null;
trackpad.addEventListener('mouseenter', (e) => { lastMouseX = e.clientX; lastMouseY = e.clientY; });
trackpad.addEventListener('mouseleave', () => { lastMouseX = null; lastMouseY = null; });
trackpad.addEventListener('mousemove', (e) => {
  if (!state.running || state.paused) return;
  if (lastMouseX === null) { lastMouseX = e.clientX; lastMouseY = e.clientY; return; }
  let dx = e.clientX - lastMouseX, dy = e.clientY - lastMouseY;
  lastMouseX = e.clientX; lastMouseY = e.clientY;
  dx /= LAYOUT.scale;   
  dy /= LAYOUT.scale;   
  state.player.targetX = Math.max(0, Math.min(FRAME_W - PLAYER_SIZE, state.player.targetX + dx));
  state.player.targetY = Math.max(0, Math.min(FRAME_H - PLAYER_SIZE, state.player.targetY + dy));
});
let lastTouchX = null, lastTouchY = null;
trackpad.addEventListener('touchstart', (e) => {
  lastTouchX = e.touches[0].clientX; lastTouchY = e.touches[0].clientY;
}, { passive: true });
trackpad.addEventListener('touchmove', (e) => {
  if (!state.running || state.paused || lastTouchX === null) return;
  e.preventDefault();
  let dx = e.touches[0].clientX - lastTouchX, dy = e.touches[0].clientY - lastTouchY;
  lastTouchX = e.touches[0].clientX; lastTouchY = e.touches[0].clientY;
  dx /= LAYOUT.scale;   
  dy /= LAYOUT.scale;   
  state.player.targetX = Math.max(0, Math.min(FRAME_W - PLAYER_SIZE, state.player.targetX + dx));
  state.player.targetY = Math.max(0, Math.min(FRAME_H - PLAYER_SIZE, state.player.targetY + dy));
}, { passive: false });

// ─── BOMB (placeholder) ─────────────────────────────────────────────────────
// PLANNED full sequence (not yet implemented): freeze all enemies + the
// player, strip/disable enemy bullets without dealing damage, play a
// per-character cutscene video, then unleash a unique "ultimate" attack
// pattern before resuming normal play.
// For now this is a lightweight placeholder: it clears enemy bullets off
// screen (a classic bullet-hell "panic button" effect) and consumes a charge,
// so the button/key is wired up and testable ahead of the real feature.
function triggerBomb() {
  if (!state.running || state.paused) return;
  if (state.player.bombs <= 0) return;

  state.player.bombs--;

  // TODO(bomb-v2): freeze state, hide/disable enemy bullets without removing
  // them, play cutscene video, spawn ultimate pattern, then resume.
  state.enemyBullets.forEach(b => { removeTrail(b); b.el?.remove(); });
  state.enemyBullets.length = 0;

  showFloatingText('💥 BOMB! (placeholder)', state.player.x, state.player.y - 30, '#ffaa33');
  sfx('bomb');
  updateHUD();
}

const bombBtnEl = document.getElementById('btn-bomb');
if (bombBtnEl) bombBtnEl.addEventListener('click', triggerBomb);

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.key === 'x' || e.key === 'X') {
    if (!state.running || state.paused) return;
    e.preventDefault();
    triggerBomb();
  }
});

// ─── TRAIL SYSTEM ─────────────────────────────────────────────────────────────
function initTrail(b) {
  const def = TRAIL_DEFS[b.trailKey];
  if (!def) return;
  b.trail = [];
  for (let i = 0; i < def.length; i++) {
    const el = document.createElement('span');
    el.style.cssText = [
      'position:absolute', 'border-radius:50%', 'pointer-events:none',
      `width:${def.size}px`, `height:${def.size}px`, 'opacity:0', `height:${def.size / LAYOUT.scale}px`, 'opacity:0',
    ].join(';');
    gameFrame.appendChild(el);
    b.trail.push(el);
  }
}

function updateTrail(b) {
  if (!b.trail) return;
  const def = TRAIL_DEFS[b.trailKey];
  if (!def) return;
  b.trail.forEach((el, i) => {
    const t  = (i + 1) / b.trail.length;                 // 0 near head, 1 at tail
    const speed = Math.hypot(b.vx, b.vy);
    const tx = b.x - i * def.spacing * (speed / 7);
    const ty = b.y + (b.size || BULLET_SIZE) / 2 - def.size / 2;
    const ci = Math.min(Math.floor(t * def.colors.length), def.colors.length - 1);
    el.style.left       = tx + 'px';
    el.style.top        = ty + 'px';
    el.style.background = def.colors[ci];
    el.style.opacity    = String(Math.max(0, 1 - t * 0.9));
  });
}

function removeTrail(b) {
  if (!b || !b.trail) return;
  b.trail.forEach(el => el.remove());
  b.trail = null;
}

// ─── DROP ITEMS ───────────────────────────────────────────────────────────────
// Types: 'barrier' | 'speedUp' | 'sizeUp' | 'goldenHeart'
// Spawned on enemy death (random chance) or fall from top periodically.

const DROP_COLORS  = { barrier: '#44ffdd', speedUp: '#ffee44', sizeUp: '#ff88ff', goldenHeart: '#ffdd55' };
const DROP_LABELS  = { barrier: '🛡',       speedUp: '⚡',      sizeUp:  '⬆',      goldenHeart: '💛' };
const DROP_FALL_V  = 1.2;  // px per frame, logical space

function spawnDrop(type, x, y) {
  const el = document.createElement('div');
  el.style.cssText = [
    'position:absolute', 'border-radius:4px', 'pointer-events:none',
    'width:16px', 'height:16px', 'z-index:30',
    `background:${DROP_COLORS[type]}`,
    'display:flex', 'align-items:center', 'justify-content:center',
    'font-size:10px', 'line-height:16px', 'text-align:center',
    'box-shadow:0 0 6px currentColor',
  ].join(';');
  el.textContent = DROP_LABELS[type];
  gameFrame.appendChild(el);
  state.dropItems.push({ type, x, y, el });
}

function updateDropItems() {
  state.dropItems = state.dropItems.filter(d => {
    d.y += DROP_FALL_V;
    if (d.y > FRAME_H) { d.el.remove(); return false; }

    // Collect on overlap with player
    if (rectsOverlap(
    d.x,
    d.y,
    16,
    16,
    state.player.x,
    state.player.y,
    PLAYER_SIZE,
    PLAYER_SIZE
)) {
      collectDrop(d);
      d.el.remove();
      return false;
    }

    d.el.style.left = d.x + 'px';
    d.el.style.top  = d.y + 'px';
    return true;
  });
}

function collectDrop(d) {
  if (d.type === 'barrier') {
    state.player.barriers = Math.min(state.player.barriers + 1, 9);
    showFloatingText('🛡 Barrier +1', d.x, d.y, '#44ffdd');
    sfx('drop');
  } else if (d.type === 'speedUp') {
    state.activeEffects.speedUp = 3000;   // 3 seconds
    showFloatingText('⚡ Speed Up! 8s', d.x, d.y, '#ffee44');
    sfx('drop');
  } else if (d.type === 'sizeUp') {
    state.activeEffects.sizeUp = 6000;    // 6 seconds
    showFloatingText('⬆ Shot Up! 6s', d.x, d.y, '#ff88ff');
    sfx('drop');
  } else if (d.type === 'goldenHeart') {
    if (state.player.goldenHearts < GOLDEN_HEARTS_MAX) {
      state.player.goldenHearts++;
      showFloatingText('💛 Golden Heart +1', d.x, d.y, '#ffdd55');
    } else {
      showFloatingText('💛 Golden Hearts Full', d.x, d.y, '#ffdd55');
    }
    sfx('goldenHeart');
  }
  updateHUD();
}

// Random drop from sky — called on an interval in the game loop
let _dropTimer = 0;
const DROP_SKY_INTERVAL = 8000;   // ms between sky drops

function tickSkyDrops(dt) {
  _dropTimer += dt;
  if (_dropTimer >= DROP_SKY_INTERVAL) {
    _dropTimer = 0;
    // goldenHeart is intentionally rarer than the other three
    const types = ['barrier', 'speedUp', 'sizeUp', 'barrier', 'speedUp', 'sizeUp', 'goldenHeart'];
    const type  = types[Math.floor(Math.random() * types.length)];
    const x     = 60 + Math.random() * (FRAME_W - 200);  // left half-ish
    spawnDrop(type, x, -16);
  }
}

// ─── BULLET FACTORY ───────────────────────────────────────────────────────────
function createBulletEl(opts = {}) {

  const {
    color = '#fff',
    size = BULLET_SIZE,
    texture = null,
    rotation = 0,
    renderScale = 1,
  } = opts;

  const el = document.createElement('span');
  el.className = 'bullet';

let texPath = null;

if (texture === 'marisa_orb') {
  texPath = MARISA_ORBS[
    Math.floor(Math.random() * MARISA_ORBS.length)
  ];
} else {
  texPath =
    PLAYER_BULLET_TEXTURES[texture] ||
    ENEMY_BULLET_TEXTURES[texture];
}

  if (texPath) {

    el.style.cssText = [
      'position:absolute',
      `width:${size * renderScale}px`,
      `height:${size * renderScale}px`,
      `background:url('${texPath}') center/contain no-repeat`,
      `transform:rotate(${rotation}deg)`,
    ].join(';');

  } else {

    el.style.cssText = [
      'position:absolute',
      'border-radius:50%',
      `width:${size}px`,
      `height:${size}px`,
      `background:${color}`,
    ].join(';');
  }

  gameFrame.appendChild(el);
  return el;
}

function createLaserEl(opts = {}) {
    const {
        texture,
        width = 1000,
        height = 7
    } = opts;
    
    console.log(texture);
    console.log(LASER_TEXTURES[texture]);

    const el = document.createElement("span");
    el.className = "laser";

    el.style.position = "absolute";
    el.style.width = width + "px";
    el.style.height = height + "px";

    el.style.background =
        `url('${LASER_TEXTURES[texture]}') left center / 100% 100% no-repeat`;

    gameFrame.appendChild(el);
    return el;
}
    
function makePlayerBullet(x, y, vx, vy, opts = {}) {

  opts = effectiveBulletOpts(opts);

  const speedMult = opts._speedMult || 1;

  vx *= speedMult;
  vy *= speedMult;

  const b = {
    x,
    y,
    vx,
    vy,
    size:     opts.size || BULLET_SIZE,
    trailKey: opts.trail || null,
    damage: opts.damage || 1,
    trail:    null,
    el:       createBulletEl(opts),
  };

  if (b.trailKey) initTrail(b);

  return b;
}

function makeLaser(x, y, opts = {}) {

  const {
    texture = null,
    width = 1000,
    height = 8,
    damage = 1,
    rotation = 0,
    renderScale = 1,
    color = '#fff',
  } = opts;

  const laser = {
    x,
    y,
    width,
    height,
    damage,
    rotation,
    laser: true,
    el: createLaserEl({
    texture,
    width,
    height,
    })
  };
laser.offsetX = 0;
laser.offsetY = -7;
laser.el.style.backgroundSize = "100% 100%";
laser.el.style.zIndex = "9999";
  return laser;
}

function makeEnemyBullet(enemy, vx, vy) {
  const bSize  = vari(enemy, 'bulletSize', BULLET_SIZE);
  const bColor = vari(enemy, 'bulletColor', '#f88');
  const bTexture = vari(enemy, 'bulletTexture', null);
  return {
    x: enemy.x, y: enemy.y + ENEMY_SIZE / 2 - bSize / 2,
    vx, vy, size: bSize, trail: null,
    el: createBulletEl({
  color: bColor,
  size: bSize,
  texture: bTexture,
}),
  };
}

// ─── PLAYER SHOOT DISPATCH ────────────────────────────────────────────────────
function effectiveBulletOpts(opts) {
  const eff = state.activeEffects;
  const out = { ...opts };
  if (eff.speedUp > 0) { out._speedMult = 1.5; }
  if (eff.sizeUp > 0) {

  out.size =
    Math.round((opts.size || BULLET_SIZE) * 1.6);

  out.damage =
    (opts.damage || 1) * 2.2;
}
  return out;
}
function spawnPlayerBullet() {
  const char = CHARACTERS[state.player.characterId];
  if (char) char.shoot(state.player);
  sfx('shoot');
}

// ─── ENEMY PATTERNS ───────────────────────────────────────────────────────────
const patterns = {
  spread(enemy) {
    [-20, 0, 20].forEach(deg => {
      const r = deg * Math.PI / 180;
      state.enemyBullets.push(makeEnemyBullet(enemy,
        Math.cos(Math.PI + r) * ENEMY_BULLET_SPEED,
        Math.sin(Math.PI + r) * ENEMY_BULLET_SPEED));
    });
  },
  straight(enemy) {
    state.enemyBullets.push(makeEnemyBullet(enemy, -ENEMY_BULLET_SPEED * 1.5, 0));
  },
  wave(enemy) {
    [0, 1, 2].forEach(i => {
      const b = makeEnemyBullet(enemy, -ENEMY_BULLET_SPEED, 0);
      b.wave = true; b.waveAmp = 2.5; b.waveFreq = 0.08;
      b.wavePhase = i * (Math.PI * 2 / 3); b.age = 0;
      state.enemyBullets.push(b);
    });
  },
  burst(enemy) {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const b = makeEnemyBullet(enemy,
        Math.cos(angle) * ENEMY_BULLET_SPEED,
        Math.sin(angle) * ENEMY_BULLET_SPEED);
      const bSize = vari(enemy, 'bulletSize', BULLET_SIZE);
      b.x = enemy.x + ENEMY_SIZE / 2 - bSize / 2;
      b.y = enemy.y + ENEMY_SIZE / 2 - bSize / 2;
      state.enemyBullets.push(b);
    }
  },
  autoTrack(enemy) {
    const cx = enemy.x + ENEMY_SIZE / 2, cy = enemy.y + ENEMY_SIZE / 2;
    const angle = Math.atan2(
      (state.player.y + PLAYER_SIZE / 2) - cy,
      (state.player.x + PLAYER_SIZE / 2) - cx);
    const b = makeEnemyBullet(enemy,
      Math.cos(angle) * ENEMY_BULLET_SPEED,
      Math.sin(angle) * ENEMY_BULLET_SPEED);
    b.x = cx - b.size / 2; b.y = cy - b.size / 2;
    b.track = true; b.turnSpeed = 0.04; b.trackTime = 0; b.maxTrackTime = 60;
    state.enemyBullets.push(b);
  },
  // ── Ring: evenly spaced circle of N bullets ───────────────
  ring(enemy, count = 12) {
    const eSize = vari(enemy, 'size', ENEMY_SIZE);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const b = makeEnemyBullet(enemy, Math.cos(angle) * ENEMY_BULLET_SPEED, Math.sin(angle) * ENEMY_BULLET_SPEED);
      b.x = enemy.x + eSize / 2 - b.size / 2;
      b.y = enemy.y + eSize / 2 - b.size / 2;
      state.enemyBullets.push(b);
    }
  },

  // ── Zigzag: alternating up/down angled shots ──────────────
  zigzag(enemy) {
    enemy._zigPhase = ((enemy._zigPhase || 0) + 1) % 2;
    const sign = enemy._zigPhase === 0 ? -1 : 1;
    [-1, 0, 1].forEach(lane => {
      const ang = Math.PI + (lane + sign * 0.4) * 0.25;
      state.enemyBullets.push(makeEnemyBullet(enemy, Math.cos(ang) * ENEMY_BULLET_SPEED * 1.2, Math.sin(ang) * ENEMY_BULLET_SPEED * 1.2));
    });
  },

  // ── Spiral: rotating single bullet over time ──────────────
  spiral(enemy) {
    enemy._spiralAngle = ((enemy._spiralAngle || Math.PI) + 0.45) % (Math.PI * 2);
    const a = enemy._spiralAngle;
    const eSize = vari(enemy, 'size', ENEMY_SIZE);
    const b = makeEnemyBullet(enemy, Math.cos(a) * ENEMY_BULLET_SPEED * 1.3, Math.sin(a) * ENEMY_BULLET_SPEED * 1.3);
    b.x = enemy.x + eSize / 2 - b.size / 2;
    b.y = enemy.y + eSize / 2 - b.size / 2;
    state.enemyBullets.push(b);
  },

  // ── Kasa Obake: Three Spiral sequences attack ──────────
kasaVolley(enemy) {

  if (enemy._volleyCooldown)
    return;

  enemy._volleyShot =
    (enemy._volleyShot || 0);

  patterns.ring(enemy, 8);

  enemy._volleyShot++;

  if (enemy._volleyShot >= 3) {

    enemy._volleyShot = 0;

    enemy._volleyCooldown = true;

    setTimeout(() => {
      enemy._volleyCooldown = false;
    }, 1800);

  } else {

    setTimeout(() => {

      if (enemy.alive)
        patterns.kasaVolley(enemy);

    }, 220);
  }
},

  // ── Boss Phase 1: alternates ring + aimed triple ──────────
  bossPhase1(enemy) {
    enemy._bossToggle = !enemy._bossToggle;
    if (enemy._bossToggle) {
      patterns.ring(enemy, 16);
    } else {
      // Triple aimed at player
      const cx = enemy.x + vari(enemy,'size',ENEMY_SIZE)/2, cy = enemy.y + vari(enemy,'size',ENEMY_SIZE)/2;
      [-0.2, 0, 0.2].forEach(offset => {
        const a = Math.atan2((state.player.y + PLAYER_SIZE/2) - cy, (state.player.x + PLAYER_SIZE/2) - cx) + offset;
        const b = makeEnemyBullet(enemy, Math.cos(a) * ENEMY_BULLET_SPEED * 1.5, Math.sin(a) * ENEMY_BULLET_SPEED * 1.5);
        b.x = cx - b.size/2; b.y = cy - b.size/2;
        state.enemyBullets.push(b);
      });
    }
    // Phase 2 transition at 50% HP
    if (enemy.hp <= enemy.maxHp * 0.5 && !enemy._phase2) {
      enemy._phase2 = true;
      enemy.patternInterval = 500;
      enemy.pattern = 'bossPhase2';
      showFloatingText('⚠ Phase 2!', enemy.x, enemy.y - 20, '#ff4466');
    }
  },

  // ── Boss Phase 2: spiral + ring combo ────────────────────
  bossPhase2(enemy) {
    patterns.spiral(enemy);
    enemy._p2ring = ((enemy._p2ring || 0) + 1) % 3;
    if (enemy._p2ring === 0) patterns.ring(enemy, 10);
  },
};

// ─── STEERING ─────────────────────────────────────────────────────────────────
function steerBullet(b) {
  const desired = Math.atan2(
    (state.player.y + PLAYER_SIZE / 2) - b.y,
    (state.player.x + PLAYER_SIZE / 2) - b.x);
  const current = Math.atan2(b.vy, b.vx);
  let diff = desired - current;
  while (diff >  Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  const newAngle = current + Math.sign(diff) * Math.min(Math.abs(diff), b.turnSpeed);
  const spd = Math.hypot(b.vx, b.vy);
  b.vx = Math.cos(newAngle) * spd;
  b.vy = Math.sin(newAngle) * spd;
}

// ─── COLLISION ────────────────────────────────────────────────────────────────
function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
    return (
        ax < bx + bw &&
        ax + aw > bx &&
        ay < by + bh &&
        ay + ah > by
    );
}

// ─── FEEDBACK ─────────────────────────────────────────────────────────────────
function flashHit(el) {

  el.style.filter = 'brightness(2.5)';

  setTimeout(() => {
    el.style.filter = 'none';
  }, 80);
}

function showFloatingText(text, x, y, color = '#fff') {
  const el = document.createElement('div');
  el.textContent = text;
  el.style.cssText = [
    'position:absolute',
    `left:${Math.min(x, FRAME_W - 120)}px`,
    `top:${y}px`,
    `color:${color}`,
    'font:bold 12px monospace',
    'pointer-events:none',
    'z-index:50',
    'white-space:nowrap',
    'transition:top 0.65s ease, opacity 0.65s ease',
  ].join(';');
  gameFrame.appendChild(el);
  requestAnimationFrame(() => { el.style.top = (y - 44) + 'px'; el.style.opacity = '0'; });
  setTimeout(() => el.remove(), 700);
}

// ─── DEATH REWARDS ────────────────────────────────────────────────────────────
function applyDeathRewards(enemy) {
  const data = ENEMY_VARIANTS[enemy.id];
  if (!data) return;
  sfx('death');

  // Bullet upgrade (existing Reimu logic)
  if (Math.random() < (data.upgradeChance || 0)) {
    if (state.player.characterId === 'Reimu' && !CHARACTERS.Reimu.upgraded) {
      CHARACTERS.Reimu.upgraded = true;
      showFloatingText('⬆ Yin-Yang Unlocked!', enemy.x, enemy.y, '#ffcc44');
    }
  }

  // Random drop spawn at enemy position
  const dropRoll = Math.random();
  const eSize    = vari(enemy, 'size', ENEMY_SIZE);
  const ex       = enemy.x + eSize / 2 - 8;
  const ey       = enemy.y;
  if (dropRoll < 0.12)       spawnDrop('barrier',     ex, ey);
  else if (dropRoll < 0.22)  spawnDrop('speedUp',     ex, ey);
  else if (dropRoll < 0.30)  spawnDrop('sizeUp',      ex, ey);
  else if (dropRoll < 0.34)  spawnDrop('goldenHeart', ex, ey);

  updateHUD();
}

// ─── HP BAR ───────────────────────────────────────────────────────────────────
function createHPBar(enemy) {

  const wrap = document.createElement('div');

  wrap.style.cssText =
    'position:absolute;pointer-events:none;';

  const width =
    vari(enemy, 'size', ENEMY_SIZE) * 1.3;

  const bg = document.createElement('div');

  bg.style.cssText = `
    width:${width}px;
    height:4px;
    background:#555;
  `;

  const fill = document.createElement('div');

  fill.style.cssText = `
    height:100%;
    background:#f44;
    transform-origin:left;
    transition:width 0.1s;
  `;

  bg.appendChild(fill);
  wrap.appendChild(bg);

  gameFrame.appendChild(wrap);

  return { wrap, fill };
}

function updateEnemyHPBar(enemy) {
  if (!enemy.hpBar) return;
  const pct = Math.max(0, enemy.hp / enemy.maxHp);
  enemy.hpBar.fill.style.width = (pct * 100) + '%';
  enemy.hpBar.wrap.style.left  = enemy.x + 'px';
  enemy.hpBar.wrap.style.top   = (enemy.y - 8) + 'px';
  updateBossBar();
}

function updateBossBar() {
  const boss = state.enemies.find(e => e.alive && (e.id === 'Yuyuko' || e.id.startsWith('Youkai')));
  if (!boss) {
    if (bossBarEl) bossBarEl.style.display = 'none';
    bgm('game');
    return;
  }
  bgm('boss');
  if (bossBarEl) bossBarEl.style.display = '';
  const pct = Math.max(0, boss.hp / boss.maxHp) * 100;
  if (bossBarFill)  bossBarFill.style.width  = pct + '%';
  const displayName =
  vari(boss, 'name', boss.id);

bossBarName.textContent =
  boss.id === 'Yuyuko'
    ? '🌸 Yuyuko Saigyouji'
    : `⚡ ${displayName}`;
  if (bossBarPhase) bossBarPhase.textContent  = boss._phase2 ? '— Phase 2 —' : '';
}

// ─── HUD ──────────────────────────────────────────────────────────────────────
function updateHUD() {
  const p    = state.player;
  const eff  = state.activeEffects;
  const char = CHARACTERS[p.characterId];
  let tierLabel = '';
  if (p.characterId === 'Reimu') {
    tierLabel = char.upgraded ? ' [Yin-Yang]' : ' [Base]';
  }

  const barrierStr = '🛡'.repeat(p.barriers) || '—';
  const goldenStr  = p.goldenHearts > 0 ? `  ${'💛'.repeat(p.goldenHearts)}` : '';
  const effStr = [
    eff.speedUp > 0 ? `⚡${(eff.speedUp/1000).toFixed(1)}s` : '',
    eff.sizeUp  > 0 ? `⬆${(eff.sizeUp /1000).toFixed(1)}s` : '',
  ].filter(Boolean).join(' ');

  heartsEl.textContent = `[${p.characterId}]${tierLabel}  HP: `
    + '♥'.repeat(Math.max(0, p.hp))
    + '♡'.repeat(Math.max(0, p.maxHp - p.hp))
    + goldenStr
    + `  ${barrierStr}`
    + (effStr ? `  ${effStr}` : '');

  enemyHPEl.textContent = 'Wave ' + (state.currentWave + 1) + '/' + WAVES.length;

  const bombBtn = document.getElementById('btn-bomb');
  if (bombBtn) {
    bombBtn.textContent = '💣' + p.bombs;
    bombBtn.disabled = p.bombs <= 0;
  }
}

// ─── ENEMY MOVEMENT ───────────────────────────────────────────────────────────
function moveEnemy(enemy) {
  if (vari(enemy, 'followPlayer', false)) {

  const index =
    state.enemies
      .filter(e => e.alive && vari(e, 'followPlayer', false))
      .indexOf(enemy);

  const spacing = 60;

  enemy.anchorY =
    state.player.y
    + (index - 1) * spacing;
}

state.enemies.forEach(other => {

  if (
    other === enemy ||
    !other.alive
  ) return;

  const dx = enemy.x - other.x;
  const dy = enemy.y - other.y;

  const dist =
    Math.hypot(dx, dy);

  if (dist < 70) {

    enemy.anchorY +=
      dy * 0.08;

  }
});

  enemy.anchorY =
  Math.max(
    20,
    Math.min(FRAME_H - ENEMY_SIZE - 20, enemy.anchorY)
  );
  enemy.x += (enemy.anchorX - enemy.x) * 0.03;
  enemy.y += (enemy.anchorY - enemy.y) * 0.03;
  enemy.x = Math.max(FRAME_W / 2, Math.min(FRAME_W - ENEMY_SIZE, enemy.x));
  enemy.y = Math.max(0,           Math.min(FRAME_H - ENEMY_SIZE, enemy.y));
}

// ─── SPAWN WAVE ───────────────────────────────────────────────────────────────
function spawnWave(waveIndex) {
  state.enemies.forEach(e => { e.el.remove(); if (e.hpBar) e.hpBar.wrap.remove(); });
  state.enemies = [];
  WAVES[waveIndex].forEach(template => {
    const color = vari(template, 'color', '#f44');
    const tex = ENEMY_TEXTURES[template.id];

    const el = document.createElement('div');
el.className = 'enemy';
el.style.transform = 'translate(-6px,-6px)';

const hitboxSize = vari(template, 'size', ENEMY_SIZE);
const renderSize = Math.floor(hitboxSize * 1.35);

el.style.cssText = [
  'position:absolute',
  `width:${renderSize}px`,
  `height:${renderSize}px`,
  tex
    ? `
      background:url('${tex}.png') center/contain no-repeat;
      background-color:transparent;
      box-shadow:none;
      border:none;
    `
    : `
      background:${color};
      border-radius:6px;
      box-shadow:0 0 8px ${color};
    `,
  'image-rendering:pixelated',
].join(';');
    gameFrame.appendChild(el);
    state.enemies.push({ ...template, hp: template.hp, lastShot: 0, alive: true, el, hpBar: createHPBar(template) });
  });
  updateBossBar();
  updateHUD();
  saveProgress();
}

// ─── WAVE CLEAR ───────────────────────────────────────────────────────────────
function checkWaveClear() {
  if (state.enemies.every(e => !e.alive)) {
    const next = state.currentWave + 1;
    if (next >= WAVES.length) { endGame(true); }
    else {
      state.currentWave = next;
      setTimeout(() => { if (state.running) spawnWave(state.currentWave); }, 1200);
    }
  }
}

// ─── END GAME ─────────────────────────────────────────────────────────────────
// Consumes one Golden Heart to bring the player back at full HP instead of
// ending the run. Called from the player-hit collision check in gameLoop.
function reviveWithGoldenHeart() {
  state.player.goldenHearts--;
  state.player.hp = state.player.maxHp;
  showFloatingText('💛 Reborn!', state.player.x, state.player.y - 24, '#ffdd55');
  sfx('revive');
  updateHUD();
}

function endGame(won) {
  state.running = false;
  clearSaveData();
  if (cloudSpawner) { clearInterval(cloudSpawner); cloudSpawner = null; }
  [...state.playerBullets, ...state.enemyBullets].forEach(b => { removeTrail(b); b.el?.remove(); });
  state.playerBullets.length = 0;
  state.enemyBullets.length  = 0;
  if (state.player._reisenLaser) {

  state.player._reisenLaser.el.remove();

  state.player._reisenLaser = null;
}
  const msg = document.createElement('div');
  msg.id = 'endmsg';
  msg.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);'
    + 'background:rgba(0,0,0,0.85);color:#fff;padding:20px 32px;font-size:1.4rem;'
    + 'border-radius:8px;text-align:center;z-index:100;';
  msg.innerHTML = (won ? '🏆 You Win!' : '💀 Game Over')
    + '<br><button id="restartBtn" style="margin-top:12px;margin-right:8px;padding:8px 20px;cursor:pointer;">Play Again</button>'
    + '<button id="mainMenuBtn" style="margin-top:12px;padding:8px 20px;cursor:pointer;">Main Menu</button>';
  gameFrame.appendChild(msg);
  document.getElementById('restartBtn').addEventListener('click', () => initGame());
  document.getElementById('mainMenuBtn').addEventListener('click', () => {
    if (typeof returnToLobbyFromGameOver === 'function') returnToLobbyFromGameOver();
  });
}

// ─── MAIN LOOP ────────────────────────────────────────────────────────────────
function gameLoop(timestamp) {
  if (!state.running || state.paused) return;
  state.lastTime = timestamp;
// Tick powerup timers
  const dt = timestamp - (state._prevTimestamp || timestamp);
  state._prevTimestamp = timestamp;
  if (state.activeEffects.speedUp > 0) {
    state.activeEffects.speedUp = Math.max(0, state.activeEffects.speedUp - dt);
    updateHUD();
  }
  if (state.activeEffects.sizeUp > 0) {
    state.activeEffects.sizeUp = Math.max(0, state.activeEffects.sizeUp - dt);
    updateHUD();
  }
  tickSkyDrops(dt);
  updateDropItems();

  const p = state.player;
  p.x += (p.targetX - p.x) * 0.75;
  p.y += (p.targetY - p.y) * 0.75;
  charEl.style.left = p.x + 'px';
  charEl.style.top  = p.y + 'px';

// Rapid fire effect
if (state.activeEffects.speedUp > 0) {
  p.shootInterval = 185;
} else {
  p.shootInterval = p.baseShootInterval;
}

  if (state.enemies.some(e => e.alive) && timestamp - p.lastShot > p.shootInterval) {
    p.lastShot = timestamp;
    spawnPlayerBullet();
  }

  state.enemies.forEach(enemy => {
    if (!enemy.alive) return;
    if (timestamp - enemy.lastShot > enemy.patternInterval) {
      enemy.lastShot = timestamp;
      patterns[enemy.pattern](enemy);
    }
    moveEnemy(enemy);
    enemy.el.style.left = enemy.x + 'px';
    enemy.el.style.top  = enemy.y + 'px';
    updateEnemyHPBar(enemy);
  });

  // ── Player bullets ──
  state.playerBullets = state.playerBullets.filter(b => {
  

    b.el.style.left = b.x + "px";
    b.el.style.top = b.y + "px";

    b.x,
    b.y,
    b.width,
    b.height
  
    if (b.track) {

  const target =
    state.enemies.find(e => e.alive);

  if (target) {

    const desired =
      Math.atan2(
        (target.y + ENEMY_SIZE / 2) - b.y,
        (target.x + ENEMY_SIZE / 2) - b.x
      );

    const current =
      Math.atan2(b.vy, b.vx);

    let diff = desired - current;

    while (diff > Math.PI)
      diff -= Math.PI * 2;

    while (diff < -Math.PI)
      diff += Math.PI * 2;

    const newAngle =
      current +
      Math.sign(diff)
      * Math.min(Math.abs(diff), b.turnSpeed);

    const spd =
      Math.hypot(b.vx, b.vy);

    b.vx = Math.cos(newAngle) * spd;
    b.vy = Math.sin(newAngle) * spd;
  }
}
    
  if (b.slash) {

  b.life--;

  if (b.life <= 0) {

if (!b.laser) {
    removeTrail(b);
    b.el.remove();
    return false;
}
  }
}
    
if (b.laser) {
    b.x = p.x + PLAYER_SIZE + b.offsetX;
    b.y = p.y + PLAYER_SIZE / 2 - b.height / 2 + b.offsetY;
}
    const bw = b.laser ? b.width : (b.size || BULLET_SIZE);
const bh = b.laser ? b.height : (b.size || BULLET_SIZE);

if (
    b.x > FRAME_W ||
    b.y < -bh ||
    b.y > FRAME_H + bh
) {
    removeTrail(b);
    b.el.remove();
    return false;
}

for (const enemy of state.enemies) {
    if (!enemy.alive) continue;

    const eSize = vari(enemy, 'size', ENEMY_SIZE);

    if (rectsOverlap(
    b.x,
    b.y,
    bw,
    bh,
    enemy.x,
    enemy.y,
    eSize,
    eSize
)) {

    
    const damage = b.damage || 1;
    enemy.hp -= damage;
    flashHit(enemy.el);
    sfx("hit");

    if (enemy.hp <= 0) {
        enemy.alive = false;
        enemy.el.remove();
        if (enemy.hpBar) enemy.hpBar.wrap.remove();
        applyDeathRewards(enemy);
        checkWaveClear();
    }

    updateHUD();

    if (!b.laser) {
        removeTrail(b);
        b.el.remove();
        return false;
    }

    return true; // Laser survives and keeps existing
}
}
  
  updateTrail(b);
b.el.style.left = b.x + "px";
b.el.style.top = b.y + "px";
return true;
});

  // ── Enemy bullets ──
  state.enemyBullets = state.enemyBullets.filter(b => {
    if (b.wave) { b.age++; b.vy = Math.sin(b.age * b.waveFreq + b.wavePhase) * b.waveAmp; }
    if (b.track) {
      b.trackTime++;
      if (b.trackTime < b.maxTrackTime) steerBullet(b);
      else b.track = false;
    }
    b.x += b.vx; b.y += b.vy;
    const bSize = b.size || BULLET_SIZE;
    if (b.x < -bSize || b.x > FRAME_W || b.y < -bSize || b.y > FRAME_H) {
      b.el.remove(); return false;
    }
    if (rectsOverlap(
  b.x,
  b.y,
  bSize,
  bSize,
  p.x,
  p.y,
  PLAYER_SIZE,
  PLAYER_SIZE
)) {
  if (state.player.barriers > 0) {
    state.player.barriers--;
    b.el.remove();
    showFloatingText('🛡 Barrier!', p.x, p.y - 20, '#44ffdd');
    sfx('barrier');
    updateHUD();
  } else {
    p.hp--;
    b.el.remove();
    updateHUD();
    if (p.hp <= 0) {
      if (state.player.goldenHearts > 0) reviveWithGoldenHeart();
      else endGame(false);
    }
  }
  return false;
}
    b.el.style.left = b.x + 'px';
    b.el.style.top  = b.y + 'px';
    return true;
  });

  requestAnimationFrame(gameLoop);
}

let cloudSpawner = null;

function startCloudSpawner() {
  if (cloudSpawner) clearInterval(cloudSpawner);
  cloudSpawner = setInterval(() => {

    const textures = [
      'assets/background/cloud1.png',
      './assets/background/cloud2.png',
      './assets/background/cloud3.png',
      './assets/background/cloud4.png',
      './assets/background/cloud5.png',
      './assets/background/cloud6.png',
      './assets/background/cloud7.png',
      './assets/background/cloud8.png',
      './assets/background/cloud9.png',
      './assets/background/cloud10.png',
      './assets/background/cloud11.png',
      './assets/background/cloud12.png',
    ];

    const tex =
      textures[
        Math.floor(Math.random() * textures.length)
      ];

    spawnCloud(
      520,
      Math.random() * 220,
      260 + Math.random() * 120,
      50 + Math.random() * 40,
      tex
    );

  }, 4000);
}

// ─── SAVE SYSTEM (backs the Story mode "Continue" option) ─────────────────────
const SAVE_KEY = 'dg_save_progress';

function saveProgress() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      wave: state.currentWave,
      characterId: state.player.characterId,
      reimuUpgraded: CHARACTERS.Reimu.upgraded,
      goldenHearts: state.player.goldenHearts,
      timestamp: Date.now(),
    }));
  } catch (e) { /* localStorage unavailable — ignore */ }
}

function getSaveData() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function clearSaveData() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
}

// ─── PAUSE / RESUME / STOP (used by menu.js) ──────────────────────────────────
function pauseGame() {
  if (!state.running || state.paused) return;
  state.paused = true;
  if (cloudSpawner) { clearInterval(cloudSpawner); cloudSpawner = null; }
}

function resumeGame() {
  if (!state.running || !state.paused) return;
  state.paused = false;
  state._prevTimestamp = performance.now();
  startCloudSpawner();
  requestAnimationFrame(gameLoop);
}

// Fully tears down the current run and hides the player sprite — used when the
// player exits to the lobby mid-run rather than winning/losing naturally.
function stopGame() {
  state.running = false;
  state.paused  = false;
  if (cloudSpawner) { clearInterval(cloudSpawner); cloudSpawner = null; }

  [...state.playerBullets, ...state.enemyBullets].forEach(b => { removeTrail(b); b.el?.remove(); });
  state.playerBullets.length = 0;
  state.enemyBullets.length  = 0;

  state.dropItems.forEach(d => d.el?.remove());
  state.dropItems.length = 0;

  state.enemies.forEach(e => { e.el?.remove(); if (e.hpBar) e.hpBar.wrap.remove(); });
  state.enemies.length = 0;

  if (state.player._reisenLaser) {
    state.player._reisenLaser.el.remove();
    state.player._reisenLaser = null;
  }

  document.querySelectorAll('.cloud').forEach(c => c.remove());

  const oldMsg = document.getElementById('endmsg');
  if (oldMsg) oldMsg.remove();

  if (bossBarEl) bossBarEl.style.display = 'none';
  charEl.style.display = 'none';
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
// startWave: optional wave index to begin on (used by the Continue flow in
// menu.js). Defaults to wave 1 (index 0) for New Game / Play Again.
function initGame(startWave) {
  const old = document.getElementById('endmsg');
  if (old) old.remove();
  if (bossBarEl) bossBarEl.style.display = 'none';
  charEl.style.display = 'block';
  state.paused = false;
  if (state.player._reisenLaser) {

  state.player._reisenLaser.el.remove();

  state.player._reisenLaser = null;
}

  [...state.playerBullets, ...state.enemyBullets].forEach(b => { removeTrail(b); b.el?.remove(); });
  state.playerBullets.length = 0;
  state.enemyBullets.length  = 0;

  state.dropItems.forEach(d => d.el?.remove());
  state.dropItems.length = 0;
  state.player.barriers = 3;
  state.player.goldenHearts = 0;
  state.player.bombs = BOMB_START_COUNT;
  state.activeEffects.speedUp = 0;
  state.activeEffects.sizeUp  = 0;
  _dropTimer = 0;
  state._prevTimestamp = 0;

  // Reset Reimu upgrade state
  CHARACTERS.Reimu.upgraded = false;
  for (const k in killCounts) delete killCounts[k];

  state.player.x        = 60;
  state.player.y        = 180;
  state.player.targetX  = 60;
  state.player.targetY  = 180;
  state.player.hp       = state.player.maxHp;
  state.player.lastShot = 0;
  state.currentWave     = (typeof startWave === 'number') ? startWave : 0;
  lastMouseX = null; lastMouseY = null;

  spawnWave(state.currentWave);
  state.running  = true;
  state.lastTime = performance.now();
  requestAnimationFrame(gameLoop);

  startCloudSpawner();
}

applyCharacterTexture();
