/* ─────────────────────────────────────────────────────────────
   OWLED MEDIA · Diwali 2026 — everything you'd want to edit lives in data/.
   site.js    → brand, copy, the five numbers, stall categories, contact
   work.js    → the portfolio
   clients.js → optional per-client notes + "made for you" picks
   ───────────────────────────────────────────────────────────── */
window.OWLED = {
  brand: {
    name: 'Owled Media',
    short: 'OWLED',
    tagline: 'creative agency',
    site: 'https://www.owledmedia.com',
  },

  defaultName: 'dost',

  copy: {
    loader: '{name}, your diwali wish is on its way',
    loaderSub: 'waking up the owl…',
    // the owl is Lakshmi's vahana: on diwali night it carries the light. that's us.
    sceneHint: 'drag the flame to each diya',
    sceneHintTouch: 'drag the flame to each diya',
    sceneAuto: 'light them for me ▸',
    sceneDone: 'shubh deepavali, {name}',
    heroKick: 'from all of us at owled media',
    heroTitle: 'happy diwali, {name}',
    heroLede: 'seven months, five diyas, one very busy owl. here’s what we lit up together this year.',
    melaTitle: 'the owled mela',
    laneWelcome: 'welcome, {name}',
    huntStart: 'Keep scrolling. Each stall opens as you reach it, and a note for you is waiting at the end.',
    huntSeen: '{n} of {total} stalls visited. Your note is at the end of the lane.',
    huntFound: 'You opened your note, {name}.',
    hintTouch: 'Scroll down to walk the lane',
    hintMouse: 'Scroll down to walk the lane',
    keeperMore: 'Keep scrolling to see it all, {name}. {n} more stalls after this one, then your note.',
    keeperOne: 'Keep scrolling to see it all, {name}. One more stall after this one, then your note.',
    keeperLast: 'Last stall, {name}. Keep scrolling and your note is just past it.',
    nextStall: 'Next up: {stall}',
    nextNote: 'Next up: your note',
    hintEnd: 'Keep scrolling for the way out',
    noteFallback: 'You walked the whole lane, and this was waiting at the end. Thank you for being part of our year, {name}. This diya is yours.',
    noteSign: 'The whole nest at OWLED',
    outroTitle: 'here’s to a brighter 2027',
    outroLede: 'thank you for trusting us with your stories. let’s make the next ones even louder.',
  },

  // each diya, once lit, reveals one number. keep it to five.
  stats: [
    { value: 500000000, label: 'Views',                   suffix: '+', fmt: 'short' },
    { value: 1100,      label: 'Videos Produced Monthly', suffix: '',  fmt: 'int' },
    { value: 25,        label: 'Brands',                  suffix: '+', fmt: 'int' },
    { value: 200,       label: 'Creative Minds',          suffix: '+', fmt: 'int' },
    { value: 5,         label: 'Divisions',               suffix: '',  fmt: 'int' },
  ],

  // stall order = the order they appear in the mela. `id` must match work.js `cat`.
  stalls: [
    { id: 'hooc',      name: 'HOOC',        color: 'var(--stall-reels)' },
    { id: 'snoball',   name: 'Snoball',     color: 'var(--stall-creators)' },
    { id: 'films',     name: 'OWLED Films', color: 'var(--stall-films)' },
    { id: 'frontseat', name: 'Frontseat',   color: 'var(--stall-design)' },
    { id: 'origin',    name: 'Origin',      color: 'var(--stall-campaigns)' },
  ],

  // the sheet says campaign figures need approval before external publication.
  // while this is false, work.js view counts show on localhost only. They are still readable in the source.
  viewsApproved: false,

  contact: {
    email: 'bd@owledmedia.com',
    whatsapp: '919999999999',              // PLACEHOLDER: country code, no +
    wishText: 'Happy Diwali, Owled! 🪔 – {name}',
    instagram: 'https://instagram.com/',   // PLACEHOLDER
  },

  // optional: send link opens / stall visits to a Google Form (see README → "Tracking").
  // leave form empty to switch tracking off entirely.
  track: {
    form: '',
    fields: { name: 'entry.000000001', client: 'entry.000000002', event: 'entry.000000003', detail: 'entry.000000004' },
  },
};
