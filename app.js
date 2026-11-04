'use strict';

/* ==========================================================================
   app.js – v6
   Start: morgen. Sieben Tage am Stück. Pro Tag drei Vorschläge, „Neu würfeln“,
   oder ein eigenes Gericht. Heute bleibt, wie es geplant ist.
   Daraus abgeleitet: PDF mit Tagesplan (Gramm pro Person) + Einkaufsliste.
   ========================================================================== */

/* ----- Konstanten ----- */
const STATE_KEY = 'mensa.v6.state';
const WINDOW_DAYS = 7;
const MAX_PERSONS = 5;
const REF_PROTEIN_G = 45;
const BUILDER_BASE_G = { carb: 100, veggie: 150, salad: 60, booster: 40 };
const DAY_NAMES = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const DAY_SHORT = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const MONTHS = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'];
const PERSON_COLORS = ['#2BB673', '#F5A524', '#5B8DEF', '#E8609A', '#8B6CEF'];
const ABSENCE_KEYWORDS = ['weg', 'abwesend', 'geschäft', 'dienstreise', 'urlaub', 'auswärts', 'nicht da', 'reise', 'unterwegs'];

const GOALS = {
  muskel: { label: 'Muskelaufbau / High Protein', factor: 0.80 },
  erhalt: { label: 'Normal / Erhalt', factor: 0.45 },
  defizit: { label: 'Defizit', factor: 0.65 }
};

const LIKE_OPTIONS = [
  { key: 'huhn', label: 'Hähnchen' }, { key: 'lachs', label: 'Lachs' }, { key: 'rind', label: 'Rinderhack' },
  { key: 'garnele', label: 'Garnelen' }, { key: 'vegetarisch', label: 'Vegetarisch' }
];

const NOGO_OPTIONS = [
  { key: 'pilze', label: 'Keine Pilze', test: r => r.tags.includes('pilze') },
  { key: 'fisch', label: 'Kein Fisch / Meeresfrüchte', test: r => r.tags.includes('fisch') },
  { key: 'schwein', label: 'Kein Schwein', test: r => r.tags.includes('schwein') },
  { key: 'scharf', label: 'Scharf vermeiden', test: r => r.tags.includes('scharf') },
  { key: 'weizen', label: 'Streng weizenfrei', test: r => !r.wheatFree }
];

const THEMES = [
  { key: 'italienisch', label: '🇮🇹 Italienisch' }, { key: 'asiatisch', label: '🥢 Asiatisch' },
  { key: 'mexikanisch', label: '🌮 Mexikanisch' }, { key: 'grill', label: '🍖 Grill' },
  { key: 'herbst', label: '🎃 Herbst' }, { key: 'vegetarisch', label: '🥬 Vegetarisch' }
];

/* Drei Vorschläge pro Tag: je einer aus Geflügel, Fisch, Rind/TikTok */
const SLOTS = [
  { cats: ['gefluegel'] },
  { cats: ['fisch'] },
  { cats: ['rind', 'tiktok'] }
];

/* Haushalt: Mama, Papa, ich. Gewicht und Ziel bitte in den Einstellungen anpassen. */
const DEFAULT_PERSONS = [
  { id: 'mama', name: 'Mama', kg: 70, goal: 'erhalt', likes: [], nogos: [] },
  { id: 'papa', name: 'Papa', kg: 70, goal: 'erhalt', likes: [], nogos: [] },
  { id: 'ich', name: 'Ich', kg: 70, goal: 'erhalt', likes: [], nogos: [] }
];

/* ----- Zustand ----- */
let S = null;
let recipeCacheAll = null;
let ui = { tab: 'plan', pickerDate: null, pickerQ: '', pickerFilter: '', pantryQ: '', offerQ: '' };
let toastTimer = null;

/* ==========================================================================
   HILFSFUNKTIONEN & DATUM
   ========================================================================== */
const $ = sel => document.querySelector(sel);
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
function fmtN(v, digits = 0) { return Number(v).toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: digits }); }
function fmtG(v) { return `${fmtN(v, 0)} g`; }

function toast(msg) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

function iso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function parseISO(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function addDays(s, n) { const d = parseISO(s); d.setDate(d.getDate() + n); return iso(d); }
function todayISO() { return iso(new Date()); }
function tomorrowISO() { return addDays(todayISO(), 1); }
/* Die Planung umfasst sieben Tage ab morgen */
function windowDates() {
  const start = tomorrowISO();
  return Array.from({ length: WINDOW_DAYS }, (_, i) => addDays(start, i));
}
function weekdayIndex(s) { return (parseISO(s).getDay() + 6) % 7; }
function dateShort(s) {
  const d = parseISO(s);
  return `${DAY_SHORT[weekdayIndex(s)]} ${d.getDate()}. ${MONTHS[d.getMonth()]}`;
}
function dateLong(s) {
  const d = parseISO(s);
  return `${DAY_NAMES[weekdayIndex(s)]}, ${d.getDate()}. ${MONTHS[d.getMonth()]}`;
}
function windowLabel() {
  const w = windowDates();
  return `${dateShort(w[0])} – ${dateShort(w[w.length - 1])}`;
}
function initials(name) { return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(); }
function personColor(idx) { return PERSON_COLORS[idx % PERSON_COLORS.length]; }

/* ==========================================================================
   ZUSTAND
   ========================================================================== */
function sanitizePerson(p) {
  return {
    id: String(p.id),
    name: String(p.name || 'Person').slice(0, 30),
    kg: clamp(Number(p.kg) || 70, 30, 250),
    goal: GOALS[p.goal] ? p.goal : 'erhalt',
    likes: (p.likes || []).filter(k => LIKE_OPTIONS.some(o => o.key === k)),
    nogos: (p.nogos || []).filter(k => NOGO_OPTIONS.some(o => o.key === k))
  };
}

function newDay() { return { recipeId: null, custom: null, absent: [], options: [], skip: false }; }

function defaultState() {
  return {
    persons: DEFAULT_PERSONS.map(sanitizePerson),
    days: {},
    pantry: {},
    offers: [],
    calendar: { importedAt: null, events: [] },
    shopChecked: {},
    shopExtras: [],
    savedWindow: null,
    archive: []
  };
}

/* Aktive Tage: ohne weggelassene Tage */
function activeDates() {
  return windowDates().filter(d => !(S.days[d] && S.days[d].skip));
}

/* Woche gespeichert = gespeichertes Fenster beginnt noch am heutigen Startdatum */
function isSaved() {
  return !!(S.savedWindow && S.savedWindow.start === windowDates()[0]);
}

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STATE_KEY) || 'null');
    if (s && Array.isArray(s.persons) && s.days) return { ...defaultState(), ...s };
  } catch (e) { /* Standard verwenden */ }
  return defaultState();
}

function save() {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(S)); }
  catch (e) { toast('Speichern im Browser nicht möglich.'); }
}

