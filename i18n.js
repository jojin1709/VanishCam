// VanishCam: UI strings, en / de / es. Follows the browser language.
(() => {
  'use strict';
  const S = (window.__snap = window.__snap || {});

  const DICT = {
    en: {
      cap: 'capture empty room',
      vanish: 'vanish / return',
      sens: 'snap sensitivity',
      dur: 'dissolve duration',
      dens: 'particle amount',
      micOn: 'mic: on',
      micOff: 'mic: off',
      forget: 'forget saved room',
      hint: 'Step out of frame, press capture, wait 3 seconds. Then snap. Ctrl or Cmd + Shift + X also works. Ctrl or Cmd + Shift + H hides this. Turn off Meet\u2019s own video effects \u2014 they break the mask.',
      waitCam: 'snap: waiting for camera',
      needRoom: 'snap: capture the room',
      armed: 'armed',
      gone: 'vanished',
      vanishing: 'vanishing',
      returning: 'returning',
      stepOut: 'step out... ',
      saving: 'saving the room...',
      roomSaved: 'room saved',
      noCam: 'no camera yet',
      needRoomFlash: 'capture the room first',
      micDead: 'snap sound off, use the button',
      micReleased: 'mic released',
      camReopen: 'camera reopened \u2014 recapture if lighting changed',
      roomLoaded: 'saved room loaded',
      roomForgotten: 'saved room forgotten',
      busy: 'busy'
    },
    de: {
      cap: 'leeren raum aufnehmen',
      vanish: 'verschwinden / zurück',
      sens: 'snap-empfindlichkeit',
      dur: 'auflösungsdauer',
      dens: 'partikelmenge',
      micOn: 'mikro: an',
      micOff: 'mikro: aus',
      forget: 'gespeicherten raum löschen',
      hint: 'Bild verlassen, aufnehmen drücken, 3 Sekunden warten. Dann schnipsen. Strg oder Cmd + Shift + X funktioniert auch. Strg oder Cmd + Shift + H verbirgt das. Meet-videoeffekte ausschalten \u2014 sie zerstören die maske.',
      waitCam: 'snap: warte auf kamera',
      needRoom: 'snap: raum aufnehmen',
      armed: 'bereit',
      gone: 'verschwunden',
      vanishing: 'verschwinde',
      returning: 'komme zurück',
      stepOut: 'raum verlassen... ',
      saving: 'raum wird gespeichert...',
      roomSaved: 'raum gespeichert',
      noCam: 'noch keine kamera',
      needRoomFlash: 'erst den raum aufnehmen',
      micDead: 'snap-ton aus, nutze den knopf',
      micReleased: 'mikro freigegeben',
      camReopen: 'kamera neu gestartet — bei bedarf raum neu aufnehmen',
      roomLoaded: 'gespeicherter raum geladen',
      roomForgotten: 'gespeicherter raum vergessen',
      busy: 'beschäftigt'
    },
    es: {
      cap: 'capturar sala vacía',
      vanish: 'desaparecer / volver',
      sens: 'sensibilidad del snap',
      dur: 'duración de disolución',
      dens: 'cantidad de partículas',
      micOn: 'mic: sí',
      micOff: 'mic: no',
      forget: 'olvidar sala guardada',
      hint: 'Sal del encuadre, pulsa capturar, espera 3 segundos. Luego chasquea los dedos. Ctrl o Cmd + Shift + X también funciona. Ctrl o Cmd + Shift + H lo oculta. Apaga los efectos de vídeo de Meet: rompen la máscara.',
      waitCam: 'snap: esperando cámara',
      needRoom: 'snap: captura la sala',
      armed: 'listo',
      gone: 'desaparecido',
      vanishing: 'desapareciendo',
      returning: 'volviendo',
      stepOut: 'sal de cuadro... ',
      saving: 'guardando la sala...',
      roomSaved: 'sala guardada',
      noCam: 'aún no hay cámara',
      needRoomFlash: 'primero captura la sala',
      micDead: 'sonido de snap apagado, usa el botón',
      micReleased: 'mic liberado',
      camReopen: 'cámara reiniciada — recaptura si cambió la luz',
      roomLoaded: 'sala guardada cargada',
      roomForgotten: 'sala guardada olvidada',
      busy: 'ocupado'
    }
  };

  const lang = (navigator.language || 'en').slice(0, 2).toLowerCase();
  S.lang = DICT[lang] ? lang : 'en';
  S.t = (k) => (DICT[S.lang] && DICT[S.lang][k]) || DICT.en[k] || k;
})();
