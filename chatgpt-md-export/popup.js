const saveBtn = document.getElementById('save');
const statusEl = document.getElementById('driveStatus');

saveBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'REQUEST_SAVE' });
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
    const target = cfg.target || 'local';

    if (target !== 'gdrive') {
      setStatus('저장 위치: 로컬 다운로드 폴더', 'info');
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    const auth = cfg.auth || {};
    const connected = !!auth.access_token && (auth.expires_at || 0) > now + 60;

    if (connected) {
      setStatus('Google Drive: 연결됨', 'ok');
    } else {
      setStatus('Google Drive: 다시 연결 필요', 'warn');
    }
  } catch (err) {
    setStatus('연결 상태를 불러올 수 없습니다', 'warn');
    console.error('Drive status check failed', err);
  }
}

updateDriveStatus();