/* Hält das Fenster aktuell: vergangene Tage fliegen raus, neue Tage bekommen Vorschläge */
function syncWindow() {
  const today = todayISO();
  Object.keys(S.days).forEach(d => { if (d < today) delete S.days[d]; });
  if (!S.days[today]) S.days[today] = newDay();
  windowDates().forEach(d => {
    if (!S.days[d]) S.days[d] = newDay();
    const day = S.days[d];
    if (!day.recipeId && !day.custom && (!day.options || day.options.length === 0)) {
      day.options = generateOptions(d, []);
    }
  });
}

/* ==========================================================================
   REZEPTE
   ========================================================================== */
function themesOf(r) {
  const t = [];
  const x = r.title;
  if (/Pasta|Penne|Italien|Pesto|Mozzarella|Caprese|Risotto|Lasagne|Pizza/i.test(x)) t.push('italienisch');
  if (/Asia|Wok|Teriyaki|Curry|Sriracha|Sojasprossen/i.test(x)) t.push('asiatisch');
  if (/Mexi|Burrito|Taco|Fajita|Wraps|Salsa/i.test(x)) t.push('mexikanisch');
  if (/Grill|Souvlaki/i.test(x)) t.push('grill');
  if (/Herbst|Kürbis/i.test(x)) t.push('herbst');
  if (r.proteinTags.includes('vegetarisch')) t.push('vegetarisch');
  return t;
}

function allRecipes() {
  if (!recipeCacheAll) recipeCacheAll = [...getAllRecipes(), ...BOWL_RECIPES].map(r => ({ ...r, themes: themesOf(r) }));
  return recipeCacheAll;
}
function invalidate() { recipeCacheAll = null; }
function recipeById(id) { return allRecipes().find(r => r.id === id) || null; }

function dayRecipe(day) {
  if (!day) return null;
  if (day.custom) {
    const e = enrichRecipe(day.custom);
    return { ...e, themes: themesOf(e) };
  }
  return day.recipeId ? recipeById(day.recipeId) : null;
}

/* ==========================================================================
   KALENDER & ANWESENHEIT
   ========================================================================== */
function isAbsenceFor(summary, name) {
  const s = summary.toLowerCase();
  return s.includes(name.toLowerCase()) && ABSENCE_KEYWORDS.some(k => s.includes(k));
}

function calAbsentIds(date) {
  const ids = new Set();
  S.calendar.events.forEach(ev => {
    if (ev.from <= date && date <= ev.to) {
      S.persons.forEach(p => { if (isAbsenceFor(ev.summary, p.name)) ids.add(p.id); });
    }
  });
  return ids;
}

function absentSet(date) {
  const ids = calAbsentIds(date);
  ((S.days[date] && S.days[date].absent) || []).forEach(id => ids.add(id));
  return ids;
}

function presentPersons(date) {
  const ab = absentSet(date);
  return S.persons.filter(p => !ab.has(p.id));
}

function calHits() {
  const hits = [];
  windowDates().forEach(date => {
    S.calendar.events.forEach(ev => {
      if (ev.from <= date && date <= ev.to) {
        S.persons.forEach(p => { if (isAbsenceFor(ev.summary, p.name)) hits.push({ date, person: p.name, summary: ev.summary }); });
      }
    });
  });
  return hits;
}

