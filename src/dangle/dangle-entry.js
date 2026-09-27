import { DanglePhysics } from './physics.js';

// ------------------------------------------------------------
// Canvas setup
// ------------------------------------------------------------

const canvas = document.getElementById('dangle-canvas');
const ctx = canvas.getContext('2d');

let dpr = window.devicePixelRatio || 1;
let isVisibleState = true;
let screenRatioX = 0.85;
let charmBaseSize = 115;
let manualYOffset = 0;

const ropeConfig = {
  type: 'cord',
  stroke: '#6366f1',
  coreColor: '#a5b4fc',
  width: 2.8
};

const charmConfig = {
  imageObj: null,
  image: null,
  isLoaded: false,
  width: 80,
  height: 80,
  cropTop: 0,
  cropBottom: 0,
  cropLeft: 0,
  cropRight: 0
};

let activeStretchAction = 'win-l';

// ------------------------------------------------------------
// High-DPI Canvas resize
// ------------------------------------------------------------

function resizeCanvas() {
  dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
}

resizeCanvas();

window.addEventListener('resize', () => {
  resizeCanvas();
  physics.setAnchor(getAnchorX(), 0);
});

function getAnchorX() {
  return window.innerWidth * screenRatioX;
}

// ------------------------------------------------------------
// Alpha bounds
// ------------------------------------------------------------

function calculateAlphaBounds(img) {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });

  const maxSize = 512;
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));

  tempCanvas.width = Math.max(1, Math.floor(img.width * scale));
  tempCanvas.height = Math.max(1, Math.floor(img.height * scale));

  tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
  tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

  const data = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;

  let minX = tempCanvas.width;
  let minY = tempCanvas.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < tempCanvas.height; y++) {
    for (let x = 0; x < tempCanvas.width; x++) {
      const alpha = data[(y * tempCanvas.width + x) * 4 + 3];
      if (alpha > 12) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX === -1) {
    return { top: 0, bottom: img.height, left: 0, right: img.width };
  }

  const inverseScale = 1 / scale;
  return {
    top: Math.max(0, Math.floor(minY * inverseScale)),
    bottom: Math.min(img.height, Math.ceil((maxY + 1) * inverseScale)),
    left: Math.max(0, Math.floor(minX * inverseScale)),
    right: Math.min(img.width, Math.ceil((maxX + 1) * inverseScale))
  };
}

// ------------------------------------------------------------
// Charm image
// ------------------------------------------------------------

function recalculateDimensions() {
  if (!charmConfig.imageObj) return;

  const boundsWidth = charmConfig.cropRight - charmConfig.cropLeft;
  const boundsHeight = charmConfig.cropBottom - charmConfig.cropTop;

  if (boundsWidth <= 0 || boundsHeight <= 0) return;

  const aspect = boundsWidth / boundsHeight;
  charmConfig.height = charmBaseSize;
  charmConfig.width = charmConfig.height * aspect;
}

function setCharmImage(src) {
  if (!src) return;

  const img = new Image();
  img.onload = () => {
    const bounds = calculateAlphaBounds(img);

    charmConfig.cropTop = bounds.top;
    charmConfig.cropBottom = bounds.bottom;
    charmConfig.cropLeft = bounds.left;
    charmConfig.cropRight = bounds.right;

    charmConfig.imageObj = img;
    charmConfig.image = src;
    charmConfig.isLoaded = true;

    recalculateDimensions();
  };
  img.src = src;
}

// Relative path so it persists correctly inside the packaged Electron app
setCharmImage('./charms/cultural/nimbu-mirchi.png');

// ------------------------------------------------------------
// Physics
// ------------------------------------------------------------

const physics = new DanglePhysics({
  anchorX: getAnchorX(),
  anchorY: 0,
  restLength: 220,

  onMaxStretch: () => {
    if (window.dangleBridge && activeStretchAction && isVisibleState) {
      window.dangleBridge.triggerAction(activeStretchAction);
    }
  }
});

// ------------------------------------------------------------
// Settings & Bridge updates
// ------------------------------------------------------------

