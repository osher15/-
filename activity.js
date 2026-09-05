/* ══════════════════════════════════════════════════════════
   מודול תנועה — GPS, מד צעדים, וגשר לאפליקציית הבריאות של אפל.

   מה באמת אפשר לעשות מתוך אפליקציית ווב באייפון, ומה לא:
   • מיקום GPS — כן, דרך Geolocation API, באישור המשתמשת.
   • ספירת צעדים — כן, דרך חיישני התאוצה (DeviceMotion), אבל רק
     כשהאפליקציה פתוחה על המסך. אין גישה למד הצעדים של המערכת.
   • קריאה ישירה מאפליקציית "בריאות" (HealthKit) — לא. אפל
     חוסמת את זה לאפליקציות ווב. לכן יש כאן שני גשרים חוקיים:
     קיצור דרך (Shortcuts) ששולח את הנתונים בכתובת, וייבוא של
     קובץ הייצוא מאפליקציית הבריאות.
   • אפל ווטש — התראות האפליקציה מוצגות בשעון, וקיצור דרך יכול
     לרוץ מהשעון. לחיישני השעון עצמם אין גישה מהדפדפן.
   ══════════════════════════════════════════════════════════ */
'use strict';

const ACT = {
  watchId: null, wakeLock: null, walk: null, tick: null,
  ped: { on: false, last: 0, lastPeak: 0, buf: [], baseline: 9.81 }
};

/* ---------- עזרי חישוב ---------- */
const R_EARTH = 6371000;
function haversine(a, b) {
  const t1 = a[0] * Math.PI / 180, t2 = b[0] * Math.PI / 180;
  const dt = t2 - t1, dl = (b[1] - a[1]) * Math.PI / 180;
  const x = Math.sin(dt / 2) ** 2 + Math.cos(t1) * Math.cos(t2) * Math.sin(dl / 2) ** 2;
  return 2 * R_EARTH * Math.asin(Math.sqrt(x));
}
/* MET לפי מהירות הליכה/ריצה — לפי מדריך הפעילות הגופנית (Ainsworth) */
function metFor(kmh) {
  if (kmh < 3.2) return 2.0;
  if (kmh < 4.8) return 3.0;
  if (kmh < 5.6) return 3.5;
  if (kmh < 6.5) return 5.0;
  if (kmh < 8.0) return 7.0;
  if (kmh < 9.7) return 9.8;
  return 11.5;
}
const bodyWeight = () => (S.profile?.weight || 70);
/* אורך צעד מוערך לפי גובה — מקדם מקובל 0.415 */
const strideM = () => ((S.profile?.height || 165) * 0.415) / 100;
function kcalFromSteps(steps) {
  const km = steps * strideM() / 1000;
  return Math.round(0.75 * bodyWeight() * km);   // ההוצאה הנטו להליכה
}
const stepGoal = () => S.settings.stepGoal || 8000;

/* קלוריות שנשרפו היום מכל המקורות */
function burnToday(k = UI.date) {
  const d = day(k);
  const fromWalks = (d.walks || []).reduce((a, w) => a + w.kcal, 0);
  const fromSteps = kcalFromSteps(Math.max(0, (d.steps || 0) - (d.stepsInWalks || 0)));
  return Math.round(fromWalks + fromSteps + (d.burnManual || 0));
}
/* תוספת הקלוריות ליעד היומי, אם המשתמשת ביקשה */
function burnBonus(k = UI.date) {
  return S.settings.burnAdjust ? burnToday(k) : 0;
}

