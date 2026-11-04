/* the mela: one continuous scroll. the owl walks to a stall, the stall opens, scrolling runs through all its work,
   the stall closes, the owl walks on. past the last stall the owl reaches an envelope, and the guest's note rises out of it.
   everything on screen is worked out from one number: how far down the lane's scroll you are (M.t). */
(() => {
'use strict';
const { S, guest, fill, fmt, play, track, store, reduced, clamp, lerp, coarse } = window.OW;
const A = window.OWArt, C = S.copy;
const $ = s => document.querySelector(s);
const WORK = window.OWLED_WORK || [];
const STALLS = S.stalls.filter(s => WORK.some(w => w.cat === s.id));
const ART = { reels: 'rangoli', films: 'talkies', campaigns: 'patakhe', creators: 'chaupal', design: 'dukaan' };
const listOf = id => WORK.filter(w => w.cat === id);
const brandsOf = id => [...new Set(listOf(id).map(w => w.client))];
const range = n => Array.from({ length: n }, (_, i) => i);
const smooth = t => t * t * (3 - 2 * t);

/* ── words ── */
function keeperLine(i) {
  const left = STALLS.length - 1 - i;
  return fill(left > 1 ? C.keeperMore : left === 1 ? C.keeperOne : C.keeperLast).replace('{n}', left);
}
function words() {
  $('#outroT').textContent = fill(C.outroTitle); $('#outroL').textContent = C.outroLede;
  $('#footBrand').textContent = S.brand.name; $('#footTag').textContent = S.brand.tagline;
  const K = S.contact;
  $('#wishWa').href = `https://wa.me/${K.whatsapp}?text=${encodeURIComponent(fill(K.wishText))}`;
  $('#mailBtn').href = `mailto:${K.email}?subject=${encodeURIComponent('Diwali hello from ' + guest.first)}`;
  const sub = document.getElementById('gateSub'); if (sub) sub.textContent = fill(C.laneWelcome);
  const c = guest.client;
  $('#lTo').textContent = `${guest.first},`;
  $('#lBody').textContent = fill((c && c.note) || C.noteFallback);
  $('#lSign').textContent = C.noteSign;
  shops.forEach((s, i) => { s.say.textContent = keeperLine(i); });
}

/* ── which stalls they've visited, remembered per guest ── */
const huntKey = () => `ow:hunt:${guest.clientId}:${guest.first.toLowerCase()}`;
function loadHunt() { try { return Object.assign({ seen: [], found: false }, JSON.parse(store.get(huntKey()) || '{}')); } catch (e) { return { seen: [], found: false }; } }
let hunt = loadHunt();
const saveHunt = () => store.set(huntKey(), JSON.stringify(hunt));
window.addEventListener('ow:named', () => { hunt = loadHunt(); words(); renderHud(); });

/* ── a work card ── */
function cover(w) {
  const c = document.createElement('div'); c.className = 'cov';
  if (w.thumb) { const i = document.createElement('img'); i.src = w.thumb; i.alt = ''; i.decoding = 'async'; c.appendChild(i); }
  else {
    const g = document.createElement('div'); g.className = 'cover-gen'; g.style.setProperty('--c', (STALLS.find(s => s.id === w.cat) || {}).color || 'var(--tint)');
    const t = document.createElement('span'); t.className = 't'; t.textContent = w.title;
    const p = document.createElement('span'); p.className = 'play'; p.textContent = w.cat === 'design' ? '✦' : '▶';
    g.append(p, t); c.appendChild(g);
  }
  const pf = document.createElement('span'); pf.className = 'pf'; pf.textContent = w.platform; c.appendChild(pf);
  return c;
}
function card(w, list) {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'wk';
  b.setAttribute('aria-label', `${w.title}, ${w.client}${w.views ? ', ' + fmt(w.views) + ' views' : ''}`);
  const m = document.createElement('div'); m.className = 'meta';
  const t = document.createElement('b'); t.textContent = w.client;
  const row = document.createElement('span'); row.textContent = [w.month, w.views ? `${fmt(w.views)} views` : ''].filter(Boolean).join(', ');
  m.append(t, row); b.append(cover(w), m);
  b.addEventListener('click', () => openModal(list, list.indexOf(w)));
  return b;
}

/* ── build the lane: a shop and its panel for every stall ── */
const endcard = $('#endcard'), paper = $('#paper'), dim = $('#stageDim');
const stage = $('#stage'), lane = $('#lane'), world = $('#world'), far = $('#far'), fore = $('#fore'), walker = $('#walker'), pool = $('.pool');
walker.innerHTML = A.WALKER;
document.body.insertAdjacentHTML('afterbegin', A.SHOP_GLOW);

const shops = STALLS.map((s, i) => {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'shop'; b.style.setProperty('--c', s.color);
  b.setAttribute('aria-label', `Go to ${s.name}: ${s.sub}. ${listOf(s.id).length} pieces.`);
  b.innerHTML = A.frame(s.name, brandsOf(s.id), A.SHOPS[ART[s.id]]());
  b.addEventListener('click', () => goTo(i));

  const list = listOf(s.id), next = STALLS[i + 1];
  const el = document.createElement('section'); el.className = 'shop-in'; el.style.setProperty('--c', s.color); el.setAttribute('aria-label', s.name); el.style.visibility = 'hidden';
  el.innerHTML = '<div class="shop-aw" aria-hidden="true"></div><div class="shop-prog" aria-hidden="true"><i></i></div><button class="shop-x" type="button" aria-label="Skip to the next stall">×</button>' +
    '<div class="shop-wrap"><div class="shop-body"><h2></h2><p class="shop-sub"></p><div class="keeper"><span class="keeper-owl" aria-hidden="true"></span><p class="keeper-say"></p></div><div class="grid"></div><p class="shop-next"></p></div></div>';
  el.querySelector('h2').textContent = s.name;
  el.querySelector('.shop-sub').textContent = `${s.sub}, for ${brandsOf(s.id).join(', ')}.`;
  el.querySelector('.keeper-owl').innerHTML = A.KEEPER.replace(/kp(?=[BG])/g, `kp${i}`);
  el.querySelector('.shop-next').textContent = next ? fill(C.nextStall).replace('{stall}', next.name) : C.nextNote;
  const grid = el.querySelector('.grid'); grid.classList.toggle('wide', list.every(w => !w.tall)); grid.append(...list.map(w => card(w, list)));
  el.querySelector('.shop-x').addEventListener('click', () => { play('tap'); skip(i); });
  // keyboard: tabbing to a piece scrolls the lane to it
  el.addEventListener('focusin', e => {
    const wk = e.target.closest && e.target.closest('.wk'); if (!wk || !M.tabbing) return;
    const o = shops[i];
    scrollTo(0, L.top + o.b0 + clamp(wk.offsetTop - 16, 0, o.over));
  });
  stage.appendChild(el);
  return { el: b, stall: s, x: 0, near: -1, panel: el, wrap: el.querySelector('.shop-wrap'), body: el.querySelector('.shop-body'), bar: el.querySelector('.shop-prog i'), say: el.querySelector('.keeper-say'), over: 0, pr: -1, off: -1 };
});
const hudBtns = STALLS.map((s, i) => {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'hd'; b.setAttribute('aria-label', `Go to ${s.name}`);
  b.addEventListener('click', () => goTo(i)); $('#hudDiyas').appendChild(b); return b;
});

const gate = document.createElement('div'); gate.className = 'arch'; gate.innerHTML = A.arch(C.melaTitle, fill(C.laneWelcome), 'gate');
const ground = document.createElement('div'); ground.className = 'ground';
const props = A.PROPS.concat(A.PROPS[0]).slice(0, Math.max(0, STALLS.length)).map(p => { const d = document.createElement('div'); d.className = 'prop'; d.innerHTML = p; return d; });
world.append(ground, gate, ...props, ...shops.map(s => s.el));

const fars = [['wheel', 0.42, A.wheel()], ['t', 0.07, A.tent('#cf1134')], ['t', 0.2, A.tent('#f4bd45')], ['wheel', 0.82, A.wheel()], ['t', 0.6, A.tent('#ff8e3c')], ['t', 0.71, A.tent('#cf1134')], ['t', 0.97, A.tent('#aa94ff')]]
  .map(([k, at, html]) => { const d = document.createElement('div'); d.innerHTML = html; far.appendChild(d); return { k, at, el: d }; });

/* ── sizes, and the timeline: walk, open, browse, close, for each stall, then the note ── */
const L = { W: 0, H: 0, top: 0, start: 0, spacing: 0, shopW: 0, cam: null, end: 0, tNote: 0, reveal: 0, hold: 0, total: 0, wide: false };
function measure() {
  const W = stage.clientWidth, H = stage.clientHeight, groundH = Math.round(H * .22);
  const shopH = Math.min(H - groundH - 130, 470), shopW = Math.min(W * .88, shopH * 360 / 420);
  const spacing = Math.max(shopW * 1.45, Math.min(W * 1.22, 620));
  const start = W / 2, owlW = Math.min(H * .15, 108), base = groundH - 8;
  shops.forEach((s, i) => {
    s.x = start + spacing * (i + 1);
    Object.assign(s.el.style, { left: `${s.x - shopW / 2}px`, width: `${shopW}px`, bottom: `${base}px` });
  });
  const end = shops[shops.length - 1].x + spacing;
  const archW = Math.min(W * .94, (H - groundH - 112) * .8);
  Object.assign(gate.style, { left: `${start - archW / 2}px`, width: `${archW}px`, bottom: `${base}px` });
  const propW = Math.min(spacing - shopW - 16, shopW * .42);
  props.forEach((p, i) => { const x = start + spacing * (i + .5); Object.assign(p.style, { left: `${x - propW / 2}px`, width: `${propW}px`, bottom: `${base}px` }); });
  const worldW = end + W;
  world.style.width = `${worldW}px`;
  Object.assign(ground.style, { width: `${worldW}px`, height: `${groundH}px` });
  fars.forEach(f => { const w = f.k === 'wheel' ? Math.min(W * .62, 300) : Math.min(W * .36, 200); Object.assign(f.el.style, { left: `${f.at * (worldW * .25 + W) - w / 2}px`, width: `${w}px`, bottom: `${groundH - 6}px` }); });
  const seg = 520, n = Math.ceil(worldW / seg) + 1; fore.innerHTML = range(n).map(i => `<div style="left:${i * seg}px;top:${Math.round(H * .13)}px">${A.lights(seg)}</div>`).join('');
  const owlBottom = Math.round(groundH * .36), owlTop = owlBottom + owlW * 262 / 200;
  Object.assign(walker.style, { width: `${owlW}px`, bottom: `${owlBottom}px` });
  // short screens need the room, so the note covers the owl there
  Object.assign(endcard.style, { top: `${$('.hud').offsetHeight + 2}px`, bottom: `${H < 720 ? 58 : Math.round(owlTop) + 4}px` });

  // the timeline, in scroll pixels. browsing is 1:1, so the reels move with your finger
  const openLen = Math.round(H * .24), pad = 50;
  let t = 0, x = start;
  shops.forEach(s => {
    s.over = Math.max(0, s.body.offsetHeight - s.wrap.clientHeight);
    s.x0 = x; s.walk0 = t; s.walk1 = t + (s.x - x);
    s.open1 = s.walk1 + openLen; s.b0 = s.open1 + pad; s.b1 = s.b0 + s.over; s.close0 = s.b1 + pad; s.close1 = s.close0 + openLen;
    t = s.close1; x = s.x;
  });
  const tNote = t + (end - x), reveal = Math.round(H * .75), hold = Math.round(H * .8);
  Object.assign(L, { W, H, start, spacing, shopW, end, tNote, reveal, hold, total: tNote + reveal + hold, cam: null, wide: W >= 900 });
  lane.style.height = `${L.total + H}px`;
  L.top = lane.getBoundingClientRect().top + scrollY;
  shops.forEach(s => { s.pr = -1; s.off = -1; });
}
function xAt(t) {
  for (const s of shops) { if (t <= s.walk1) return s.x0 + (t - s.walk0); if (t <= s.close1) return s.x; }
  const last = shops[shops.length - 1];
  return Math.min(L.end, last.x + (t - last.close1));
}
function panelAt(s, t) {
  if (t <= s.walk1 || t >= s.close1) return 0;
  return smooth(Math.min(clamp((t - s.walk1) / (s.open1 - s.walk1)), clamp((s.close1 - t) / (s.close1 - s.close0))));
}

/* ── each frame ── */
const M = { tabbing: false, t: 0, x: 0, phase: 0, walking: false, here: -1, shown: false, auto: null, keep: null, onscreen: false, active: -1, activePr: 0, pp: -1, rustled: false, atEnd: false };
function frame() {
  requestAnimationFrame(frame);
  if (!M.onscreen || !L.W) return;
  const target = clamp(scrollY - L.top, 0, L.total);
  M.t = reduced ? target : lerp(M.t, target, .16); if (Math.abs(target - M.t) < .4) M.t = target;

  const prev = M.x; M.x = xAt(M.t);
  const d = M.x - prev, moving = Math.abs(d) > .35;
  if (moving !== M.walking) { M.walking = moving; walker.classList.toggle('walking', moving); }
  if (Math.abs(d) > .5) walker.classList.toggle('left', d < 0);
  if (moving) { M.phase += Math.abs(d); if (M.phase > 74) { M.phase = 0; play('step'); } }

  updatePanels();
  const shift = L.wide ? L.W * .24 * M.activePr : 0;   // wide screens: the stall slides left to make room for its panel
  const cam = Math.round((M.x - L.W / 2 + shift) * 10) / 10;
  if (cam !== L.cam) {
    L.cam = cam;
    const off = `calc(-50% - ${shift.toFixed(1)}px)`; walker.style.transform = `translateX(${off})`; pool.style.transform = `translateX(${off})`;
    world.style.transform = `translate3d(${-cam}px,0,0)`;
    far.style.transform = `translate3d(${-cam * .25}px,0,0)`;
    fore.style.transform = `translate3d(${-cam * .85}px,0,0)`;
    updateNear();
  }
  updateCard();
}
function updatePanels() {
  let active = -1, activePr = 0;
  shops.forEach((s, i) => {
    let pr = panelAt(s, M.t);
    if (M.auto && M.keep && !M.keep.has(i)) pr = 0;   // jumping along the lane: don't flash the stalls in between
    if (pr > 0) { active = i; activePr = pr; }
    if (pr !== s.pr) {
      s.pr = pr;
      s.panel.style.visibility = pr > 0 ? 'visible' : 'hidden';
      s.panel.style.transform = L.wide ? `translateX(${((1 - pr) * 104).toFixed(2)}%)` : `translateY(${((1 - pr) * 104).toFixed(2)}%)`;
      s.panel.inert = pr < .5;
    }
    if (pr > 0) {
      const off = clamp(M.t - s.b0, 0, s.over);
      if (off !== s.off) { s.off = off; s.body.style.transform = `translate3d(0,${-off.toFixed(1)}px,0)`; s.bar.style.transform = `scaleX(${(s.over ? off / s.over : 1).toFixed(3)})`; }
    }
  });
  if (active !== M.active) {
    if (active >= 0) {
      play('open');
      const id = STALLS[active].id;
      if (!hunt.seen.includes(id)) { hunt.seen.push(id); saveHunt(); renderHud(); track('stall', id); }
    }
    M.active = active;
  }
  M.activePr = activePr;
  dim.style.opacity = (activePr * .45).toFixed(3);
}
/* the note: once the owl arrives, scrolling opens the envelope and the note rises out of it */
function updateCard() {
  const dist = L.end - M.x, p = clamp((M.t - L.tNote) / L.reveal);
  endcard.style.visibility = dist > L.W * .8 ? 'hidden' : 'visible';
  endcard.style.transform = `translateX(${dist.toFixed(1)}px)`;
  const flap = smooth(clamp(p / .3)), pp = smooth(clamp((p - .22) / .68));
  $('#envFlap').style.transform = `rotateX(${(flap * 180).toFixed(1)}deg)`;
  if (pp === M.pp) return;
  M.pp = pp;
  paper.style.transform = `translateY(${((1 - pp) * -34).toFixed(1)}px) scale(${(.27 + .73 * pp).toFixed(3)})`;
  paper.style.opacity = clamp(pp * 30);
  paper.style.visibility = pp > 0 ? 'visible' : 'hidden';
  const open = pp > .96; paper.inert = !open; paper.style.pointerEvents = open ? 'auto' : 'none';
  const envOut = clamp((pp - .48) / .26);
  [$('#envBack'), $('#envFront')].forEach(e => { e.style.opacity = 1 - envOut; e.style.transform = `translateX(-50%) translateY(${(envOut * 40).toFixed(1)}px)`; });
  $('#endDim').style.opacity = pp * .62;
  if (pp > .03 && !M.rustled) { M.rustled = true; play('paper'); }
  if (pp < .01) M.rustled = false;
  if (pp >= .99 && !hunt.found) { hunt.found = true; saveHunt(); renderHud(); play('win'); track('found', guest.clientId); }
  const atEnd = pp >= .99;
  if (atEnd !== M.atEnd) { M.atEnd = atEnd; const h = $('#walkHint'); h.textContent = atEnd ? C.hintEnd : (coarse ? C.hintTouch : C.hintMouse); h.classList.toggle('gone', !atEnd && M.shown); }
}
function updateNear() {
  let here = -1;
  shops.forEach((s, i) => {
    const dist = Math.abs(M.x - s.x);
    const near = Math.round(clamp(1 - (dist - L.shopW * .35) / (L.spacing * .62)) * 25) / 25;
    if (near !== s.near) { s.near = near; s.el.style.setProperty('--near', near); }
    const on = dist < L.shopW * .52; s.el.classList.toggle('here', on); if (on) here = i;
  });
  if (here !== M.here) { M.here = here; hudBtns.forEach((b, i) => b.classList.toggle('at', i === here)); }
  const moved = M.x - L.start > 40;
  if (moved !== M.shown) { M.shown = moved; if (!M.atEnd) $('#walkHint').classList.toggle('gone', moved); }
}
new IntersectionObserver(es => { M.onscreen = es[0].isIntersecting; }).observe(stage);

/* ── jumping along the lane: tap a shop or a little diya, skip a stall ── */
function jump(t, keep) {
  cancelJump();
  const toY = L.top + t, fromY = scrollY, dist = Math.abs(toY - fromY);
  const dur = reduced ? 1 : clamp(dist * .5, 300, 1600), t0 = performance.now();
  const token = {}; M.auto = token; M.keep = new Set(keep);
  const step = now => {
    if (M.auto !== token) return;
    const k = clamp((now - t0) / dur), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    scrollTo(0, fromY + (toY - fromY) * e);
    if (k < 1) requestAnimationFrame(step); else M.auto = null;
  };
  requestAnimationFrame(step);
}
const cancelJump = () => { M.auto = null; };
['wheel', 'touchstart'].forEach(ev => addEventListener(ev, cancelJump, { passive: true }));
const goTo = i => jump(shops[i].b0, [i, M.active]);
const skip = i => jump(shops[i].close1 + 2, [i]);
addEventListener('keydown', e => { M.tabbing = e.key === 'Tab'; }, true);
addEventListener('pointerdown', () => { M.tabbing = false; }, true);

/* drag sideways to walk, on touch and mouse */
let dragX = null, dragMoved = false;
stage.addEventListener('pointerdown', e => { if (e.button) return; dragX = e.clientX; dragMoved = false; cancelJump(); });
addEventListener('pointermove', e => {
  if (dragX == null) return; const dx = e.clientX - dragX;
  if (!dragMoved && Math.abs(dx) < 8) return;
  dragMoved = true; stage.classList.add('drag'); scrollBy(0, -dx * 1.3); dragX = e.clientX;
});
const endDrag = () => { dragX = null; stage.classList.remove('drag'); setTimeout(() => { dragMoved = false; }, 0); };
addEventListener('pointerup', endDrag); addEventListener('pointercancel', endDrag);
stage.addEventListener('wheel', e => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); scrollBy(0, e.deltaX); } }, { passive: false });
// a drag isn't a tap. and tapping outside an open stall moves on to the next one
stage.addEventListener('click', e => {
  if (dragMoved) { e.stopPropagation(); e.preventDefault(); return; }
  if (M.active >= 0 && M.activePr > .6 && !e.target.closest('.shop-in, .hud')) { e.stopPropagation(); e.preventDefault(); play('tap'); skip(M.active); }
}, true);

