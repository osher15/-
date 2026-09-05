/* ══════════════════════════════════════════════════════════
   תזונה שלי — לוגיקת האפליקציה
   כל הנתונים נשמרים מקומית במכשיר (localStorage). אין שרת,
   אין העלאה של מידע אישי לשום מקום.
   ══════════════════════════════════════════════════════════ */
'use strict';

const KEY = 'tzuna_state_v1';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const r0 = n => Math.round(n);
const r1 = n => Math.round(n * 10) / 10;

/* ---------- תאריכים ---------- */
const dkey = (d = new Date()) => {
  const x = new Date(d); x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
  return x.toISOString().slice(0, 10);
};
const addDays = (k, n) => { const d = new Date(k + 'T12:00:00'); d.setDate(d.getDate() + n); return dkey(d); };
const DAY_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const DAY_LETTER = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
const MON_HE = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const prettyDate = k => {
  const d = new Date(k + 'T12:00:00'), t = dkey();
  if (k === t) return 'היום';
  if (k === addDays(t, -1)) return 'אתמול';
  if (k === addDays(t, 1)) return 'מחר';
  return `יום ${DAY_HE[d.getDay()]}, ${d.getDate()} ב${MON_HE[d.getMonth()]}`;
};

/* ---------- קטגוריות ---------- */
const CATS = [
  { id: 'fav', n: 'מועדפים', e: '⭐' },
  { id: 'recent', n: 'אחרונים', e: '🕐' },
  { id: 'fruit', n: 'פירות', e: '🍎' },
  { id: 'veg', n: 'ירקות', e: '🥦' },
  { id: 'breakfast', n: 'ארוחת בוקר', e: '🍞' },
  { id: 'dairy', n: 'חלב וגבינות', e: '🧀' },
  { id: 'coffee', n: 'קפה ומשקאות חמים', e: '☕' },
  { id: 'drink_sweet', n: 'שתייה מתוקה', e: '🥤' },
  { id: 'protein', n: 'בשר, עוף ודגים', e: '🍗' },
  { id: 'carb', n: 'פחמימות', e: '🍚' },
  { id: 'legume', n: 'קטניות', e: '🫘' },
  { id: 'nuts', n: 'אגוזים וזרעים', e: '🌰' },
  { id: 'snack', n: 'חטיפים ומתוקים', e: '🍫' },
  { id: 'dish', n: 'מנות מוכנות', e: '🍽️' },
  { id: 'sauce', n: 'רטבים ותוספות', e: '🫒' },
  { id: 'custom', n: 'המאכלים שלי', e: '✏️' }
];
const MEALS = [
  { id: 'breakfast', n: 'ארוחת בוקר', e: '🌅' },
  { id: 'snack1', n: 'ביניים — בוקר', e: '🍎' },
  { id: 'lunch', n: 'ארוחת צהריים', e: '🌞' },
  { id: 'snack2', n: 'ביניים — אחה"צ', e: '🥜' },
  { id: 'dinner', n: 'ארוחת ערב', e: '🌙' },
  { id: 'extra', n: 'נשנושים ושתייה', e: '🍹' }
];

/* ══════════ מצב ══════════ */
let S = null;
let UI = { tab: 'today', date: dkey(), cat: 'recent', q: '' };

const blank = () => ({
  v: 1, profile: null, days: {}, weights: [], points: 0, badges: [],
  favs: [], recents: [], custom: [],
  settings: {
    theme: 'auto', notifications: false,
    stepGoal: 8000,
    // ברירת מחדל כבויה: היעד הקלורי כבר כולל את רמת הפעילות שבפרופיל,
    // ולכן הוספת פעילות יומיומית תיספר פעמיים
    burnAdjust: false,
    reminders: [
      { id: 'r1', time: '08:00', label: 'בוקר טוב! מה אכלת לארוחת בוקר?', on: true },
      { id: 'r2', time: '11:00', label: 'תזכורת מים — כוס עכשיו 💧', on: true },
      { id: 'r3', time: '14:00', label: 'תיעוד ארוחת צהריים', on: true },
      { id: 'r4', time: '17:00', label: 'טיפ היום מחכה לך 🌿', on: false },
      { id: 'r5', time: '21:00', label: 'סיכום יום — נשאר משהו לתעד?', on: true }
    ]
  }
});

function load() {
  try { S = JSON.parse(localStorage.getItem(KEY)) || blank(); }
  catch { S = blank(); }
  const b = blank();
  S.settings = Object.assign({}, b.settings, S.settings || {});
  for (const k of ['days', 'weights', 'badges', 'favs', 'recents', 'custom']) if (!S[k]) S[k] = b[k];
  if (typeof S.points !== 'number') S.points = 0;
}
let saveT;
function save() { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('אין מקום לשמור — נסי לפנות מקום במכשיר'); } }, 120); }

const day = (k = UI.date) => (S.days[k] ||= { entries: [], water: 0, note: '' });

/* ══════════ חישובי תזונה ══════════ */
function bmr(p) {
  const base = 10 * p.weight + 6.25 * p.height - 5 * p.age;
  return base + (p.sex === 'm' ? 5 : -161);
}
function computeTargets(p) {
  const B = bmr(p), tdee = B * p.activity;
  const perDay = (p.rate || 0.5) * 7700 / 7;              // 7700 קק"ל בק"ג שומן
  let kcal = tdee;
  if (p.goal === 'lose') kcal = tdee - perDay;
  if (p.goal === 'gain') kcal = tdee + perDay * 0.7;
  // רצפה בטיחותית — לא יורדים מתחת לחילוף החומרים במנוחה ולא מתחת למינימום מקובל
  const floor = Math.max(p.sex === 'f' ? 1200 : 1500, B * 0.95);
  kcal = Math.max(floor, kcal);

  const gPerKg = p.goal === 'keep' ? 1.2 : 1.6;
  const protein = clamp(r0(p.weight * gPerKg), 45, 200);
  const fat = r0(kcal * 0.28 / 9);
  const carbs = Math.max(50, r0((kcal - protein * 4 - fat * 9) / 4));
  return {
    kcal: r0(kcal),
    tdee: r0(tdee), bmr: r0(B),
    protein, fat, carbs,
    fiber: Math.max(25, r0(kcal / 1000 * 14)),
    water: clamp(r0(p.weight * 33 / 50) * 50, 1800, 4000),
    sugar: r0(kcal * 0.10 / 4),
    sugarIdeal: r0(kcal * 0.05 / 4),
    sodium: 2000,
    limited: kcal <= floor + 1
  };
}
const targets = () => S.profile ? (S.profile.custom || computeTargets(S.profile)) : computeTargets({ sex: 'f', age: 35, height: 165, weight: 68, activity: 1.375, goal: 'keep', rate: .5 });
/* היעד בפועל — היעד הבסיסי ועוד הקלוריות שנשרפו, אם המשתמשת ביקשה */
const kcalTarget = (k = UI.date) => targets().kcal + (typeof burnBonus === 'function' ? burnBonus(k) : 0);

function bmi(p = S.profile) { return p && p.height ? p.weight / Math.pow(p.height / 100, 2) : 0; }
function bmiInfo(v) {
  if (v < 18.5) return { l: 'תת-משקל', c: 'w', f: 'bmi_low' };
  if (v < 25) return { l: 'משקל תקין', c: 'p', f: '' };
  if (v < 30) return { l: 'עודף משקל', c: 'w', f: 'bmi_high' };
  if (v < 35) return { l: 'השמנה דרגה 1', c: 'd', f: 'bmi_high' };
  if (v < 40) return { l: 'השמנה דרגה 2', c: 'd', f: 'bmi_high' };
  return { l: 'השמנה דרגה 3', c: 'd', f: 'bmi_high' };
}

/* סיכום יומי */
function totals(k = UI.date) {
  const t = { kcal: 0, p: 0, ch: 0, ft: 0, fb: 0, sg: 0, na: 0, sgf: 0 };
  for (const e of day(k).entries) {
    t.kcal += e.kcal; t.p += e.p; t.ch += e.ch; t.ft += e.ft;
    t.fb += e.fb; t.sg += e.sg; t.na += e.na;
    t.sgf += (e.sgf ?? e.sg);          // רשומות ישנות נספרות כסוכר חופשי
  }
  return t;
}
function mealTotals(k = UI.date) {
  const m = {};
  for (const e of day(k).entries) m[e.meal] = (m[e.meal] || 0) + e.kcal;
  return m;
}

/* ══════════ מאגר המזון ══════════ */
const allFoods = () => [...(window.FOOD_DB || []), ...S.custom];
function findFood(n) { return allFoods().find(f => f.n === n); }
/* סוכר טבעי מול סוכר חופשי.
   ארגון הבריאות העולמי מגביל "סוכר חופשי" בלבד — סוכר שהוסף למזון,
   ובנוסף הסוכר שבמיצים, בדבש ובסירופים. הסוכר שבפרי שלם, בירק,
   בקטנייה ובחלב או יוגורט טבעי אינו נספר במכסה. */
const INTRINSIC = f =>
  (f.c === 'fruit' && !/מיץ|נקטר/.test(f.n)) ||
  f.c === 'veg' || f.c === 'legume' ||
  /^חלב |^יוגורט טבעי|^יוגורט 0%|^יוגורט יווני|^קוטג|^גבינה לבנה|^גבינת פטה|^ריקוטה|^לאבנה|^אשל/.test(f.n);

function nutFor(food, grams) {
  const r = grams / 100;
  return {
    kcal: food.k * r, p: food.p * r, ch: food.ch * r, ft: food.ft * r,
    fb: food.fb * r, sg: food.sg * r, na: food.na * r,
    sgf: INTRINSIC(food) ? 0 : food.sg * r
  };
}
function searchFoods(q) {
  q = q.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/);
  const out = [];
  for (const f of allFoods()) {
    const hay = (f.t || f.n).toLowerCase();
    if (!words.every(w => hay.includes(w))) continue;
    out.push({ f, score: f.n.toLowerCase().startsWith(q) ? 0 : f.n.toLowerCase().includes(q) ? 1 : 2 });
  }
  return out.sort((a, b) => a.score - b.score).slice(0, 60).map(x => x.f);
}

/* ══════════ נקודות, רמות והישגים ══════════ */
const LVL_STEP = 150;
const level = () => Math.floor(S.points / LVL_STEP) + 1;
const lvlProg = () => (S.points % LVL_STEP) / LVL_STEP;