/* ---------- מד צעדים (חיישני תאוצה) ---------- */
async function pedometerStart() {
  if (ACT.ped.on) return true;
  if (typeof DeviceMotionEvent === 'undefined') { toast('המכשיר הזה לא מדווח על תנועה'); return false; }
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    let res;
    try { res = await DeviceMotionEvent.requestPermission(); } catch { res = 'denied'; }
    if (res !== 'granted') { toast('לא ניתן אישור לחיישני התנועה'); return false; }
  }
  window.addEventListener('devicemotion', onMotion);
  ACT.ped.on = true; S.settings.pedometer = true; save();
  toast('מד הצעדים פועל — כל עוד האפליקציה פתוחה');
  return true;
}
function pedometerStop() {
  window.removeEventListener('devicemotion', onMotion);
  ACT.ped.on = false; S.settings.pedometer = false; save();
}
/* זיהוי צעד: מחליקים את עוצמת התאוצה ומחפשים שיא מעל סף,
   עם מרווח מינימלי בין צעדים כדי לא לספור רעידות. */
function onMotion(e) {
  const a = e.accelerationIncludingGravity; if (!a) return;
  const mag = Math.hypot(a.x || 0, a.y || 0, a.z || 0);
  const p = ACT.ped;
  p.baseline = p.baseline * 0.9 + mag * 0.1;          // מסנן מעביר-נמוכים
  const dev = mag - p.baseline;
  p.buf.push(dev); if (p.buf.length > 6) p.buf.shift();
  const now = Date.now();
  const rising = p.buf.length === 6 && p.buf[3] > 1.1 && p.buf[3] >= Math.max(...p.buf);
  if (rising && now - p.lastPeak > 280) {
    p.lastPeak = now;
    const d = day(dkey());
    d.steps = (d.steps || 0) + 1;
    if (d.steps % 25 === 0) { save(); if (UI.tab === 'activity') render(); }
    if (d.steps === stepGoal()) {
      cheer('🎉', 'יעד הצעדים הושג!', `${stepGoal().toLocaleString('he-IL')} צעדים היום. גוף שמח.`);
      addPoints(10);
    }
  }
}

/* ---------- מסלול GPS ---------- */
async function walkStart() {
  if (!navigator.geolocation) return toast('אין תמיכה במיקום במכשיר הזה');
  ACT.walk = { id: 'w' + Date.now(), start: Date.now(), dist: 0, kcal: 0, pts: [], acc: null, paused: false };
  try {
    ACT.watchId = navigator.geolocation.watchPosition(onFix, onFixErr,
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 });
  } catch { return toast('לא ניתן להתחיל מעקב מיקום'); }
  try { ACT.wakeLock = await navigator.wakeLock?.request('screen'); } catch {}
  ACT.tick = setInterval(() => { if (UI.tab === 'activity') render(); }, 1000);
  if (navigator.vibrate) try { navigator.vibrate(30); } catch {}
  render();
}
function onFix(pos) {
  const w = ACT.walk; if (!w || w.paused) return;
  const { latitude: la, longitude: lo, accuracy: ac } = pos.coords;
  w.acc = ac;
  if (ac > 40) return;                                  // דיוק גרוע מדי — מתעלמים
  const p = [la, lo, Date.now()];
  const last = w.pts[w.pts.length - 1];
  if (last) {
    const d = haversine(last, p), dt = (p[2] - last[2]) / 1000;
    if (d < 1.5) return;                                // רעש עמידה במקום
    if (dt > 0 && d / dt > 12) return;                  // קפיצה לא סבירה (מעל 43 קמ"ש)
    w.dist += d;
    const kmh = (d / 1000) / (dt / 3600);
    w.kcal += metFor(kmh) * bodyWeight() * (dt / 3600);
  }
  w.pts.push(p);
}
function onFixErr(e) {
  if (e.code === 1) toast('לא ניתן אישור למיקום — אפשר לאשר בהגדרות ספארי');
  else if (e.code === 3) toast('לא נמצא אות GPS. בחוץ זה יעבוד טוב יותר');
}
async function walkStop() {
  const w = ACT.walk; if (!w) return;
  if (ACT.watchId != null) navigator.geolocation.clearWatch(ACT.watchId);
  ACT.watchId = null;
  clearInterval(ACT.tick); ACT.tick = null;
  try { await ACT.wakeLock?.release(); } catch {}
  ACT.wakeLock = null;
  const dur = (Date.now() - w.start) / 1000;
  ACT.walk = null;
  if (w.dist < 30 || dur < 45) { render(); return toast('המסלול קצר מדי ולא נשמר'); }
  const d = day(dkey());
  (d.walks ||= []).push({
    id: w.id, start: w.start, dur: Math.round(dur), dist: Math.round(w.dist),
    kcal: Math.round(w.kcal), pts: w.pts.map(p => [+p[0].toFixed(5), +p[1].toFixed(5)])
  });
  addPoints(15);
  const km = w.dist / 1000;
  cheer('🏅', 'סיימת מסלול!', `${km.toFixed(2)} ק"מ · ${Math.round(w.kcal)} קלוריות · +15 נקודות`);
  checkGoals(); save(); render();
}
function delWalk(id) {
  const d = day();
  d.walks = (d.walks || []).filter(w => w.id !== id);
  save(); render();
}

