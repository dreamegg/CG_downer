# GEMINI.md

## Project Overview

This project is a Chrome extension called "ChatGPT → Markdown" that allows users to export their ChatGPT conversations into Markdown files. It provides the functionality to save the files either to the user's local download folder or to their Google Drive.

The extension is built using JavaScript and the Chrome Extension Manifest V3 APIs. It interacts with the content of the ChatGPT website to extract the conversation and formats it into a clean Markdown document.

## Building and Running

This is a simple Chrome extension with no build process required. To run this extension:

1.  Open a Chromium-based browser (like Google Chrome, Brave, or Edge).
2.  Navigate to `chrome://extensions/`.
3.  Enable "Developer mode" using the toggle switch.
4.  Click on the "Load unpacked" button.
5.  Select the `chatgpt-md-export` directory from this project.

The extension will then be installed and ready to use.

## Development Conventions

*   **Language:** The extension is written in plain JavaScript.
*   **Manifest Version:** It uses Manifest V3, the current standard for Chrome extensions.
*   **DOM Dependency:** The `content.js` script directly interacts with the DOM of the ChatGPT website. This means that changes to the ChatGPT website's HTML structure could potentially break the extension's core functionality.
*   **Google Drive Integration:** The extension uses the Google Drive API (v3) to upload files. It implements an OAuth 2.0 implicit flow for user authentication.
*   **No External Libraries:** The project does not use any external JavaScript libraries, relying solely on the browser's Web APIs and the Chrome Extension APIs.

## Key Files

*   `chatgpt-md-export/manifest.json`: The manifest file that defines the extension's name, permissions, background scripts, and other essential metadata.
*   `chatgpt-md-export/service_worker.js`: The background service worker that handles the main logic of the extension. It orchestrates the saving process and manages the Google Drive authentication and upload.
*   `chatgpt-md-export/content.js`: A content script that is injected into the ChatGPT web page. Its primary role is to parse the conversation from the page's DOM, convert it to Markdown, and send it to the service worker.
*   `chatgpt-md-export/popup.html` and `chatgpt-md-export/popup.js`: These files create the small popup window that appears when the user clicks on the extension's icon in the browser toolbar. This UI allows the user to initiate the save process.
*   `chatgpt-md-export/options.html` and `chatgpt-md-export/options.js`: These files provide a configuration page for the extension, where users can set their preferences, such as the default save location (local or Google Drive) and other settings.