/* arrow keys walk the lane */
const keys = { dir: 0 };
const inLane = () => scrollY >= L.top - 4 && scrollY <= L.top + L.total + 4;
(function keyLoop() { requestAnimationFrame(keyLoop); if (keys.dir) scrollBy(0, keys.dir * 9); })();
addEventListener('keydown', e => {
  if (!modal.hidden || document.body.classList.contains('locked') || !inLane()) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); cancelJump(); keys.dir = e.key === 'ArrowRight' ? 1 : -1; }
  if (e.key === 'Escape' && M.active >= 0) skip(M.active);
});
addEventListener('keyup', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') keys.dir = 0; });

/* ── the hud ── */
function renderHud() {
  hudBtns.forEach((b, i) => b.classList.toggle('seen', hunt.seen.includes(STALLS[i].id)));
  const n = hunt.seen.length;
  $('#huntMsg').textContent = hunt.found ? fill(C.huntFound) : n ? fill(C.huntSeen).replace('{n}', n).replace('{total}', STALLS.length) : C.huntStart;
}
$('#walkHint').textContent = coarse ? C.hintTouch : C.hintMouse;

/* ── the work viewer ── */
const modal = $('#modal'); let mList = [], mI = 0, lastFocus = null;
function showWork() {
  const w = mList[mI], s = STALLS.find(x => x.id === w.cat) || {};
  const cv = $('#mCover'); cv.replaceChildren(cover(w)); cv.firstChild.style.height = '100%';
  $('#mKick').textContent = s.name || '';
  $('#mTitle').textContent = w.title;
  $('#mMeta').textContent = [w.client, w.platform, w.month, w.views ? fmt(w.views) + ' views' : ''].filter(Boolean).join(', ');
  $('#mBlurb').textContent = w.blurb || '';
  const a = $('#mWatch'); a.hidden = !w.link; if (w.link) a.href = w.link;
  const multi = mList.length > 1; $('#mPrev').hidden = !multi; $('#mNext').hidden = !multi;
}
function openModal(list, i) {
  mList = list; mI = i; lastFocus = document.activeElement; showWork();
  modal.hidden = false; document.body.style.overflow = 'hidden'; $('#mX').focus({ preventScroll: true }); play('open'); track('work', list[i].id);
}
function closeModal() { modal.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus({ preventScroll: true }); }
const stepM = d => { mI = (mI + d + mList.length) % mList.length; showWork(); play('tap'); };
$('#mX').addEventListener('click', closeModal);
$('#mPrev').addEventListener('click', () => stepM(-1));
$('#mNext').addEventListener('click', () => stepM(1));
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
let sx = null; modal.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
modal.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50 && mList.length > 1) stepM(dx < 0 ? 1 : -1); sx = null; });
addEventListener('keydown', e => {
  if (modal.hidden) return;
  if (e.key === 'Escape') closeModal(); else if (e.key === 'ArrowLeft') stepM(-1); else if (e.key === 'ArrowRight') stepM(1);
});