/* ציור מסלול כ-SVG (היטל שטוח עם תיקון קו רוחב) */
function routeSVG(pts, w = 300, h = 150) {
  if (!pts || pts.length < 2) return '';
  const lats = pts.map(p => p[0]), lons = pts.map(p => p[1]);
  const la0 = (Math.min(...lats) + Math.max(...lats)) / 2;
  const kx = Math.cos(la0 * Math.PI / 180);
  const xs = lons.map(l => l * kx), ys = lats.map(l => -l);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const sx = (x1 - x0) || 1e-6, sy = (y1 - y0) || 1e-6;
  const s = Math.min((w - 20) / sx, (h - 20) / sy);
  const ox = (w - sx * s) / 2, oy = (h - sy * s) / 2;
  const d = xs.map((x, i) => `${((x - x0) * s + ox).toFixed(1)},${((ys[i] - y0) * s + oy).toFixed(1)}`).join(' ');
  const first = d.split(' ')[0].split(','), last = d.split(' ').pop().split(',');
  return `<svg viewBox="0 0 ${w} ${h}" class="route" aria-label="מפת המסלול">
    <polyline points="${d}" fill="none" stroke="var(--primary)" stroke-width="3.5"
      stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${first[0]}" cy="${first[1]}" r="5" fill="var(--surface)" stroke="var(--primary)" stroke-width="3"/>
    <circle cx="${last[0]}" cy="${last[1]}" r="5" fill="var(--accent)"/>
  </svg>`;
}

/* ---------- גשר לאפליקציית הבריאות ---------- */
/* קיצור דרך פותח את האפליקציה עם ?steps=…&kcal=…&date=… */
function ingestURL() {
  const q = new URLSearchParams(location.search);
  if (![...q.keys()].some(k => ['steps', 'kcal', 'burn', 'weight'].includes(k))) return;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(q.get('date') || '') ? q.get('date') : dkey();
  const d = day(date);
  let msg = [];
  const steps = parseInt(q.get('steps'));
  if (steps >= 0 && steps < 200000) { d.steps = steps; msg.push(`${steps.toLocaleString('he-IL')} צעדים`); }
  const burn = parseInt(q.get('kcal') || q.get('burn'));
  if (burn >= 0 && burn < 10000) { d.burnManual = burn; msg.push(`${burn} קלוריות`); }
  const wgt = parseFloat(q.get('weight'));
  if (wgt >= 25 && wgt <= 300) {
    S.weights = S.weights.filter(x => x.d !== date);
    S.weights.push({ d: date, w: r1(wgt) });
    S.weights.sort((a, b) => a.d < b.d ? -1 : 1);
    if (S.profile) S.profile.weight = r1(wgt);
    msg.push(`משקל ${r1(wgt)} ק"ג`);
  }
  save();
  history.replaceState(null, '', location.pathname);   // ניקוי הכתובת
  if (msg.length) setTimeout(() => cheer('⌚', 'נתונים נקלטו', msg.join(' · ')), 700);
}

