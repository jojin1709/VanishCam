// VanishCam: finger snap detector.
// Listens to the microphone (raw, without the browser's noise suppression,
// which would eat the click) and looks for a short sharp high frequency burst.
// Uses an AudioWorklet when the page allows it, and falls back to the older
// ScriptProcessor otherwise. The mic track is only held while listening is on.
(() => {
  'use strict';
  const S = (window.__snap = window.__snap || {});

  S.sensitivity = 9; // multiplier over the room noise floor, lower = more sensitive
  try {
    const saved = parseFloat(localStorage.getItem('snap.sens'));
    if (saved >= 2 && saved <= 20) S.sensitivity = Math.max(saved, 7);
  } catch (e) { /* storage can be blocked */ }

  S.setSensitivity = (v) => {
    S.sensitivity = v;
    try { localStorage.setItem('snap.sens', String(v)); } catch (e) { /* ignore */ }
  };

  const WORKLET_SRC = `
    class VCSnap extends AudioWorkletProcessor {
      process(inputs) {
        const d = inputs[0] && inputs[0][0];
        if (d && d.length) {
          let s = 0;
          for (let i = 0; i < d.length; i++) s += d[i] * d[i];
          this.port.postMessage(Math.sqrt(s / d.length));
        }
        return true;
      }
    }
    registerProcessor('vc-snap', VCSnap);
  `;

  S.startSnapDetector = async function (getUserMedia, onSnap) {
    if (S._mic) return S._mic;

    const stream = await getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    });
    const AC = window.AudioContext || window.webkitAudioContext;
    const ac = new AC();
    const src = ac.createMediaStreamSource(stream);
    const hp = ac.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 2500;
    const mute = ac.createGain();
    mute.gain.value = 0;

    let floor = 0.004;
    let state = 'idle';
    let peak = 0, t0 = 0, lastFire = 0, stopped = false;
    const MIN_ABS = 0.022;
    let prev = 0, prev2 = 0;

    function step(rms, now) {
      if (now - lastFire < 2500) { state = 'idle'; return; }
      const trigger = Math.max(floor * S.sensitivity, MIN_ABS);
      if (state === 'idle') {
        // a snap starts suddenly: the sound just before it must be quiet
        if (rms > trigger) {
          if (prev < trigger * 0.4 && prev2 < trigger * 0.4) { state = 'burst'; peak = rms; t0 = now; }
          else state = 'long';
        } else floor = floor * 0.98 + rms * 0.02;
      } else if (state === 'long') {
        // a long or gradual sound (speech, hiss, knocks): ignore until quiet again
        if (rms < trigger * 0.5) state = 'idle';
      } else {
        peak = Math.max(peak, rms);
        const dur = now - t0;
        if (dur > 140) state = 'long';                       // too long to be a snap
        else if (rms < peak * 0.3 && dur >= 8) {             // burst ended quickly
          state = 'idle';
          lastFire = now;
          try { onSnap({ peak, dur }); } catch (err) { console.warn('[vanishcam]', err); }
        }
      }
    }

    function feed(rms, now) {
      if (stopped) return;
      step(rms, now);
      prev2 = prev;
      prev = rms;
    }

    // sample the way the old 512-sample buffers did, ~10 ms at a time
    let acc = 0, cnt = 0, last = 0;
    const onRms = (rms, now) => {
      acc += rms;
      cnt++;
      if (now - last >= 10) {
        feed(acc / cnt, now);
        acc = 0;
        cnt = 0;
        last = now;
      }
    };

    let node = null;
    if (ac.audioWorklet && typeof AudioWorkletNode === 'function') {
      try {
        const url = URL.createObjectURL(new Blob([WORKLET_SRC], { type: 'application/javascript' }));
        await ac.audioWorklet.addModule(url);
        URL.revokeObjectURL(url);
        node = new AudioWorkletNode(ac, 'vc-snap');
        node.port.onmessage = (e) => { onRms(e.data, performance.now()); };
        src.connect(hp);
        hp.connect(node);
        node.connect(mute);
        mute.connect(ac.destination);
      } catch (e) {
        console.warn('[vanishcam] audio worklet unavailable, using script processor', e);
        node = null;
      }
    }
    if (!node) {
      // ScriptProcessor is old but it needs no extra files, so Meet's page
      // security rules cannot block it
      const sp = ac.createScriptProcessor(512, 1, 1);
      sp.onaudioprocess = (e) => {
        const buf = e.inputBuffer.getChannelData(0);
        let s = 0;
        for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i];
        feed(Math.sqrt(s / buf.length), performance.now());
      };
      src.connect(hp);
      hp.connect(sp);
      sp.connect(mute);
      mute.connect(ac.destination);
      node = sp;
    }

    const resume = () => { if (ac.state !== 'running') ac.resume().catch(() => {}); };
    ['pointerdown', 'keydown', 'click'].forEach((ev) => window.addEventListener(ev, resume, true));
    resume();

    const handle = { ac, stream, node, src, mute, get stopped() { return stopped; } };
    S._mic = handle;
    return handle;
  };

  // Give the microphone back: stops the track, disconnects and closes the context.
  S.stopSnapDetector = function () {
    const h = S._mic;
    if (!h) return false;
    S._mic = null;
    try { h.stream.getTracks().forEach((t) => t.stop()); } catch (e) { /* ignore */ }
    try { h.node.disconnect(); } catch (e) { /* ignore */ }
    try { h.src.disconnect(); } catch (e) { /* ignore */ }
    try { h.mute.disconnect(); } catch (e) { /* ignore */ }
    try { h.ac.close(); } catch (e) { /* ignore */ }
    return true;
  };

  S.micRunning = function () { return !!S._mic; };
})();
