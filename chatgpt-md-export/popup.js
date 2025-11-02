const saveLocalBtn = document.getElementById('saveLocal');
const saveDriveBtn = document.getElementById('saveDrive');
const statusEl = document.getElementById('driveStatus');
const optionsLink = document.getElementById('optionsLink');

saveLocalBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'REQUEST_SAVE', target: 'local' });
  window.close();
});

saveDriveBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'REQUEST_SAVE', target: 'gdrive' });
  window.close();
});

function setStatus(text, cls) {
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.classList.remove('ok', 'warn', 'info');
  if (cls) statusEl.classList.add(cls);
}

async function updateDriveStatus() {
  if (!statusEl) return;
  try {
    const { cfg = {} } = await chrome.storage.sync.get({ cfg: {} });
    const target = cfg.target || 'local'; // This is now the *default* save target, not the current one

    // optionsLink.style.display is now handled by CSS based on connection status

    const now = Math.floor(Date.now() / 1000);
    const auth = cfg.auth || {};
    const connected = !!auth.access_token && (auth.expires_at || 0) > now + 60;

    if (connected) {
      statusEl.innerHTML = 'Google Drive: <span class="ok">연결됨</span>';
      saveDriveBtn.disabled = false;
    } else {
      statusEl.innerHTML = 'Google Drive: <span class="warn">연결 필요</span>';
      saveDriveBtn.disabled = true; // Disable drive save button if not connected
    }
  } catch (err) {
    setStatus('연결 상태를 불러올 수 없습니다', 'warn');
    console.error('Drive status check failed', err);
  }
}

updateDriveStatus();