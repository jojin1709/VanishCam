// VanishCam: hooks the camera in Google Meet, adds the small control pill,
// and wires snap detection + hotkeys to the vanish effect.
(() => {
  'use strict';
  const S = (window.__snap = window.__snap || {});
  const md = navigator.mediaDevices;
  if (!md || !md.getUserMedia || S.installed) return;
  S.installed = true;

  const shared = { mode: 'live', bg: null, bgVer: 0, active: null, onFrame: null };
  S.shared = shared;
  const origGUM = md.getUserMedia.bind(md);

  let detectorStarted = false;
  let uiRefresh = () => {};
  let flashMsg = '', flashUntil = 0;
  let micOn = true;
  let bgLoadTried = false;
  try { micOn = localStorage.getItem('snap.mic') !== '0'; } catch (e) { /* storage can be blocked */ }

  function flash(msg, ms = 2200) { flashMsg = msg; flashUntil = performance.now() + ms; uiRefresh(); setTimeout(uiRefresh, ms + 50); }

  function toggle() {
    const p = shared.active;
    if (!p) return flash(S.t('noCam'));
    const r = p.trigger();
    if (r === 'nobg') flash(S.t('needRoomFlash'));
    if (r === 'busy') flash(S.t('busy'));
    uiRefresh();
  }
  S.toggle = toggle;

  async function startDetector() {
    if (detectorStarted || !micOn) return;
    detectorStarted = true;
    try {
      await S.startSnapDetector(origGUM, () => toggle());
    } catch (e) {
      console.warn('[vanishcam] mic snap detection unavailable', e);
      flash(S.t('micDead'));
    }
  }

  function setMic(on) {
    micOn = on;
    try { localStorage.setItem('snap.mic', on ? '1' : '0'); } catch (e) { /* ignore */ }
    if (on) {
      startDetector();
    } else {
      detectorStarted = false;
      if (S.stopSnapDetector()) flash(S.t('micReleased'));
    }
    uiRefresh();
  }

  // The empty-room photo survives a reload so you do not have to recapture
  // every time. It stays in this browser only (localStorage, meet.google.com).
  function loadSavedBg() {
    if (bgLoadTried || shared.bg) return;
    bgLoadTried = true;
    S.loadBg((im) => {
      if (shared.bg || !im.naturalWidth) return;
      const c = document.createElement('canvas');
      c.width = im.naturalWidth;
      c.height = im.naturalHeight;
      c.getContext('2d').drawImage(im, 0, 0);
      shared.bg = c;
      shared.bgVer++;
      flash(S.t('roomLoaded'), 3000);
      uiRefresh();
    });
  }

  md.getUserMedia = async function (constraints) {
    if (!constraints || !constraints.video) return origGUM(constraints);
    const real = await origGUM(constraints);
    try {
      const vt = real.getVideoTracks()[0];
      if (!vt) return real;
      // camera was re-opened (device switch, Meet video effects, camera off/on):
      // the old pipeline must die, and the saved room may no longer match
      if (shared.active) {
        try { shared.active.destroy(); } catch (e) { /* ignore */ }
        flash(S.t('camReopen'), 3200);
      }
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.srcObject = new MediaStream([vt]);
      await new Promise((res) => {
        video.onloadedmetadata = res;
        setTimeout(res, 3000);
      });
      await video.play().catch(() => {});

      const pipe = new S.Pipeline(video, shared);
      pipe.start();
      shared.active = pipe;

      const outTrack = pipe.canvas.captureStream(30).getVideoTracks()[0];
      const realStop = outTrack.stop.bind(outTrack);
      const cleanup = () => { pipe.destroy(); try { vt.stop(); } catch (e) { /* ignore */ } };
      outTrack.stop = () => { realStop(); cleanup(); };
      vt.addEventListener('ended', () => { cleanup(); try { outTrack.dispatchEvent(new Event('ended')); } catch (e) { /* ignore */ } });
      const vs = vt.getSettings ? vt.getSettings() : {};
      outTrack.getSettings = () => Object.assign({}, vs, { width: pipe.W, height: pipe.H });
      outTrack.applyConstraints = async () => {};
      try { Object.defineProperty(outTrack, 'label', { value: vt.label }); } catch (e) { /* ignore */ }

      startDetector();
      loadSavedBg();
      uiRefresh();
      return new MediaStream([outTrack, ...real.getAudioTracks()]);
    } catch (e) {
      console.warn('[vanishcam] falling back to the normal camera', e);
      return real;
    }
  };

  // ---------- UI ----------
  function mountUI() {
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;top:12px;left:12px;z-index:2147483647;';
    const root = host.attachShadow({ mode: 'open' });
    // built with DOM calls, not innerHTML: Meet enforces Trusted Types and
    // would silently block innerHTML
    const el = (tag, props, kids) => {
      const n = document.createElement(tag);
      Object.assign(n, props || {});
      (kids || []).forEach((k) => n.appendChild(k));
      return n;
    };
    const style = el('style', { textContent: `
        *{box-sizing:border-box;font-family:system-ui,-apple-system,sans-serif}
        .pill{display:flex;align-items:center;gap:8px;background:rgba(14,14,16,.88);color:#e9e9ee;
          border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:6px 12px;font-size:12px;
          backdrop-filter:blur(8px);user-select:none}
        .dot{width:8px;height:8px;border-radius:50%;background:#6b6b76}
        .dot.armed{background:#7cf0b4}.dot.gone{background:#b48cff}.dot.warn{background:#ffb86b}
        #st{cursor:pointer;letter-spacing:.02em}
        .panel{display:none;margin-top:8px;background:rgba(14,14,16,.92);color:#e9e9ee;border:1px solid rgba(255,255,255,.12);
          border-radius:14px;padding:10px;font-size:12px;gap:8px;flex-direction:column;width:224px}
        .panel.open{display:flex}
        .row{display:flex;gap:6px}
        .row button{flex:1}
        button{background:#23232a;color:#e9e9ee;border:1px solid rgba(255,255,255,.14);border-radius:8px;padding:7px 10px;
          font-size:12px;cursor:pointer}
        button:hover{background:#2e2e37}
        button.off{opacity:.6}
        label{display:flex;flex-direction:column;gap:4px;color:#a9a9b6}
        input{width:100%}
        .hint{color:#8d8d9a;line-height:1.4}
      ` });
    const range = el('input', { id: 'sens', type: 'range', min: '3', max: '14', step: '0.5' });
    const durRange = el('input', { id: 'dur', type: 'range', min: '800', max: '4000', step: '100' });
    const densRange = el('input', { id: 'dens', type: 'range', min: '0.3', max: '2', step: '0.1' });
    const panel = el('div', { className: 'panel', id: 'panel' }, [
      el('button', { id: 'cap', textContent: S.t('cap') }),
      el('button', { id: 'tg', textContent: S.t('vanish') }),
      el('div', { className: 'row' }, [
        el('button', { id: 'mic' }),
        el('button', { id: 'fgt', textContent: S.t('forget') })
      ]),
      el('label', {}, [range, el('span', { id: 'sensv' })]),
      el('label', {}, [durRange, el('span', { id: 'durv' })]),
      el('label', {}, [densRange, el('span', { id: 'densv' })]),
      el('div', { className: 'hint', textContent: S.t('hint') })
    ]);
    // the three sliders need their titles, rebuilt after panel exists
    const labels = panel.querySelectorAll('label');
    labels[0].insertBefore(document.createTextNode(S.t('sens')), labels[0].firstChild);
    labels[1].insertBefore(document.createTextNode(S.t('dur')), labels[1].firstChild);
    labels[2].insertBefore(document.createTextNode(S.t('dens')), labels[2].firstChild);
    const pill = el('div', { className: 'pill' }, [
      el('span', { className: 'dot', id: 'dot' }),
      el('span', { id: 'st', textContent: 'snap' })
    ]);
    [style, pill, panel].forEach((n) => root.appendChild(n));
    const $ = (id) => root.getElementById(id);
    let open = false, countdown = 0;

    function render() {
      const panel = $('panel');
      panel.classList.toggle('open', open);
      const dot = $('dot'), st = $('st');
      let txt, cls = '';
      if (performance.now() < flashUntil) { txt = flashMsg; cls = 'warn'; }
      else if (countdown > 0) { txt = S.t('stepOut') + countdown; cls = 'warn'; }
      else if (countdown < 0) { txt = S.t('saving'); cls = 'warn'; }
      else if (!shared.active) { txt = S.t('waitCam'); }
      else if (!shared.bg) { txt = S.t('needRoom'); cls = 'warn'; }
      else if (shared.mode === 'gone') { txt = S.t('gone'); cls = 'gone'; }
      else if (shared.mode === 'live') { txt = S.t('armed'); cls = 'armed'; }
      else txt = shared.mode === 'vanishing' ? S.t('vanishing') : S.t('returning');
      dot.className = 'dot ' + cls;
      st.textContent = txt;
      const micBtn = $('mic');
      if (micBtn) {
        micBtn.textContent = micOn ? S.t('micOn') : S.t('micOff');
        micBtn.className = micOn ? '' : 'off';
      }
      const sv = $('sensv'), dv = $('durv'), pv = $('densv');
      if (sv) sv.textContent = String(S.sensitivity);
      if (dv) dv.textContent = (S.fx.dur / 1000).toFixed(1) + 's';
      if (pv) pv.textContent = S.fx.dens.toFixed(1) + 'x';
    }
    uiRefresh = render;
    shared.onFrame = (() => { let last = 0; return () => { const n = performance.now(); if (n - last > 250) { last = n; render(); } }; })();

    $('st').addEventListener('click', () => { open = !open; render(); });
    $('tg').addEventListener('click', toggle);
    $('mic').addEventListener('click', () => setMic(!micOn));
    $('fgt').addEventListener('click', () => {
      S.clearBg();
      shared.bg = null;
      shared.bgVer++;
      flash(S.t('roomForgotten'));
      render();
    });
    $('cap').addEventListener('click', () => {
      const p = shared.active;
      if (!p) return flash(S.t('noCam'));
      countdown = 3;
      render();
      const tick = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
          clearInterval(tick);
          countdown = -1;
          render();
          p.captureBg().then(() => { countdown = 0; open = false; flash(S.t('roomSaved')); });
        }
        render();
      }, 1000);
    });
    const sens = $('sens');
    sens.value = S.sensitivity;
    sens.addEventListener('input', () => S.setSensitivity(parseFloat(sens.value)));
    const dur = $('dur');
    dur.value = S.fx.dur;
    dur.addEventListener('input', () => S.setFx('dur', parseFloat(dur.value)));
    const dens = $('dens');
    dens.value = S.fx.dens;
    dens.addEventListener('input', () => S.setFx('dens', parseFloat(dens.value)));

    const hideToggle = () => { host.style.display = host.style.display === 'none' ? '' : 'none'; };
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === 'KeyX') { e.preventDefault(); toggle(); }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === 'KeyH') { e.preventDefault(); hideToggle(); }
    }, true);
    // same shortcuts, but browser-wide via the chrome.commands API
    window.addEventListener('vc-cmd', (e) => {
      const c = e && e.detail;
      if (c === 'toggle-vanish') toggle();
      else if (c === 'hide-ui') hideToggle();
    });

    (document.body || document.documentElement).appendChild(host);
    render();
    setInterval(render, 1000);
  }

  const safeMount = () => { try { mountUI(); } catch (e) { console.error('[vanishcam] could not draw the control pill', e); } };
  if (document.body) safeMount();
  else document.addEventListener('DOMContentLoaded', safeMount);
})();
