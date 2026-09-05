/* ══════════════════════════════════════════════════════════
   בונה תפריט לפי קטגוריות מאקרו — חלבון, פחמימות, שומן וסיבים.
   הבנייה נעשית בשני שלבים: בחירת פריטים לפי תפקידם בארוחה,
   ואז כיול הכמויות כדי להגיע ליעד הקלורי ולפילוח המבוקש.
   ══════════════════════════════════════════════════════════ */
'use strict';

/* פילוחי מאקרו מקובלים (אחוז מהקלוריות) */
const SPLITS = [
  { id: 'balanced', n: 'מאוזן', e: '⚖️', p: .20, c: .50, f: .30,
    d: 'הפילוח שמשרד הבריאות ממליץ עליו לרוב האוכלוסייה — בסיס של דגנים מלאים, ירקות וקטניות.' },
  { id: 'protein', n: 'עתיר חלבון', e: '💪', p: .30, c: .40, f: .30,
    d: 'יותר חלבון בכל ארוחה. משביע לאורך זמן ושומר על מסת שריר בזמן ירידה במשקל.' },
  { id: 'lowcarb', n: 'דל פחמימות', e: '🥑', p: .30, c: .25, f: .45,
    d: 'פחות פחמימות, יותר שומן איכותי וחלבון. מתאים למי שמרגישה נפילות אנרגיה אחרי ארוחות.' },
  { id: 'fiber', n: 'עשיר בסיבים', e: '🌾', p: .20, c: .52, f: .28,
    d: 'דגש על קטניות, דגנים מלאים, ירקות ופירות. תומך בעיכול, בשובע ובאיזון הסוכר.' },
  { id: 'medi', n: 'ים-תיכוני', e: '🫒', p: .18, c: .45, f: .37,
    d: 'שמן זית, דגים, קטניות ואגוזים. התבנית התזונתית עם הבסיס המחקרי החזק ביותר לבריאות הלב.' }
];

/* ---------- סיווג פריטים לתפקידים בארוחה ---------- */
const ROLE_CACHE = new Map();
function rolesOf(f) {
  if (ROLE_CACHE.has(f.n)) return ROLE_CACHE.get(f.n);
  const k = Math.max(f.k, 1);
  const pP = f.p * 4 / k, cP = f.ch * 4 / k, fP = f.ft * 9 / k;
  const r = new Set();
  if (pP >= .28 && f.p >= 8) r.add('protein');
  if (cP >= .5 && f.ch >= 12) r.add('carb');
  if (fP >= .55 && f.ft >= 8) r.add('fat');
  if (f.fb >= 3) r.add('fiber');
  if (f.c === 'veg') r.add('veg');
  if (f.c === 'fruit') r.add('fruit');
  if (f.c === 'dairy') r.add('dairy');
  if (f.c === 'legume') { r.add('legume'); r.add('protein'); r.add('fiber'); }
  if (f.c === 'nuts') r.add('nuts');
  const out = [...r];
  ROLE_CACHE.set(f.n, out);
  return out;
}
const hasRole = (f, role) => rolesOf(f).includes(role);

/* פריטים שלא שייכים לתפריט מתוכנן */
/* עשבי תיבול ותבלינים — מרכיבים, לא מנות */
const GARNISH = /פטרוזיליה|כוסברה|שמיר|נענע|בצל ירוק|^שום$|נבטים|צנון|סלרי|חמוצים|מלח|ממתיק/;

const EXCLUDE = /ריבה|^דבש|סילאן|^חמאה|^מרגרינה|^שמנת|רוטב סויה|קולה|ספרייט|פאנטה|שוופס|אנרגיה|לימונדה|אייס טי|משקה קל|סוכר|ממתיק|מלח|מרגרינה|נקניק|במבה|ביסלי|צ׳יפס|דוריטוס|בייגלה|סוכריות|וופל|קרמבו|ארטיק|גלידה|סופגנייה|עוגת|מאפין|רוגלך|בורקס|חלבה|מיונז|קטשופ|שווארמה|המבורגר|פיצה|שניצל עוף מטוגן|מילקשייק|בירה|יין|כיף כף|נוטלה|ממרח שוקולד/;