function addPoints(n, why) {
  const before = level();
  S.points += n;
  if (level() > before) cheer('🚀', `רמה ${level()}!`, 'צברת מספיק נקודות כדי לעלות רמה. כל הכבוד!');
  else if (why) toast(`${why} +${n}`);
  save();
}
function grantBadge(id) {
  if (S.badges.includes(id)) return;
  const b = (window.BADGES || []).find(x => x.id === id); if (!b) return;
  S.badges.push(id); S.points += 25; save();
  cheer(b.i, b.n, b.d + ' · +25 נקודות');
}
function streak() {
  let n = 0, k = dkey();
  if (!(S.days[k] && S.days[k].entries.length)) k = addDays(k, -1);
  while (S.days[k] && S.days[k].entries.length) { n++; k = addDays(k, -1); }
  return n;
}
/* בדיקת יעדים והענקת הישגים — נקרא אחרי כל שינוי ביום */
function checkGoals(k = UI.date) {
  const T = targets(), t = totals(k), d = day(k), KT = kcalTarget(k);
  const done = {
    kcal: t.kcal >= KT * 0.85 && t.kcal <= KT * 1.1,
    protein: t.p >= T.protein * 0.9,
    fiber: t.fb >= T.fiber * 0.9,
    water: d.water >= T.water,
    sugar: t.sgf <= T.sugar && t.kcal > 0,
    // "מתחת למכסה" נחשב רק אחרי שתועד רוב היום, אחרת הוא ניתן בבוקר ומטעה
    sugarSolid: t.sgf <= T.sugar && t.kcal >= KT * 0.7
  };
  d.goals = done;
  const st = streak();
  if (S.days[dkey()] && S.days[dkey()].entries.length) grantBadge('first');
  if (st >= 3) grantBadge('streak3');
  if (st >= 7) grantBadge('streak7');
  if (st >= 14) grantBadge('streak14');
  if (st >= 30) grantBadge('streak30');
  if (st >= 100) grantBadge('streak100');
  if (done.water) grantBadge('water');
  if (done.protein) grantBadge('protein');
  if (done.fiber) grantBadge('fiber');
  if (done.sugarSolid) grantBadge('sugarlow');
  if (level() >= 5) grantBadge('lvl5');
  if (level() >= 10) grantBadge('lvl10');
  const vg = d.entries.filter(e => ['fruit', 'veg'].includes(e.cat)).length;
  if (vg >= 5) grantBadge('veg5');
  if (new Set(S.recents).size >= 50) grantBadge('explorer');
  if (S.weights.length >= 4) grantBadge('weigh4');
  if ((d.steps || 0) >= (typeof stepGoal === 'function' ? stepGoal() : 8000)) grantBadge('steps');
  const perfect = done.kcal && done.protein && done.water && done.sugar;
  if (perfect && !d.perfectAwarded) { d.perfectAwarded = 1; addPoints(20); grantBadge('perfect'); }
  const pdays = Object.values(S.days).filter(x => x.perfectAwarded).length;
  if (pdays >= 5) grantBadge('perfect5');
  const bdays = Object.values(S.days).filter(x => x.entries.some(e => e.meal === 'breakfast')).length;
  if (bdays >= 5) grantBadge('early');
  save();
  return done;
}

/* ══════════ הוספה והסרה של רשומות ══════════ */
function addEntry(food, unitIdx, qty, meal, k = UI.date) {
  const u = food.u[unitIdx] || food.u[0];
  const grams = u.g * qty;
  const n = nutFor(food, grams);
  day(k).entries.push({
    id: Date.now() + '' + Math.random().toString(36).slice(2, 6),
    name: food.n, e: food.e, cat: food.c, meal, grams: r1(grams),
    unit: qty === 1 ? u.l : `${r1(qty)} × ${u.l}`,
    kcal: r0(n.kcal), p: r1(n.p), ch: r1(n.ch), ft: r1(n.ft), fb: r1(n.fb),
    sg: r1(n.sg), sgf: r1(n.sgf), na: r0(n.na),
    ts: Date.now()
  });
  S.recents = [food.n, ...S.recents.filter(x => x !== food.n)].slice(0, 40);
  if (day(k).entries.length <= 15) addPoints(1);
  checkGoals(k);
  save();
}
function delEntry(id, k = UI.date) {
  const d = day(k);
  d.entries = d.entries.filter(e => e.id !== id);
  checkGoals(k); save(); render();
}
function addWater(ml, k = UI.date) {
  const d = day(k);
  const before = d.water;
  d.water = clamp(d.water + ml, 0, 8000);
  const T = targets();
  if (before < T.water && d.water >= T.water) { addPoints(5); cheer('💧', 'יעד המים הושג!', 'שתית את כל הכמות המומלצת היום. הגוף שלך מודה לך.'); }
  checkGoals(k); save(); render();
}

