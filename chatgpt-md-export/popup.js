document.getElementById('save').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'REQUEST_SAVE' });
  window.close();
});