function icsDate(v) {
  const m = v.match(/^(\d{4})(\d{2})(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

function parseICS(text) {
  const lines = text.replace(/\r/g, '').replace(/\n[ \t]/g, '').split('\n');
  const raw = [];
  let cur = null;
  lines.forEach(line => {
    if (line === 'BEGIN:VEVENT') { cur = {}; return; }
    if (line === 'END:VEVENT') { if (cur && cur.from) raw.push(cur); cur = null; return; }
    if (!cur) return;
    const idx = line.indexOf(':');
    if (idx < 0) return;
    const key = line.slice(0, idx).split(';')[0].toUpperCase();
    const val = line.slice(idx + 1);
    if (key === 'SUMMARY') cur.summary = val.replace(/\\,/g, ',').replace(/\\;/g, ';');
    if (key === 'DTSTART') { cur.from = icsDate(val); cur.allDay = !val.includes('T'); }
    if (key === 'DTEND') cur.end = icsDate(val);
  });
  const today = todayISO();
  return raw.filter(e => e.from).map(e => {
    let to = e.end || e.from;
    if (e.allDay && e.end) to = addDays(e.end, -1);
    if (to < e.from) to = e.from;
    return { from: e.from, to, summary: e.summary || '' };
  }).filter(e => e.to >= addDays(today, -1) && e.from <= addDays(today, 400));
}

/* ==========================================================================
   MAKRO-ALGORITHMUS
   Protein-Ziel = Körpergewicht × Faktor (Hauptmahlzeit). Hauptprotein exakt auf
   das Ziel; übrige Komponenten skalieren mit (Ziel ÷ 45 g).
   ========================================================================== */
function proteinTarget(p) { return p.kg * GOALS[p.goal].factor; }
function personScale(p) { return proteinTarget(p) / REF_PROTEIN_G; }

function portionFor(recipe, p) {
  const scale = personScale(p);
  const protein = CATALOG_BY_ID[recipe.components.protein.id];
  const out = [{ role: 'protein', item: protein, grams: Math.round(proteinTarget(p) / protein.protein * 100) }];
  const add = (role, comp) => out.push({ role, item: CATALOG_BY_ID[comp.id], grams: Math.round(comp.g * scale) });
  add('carb', recipe.components.carb);
  add('veggie', recipe.components.veggie);
  add('salad', recipe.components.salad);
  recipe.components.extras.forEach(e => add('extra', e));
  return out;
}

function sumMacros(portion) {
  return portion.reduce((acc, x) => {
    const f = x.grams / 100;
    acc.grams += x.grams;
    acc.kcal += x.item.kcal * f;
    acc.protein += x.item.protein * f;
    return acc;
  }, { grams: 0, kcal: 0, protein: 0 });
}

/* Tageswerte – nur für anwesende Personen */
function dayTotals(date) {
  const recipe = dayRecipe(S.days[date]);
  const present = presentPersons(date);
  const t = { recipe, present, grams: 0, protein: 0, target: 0, lines: {}, portions: [] };
  if (!recipe) return t;
  present.forEach(p => {
    const port = portionFor(recipe, p);
    const m = sumMacros(port);
    t.grams += m.grams;
    t.protein += m.protein;
    t.target += proteinTarget(p);
    port.forEach(x => { t.lines[x.item.id] = (t.lines[x.item.id] || 0) + x.grams; });
    t.portions.push({ person: p, port });
  });
  return t;
}

function conflictsFor(recipe, list) {
  const out = [];
  list.forEach(p => p.nogos.forEach(k => {
    const opt = NOGO_OPTIONS.find(o => o.key === k);
    if (opt && opt.test(recipe)) out.push({ name: p.name, label: opt.label });
  }));
  return out;
}

/* ==========================================================================
   DREI VORSCHLÄGE PRO TAG
   Vermeidet Wiederholungen im Fenster, achtet auf Proteinvielfalt,
   bevorzugt Angebote und Vorrat, meidet Unverträglichkeiten.
   ========================================================================== */
function windowUsage(exceptDate) {
  const used = new Set();
  const prot = {};
  windowDates().forEach(d => {
    if (d === exceptDate || !S.days[d]) return;
    const day = S.days[d];
    (day.options || []).forEach(id => used.add(id));
    if (day.recipeId) used.add(day.recipeId);
    const r = dayRecipe(day);
    if (r) prot[r.components.protein.id] = (prot[r.components.protein.id] || 0) + 1;
  });
  return { used, prot };
}

function generateOptions(date, exclude) {
  const { used, prot } = windowUsage(date);
  const present = presentPersons(date);
  const pool = allRecipes().filter(r => !r.custom);
  const picked = [];
  SLOTS.forEach(slot => {
    const cands = pool.filter(r => slot.cats.includes(r.category) && !exclude.includes(r.id) && !picked.includes(r.id));
    const scored = cands.map(r => {
      const pr = r.components.protein.id;
      const s =
        -conflictsFor(r, present).length * 6 -
        (used.has(r.id) ? 4 : 0) -
        (prot[pr] || 0) * 2 +
        (r.uses.some(id => S.offers.includes(id)) ? 1.5 : 0) +
        (r.uses.some(id => (S.pantry[id] || 0) >= 100) ? 1 : 0) +
        Math.random() * 0.8;
      return { r, s };
    }).sort((a, b) => b.s - a.s);
    if (scored[0]) picked.push(scored[0].r.id);
  });
  return picked;
}

/* ==========================================================================
   EINKAUF – für das ganze Fenster, Vorrat abgezogen
   ========================================================================== */
function shopping() {
  const totals = {};
  const perDay = [];
  activeDates().forEach(d => {
    const t = dayTotals(d);
    perDay.push({ date: d, ...t });
    Object.entries(t.lines).forEach(([id, g]) => { totals[id] = (totals[id] || 0) + g; });
  });
  const deptOrder = Object.fromEntries(DEPARTMENTS.map(d => [d.key, d.order]));
  const lines = Object.entries(totals).map(([id, grams]) => {
    const item = CATALOG_BY_ID[id];
    const stock = S.pantry[id] || 0;
    const net = Math.max(0, grams - stock);
    const packs = net > 0 ? Math.ceil(net / item.packG) : 0;
    return { id, item, grams, stock, net, packs };
  }).filter(l => l.net > 0);
  lines.sort((a, b) => (deptOrder[a.item.dept] - deptOrder[b.item.dept]) || a.item.name.localeCompare(b.item.name, 'de'));
  return { lines, perDay };
}

/* ==========================================================================
   RENDERING
   ========================================================================== */
const TAB_TITLES = { plan: 'Wochenplan', einkauf: 'Einkauf', mehr: 'Einstellungen' };

function render() {
  syncWindow();
  $('#topbar-title').textContent = TAB_TITLES[ui.tab];
  $('#topbar-sub').textContent = ui.tab === 'plan' ? `Planung ab morgen · ${windowLabel()}` : (ui.tab === 'einkauf' ? `Einkauf für ${windowLabel()}` : '');
  $('#view').innerHTML = ui.tab === 'plan' ? viewPlan() : ui.tab === 'einkauf' ? viewEinkauf() : viewMehr();
  if (ui.tab === 'mehr') { renderOfferResults(); renderPantryResults(); }
  document.querySelectorAll('[data-tab-btn]').forEach(b => b.classList.toggle('active', b.dataset.tabBtn === ui.tab));
  save();
}

/* ----- 1. Wochenplan ----- */
function viewPlan() {
  const today = todayISO();
  const todayRecipe = dayRecipe(S.days[today]);
  const todayBlock = `
    <section class="card today">
      <p class="eyebrow">Heute · ${esc(dateLong(today))}</p>
      ${todayRecipe
        ? `<p class="meal-title">${esc(todayRecipe.title)}</p><p class="small muted">Schon geplant – bleibt so.</p>`
        : `<p class="muted small">Heute ist noch nichts eingetragen.</p>
           <div class="row wrap mt"><button class="btn small-btn" data-action="pickFor" data-date="${today}">Heute eintragen</button></div>`}
    </section>`;
  const dates = windowDates();
  const planned = activeDates().filter(d => dayRecipe(S.days[d])).length;
  const hits = calHits();
  const saved = isSaved();

  return `
    <div class="stack">
      ${todayBlock}
      ${saved ? `<section class="card hero"><p class="eyebrow">✅ Gespeichert</p><p class="small">Woche ${esc(windowLabel())} gespeichert am ${new Date(S.savedWindow.savedAt).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })}. Pro Tag steht ein Gericht.</p><div class="row wrap mt"><button class="btn small-btn" data-action="unlockWeek">🔓 Woche ändern</button></div></section>` : ''}
      <p class="small muted">${planned} von ${activeDates().length} Tagen geplant. Pro Tag drei Vorschläge – wähle einen oder würfle neu.</p>
      <div class="stack">${dates.map(d => dayCard(d)).join('')}</div>
      ${hits.length ? `<section class="card">
        <p class="eyebrow">Kalender-Treffer</p>
        <div class="stack-sm">${hits.map(h => `<p class="small"><b>${esc(dateShort(h.date))}</b> · ${esc(h.person)} – ${esc(h.summary)}</p>`).join('')}</div>
      </section>` : ''}
      <section class="card actions">
        ${saved ? '' : '<button class="btn primary" data-action="saveWeek">💾 Woche speichern & PDF</button>'}
        <button class="btn ${saved ? 'primary' : ''}" data-action="exportPdf">📄 PDF herunterladen</button>
        <p class="small muted">Das PDF enthält pro Tag das gewählte Gericht mit Gramm pro Person und darunter die Einkaufsliste für die ganze Woche.</p>
      </section>
    </div>`;
}

function dayCard(date) {
  const day = S.days[date];
  if (day && day.skip) {
    return `<article class="card dayrow skipped">
      <div class="dayhead">
        <div class="grow"><b>${esc(dateLong(date))}</b><span class="small muted block">Tag entfällt</span></div>
        <button class="btn small-btn" data-action="unskipDay" data-date="${date}">Wieder aufnehmen</button>
      </div>
    </article>`;
  }
  const r = dayRecipe(day);
  const present = presentPersons(date);
  const ab = absentSet(date);
  const cal = calAbsentIds(date);
  const people = S.persons.map((p, idx) => {
    const off = ab.has(p.id);
    return `<button class="pchip ${off ? 'off' : ''}" style="--c:${personColor(idx)}" data-action="presence" data-date="${date}" data-person="${esc(p.id)}">
      <span class="av">${esc(initials(p.name))}</span>${off ? '✕ nicht da' : 'dabei'}${cal.has(p.id) ? ' 📅' : ''}
    </button>`;
  }).join('');

  let body;
  if (isSaved()) {
    body = r
      ? mealCard(date, r, true) + '<p class="small muted">Kochtopf ' + fmtG(dayTotals(date).grams) + ' · Protein ' + fmtN(dayTotals(date).protein, 0) + ' g</p>'
      : '<p class="muted small">Kein Gericht an diesem Tag.</p>';
  } else if (r) {
    const conf = conflictsFor(r, present);
    const t = dayTotals(date);
    body = `
      ${mealCard(date, r, true)}
      <p class="small muted">Kochtopf ${fmtG(t.grams)} · Protein ${fmtN(t.protein, 0)} g${conf.length ? ` · <span class="warn-inline">⚠ ${conf.map(c => esc(c.name) + ': ' + esc(c.label)).join(', ')}</span>` : ''}</p>
      <div class="row wrap">
        <button class="btn small-btn" data-action="change" data-date="${date}">Gericht ändern</button>
        <button class="btn small-btn" data-action="pickFor" data-date="${date}">Anderes suchen</button>
      </div>`;
  } else if (day && day.custom) {
    body = mealCard(date, enrichRecipe(day.custom), true);
  } else {
    const opts = (day.options || []).map(id => recipeById(id)).filter(Boolean);
    body = `
      <div class="meals">${opts.map((o, j) => mealCard(date, o, false, ['Geflügel', 'Fisch', 'Rind / TikTok'][j])).join('')}</div>
      <div class="row wrap">
        <button class="btn small-btn" data-action="reroll" data-date="${date}">🎲 Neu würfeln</button>
        <button class="btn small-btn" data-action="pickFor" data-date="${date}">🔍 Anderes suchen</button>
        <button class="btn small-btn" data-action="builder" data-date="${date}">🛠️ Eigenes bauen</button>
      </div>`;
  }

  return `
    <article class="card dayrow">
      <div class="dayhead">
        <div class="daydate"><span class="dshort">${DAY_SHORT[weekdayIndex(date)]}</span><b>${parseISO(date).getDate()}.</b></div>
        <div class="grow"><b>${esc(dateLong(date))}</b>${r ? '' : '<span class="small muted block">noch nicht gewählt</span>'}</div>
      </div>
      <div class="pchips">${people}</div>
      ${body}
      <button class="link" data-action="skipDay" data-date="${date}">Tag weglassen</button>
    </article>`;
}

function mealCard(date, r, selected, slotLabel) {
  const veg = r.proteinTags.includes('vegetarisch');
  const action = selected ? '' : `data-action="choose" data-date="${date}" data-recipe="${esc(r.id)}"`;
  return `
    <div class="meal ${selected ? 'sel' : ''}">
      <button class="meal-main" ${action}>
        ${slotLabel ? `<span class="slot">${esc(slotLabel)}</span>` : ''}
        <span class="meal-title">${esc(r.title)}</span>
        <span class="tags">
          <span class="tag">⏱ ${r.prepTime} Min</span>
          ${veg ? '<span class="tag green">🥬 vegetarisch</span>' : ''}
          ${r.bowl ? '<span class="tag">🥗 Bowl</span>' : ''}
          ${r.uses.some(u => S.offers.includes(u)) ? '<span class="tag orange">🏷️ Angebot</span>' : ''}
        </span>
      </button>
      ${selected ? '<span class="check">✓</span>' : ''}
    </div>`;
}

/* ----- 2. Einkauf ----- */
function viewEinkauf() {
  const { lines, perDay } = shopping();
  const planned = perDay.filter(d => d.recipe).length;
  const done = lines.filter(l => S.shopChecked['c:' + l.id]).length;
  const groups = DEPARTMENTS.filter(d => d.key !== 'extra').map(d => {
    const items = lines.filter(l => l.item.dept === d.key);
    if (!items.length) return '';
    return `<p class="eyebrow dept">${esc(d.label)}</p>
      <div class="card list">${items.map(l => `
        <label class="row-item ${S.shopChecked['c:' + l.id] ? 'done' : ''}">
          <input type="checkbox" data-field="checked" data-key="c:${esc(l.id)}" ${S.shopChecked['c:' + l.id] ? 'checked' : ''}>
          <span class="grow"><b>${esc(l.item.name)}</b>
            <span class="small muted block">${fmtG(l.net)} benötigt${l.stock ? ` · ${fmtG(l.stock)} aus dem Vorrat abgezogen` : ''}</span></span>
          <span class="pack">${l.packs}× ${esc(l.item.packLabel)}</span>
        </label>`).join('')}</div>`;
  }).join('');
  const extras = S.shopExtras.map(e => `
    <label class="row-item ${S.shopChecked['x:' + e.id] ? 'done' : ''}">
      <input type="checkbox" data-field="checked" data-key="x:${esc(e.id)}" ${S.shopChecked['x:' + e.id] ? 'checked' : ''}>
      <span class="grow">${esc(e.text)}</span>
      <button class="link danger" data-action="removeExtra" data-id="${esc(e.id)}" type="button">✕</button>
    </label>`).join('');
  return `
    <div class="stack">
      <section class="card hero">
        <p class="eyebrow">Für die ganze Woche</p>
        <h2>${lines.length ? `${lines.length} Artikel` : 'Nichts einzukaufen'}</h2>
        <p class="muted small">${planned} von ${activeDates().length} Tagen geplant · ${done} von ${lines.length} erledigt · Vorrat ist abgezogen</p>
        <div class="bar"><span style="width:${lines.length ? (done / lines.length * 100).toFixed(0) : 0}%"></span></div>
      </section>
      ${groups || '<p class="muted">Noch keine Gerichte gewählt – oder der Vorrat deckt alles ab.</p>'}
      <p class="eyebrow dept">Zusatzwünsche</p>
      <div class="card list">${extras || '<p class="muted small pad">Noch keine.</p>'}
        <form id="extra-form" class="row pad">
          <input class="input grow" name="text" maxlength="80" placeholder="z. B. Protein-Pudding, Küchenrolle" required>
          <button class="btn primary small-btn" type="submit">+</button>
        </form>
      </div>
      <button class="btn" data-action="exportPdf">📄 PDF: Tagesplan & Einkaufsliste</button>
    </div>`;
}

/* ----- 3. Einstellungen ----- */
function viewMehr() {
  const people = S.persons.map((p, idx) => `
    <section class="card person">
      <div class="row between">
        <span class="av big" style="--c:${personColor(idx)}">${esc(initials(p.name))}</span>
        <input class="input grow name" value="${esc(p.name)}" maxlength="30" data-person="${esc(p.id)}" data-field="name" aria-label="Name">
        ${S.persons.length > 1 ? `<button class="link danger" data-action="removePerson" data-person="${esc(p.id)}">Entfernen</button>` : ''}
      </div>
      <div class="grid2">
        <label class="field">Gewicht (kg)<input class="input" type="number" min="30" max="250" value="${p.kg}" data-person="${esc(p.id)}" data-field="kg"></label>
        <label class="field">Ziel<select class="input" data-person="${esc(p.id)}" data-field="goal">
          ${Object.entries(GOALS).map(([k, g]) => `<option value="${k}" ${p.goal === k ? 'selected' : ''}>${esc(g.label)}</option>`).join('')}
        </select></label>
      </div>
      <p class="small muted">Protein-Ziel pro Hauptmahlzeit: <b>${fmtN(proteinTarget(p), 0)} g</b></p>
      <span class="label">Lieblings-Proteine</span>
      <div class="chips">${LIKE_OPTIONS.map(o => `<button class="chip ${p.likes.includes(o.key) ? 'on' : ''}" data-action="pref" data-kind="like" data-person="${esc(p.id)}" data-value="${o.key}">${o.label}</button>`).join('')}</div>
      <span class="label">No-Gos / Allergien</span>
      <div class="chips">${NOGO_OPTIONS.map(o => `<button class="chip nogo ${p.nogos.includes(o.key) ? 'on' : ''}" data-action="pref" data-kind="nogo" data-person="${esc(p.id)}" data-value="${o.key}">${o.label}</button>`).join('')}</div>
    </section>`).join('');

  const pantryRows = Object.entries(S.pantry).filter(([, g]) => g > 0).map(([id, g]) => {
    const it = CATALOG_BY_ID[id];
    return it ? `<div class="row-item">
      <span class="grow"><b>${esc(it.name)}</b></span>
      <button class="step" data-action="pantryStep" data-id="${esc(id)}" data-value="-100">−</button>
      <input class="input g-input" type="number" min="0" step="10" value="${g}" data-field="pantry-g" data-id="${esc(id)}" aria-label="Gramm">
      <button class="step" data-action="pantryStep" data-id="${esc(id)}" data-value="100">+</button>
    </div>` : '';
  }).join('');

  const offerChips = S.offers.map(id => `<button class="chip on" data-action="offer" data-id="${esc(id)}">🏷️ ${esc(CATALOG_BY_ID[id].name)} ✕</button>`).join('');
  const ev = S.calendar.events.length;

  return `
    <div class="stack">
      <p class="eyebrow dept">Gespeicherte Wochen</p>
      <div class="card list">${S.archive.map(x => `<div class="row-item">
        <span class="grow"><b>${esc(x.label)}</b><span class="small muted block">gespeichert ${new Date(x.savedAt).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })}</span></span>
        <button class="btn small-btn" data-action="archivePdf" data-id="${esc(x.id)}">PDF</button>
        <button class="link danger" data-action="archiveDelete" data-id="${esc(x.id)}">✕</button>
      </div>`).join('') || '<p class="muted small pad">Noch keine gespeicherten Wochen.</p>'}</div>
      <p class="eyebrow dept">Personen</p>
      ${people}
      ${S.persons.length < MAX_PERSONS ? `<button class="btn" data-action="addPerson">+ Person hinzufügen</button>` : ''}

      <p class="eyebrow dept">Vorrat – was ist noch da?</p>
      <section class="card">
        <input id="pantry-search" class="input" type="search" placeholder="Zutat suchen und hinzufügen …" value="${esc(ui.pantryQ)}">
        <div id="pantry-results" class="stack-sm mt"></div>
      </section>
      ${pantryRows ? `<div class="card list">${pantryRows}</div>` : ''}

      <p class="eyebrow dept">Kalender</p>
      <section class="card">
        <p class="small">Kalender als .ics exportieren und hier importieren. Termine mit einem Personennamen und einem Wort wie <i>weg, Geschäft, Dienstreise, Urlaub, auswärts</i> markieren die Person als abwesend.</p>
        <p class="small muted mt">${ev ? `${ev} Termine · Stand ${new Date(S.calendar.importedAt).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })}` : 'Noch kein Kalender importiert.'}</p>
        <label class="btn file-btn mt">📅 Kalender-Datei wählen
          <input type="file" accept=".ics,text/calendar" data-field="ics" hidden>
        </label>
        ${ev ? `<button class="btn mt" data-action="calClear">Kalender entfernen</button>` : ''}
      </section>

      <p class="eyebrow dept">Lidl-Angebote diese Woche</p>
      <section class="card">
        <p class="small muted">Angebote werden bei den Vorschlägen bevorzugt. Bitte selbst aus dem Prospekt eintragen.</p>
        <input id="offer-search" class="input" type="search" placeholder="Artikel suchen …" value="${esc(ui.offerQ)}">
        <div class="chips mt">${offerChips}</div>
        <div id="offer-results" class="stack-sm mt"></div>
      </section>

      <p class="eyebrow dept">Datenbank</p>
      <section class="card">
        <p class="small">Alles (Personen, Plan, Vorrat, eigene Rezepte) als Datei sichern oder auf ein anderes Gerät laden.</p>
        <div class="stack-sm mt">
          <button class="btn primary" data-action="exportDb">⬇️ Datenbank exportieren</button>
          <label class="btn file-btn">⬆️ Datenbank importieren<input type="file" accept=".json,application/json" data-field="dbimport" hidden></label>
        </div>
      </section>

      <button class="btn danger-soft" data-action="reset">Alle Daten auf diesem Gerät löschen</button>
    </div>`;
}

