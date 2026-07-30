// ═══════════════════════════════════════════════════════════════════════════════
// menu.js  —  Startup / Lobby / Mode / Character / Settings / Pause menu system
// Load AFTER layout.js and script.js in index.html.
//
// IMPORTANT: #menu-overlay lives OUTSIDE .Gameframe in the DOM and is a fixed,
// full-viewport layer with its own simple responsive CSS. It never touches
// LAYOUT/applyLayout() or .Gameframe's own positioning — the two systems are
// completely decoupled so menu state can never corrupt game rendering (and
// vice versa).
//
// This file talks directly to globals defined in the other two files (all three
// are classic, non-module scripts sharing one global scope):
//   from script.js  → state, CHARACTERS, CHARACTER_TEXTURES, charEl,
//                      initGame, stopGame, pauseGame, resumeGame,
//                      applyCharacterTexture, getSaveData, clearSaveData
// ═══════════════════════════════════════════════════════════════════════════════

const CHAR_LIST = ['Reimu', 'Marisa', 'Yukari', 'Youmu', 'Reisen'];

// Used as a placeholder background + initial letter whenever a character's
// artwork fails to load (e.g. the asset file doesn't exist yet).
const CHAR_FALLBACK_COLOR = {
  Reimu:  '#ff4444',
  Marisa: '#ffcc33',
  Yukari: '#bb66ff',
  Youmu:  '#88ffee',
  Reisen: '#ff88cc',
};

const CHAR_SAVE_KEY = 'dg_selected_character';
const SETTINGS_KEY  = 'dg_settings';

// ─── AUDIO MANAGER (placeholder — no audio files exist yet) ────────────────────
// Structured so real playback can be dropped in later (swap an <audio> src,
// read volumes from SETTINGS_KEY) without touching any of the call sites
// sprinkled through script.js/menu.js.
const AUDIO_DEBUG_LOG = false; // flip to true to see hook calls while wiring up real audio

const AudioManager = {
  bgmTrack: null, // 'menu' | 'game' | 'boss'

  playBGM(track) {
    if (this.bgmTrack === track) return;
    this.bgmTrack = track;
    if (AUDIO_DEBUG_LOG) console.log(`[audio] BGM -> ${track}`);
    // TODO: once files exist, swap an <audio> element's src to
    // ASSETS.bgm[track] and play it at (settings.bgm / 100) volume.
  },

  playSFX(name) {
    // e.g. 'shoot' | 'hit' | 'death' | 'drop' | 'goldenHeart' | 'barrier' |
    // 'bomb' | 'revive'
    if (AUDIO_DEBUG_LOG) console.log(`[audio] SFX -> ${name}`);
    // TODO: play ASSETS.sfx[name] once files exist, at (settings.sfx / 100) volume.
  },

  playVoice(characterId, context) {
    // context: 'start' (startup screen) | 'select' (Characters menu) | 'ingame' (run begins)
    if (AUDIO_DEBUG_LOG) console.log(`[audio] Voice -> ${characterId}/${context}`);
    // TODO: play ASSETS.voice[characterId][context] once files exist,
    // at (settings.voice / 100) volume.
  },
};

const ALL_SCREENS = ['startup', 'lobby', 'modes', 'story', 'endless', 'characters', 'settings'];

// ─── NAVIGATION STATE ──────────────────────────────────────────────────────────
let screenStack       = ['startup'];   // pre-game menu navigation history
let uiMode             = 'menu';        // 'menu' (browsing menus) | 'game' (playing)
let settingsOpenedFrom = 'lobby';       // 'lobby' | 'pause' — where Settings' Return goes
let pauseOpen          = false;

// ─── OVERLAY VISIBILITY ─────────────────────────────────────────────────────────
function setOverlayVisible(visible) {
  const overlay = document.getElementById('menu-overlay');
  if (overlay) overlay.classList.toggle('active', visible);
}

// ─── SCREEN NAVIGATION (pre-game flow) ──────────────────────────────────────────
function showScreenOnly(name) {
  ALL_SCREENS.forEach(s => {
    const el = document.getElementById('screen-' + s);
    if (el) el.classList.toggle('active', s === name);
  });
  setOverlayVisible(name !== null);
  updateShortcutVisibility();
  if (name === 'startup') AudioManager.playVoice(state.player.characterId, 'start');
}

function pushScreen(name) {
  screenStack.push(name);
  showScreenOnly(name);
}

function popScreen() {
  if (screenStack.length > 1) screenStack.pop();
  showScreenOnly(screenStack[screenStack.length - 1]);
}

function jumpToScreen(name) {
  screenStack = [name];
  showScreenOnly(name);
}

// ─── UI MODE (menu vs live gameplay) ────────────────────────────────────────────
// Purely a UI-visibility concept now — it no longer touches layout.js or
// .Gameframe's own scale/position in any way.
function setUIMode(mode) {
  uiMode = mode;
  document.body.classList.toggle('dg-menu-mode', mode === 'menu');
  updateShortcutVisibility();
  AudioManager.playBGM(mode === 'menu' ? 'menu' : 'game');
}