/* ── the note's picks ── */
function renderPicks() {
  const c = guest.client, picks = ((c && c.picks) || []).map(id => WORK.find(w => w.id === id)).filter(Boolean);
  $('#lPicks').hidden = !picks.length;
  $('#lPickList').replaceChildren(...picks.map(w => { const b = document.createElement('button'); b.type = 'button'; b.textContent = w.title; b.addEventListener('click', () => openModal(picks, picks.indexOf(w))); return b; }));
}

/* ── footer ticker + outro ── */
const TICK = ['shubh deepavali', 'more views, more diyas', 'owled it', 'saal mubarak', 'see you in 2027', 'happy diwali from the whole nest'];
$('#tick').innerHTML = TICK.concat(TICK).map(t => `<span>${t}</span>`).join('');
$('#replay').addEventListener('click', () => { play('tap'); window.OWScene && window.OWScene.replay(); });

window.OWMela = {
  enter() { scrollTo({ top: L.top, behavior: reduced ? 'auto' : 'smooth' }); },
  timeline: () => ({ top: L.top, tNote: L.tNote, reveal: L.reveal, total: L.total, stalls: shops.map(s => ({ walk1: s.walk1, b0: s.b0, b1: s.b1, close1: s.close1, over: s.over })) }),
};

/* ── go ── */
words(); renderPicks(); renderHud(); measure(); M.x = L.start; updateNear(); updateCard(); requestAnimationFrame(frame);
let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(measure, 120); });
if (document.fonts) document.fonts.ready.then(measure);
})();
