// ═══════════════════════════════════════════════════════════════════════════════
// layout.js  —  Auto-scaling + trackpad mode
// Load BEFORE script.js in index.html
// ═══════════════════════════════════════════════════════════════════════════════

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
// TRACKPAD_INSIDE: true  → trackpad overlays the game frame (full-screen control)
//                 false → trackpad sits below the game frame
//
// On mobile (detected automatically), TRACKPAD_INSIDE is always forced to false
// so the trackpad always appears as a separate zone beneath the game.
const SETTINGS = {
  TRACKPAD_INSIDE: false,
};

// ─── BASE DESIGN DIMENSIONS ───────────────────────────────────────────────────
const BASE_FRAME_W    = 600;
const BASE_FRAME_H    = 400;
// In outside mode the trackpad height is this fraction of the frame height
const TRACKPAD_RATIO  = 0.5;   // → 200px at 1× scale
// Minimum gap between stacked elements (px, at 1× scale)
const STACK_GAP       = 8;
// Approximate HUD bar height (px, at 1× scale)
const HUD_H           = 22;

// ─── LAYOUT STATE ─────────────────────────────────────────────────────────────
const LAYOUT = {
  scale:  1,
  frameW: BASE_FRAME_W,
  frameH: BASE_FRAME_H,
  mobile: false,
  mode:   'outside',
};

// ─── DOM REFS ─────────────────────────────────────────────────────────────────
const _frame   = document.querySelector('.Gameframe');
const _pad     = document.querySelector('.mousetrackpad');
const _data    = document.querySelector('.data');

// ─── MOBILE DETECTION ─────────────────────────────────────────────────────────
// Uses both screen width AND touch capability so landscape tablets stay desktop.
function isMobile() {
  const narrow   = window.innerWidth < 768;
  const hasTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  return narrow && hasTouch;
}

// ─── RESOLVE EFFECTIVE MODE ───────────────────────────────────────────────────
function resolveMode() {
  // Mobile always forces outside (trackpad below frame)
  if (isMobile()) return 'outside';
  return SETTINGS.TRACKPAD_INSIDE ? 'inside' : 'outside';
}

// ─── COMPUTE SCALE ────────────────────────────────────────────────────────────
// Finds the largest scale factor where everything fits with zero leftover space.
function computeScale(mode) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (mode === 'inside') {
    // Only the game frame is visible — fill the full viewport
    return Math.min(vw / BASE_FRAME_W, vh / BASE_FRAME_H);
  }

  // Outside mode: frame + gap + trackpad + gap + hud stacked vertically
  const totalLogH = BASE_FRAME_H
    + STACK_GAP
    + BASE_FRAME_H * TRACKPAD_RATIO
    + STACK_GAP
    + HUD_H;

  // Scale limited by width OR by total stacked height
  const scaleByW = vw / BASE_FRAME_W;
  const scaleByH = vh / totalLogH;
  return Math.min(scaleByW, scaleByH);
}