// The persistent bottom-right gear: visible on the Lobby (opens Settings) and
// during live gameplay (opens the Pause overlay). Hidden everywhere else.
// The bottom-left bomb button mirrors it: visible only during live,
// unpaused gameplay.
function updateShortcutVisibility() {
  const shortcut = document.getElementById('btn-settings-shortcut');
  const bombBtn  = document.getElementById('btn-bomb');
  const top = screenStack[screenStack.length - 1];
  const showOnLobby = uiMode === 'menu' && top === 'lobby';
  const showInGame  = uiMode === 'game' && !pauseOpen;
  if (shortcut) shortcut.style.display = (showOnLobby || showInGame) ? 'flex' : 'none';
  if (bombBtn)  bombBtn.style.display  = showInGame ? 'flex' : 'none';
}

// ─── CHARACTER PREVIEW HELPERS ──────────────────────────────────────────────────
function setCharPreview(wrapId, id) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  wrap.innerHTML = '';
  wrap.style.background = 'transparent';

  const tex = CHARACTER_TEXTURES[id];
  const img = document.createElement('img');
  img.alt = id;
  img.onerror = () => {
    wrap.innerHTML = '';
    wrap.style.background = CHAR_FALLBACK_COLOR[id] || '#444';
    wrap.textContent = id.charAt(0);
  };
  wrap.appendChild(img);
  if (tex) { img.src = tex; } else { img.onerror(); }
}

function buildCharacterThumbs() {
  const row = document.getElementById('charThumbRow');
  if (!row) return;
  row.innerHTML = '';

  CHAR_LIST.forEach(id => {
    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = 'char-thumb';
    thumb.dataset.charId = id;

    const imgWrap = document.createElement('div');
    imgWrap.className = 'char-thumb-imgwrap';
    const img = document.createElement('img');
    img.alt = id;
    img.onerror = () => {
      imgWrap.innerHTML = '';
      imgWrap.style.background = CHAR_FALLBACK_COLOR[id] || '#444';
      imgWrap.textContent = id.charAt(0);
    };
    const tex = CHARACTER_TEXTURES[id];
    imgWrap.appendChild(img);
    if (tex) { img.src = tex; } else { img.onerror(); }

    const label = document.createElement('span');
    label.className = 'char-thumb-label';
    label.textContent = id;

    thumb.appendChild(imgWrap);
    thumb.appendChild(label);
    thumb.addEventListener('click', () => selectCharacter(id));
    row.appendChild(thumb);
  });
}

function refreshCharacterScreen() {
  const id = state.player.characterId;
  setCharPreview('charSelectImgWrap', id);
  const nameEl = document.getElementById('charSelectName');
  if (nameEl) nameEl.textContent = id;
  document.querySelectorAll('.char-thumb').forEach(t => {
    t.classList.toggle('char-thumb--selected', t.dataset.charId === id);
  });
}

// Selecting a character immediately updates script.js's live game state so
// it's the character used the next time gameplay starts.
function selectCharacter(id) {
  state.player.characterId = id;
  applyCharacterTexture();
  try { localStorage.setItem(CHAR_SAVE_KEY, id); } catch (e) { /* ignore */ }
  refreshCharacterScreen();
  setCharPreview('startupPreviewWrap', id);
  AudioManager.playVoice(id, 'select');
}

// ─── SETTINGS (volume placeholders — no audio system exists yet) ───────────────
function loadSettingsUI() {
  let s = { sfx: 70, bgm: 70, voice: 70 };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) s = Object.assign(s, JSON.parse(raw));
  } catch (e) { /* ignore */ }

  const sfxEl   = document.getElementById('vol-sfx');
  const bgmEl   = document.getElementById('vol-bgm');
  const voiceEl = document.getElementById('vol-voice');
  if (sfxEl)   sfxEl.value   = s.sfx;
  if (bgmEl)   bgmEl.value   = s.bgm;
  if (voiceEl) voiceEl.value = s.voice;
}

function saveSettings() {
  const s = {
    sfx:   Number(document.getElementById('vol-sfx').value),
    bgm:   Number(document.getElementById('vol-bgm').value),
    voice: Number(document.getElementById('vol-voice').value),
  };
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch (e) { /* ignore */ }
  // NOTE: hook these values into the real audio system here once one exists.
}

// ─── STORY MODE FLOW ────────────────────────────────────────────────────────────
function updateContinueButtonState() {
  const btn = document.getElementById('btn-story-continue');
  if (!btn) return;
  const save = getSaveData();
  if (save) {
    btn.disabled = false;
    btn.classList.remove('menu-btn--disabled');
    btn.textContent = `CONTINUE (Wave ${save.wave + 1})`;
  } else {
    btn.disabled = true;
    btn.classList.add('menu-btn--disabled');
    btn.textContent = 'CONTINUE';
  }
}

function enterGameplay() {
  setUIMode('game');
  showScreenOnly(null); // hides every menu screen AND the overlay itself
  AudioManager.playVoice(state.player.characterId, 'ingame');
}

function startNewGame() {
  clearSaveData();
  initGame(0);
  enterGameplay();
}

