export const CLOAK_PRESETS = {
  default: {
    name: "Default (Declan's Hub)",
    title: "Declan's Hub",
    favicon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎮</text></svg>',
    iconChar: '🎮'
  },
  'google-classroom': {
    name: 'Google Classroom',
    title: 'Home - Classroom',
    favicon: 'https://ssl.gstatic.com/classroom/favicon.png',
    iconChar: '🏫'
  },
  'google-drive': {
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    favicon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png',
    iconChar: '📁'
  },
  'google-docs': {
    name: 'Google Docs',
    title: 'Google Docs',
    favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
    iconChar: '📄'
  },
  'canvas': {
    name: 'Canvas LMS',
    title: 'Dashboard - Canvas',
    favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
    iconChar: '🎒'
  },
  'edpuzzle': {
    name: 'Edpuzzle',
    title: 'Edpuzzle',
    favicon: 'https://edpuzzle.imgix.net/favicons/favicon-32.png',
    iconChar: '🧩'
  },
  'desmos': {
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    favicon: 'https://www.desmos.com/favicon.ico',
    iconChar: '📈'
  }
};

export function applyCloak(preset) {
  const info = CLOAK_PRESETS[preset] || CLOAK_PRESETS.default;
  document.title = info.title;

  let faviconLink = document.getElementById('favicon-link');
  if (!faviconLink) {
    faviconLink = document.createElement('link');
    faviconLink.id = 'favicon-link';
    faviconLink.rel = 'icon';
    document.head.appendChild(faviconLink);
  }
  faviconLink.href = info.favicon;
  localStorage.setItem('novaplay_cloak_preset', preset);
}

export function getSavedCloak() {
  const saved = localStorage.getItem('novaplay_cloak_preset');
  return saved && CLOAK_PRESETS[saved] ? saved : 'default';
}

/**
 * Opens a game in an about:blank stealth window.
 * School internet filtering / monitoring extensions only see 'about:blank' as the URL.
 */
export function openAboutBlank(game) {
  const win = window.open('about:blank', '_blank');
  if (!win) {
    alert('Pop-up blocked! Please allow pop-ups to open in stealth mode.');
    return;
  }

  const doc = win.document;
  doc.title = game.title;

  // Sync favicon if cloaked
  const savedCloak = getSavedCloak();
  const cloakInfo = CLOAK_PRESETS[savedCloak] || CLOAK_PRESETS.default;
  doc.title = savedCloak !== 'default' ? cloakInfo.title : game.title;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${doc.title}</title>
      <link rel="icon" href="${cloakInfo.favicon}">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body, html { width: 100%; height: 100%; overflow: hidden; background: #000; }
        iframe { width: 100vw; height: 100vh; border: none; display: block; }
      </style>
    </head>
    <body>
      <iframe 
        id="${game.iframe.id || ''}"
        name="${game.iframe.name || ''}"
        src="${game.iframe.src}" 
        sandbox="${game.iframe.sandbox || 'allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-downloads allow-storage-access-by-user-activation'}"
        allow="${game.iframe.allow || 'autoplay; fullscreen; camera; focus-without-user-activation *; monetization; gamepad; keyboard-map *; xr-spatial-tracking; clipboard-write'}"
        scrolling="${game.iframe.scrolling || 'no'}"
        style="${game.iframe.style || 'width: 100vw; height: 100vh; border: none;'}"
        allowfullscreen="true">
      </iframe>
    </body>
    </html>
  `;
  doc.open();
  doc.write(html);
  doc.close();
}

/**
 * Panic button: Immediately redirects current tab to Google Classroom
 */
export function triggerPanic() {
  window.location.replace('https://classroom.google.com');
}
