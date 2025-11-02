chrome.commands.onCommand.addListener((cmd)=>{ if(cmd==="save_markdown") triggerSave(); });
chrome.runtime.onMessage.addListener((msg, sender, sendResponse)=>{
  if (msg.type === "REQUEST_SAVE") {
    triggerSave();
    return; // No async response
  }
  if (msg.type === "OAUTH_CONNECT") {
    (async () => {
      const auth = await connect();
      sendResponse(auth);
    })();
    return true;
  }
  if (msg.type === "OAUTH_DISCONNECT") {
    (async () => {
      await disconnect();
      sendResponse({});
    })();
    return true;
  }
});

async function triggerSave(){
  const [tab] = await chrome.tabs.query({ active:true, currentWindow:true });
  if (!tab?.id) return;

  await chrome.scripting.executeScript({ target:{ tabId: tab.id }, files:["content.js"] });

  chrome.tabs.sendMessage(tab.id, { type:"COLLECT_MD" }, async (md)=>{
    if (!md) return;

    const { cfg } = await chrome.storage.sync.get({ cfg:{} });
    const filenameBase = buildNameFromMd(cfg, tab, md);

    if (cfg?.target === "gdrive") {
      const auth = await ensureAuth();
      if (!auth?.access_token) { console.warn("No Drive auth"); return; }
      const folderId = cfg.driveFolderId?.trim();
      await uploadToDrive({
        access_token: auth.access_token,
        folderId,
        name: filenameBase + ".md",
        content: md
      });
    } else {
      // local
      const dataUrl = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
      let filename = `${filenameBase}.md`;
      if (!filenameBase.includes('/')) {
        const folder = (cfg.folder || "ChatGPT").replace(/^\/+|\/+$/g,"");
        filename = `${folder}/${filename}`;
      }
      await chrome.downloads.download({
        url: dataUrl,
        filename: filename,
        saveAs: false,
        conflictAction: "uniquify"
      });
    }
  });
}

function buildNameFromMd(cfg, tab, md){
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = now.toISOString().slice(0,10);
  const time = now.toTimeString().slice(0,8).replace(/:/g,"-");
  const title = sanitizeTitle(extractTitle(md) || tab.title || "ChatGPT");
  return (cfg.pattern || "{year}/{month}/{date}-{time}-{title}")
    .replaceAll("{year}", year)
    .replaceAll("{month}", month)
    .replaceAll("{date}", date)
    .replaceAll("{time}", time)
    .replaceAll("{title}", title);
}
function extractTitle(md){ const m = md.match(/^#\s+(.+)\s*$/m); return m ? m[1] : null; }
function sanitizeTitle(s){ return s.replace(/[\\/:*?"<>|]+/g,"").replace(/\s+/g," ").trim().slice(0,120); }

// ---------- Google OAuth ----------
async function connect(){ const auth = await authorize(); await saveAuth(auth); return auth; }
async function disconnect(){
  const { cfg } = await chrome.storage.sync.get({ cfg:{} });
  await chrome.storage.sync.set({ cfg: { ...cfg, auth: { access_token:null, expires_at:0 } } });
}

async function ensureAuth(){
  const { cfg } = await chrome.storage.sync.get({ cfg:{} });
  const now = Math.floor(Date.now()/1000);
  if (cfg?.auth?.access_token && cfg.auth.expires_at > now + 60) return cfg.auth;
  const auth = await authorize();
  await saveAuth(auth);
  return auth;
}

async function saveAuth(auth){
  const { cfg } = await chrome.storage.sync.get({ cfg:{} });
  await chrome.storage.sync.set({ cfg: { ...cfg, auth }});
}

// Implicit flow via chrome.identity.launchWebAuthFlow
async function authorize(){
  try {
    // manifest.oauth2.client_id 와 동일해야 함
    const { oauth2 } = chrome.runtime.getManifest();
    const clientId = oauth2.client_id;
    const scopes = encodeURIComponent(oauth2.scopes.join(" "));
    const redirectUri = chrome.identity.getRedirectURL(); // https://<ext-id>.chromiumapp.org/
    const authUrl =
      "https://accounts.google.com/o/oauth2/v2/auth"
      + `?client_id=${encodeURIComponent(clientId)}`
      + `&response_type=token`
      + `&redirect_uri=${encodeURIComponent(redirectUri)}`
      + `&scope=${scopes}`
      + `&prompt=consent`;

    const respUrl = await chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true });
    // respUrl: https://<ext-id>.chromiumapp.org/#access_token=...&token_type=Bearer&expires_in=3599&scope=...
    const hash = new URL(respUrl).hash.substring(1);
    const params = new URLSearchParams(hash);
    const access_token = params.get("access_token");
    const expires_in = parseInt(params.get("expires_in") || "0", 10);
    const expires_at = Math.floor(Date.now()/1000) + Math.max(0, expires_in - 30);
    return { access_token, expires_at };
  } catch (e) {
    console.log("Auth flow failed", e);
    return { access_token: null, expires_at: 0 };
  }
}

// ---------- Drive Upload ----------
async function uploadToDrive({ access_token, folderId, name, content }){
  // multipart/related (metadata + file)
  const boundary = "gcpx-" + Math.random().toString(36).slice(2);
  const metadata = {
    name,
    mimeType: "text/markdown",
    ...(folderId ? { parents: [folderId] } : {})
  };
  const body =
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: text/markdown; charset=UTF-8\r\n\r\n` +
    `${content}\r\n` +
    `--${boundary}--`;

  const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${access_token}`,
      "Content-Type": `multipart/related; boundary=${boundary}`
    },
    body
  });

  if (!res.ok) {
    const t = await res.text().catch(()=> "");
    console.error("Drive upload failed", res.status, t);
  }
}
