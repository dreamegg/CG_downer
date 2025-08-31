document.getElementById('save').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'REQUEST_SAVE' });
  window.close();
});

function renderAuthStatus(auth) {
  const now = Math.floor(Date.now() / 1000);
  const ok = !!auth?.access_token && auth.expires_at > now + 60;
  document.getElementById('authStatus').textContent = ok ? '연결됨' : '미연결';
}

(async () => {
  const { cfg = {} } = await chrome.storage.sync.get({ cfg: {} });
  renderAuthStatus(cfg.auth || {});
})();