function dietOK(f, diet) {
  const n = f.n;
  if (diet === 'vegan' && /עוף|הודו|בקר|כבש|קבב|בשר|דג|סלמון|טונה|דניס|לברק|מושט|בקלה|שרימפס|ביצ|חביתה|שקשוקה|גבינ|קוטג|יוגורט|חלב [0-9]|לאבנה|אשל|חמאה|שמנת|ריקוטה|מוצרלה|פטה|בולגרית|דבש|סחלב/.test(n)) return false;
  if (diet === 'veg' && /עוף|הודו|בקר|כבש|קבב|בשר|דג |סלמון|טונה|דניס|לברק|מושט|בקלה|שרימפס|פסטרמה/.test(n)) return false;
  if (diet === 'gf' && /לחם|פיתה|לחמנייה|בייגל|חלה|פסטה|קוסקוס|בורגול|פתיתים|קורנפלקס|גרנולה|קרקר|טורטייה|מלאווח|ג׳חנון|שיבולת שועל|קוואקר|דייסת|לזניה|קובה/.test(n)) return false;
  return true;
}

/* מאגר מסונן, מקובץ לפי תפקיד */
function pools(diet) {
  const base = (window.FOOD_DB || []).filter(f => !EXCLUDE.test(f.n) && dietOK(f, diet));
  const pick = fn => base.filter(fn);
  return {
    proteinAnimal: pick(f => hasRole(f, 'protein') && ['protein', 'dairy'].includes(f.c)),
    proteinPlant: pick(f => hasRole(f, 'protein') && ['legume', 'nuts'].includes(f.c) || /טופו/.test(f.n)),
    dairy: pick(f => f.c === 'dairy' && f.p >= 5),
    egg: pick(f => /ביצה|חביתה|שקשוקה/.test(f.n)),
    carb: pick(f => hasRole(f, 'carb') && ['carb', 'breakfast'].includes(f.c)),
    carbWhole: pick(f => hasRole(f, 'carb') && hasRole(f, 'fiber') && ['carb', 'breakfast'].includes(f.c)),
    veg: pick(f => f.c === 'veg' && f.k < 100 && !GARNISH.test(f.n)),
    vegHi: pick(f => f.c === 'veg' && f.fb >= 2 && !GARNISH.test(f.n)),
    fruit: pick(f => f.c === 'fruit' && !/מיובש|צימוקים|^תמר|סלט פירות/.test(f.n)),
    fat: pick(f => hasRole(f, 'fat') && ['sauce', 'nuts', 'fruit'].includes(f.c) && !/^שמן קנולה/.test(f.n)),
    nuts: pick(f => f.c === 'nuts' && !/חמאת|שומשום|זרעי/.test(f.n)),
    legume: pick(f => f.c === 'legume'),
    drink: pick(f => f.c === 'coffee' && !/סוכר|סחלב|שוקו/.test(f.n)),
    soup: pick(f => /מרק/.test(f.n))
  };
}

/* מבנה הארוחות — לכל משבצת תפקיד ומשקל קלורי יחסי */
function template(split) {
  const hp = split.id === 'protein', lc = split.id === 'lowcarb', hf = split.id === 'fiber';
  return [
    { meal: 'breakfast', share: .25, slots: [
      { pool: hf ? 'carbWhole' : 'carb', w: lc ? .2 : .38 },
      { pool: Math.random() < .5 ? 'egg' : 'dairy', w: .34 },
      { pool: 'veg', w: .14 },
      { pool: 'drink', w: .14 }
    ] },
    { meal: 'snack1', share: .12, slots: [
      { pool: 'fruit', w: .6 }, { pool: 'nuts', w: .4 }
    ] },
    { meal: 'lunch', share: .32, slots: [
      { pool: hp ? 'proteinAnimal' : (Math.random() < .45 ? 'proteinPlant' : 'proteinAnimal'), w: .40 },
      { pool: lc ? 'vegHi' : (hf ? 'carbWhole' : 'carb'), w: .33 },
      { pool: 'vegHi', w: .17 },
      { pool: 'fat', w: .10 }
    ] },
    { meal: 'snack2', share: .11, slots: [
      { pool: 'dairy', w: .55 }, { pool: hf ? 'fruit' : 'fruit', w: .45 }
    ] },
    { meal: 'dinner', share: .20, slots: [
      { pool: hf ? 'legume' : (Math.random() < .5 ? 'proteinAnimal' : 'proteinPlant'), w: .45 },
      { pool: 'veg', w: .30 },
      { pool: lc ? 'fat' : 'carbWhole', w: .25 }
    ] }
  ];
}