if (window.dangleBridge) {
  window.dangleBridge.onVisibilityChange?.((visible) => {
    isVisibleState = visible;
    isHovered = false;
    isDragging = false;
    document.body.style.cursor = 'default';

    if (visible) {
      resizeCanvas();
      window.dangleBridge.setIgnoreMouseEvents(true);
    } else {
      closeContextMenu();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });

  window.dangleBridge.onCharmShown?.(() => {
    resizeCanvas();
    isHovered = false;
    isDragging = false;
    document.body.style.cursor = 'default';
    window.dangleBridge.setIgnoreMouseEvents(true);
  });

  window.dangleBridge.onSettingsUpdate?.((update) => {
    if (!update) return;

    if (update.rope) {
      ropeConfig.type = update.rope.type || 'cord';
      ropeConfig.stroke = update.rope.color || ropeConfig.stroke;
      ropeConfig.coreColor = update.rope.accent || ropeConfig.coreColor;
    }

    if (update.charm && update.charm.image) {
      setCharmImage(update.charm.image);
    }

    if (update.stretchAction) {
      activeStretchAction = update.stretchAction;
    }

    if (typeof update.screenPosition === 'number') {
      screenRatioX = update.screenPosition;
      physics.setAnchor(getAnchorX(), 0);
    }

    if (typeof update.ropeLength === 'number') {
      physics.setRestLength(update.ropeLength);
    }

    if (typeof update.ropeThickness === 'number') {
      ropeConfig.width = update.ropeThickness;
    }

    if (typeof update.charmScale === 'number') {
      charmBaseSize = update.charmScale;
      recalculateDimensions();
    }

    if (typeof update.charmYOffset === 'number') {
      manualYOffset = update.charmYOffset;
    }
  });
}

// ------------------------------------------------------------
// Mouse interaction
// ------------------------------------------------------------

let isHovered = false;
let isDragging = false;

function isPointInCharm(px, py) {
  if (!isVisibleState) return false;
  const halfW = charmConfig.width / 2 + 15;
  const h = charmConfig.height + 15;
  const charmTop = physics.y - 14 + manualYOffset;

  return (
    px >= physics.x - halfW &&
    px <= physics.x + halfW &&
    py >= charmTop - 15 &&
    py <= charmTop + h
  );
}

window.addEventListener('mousemove', (e) => {
  if (!isVisibleState) return;

  const hovering = isPointInCharm(e.clientX, e.clientY);

  if (hovering !== isHovered && !isDragging) {
    isHovered = hovering;

    if (window.dangleBridge) {
      window.dangleBridge.setIgnoreMouseEvents(!hovering);
    }

    document.body.style.cursor = hovering ? 'grab' : 'default';
  }

  if (isDragging) {
    physics.dragTo(e.clientX, e.clientY);
  }
});

// ------------------------------------------------------------
// Left click = drag
// ------------------------------------------------------------

window.addEventListener('mousedown', (e) => {
  if (!isVisibleState || e.button !== 0) return;

  if (contextMenu && !contextMenu.contains(e.target)) {
    closeContextMenu();
  }

  if (isPointInCharm(e.clientX, e.clientY)) {
    isDragging = true;
    document.body.style.cursor = 'grabbing';
    physics.grab(e.clientX, e.clientY);
  }
});

// ------------------------------------------------------------
// Mouse release
// ------------------------------------------------------------

window.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    physics.release();
    document.body.style.cursor = isHovered ? 'grab' : 'default';

    if (!isHovered && window.dangleBridge) {
      window.dangleBridge.setIgnoreMouseEvents(true);
    }
  }
});

// ------------------------------------------------------------
// Context menu
// ------------------------------------------------------------

let contextMenu = null;

function closeContextMenu() {
  if (contextMenu) {
    contextMenu.remove();
    contextMenu = null;
  }
}

function showContextMenu(x, y) {
  closeContextMenu();

  contextMenu = document.createElement('div');
  Object.assign(contextMenu.style, {
    position: 'fixed',
    left: `${x}px`,
    top: `${y}px`,
    zIndex: '999999',
    minWidth: '145px',
    padding: '5px',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: '10px',
    background: 'rgba(12, 15, 24, 0.97)',
    boxShadow: '0 12px 35px rgba(0,0,0,0.45)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    fontFamily: 'Segoe UI, sans-serif'
  });

  const hideButton = document.createElement('button');
  hideButton.type = 'button';
  hideButton.textContent = 'Hide Charm';

  Object.assign(hideButton.style, {
    display: 'block',
    width: '100%',
    padding: '9px 11px',
    border: '0',
    borderRadius: '7px',
    background: 'transparent',
    color: '#e2e8f0',
    fontSize: '12px',
    textAlign: 'left',
    cursor: 'pointer'
  });

  hideButton.addEventListener('mouseenter', () => {
    hideButton.style.background = 'rgba(99,102,241,0.16)';
  });

  hideButton.addEventListener('mouseleave', () => {
    hideButton.style.background = 'transparent';
  });

  hideButton.addEventListener('click', (event) => {
    event.stopPropagation();
    closeContextMenu();
    if (window.dangleBridge) {
      window.dangleBridge.pauseCharm();
    }
  });

  contextMenu.appendChild(hideButton);
  document.body.appendChild(contextMenu);

  const rect = contextMenu.getBoundingClientRect();
  if (rect.right > window.innerWidth) {
    contextMenu.style.left = `${Math.max(4, window.innerWidth - rect.width - 4)}px`;
  }
  if (rect.bottom > window.innerHeight) {
    contextMenu.style.top = `${Math.max(4, window.innerHeight - rect.height - 4)}px`;
  }
}

