export const icons = {
  crop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M6 2v4M6 10v12M2 6h4M10 6h12M18 22v-4M18 14V2M22 18h-4M14 18H2"/>
  </svg>`,

  rotate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
  </svg>`,

  transform: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
    <circle cx="15" cy="9" r="1.5" fill="currentColor"/>
    <circle cx="9" cy="15" r="1.5" fill="currentColor"/>
    <circle cx="15" cy="15" r="1.5" fill="currentColor"/>
  </svg>`,

  brush: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M18.37 2.63L14 7l-1.59-1.59a2 2 0 00-2.82 0L8 7l9 9 1.59-1.59a2 2 0 000-2.82L17 10l4.37-4.37a2.12 2.12 0 10-3-3z"/>
    <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/>
  </svg>`,

  text: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
  </svg>`,

  shapes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="3" width="7" height="7"/>
    <circle cx="17.5" cy="6.5" r="4.5"/>
    <path d="M14 14l3.5 7 3.5-7z"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>`,

  filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>`,

  adjust: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>`,

  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5"/>
    <path d="M2 12l10 5 10-5"/>
  </svg>`,

  undo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M3 7v6h6"/>
    <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/>
  </svg>`,

  redo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 7v6h-6"/>
    <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"/>
  </svg>`,

  zoomIn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/>
  </svg>`,

  zoomOut: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21l-4.35-4.35M8 11h6"/>
  </svg>`,

  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <path d="M7 10l5 5 5-5M12 15V3"/>
  </svg>`,

  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <path d="M17 8l-5-5-5 5M12 3v12"/>
  </svg>`,

  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>`,

  eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>`,

  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
  </svg>`,

  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>`,

  flipH: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 3v18M16 7l4 5-4 5M8 7L4 12l4 5"/>
  </svg>`,

  flipV: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M3 12h18M7 8L12 4l5 4M7 16l5 4 5-4"/>
  </svg>`,

  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>`,

  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M20 6L9 17l-5-5"/>
  </svg>`,

  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 5v14M5 12h14"/>
  </svg>`,

  minus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M5 12h14"/>
  </svg>`,

  magic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M12 3l1 3-3 1 3 1-1 3 3-1 1 3 1-3 3 1-1-3 3-1-3-1 1-3-3 1z"/>
    <path d="M4 19l3-3M5.5 21L3 18.5M9 14l-6 6"/>
  </svg>`,

  image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <path d="M21 15l-5-5L5 21"/>
  </svg>`,

  select: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
    <path d="M13 13l6 6"/>
  </svg>`,
};