/* בחירת פריט מהמאגר, בלי לחזור על מה שכבר נבחר */
function choose(pool, used) {
  const list = (pool || []).filter(f => !used.has(f.n));
  const src = list.length ? list : (pool || []);
  if (!src.length) return null;
  const f = src[Math.floor(Math.random() * src.length)];
  used.add(f.n);
  return f;
}
/* היחידה שהכי קרובה ליעד קלורי, והכמות המתאימה */
/* כמה יחידות סביר להגיש מהפריט הזה בארוחה אחת */
function maxQty(f) {
  if (f.c === 'sauce') return 1.5;          // שמן וטחינה — כפית או שתיים
  return 2;                                  // אף פריט לא מוגש יותר מפעמיים במנה
}
function fitPortion(f, targetKcal) {
  const cap = maxQty(f);
  let best = null;
  f.u.forEach((u, i) => {
    const per = f.k * u.g / 100;
    if (per <= 0) return;
    let q = clamp(Math.round((targetKcal / per) * 2) / 2, .5, cap);
    const err = Math.abs(per * q - targetKcal);
    // מעדיפים יחידה טבעית שמצריכה כמות קרובה ל-1
    const natural = Math.abs(q - 1) * per * 0.15;
    const score = err + natural;
    if (!best || score < best.score) best = { ui: i, q, err, score, kcal: per * q };
  });
  if (!best) best = { ui: 0, q: 1, err: 0, score: 0 };
  return best;
}

/* ---------- הבנייה ---------- */
function buildMenu(opts) {
  const T = targets();
  const kcal = opts.kcal || T.kcal;
  const split = SPLITS.find(s => s.id === opts.split) || SPLITS[0];
  const P = pools(opts.diet || 'all');
  const used = new Set();
  const meals = {};

  for (const m of template(split)) {
    const budget = kcal * m.share;
    const items = [];
    for (const slot of m.slots) {
      const f = choose(P[slot.pool], used);
      if (!f) continue;
      const fit = fitPortion(f, budget * slot.w);
      items.push([f.n, fit.ui, fit.q]);
    }
    if (items.length) meals[m.meal] = items;
  }

  /* כיול: מותחים או מכווצים כמויות עד שמתקרבים ליעד */
  const totalOf = ms => {
    let t = { kcal: 0, p: 0, ch: 0, ft: 0, fb: 0, sg: 0, na: 0, sgf: 0 };
    for (const items of Object.values(ms)) for (const [n, ui, q] of items) {
      const f = findFood(n); if (!f) continue;
      const x = nutFor(f, f.u[ui].g * q);
      for (const k in t) t[k] += (x[k] || 0);
    }
    return t;
  };
  for (let pass = 0; pass < 4; pass++) {
    const t = totalOf(meals);
    if (!t.kcal) break;
    const ratio = kcal / t.kcal;
    if (Math.abs(1 - ratio) < 0.05) break;
    for (const items of Object.values(meals)) for (const it of items) {
      const f = findFood(it[0]); if (!f) continue;
      it[2] = clamp(Math.round(it[2] * ratio * 2) / 2, 0.5, maxQty(f));
    }
  }
  /* אם הכמויות נחסמו בתקרה והתפריט עדיין רזה מדי — מוסיפים פריט משלים */
  let t = totalOf(meals);
  const filler = split.id === 'lowcarb' ? ['nuts', 'fat', 'proteinAnimal']
    : split.id === 'protein' ? ['proteinAnimal', 'dairy', 'nuts']
      : ['carbWhole', 'nuts', 'fruit'];
  for (let guard = 0; guard < 3 && t.kcal < kcal * 0.93; guard++) {
    let added = false;
    for (const key of filler) {
      const f = choose(P[key], used); if (!f) continue;
      const fit = fitPortion(f, kcal - t.kcal);
      (meals.snack2 ||= []).push([f.n, fit.ui, fit.q]);
      t = totalOf(meals); added = true; break;
    }
    if (!added) break;
  }
  return { meals, totals: t, split, kcal, diet: opts.diet || 'all' };
}

