const hitboxArea = document.getElementById('hitbox-area');

let isDragging = false;
let activePointerId = null;

hitboxArea.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return;

  isDragging = true;
  activePointerId = e.pointerId;
  hitboxArea.setPointerCapture(e.pointerId);

  window.dangleBridge.sendHitboxPointerDown({
    screenX: e.screenX,
    screenY: e.screenY
  });
});

window.addEventListener('pointermove', (e) => {
  if (!isDragging) return;

  window.dangleBridge.sendHitboxPointerMove({
    screenX: e.screenX,
    screenY: e.screenY
  });
});

const handlePointerUp = (e) => {
  if (!isDragging) return;

  isDragging = false;
  if (activePointerId !== null) {
    try {
      hitboxArea.releasePointerCapture(activePointerId);
    } catch (_err) {
      // Ignored if released by OS
    }
  }
  activePointerId = null;

  window.dangleBridge.sendHitboxPointerUp({
    screenX: e.screenX,
    screenY: e.screenY
  });
};

window.addEventListener('pointerup', handlePointerUp);
window.addEventListener('pointercancel', handlePointerUp);