/* ייבוא קובץ הייצוא מאפליקציית הבריאות (export.xml) */
function importHealthXML() {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.xml,text/xml,application/xml';
  inp.onchange = () => {
    const f = inp.files?.[0]; if (!f) return;
    if (f.size > 200 * 1024 * 1024) return toast('הקובץ גדול מדי (מעל 200 מגה)');
    toast('קורא את הקובץ — זה יכול לקחת דקה');
    const fr = new FileReader();
    fr.onerror = () => toast('לא הצלחתי לקרוא את הקובץ');
    fr.onload = () => {
      try { parseHealthXML(String(fr.result)); }
      catch { toast('הקובץ אינו קובץ ייצוא תקין של אפליקציית הבריאות'); }
    };
    fr.readAsText(f);
  };
  inp.click();
}
function parseHealthXML(txt) {
  // <Record type="HKQuantityTypeIdentifierStepCount" startDate="2026-09-05 08:12:00 +0300" value="431"/>
  const re = /<Record[^>]*?type="HKQuantityTypeIdentifier(StepCount|ActiveEnergyBurned|BodyMass)"[^>]*?startDate="(\d{4}-\d{2}-\d{2})[^"]*"[^>]*?value="([\d.]+)"/g;
  const steps = {}, burn = {}, mass = {};
  let m, n = 0;
  while ((m = re.exec(txt))) {
    const [, kind, date, val] = m; const v = parseFloat(val);
    if (!isFinite(v)) continue;
    if (kind === 'StepCount') steps[date] = (steps[date] || 0) + v;
    else if (kind === 'ActiveEnergyBurned') burn[date] = (burn[date] || 0) + v;
    else mass[date] = v;
    if (++n > 3e6) break;                      // מגן מפני קובץ ענק
  }
  let days = 0;
  for (const [date, v] of Object.entries(steps)) { day(date).steps = Math.round(v); days++; }
  for (const [date, v] of Object.entries(burn)) day(date).burnManual = Math.round(v);
  for (const [date, v] of Object.entries(mass)) {
    if (v < 25 || v > 300) continue;
    S.weights = S.weights.filter(x => x.d !== date);
    S.weights.push({ d: date, w: r1(v) });
  }
  S.weights.sort((a, b) => a.d < b.d ? -1 : 1);
  save(); render();
  if (!days) toast('לא נמצאו נתוני צעדים בקובץ');
  else cheer('📥', 'הנתונים יובאו', `${days} ימים של צעדים נטענו מאפליקציית הבריאות.`);
}

/* ══════════════════════════════════════════════════════════
   מסך "תנועה"
   ══════════════════════════════════════════════════════════ */