function renderPantryResults() {
  const box = $('#pantry-results');
  if (!box) return;
  const q = ui.pantryQ.trim().toLowerCase();
  if (!q) { box.innerHTML = ''; return; }
  const hits = LIDL_CATALOG.filter(i => i.name.toLowerCase().includes(q)).slice(0, 12);
  box.innerHTML = hits.length ? `<div class="card list">${hits.map(it => `
    <div class="row-item">
      <span class="grow"><b>${esc(it.name)}</b><span class="small muted block">${esc(it.packLabel)}</span></span>
      <button class="btn small-btn" data-action="pantryAdd" data-id="${esc(it.id)}">${S.pantry[it.id] ? '✓ drin' : '+'}</button>
    </div>`).join('')}</div>` : '<p class="muted small">Keine Treffer.</p>';
}

function renderOfferResults() {
  const box = $('#offer-results');
  if (!box) return;
  const q = ui.offerQ.trim().toLowerCase();
  if (!q) { box.innerHTML = ''; return; }
  const hits = LIDL_CATALOG.filter(i => i.name.toLowerCase().includes(q)).slice(0, 15);
  box.innerHTML = `<div class="card list">${hits.map(i => `
    <button class="row-item" data-action="offer" data-id="${esc(i.id)}">
      <span class="grow">${esc(i.name)}</span>
      <span class="small muted">${S.offers.includes(i.id) ? '✓ Angebot' : '+ Angebot'}</span>
    </button>`).join('')}</div>`;
}

