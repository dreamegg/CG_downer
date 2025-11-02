const $ = (s)=>document.querySelector(s);

(async function init(){
  const defaults = {
    target: "local",
    folder: "ChatGPT",
    pattern: "{year}/{month}/{date}-{time}-{title}",
    driveFolderId: "",
    auth: { access_token: null, expires_at: 0 }
  };
  const { cfg = defaults } = await chrome.storage.sync.get({ cfg: defaults });

  document.querySelectorAll('input[name="target"]').forEach(r=>{
    r.checked = (r.value === cfg.target);
  });
  $("#folder").value = cfg.folder || "ChatGPT";
  $("#pattern").value = cfg.pattern || "{date}-{time}-{title}";
  $("#driveFolderId").value = cfg.driveFolderId || "";

  renderAuthStatus(cfg.auth);
})();

function renderAuthStatus(auth){
  const now = Date.now()/1000|0;
  const ok = !!auth?.access_token && auth.expires_at > now + 60;
  $("#authStatus").textContent = ok ? "연결됨" : "미연결";
  $("#authStatus").className = ok ? 'ok' : 'warn';
  $("#connect").style.display = ok ? 'none' : 'inline-block';
  $("#disconnect").style.display = ok ? 'inline-block' : 'none';
}

$("#save").addEventListener("click", async ()=>{
  const target = document.querySelector('input[name="target"]:checked')?.value || "local";
  const folder = ($("#folder").value || "ChatGPT").trim().replace(/^\/+|\/+$/g,"");
  const pattern = ($("#pattern").value || "{date}-{time}-{title}").trim();
  const driveFolderId = ($("#driveFolderId").value || "").trim();

  const { cfg } = await chrome.storage.sync.get({ cfg: {} });
  await chrome.storage.sync.set({ cfg: { ...cfg, target, folder, pattern, driveFolderId }});
  $("#status").textContent = "저장됨";
  setTimeout(()=> $("#status").textContent="", 1200);
});

$("#connect").addEventListener("click", async ()=>{
  const auth = await chrome.runtime.sendMessage({ type: "OAUTH_CONNECT" });
  renderAuthStatus(auth || {});
});

$("#disconnect").addEventListener("click", async ()=>{
  await chrome.runtime.sendMessage({ type: "OAUTH_DISCONNECT" });
  renderAuthStatus({ access_token:null, expires_at:0 });
});