// ─── APPLY LAYOUT ─────────────────────────────────────────────────────────────
function applyLayout() {
  const mobile = isMobile();
  const mode   = resolveMode();
  const scale  = computeScale(mode);

  LAYOUT.scale  = scale;
  LAYOUT.mobile = mobile;
  LAYOUT.mode   = mode;

  // Scaled dimensions
  const scaledFrameW = BASE_FRAME_W * scale;
  const scaledFrameH = BASE_FRAME_H * scale;
  const scaledPadH   = BASE_FRAME_H * TRACKPAD_RATIO * scale;
  const scaledGap    = STACK_GAP * scale;

  // Total visual height of the stack
  const totalH = scaledFrameH + scaledGap + scaledPadH + scaledGap + HUD_H * scale;

  // Horizontal offset to center within viewport
  const offsetX = Math.max(0, (window.innerWidth  - scaledFrameW) / 2);
  // Vertical offset to center the whole stack
  const offsetY = Math.max(0, (window.innerHeight - totalH) / 2);

  if (mode === 'inside') {
    // ── INSIDE: frame fills viewport, trackpad is invisible overlay ───────────

    _frame.style.cssText = [
      'position:fixed',
      `left:${offsetX}px`,
      `top:${offsetY}px`,
      `width:${BASE_FRAME_W}px`,
      `height:${BASE_FRAME_H}px`,
      `transform:scale(${scale})`,
      'transform-origin:top left',
      'margin:0',
    ].join(';');

    // Trackpad sits exactly over the frame, transparent
    _pad.style.cssText = [
      'position:fixed',
      `left:${offsetX}px`,
      `top:${offsetY}px`,
      `width:${scaledFrameW}px`,
      `height:${scaledFrameH}px`,
      'background:transparent',
      'border:none',
      'cursor:crosshair',
      'z-index:10',
      'touch-action:none',
    ].join(';');

    // HUD bar pinned to bottom of frame
    if (_data) {
      _data.style.cssText = [
        'position:fixed',
        `left:${offsetX}px`,
        `bottom:${Math.max(4, window.innerHeight - offsetY - scaledFrameH - HUD_H * scale)}px`,
        `width:${scaledFrameW}px`,
        `font-size:${Math.max(10, 14 * scale)}px`,
        'display:flex',
        'justify-content:space-between',
        'z-index:20',
      ].join(';');
    }
    const _bossbar = document.getElementById('bossbar');
    if (_bossbar) { _bossbar.style.width = scaledFrameW + 'px'; _bossbar.style.position = 'fixed'; _bossbar.style.left = offsetX + 'px'; _bossbar.style.top = (offsetY - 36) + 'px'; }

  } else {
    // ── OUTSIDE: frame on top, trackpad below, hud below that ────────────────

    // Reset any fixed positioning from a previous inside session
    _frame.style.cssText = [
      'position:relative',
      `width:${BASE_FRAME_W}px`,
      `height:${BASE_FRAME_H}px`,
      `transform:scale(${scale})`,
      'transform-origin:top center',
      // Compensate for scale shrink so elements don't leave a gap
      `margin-bottom:${scaledFrameH - BASE_FRAME_H}px`,
    ].join(';');

    _pad.style.cssText = [
      `width:${BASE_FRAME_W}px`,
      `height:${BASE_FRAME_H * TRACKPAD_RATIO}px`,
      `transform:scale(${scale})`,
      'transform-origin:top center',
      `margin-bottom:${scaledPadH - BASE_FRAME_H * TRACKPAD_RATIO}px`,
      'border:2px dashed #555',
      'background:#1a1a1a',
      'cursor:crosshair',
      'touch-action:none',
    ].join(';');

    if (_data) {
      _data.style.cssText = [
        `width:${scaledFrameW}px`,
        `font-size:${Math.max(10, 14 * scale)}px`,
        'display:flex',
        'justify-content:space-between',
        'position:static',
      ].join(';');
    }
    const _bossbar = document.getElementById('bossbar');
    if (_bossbar) _bossbar.style.width = scaledFrameW + 'px';

    // Center the whole body stack
    document.body.style.paddingTop = offsetY + 'px';
  }
}

// ─── TRACKPAD DELTA NORMALISATION ─────────────────────────────────────────────
// The trackpad element is CSS-scaled but mouse/touch coordinates come in real
// screen pixels. script.js adds delta movement so we must un-scale the delta
// so it matches the 1× logical coordinate space the game uses internally.
//
// We patch this by exposing LAYOUT.scale and script.js can divide by it.
// Alternatively, override the events here — but that would require changing
// script.js. Instead we expose a helper script.js can call:
function normaliseDelta(dx, dy) {
  return { dx: dx / LAYOUT.scale, dy: dy / LAYOUT.scale };
}
// script.js should wrap its delta with:
//   const { dx, dy } = normaliseDelta(rawDx, rawDy);
// If you'd rather not touch script.js, LAYOUT.scale is always readable.

// ─── INIT & RESIZE ────────────────────────────────────────────────────────────
function initLayout() {
  applyLayout();
}

window.addEventListener('resize', () => {
  applyLayout();
  // Invalidate cached mouse positions in script.js on resize
  if (typeof lastMouseX !== 'undefined') { lastMouseX = null; lastMouseY = null; }
  if (typeof lastTouchX !== 'undefined') { lastTouchX = null; lastTouchY = null; }
});

// Also re-evaluate on orientation change (mobile)
window.addEventListener('orientationchange', () => {
  setTimeout(applyLayout, 120); // slight delay for browser to settle new dimensions
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLayout);
} else {
  initLayout();
}