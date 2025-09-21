# Repository Guidelines

## Project Structure & Module Organization
All extension code lives in `chatgpt-md-export/`. Core runtime logic is split between `content.js` (DOM scraping), `service_worker.js` (background + OAuth), and UI scripts `popup.js` and `options.js` paired with their HTML files. Static assets sit under `icons/`, while `manifest.json` declares permissions, OAuth scopes, and keyboard shortcuts. Keep new modules colocated with the feature they support, and document any new directories in `README.md`.

## Build, Test, and Development Commands
This project ships unpacked; no bundler is in use. Load it via Chrome: `chrome://extensions` → enable Developer Mode → **Load unpacked** → select `chatgpt-md-export/`. For manual packaging, run `zip -r dist/chatgpt-md-export.zip chatgpt-md-export` and upload the archive. Use `chrome.runtime.reload()` from the Extensions page to pick up changes quickly while developing.

## Coding Style & Naming Conventions
Use modern ES modules with `const`/`let` and 2-space indentation, mirroring the existing files. Prefer `camelCase` for variables and functions, and keep helper functions pure when possible. Inline comments should stay concise (Korean is fine) and explain intent, not mechanics. Maintain alphabetical lists in `manifest.json` (permissions, hosts) when adding entries.

## Testing Guidelines
There is no automated test harness yet; rely on manual QA. After updates, reload the unpacked extension, trigger `Ctrl+Shift+Y` (`Command+Shift+Y` on macOS), and confirm Markdown downloads with the configured naming pattern. When touching Google Drive features, connect through the options page and verify uploads land in the expected folder without new scopes.

## Commit & Pull Request Guidelines
Follow short, imperative commit summaries such as `content: normalize Markdown fences`. Reference the touched module or feature in the scope. Pull requests should link any tracked issue, describe visible changes, and include screenshots or GIFs for UI tweaks (popup/options). Note required manual test steps and any OAuth considerations before requesting review.

## Security & Configuration Tips
Do not replace the production OAuth client ID without coordination. Before adding permissions or hosts in `manifest.json`, justify the need in the PR description and keep the surface area minimal. Never commit personal tokens or downloaded transcripts—use `.gitignore` for local artifacts.
