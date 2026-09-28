// VanishCam: isolated-world bridge. The real UI lives in the MAIN world
// (it has to, to hook Meet's camera), but only the isolated world gets
// chrome.runtime, so commands hop through a DOM event.
chrome.runtime.onMessage.addListener((msg) => {
  if (!msg || !msg.vc) return;
  try {
    window.dispatchEvent(new CustomEvent('vc-cmd', { detail: String(msg.vc) }));
  } catch (e) { /* ignore */ }
});