window.addEventListener('contextmenu', (e) => {
  if (!isVisibleState || !isPointInCharm(e.clientX, e.clientY)) return;

  e.preventDefault();
  e.stopPropagation();

  if (isDragging) {
    isDragging = false;
    physics.release();
  }

  showContextMenu(e.clientX, e.clientY);
});

window.addEventListener('mousedown', (e) => {
  if (contextMenu && !contextMenu.contains(e.target)) {
    closeContextMenu();
  }
});

// ------------------------------------------------------------
// Physics & Occlusion-Proof Ticker Loop
// ------------------------------------------------------------

let lastTime = performance.now();
const FIXED_DELTA = 1 / 120;
let accumulator = 0;

function runPhysicsStep() {
  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  if (isVisibleState) {
    accumulator += dt;
    while (accumulator >= FIXED_DELTA) {
      physics.step(FIXED_DELTA);
      accumulator -= FIXED_DELTA;
    }
    render();
  }
}

function tick() {
  runPhysicsStep();
  requestAnimationFrame(tick);
}

// Primary 120Hz/V-Sync loop
requestAnimationFrame(tick);

// Fallback interval (60Hz): keeps physics and render state alive
// if Chromium suspends RAF during multi-tab / full-screen desktop switching
setInterval(() => {
  if (performance.now() - lastTime > 32) {
    runPhysicsStep();
  }
}, 16);

// ------------------------------------------------------------
// Cord Spline Curve
// ------------------------------------------------------------

function traceSpline(context, points) {
  if (points.length < 2) return;

  context.beginPath();
  context.moveTo(points[0].x, points[0].y);

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 >= points.length ? points.length - 1 : i + 2];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
}

// ------------------------------------------------------------
// Procedural Keychain Chain Renderer
// ------------------------------------------------------------

function renderChain(context, points, isGold, isTaut) {
  const baseThickness = Math.max(2.5, ropeConfig.width * 1.5);
  const linkLength = baseThickness * 2.8;
  const linkWidth = baseThickness * 1.8;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const segDist = Math.hypot(dx, dy);
    if (segDist < 0.01) continue;

    const angle = Math.atan2(dy, dx);
    const steps = Math.max(1, Math.round(segDist / (linkLength * 0.65)));

    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const lx = p1.x + dx * t;
      const ly = p1.y + dy * t;
      const isSideLink = (i + s) % 2 === 0;

      context.save();
      context.translate(lx, ly);
      context.rotate(angle);

      if (isTaut) {
        context.shadowColor = '#ef4444';
        context.shadowBlur = 10 * dpr;
      } else {
        context.shadowColor = 'rgba(0,0,0,0.35)';
        context.shadowBlur = 3 * dpr;
      }

      if (isSideLink) {
        // Vertical/Side-facing link
        const grad = context.createLinearGradient(-linkLength / 2, 0, linkLength / 2, 0);
        if (isTaut) {
          grad.addColorStop(0, '#7f1d1d');
          grad.addColorStop(0.5, '#ef4444');
          grad.addColorStop(1, '#991b1b');
        } else if (isGold) {
          grad.addColorStop(0, '#ca8a04');
          grad.addColorStop(0.5, '#fef08a');
          grad.addColorStop(1, '#a16207');
        } else {
          grad.addColorStop(0, '#64748b');
          grad.addColorStop(0.5, '#f8fafc');
          grad.addColorStop(1, '#334155');
        }

        context.fillStyle = grad;
        context.beginPath();
        context.ellipse(0, 0, linkLength / 2, linkWidth * 0.35, 0, 0, Math.PI * 2);
        context.fill();

        context.strokeStyle = isTaut ? '#fca5a5' : (isGold ? '#fef9c3' : '#ffffff');
        context.lineWidth = 0.8;
        context.stroke();
      } else {
        // Front-facing open oval loop
        context.beginPath();
        context.ellipse(0, 0, linkLength / 2, linkWidth / 2, 0, 0, Math.PI * 2);

        context.strokeStyle = isTaut
          ? '#dc2626'
          : (isGold ? '#b45309' : '#475569');
        context.lineWidth = baseThickness;
        context.stroke();

        context.beginPath();
        context.ellipse(0, 0, (linkLength / 2) - 0.5, (linkWidth / 2) - 0.5, 0, 0, Math.PI * 2);
        context.strokeStyle = isTaut
          ? '#fca5a5'
          : (isGold ? '#fef08a' : '#f8fafc');
        context.lineWidth = baseThickness * 0.45;
        context.stroke();
      }

      context.restore();
    }
  }
}