const fmtDur = s => {
  const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = Math.floor(s % 60);
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}`
    : `${m}:${String(x).padStart(2, '0')}`;
};
function bigRing(pct, color, inner, size = 150) {
  const R = size / 2 - 11, C = 2 * Math.PI * R, p = clamp(pct, 0, 1);
  return `<div class="ring" style="width:${size}px;height:${size}px">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
      <circle cx="${size / 2}" cy="${size / 2}" r="${R}" fill="none" stroke="var(--surface-2)" stroke-width="12"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${R}" fill="none" stroke="${color}" stroke-width="12"
        stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - p)}"
        style="transition:stroke-dashoffset .7s cubic-bezier(.3,1,.5,1)"/>
    </svg><div class="ring-txt">${inner}</div></div>`;
}

function viewActivity() {
  const d = day(), T = targets();
  const steps = d.steps || 0, goal = stepGoal();
  const km = steps * strideM() / 1000;
  const burn = burnToday();
  const w = ACT.walk;
  let html = '';

  /* מסלול פעיל */
  if (w) {
    const dur = (Date.now() - w.start) / 1000;
    const kmh = dur > 0 ? (w.dist / 1000) / (dur / 3600) : 0;
    const pace = w.dist > 200 ? (dur / 60) / (w.dist / 1000) : 0;
    html += `<div class="card live">
      <div class="card-h"><h3>🛰️ מסלול פעיל</h3>
        <span class="pill ${w.acc && w.acc < 20 ? 'p' : 'w'}">${w.acc ? 'דיוק ±' + Math.round(w.acc) + ' מ׳' : 'מחפש אות…'}</span></div>
      <div class="bigstats">
        <div><b class="num">${(w.dist / 1000).toFixed(2)}</b><small>קילומטרים</small></div>
        <div><b class="num">${fmtDur(dur)}</b><small>זמן</small></div>
        <div><b class="num">${Math.round(w.kcal)}</b><small>קלוריות</small></div>
        <div><b class="num">${pace ? pace.toFixed(1) : '—'}</b><small>דקות לק"מ</small></div>
      </div>
      ${w.pts.length > 2 ? `<div class="routebox">${routeSVG(w.pts, 300, 140)}</div>` : `
        <div class="banner info" style="margin:14px 0 0">📍 ההליכה נרשמת. כדאי להשאיר את המסך דולק — הוא יישאר דולק אוטומטית.</div>`}
      <button class="btn danger block" id="walk-stop" style="margin-top:14px">סיום ושמירת המסלול</button>
    </div>`;
  }

  /* צעדים */
  html += `<div class="card">
    <div class="card-h"><h3>👣 צעדים היום</h3>
      <button class="link" id="edit-steps">עדכון ידני</button></div>
    <div class="ring-wrap">
      ${bigRing(steps / goal, 'var(--primary)',
        `<b class="num">${steps.toLocaleString('he-IL')}</b><small>מתוך ${goal.toLocaleString('he-IL')}</small>`)}
      <div class="ring-side">
        <div class="kv"><span>מרחק מוערך</span><b class="num">${km.toFixed(2)} ק"מ</b></div>
        <div class="kv"><span>קלוריות מצעדים</span><b class="num">${kcalFromSteps(steps)}</b></div>
        <div class="kv"><span>אורך צעד</span><b class="num">${Math.round(strideM() * 100)} ס"מ</b></div>
        ${steps >= goal ? `<span class="pill p">🎉 היעד הושג</span>`
          : `<span class="pill b">עוד <bdi>${(goal - steps).toLocaleString('he-IL')}</bdi> צעדים</span>`}
      </div>
    </div>
    <div class="row" style="margin-top:8px">
      <div><div class="rl">מד צעדים אוטומטי</div>
        <div class="rs">סופר צעדים מחיישני התנועה של המכשיר, כל עוד האפליקציה פתוחה על המסך</div></div>
      <div class="sw ${ACT.ped.on ? 'on' : ''}" id="ped-sw" role="switch" aria-checked="${ACT.ped.on}"></div>
    </div>
  </div>`;

  /* התחלת מסלול */
  if (!w) html += `<button class="btn primary block big" id="walk-start">🛰️ התחלת הליכה עם GPS</button>
    <div class="hint">מודד מרחק, זמן, קצב, קלוריות ומצייר את המסלול. עובד גם בלי אינטרנט.</div>`;

  /* אנרגיה */
  html += `<div class="card">
    <div class="card-h"><h3>🔥 מאזן אנרגיה</h3></div>
    <div class="energy">
      <div class="ecell in"><b class="num" dir="ltr">${r0(totals().kcal)}</b><small>נאכלו</small></div>
      <div class="eop">−</div>
      <div class="ecell out"><b class="num" dir="ltr">${burn}</b><small>נשרפו</small></div>
      <div class="eop">=</div>
      <div class="ecell net"><b class="num" dir="ltr">${r0(totals().kcal - burn)}</b><small>נטו</small></div>
    </div>
    <div class="row">
      <div><div class="rl">להוסיף קלוריות שנשרפו ליעד</div>
        <div class="rs">כשמופעל, יעד היום גדל בכמות שנשרפה בפעילות</div></div>
      <div class="sw ${S.settings.burnAdjust ? 'on' : ''}" id="burn-sw" role="switch"></div>
    </div>
    <div class="rs" style="padding-top:10px">היעד הבסיסי כבר כולל את רמת הפעילות שהצהרת עליה בפרופיל, ולכן תוספת של פעילות יומיומית עלולה להיספר פעמיים. מומלץ להשאיר מכובה אלא אם עשית אימון חריג.</div>
  </div>`;

  /* מסלולים שנשמרו */
  const walks = d.walks || [];
  if (walks.length) {
    html += `<div class="sec-title">המסלולים של ${prettyDate(UI.date)}</div>`;
    for (const wk of walks) {
      const t = new Date(wk.start);
      html += `<div class="card walkcard">
        <div class="card-h"><h3>🚶‍♀️ <bdi>${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}</bdi></h3>
          <button class="ex" data-delwalk="${wk.id}" aria-label="מחיקה">✕</button></div>
        ${wk.pts?.length > 2 ? `<div class="routebox">${routeSVG(wk.pts, 300, 130)}</div>` : ''}
        <div class="bigstats sm">
          <div><b class="num">${(wk.dist / 1000).toFixed(2)}</b><small>ק"מ</small></div>
          <div><b class="num">${fmtDur(wk.dur)}</b><small>זמן</small></div>
          <div><b class="num">${wk.kcal}</b><small>קלוריות</small></div>
          <div><b class="num">${wk.dist > 200 ? ((wk.dur / 60) / (wk.dist / 1000)).toFixed(1) : '—'}</b><small>דק׳/ק"מ</small></div>
        </div>
      </div>`;
    }
  }

  /* שבוע הצעדים */
  const week = lastDays(7);
  const sv = week.map(k => (S.days[k]?.steps) || 0);
  const mx = Math.max(goal * 1.1, ...sv, 1);
  html += `<div class="card"><div class="card-h"><h3>📊 צעדים — 7 ימים</h3></div>
    <div class="bars">${week.map((k, i) => `<div class="bcol">
      <div class="bb ${sv[i] >= goal ? 'good' : ''}" style="height:${sv[i] / mx * 100}%"></div>
      <div class="bl">${k === dkey() ? 'היום' : DAY_LETTER[new Date(k + 'T12:00').getDay()]}</div></div>`).join('')}</div>
    <div style="font-size:12px;color:var(--muted);text-align:center;margin-top:8px">
      ממוצע: <b class="num">${Math.round(sv.reduce((a, b) => a + b, 0) / 7).toLocaleString('he-IL')}</b> צעדים ביום</div>
  </div>`;

  /* חיבור לאפליקציית הבריאות */
  html += `<div class="sec-title">⌚ צעדים מאפליקציית הבריאות</div>

  <div class="card once">
    <div class="once-head"><span class="once-i">✨</span>
      <div><b>הגדרה חד-פעמית</b>
        <p>כ-3 דקות עכשיו, ומאותו רגע הצעדים נכנסים לכאן <u>לבד</u> כל ערב — מהאייפון ומהשעון. לא צריך לגעת בזה שוב.</p></div>
    </div>

    <div class="why">למה בכלל צריך את זה? אפל לא מאפשרת לאפליקציית ווב לקרוא ישירות מאפליקציית "בריאות". קיצור הדרך הוא הגשר הרשמי שעוקף את זה.</div>

    <ol class="bigsteps">
      <li><b>פותחים את אפליקציית "קיצורי דרך"</b>
        <span>היא מותקנת מראש בכל אייפון. אם לא מוצאים — לגרור מטה במסך הבית ולחפש "קיצורי דרך".</span></li>

      <li><b>לשונית "אוטומציה" בתחתית ← כפתור +</b>
        <span>אם זו האוטומציה הראשונה, יופיע ישר מסך יצירה.</span></li>

      <li><b>לבחור "שעה ביום"</b>
        <span>להגדיר שעה שבה הטלפון בדרך כלל פנוי — 22:00 עובד טוב. לוודא שמסומן "הפעל מיד" ולא "שאל לפני הפעלה".</span></li>

      <li><b>להוסיף פעולה שמביאה את הצעדים</b>
        <span>בתיבת החיפוש להקליד <b>בריאות</b> ולבחור את הפעולה שמוצאת דגימות בריאות. להגדיר: סוג = <b>צעדים</b>, טווח = <b>היום</b>.</span></li>

      <li><b>להוסיף פעולה שמסכמת</b>
        <span>לחפש <b>סטטיסטיקה</b> ולבחור חישוב סטטיסטיקה. להגדיר: <b>סכום</b>.</span></li>

      <li><b>להוסיף "פתח כתובת" ולהדביק את זה:</b>
        <span>אחרי ה-<bdi>=</bdi> צריך לגרור פנימה את תוצאת הסכום מהשלב הקודם.</span>
        <div class="codebox"><code id="sc-url">${esc(location.origin + location.pathname)}?steps=</code>
          <button class="btn sm primary" id="copy-url">העתקה</button></div></li>

      <li><b>לשמור. זהו.</b>
        <span>בפעם הראשונה שזה ירוץ, האייפון יבקש אישור גישה לנתוני הבריאות — מאשרים פעם אחת וזה נגמר.</span></li>
    </ol>

    <div class="tipbox">💡 שמות הפעולות משתנים קצת בין גרסאות iOS. אם משהו לא נראה בדיוק ככה — לחפש בתיבת החיפוש את המילים <b>בריאות</b> ו<b>סטטיסטיקה</b>, הן תמיד שם.</div>
  </div>

  <details class="acc"><summary>🖐️ מעדיפים בלחיצה במקום אוטומטי?</summary>
    <div class="accb">אפשר לבנות את אותו קיצור דרך בלשונית "קיצורי הדרך שלי" במקום ב"אוטומציה", ואז להוסיף אותו כאייקון למסך הבית. לחיצה אחת מעדכנת את הצעדים, בלי שהאפליקציה תיפתח מעצמה בערב.</div></details>

  <details class="acc"><summary>📥 לייבא את כל ההיסטוריה בבת אחת</summary>
    <div class="accb">
      <p>מייבא צעדים, קלוריות ומשקל מכל השנים — פעולה חד-פעמית שממלאת את הגרפים למפרע.</p>
      <ol class="steps">
        <li>אפליקציית <b>בריאות</b> ← תמונת הפרופיל ← <b>ייצוא כל הנתונים</b></li>
        <li>לשמור, לפתוח באפליקציית <b>קבצים</b> ולחלץ את קובץ ה-zip</li>
        <li>לבחור כאן את הקובץ <bdi>export.xml</bdi></li>
      </ol>
      <button class="btn soft block" id="import-health" style="margin-top:10px">בחירת קובץ export.xml</button>
    </div></details>

  <details class="acc"><summary>⌚ ומה עם האפל ווטש?</summary>
    <div class="accb">
      <p>התזכורות של האפליקציה מופיעות בשעון אוטומטית, כי השעון מציג את ההתראות של האייפון.</p>
      <p>הצעדים שהשעון סופר נכנסים גם הם — הוא מסנכרן הכול לאפליקציית "בריאות", ומשם קיצור הדרך לוקח אותם. אין צורך בהגדרה נפרדת לשעון.</p>
    </div></details>`;

  html += `<div class="card"><div class="card-h"><h3>🎯 יעד הצעדים</h3></div>
    <div class="chips" id="goal-chips">
      ${[5000, 7000, 8000, 10000, 12000].map(g =>
        `<button data-stepgoal="${g}" class="${goal === g ? 'on' : ''}">${g.toLocaleString('he-IL')}</button>`).join('')}
    </div>
    <div class="rs" style="padding-top:12px">ארגון הבריאות העולמי ממליץ על 150 דקות פעילות מתונה בשבוע. כ-7,000–8,000 צעדים ביום נמצאו במחקרים כנקודה שבה התמותה יורדת משמעותית — ולא צריך דווקא 10,000.</div>
  </div>`;
  return html;
}