/* ---------- מסך בונה התפריט ---------- */
let BUILT = null;
function macroDonut(t, split, size = 132) {
  const k = Math.max(t.kcal, 1);
  const seg = [
    { v: t.p * 4 / k, c: 'var(--blue)', l: 'חלבון' },
    { v: t.ch * 4 / k, c: 'var(--warn)', l: 'פחמימות' },
    { v: t.ft * 9 / k, c: 'var(--purple)', l: 'שומן' }
  ];
  const R = size / 2 - 12, C = 2 * Math.PI * R;
  let off = 0;
  const arcs = seg.map(s => {
    const len = C * clamp(s.v, 0, 1);
    const el = `<circle cx="${size / 2}" cy="${size / 2}" r="${R}" fill="none" stroke="${s.c}" stroke-width="13"
      stroke-dasharray="${len} ${C}" stroke-dashoffset="${-off}"/>`;
    off += len; return el;
  }).join('');
  return `<div class="ring" style="width:${size}px;height:${size}px">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
      <circle cx="${size / 2}" cy="${size / 2}" r="${R}" fill="none" stroke="var(--surface-2)" stroke-width="13"/>
      ${arcs}</svg>
    <div class="ring-txt"><b class="num">${r0(t.kcal)}</b><small>קק"ל</small></div></div>`;
}
function macroLegend(t, split) {
  const k = Math.max(t.kcal, 1);
  const rows = [
    ['חלבון', t.p * 4 / k, split.p, 'var(--blue)', r0(t.p) + ' ג׳'],
    ['פחמימות', t.ch * 4 / k, split.c, 'var(--warn)', r0(t.ch) + ' ג׳'],
    ['שומן', t.ft * 9 / k, split.f, 'var(--purple)', r0(t.ft) + ' ג׳']
  ];
  return rows.map(([l, act, tgt, c, g]) => `<div class="legrow">
    <i style="background:${c}"></i><span>${l}</span>
    <b class="num">${Math.round(act * 100)}%</b>
    <small>יעד <bdi>${Math.round(tgt * 100)}%</bdi> · <bdi>${g}</bdi></small></div>`).join('');
}

function viewBuilder() {
  const T = targets();
  const cur = UI.build || (UI.build = { split: 'balanced', diet: S.profile?.diet || 'all', kcal: T.kcal });
  let html = `<div class="hero">
    <div class="hero-i">🧩</div>
    <div><h3>בונה התפריט</h3><p>בוחרים פילוח מאקרו — והמערכת מרכיבה יום שלם שמגיע בדיוק ליעד הקלורי שלך.</p></div>
  </div>`;

  html += `<div class="sec-title">1 · פילוח המאקרו</div><div class="splits">
    ${SPLITS.map(s => `<button class="split ${cur.split === s.id ? 'on' : ''}" data-split="${s.id}">
      <i>${s.e}</i><b>${s.n}</b>
      <span><bdi>${Math.round(s.p * 100)}</bdi>/<bdi>${Math.round(s.c * 100)}</bdi>/<bdi>${Math.round(s.f * 100)}</bdi></span>
    </button>`).join('')}</div>
    <div class="hint">${esc(SPLITS.find(s => s.id === cur.split).d)}</div>`;

  html += `<div class="sec-title">2 · סגנון תזונה</div><div class="chips" id="bd-diet">
    ${[['all', 'הכול'], ['veg', 'צמחוני'], ['vegan', 'טבעוני'], ['gf', 'ללא גלוטן']]
      .map(([v, l]) => `<button data-bdiet="${v}" class="${cur.diet === v ? 'on' : ''}">${l}</button>`).join('')}</div>`;

  html += `<div class="sec-title">3 · יעד קלורי</div><div class="chips">
    ${[T.kcal - 200, T.kcal, T.kcal + 200].map(v =>
      `<button data-bkcal="${v}" class="${cur.kcal === v ? 'on' : ''}"><bdi>${v}</bdi> קק"ל</button>`).join('')}</div>`;

  html += `<button class="btn primary block big" id="do-build" style="margin-top:18px">
    ${BUILT ? '🔄 בניית תפריט אחר' : '✨ בניית התפריט שלי'}</button>`;

  if (BUILT) {
    const t = BUILT.totals, sp = BUILT.split;
    html += `<div class="card" style="margin-top:16px">
      <div class="card-h"><h3>${sp.e} ${esc(sp.n)}</h3><span class="pill p">מוכן</span></div>
      <div class="ring-wrap">${macroDonut(t, sp)}<div class="ring-side">${macroLegend(t, sp)}</div></div>
      <div class="chipsrow">
        <span class="pill ${t.fb >= T.fiber ? 'p' : 'w'}">סיבים <bdi>${r0(t.fb)}</bdi> ג׳ · יעד <bdi>${T.fiber}</bdi></span>
        <span class="pill ${(t.sgf ?? t.sg) <= T.sugar ? 'p' : 'd'}">סוכר חופשי <bdi>${r0(t.sgf ?? t.sg)}</bdi> ג׳</span>
        <span class="pill ${t.na <= 2000 ? 'p' : 'w'}">נתרן <bdi>${r0(t.na)}</bdi> מ"ג</span>
      </div>
    </div>`;

    for (const m of MEALS.filter(m => BUILT.meals[m.id])) {
      const items = BUILT.meals[m.id];
      const mk = items.reduce((a, [n, ui, q]) => {
        const f = findFood(n); return a + (f ? f.k * f.u[ui].g * q / 100 : 0);
      }, 0);
      html += `<div class="meal"><div class="meal-h static">
        <span class="mi">${m.e}</span><span class="mn">${m.n}</span><span class="mc num">${r0(mk)} קק"ל</span></div>
        ${items.map(([n, ui, q], i) => {
          const f = findFood(n); if (!f) return '';
          const g = f.u[ui].g * q;
          return `<div class="entry">
            ${window.artSVG(f, 34)}
            <span class="et"><b>${esc(f.n)}</b><small>${q > 1 ? `<bdi>${q}</bdi> × ` : ''}${esc(f.u[ui].l)} · חלבון <bdi>${r1(f.p * g / 100)}</bdi> ג׳</small></span>
            <span class="ek num">${r0(f.k * g / 100)}</span>
            <button class="ex" data-swap="${m.id}:${i}" aria-label="החלפה" title="החלפת הפריט">⇄</button>
          </div>`;
        }).join('')}
      </div>`;
    }
    html += `<button class="btn primary block" id="load-built" style="margin-top:14px">טעינת התפריט ליומן של ${prettyDate(UI.date)}</button>
      <div class="hint">אחרי הטעינה אפשר לערוך כל פריט ביומן — זו רק נקודת פתיחה.</div>`;
  }
  return html;
}