/* ==========================================================================
   MODALE: Auswahl, Baukasten, eigenes Rezept
   ========================================================================== */
function openModal(title, html) {
  $('#modal-title').textContent = title;
  $('#modal-body').innerHTML = html;
  $('#modal').classList.remove('hidden');
}
function closeModal() { $('#modal').classList.add('hidden'); ui.pickerDate = null; }

function openPicker(date) {
  ui.pickerDate = date;
  ui.pickerQ = '';
  ui.pickerFilter = '';
  renderPicker();
  $('#modal').classList.remove('hidden');
}

function renderPicker() {
  const date = ui.pickerDate;
  if (!date) return;
  const filters = [
    { key: '', label: 'Alle' },
    ...Object.entries(RECIPE_CATEGORIES).map(([k, l]) => ({ key: 'cat:' + k, label: l })),
    { key: 'bowl', label: '🥗 Bowls' },
    ...THEMES.map(t => ({ key: 'th:' + t.key, label: t.label }))
  ];
  openModal(`Gericht für ${dateLong(date)}`, `
    <div class="stack">
      <input id="picker-search" class="input" type="search" placeholder="Gericht oder Zutat suchen …" value="${esc(ui.pickerQ)}">
      <div class="chips">${filters.map(f => `<button class="chip ${ui.pickerFilter === f.key ? 'on' : ''}" data-action="pfilter" data-value="${f.key}">${f.label}</button>`).join('')}</div>
      <div id="picker-list" class="card list"></div>
      <div class="stack-sm">
        <button class="btn" data-action="builder" data-date="${date}">🛠️ Eigenes Gericht aus Bausteinen bauen</button>
        <button class="btn" data-action="vaultForm">+ Neues Rezept anlegen</button>
      </div>
    </div>`);
  renderPickerList();
}