// ------------------------------------------------------------
// Render
// ------------------------------------------------------------

function render() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!isVisibleState) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const cx = physics.x;
  const ropeTipY = physics.y;

  if (physics.nodes && physics.nodes.length > 0) {
    const lastNode = physics.nodes[physics.nodes.length - 1];
    lastNode.x = cx;
    lastNode.y = ropeTipY;
  }

  const isTaut = physics.stretchRatio > 0.85;

  // ----------------------------------------------------------
  // Rope / Chain Presentation
  // ----------------------------------------------------------

  if (physics.nodes && physics.nodes.length >= 2) {
    const points = physics.nodes.map((node) => ({ x: node.x, y: node.y }));
    points[points.length - 1] = { x: cx, y: ropeTipY };

    if (ropeConfig.type === 'gold-chain') {
      renderChain(ctx, points, true, isTaut);
    } else if (ropeConfig.type === 'silver-chain') {
      renderChain(ctx, points, false, isTaut);
    } else {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 1. Glow / Shadow
      ctx.strokeStyle = isTaut ? 'rgba(239, 68, 68, 0.6)' : 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = ropeConfig.width + Math.max(1.5, ropeConfig.width * 0.7);
      ctx.shadowColor = isTaut ? '#ef4444' : 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = (isTaut ? 16 : 4) * dpr;
      traceSpline(ctx, points);
      ctx.stroke();

      // 2. Main Rope Core
      ctx.shadowBlur = isTaut ? 10 * dpr : 0;
      ctx.shadowColor = '#ef4444';
      ctx.strokeStyle = isTaut ? '#dc2626' : ropeConfig.stroke;
      ctx.lineWidth = ropeConfig.width;
      traceSpline(ctx, points);
      ctx.stroke();

      // 3. Cord Core Highlight
      ctx.strokeStyle = isTaut ? '#fca5a5' : ropeConfig.coreColor;
      ctx.globalAlpha = isTaut ? 0.9 : 0.35;
      ctx.lineWidth = Math.max(0.7, ropeConfig.width * 0.35);
      traceSpline(ctx, points);
      ctx.stroke();

      ctx.restore();
    }
  }

  // ----------------------------------------------------------
  // Charm
  // ----------------------------------------------------------

  if (charmConfig.isLoaded && charmConfig.imageObj) {
    const img = charmConfig.imageObj;
    const cropWidth = charmConfig.cropRight - charmConfig.cropLeft;
    const cropHeight = charmConfig.cropBottom - charmConfig.cropTop;

    if (cropWidth > 0 && cropHeight > 0) {
      const drawWidth = charmConfig.width;
      const drawHeight = charmConfig.height;
      const drawX = cx - drawWidth / 2;
      const drawY = ropeTipY - 14 + manualYOffset;

      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.shadowColor = isTaut ? 'rgba(239, 68, 68, 0.65)' : 'rgba(0, 0, 0, 0.30)';
      ctx.shadowBlur = (isTaut ? 14 : 8) * dpr;
      ctx.shadowOffsetY = (isTaut ? 0 : 2) * dpr;

      ctx.drawImage(
        img,
        charmConfig.cropLeft,
        charmConfig.cropTop,
        cropWidth,
        cropHeight,
        drawX,
        drawY,
        drawWidth,
        drawHeight
      );

      ctx.restore();
    }
  }
}