function continueGameFromSave() {
  const save = getSaveData();
  if (!save) return;
  if (save.characterId && CHARACTER_TEXTURES[save.characterId]) {
    state.player.characterId = save.characterId;
    applyCharacterTexture();
  }
  initGame(save.wave || 0);
  if (save.reimuUpgraded) CHARACTERS.Reimu.upgraded = true;
  if (typeof save.goldenHearts === 'number') {
    state.player.goldenHearts = Math.max(0, Math.min(GOLDEN_HEARTS_MAX, save.goldenHearts));
  }
  enterGameplay();
}

// ─── PAUSE FLOW (in-game) ───────────────────────────────────────────────────────
function openPause() {
  if (uiMode !== 'game') return;
  pauseOpen = true;
  pauseGame();
  document.getElementById('screen-pause').classList.add('active');
  setOverlayVisible(true);
  updateShortcutVisibility();
}

function closePauseAndResume() {
  pauseOpen = false;
  document.getElementById('screen-pause').classList.remove('active');
  setOverlayVisible(false);
  resumeGame();
  updateShortcutVisibility();
}

function exitToLobbyFromPause() {
  pauseOpen = false;
  document.getElementById('screen-pause').classList.remove('active');
  document.getElementById('screen-settings').classList.remove('active');
  stopGame();
  setUIMode('menu');
  jumpToScreen('lobby');
}

// Called from script.js's endGame() when the player taps "Main Menu" after a
// win or loss.
function returnToLobbyFromGameOver() {
  const msg = document.getElementById('endmsg');
  if (msg) msg.remove();
  stopGame();
  setUIMode('menu');
  jumpToScreen('lobby');
}

// ─── WIRE UP ALL BUTTONS ────────────────────────────────────────────────────────
function wireNavButtons() {
  document.getElementById('btn-start').addEventListener('click', () => pushScreen('lobby'));
  document.getElementById('btn-lobby-return').addEventListener('click', () => popScreen());

  document.getElementById('btn-modes').addEventListener('click', () => pushScreen('modes'));
  document.getElementById('btn-modes-return').addEventListener('click', () => popScreen());

  document.getElementById('btn-mode-story').addEventListener('click', () => {
    updateContinueButtonState();
    pushScreen('story');
  });
  document.getElementById('btn-mode-endless').addEventListener('click', () => pushScreen('endless'));
  document.getElementById('btn-endless-return').addEventListener('click', () => popScreen());

  document.getElementById('btn-story-return').addEventListener('click', () => popScreen());
  document.getElementById('btn-story-new').addEventListener('click', startNewGame);
  document.getElementById('btn-story-continue').addEventListener('click', continueGameFromSave);

  document.getElementById('btn-characters').addEventListener('click', () => {
    refreshCharacterScreen();
    pushScreen('characters');
  });
  document.getElementById('btn-characters-return').addEventListener('click', () => popScreen());

  document.getElementById('btn-settings-lobby').addEventListener('click', () => {
    settingsOpenedFrom = 'lobby';
    pushScreen('settings');
  });
  document.getElementById('btn-settings-return').addEventListener('click', () => {
    document.getElementById('screen-settings').classList.remove('active');
    if (settingsOpenedFrom === 'pause') {
      document.getElementById('screen-pause').classList.add('active');
      // overlay stays visible throughout — still paused, still on top of the game
    } else {
      popScreen();
    }
  });

  document.getElementById('btn-settings-shortcut').addEventListener('click', () => {
    if (uiMode === 'game') {
      openPause();
    } else {
      settingsOpenedFrom = 'lobby';
      pushScreen('settings');
    }
  });

  document.getElementById('btn-pause-resume').addEventListener('click', closePauseAndResume);
  document.getElementById('btn-pause-settings').addEventListener('click', () => {
    settingsOpenedFrom = 'pause';
    document.getElementById('screen-pause').classList.remove('active');
    document.getElementById('screen-settings').classList.add('active');
  });
  document.getElementById('btn-pause-exit').addEventListener('click', exitToLobbyFromPause);

  // GitHub link is a placeholder for now — prevent the "#" href from jumping the page.
  const githubLink = document.getElementById('github-link');
  if (githubLink) githubLink.addEventListener('click', (e) => e.preventDefault());

  ['sfx', 'bgm', 'voice'].forEach(key => {
    const el = document.getElementById('vol-' + key);
    if (el) el.addEventListener('input', saveSettings);
  });
}

// ─── INIT ────────────────────────────────────────────────────────────────────────
function initMenu() {
  // Restore the previously selected character (defaults to Reimu — see script.js state).
  let savedChar = null;
  try { savedChar = localStorage.getItem(CHAR_SAVE_KEY); } catch (e) { /* ignore */ }
  if (savedChar && CHARACTER_TEXTURES[savedChar]) {
    state.player.characterId = savedChar;
  }
  applyCharacterTexture();

  buildCharacterThumbs();
  refreshCharacterScreen();
  setCharPreview('startupPreviewWrap', state.player.characterId);

  loadSettingsUI();
  wireNavButtons();
  updateContinueButtonState();

  setUIMode('menu');
  showScreenOnly('startup');
}

initMenu();