function renderPickerList() {
  const date = ui.pickerDate;
  const box = $('#picker-list');
  if (!box || !date) return;
  const present = presentPersons(date);
  const q = ui.pickerQ.trim().toLowerCase();
  const list = allRecipes()
    .filter(r => !r.custom)
    .filter(r => {
      const f = ui.pickerFilter;
      if (!f) return true;
      if (f === 'bowl') return !!r.bowl;
      if (f.startsWith('cat:')) return r.category === f.slice(4);
      return r.themes.includes(f.slice(3));
    })
    .filter(r => !q || r.title.toLowerCase().includes(q) || r.uses.some(id => CATALOG_BY_ID[id].name.toLowerCase().includes(q)))
    .map(r => ({ r, conf: conflictsFor(r, present) }))
    .sort((a, b) => (a.conf.length - b.conf.length) || a.r.title.localeCompare(b.r.title, 'de'))
    .slice(0, 80);
  box.innerHTML = list.map(({ r, conf }) => `
    <button class="row-item" data-action="choose" data-date="${date}" data-recipe="${esc(r.id)}">
      <span class="grow">
        <b>${esc(r.title)}</b>
        <span class="small muted block">⏱ ${r.prepTime} Min · ${esc(RECIPE_CATEGORIES[r.category])}${r.wheatFree ? ' · 🌾 weizenfrei' : ''}${r.bowl ? ' · 🥗 Bowl' : ''}</span>
        ${conf.length ? `<span class="warn-inline block">⚠ ${conf.map(c => esc(c.name) + ': ' + esc(c.label)).join(', ')}</span>` : ''}
      </span>
    </button>`).join('') || '<p class="pad muted small">Keine Treffer.</p>';
}

function optionsFor(role, allowEmpty = false, selected = '') {
  const list = LIDL_CATALOG.filter(i => i.roles.includes(role));
  const empty = allowEmpty ? '<option value="">— keiner —</option>' : '';
  return empty + list.map(i => `<option value="${i.id}" ${i.id === selected ? 'selected' : ''}>${esc(i.name)}${i.brand ? ' (' + esc(i.brand) + ')' : ''}</option>`).join('');
}

function openBuilder(date) {
  openModal('Gericht aus Bausteinen', `
    <form id="builder-form" class="form" data-date="${date}">
      <label class="field">Name<input class="input" name="title" value="Mein Gericht" maxlength="80" required></label>
      <label class="field">1 · Protein<select class="input" name="protein" required>${optionsFor('protein', false, 'huhn_innen')}</select></label>
      <label class="field">2 · Kohlenhydrat<select class="input" name="carb" required>${optionsFor('carb', false, 'reis')}</select></label>
      <label class="field">3 · Gemüse<select class="input" name="veggie" required>${optionsFor('veggie', false, 'brokkoli')}</select></label>
      <label class="field">4 · Salat<select class="input" name="salad" required>${optionsFor('salad', false, 'feldsalat')}</select></label>
      <label class="field">5 · Booster (optional)<select class="input" name="booster">${optionsFor('extra', true, 'skyr')}</select></label>
      <label class="check"><input type="checkbox" name="save"> Zusätzlich im Rezept-Archiv speichern</label>
      <button class="btn primary" type="submit">Für diesen Tag übernehmen</button>
    </form>`);
}

function categoryForProtein(pid) {
  const tags = CATALOG_BY_ID[pid].tags;
  if (tags.includes('huhn')) return 'gefluegel';
  if (tags.includes('fisch')) return 'fisch';
  if (tags.includes('vegetarisch')) return 'tiktok';
  return 'rind';
}

function submitBuilder(form) {
  const date = form.dataset.date;
  const f = new FormData(form);
  const pid = String(f.get('protein')), cid = String(f.get('carb')), vid = String(f.get('veggie')), sid = String(f.get('salad'));
  const bid = String(f.get('booster') || '');
  const recipe = {
    id: 'c_' + Date.now(),
    title: String(f.get('title') || '').trim().slice(0, 80) || 'Mein Gericht',
    category: categoryForProtein(pid),
    season: 'all',
    prepTime: 20,
    components: {
      protein: { id: pid },
      carb: { id: cid, g: BUILDER_BASE_G.carb },
      veggie: { id: vid, g: BUILDER_BASE_G.veggie },
      salad: { id: sid, g: BUILDER_BASE_G.salad },
      extras: bid ? [{ id: bid, g: BUILDER_BASE_G.booster }] : []
    },
    steps: [
      `${CATALOG_BY_ID[pid].name} würzen und rundum durchgaren.`,
      `${CATALOG_BY_ID[cid].name} nach Packungsanleitung zubereiten.`,
      `${CATALOG_BY_ID[vid].name} knackig garen oder backen.`,
      `${CATALOG_BY_ID[sid].name} anrichten${bid ? ' und ' + CATALOG_BY_ID[bid].name + ' dazugeben' : ''}.`
    ],
    custom: true
  };
  const day = S.days[date];
  day.custom = recipe;
  day.recipeId = null;
  if (f.get('save') && saveCustomRecipe(recipe)) invalidate();
  closeModal();
  render();
}

function openVaultForm() {
  openModal('Neues Rezept', `
    <form id="vault-form" class="form">
      <label class="field">Titel<input class="input" name="title" required maxlength="80"></label>
      <div class="grid2">
        <label class="field">Kategorie<select class="input" name="category">${Object.entries(RECIPE_CATEGORIES).map(([k, l]) => `<option value="${k}">${esc(l)}</option>`).join('')}</select></label>
        <label class="field">Saison<select class="input" name="season">${Object.entries(RECIPE_SEASONS).map(([k, l]) => `<option value="${k}">${esc(l)}</option>`).join('')}</select></label>
      </div>
      <label class="field">Zubereitungszeit (Min.)<input class="input" type="number" name="prep" min="1" max="300" value="20"></label>
      <div class="grid2">
        <label class="field">Protein<select class="input" name="protein" required>${optionsFor('protein')}</select></label>
        <label class="field">Kohlenhydrat<select class="input" name="carb" required>${optionsFor('carb')}</select></label>
        <label class="field">Gemüse<select class="input" name="veggie" required>${optionsFor('veggie')}</select></label>
        <label class="field">Salat<select class="input" name="salad" required>${optionsFor('salad')}</select></label>
        <label class="field">Booster (optional)<select class="input" name="booster">${optionsFor('extra', true)}</select></label>
      </div>
      <label class="field">Zubereitungsschritte (ein Schritt pro Zeile)<textarea class="input" name="steps" rows="4"></textarea></label>
      <button class="btn primary" type="submit">Speichern</button>
    </form>`);
}

