// VanishCam: service worker. Chrome shortcut commands cannot be handled by
// the page, so they arrive here and are forwarded to the Meet tab.
chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const tab = tabs && tabs[0];
    if (!tab || tab.id == null) return;
    chrome.tabs.sendMessage(tab.id, { vc: command }).catch(() => {});
  });
});