/* ══════════ הודעות ══════════ */
let toastT;
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => el.hidden = true, 2200);
}
let cheerT;
function cheer(icon, title, text) {
  const el = $('#cheer');
  el.innerHTML = `<div class="cc"><div class="ci">${icon}</div><h3>${esc(title)}</h3><p>${esc(text)}</p></div>`;
  el.hidden = false;
  if (navigator.vibrate) try { navigator.vibrate([18, 60, 30]); } catch {}
  clearTimeout(cheerT); cheerT = setTimeout(() => el.hidden = true, 2600);
  el.onclick = () => el.hidden = true;
}
function sheet(html) {
  $('#sheet-body').innerHTML = html;
  $('#sheet').hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeSheet() { $('#sheet').hidden = true; document.body.style.overflow = ''; }

/* ══════════════════════════════════════════════════════════
   מסך "היום"
   ══════════════════════════════════════════════════════════ */
function ring(pct, kcal, left) {
  const R = 58, C = 2 * Math.PI * R, p = clamp(pct, 0, 1.2);
  const col = pct > 1.1 ? 'var(--danger)' : pct > 1 ? 'var(--warn)' : 'var(--primary)';
  return `<div class="ring">
    <svg width="132" height="132" viewBox="0 0 132 132" aria-hidden="true">
      <circle class="ring-c" cx="66" cy="66" r="${R}" stroke="var(--surface-2)" stroke-width="13"/>
      <circle class="ring-c" cx="66" cy="66" r="${R}" stroke="${col}" stroke-width="13"
        stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - Math.min(p, 1))}"
        style="transition:stroke-dashoffset .7s cubic-bezier(.3,1,.5,1)"/>
    </svg>
    <div class="ring-txt"><b class="num">${r0(Math.abs(left))}</b><small>${left >= 0 ? 'קלוריות נותרו' : 'קלוריות מעל היעד'}</small></div>
  </div>`;
}
function macroBar(label, val, target, color, unit = 'ג׳', dec = 0) {
  const pct = target ? clamp(val / target, 0, 1) : 0;
  const f = n => dec ? r1(n).toFixed(1) : r0(n);
  // היחס עטוף ב-bdi יחיד כדי שסדר המספרים לא יתהפך בתוך טקסט RTL
  return `<div class="macro"><span class="mk">${label}</span>
    <span class="mbar"><i style="width:${pct * 100}%;background:${color}"></i></span>
    <span class="mv"><bdi>${f(val)} / ${f(target)}</bdi> ${unit}</span></div>`;
}

function viewToday() {
  const T = targets(), t = totals(), d = day(), mt = mealTotals();
  const KT = kcalTarget(), burned = burnToday();
  const left = KT - t.kcal, pct = t.kcal / KT;
  const name = S.profile?.name ? esc(S.profile.name) : '';
  const h = new Date().getHours();
  const hello = h < 11 ? 'בוקר טוב' : h < 16 ? 'צהריים טובים' : h < 20 ? 'אחר צהריים טובים' : 'ערב טוב';
  const tip = window.TIPS[(new Date(UI.date + 'T12:00').getTime() / 864e5 | 0) % window.TIPS.length];
  const st = streak();

  let html = '';

  /* ניווט בין ימים */
  html += `<div class="card flat" style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;margin-bottom:14px">
    <button class="btn sm ghost" data-day="-1" aria-label="יום קודם">›</button>
    <div style="text-align:center"><b style="font-size:15px">${prettyDate(UI.date)}</b>
      ${st > 1 ? `<div style="font-size:12px;color:var(--muted)">🔥 <bdi>${st}</bdi> ימים ברצף</div>` : ''}</div>
    <button class="btn sm ghost" data-day="1" ${UI.date >= dkey() ? 'disabled' : ''} aria-label="יום הבא">‹</button>
  </div>`;

  /* תזכורת שלא נענתה */
  const pend = pendingReminder();
  if (pend && UI.date === dkey()) html += `<div class="banner">🔔 ${esc(pend.label)}<button data-dismiss-rem="${pend.id}">הבנתי</button></div>`;

  /* קלוריות ומאקרו */
  html += `<div class="card">
    ${UI.date === dkey() ? `<div style="font-size:14px;color:var(--muted);margin-bottom:12px">${hello}${name ? ' ' + name : ''} 👋</div>` : ''}
    <div class="ring-wrap">
      ${ring(pct, t.kcal, left)}
      <div class="ring-side">
        <div style="font-size:13px;color:var(--muted)">נאכלו <b style="color:var(--ink);font-size:15px"><bdi>${r0(t.kcal)}</bdi></b> מתוך <bdi>${KT}</bdi> קק"ל${burned && S.settings.burnAdjust ? ` <span class="pill p">+<bdi>${burned}</bdi> מפעילות</span>` : ''}</div>
        ${macroBar('חלבון', t.p, T.protein, 'var(--blue)')}
        ${macroBar('פחמימות', t.ch, T.carbs, 'var(--warn)')}
        ${macroBar('שומן', t.ft, T.fat, 'var(--purple)')}
        ${macroBar('סיבים', t.fb, T.fiber, 'var(--primary)')}
      </div>
    </div>
  </div>`;

  /* מים */
  const cups = Math.round(T.water / 250), full = Math.floor(d.water / 250);
  html += `<div class="card">
    <div class="card-h"><h3>💧 מים</h3><span class="mv" style="color:var(--muted);font-size:13px"><bdi>${(d.water / 1000).toFixed(2)} / ${(T.water / 1000).toFixed(1)}</bdi> ליטר</span></div>
    <div class="water">${Array.from({ length: cups }, (_, i) => `<i class="${i < full ? 'on' : ''}">💧</i>`).join('')}</div>
    <div class="water-btns">
      <button class="btn sm soft" data-water="250">+ כוס</button>
      <button class="btn sm soft" data-water="500">+ בקבוק</button>
      <button class="btn sm ghost" data-water="-250">−</button>
    </div>
  </div>`;

  /* תנועה */
  {
    const steps = d.steps || 0, sg = stepGoal();
    const walks = (d.walks || []).length;
    html += `<div class="card">
      <div class="card-h"><h3>👣 תנועה</h3><button class="link" data-tab="activity">פתיחה ›</button></div>
      <div class="macro"><span class="mk">צעדים</span>
        <span class="mbar"><i style="width:${clamp(steps / sg, 0, 1) * 100}%;background:var(--primary)"></i></span>
        <span class="mv"><bdi>${steps.toLocaleString('he-IL')} / ${sg.toLocaleString('he-IL')}</bdi></span></div>
      <div class="chipsrow" style="margin-top:10px">
        <span class="pill b">🔥 <bdi>${burned}</bdi> קלוריות נשרפו</span>
        <span class="pill p">📏 <bdi>${(steps * strideM() / 1000).toFixed(1)}</bdi> ק"מ</span>
        ${walks ? `<span class="pill w">🛰️ <bdi>${walks}</bdi> מסלולים</span>` : ''}
      </div>
      <div class="quickrow">
        <button class="btn sm soft" id="edit-steps">✏️ עדכון צעדים</button>
        <button class="btn sm ghost" data-tab="activity">🛰️ הליכה עם GPS</button>
      </div></div>`;
  }

  /* סוכר ונתרן */
  const sPct = t.sgf / T.sugar, naPct = t.na / T.sodium;
  const natural = Math.max(0, t.sg - t.sgf);
  html += `<div class="card">
    <div class="card-h"><h3>מכסות יומיות</h3></div>
    ${macroBar('סוכר חופשי', t.sgf, T.sugar, sPct > 1 ? 'var(--danger)' : sPct > .8 ? 'var(--warn)' : 'var(--primary)')}
    ${macroBar('נתרן', t.na / 1000, T.sodium / 1000, naPct > 1 ? 'var(--danger)' : naPct > .8 ? 'var(--warn)' : 'var(--primary)', 'ג׳', 1)}
    <div style="font-size:12.5px;color:var(--muted);margin-top:10px;line-height:1.5">
      ${sPct > 1 ? '⚠️ עברת את מכסת הסוכר החופשי היומית (10% מהקלוריות, לפי המלצת ארגון הבריאות העולמי).'
        : `יעד אידיאלי: עד <bdi>${T.sugarIdeal}</bdi> גרם (5% מהקלוריות). מכסת הנתרן: <bdi>2000</bdi> מ"ג = כ-<bdi>5</bdi> גרם מלח.`}
      ${natural > 1 ? `<br>בנוסף <bdi>${r0(natural)}</bdi> גרם סוכר טבעי מפירות, ירקות וחלב — לא נספר במכסה.` : ''}
    </div>
  </div>`;

  /* ארוחות */
  html += `<div class="sec-title">הארוחות שלי</div>`;
  for (const m of MEALS) {
    const items = d.entries.filter(e => e.meal === m.id);
    html += `<div class="meal">
      <button class="meal-h" data-addmeal="${m.id}">
        <span class="mi">${m.e}</span><span class="mn">${m.n}</span>
        <span class="mc">${mt[m.id] ? r0(mt[m.id]) + ' קק"ל' : ''}</span>
        <span class="madd">+</span>
      </button>
      ${items.map(e => `<div class="entry">
        ${window.artSVG(findFood(e.name) || { n: e.name, c: e.cat || 'custom' }, 36)}
        <span class="et"><b>${esc(e.name)}</b><small>${esc(e.unit)}${/\d/.test(e.unit) ? '' : ` · <bdi>${r0(e.grams)}</bdi> גרם`} · חלבון <bdi>${r1(e.p)}</bdi> ג׳</small></span>
        <span class="ek num">${e.kcal}</span>
        <button class="ex" data-del="${e.id}" aria-label="מחיקה">✕</button>
      </div>`).join('')}
    </div>`;
  }

  /* טיפ יומי */
  html += `<div class="tip"><div class="ti">${tip.c}</div><div class="tt"><b>הטיפ של היום</b>${esc(tip.t)}</div></div>`;

  /* פתק */
  html += `<div class="card"><div class="card-h"><h3>📝 איך הרגשת היום?</h3></div>
    <textarea id="daynote" dir="rtl" placeholder="רמת אנרגיה, רעב, מצב רוח, מה עבד ומה פחות...">${esc(d.note || '')}</textarea></div>`;

  return html;
}

/* ══════════════════════════════════════════════════════════
   מסך "הוספה"
   ══════════════════════════════════════════════════════════ */
function foodRow(f) {
  const u = f.u[0];
  const k = r0(f.k * u.g / 100);
  return `<button class="fitem" data-food="${esc(f.n)}">
    ${window.artSVG(f, 44)}
    <span class="ft"><b>${esc(f.n)}</b><small>${esc(u.l)} · חלבון <bdi>${r1(f.p * u.g / 100)}</bdi> ג׳</small></span>
    <span class="fk"><b class="num">${k}</b><small>קק"ל</small></span>
  </button>`;
}
function viewAdd() {
  if (UI.cat === 'recent' && !S.recents.length && !UI.q) UI.cat = S.favs.length ? 'fav' : 'fruit';
  let list = [];
  if (UI.q) list = searchFoods(UI.q);
  else if (UI.cat === 'fav') list = S.favs.map(findFood).filter(Boolean);
  else if (UI.cat === 'recent') list = S.recents.map(findFood).filter(Boolean).slice(0, 25);
  else if (UI.cat === 'custom') list = S.custom;
  else list = allFoods().filter(f => f.c === UI.cat);

  let html = `<div class="searchbar"><span class="si">🔍</span>
    <input id="q" type="text" dir="rtl" placeholder="חיפוש מאכל — לדוגמה: תפוח, קפה, פיתה" value="${esc(UI.q)}" autocomplete="off" enterkeyhint="search"></div>`;

  if (!UI.q) {
    html += `<div class="catrow">${CATS.map(c => `<button data-cat="${c.id}" class="${UI.cat === c.id ? 'on' : ''}">${c.e} ${c.n}</button>`).join('')}</div>`;
  }

  if (!list.length) {
    html += `<div class="empty"><div class="ei">${UI.q ? '🔍' : UI.cat === 'fav' ? '⭐' : '🍽️'}</div>
      <b>${UI.q ? 'לא נמצא מאכל מתאים' : UI.cat === 'fav' ? 'עוד אין מועדפים' : UI.cat === 'recent' ? 'עוד לא תיעדת כלום' : 'הקטגוריה ריקה'}</b>
      <div style="margin-top:8px;font-size:14px">${UI.q ? 'אפשר להוסיף אותו כמאכל אישי' : UI.cat === 'fav' ? 'אפשר לסמן מאכל בכוכב מתוך חלון ההוספה' : ''}</div>
      <button class="btn soft" style="margin-top:16px" id="newfood">✏️ הוספת מאכל משלי</button></div>`;
  } else {
    html += `<div class="flist">${list.map(foodRow).join('')}</div>`;
    html += `<button class="btn ghost block" style="margin-top:14px" id="newfood">✏️ הוספת מאכל משלי</button>`;
  }
  return html;
}

/* חלון בחירת כמות */
let SHEET_FOOD = null;
function openFood(name, meal) {
  const f = findFood(name); if (!f) return;
  SHEET_FOOD = { f, ui: 0, qty: 1, meal: meal || guessMeal() };
  renderFoodSheet();
}
function guessMeal() {
  const h = new Date().getHours();
  if (h < 10) return 'breakfast';
  if (h < 12) return 'snack1';
  if (h < 15) return 'lunch';
  if (h < 18) return 'snack2';
  if (h < 22) return 'dinner';
  return 'extra';
}
function renderFoodSheet() {
  const { f, ui, qty, meal } = SHEET_FOOD;
  const g = f.u[ui].g * qty, n = nutFor(f, g);
  const fav = S.favs.includes(f.n);
  sheet(`
    <div class="sheet-h">${window.artSVG(f, 62)}
      <div style="flex:1"><h3>${esc(f.n)}</h3><small><bdi>${r0(g)}</bdi> גרם · <bdi>${f.k}</bdi> קק"ל ל-100 גרם</small></div>
      <button class="tb-btn" id="fav" style="background:${fav ? 'var(--warn-soft)' : 'var(--surface-2)'}">${fav ? '⭐' : '☆'}</button>
    </div>
    <label class="fld"><span>יחידת מדידה</span>
      <select id="unit">${f.u.map((u, i) => `<option value="${i}" ${i === ui ? 'selected' : ''}>${esc(u.l)}</option>`).join('')}</select></label>
    <label class="fld"><span>כמות</span>
      <div class="qty"><button data-q="-1">−</button><input id="qty" type="number" inputmode="decimal" step="0.5" min="0.5" value="${qty}"><button data-q="1">+</button></div></label>
    <div class="nutgrid">
      <div><b class="num">${r0(n.kcal)}</b><small>קלוריות</small></div>
      <div><b class="num">${r1(n.p)}</b><small>חלבון (ג׳)</small></div>
      <div><b class="num">${r1(n.ch)}</b><small>פחמימות (ג׳)</small></div>
      <div><b class="num">${r1(n.ft)}</b><small>שומן (ג׳)</small></div>
      <div><b class="num">${r1(n.fb)}</b><small>סיבים (ג׳)</small></div>
      <div><b class="num">${r1(n.sg)}</b><small>סוכר${n.sgf === 0 && n.sg > 0.5 ? ' טבעי' : ''} (ג׳)</small></div>
      <div><b class="num">${r0(n.na)}</b><small>נתרן (מ"ג)</small></div>
      <div><b class="num">${r0(n.kcal / targets().kcal * 100)}%</b><small>מהיעד היומי</small></div>
    </div>
    <label class="fld"><span>לאיזו ארוחה?</span>
      <select id="meal">${MEALS.map(m => `<option value="${m.id}" ${m.id === meal ? 'selected' : ''}>${m.e} ${m.n}</option>`).join('')}</select></label>
    <button class="btn primary block" id="doadd">הוספה ליומן</button>
  `);
}

/* חלון מאכל אישי */
function openNewFood() {
  sheet(`<div class="sheet-h"><span class="she">✏️</span><div><h3>מאכל משלי</h3><small>הזיני ערכים לכל 100 גרם, כמו שכתוב על האריזה</small></div></div>
    <label class="fld"><span>שם המאכל</span><input id="nf-n" type="text" dir="auto" placeholder="לדוגמה: העוגה של סבתא"></label>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <label class="fld"><span>קלוריות</span><input id="nf-k" type="number" inputmode="decimal" placeholder="0"></label>
      <label class="fld"><span>חלבון (ג׳)</span><input id="nf-p" type="number" inputmode="decimal" placeholder="0"></label>
      <label class="fld"><span>פחמימות (ג׳)</span><input id="nf-ch" type="number" inputmode="decimal" placeholder="0"></label>
      <label class="fld"><span>שומן (ג׳)</span><input id="nf-ft" type="number" inputmode="decimal" placeholder="0"></label>
      <label class="fld"><span>סיבים (ג׳)</span><input id="nf-fb" type="number" inputmode="decimal" placeholder="0"></label>
      <label class="fld"><span>סוכר (ג׳)</span><input id="nf-sg" type="number" inputmode="decimal" placeholder="0"></label>
    </div>
    <label class="fld"><span>נתרן (מ"ג ל-100 גרם)</span><input id="nf-na" type="number" inputmode="decimal" placeholder="0"></label>
    <label class="fld"><span>משקל מנה רגילה (גרם)</span><input id="nf-srv" type="number" inputmode="decimal" placeholder="לדוגמה 80"></label>
    <button class="btn primary block" id="nf-save">שמירת המאכל</button>`);
}
function saveNewFood() {
  const n = $('#nf-n').value.trim();
  if (!n) return toast('צריך שם למאכל');
  if (findFood(n)) return toast('כבר קיים מאכל בשם הזה');
  const num = id => Math.max(0, parseFloat($(id).value) || 0);
  const srv = num('#nf-srv') || 100;
  S.custom.push({
    n, c: 'custom', k: num('#nf-k'), p: num('#nf-p'), ch: num('#nf-ch'), ft: num('#nf-ft'),
    fb: num('#nf-fb'), sg: num('#nf-sg'), na: num('#nf-na'),
    u: [{ l: `מנה (~${r0(srv)} גרם)`, g: srv }, { l: '100 גרם', g: 100 }, { l: 'חצי מנה', g: srv / 2 }],
    e: '✏️', t: n
  });
  save(); closeSheet(); UI.cat = 'custom'; UI.q = ''; render();
  toast('המאכל נשמר 🎉');
}

/* ══════════════════════════════════════════════════════════
   מסך "תפריטים"
   ══════════════════════════════════════════════════════════ */
function menuTotals(m) {
  const t = { kcal: 0, p: 0, ch: 0, ft: 0, fb: 0, sg: 0, na: 0 };
  for (const items of Object.values(m.meals)) for (const [n, ui, q] of items) {
    const f = findFood(n); if (!f) continue;
    const x = nutFor(f, f.u[ui].g * q);
    for (const k in t) t[k] += x[k] ?? 0;
  }
  return t;
}
function viewMenus() {
  const sub = UI.menuSub || 'build';
  let html = `<div class="seg big"><button data-msub="build" class="${sub === 'build' ? 'on' : ''}">🧩 בונה תפריט</button>
    <button data-msub="ready" class="${sub === 'ready' ? 'on' : ''}">📋 תפריטים מוכנים</button></div>`;
  return html + (sub === 'build' ? viewBuilder() : viewReadyMenus());
}
function viewReadyMenus() {
  const T = targets();
  let html = `<div class="tip"><div class="ti">📋</div><div class="tt"><b>תפריטים מובנים</b>
    ימים שלמים שנבנו לפי עקרונות משרד הבריאות. אפשר לטעון תפריט ליום שלך ואז לערוך בחופשיות — הוא רק נקודת פתיחה.</div></div>`;

  html += `<div class="sec-title">היעד שלך: <bdi>${T.kcal}</bdi> קק"ל ביום</div>`;

  for (let i = 0; i < window.MENUS.length; i++) {
    const m = window.MENUS[i], t = menuTotals(m);
    const diff = t.kcal - T.kcal;
    const fit = Math.abs(diff) <= T.kcal * 0.12;
    html += `<details class="acc">
      <summary>${fit ? '✅' : '📄'} ${esc(m.name)}
        <span class="pill ${fit ? 'p' : 'b'}" style="margin-inline-start:6px"><bdi>${r0(t.kcal)}</bdi> קק"ל</span></summary>
      <div class="accb">
        <p style="margin:0 0 12px;color:var(--ink)">${esc(m.desc)}</p>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
          <span class="pill b">חלבון <bdi>${r0(t.p)}</bdi> ג׳</span>
          <span class="pill w">פחמימות <bdi>${r0(t.ch)}</bdi> ג׳</span>
          <span class="pill p">סיבים <bdi>${r0(t.fb)}</bdi> ג׳</span>
          <span class="pill ${t.sg > T.sugar ? 'd' : 'p'}">סוכר <bdi>${r0(t.sg)}</bdi> ג׳</span>
        </div>
        ${!fit ? `<div class="banner info" style="margin-bottom:14px">ℹ️ התפריט הזה ${diff > 0 ? 'גבוה' : 'נמוך'} ב-<bdi>${r0(Math.abs(diff))}</bdi> קק"ל מהיעד שלך — אפשר להתאים כמויות אחרי הטעינה.</div>` : ''}
        ${MEALS.filter(me => m.meals[me.id]).map(me => `
          <div style="margin-bottom:12px">
            <b style="font-size:14px">${me.e} ${me.n}</b>
            <ul style="margin:6px 0 0;padding-inline-start:20px;color:var(--muted)">
              ${m.meals[me.id].map(([n, ui, q]) => {
                const f = findFood(n); if (!f) return '';
                return `<li>${esc(n)} — ${q > 1 ? `<bdi>${q}</bdi> × ` : ''}${esc(f.u[ui].l)} <span class="num">(${r0(f.k * f.u[ui].g * q / 100)} קק"ל)</span></li>`;
              }).join('')}
            </ul>
          </div>`).join('')}
        <button class="btn primary block" data-loadmenu="${i}" style="margin-top:8px">טעינת התפריט ליום ${prettyDate(UI.date)}</button>
      </div>
    </details>`;
  }

  html += `<div class="sec-title">עקרונות מנחים</div>`;
  html += window.GUIDELINES.map(g => `<details class="acc"><summary>${g.i} ${esc(g.t)}</summary><div class="accb">${esc(g.d)}</div></details>`).join('');
  return html;
}
function loadMenu(i) {
  const m = window.MENUS[i]; if (!m) return;
  const d = day();
  if (d.entries.length && !confirm('ביומן של היום כבר יש רשומות. לטעון את התפריט בנוסף אליהן?')) return;
  for (const [mealId, items] of Object.entries(m.meals))
    for (const [n, ui, q] of items) { const f = findFood(n); if (f) addEntry(f, ui, q, mealId); }
  grantBadge('menu'); save();
  UI.tab = 'today'; render();
  toast('התפריט נטען ליומן ✅');
}

/* ══════════════════════════════════════════════════════════
   מסך "התקדמות"
   ══════════════════════════════════════════════════════════ */
function lastDays(n) { const out = []; for (let i = n - 1; i >= 0; i--) out.push(addDays(dkey(), -i)); return out; }

function weightChart() {
  const w = S.weights.slice(-24);
  if (w.length < 2) return `<div class="empty" style="padding:24px"><div class="ei">⚖️</div><b>עוד אין מספיק שקילות</b>
    <div style="font-size:14px;margin-top:6px">אחרי 2 שקילות יופיע כאן גרף מגמה</div></div>`;
  const vals = w.map(x => x.w), mn = Math.min(...vals), mx = Math.max(...vals);
  const pad = Math.max(0.5, (mx - mn) * 0.2), lo = mn - pad, hi = mx + pad;
  const W = 320, H = 140;
  // ציר X הפוך: הזמן מתקדם מימין לשמאל, בהתאם לכיוון הקריאה בעברית
  const px = i => W - 8 - (i / (w.length - 1)) * (W - 16);
  const py = v => H - 18 - ((v - lo) / (hi - lo)) * (H - 34);
  const pts = w.map((x, i) => `${px(i)},${py(x.w)}`).join(' ');
  const area = `${px(0)},${H - 18} ${pts} ${px(w.length - 1)},${H - 18}`;
  const first = w[0].w, last = w[w.length - 1].w, delta = last - first;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="גרף משקל">
      <line class="gl" x1="8" y1="${H - 18}" x2="${W - 8}" y2="${H - 18}"/>
      <polygon points="${area}" fill="var(--primary-soft)" opacity=".7"/>
      <polyline points="${pts}" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${w.map((x, i) => `<circle cx="${px(i)}" cy="${py(x.w)}" r="3.2" fill="var(--surface)" stroke="var(--primary)" stroke-width="2"/>`).join('')}
    </svg>
    <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-top:4px">
      <span><bdi>${last}</bdi> ק"ג · עכשיו</span>
      <span style="color:${delta < 0 ? 'var(--primary)' : delta > 0 ? 'var(--warn)' : 'var(--muted)'};font-weight:700">
        <bdi>${delta > 0 ? '+' : ''}${r1(delta)}</bdi> ק"ג</span>
      <span><bdi>${first}</bdi> ק"ג · התחלה</span>
    </div>`;
}
function kcalBars() {
  const T = targets(), days = lastDays(7);
  const vals = days.map(k => totals(k).kcal);
  const mx = Math.max(T.kcal * 1.15, ...vals, 1);
  return `<div class="bars">${days.map((k, i) => {
    const v = vals[i], hp = clamp(v / mx, 0, 1) * 100;
    const good = v > 0 && v >= T.kcal * .85 && v <= T.kcal * 1.1;
    const over = v > T.kcal * 1.1;
    return `<div class="bcol">
      <div class="bb ${good ? 'good' : over ? 'over' : ''}" style="height:${hp}%" title="${v} קק״ל"></div>
      <div class="bl">${k === dkey() ? 'היום' : DAY_LETTER[new Date(k + 'T12:00').getDay()]}</div>
    </div>`;
  }).join('')}</div>
  <div style="font-size:12px;color:var(--muted);text-align:center;margin-top:8px">
    ממוצע שבועי: <b class="num">${r0(vals.filter(v => v > 0).reduce((a, b) => a + b, 0) / Math.max(1, vals.filter(v => v > 0).length))}</b> קק"ל · יעד <b class="num">${T.kcal}</b></div>`;
}
function viewMe() {
  const sub = UI.meSub || 'progress';
  const head = `<div class="seg big"><button data-mesub="progress" class="${sub === 'progress' ? 'on' : ''}">📈 התקדמות</button>
    <button data-mesub="health" class="${sub === 'health' ? 'on' : ''}">🩺 בריאות</button></div>`;
  return head + (sub === 'progress' ? viewProgress() : viewHealth());
}
function viewProgress() {
  const T = targets(), st = streak(), lv = level();
  const logged = Object.values(S.days).filter(d => d.entries.length).length;
  const perfect = Object.values(S.days).filter(d => d.perfectAwarded).length;
  const p = S.profile;
  const b = bmi(), bi = bmiInfo(b);

  let html = `<div class="card">
    <div class="card-h"><h3>🏅 רמה <bdi>${lv}</bdi></h3><span class="num" style="color:var(--muted);font-size:13px">${S.points} נקודות</span></div>
    <div class="lvlbar"><i style="width:${lvlProg() * 100}%"></i></div>
    <div style="font-size:12.5px;color:var(--muted)">עוד <bdi>${LVL_STEP - (S.points % LVL_STEP)}</bdi> נקודות לרמה <bdi>${lv + 1}</bdi></div>
  </div>`;

  html += `<div class="stats">
    <div class="stat"><b class="num">🔥 ${st}</b><small>ימים ברצף</small></div>
    <div class="stat"><b class="num">📅 ${logged}</b><small>ימים תועדו</small></div>
    <div class="stat"><b class="num">🎯 ${perfect}</b><small>ימים מושלמים</small></div>
    <div class="stat"><b class="num">🏆 ${S.badges.length}/${window.BADGES.length}</b><small>הישגים</small></div>
  </div>`;

  html += `<div class="card"><div class="card-h"><h3>📊 קלוריות — 7 ימים</h3></div>${kcalBars()}</div>`;

  html += `<div class="card">
    <div class="card-h"><h3>⚖️ משקל</h3><button class="link" id="addweight">+ שקילה</button></div>
    ${weightChart()}
    ${p ? `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">
      <span class="pill ${bi.c}">BMI <bdi>${r1(b)}</bdi> · ${bi.l}</span>
      <span class="pill b">חילוף חומרים במנוחה <bdi>${T.bmr}</bdi> קק"ל</span>
      <span class="pill b">הוצאה יומית <bdi>${T.tdee}</bdi> קק"ל</span>
    </div>` : ''}
  </div>`;

  html += `<div class="card"><div class="card-h"><h3>🏆 ההישגים שלי</h3></div>
    <div class="badges">${window.BADGES.map(bd => {
      const on = S.badges.includes(bd.id);
      return `<div class="badge ${on ? 'on' : ''}" title="${esc(bd.d)}"><i>${on ? bd.i : '🔒'}</i><b>${esc(bd.n)}</b></div>`;
    }).join('')}</div></div>`;

  /* סיכום שבועי תזונתי */
  const wk = lastDays(7).map(k => ({ k, t: totals(k), d: S.days[k] })).filter(x => x.t.kcal > 0);
  if (wk.length) {
    const avg = f => r0(wk.reduce((a, x) => a + f(x), 0) / wk.length);
    html += `<div class="card"><div class="card-h"><h3>📈 ממוצעים שבועיים</h3></div>
      ${macroBar('חלבון', avg(x => x.t.p), T.protein, 'var(--blue)')}
      ${macroBar('סיבים', avg(x => x.t.fb), T.fiber, 'var(--primary)')}
      ${macroBar('סוכר חופשי', avg(x => x.t.sgf), T.sugar, avg(x => x.t.sgf) > T.sugar ? 'var(--danger)' : 'var(--primary)')}
      ${macroBar('מים', wk.reduce((a, x) => a + (x.d?.water || 0), 0) / wk.length / 1000, r1(T.water / 1000), 'var(--blue)', 'ל׳', 1)}
      <div style="font-size:13px;color:var(--muted);margin-top:12px;line-height:1.6">${weeklyInsight(wk, T)}</div>
    </div>`;
  }
  return html;
}
function weeklyInsight(wk, T) {
  const avg = f => wk.reduce((a, x) => a + f(x), 0) / wk.length;
  const out = [];
  if (avg(x => x.t.fb) < T.fiber * .7) out.push('הסיבים נמוכים — קטנייה אחת ביום או החלפת לחם לבן במלא יסגרו את הפער.');
  if (avg(x => x.t.p) < T.protein * .8) out.push('החלבון מתחת ליעד. ביצה, יוגורט יווני או קטניות בכל ארוחה יעזרו לשובע.');
  if (avg(x => x.t.sgf) > T.sugar) out.push('הסוכר החופשי גבוה מהמומלץ. שווה לבדוק מאיפה הוא מגיע — לרוב זו שתייה מתוקה או ממרחים.');
  if (avg(x => x.t.na) > 2000) out.push('הנתרן גבוה. לרוב מקורו במזון מוכן, גבינות מלוחות וחטיפים.');
  if (avg(x => (x.d?.water || 0)) < T.water * .7) out.push('שתיית המים נמוכה מהיעד — בקבוק קבוע על השולחן עושה פלאים.');
  if (!out.length) return '✨ שבוע מצוין! הממוצעים שלך קרובים ליעדים בכל הפרמטרים. ככה ממשיכים.';
  return '💡 ' + out.join(' ');
}

/* ══════════════════════════════════════════════════════════
   מסך "בריאות"
   ══════════════════════════════════════════════════════════ */
function activeFlags() {
  const p = S.profile; if (!p) return [];
  const f = [...(p.flags || [])];
  const bi = bmiInfo(bmi()); if (bi.f) f.push(bi.f);
  if (p.diet === 'vegan' || p.diet === 'veg') f.push('vegan');
  return [...new Set(f)];
}
function relevantScreenings() {
  const p = S.profile; if (!p) return [];
  return window.SCREENINGS.filter(s =>
    (s.s === 'all' || s.s === p.sex) &&
    p.age >= (s.minAge || 0) && p.age <= (s.maxAge || 200));
}
function upcomingScreenings() {
  const p = S.profile; if (!p) return [];
  return window.SCREENINGS.filter(s =>
    (s.s === 'all' || s.s === p.sex) && s.minAge > p.age && s.minAge - p.age <= 10)
    .sort((a, b) => a.minAge - b.minAge);
}
function viewHealth() {
  const p = S.profile, T = targets();
  const b = bmi(), bi = bmiInfo(b);
  const flags = activeFlags();
  let html = '';

  html += `<div class="card">
    <div class="card-h"><h3>👤 הפרופיל שלי</h3><button class="link" id="editprofile">עריכה</button></div>
    <div class="row"><div><div class="rl">${esc(p.name || 'ללא שם')}</div>
      <div class="rs">${p.sex === 'f' ? 'אישה' : 'גבר'} · <bdi>${p.age}</bdi> · <bdi>${p.height}</bdi> ס"מ · <bdi>${p.weight}</bdi> ק"ג</div></div>
      <span class="pill ${bi.c}">BMI <bdi>${r1(b)}</bdi></span></div>
    <div class="row"><div><div class="rl">${bi.l}</div><div class="rs">מדד BMI מחושב לפי גובה ומשקל בלבד ואינו מבחין בין שריר לשומן.</div></div></div>
  </div>`;

  html += `<div class="card"><div class="card-h"><h3>🎯 היעדים היומיים שלי</h3><button class="link" id="edittargets">התאמה</button></div>
    <div class="row"><div class="rl">קלוריות</div><b class="num">${T.kcal}</b></div>
    <div class="row"><div class="rl">חלבון</div><b class="num">${T.protein} ג׳</b></div>
    <div class="row"><div class="rl">פחמימות</div><b class="num">${T.carbs} ג׳</b></div>
    <div class="row"><div class="rl">שומן</div><b class="num">${T.fat} ג׳</b></div>
    <div class="row"><div class="rl">סיבים תזונתיים</div><b class="num">${T.fiber} ג׳</b></div>
    <div class="row"><div class="rl">מים</div><b class="num">${r1(T.water / 1000)} ל׳</b></div>
    <div class="row"><div class="rl">סוכר חופשי — מכסה</div><b class="num">${T.sugar} ג׳</b></div>
    <div class="row"><div class="rl">נתרן — מכסה</div><b class="num">${T.sodium} מ"ג</b></div>
    ${T.limited ? `<div class="banner" style="margin:14px 0 0">⚠️ היעד הוגבל לרצפה בטוחה. גירעון חד יותר עלול לפגוע במסת שריר ובחסרים תזונתיים.</div>` : ''}
  </div>`;

  /* בדיקות */
  const rel = relevantScreenings(), soon = upcomingScreenings();
  html += `<div class="sec-title">🩺 בדיקות שמומלץ לשקול בגילך</div>`;
  html += `<div class="banner info">ℹ️ מידע כללי בלבד, מבוסס על תוכניות הסקר הלאומיות בישראל. ההחלטה על כל בדיקה היא של רופא המשפחה שלך.</div>`;
  const byCat = {};
  rel.forEach(s => (byCat[s.cat] ||= []).push(s));
  for (const [cat, list] of Object.entries(byCat)) {
    html += `<div class="sec-title" style="margin-top:14px">${esc(cat)}</div>`;
    html += list.map(s => `<details class="acc"><summary>🔬 ${esc(s.n)}</summary>
      <div class="accb"><b style="color:var(--ink)">תדירות:</b> ${esc(s.freq)}<br><br>${esc(s.why)}</div></details>`).join('');
  }

  if (flags.length) {
    const cond = window.CONDITIONAL.filter(c => flags.includes(c.flag));
    if (cond.length) {
      html += `<div class="sec-title">📌 בהתאמה אישית למצב שלך</div>`;
      html += cond.map(c => `<details class="acc"><summary>⭐ ${esc(c.n)}</summary><div class="accb">${esc(c.why)}</div></details>`).join('');
    }
  }
  if (soon.length) {
    html += `<div class="sec-title">🗓️ בדיקות שיהפכו לרלוונטיות בשנים הקרובות</div>`;
    html += soon.map(s => `<details class="acc"><summary>⏳ ${esc(s.n)} <span class="pill b">מגיל <bdi>${s.minAge}</bdi></span></summary>
      <div class="accb">${esc(s.why)}<br><br><b style="color:var(--ink)">תדירות:</b> ${esc(s.freq)}</div></details>`).join('');
  }

  /* תזכורות */
  html += `<div class="sec-title">🔔 תזכורות יומיות</div><div class="card">
    <div class="row"><div><div class="rl">התראות במכשיר</div>
      <div class="rs">${notifState()}</div></div>
      <div class="sw ${S.settings.notifications ? 'on' : ''}" id="notif-sw" role="switch" aria-checked="${!!S.settings.notifications}"></div></div>
    ${S.settings.reminders.map(r => `<div class="row">
      <div style="flex:1"><div class="rl"><input type="time" value="${r.time}" data-remtime="${r.id}" style="min-height:38px;width:110px;display:inline-block;padding:0 8px"></div>
        <div class="rs">${esc(r.label)}</div></div>
      <div class="sw ${r.on ? 'on' : ''}" data-remsw="${r.id}" role="switch" aria-checked="${r.on}"></div></div>`).join('')}
    <div class="rs" style="padding-top:12px;line-height:1.6">באייפון ההתראות עובדות רק אחרי הוספת האפליקציה למסך הבית (שיתוף ← הוספה למסך הבית), ומגיעות כשהאפליקציה פתוחה או ברקע. גם בלי אישור התראות תופיע תזכורת בתוך האפליקציה.</div>
  </div>`;

  /* הגדרות */
  html += `<div class="sec-title">⚙️ הגדרות</div><div class="card">
    <div class="row"><div class="rl">מראה</div>
      <div class="seg" style="width:210px"><button data-theme="auto" class="${S.settings.theme === 'auto' ? 'on' : ''}">אוטומטי</button>
        <button data-theme="light" class="${S.settings.theme === 'light' ? 'on' : ''}">בהיר</button>
        <button data-theme="dark" class="${S.settings.theme === 'dark' ? 'on' : ''}">כהה</button></div></div>
    <div class="row"><div><div class="rl">גיבוי הנתונים</div><div class="rs">שמירת קובץ עם כל היומן, כדי להעביר למכשיר אחר</div></div>
      <button class="btn sm ghost" id="export">ייצוא</button></div>
    <div class="row"><div><div class="rl">שחזור מגיבוי</div><div class="rs">טעינת קובץ שיוצא קודם</div></div>
      <button class="btn sm ghost" id="import">ייבוא</button></div>
    <div class="row"><div><div class="rl" style="color:var(--danger)">איפוס הכול</div><div class="rs">מחיקת כל הנתונים מהמכשיר</div></div>
      <button class="btn sm danger" id="reset">איפוס</button></div>
  </div>`;

  html += `<div class="sec-title">📚 מקורות המידע</div><div class="card srclist">
    ${window.SOURCES.map(s => `<a href="${s.u}" target="_blank" rel="noopener">${esc(s.n)} ↗</a>`).join('')}</div>`;

  html += `<div class="disclaimer"><b>הבהרה חשובה.</b> האפליקציה נועדה למעקב ולהעלאת מודעות, ואינה מהווה ייעוץ רפואי, אבחון או תחליף לדיאטנית קלינית או לרופא.
    הערכים התזונתיים הם הערכה על בסיס מאגרי מזון מקובלים ועשויים להשתנות בין מוצרים ובין שיטות הכנה.
    במצבים רפואיים — הריון, הנקה, סוכרת, מחלת כליות, הפרעות אכילה או נטילת תרופות — יש להיוועץ באיש מקצוע לפני שינוי תזונתי.
    כל הנתונים נשמרים במכשיר שלך בלבד ואינם נשלחים לשום שרת.</div>`;
  return html;
}
function notifState() {
  if (!('Notification' in window)) return 'הדפדפן הזה אינו תומך בהתראות';
  if (Notification.permission === 'granted') return 'ההתראות מאושרות ✅';
  if (Notification.permission === 'denied') return 'ההתראות נחסמו בהגדרות הדפדפן';
  return 'לחיצה על המתג תבקש אישור';
}

/* ══════════════════════════════════════════════════════════
   תזכורות
   ══════════════════════════════════════════════════════════ */
const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
const t2m = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

/* תזכורת שהגיע זמנה היום ועדיין לא נצפתה */
function pendingReminder() {
  const seen = (S.seenRem ||= {}), k = dkey(), n = nowMin();
  for (const r of [...S.settings.reminders].sort((a, b) => t2m(b.time) - t2m(a.time))) {
    if (!r.on) continue;
    if (t2m(r.time) <= n && seen[k + r.id] !== 1) return r;
  }
  return null;
}
function dismissReminder(id) { (S.seenRem ||= {})[dkey() + id] = 1; save(); render(); }

let remTimers = [];
function scheduleNotifications() {
  remTimers.forEach(clearTimeout); remTimers = [];
  if (!S.settings.notifications || !('Notification' in window) || Notification.permission !== 'granted') return;
  const n = nowMin();
  for (const r of S.settings.reminders) {
    if (!r.on) continue;
    let delta = t2m(r.time) - n;
    if (delta <= 0) delta += 1440;                       // מחר
    if (delta > 16 * 60) continue;                       // רק חלון של 16 שעות קדימה
    remTimers.push(setTimeout(() => {
      fireNotification(r);
      scheduleNotifications();
    }, delta * 60000));
  }
}
async function fireNotification(r) {
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    const opts = { body: r.label, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: r.id, lang: 'he', dir: 'rtl' };
    if (reg) await reg.showNotification('תזונה שלי', opts);   // הדרך היחידה שעובדת ב-iOS
    else new Notification('תזונה שלי', opts);
  } catch { /* אם ההתראה נכשלה, הבאנר בתוך האפליקציה עדיין יופיע */ }
}
async function toggleNotifications() {
  if (!('Notification' in window)) return toast('הדפדפן הזה לא תומך בהתראות');
  if (S.settings.notifications) { S.settings.notifications = false; save(); scheduleNotifications(); render(); return; }
  let perm = Notification.permission;
  if (perm === 'default') { try { perm = await Notification.requestPermission(); } catch { perm = 'denied'; } }
  if (perm !== 'granted') {
    toast('ההתראות לא אושרו — התזכורות יופיעו בתוך האפליקציה');
    render(); return;
  }
  S.settings.notifications = true; save(); scheduleNotifications(); render();
  toast('התזכורות הופעלו 🔔');
}

/* ══════════════════════════════════════════════════════════
   חלונות עזר
   ══════════════════════════════════════════════════════════ */
function openWeightSheet() {
  const last = S.weights[S.weights.length - 1]?.w || S.profile?.weight || '';
  sheet(`<div class="sheet-h"><span class="she">⚖️</span><div><h3>שקילה</h3>
      <small>מומלץ פעם בשבוע, באותו יום ובאותה שעה, אחרי השירותים ולפני האוכל</small></div></div>
    <label class="fld"><span>משקל (ק"ג)</span><input id="w-val" type="number" inputmode="decimal" step="0.1" value="${last}"></label>
    <label class="fld"><span>תאריך</span><input id="w-date" type="date" value="${dkey()}" max="${dkey()}"></label>
    <button class="btn primary block" id="w-save">שמירה</button>`);
}
function saveWeight() {
  const w = parseFloat($('#w-val').value), d = $('#w-date').value || dkey();
  if (!w || w < 25 || w > 300) return toast('משקל לא תקין');
  S.weights = S.weights.filter(x => x.d !== d);
  S.weights.push({ d, w: r1(w) });
  S.weights.sort((a, b) => a.d < b.d ? -1 : 1);
  if (S.profile) { S.profile.weight = r1(w); if (S.profile.custom) delete S.profile.custom; }
  addPoints(5); checkGoals(); save(); closeSheet(); render();
  toast('נשמר. המשקל מתעדכן גם ביעדים ✅');
}
function openProfileSheet() {
  const p = S.profile;
  sheet(`<div class="sheet-h"><span class="she">👤</span><div><h3>עריכת הפרופיל</h3><small>שינוי הנתונים יחשב מחדש את היעדים</small></div></div>
    <label class="fld"><span>שם</span><input id="p-name" type="text" dir="auto" value="${esc(p.name || '')}"></label>
    <label class="fld"><span>מין</span><div class="seg" id="p-sex">
      <button type="button" data-v="f" class="${p.sex === 'f' ? 'on' : ''}">אישה</button>
      <button type="button" data-v="m" class="${p.sex === 'm' ? 'on' : ''}">גבר</button></div></label>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <label class="fld"><span>גיל</span><input id="p-age" type="number" inputmode="numeric" value="${p.age}"></label>
      <label class="fld"><span>גובה (ס"מ)</span><input id="p-height" type="number" inputmode="decimal" value="${p.height}"></label>
    </div>
    <label class="fld"><span>משקל (ק"ג)</span><input id="p-weight" type="number" inputmode="decimal" step="0.1" value="${p.weight}"></label>
    <label class="fld"><span>רמת פעילות</span><select id="p-activity">
      ${[[1.2, 'יושבנית — כמעט ללא פעילות'], [1.375, 'קלה — 1-3 אימונים בשבוע'], [1.55, 'בינונית — 3-5 אימונים'], [1.725, 'גבוהה — 6-7 אימונים'], [1.9, 'מאוד גבוהה — עבודה פיזית']]
        .map(([v, l]) => `<option value="${v}" ${+p.activity === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    <label class="fld"><span>מטרה</span><div class="seg vert" id="p-goal">
      <button type="button" data-v="lose" class="${p.goal === 'lose' ? 'on' : ''}">ירידה במשקל</button>
      <button type="button" data-v="keep" class="${p.goal === 'keep' ? 'on' : ''}">שמירה</button>
      <button type="button" data-v="gain" class="${p.goal === 'gain' ? 'on' : ''}">עלייה</button></div></label>
    <label class="fld"><span>קצב</span><select id="p-rate">
      ${[[.25, 'עדין — 0.25 ק"ג בשבוע'], [.5, 'מומלץ — 0.5 ק"ג בשבוע'], [.75, 'מהיר — 0.75 ק"ג בשבוע']]
        .map(([v, l]) => `<option value="${v}" ${+(p.rate || .5) === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    <label class="fld"><span>סגנון תזונה</span><select id="p-diet">
      ${[['all', 'הכול'], ['veg', 'צמחוני'], ['vegan', 'טבעוני'], ['gf', 'ללא גלוטן']]
        .map(([v, l]) => `<option value="${v}" ${p.diet === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    <label class="fld"><span>מצבים רלוונטיים</span><div class="chips" id="p-flags">
      ${[['pregnancy', 'בהריון / מתכננת'], ['breastfeeding', 'מניקה'], ['family_diabetes', 'סוכרת במשפחה'], ['hypertension', 'לחץ דם גבוה'], ['anemia', 'אנמיה'], ['thyroid', 'בלוטת התריס']]
        .map(([v, l]) => `<button type="button" data-v="${v}" class="${(p.flags || []).includes(v) ? 'on' : ''}">${l}</button>`).join('')}</div></label>
    <button class="btn primary block" id="p-save">שמירה</button>`);
}
function saveProfile() {
  const p = S.profile;
  p.name = $('#p-name').value.trim();
  p.sex = $('#p-sex .on')?.dataset.v || p.sex;
  p.age = clamp(parseInt($('#p-age').value) || p.age, 14, 110);
  p.height = clamp(parseFloat($('#p-height').value) || p.height, 120, 220);
  p.weight = clamp(parseFloat($('#p-weight').value) || p.weight, 30, 250);
  p.activity = parseFloat($('#p-activity').value);
  p.goal = $('#p-goal .on')?.dataset.v || p.goal;
  p.rate = parseFloat($('#p-rate').value);
  p.diet = $('#p-diet').value;
  p.flags = $$('#p-flags button.on').map(b => b.dataset.v);
  delete p.custom;
  save(); closeSheet(); render(); toast('הפרופיל עודכן ✅');
}
function openTargetsSheet() {
  const T = targets(), auto = computeTargets(S.profile);
  sheet(`<div class="sheet-h"><span class="she">🎯</span><div><h3>התאמת יעדים</h3>
      <small>המערכת מחשבת אוטומטית לפי משוואת Mifflin-St Jeor. אפשר לעקוף ידנית.</small></div></div>
    <div class="banner info">מחושב אוטומטית: <bdi>${auto.kcal}</bdi> קק"ל · חלבון <bdi>${auto.protein}</bdi> ג׳</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <label class="fld"><span>קלוריות</span><input id="t-kcal" type="number" inputmode="numeric" value="${T.kcal}"></label>
      <label class="fld"><span>חלבון (ג׳)</span><input id="t-protein" type="number" inputmode="numeric" value="${T.protein}"></label>
      <label class="fld"><span>פחמימות (ג׳)</span><input id="t-carbs" type="number" inputmode="numeric" value="${T.carbs}"></label>
      <label class="fld"><span>שומן (ג׳)</span><input id="t-fat" type="number" inputmode="numeric" value="${T.fat}"></label>
      <label class="fld"><span>סיבים (ג׳)</span><input id="t-fiber" type="number" inputmode="numeric" value="${T.fiber}"></label>
      <label class="fld"><span>מים (מ"ל)</span><input id="t-water" type="number" inputmode="numeric" step="250" value="${T.water}"></label>
    </div>
    <button class="btn primary block" id="t-save">שמירה</button>
    <button class="btn ghost block" style="margin-top:10px" id="t-auto">חזרה לחישוב האוטומטי</button>`);
}
function saveTargets() {
  const auto = computeTargets(S.profile);
  const num = (id, def) => Math.max(1, parseInt($(id).value) || def);
  S.profile.custom = Object.assign({}, auto, {
    kcal: clamp(num('#t-kcal', auto.kcal), 800, 6000),
    protein: num('#t-protein', auto.protein), carbs: num('#t-carbs', auto.carbs),
    fat: num('#t-fat', auto.fat), fiber: num('#t-fiber', auto.fiber),
    water: clamp(num('#t-water', auto.water), 500, 6000), limited: false
  });
  save(); closeSheet(); render(); toast('היעדים עודכנו ✅');
}

function openStepsSheet() {
  const d = day();
  sheet(`<div class="sheet-h"><span class="she">👣</span><div><h3>עדכון ידני</h3>
      <small>אפשר להעתיק את המספר מאפליקציית הבריאות או מהשעון</small></div></div>
    <label class="fld"><span>צעדים ב${prettyDate(UI.date)}</span>
      <input id="st-val" type="number" inputmode="numeric" min="0" max="200000" value="${d.steps || ''}" placeholder="לדוגמה 8500"></label>
    <label class="fld"><span>קלוריות שנשרפו באימון (לא חובה)</span>
      <input id="st-burn" type="number" inputmode="numeric" min="0" max="5000" value="${d.burnManual || ''}" placeholder="לדוגמה 250"></label>
    <button class="btn primary block" id="steps-save">שמירה</button>`);
}
function saveSteps() {
  const d = day();
  const v = parseInt($('#st-val').value), b = parseInt($('#st-burn').value);
  d.steps = (v >= 0 && v < 200000) ? v : 0;
  d.burnManual = (b >= 0 && b < 5000) ? b : 0;
  checkGoals(); save(); closeSheet(); render();
  toast('עודכן ✅');
}

/* ייצוא / ייבוא */
function exportData() {
  const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `תזונה-שלי-גיבוי-${dkey()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('קובץ הגיבוי נוצר 💾');
}
function importData() {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'application/json,.json';
  inp.onchange = () => {
    const file = inp.files?.[0]; if (!file) return;
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const obj = JSON.parse(fr.result);
        if (!obj || typeof obj !== 'object' || !('days' in obj)) throw 0;
        if (!confirm('הייבוא יחליף את כל הנתונים הקיימים במכשיר. להמשיך?')) return;
        S = obj; load2(); save(); render(); toast('הנתונים שוחזרו ✅');
      } catch { toast('הקובץ לא תקין'); }
    };
    fr.readAsText(file);
  };
  inp.click();
}
function load2() {   // נירמול אחרי ייבוא
  const b = blank();
  S.settings = Object.assign({}, b.settings, S.settings || {});
  for (const k of ['days', 'weights', 'badges', 'favs', 'recents', 'custom']) if (!S[k]) S[k] = b[k];
  applyTheme();
}

/* ══════════════════════════════════════════════════════════
   מסך פתיחה
   ══════════════════════════════════════════════════════════ */
let obStep = 1;
const obData = { sex: 'f', goal: 'lose', flags: [] };
function obShow() {
  $$('.ob-step').forEach(s => s.hidden = +s.dataset.step !== obStep);
  $$('.ob-dots i').forEach((d, i) => d.classList.toggle('on', i === obStep - 1));
  $('#ob-back').hidden = obStep === 1;
  $('#ob-next').textContent = obStep === 4 ? 'יוצאים לדרך 🚀' : 'המשך';
  $('#ob-rate-wrap').hidden = obData.goal === 'keep';
  if (obStep === 4) obPreview();
}
function obPreview() {
  const p = obDraft(); if (!p) return;
  const T = computeTargets(p), b = p.weight / Math.pow(p.height / 100, 2), bi = bmiInfo(b);
  $('#ob-preview').innerHTML = `<div style="margin-bottom:8px">היעד היומי שלך:</div>
    <b class="num">${T.kcal}</b> קלוריות · חלבון <b class="num">${T.protein}</b> ג׳ · מים <b class="num">${r1(T.water / 1000)}</b> ליטר
    <div style="margin-top:10px;font-size:13px;opacity:.85">BMI <bdi>${r1(b)}</bdi> — ${bi.l} · חילוף חומרים במנוחה <bdi>${T.bmr}</bdi> קק"ל</div>`;
}
function obDraft() {
  const age = parseInt($('#ob-age').value), h = parseFloat($('#ob-height').value), w = parseFloat($('#ob-weight').value);
  if (!age || !h || !w) return null;
  return {
    name: $('#ob-name').value.trim(), sex: obData.sex,
    age: clamp(age, 14, 110), height: clamp(h, 120, 220), weight: clamp(w, 30, 250),
    activity: parseFloat($('#ob-activity').value), goal: obData.goal,
    rate: parseFloat($('#ob-rate').value), diet: $('#ob-diet').value, flags: obData.flags
  };
}
function obNext() {
  if (obStep === 1) {
    if (!$('#ob-name').value.trim()) return toast('נעים להכיר — איך לקרוא לך?');
    const a = parseInt($('#ob-age').value);
    if (!a || a < 14 || a > 110) return toast('צריך גיל תקין (14 ומעלה)');
  }
  if (obStep === 2) {
    const h = parseFloat($('#ob-height').value), w = parseFloat($('#ob-weight').value);
    if (!h || h < 120 || h > 220) return toast('צריך גובה תקין בסנטימטרים');
    if (!w || w < 30 || w > 250) return toast('צריך משקל תקין בקילוגרמים');
  }
  if (obStep === 4) {
    const p = obDraft(); if (!p) { obStep = 2; return obShow(); }
    p.startWeight = p.weight;
    S.profile = p;
    S.weights.push({ d: dkey(), w: p.weight });
    save();
    $('#onboard').hidden = true; $('#app').hidden = false;
    render();
    cheer('🎉', `יאללה ${p.name || ''}!`, 'הכול מוכן. כל תיעוד מזכה בנקודות — בואי נתחיל.');
    return;
  }
  obStep++; obShow();
}

/* ══════════════════════════════════════════════════════════
   רינדור וניתוב
   ══════════════════════════════════════════════════════════ */
const TITLES = { today: 'היום', add: 'הוספת מזון', activity: 'תנועה', menus: 'תפריטים', me: 'אני' };
function render() {
  if (!S.profile) return;
  const v = $('#view');
  const keepQ = document.activeElement?.id === 'q';
  const sel = keepQ ? [$('#q').selectionStart, $('#q').selectionEnd] : null;

  v.innerHTML = UI.tab === 'today' ? viewToday()
    : UI.tab === 'add' ? viewAdd()
      : UI.tab === 'activity' ? viewActivity()
        : UI.tab === 'menus' ? viewMenus()
          : viewMe();

  $('#tb-title').textContent = TITLES[UI.tab];
  const t = totals(), T = targets();
  $('#tb-sub').innerHTML = UI.tab === 'today'
    ? `<bdi>${r0(t.kcal)} / ${kcalTarget()}</bdi> קק"ל · 🔥 <bdi>${streak()}</bdi>`
    : UI.tab === 'activity'
      ? `<bdi>${(day().steps || 0).toLocaleString('he-IL')}</bdi> צעדים · <bdi>${burnToday()}</bdi> קק"ל`
      : `<bdi>${S.points}</bdi> נקודות`;
  $('#tb-level').textContent = level();
  $$('.tab').forEach(b => b.classList.toggle('on', b.dataset.tab === UI.tab));

  if (keepQ) { const q = $('#q'); if (q) { q.focus(); try { q.setSelectionRange(sel[0], sel[1]); } catch {} } }
}
function go(tab) { UI.tab = tab; if (tab !== 'add') UI.q = ''; window.scrollTo({ top: 0 }); render(); }

function applyTheme() {
  const t = S.settings.theme;
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}

/* ══════════════════════════════════════════════════════════
   אירועים
   ══════════════════════════════════════════════════════════ */
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-tab],[data-day],[data-water],[data-del],[data-addmeal],[data-cat],[data-food],[data-loadmenu],[data-theme],[data-remsw],[data-dismiss-rem],[data-q],[data-close],[data-msub],[data-mesub],[data-split],[data-bdiet],[data-bkcal],[data-swap],[data-delwalk],[data-stepgoal],button');
  if (!el) return;
  const d = el.dataset || {};

  if (d.tab) return go(d.tab);
  if (d.close !== undefined) return closeSheet();
  if (d.day) {
    const n = addDays(UI.date, +d.day);
    if (n <= dkey()) { UI.date = n; UI.manualDate = n !== dkey(); render(); }
    return;
  }
  if (d.water) return addWater(+d.water);
  if (d.del) return delEntry(d.del);
  if (d.addmeal) {
    UI.tab = 'add'; UI.q = ''; UI.pendMeal = d.addmeal;
    // קטגוריית פתיחה שיש בה תוכן, כדי שהמסך לא ייפתח ריק
    if (UI.cat === 'recent' && !S.recents.length) UI.cat = S.favs.length ? 'fav' : 'fruit';
    render(); return;
  }
  if (d.cat) { UI.cat = d.cat; UI.q = ''; render(); return; }
  if (d.food) { openFood(d.food, UI.pendMeal); UI.pendMeal = null; return; }
  if (d.loadmenu) return loadMenu(+d.loadmenu);
  if (d.theme) { S.settings.theme = d.theme; save(); applyTheme(); render(); return; }
  if (d.dismissRem) return dismissReminder(d.dismissRem);
  if (d.msub) { UI.menuSub = d.msub; window.scrollTo({ top: 0 }); render(); return; }
  if (d.mesub) { UI.meSub = d.mesub; window.scrollTo({ top: 0 }); render(); return; }
  if (d.split) { (UI.build ||= {}).split = d.split; render(); return; }
  if (d.bdiet) { (UI.build ||= {}).diet = d.bdiet; render(); return; }
  if (d.bkcal) { (UI.build ||= {}).kcal = +d.bkcal; render(); return; }
  if (d.swap) { const [m, i] = d.swap.split(':'); return swapItem(m, +i); }
  if (d.delwalk) return delWalk(d.delwalk);
  if (d.stepgoal) { S.settings.stepGoal = +d.stepgoal; save(); render(); return; }
  if (d.remsw) {
    const r = S.settings.reminders.find(x => x.id === d.remsw);
    if (r) { r.on = !r.on; save(); scheduleNotifications(); render(); }
    return;
  }
  if (d.q && SHEET_FOOD) {
    SHEET_FOOD.qty = Math.max(0.5, r1(SHEET_FOOD.qty + (+d.q) * 0.5));
    return renderFoodSheet();
  }

  switch (el.id) {
    case 'btn-level': { UI.meSub = 'progress'; return go('me'); }
    case 'doadd': {
      const { f, ui, qty, meal } = SHEET_FOOD;
      addEntry(f, ui, qty, meal); closeSheet();
      UI.tab = 'today'; render(); toast(`${f.n} נוסף ליומן ✅`);
      return;
    }
    case 'fav': {
      const n = SHEET_FOOD.f.n;
      S.favs = S.favs.includes(n) ? S.favs.filter(x => x !== n) : [n, ...S.favs];
      save(); renderFoodSheet(); return;
    }
    case 'newfood': return openNewFood();
    case 'nf-save': return saveNewFood();
    case 'addweight': return openWeightSheet();
    case 'w-save': return saveWeight();
    case 'editprofile': return openProfileSheet();
    case 'p-save': return saveProfile();
    case 'edittargets': return openTargetsSheet();
    case 't-save': return saveTargets();
    case 't-auto': { delete S.profile.custom; save(); closeSheet(); render(); toast('חזרנו לחישוב האוטומטי'); return; }
    case 'notif-sw': return toggleNotifications();
    case 'walk-start': return walkStart();
    case 'walk-stop': return walkStop();
    case 'ped-sw': {
      if (ACT.ped.on) { pedometerStop(); render(); }
      else { pedometerStart().then(render); }
      return;
    }
    case 'burn-sw': {
      S.settings.burnAdjust = !S.settings.burnAdjust;
      save(); render(); return;
    }
    case 'edit-steps': return openStepsSheet();
    case 'steps-save': return saveSteps();
    case 'import-health': return importHealthXML();
    case 'copy-url': {
      const txt = $('#sc-url')?.textContent || '';
      (navigator.clipboard?.writeText(txt) || Promise.reject())
        .then(() => toast('הכתובת הועתקה ✅'))
        .catch(() => toast('אפשר להעתיק ידנית מהמסך'));
      return;
    }
    case 'do-build': {
      BUILT = buildMenu(UI.build || {});
      window.scrollTo({ top: 0 }); render();
      toast('התפריט מוכן 🎉'); return;
    }
    case 'load-built': return loadBuilt();
    case 'export': return exportData();
    case 'import': return importData();
    case 'reset':
      if (confirm('למחוק את כל הנתונים לצמיתות? מומלץ לייצא גיבוי קודם.')) {
        localStorage.removeItem(KEY); location.reload();
      }
      return;
    case 'ob-next': return obNext();
    case 'ob-back': { obStep = Math.max(1, obStep - 1); obShow(); return; }
  }

  /* מקטעי בחירה בתוך טפסים */
  const seg = el.closest('.seg');
  if (seg && el.dataset.v) {
    [...seg.children].forEach(c => c.classList.toggle('on', c === el));
    if (seg.id === 'ob-sex') obData.sex = el.dataset.v;
    if (seg.id === 'ob-goal') { obData.goal = el.dataset.v; $('#ob-rate-wrap').hidden = obData.goal === 'keep'; }
    return;
  }
  const chips = el.closest('.chips');
  if (chips && el.dataset.v) {
    el.classList.toggle('on');
    if (chips.id === 'ob-flags') obData.flags = $$('#ob-flags button.on').map(b => b.dataset.v);
    return;
  }
});

document.addEventListener('input', ev => {
  const t = ev.target;
  if (t.id === 'q') { UI.q = t.value; render(); return; }
  if (t.id === 'daynote') { day().note = t.value; save(); return; }
  if (t.id === 'unit' && SHEET_FOOD) { SHEET_FOOD.ui = +t.value; renderFoodSheet(); return; }
  if (t.id === 'qty' && SHEET_FOOD) {
    const v = parseFloat(t.value);
    if (v > 0) { SHEET_FOOD.qty = v; const s = $('#sheet-body'); const pos = t.selectionStart; renderFoodSheet(); const q = $('#qty'); if (q) { q.focus(); try { q.setSelectionRange(pos, pos); } catch {} } }
    return;
  }
  if (t.dataset.remtime) {
    const r = S.settings.reminders.find(x => x.id === t.dataset.remtime);
    if (r && t.value) { r.time = t.value; save(); scheduleNotifications(); }
    return;
  }
  if (t.closest('.ob-step')) { if (obStep === 4) obPreview(); }
});
document.addEventListener('change', ev => {
  const t = ev.target;
  if (t.id === 'meal' && SHEET_FOOD) SHEET_FOOD.meal = t.value;
  if (t.id === 'ob-activity' || t.id === 'ob-rate' || t.id === 'ob-diet') { if (obStep === 4) obPreview(); }
});
document.addEventListener('keydown', ev => {
  if (ev.key === 'Escape' && !$('#sheet').hidden) closeSheet();
  if (ev.key === 'Enter' && $('#onboard') && !$('#onboard').hidden && ev.target.tagName === 'INPUT') { ev.preventDefault(); obNext(); }
});

/* מעבר יום / חזרה לאפליקציה */
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible' || !S.profile) return;
  // חזרה אוטומטית ל"היום" רק אם המשתמשת לא ניווטה בעצמה ליום אחר
  if (!UI.manualDate) UI.date = dkey();
  scheduleNotifications();
  render();
});

/* ══════════════════════════════════════════════════════════
   הפעלה
   ══════════════════════════════════════════════════════════ */
function boot() {
  load();
  applyTheme();
  if (S.profile) {
    $('#app').hidden = false;
    UI.date = dkey();
    ingestURL();
    render();
    scheduleNotifications();
    // מד הצעדים דורש מחווה של המשתמשת כדי לקבל אישור, ולכן רק מסומן כדולק
    if (S.settings.pedometer && typeof DeviceMotionEvent !== 'undefined'
        && typeof DeviceMotionEvent.requestPermission !== 'function') {
      window.addEventListener('devicemotion', onMotion); ACT.ped.on = true;
    }
  } else {
    $('#onboard').hidden = false;
    obShow();
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  // רענון בחצות כדי שהיום יתחלף מעצמו
  const ms = new Date().setHours(24, 0, 5, 0) - Date.now();
  const rollover = () => { UI.manualDate = false; UI.date = dkey(); render(); };
  setTimeout(() => { rollover(); setInterval(rollover, 864e5); }, ms);
}
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();