function submitVault(form) {
  const f = new FormData(form);
  const title = String(f.get('title') || '').trim().slice(0, 80);
  if (!title) return toast('Bitte einen Titel eingeben.');
  const steps = String(f.get('steps') || '').split('\n').map(s => s.trim()).filter(Boolean).slice(0, 10);
  const booster = String(f.get('booster') || '');
  const recipe = {
    id: 'c_' + Date.now(),
    title,
    category: String(f.get('category')),
    season: String(f.get('season')),
    prepTime: clamp(Number(f.get('prep')) || 20, 1, 300),
    components: {
      protein: { id: String(f.get('protein')) },
      carb: { id: String(f.get('carb')), g: BUILDER_BASE_G.carb },
      veggie: { id: String(f.get('veggie')), g: BUILDER_BASE_G.veggie },
      salad: { id: String(f.get('salad')), g: BUILDER_BASE_G.salad },
      extras: booster ? [{ id: booster, g: BUILDER_BASE_G.booster }] : []
    },
    steps: steps.length ? steps : ['Nach Belieben zubereiten.'],
    custom: true
  };
  if (!saveCustomRecipe(recipe)) return toast('Konnte nicht gespeichert werden.');
  invalidate();
  closeModal();
  toast('Rezept gespeichert – im Auswahl-Fenster verfügbar.');
  render();
}

/* ==========================================================================
   INHALT & PDF
   buildPlanContent() erzeugt den Plan als Daten (auch für das Archiv).
   Die PDF ist nach Gerichten gegliedert: pro Tag das Gericht mit Gesamtmengen
   aller anwesenden Personen. Die Einkaufsliste ist die Summe über die Woche.
   ========================================================================== */
function buildPlanContent() {
  const dates = activeDates();
  const days = dates.map(d => {
    const t = dayTotals(d);
    const sums = [];
    const idx = {};
    t.portions.forEach(px => px.port.forEach(x => {
      const key = x.item.id;
      if (idx[key] === undefined) { idx[key] = sums.length; sums.push({ name: x.item.name, grams: 0 }); }
      sums[idx[key]].grams += x.grams;
    }));
    return {
      date: d,
      title: t.recipe ? t.recipe.title : null,
      minutes: t.recipe ? t.recipe.prepTime : null,
      people: t.present.map(p => p.name),
      grams: t.grams,
      protein: t.protein,
      sums
    };
  });
  const { lines } = shopping();
  return {
    start: windowDates()[0],
    label: windowLabel(),
    saved: isSaved(),
    days,
    skipped: windowDates().filter(d => !dates.includes(d)),
    shop: lines.map(l => ({ dept: l.item.dept, packs: l.packs, packLabel: l.item.packLabel, net: l.net, name: l.item.name, stock: l.stock })),
    extras: S.shopExtras.map(e => e.text)
  };
}

/* Seiten für die PDF (A4 quer): Gerichte, danach Einkaufsliste */
function renderPdfPages(c) {
  const pages = [];
  let ops = [];
  let y = 0;
  const newPage = () => { if (ops.length) pages.push(ops); ops = []; y = 548; };
  const need = h => { if (y - h < 40) newPage(); };
  const header = (title, sub) => {
    ops.push({ x: 40, y: 560, s: 16, b: true, t: title });
    ops.push({ x: 40, y: 543, s: 9, t: sub });
    y = 520;
  };

  newPage();
  header('Wochenplan · ' + c.label, (c.saved ? 'Gespeichert' : 'Entwurf') + ' · Gerichte mit Gesamtmengen zum Kochen');
  c.days.forEach(day => {
    if (!day.title) {
      need(26);
      ops.push({ x: 40, y, s: 11, b: true, t: dateLong(day.date) + ' – noch offen' });
      y -= 22;
      return;
    }
    const who = day.people.length ? day.people.join(', ') : 'niemand';
    const h = 30 + day.sums.length * 12 + 10;
    need(h);
    ops.push({ x: 40, y, s: 11, b: true, t: dateLong(day.date) + ' – ' + day.title });
    y -= 14;
    ops.push({ x: 40, y, s: 8.5, t: 'für ' + day.people.length + ' Person(en): ' + who + ' · Zeit ' + day.minutes + ' Min · Kochtopf gesamt ' + fmtG(day.grams) + ' · Protein gesamt ' + fmtN(day.protein, 0) + ' g' });
    y -= 14;
    day.sums.forEach(s => {
      ops.push({ x: 56, y, s: 9.5, t: fmtG(s.grams) + '   ' + s.name });
      y -= 12;
    });
    y -= 10;
  });
  if (c.skipped.length) {
    need(20);
    y -= 4;
    ops.push({ x: 40, y, s: 9, t: 'Entfallene Tage: ' + c.skipped.map(dateShort).join(', ') });
  }

  newPage();
  header('Einkaufsliste für die Woche · ' + c.label, 'Gesamtmengen über alle Tage, Vorrat abgezogen, Packungen auf volle Lidl-Gebinde aufgerundet');
  DEPARTMENTS.filter(d => d.key !== 'extra').forEach(d => {
    const items = c.shop.filter(l => l.dept === d.key);
    if (!items.length) return;
    need(34);
    y -= 6;
    ops.push({ x: 40, y, s: 11, b: true, t: d.label });
    y -= 14;
    items.forEach(l => {
      const text = '[  ]  ' + l.packs + '× ' + l.packLabel + '  ·  ' + fmtG(l.net) + ' ' + l.name + (l.stock ? '  (Vorrat abgezogen)' : '');
      pdfWrap(text, 130).forEach(part => {
        need(13);
        ops.push({ x: 50, y, s: 9.5, t: part });
        y -= 13;
      });
    });
  });
  if (c.extras.length) {
    need(34);
    y -= 6;
    ops.push({ x: 40, y, s: 11, b: true, t: 'Zusatzwünsche' });
    y -= 14;
    c.extras.forEach(t => { need(13); ops.push({ x: 50, y, s: 9.5, t: '[  ]  ' + t }); y -= 13; });
  }
  if (!c.shop.length && !c.extras.length) ops.push({ x: 40, y, s: 10, t: 'Nichts einzukaufen.' });
  newPage();
  return pages;
}

function downloadPdfFile(c) {
  const bytes = buildPdf(renderPdfPages(c));
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Wochenplan_' + c.start + '.pdf';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  toast('PDF erstellt.');
}

/* ==========================================================================
   AKTIONEN & EVENTS
   ========================================================================== */