/* החלפת פריט בודד בתפריט שנבנה */
function swapItem(mealId, idx) {
  if (!BUILT) return;
  const items = BUILT.meals[mealId]; if (!items || !items[idx]) return;
  const cur = findFood(items[idx][0]); if (!cur) return;
  const P = pools(BUILT.diet);
  const roles = rolesOf(cur);
  const usedNames = new Set(Object.values(BUILT.meals).flat().map(x => x[0]));
  let cands = (window.FOOD_DB || []).filter(f =>
    f.c === cur.c && !EXCLUDE.test(f.n) && dietOK(f, BUILT.diet) && !usedNames.has(f.n));
  if (!cands.length) cands = (window.FOOD_DB || []).filter(f => f.c === cur.c && !usedNames.has(f.n));
  if (!cands.length) return toast('אין חלופה מתאימה');
  const target = cur.k * cur.u[items[idx][1]].g * items[idx][2] / 100;
  const f = cands[Math.floor(Math.random() * cands.length)];
  const fit = fitPortion(f, target);
  items[idx] = [f.n, fit.ui, fit.q];
  BUILT.totals = (() => {
    let t = { kcal: 0, p: 0, ch: 0, ft: 0, fb: 0, sg: 0, na: 0, sgf: 0 };
    for (const its of Object.values(BUILT.meals)) for (const [n, ui, q] of its) {
      const ff = findFood(n); if (!ff) continue;
      const x = nutFor(ff, ff.u[ui].g * q);
      for (const k in t) t[k] += (x[k] || 0);
    }
    return t;
  })();
  render();
}
function loadBuilt() {
  if (!BUILT) return;
  const d = day();
  if (d.entries.length && !confirm('ביומן כבר יש רשומות. לטעון את התפריט בנוסף אליהן?')) return;
  for (const [mealId, items] of Object.entries(BUILT.meals))
    for (const [n, ui, q] of items) { const f = findFood(n); if (f) addEntry(f, ui, q, mealId); }
  grantBadge('menu'); save();
  UI.tab = 'today'; render();
  toast('התפריט נטען ליומן ✅');
}