function handleAction(action, ds) {
  switch (action) {
    case 'tab': ui.tab = ds.value; return render();
    case 'presence': {
      const day = S.days[ds.date];
      day.absent = day.absent.includes(ds.person) ? day.absent.filter(id => id !== ds.person) : [...day.absent, ds.person];
      return render();
    }
    case 'reroll': {
      const day = S.days[ds.date];
      day.options = generateOptions(ds.date, day.options || []);
      day.recipeId = null;
      day.custom = null;
      return render();
    }
    case 'choose': {
      const day = S.days[ds.date];
      day.recipeId = ds.recipe;
      day.custom = null;
      closeModal();
      return render();
    }
    case 'change': {
      const day = S.days[ds.date];
      day.recipeId = null;
      day.custom = null;
      return render();
    }
    case 'pickFor': return openPicker(ds.date);
    case 'pfilter': ui.pickerFilter = ui.pickerFilter === ds.value ? '' : ds.value; return renderPicker();
    case 'builder': return openBuilder(ds.date);
    case 'vaultForm': return openVaultForm();
    case 'exportPdf': return downloadPdfFile(buildPlanContent());
    case 'saveWeek': {
      const c = buildPlanContent();
      const savedAt = new Date().toISOString();
      S.savedWindow = { start: c.start, savedAt };
      S.archive = [{ id: 'a' + Date.now(), savedAt, label: c.label, content: c }, ...S.archive.filter(x => x.content.start !== c.start)].slice(0, 60);
      render();
      return downloadPdfFile(c);
    }
    case 'archivePdf': {
      const x = S.archive.find(e => e.id === ds.id);
      if (x) downloadPdfFile(x.content);
      return;
    }
    case 'archiveDelete': {
      if (!window.confirm('Diese gespeicherte Woche löschen?')) return;
      S.archive = S.archive.filter(e => e.id !== ds.id);
      return render();
    }
    case 'skipDay': S.days[ds.date].skip = true; return render();
    case 'unskipDay': S.days[ds.date].skip = false; return render();
    case 'unlockWeek': S.savedWindow = null; return render();
    case 'removeExtra': {
      S.shopExtras = S.shopExtras.filter(e => e.id !== ds.id);
      delete S.shopChecked['x:' + ds.id];
      return render();
    }
    case 'pantryAdd': {
      if (!S.pantry[ds.id]) S.pantry[ds.id] = CATALOG_BY_ID[ds.id].packG;
      return render();
    }
    case 'pantryStep': {
      const g = Math.max(0, (S.pantry[ds.id] || 0) + Number(ds.value));
      if (g === 0) delete S.pantry[ds.id]; else S.pantry[ds.id] = g;
      return render();
    }
    case 'addPerson': {
      if (S.persons.length >= MAX_PERSONS) return toast('Maximal 5 Personen.');
      S.persons.push(sanitizePerson({ id: 'p' + Date.now(), name: `Person ${S.persons.length + 1}`, kg: 70, goal: 'erhalt' }));
      return render();
    }
    case 'removePerson': {
      if (S.persons.length <= 1) return;
      const p = S.persons.find(x => x.id === ds.person);
      if (!p || !window.confirm(`${p.name} entfernen?`)) return;
      S.persons = S.persons.filter(x => x.id !== p.id);
      Object.values(S.days).forEach(d => { d.absent = d.absent.filter(id => id !== p.id); });
      return render();
    }
    case 'pref': {
      const p = S.persons.find(x => x.id === ds.person);
      if (!p) return;
      const list = ds.kind === 'like' ? p.likes : p.nogos;
      const next = list.includes(ds.value) ? list.filter(k => k !== ds.value) : [...list, ds.value];
      if (ds.kind === 'like') p.likes = next; else p.nogos = next;
      return render();
    }
    case 'offer': {
      S.offers = S.offers.includes(ds.id) ? S.offers.filter(x => x !== ds.id) : [...S.offers, ds.id];
      return render();
    }
    case 'calClear': S.calendar = { importedAt: null, events: [] }; return render();
    case 'exportDb': {
      const data = { app: 'mensa-high-protein', version: 6, exportedAt: new Date().toISOString(), state: S, customRecipes: loadCustomRecipes() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'mensa-datenbank.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      return toast('Datenbank exportiert.');
    }
    case 'reset': {
      if (!window.confirm('Alle Personen, Pläne, Vorräte und Kalenderdaten auf diesem Gerät löschen?')) return;
      localStorage.removeItem(STATE_KEY);
      S = defaultState();
      return render();
    }
    case 'closeModal': return closeModal();
  }
}

function handleField(el) {
  const field = el.dataset.field;
  if (field === 'checked') {
    S.shopChecked[el.dataset.key] = el.checked;
    return render();
  }
  if (field === 'pantry-g') {
    const g = Math.max(0, Math.round(Number(el.value) || 0));
    if (g === 0) delete S.pantry[el.dataset.id]; else S.pantry[el.dataset.id] = g;
    return render();
  }
  if (field === 'ics') {
    const file = el.files && el.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const events = parseICS(String(reader.result || ''));
      S.calendar = { importedAt: new Date().toISOString(), events };
      toast(`Kalender importiert: ${events.length} Termine, ${calHits().length} Abwesenheit(en) im Planungszeitraum.`);
      render();
    };
    reader.readAsText(file);
    return;
  }
  if (field === 'dbimport') {
    const file = el.files && el.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || ''));
        if (!data || data.app !== 'mensa-high-protein' || !data.state || !Array.isArray(data.state.persons)) {
          return toast('Das ist keine Mensa-Datenbank.');
        }
        if (!window.confirm('Aktuelle Daten durch die Datei ersetzen?')) return;
        S = { ...defaultState(), ...data.state };
        try { localStorage.setItem(CUSTOM_RECIPES_KEY, JSON.stringify(Array.isArray(data.customRecipes) ? data.customRecipes : [])); } catch (e) { /* ignorieren */ }
        invalidate();
        toast('Datenbank geladen.');
        render();
      } catch (e) { toast('Datei konnte nicht gelesen werden.'); }
    };
    reader.readAsText(file);
    return;
  }

  const p = S.persons.find(x => x.id === el.dataset.person);
  if (!p) return;
  if (field === 'name') p.name = String(el.value).trim().slice(0, 30) || p.name;
  if (field === 'kg') p.kg = clamp(Number(el.value) || p.kg, 30, 250);
  if (field === 'goal' && GOALS[el.value]) p.goal = el.value;
  render();
}

function submitForm(form) {
  if (form.id === 'builder-form') return submitBuilder(form);
  if (form.id === 'vault-form') return submitVault(form);
  if (form.id === 'extra-form') {
    const text = String(new FormData(form).get('text') || '').trim().slice(0, 80);
    if (!text) return;
    S.shopExtras.push({ id: 'x' + Date.now(), text });
    render();
  }
}

/* ==========================================================================
   INIT
   ========================================================================== */
function init() {
  S = loadState();
  syncWindow();

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (el) {
      if (el.disabled) return;
      e.preventDefault();
      handleAction(el.dataset.action, el.dataset);
    } else if (e.target.id === 'modal') {
      closeModal();
    }
  });
  document.addEventListener('change', e => {
    if (e.target.dataset && e.target.dataset.field) handleField(e.target);
  });
  document.addEventListener('input', e => {
    const id = e.target.id;
    if (id === 'picker-search') { ui.pickerQ = e.target.value; renderPickerList(); }
    if (id === 'pantry-search') { ui.pantryQ = e.target.value; renderPantryResults(); }
    if (id === 'offer-search') { ui.offerQ = e.target.value; renderOfferResults(); }
  });
  document.addEventListener('submit', e => { e.preventDefault(); submitForm(e.target); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  render();
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', init);
}
