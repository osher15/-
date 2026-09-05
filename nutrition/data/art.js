/* ============================================================
   איורים וקטוריים למאכלים — SVG מקורי, ללא תלות חיצונית.
   כל איור מצויר בתוך viewBox של 64×64.
   ============================================================ */
(function () {
  const A = {};
  const S = (bg, body) => ({ bg, body });

  /* ---------- פירות ---------- */
  A.apple = S('#fdecea', `<path d="M32 22c-4-7-13-8-18-2-6 7-3 21 4 30 4 6 9 9 14 9s10-3 14-9c7-9 10-23 4-30-5-6-14-5-18 2z" fill="#e0483c"/><path d="M32 24c-2-4-6-6-10-5 3 1 6 4 8 8z" fill="#f2695e"/><rect x="30.5" y="10" width="3" height="13" rx="1.5" fill="#8a5a33"/><path d="M34 16c1-5 6-8 12-8 0 6-5 10-12 9z" fill="#57b04b"/>`);
  A.pear = S('#f6f7e6', `<path d="M32 12c8 0 8 9 6 14-2 4 8 9 8 20 0 9-6 14-14 14s-14-5-14-14c0-11 10-16 8-20-2-5-2-14 6-14z" fill="#b3cb3f"/><path d="M26 34c-3 4-6 8-6 13 0 5 2 8 5 10-5-2-8-6-8-11 0-6 4-10 9-12z" fill="#c8db6a"/><rect x="30.5" y="7" width="3" height="8" rx="1.5" fill="#8a5a33"/>`);
  A.banana = S('#fdf6dd', `<path d="M13 20c1 18 12 30 28 30 6 0 10-2 12-5-2 1-5 1-8 1-14 0-25-11-26-27 0-2-1-3-3-3s-3 2-3 4z" fill="#f2c032"/><path d="M15 18c2 16 12 26 26 26 4 0 7-1 9-2-3 4-8 6-14 6-14 0-24-11-25-27 0-2 1-3 2-3z" fill="#e0a81f"/><path d="M50 44c2 0 4 1 4 2s-2 2-4 2z" fill="#8a5a33"/>`);
  A.citrus = S('#fff0de', `<circle cx="32" cy="35" r="21" fill="#f38b1c"/><circle cx="32" cy="35" r="15" fill="#ffb24d"/><g stroke="#fff" stroke-width="1.6" opacity=".85"><path d="M32 20v30M17 35h30M22 24l20 22M42 24L22 46"/></g><rect x="30.5" y="10" width="3" height="6" rx="1.5" fill="#7a5a2e"/><path d="M34 13c2-4 7-5 10-3-2 4-6 5-10 3z" fill="#57b04b"/>`);
  A.berry = S('#fbe9ef', `<circle cx="24" cy="38" r="11" fill="#d6335c"/><circle cx="40" cy="40" r="9" fill="#e14b70"/><circle cx="33" cy="28" r="9" fill="#bf2a4e"/><g fill="#fff" opacity=".7"><circle cx="21" cy="35" r="1.3"/><circle cx="27" cy="41" r="1.3"/><circle cx="38" cy="38" r="1.3"/><circle cx="43" cy="43" r="1.3"/><circle cx="31" cy="26" r="1.3"/></g><path d="M33 19c0-4 4-7 9-7-1 5-4 7-9 7z" fill="#57b04b"/>`);
  A.grapes = S('#f2eafa', `<g fill="#8250c4"><circle cx="32" cy="20" r="6"/><circle cx="24" cy="29" r="6"/><circle cx="40" cy="29" r="6"/><circle cx="32" cy="31" r="6"/><circle cx="27" cy="40" r="6"/><circle cx="37" cy="40" r="6"/><circle cx="32" cy="49" r="6"/></g><g fill="#a274de" opacity=".75"><circle cx="30" cy="18" r="2"/><circle cx="22" cy="27" r="2"/><circle cx="38" cy="27" r="2"/><circle cx="25" cy="38" r="2"/></g><path d="M33 15c1-5 6-8 11-8-1 6-5 9-11 8z" fill="#57b04b"/>`);
  A.melon = S('#fdeaea', `<path d="M8 40a24 24 0 0 1 48 0z" fill="#e8455c"/><path d="M8 40h48a24 24 0 0 0-2-9H10z" fill="#f8f4e6" opacity=".0"/><path d="M10 40a22 22 0 0 1 44 0z" fill="#f0596e"/><path d="M8 40h48v4a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z" fill="#57b04b"/><g fill="#3a2418"><ellipse cx="24" cy="30" rx="1.6" ry="2.4"/><ellipse cx="34" cy="26" rx="1.6" ry="2.4"/><ellipse cx="42" cy="32" rx="1.6" ry="2.4"/></g>`);
  A.stone = S('#fdeee6', `<circle cx="32" cy="36" r="20" fill="#f08a5d"/><path d="M32 16a20 20 0 0 0-18 29c4-14 12-23 24-27a20 20 0 0 0-6-2z" fill="#f7a983"/><path d="M32 17c-2 8-2 22 0 38" stroke="#d9694a" stroke-width="1.6" fill="none"/><path d="M34 15c2-5 7-7 11-6-2 5-6 7-11 6z" fill="#57b04b"/>`);
  A.avocado = S('#eef6e6', `<path d="M32 10c9 0 15 9 15 20s-7 24-15 24-15-13-15-24 6-20 15-20z" fill="#5d8a2f"/><path d="M32 16c6 0 11 7 11 15s-5 18-11 18-11-10-11-18 5-15 11-15z" fill="#d3e4a0"/><ellipse cx="32" cy="35" rx="7" ry="8" fill="#8a5a33"/>`);
  A.kiwi = S('#eef6e2', `<circle cx="32" cy="34" r="21" fill="#8a6b3c"/><circle cx="32" cy="34" r="17" fill="#8db83f"/><circle cx="32" cy="34" r="6" fill="#f4f5e8"/><g fill="#2f3b17"><ellipse cx="32" cy="24" rx="1.1" ry="1.8"/><ellipse cx="40" cy="29" rx="1.1" ry="1.8"/><ellipse cx="40" cy="40" rx="1.1" ry="1.8"/><ellipse cx="32" cy="45" rx="1.1" ry="1.8"/><ellipse cx="24" cy="40" rx="1.1" ry="1.8"/><ellipse cx="24" cy="29" rx="1.1" ry="1.8"/></g>`);
  A.pineapple = S('#fdf3d9', `<path d="M32 6c3 5 3 9 2 13 3-3 7-4 10-3-2 4-5 6-9 7 4 0 7 2 9 5-4 1-8 0-11-2 1 4 0 8-1 10-2-2-4-6-4-10-2 3-5 5-9 5-1-4 1-8 4-10-4 0-7-2-9-5 3-2 7-2 10 0-2-3-3-7-2-11 4 1 7 3 8 6 0-3 1-7 1-5z" fill="#57b04b"/><rect x="18" y="24" width="28" height="34" rx="13" fill="#e8a72c"/><g stroke="#b87d16" stroke-width="1.4" opacity=".8"><path d="M22 32l20 18M42 32L22 50M20 41h24"/></g>`);
  A.date = S('#f6ecdf', `<ellipse cx="26" cy="34" rx="8" ry="14" transform="rotate(-14 26 34)" fill="#7a4a24"/><ellipse cx="38" cy="38" rx="8" ry="14" transform="rotate(12 38 38)" fill="#8d5a2c"/><ellipse cx="24" cy="30" rx="3" ry="6" transform="rotate(-14 24 30)" fill="#9d6b3a" opacity=".7"/>`);
  A.dried = S('#f7ecdd', `<g fill="#8b4a2f"><circle cx="24" cy="28" r="7"/><circle cx="38" cy="26" r="6"/><circle cx="30" cy="40" r="7"/><circle cx="43" cy="39" r="6"/><circle cx="19" cy="41" r="5"/></g><g fill="#a8603f" opacity=".8"><circle cx="22" cy="26" r="2"/><circle cx="36" cy="24" r="1.6"/><circle cx="28" cy="38" r="2"/></g>`);

  /* ---------- ירקות ---------- */
  A.tomato = S('#fdeae8', `<circle cx="32" cy="37" r="20" fill="#e33b30"/><path d="M32 17a20 20 0 0 0-17 30c3-13 11-22 23-26a20 20 0 0 0-6-4z" fill="#f0655b"/><path d="M32 12l3 6 6-3-2 6 7 1-6 4 4 5-7-2-1 6-4-5-4 5-1-6-7 2 4-5-6-4 7-1-2-6 6 3z" fill="#4c9a3a"/>`);
  A.cucumber = S('#e9f5e6', `<path d="M18 48c-5-5-4-14 3-22s17-11 22-6 4 14-3 22-17 11-22 6z" fill="#3f8f3a"/><path d="M22 45c-3-4-2-10 4-16s13-9 16-6-2 10-8 16-9 9-12 6z" fill="#65ad55"/><g fill="#2c6b28" opacity=".55"><circle cx="26" cy="40" r="1.4"/><circle cx="32" cy="34" r="1.4"/><circle cx="38" cy="28" r="1.4"/></g>`);
  A.pepper = S('#fdeee6', `<path d="M20 30c0-6 5-9 12-9s12 3 12 9c0 12-3 24-12 24s-12-12-12-24z" fill="#e8452f"/><path d="M24 30c0-4 3-6 6-6-2 8-2 20 0 26-5-2-6-12-6-20z" fill="#f4705a"/><rect x="30" y="12" width="4" height="10" rx="2" fill="#4c9a3a"/><path d="M25 20c4-3 10-3 14 0-4 3-10 3-14 0z" fill="#57b04b"/>`);
  A.carrot = S('#fdf0e2', `<path d="M32 56c-4 0-14-24-13-30 1-4 7-7 13-7s12 3 13 7c1 6-9 30-13 30z" fill="#ec7d21"/><path d="M28 22c-1 8 2 24 4 30-4-4-11-24-10-29 0-1 3-1 6-1z" fill="#f59b4c"/><path d="M32 18c-1-6 2-11 7-13 1 6-2 11-7 13zM32 18c-4-5-4-10-1-14 4 4 5 9 1 14z" fill="#4c9a3a"/>`);
  A.broccoli = S('#e9f4e3', `<g fill="#3f8f3a"><circle cx="24" cy="24" r="9"/><circle cx="40" cy="24" r="9"/><circle cx="32" cy="18" r="9"/><circle cx="32" cy="29" r="10"/></g><g fill="#5aab4b"><circle cx="22" cy="21" r="3"/><circle cx="38" cy="20" r="3"/><circle cx="31" cy="26" r="3"/></g><path d="M27 36h10l2 18a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4z" fill="#9dcb6a"/>`);
  A.leafy = S('#e9f5e6', `<path d="M32 56C18 50 10 38 12 20c14-2 24 4 28 14 4-8 8-12 12-12 2 14-6 28-20 34z" fill="#3f8f3a"/><path d="M32 56c-2-14 2-26 10-34" stroke="#8bc46f" stroke-width="2" fill="none"/><path d="M32 56C22 46 18 34 20 24" stroke="#63ab52" stroke-width="2" fill="none"/>`);
  A.onion = S('#fbf0f4', `<path d="M32 14c10 0 18 10 18 22s-8 18-18 18-18-6-18-18 8-22 18-22z" fill="#c98fb3"/><path d="M32 14c-4 8-6 22-4 40M32 14c4 8 6 22 4 40" stroke="#a86a94" stroke-width="1.6" fill="none"/><path d="M32 14c-2-4-5-6-8-6 2 4 4 6 8 6zM32 14c2-4 5-6 8-6-2 4-4 6-8 6z" fill="#7fae4c"/>`);
  A.potato = S('#f6efdf', `<ellipse cx="32" cy="34" rx="22" ry="17" transform="rotate(-12 32 34)" fill="#c79a5c"/><ellipse cx="26" cy="28" rx="10" ry="7" transform="rotate(-12 26 28)" fill="#d9b47c" opacity=".8"/><g fill="#8f6a3a"><ellipse cx="24" cy="36" rx="2" ry="1.4"/><ellipse cx="38" cy="30" rx="2" ry="1.4"/><ellipse cx="41" cy="40" rx="1.6" ry="1.2"/></g>`);
  A.sweetpotato = S('#fbeadf', `<path d="M12 40c-2-8 6-18 18-21s22 2 23 9-8 16-20 19S14 48 12 40z" fill="#c2643f"/><path d="M18 38c0-5 6-11 15-13-8 5-13 10-15 13z" fill="#d78560" opacity=".8"/><g fill="#8f4326"><ellipse cx="26" cy="38" rx="2" ry="1.3"/><ellipse cx="38" cy="32" rx="2" ry="1.3"/></g>`);
  A.corn = S('#fdf5da', `<path d="M32 8c8 0 13 9 13 22s-5 26-13 26-13-13-13-26S24 8 32 8z" fill="#f0c02f"/><g fill="#d9a112" opacity=".85"><circle cx="27" cy="22" r="1.8"/><circle cx="32" cy="20" r="1.8"/><circle cx="37" cy="22" r="1.8"/><circle cx="27" cy="30" r="1.8"/><circle cx="32" cy="28" r="1.8"/><circle cx="37" cy="30" r="1.8"/><circle cx="27" cy="38" r="1.8"/><circle cx="32" cy="36" r="1.8"/><circle cx="37" cy="38" r="1.8"/><circle cx="32" cy="44" r="1.8"/></g><path d="M45 20c6-4 12-2 14 2-5 6-11 8-16 5zM19 20c-6-4-12-2-14 2 5 6 11 8 16 5z" fill="#5aab4b"/>`);
  A.mushroom = S('#f5f0e8', `<path d="M12 32c0-11 9-19 20-19s20 8 20 19c0 3-2 4-5 4H17c-3 0-5-1-5-4z" fill="#b5654a"/><g fill="#d68d72"><circle cx="22" cy="24" r="3.4"/><circle cx="38" cy="22" r="3"/><circle cx="31" cy="29" r="2.6"/></g><path d="M26 36h12v14a6 6 0 0 1-12 0z" fill="#f0e2cd"/>`);
  A.eggplant = S('#f1eaf7', `<path d="M44 22c6 6 4 18-4 26s-20 10-26 4 0-18 8-26 16-10 22-4z" fill="#6b3f8f"/><path d="M20 44c-3-3-1-10 5-16-3 7-4 13-5 16z" fill="#8f61b0" opacity=".8"/><path d="M42 20c1-4 4-7 8-8 1 5-2 9-8 8z" fill="#4c9a3a"/>`);
  A.olive = S('#f0f2e2', `<ellipse cx="24" cy="34" rx="9" ry="12" fill="#6b7f2e"/><ellipse cx="40" cy="38" rx="8" ry="11" fill="#4a5a1e"/><ellipse cx="22" cy="30" rx="3" ry="4" fill="#93a84c" opacity=".8"/><path d="M22 22c0-5 4-9 9-10-1 6-4 9-9 10z" fill="#57b04b"/>`);
  A.salad = S('#eaf5e8', `<path d="M8 34h48c0 12-11 20-24 20S8 46 8 34z" fill="#e8edf0"/><path d="M10 34h44c0 3-1 5-2 7H12c-1-2-2-4-2-7z" fill="#cfd8de"/><g><circle cx="22" cy="28" r="6" fill="#4c9a3a"/><circle cx="34" cy="25" r="6" fill="#65ad55"/><circle cx="44" cy="29" r="5" fill="#e33b30"/><circle cx="28" cy="31" r="4" fill="#ec7d21"/><circle cx="39" cy="32" r="4" fill="#8db83f"/></g>`);

  /* ---------- חלבונים ---------- */
  A.egg = S('#fdf6e3', `<ellipse cx="32" cy="36" rx="18" ry="14" fill="#fdfaf2"/><circle cx="32" cy="35" r="8" fill="#f5b915"/><circle cx="29" cy="32" r="3" fill="#fbd45f" opacity=".8"/>`);
  A.chicken = S('#fbeee2', `<path d="M46 14c6 6 5 14-2 20l-14 14c-4 4-10 4-13 1s-3-9 1-13l14-14c6-7 14-8 20-2z" fill="#d99a5e" transform="rotate(6 32 32)"/><path d="M42 20c3 3 2 7-2 11L28 43c-2 2-5 2-6 1 2-1 3-2 4-4l12-12c4-4 5-7 4-8z" fill="#eabb8b" transform="rotate(6 32 32)"/><g fill="#f6f1e6" stroke="#ded4c2" stroke-width="1.2"><circle cx="20" cy="47" r="6"/><circle cx="15" cy="41" r="5"/></g>`);
  A.meat = S('#f7e6e4', `<path d="M14 40c-3-9 3-20 13-24s21-1 25 7-2 20-12 24-23 2-26-7z" fill="#b3453c"/><path d="M22 38c-2-6 2-13 9-16s14-1 16 4c-11-2-21 3-25 12z" fill="#cf6459"/><path d="M46 20c4-3 9-2 11 2s-1 8-5 9c1-4 0-8-6-11z" fill="#f2e6d5"/>`);
  A.fish = S('#e6f1f7', `<path d="M8 34c8-11 20-16 30-16 8 0 14 6 14 16s-6 16-14 16C28 50 16 45 8 34z" fill="#5b9fc7"/><path d="M8 34c8-9 18-14 27-15-9 4-16 10-20 19z" fill="#8ac2e0" opacity=".8"/><path d="M52 26l10-8v32l-10-8z" fill="#4b88ad"/><circle cx="44" cy="28" r="2.6" fill="#fff"/><circle cx="44" cy="28" r="1.2" fill="#243d4d"/>`);
  A.shrimp = S('#fdeae4', `<path d="M46 20c-14 0-24 8-24 18 0 8 6 14 14 14 3 0 5-1 6-2-8 0-13-5-13-12 0-8 8-14 20-14z" fill="#ee7a56"/><g fill="#f79c7d"><circle cx="28" cy="34" r="4"/><circle cx="33" cy="27" r="4"/></g><circle cx="46" cy="22" r="2" fill="#5b3226"/>`);
  A.tofu = S('#f0f2ea', `<g stroke="#cdd2bd" stroke-width="1.4"><path d="M14 26l7-6h17l-7 6z" fill="#fffef5"/><path d="M31 26l7-6v18l-7 6z" fill="#e4e6d2"/><rect x="14" y="26" width="17" height="18" rx="1.5" fill="#f8f7e8"/><path d="M30 36l6-5h16l-6 5z" fill="#fffef5"/><path d="M46 36l6-5v14l-6 5z" fill="#e4e6d2"/><rect x="30" y="36" width="16" height="14" rx="1.5" fill="#f8f7e8"/></g>`);

  /* ---------- חלב וגבינות ---------- */
  A.cheese_y = S('#fdf5dc', `<path d="M10 44V30l22-14 22 14v14a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4z" fill="#f2c02c"/><path d="M10 30l22-14 22 14z" fill="#f8d661"/><g fill="#e0a512"><circle cx="20" cy="40" r="3.4"/><circle cx="34" cy="36" r="2.6"/><circle cx="44" cy="42" r="3"/><circle cx="28" cy="45" r="2"/></g>`);
  A.cheese_w = S('#eef4f2', `<path d="M16 24h32a4 4 0 0 1 4 4v22a5 5 0 0 1-5 5H17a5 5 0 0 1-5-5V28a4 4 0 0 1 4-4z" fill="#fdfdfa" stroke="#d5e0dc" stroke-width="1.6"/><ellipse cx="32" cy="24" rx="20" ry="6" fill="#fff" stroke="#d5e0dc" stroke-width="1.6"/><ellipse cx="32" cy="25" rx="14" ry="3.4" fill="#eef4f1"/><path d="M22 34c4 3 8 4 12 3s7-3 9-1-2 6-7 7-12 0-14-3-2-6 0-6z" fill="#f3f8f6"/></g>`);
  A.milk = S('#eef4fb', `<path d="M24 8h16v8l6 10v28a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V26l6-10z" fill="#e9f1f8"/><path d="M18 32h28v18a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z" fill="#fff"/><rect x="24" y="6" width="16" height="5" rx="2" fill="#4a8fd6"/><path d="M22 36h20v6H22z" fill="#4a8fd6" opacity=".18"/>`);
  A.yogurt = S('#f6f0fb', `<path d="M16 22h32l-3 30a5 5 0 0 1-5 4H24a5 5 0 0 1-5-4z" fill="#fbfaff"/><ellipse cx="32" cy="22" rx="16" ry="5" fill="#e5dcf5"/><path d="M20 34h24l-2 18a4 4 0 0 1-4 3H26a4 4 0 0 1-4-3z" fill="#f0e8fb"/><g fill="#d6335c"><circle cx="27" cy="20" r="3"/><circle cx="36" cy="21" r="2.4"/></g>`);

  /* ---------- דגנים ---------- */
  A.bread = S('#faefdd', `<path d="M10 34c0-10 10-16 22-16s22 6 22 16v12a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4z" fill="#d99a4e"/><path d="M14 34c0-7 8-12 18-12s18 5 18 12z" fill="#eab777"/><g stroke="#b8792f" stroke-width="1.6" fill="none" opacity=".7"><path d="M22 26c2-3 4-4 6-4M32 24c2-2 4-3 6-3"/></g>`);
  A.pita = S('#f9efdc', `<circle cx="32" cy="34" r="22" fill="#e2b276"/><circle cx="32" cy="34" r="17" fill="#eec899"/><path d="M20 28c6-4 18-4 24 0" stroke="#c8934e" stroke-width="1.6" fill="none"/><g fill="#c8934e" opacity=".6"><circle cx="26" cy="38" r="1.4"/><circle cx="36" cy="40" r="1.4"/><circle cx="32" cy="30" r="1.2"/></g>`);
  A.rice = S('#f7f5ee', `<path d="M12 34h40c0 12-9 20-20 20s-20-8-20-20z" fill="#e6ebee"/><path d="M14 34h36c0 3-1 5-2 7H16c-1-2-2-4-2-7z" fill="#ccd5da"/><g fill="#fdfbf2" stroke="#e2dcc8" stroke-width=".7"><ellipse cx="24" cy="26" rx="4" ry="2.4" transform="rotate(-20 24 26)"/><ellipse cx="33" cy="22" rx="4" ry="2.4" transform="rotate(12 33 22)"/><ellipse cx="41" cy="27" rx="4" ry="2.4" transform="rotate(-8 41 27)"/><ellipse cx="29" cy="30" rx="4" ry="2.4" transform="rotate(30 29 30)"/><ellipse cx="38" cy="31" rx="4" ry="2.4" transform="rotate(-30 38 31)"/></g>`);
  A.pasta = S('#fdf3dc', `<path d="M12 36h40c0 11-9 18-20 18s-20-7-20-18z" fill="#e6ebee"/><path d="M14 36h36c0 3-1 5-2 6H16c-1-1-2-3-2-6z" fill="#ccd5da"/><g stroke="#f0c04a" stroke-width="3" fill="none" stroke-linecap="round"><path d="M18 34c4-8 10-12 15-8M26 34c2-9 9-13 14-9M34 34c1-8 8-12 13-8"/></g><circle cx="40" cy="30" r="4" fill="#e33b30"/>`);
  A.oats = S('#f8f3e6', `<path d="M12 34h40c0 12-9 20-20 20s-20-8-20-20z" fill="#e6ebee"/><path d="M14 34h36c0 3-1 5-2 7H16c-1-2-2-4-2-7z" fill="#ccd5da"/><g fill="#e3cfa2"><ellipse cx="24" cy="27" rx="5" ry="3"/><ellipse cx="34" cy="23" rx="5" ry="3"/><ellipse cx="42" cy="28" rx="5" ry="3"/><ellipse cx="29" cy="31" rx="5" ry="3"/><ellipse cx="39" cy="32" rx="5" ry="3"/></g>`);
  A.cereal = S('#fdeee2', `<path d="M12 30h40c0 14-9 24-20 24s-20-10-20-24z" fill="#e6ebee"/><path d="M14 30h36c0 3-1 6-2 8H16c-1-2-2-5-2-8z" fill="#ccd5da"/><g fill="#e8913c"><circle cx="23" cy="24" r="4.4"/><circle cx="33" cy="21" r="4.4"/><circle cx="42" cy="25" r="4.4"/><circle cx="28" cy="28" r="4"/><circle cx="38" cy="29" r="4"/></g><g fill="#fdf3e6"><circle cx="23" cy="24" r="1.6"/><circle cx="33" cy="21" r="1.6"/><circle cx="42" cy="25" r="1.6"/></g>`);

  /* ---------- קטניות, אגוזים ---------- */
  A.beans = S('#f7ece0', `<g fill="#a35a3a"><ellipse cx="22" cy="28" rx="8" ry="5.4" transform="rotate(-20 22 28)"/><ellipse cx="38" cy="25" rx="8" ry="5.4" transform="rotate(15 38 25)"/><ellipse cx="30" cy="37" rx="8" ry="5.4" transform="rotate(-5 30 37)"/><ellipse cx="44" cy="37" rx="8" ry="5.4" transform="rotate(28 44 37)"/><ellipse cx="19" cy="40" rx="8" ry="5.4" transform="rotate(35 19 40)"/></g><g fill="#c07a56" opacity=".8"><ellipse cx="20" cy="26" rx="3" ry="1.6" transform="rotate(-20 20 26)"/><ellipse cx="36" cy="23" rx="3" ry="1.6" transform="rotate(15 36 23)"/></g>`);
  A.lentils = S('#f6f0e2', `<g fill="#c2703a"><circle cx="22" cy="28" r="5"/><circle cx="33" cy="24" r="5"/><circle cx="43" cy="29" r="5"/><circle cx="27" cy="36" r="5"/><circle cx="38" cy="36" r="5"/><circle cx="19" cy="39" r="4.4"/><circle cx="46" cy="39" r="4.4"/><circle cx="32" cy="44" r="4.4"/></g><g fill="#dd9a63" opacity=".7"><circle cx="20" cy="26" r="1.8"/><circle cx="31" cy="22" r="1.8"/><circle cx="36" cy="34" r="1.8"/></g>`);
  A.chickpea = S('#f8f3e2', `<g fill="#dcb45f"><circle cx="23" cy="29" r="6"/><circle cx="35" cy="25" r="6"/><circle cx="44" cy="32" r="5.4"/><circle cx="29" cy="38" r="6"/><circle cx="40" cy="41" r="5.4"/><circle cx="19" cy="40" r="5"/></g><g fill="#f0d391"><circle cx="21" cy="27" r="2"/><circle cx="33" cy="23" r="2"/><circle cx="27" cy="36" r="2"/></g>`);
  A.nut = S('#f7eee0', `<g fill="#b07a44"><ellipse cx="24" cy="30" rx="8" ry="10" transform="rotate(-18 24 30)"/><ellipse cx="39" cy="34" rx="8" ry="10" transform="rotate(20 39 34)"/><ellipse cx="30" cy="43" rx="7" ry="9" transform="rotate(5 30 43)"/></g><g fill="#d3a06b"><ellipse cx="22" cy="27" rx="3" ry="4" transform="rotate(-18 22 27)"/><ellipse cx="37" cy="31" rx="3" ry="4" transform="rotate(20 37 31)"/></g>`);
  A.seeds = S('#f4f2e4', `<g fill="#5a5238"><ellipse cx="22" cy="30" rx="3" ry="1.8" transform="rotate(-25 22 30)"/><ellipse cx="30" cy="26" rx="3" ry="1.8" transform="rotate(15 30 26)"/><ellipse cx="38" cy="30" rx="3" ry="1.8" transform="rotate(-10 38 30)"/><ellipse cx="26" cy="35" rx="3" ry="1.8" transform="rotate(40 26 35)"/><ellipse cx="35" cy="37" rx="3" ry="1.8" transform="rotate(-35 35 37)"/><ellipse cx="43" cy="36" rx="3" ry="1.8" transform="rotate(20 43 36)"/><ellipse cx="19" cy="38" rx="3" ry="1.8" transform="rotate(-5 19 38)"/><ellipse cx="30" cy="43" rx="3" ry="1.8" transform="rotate(28 30 43)"/><ellipse cx="40" cy="44" rx="3" ry="1.8" transform="rotate(-20 40 44)"/></g>`);
  A.spread = S('#f9eedd', `<path d="M18 26h28v26a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z" fill="#f3ede0"/><path d="M20 34h24v18a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4z" fill="#b5762f"/><ellipse cx="32" cy="26" rx="14" ry="4" fill="#e2d9c6"/><rect x="20" y="18" width="24" height="7" rx="2" fill="#3f6b8f"/>`);

  /* ---------- משקאות ---------- */
  A.coffee = S('#f5ece3', `<path d="M14 24h30v16a12 12 0 0 1-12 12h-6a12 12 0 0 1-12-12z" fill="#fdfbf7"/><path d="M17 27h24v13a9 9 0 0 1-9 9h-6a9 9 0 0 1-9-9z" fill="#6b4226"/><path d="M44 28h5a7 7 0 0 1 0 14h-5z" fill="none" stroke="#fdfbf7" stroke-width="3.4"/><rect x="10" y="52" width="38" height="5" rx="2.5" fill="#e0d6c8"/><g stroke="#c9bcae" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"><path d="M24 18c-2-3 2-5 0-8M32 18c-2-3 2-5 0-8"/></g>`);
  A.tea = S('#eef5ec', `<path d="M14 24h30v16a12 12 0 0 1-12 12h-6a12 12 0 0 1-12-12z" fill="#fdfbf7"/><path d="M17 27h24v13a9 9 0 0 1-9 9h-6a9 9 0 0 1-9-9z" fill="#c98a2e"/><path d="M44 28h5a7 7 0 0 1 0 14h-5z" fill="none" stroke="#fdfbf7" stroke-width="3.4"/><rect x="10" y="52" width="38" height="5" rx="2.5" fill="#e0d6c8"/><path d="M30 20c3-4 8-5 12-4-2 5-7 6-12 4z" fill="#57b04b"/>`);
  A.soda = S('#fdeaea', `<path d="M20 12h24v38a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6z" fill="#d63a3a"/><path d="M20 12h24v6H20z" fill="#b62c2c"/><ellipse cx="32" cy="12" rx="12" ry="3.4" fill="#c9ccd0"/><path d="M24 24h6v22h-6z" fill="#fff" opacity=".25"/><circle cx="32" cy="34" r="7" fill="#fff" opacity=".85"/>`);
  A.juice = S('#fdf1de', `<path d="M20 20h24l-3 32a5 5 0 0 1-5 4H28a5 5 0 0 1-5-4z" fill="#f39c1f"/><path d="M22 28h20l-2 24a4 4 0 0 1-4 3H28a4 4 0 0 1-4-3z" fill="#ffb84d"/><ellipse cx="32" cy="20" rx="12" ry="4" fill="#ffd08a"/><rect x="34" y="6" width="3.4" height="18" rx="1.7" transform="rotate(12 34 6)" fill="#e05a5a"/>`);
  A.water = S('#e9f4fd', `<path d="M22 18h20l-2 34a5 5 0 0 1-5 4h-6a5 5 0 0 1-5-4z" fill="#dcecf7"/><path d="M24 30h16l-2 22a4 4 0 0 1-4 3h-4a4 4 0 0 1-4-3z" fill="#59a8dd"/><rect x="26" y="8" width="12" height="9" rx="2" fill="#c3d9e8"/><rect x="25" y="6" width="14" height="5" rx="2" fill="#3f8fc4"/>`);
  A.smoothie = S('#fbeaf0', `<path d="M20 22h24l-3 30a5 5 0 0 1-5 4H28a5 5 0 0 1-5-4z" fill="#e0699a"/><path d="M22 30h20l-2 22a4 4 0 0 1-4 3H28a4 4 0 0 1-4-3z" fill="#ef8fb6"/><ellipse cx="32" cy="22" rx="12" ry="4" fill="#f6b8d1"/><rect x="35" y="4" width="3.4" height="20" rx="1.7" transform="rotate(14 35 4)" fill="#57b04b"/>`);

  /* ---------- חטיפים ומתוקים ---------- */
  A.chocolate = S('#f3e8e0', `<rect x="12" y="18" width="40" height="30" rx="3" fill="#5d3720"/><g stroke="#3d2313" stroke-width="1.8"><path d="M25 18v30M38 18v30M12 28h40M12 38h40"/></g><rect x="12" y="18" width="40" height="6" rx="3" fill="#7a4c2e" opacity=".7"/>`);
  A.cookie = S('#f8efe0', `<circle cx="32" cy="34" r="20" fill="#d3a15e"/><circle cx="32" cy="34" r="20" fill="none" stroke="#bb8747" stroke-width="1.4"/><g fill="#5d3720"><circle cx="25" cy="27" r="3.4"/><circle cx="39" cy="30" r="3"/><circle cx="30" cy="40" r="3.4"/><circle cx="41" cy="42" r="2.6"/><circle cx="22" cy="38" r="2.4"/></g>`);
  A.cake = S('#fbeaf2', `<path d="M14 34h36v16a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z" fill="#e8b06a"/><path d="M14 34c0-6 8-10 18-10s18 4 18 10c-4 4-8 2-12 4s-8 2-12 0-8-1-12-4z" fill="#f5f0e6"/><path d="M14 42h36v4H14z" fill="#c98a4a" opacity=".5"/><circle cx="32" cy="22" r="3.4" fill="#e0485c"/>`);
  A.icecream = S('#fdf0e6', `<path d="M22 30h20l-8 26a2 2 0 0 1-4 0z" fill="#dba45f"/><g stroke="#b8823f" stroke-width="1" opacity=".7"><path d="M25 36l14 0M27 42l10 0M29 48l6 0"/></g><circle cx="26" cy="26" r="8" fill="#f6b8d1"/><circle cx="38" cy="26" r="8" fill="#f5e5b8"/><circle cx="32" cy="20" r="8" fill="#a8d8c8"/>`);
  A.chips = S('#fdf3e0', `<path d="M18 14h28l-3 38a6 6 0 0 1-6 5H27a6 6 0 0 1-6-5z" fill="#e8a72c"/><path d="M18 14h28l-1 8H19z" fill="#d18f16"/><g fill="#fdf3e0" opacity=".9"><circle cx="27" cy="34" r="5"/><circle cx="38" cy="32" r="4.4"/><circle cx="32" cy="42" r="4.4"/></g>`);
  A.candy = S('#fbeef6', `<circle cx="32" cy="34" r="14" fill="#e8467a"/><path d="M18 34l-10-7v14zM46 34l10-7v14z" fill="#f2799f"/><g stroke="#fff" stroke-width="2.4" fill="none" opacity=".8"><path d="M25 27c5 4 9 9 11 15M32 24c4 4 7 9 9 14"/></g>`);

  /* ---------- מנות ---------- */
  A.pizza = S('#fdeee0', `<path d="M32 8l24 44a4 4 0 0 1-4 6H12a4 4 0 0 1-4-6z" fill="#f0c157"/><path d="M32 16l19 34H13z" fill="#e8442f" opacity=".85"/><g fill="#fdf3e0"><circle cx="26" cy="36" r="3.4"/><circle cx="38" cy="34" r="3"/><circle cx="32" cy="45" r="3.4"/><circle cx="22" cy="45" r="2.6"/><circle cx="42" cy="45" r="2.6"/></g><path d="M8 52h48a4 4 0 0 1-4 6H12a4 4 0 0 1-4-6z" fill="#d9a13c"/>`);
  A.soup = S('#fdf0e2', `<path d="M10 30h44c0 14-10 24-22 24S10 44 10 30z" fill="#e8edf0"/><path d="M12 30h40c0 4-1 7-3 10H15c-2-3-3-6-3-10z" fill="#e8913c"/><path d="M4 34h6v4H4zM54 34h6v4h-6z" fill="#ccd5da"/><g stroke="#c9bcae" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"><path d="M26 22c-2-3 2-5 0-8M38 22c-2-3 2-5 0-8"/></g>`);
  A.wrap = S('#fdf2e0', `<path d="M18 12c14-4 26-2 32 6l-24 44c-10-4-14-14-14-24 0-12 2-22 6-26z" fill="#e8c68a"/><path d="M22 16c10-3 20-1 24 4L28 54c-6-4-9-12-9-20 0-8 1-14 3-18z" fill="#f2dcb0"/><g fill="#4c9a3a"><circle cx="30" cy="26" r="3"/><circle cx="27" cy="38" r="2.6"/></g><circle cx="34" cy="32" r="3" fill="#e33b30"/>`);
  A.sushi = S('#f2f5f2', `<rect x="14" y="22" width="36" height="24" rx="12" fill="#2f3b32"/><rect x="19" y="26" width="26" height="16" rx="8" fill="#fdfbf2"/><circle cx="32" cy="34" r="6" fill="#ee7a56"/><circle cx="32" cy="34" r="2.6" fill="#f7b09a"/>`);
  A.falafel = S('#f2f2df', `<path d="M12 34h40c0 12-9 20-20 20s-20-8-20-20z" fill="#e8edf0"/><path d="M14 34h36c0 3-1 5-2 7H16c-1-2-2-4-2-7z" fill="#ccd5da"/><g fill="#7a8b34"><circle cx="23" cy="26" r="7"/><circle cx="36" cy="23" r="7"/><circle cx="44" cy="30" r="6"/><circle cx="30" cy="31" r="6"/></g><g fill="#96a84c" opacity=".8"><circle cx="21" cy="24" r="2.4"/><circle cx="34" cy="21" r="2.4"/></g>`);
  A.sandwich = S('#fbf0dd', `<path d="M12 22c0-4 9-8 20-8s20 4 20 8v4H12z" fill="#e0a95e"/><path d="M12 26h40v5H12z" fill="#7fb03f"/><path d="M12 31h40v6H12z" fill="#f2e2b0"/><path d="M12 37h40v5H12z" fill="#d95c4a"/><path d="M12 42h40v4c0 4-9 8-20 8s-20-4-20-8z" fill="#e0a95e"/>`);
  A.dip = S('#f8f1e2', `<path d="M10 32h44c0 13-10 22-22 22S10 45 10 32z" fill="#e8edf0"/><path d="M13 32h38c0 9-8 16-19 16s-19-7-19-16z" fill="#e3cd9a"/><circle cx="32" cy="38" r="7" fill="#c7a75f"/><g fill="#4c9a3a"><circle cx="24" cy="34" r="2"/><circle cx="40" cy="36" r="2"/></g>`);

  /* ---------- שומנים ותוספות ---------- */
  A.oil = S('#f2f5e2', `<path d="M26 18h12v6l6 8v20a5 5 0 0 1-5 5H25a5 5 0 0 1-5-5V32l6-8z" fill="#dfe8b8"/><path d="M22 36h20v16a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z" fill="#8ba31f"/><rect x="27" y="10" width="10" height="9" rx="2" fill="#5d6b16"/><ellipse cx="32" cy="44" rx="5" ry="4" fill="#c8d96a" opacity=".55"/>`);
  A.honey = S('#fdf3d5', `<path d="M20 24h24v26a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6z" fill="#f5c93f"/><path d="M22 30h20v20a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z" fill="#e8a613"/><rect x="18" y="18" width="28" height="7" rx="2" fill="#b5762f"/><path d="M26 36l3 4-3 4M35 36l3 4-3 4" stroke="#fdf3d5" stroke-width="1.6" fill="none" opacity=".7"/>`);
  A.sugar = S('#eef2f6', `<g fill="#fff" stroke="#a9bccb" stroke-width="1.6"><rect x="17" y="27" width="14" height="13" rx="2"/><rect x="33" y="24" width="14" height="13" rx="2"/><rect x="25" y="39" width="14" height="13" rx="2"/></g><g fill="#dbe6ee"><rect x="19" y="29" width="10" height="3" rx="1.5"/><rect x="35" y="26" width="10" height="3" rx="1.5"/><rect x="27" y="41" width="10" height="3" rx="1.5"/></g>`);
  A.sauce = S('#fdeee8', `<path d="M24 16h16v8l4 6v24a5 5 0 0 1-5 5H25a5 5 0 0 1-5-5V30l4-6z" fill="#f0f2f5"/><path d="M20 34h24v20a5 5 0 0 1-5 5H25a5 5 0 0 1-5-5z" fill="#d63a3a"/><rect x="25" y="8" width="14" height="9" rx="2" fill="#b62c2c"/>`);
  A.salt = S('#eef2f6', `<path d="M22 26c0-5 4-10 10-10s10 5 10 10v24a5 5 0 0 1-5 5H27a5 5 0 0 1-5-5z" fill="#fff" stroke="#a9bccb" stroke-width="1.6"/><path d="M22 34h20v3H22z" fill="#a9bccb"/><g fill="#7d94a6"><circle cx="29" cy="23" r="1.5"/><circle cx="35" cy="23" r="1.5"/><circle cx="32" cy="27" r="1.5"/></g>`);
  A.plate = S('#f2f4f6', `<circle cx="32" cy="34" r="22" fill="#e8edf0"/><circle cx="32" cy="34" r="15" fill="#fdfdfd"/><circle cx="32" cy="34" r="15" fill="none" stroke="#dbe3e8" stroke-width="1.4"/>`);

  window.FOOD_ART = A;
})();

/* ============================================================
   התאמת איור לכל מאכל. הכללים נבדקים לפי הסדר — הראשון שמתאים
   מנצח, ולכן החוקים הספציפיים (״מיץ תפוחים״) מופיעים לפני
   הכלליים (״תפוח״).
   ============================================================ */
(function () {
  const R = [
    /* --- עוקפים ספציפיים, לפני כל כלל כללי --- */
    [/ממרח שוקולד/, 'spread'],
    [/עוגת|מאפין|סופגנייה/, 'cake'],
    [/^שוקו \(|שוקו חם|סחלב/, 'milk'],
    [/שוקולד|כיף כף|מקופלת|חלבה/, 'chocolate'],
    [/מרק/, 'soup'],
    [/מיובש|צימוקים|חמוציות/, 'dried'],
    [/שומשום/, 'seeds'],
    [/סילאן/, 'honey'],
    [/בורקס|קרואסון|רוגלך|פנקייק|פשטידה|חביתת ירק/, 'sandwich'],
    [/פריכיות|קרקר/, 'cookie'],
    [/דגני בוקר|קורנפלקס|גרנולה/, 'cereal'],
    [/צמחי|טופו/, 'tofu'],
    [/סוכריות/, 'candy'],
    [/סלט/, 'salad'],

    /* --- משקאות (לפני הפירות, כי שמותיהם מכילים שמות פירות) --- */
    [/מיץ|נקטר |לימונדה|לימונענע/, 'juice'],
    [/מילקשייק|סמוזי/, 'smoothie'],
    [/^מים|מוגזים/, 'water'],
    [/קולה|ספרייט|פאנטה|שוופס|אנרגיה|אייס טי|משקה קל/, 'soda'],
    [/בירה|יין/, 'juice'],
    [/^שוקו|שוקולד חם|סחלב/, 'milk'],
    [/אספרסו|קפה|קפוצ|אמריקנו|לאטה/, 'coffee'],
    [/^תה/, 'tea'],
    [/כפית סוכר|^סוכר|ממתיק/, 'sugar'],

    /* --- ירקות ופירות עם שם דו-משמעי --- */
    [/תפוח אדמה|פירה|צ׳יפס מטוגן/, 'potato'],
    [/בטטה/, 'sweetpotato'],
    [/^תפוח/, 'apple'],
    [/בננה/, 'banana'],
    [/תפוז|קלמנטינה|אשכולית|פומלה/, 'citrus'],
    [/ענבים/, 'grapes'],
    [/אבטיח|מלון/, 'melon'],
    [/תות|אוכמנ|פטל|דובדב/, 'berry'],
    [/אגס/, 'pear'],
    [/אפרסק|נקטרינה|שזיף|משמש|מנגו|אפרסמון|גויאבה|שסק|פפאיה|ליצ|פסיפלורה|קרמבולה/, 'stone'],
    [/אבוקדו/, 'avocado'],
    [/קיווי/, 'kiwi'],
    [/אננס/, 'pineapple'],
    [/תמר|תאנה/, 'date'],
    [/רימון/, 'berry'],

    /* --- ירקות --- */
    [/עגבנייה|עגבניות|רוטב עגבניות/, 'tomato'],
    [/מלפפון|קישוא|חמוצים/, 'cucumber'],
    [/פלפל/, 'pepper'],
    [/גזר/, 'carrot'],
    [/ברוקולי|כרובית|קולורבי|ארטישוק|אספרגוס|במיה/, 'broccoli'],
    [/חסה|כרוב|תרד|פטרוזיליה|כוסברה|שמיר|נענע|נבטים|כרישה|סלרי/, 'leafy'],
    [/בצל|^שום$/, 'onion'],
    [/תירס/, 'corn'],
    [/פטריות/, 'mushroom'],
    [/חציל/, 'eggplant'],
    [/זיתים/, 'olive'],
    [/דלעת|סלק|צנון|שעועית ירוקה|אפונה ירוקה|ירקות בתנור/, 'leafy'],

    /* --- חלבונים --- */
    [/ביצה|ביצת|חביתה|חלבון ביצה|שקשוקה/, 'egg'],
    [/עוף|הודו|שניצל|כנפי/, 'chicken'],
    [/בקר|סטייק|כבש|קבב|קציצות|נקניק|פסטרמה|שווארמה|המבורגר|סיניה/, 'meat'],
    [/סלמון|דניס|לברק|טונה|מושט|בקלה|^דגים/, 'fish'],
    [/שרימפס/, 'shrimp'],

    /* --- חלב וגבינות --- */
    [/צהובה|מוצרלה/, 'cheese_y'],
    [/קוטג|גבינ|לאבנה|פטה|בולגרית|ריקוטה/, 'cheese_w'],
    [/יוגורט|אשל/, 'yogurt'],
    [/^חלב|שמנת/, 'milk'],

    /* --- דגנים ומאפים --- */
    [/פיתה|טורטייה|מלאווח|ג׳חנון|לאפה/, 'pita'],
    [/לחם|לחמנייה|בייגל|חלה/, 'bread'],
    [/פסטה|פתיתים|לזניה|קובה/, 'pasta'],
    [/אורז|קוסקוס|בורגול|קינואה/, 'rice'],
    [/שיבולת שועל|קוואקר|דייסת/, 'oats'],

    /* --- קטניות --- */
    [/עדשים/, 'lentils'],
    [/חומוס|גרגירי/, 'chickpea'],
    [/שעועית|פול|אדממה|מג׳דרה/, 'beans'],

    /* --- אגוזים וזרעים --- */
    [/חמאת בוטנים|ממרח שוקולד|טחינה/, 'spread'],
    [/שקדים|אגוזי|קשיו|פיסטוק|בוטנים|פקאן/, 'nut'],
    [/גרעיני|זרעי/, 'seeds'],

    /* --- חטיפים --- */
    [/במבה|ביסלי|צ׳יפס|דוריטוס|נאצ|בייגלה|פופקורן/, 'chips'],
    [/שוקולד|כיף כף|מקופלת|חלבה/, 'chocolate'],
    [/עוגייה|עוגיות|וופל/, 'cookie'],
    [/עוגת|מאפין|סופגנייה/, 'cake'],
    [/גליד|ארטיק|קרטיב|קרמבו/, 'icecream'],
    [/חטיף חלבון|חטיף אנרגיה/, 'candy'],

    /* --- מנות --- */
    [/פלאפל/, 'falafel'],
    [/פיצה/, 'pizza'],
    [/סושי/, 'sushi'],
    [/מרק/, 'soup'],

    /* --- רטבים ותוספות --- */
    [/שמן/, 'oil'],
    [/דבש|ריבה/, 'honey'],
    [/^מלח/, 'salt'],
    [/חמאה|מרגרינה/, 'spread'],
    [/קטשופ|מיונז|חרדל|סחוג|רוטב/, 'sauce']
  ];

  const CAT_FALLBACK = {
    fruit: 'apple', veg: 'leafy', breakfast: 'bread', dairy: 'cheese_w',
    coffee: 'coffee', drink_sweet: 'juice', protein: 'meat', carb: 'rice',
    legume: 'beans', nuts: 'nut', snack: 'candy', dish: 'plate',
    sauce: 'sauce', custom: 'plate'
  };

  const cache = new Map();
  window.artIdFor = function (food) {
    if (food.art) return food.art;
    const key = food.n;
    if (cache.has(key)) return cache.get(key);
    let id = null;
    for (const [re, a] of R) if (re.test(key)) { id = a; break; }
    if (!id || !window.FOOD_ART[id]) id = CAT_FALLBACK[food.c] || 'plate';
    cache.set(key, id);
    return id;
  };

  /* מחזיר SVG מלא, מוכן להטמעה */
  window.artSVG = function (food, size) {
    const a = window.FOOD_ART[window.artIdFor(food)] || window.FOOD_ART.plate;
    return `<svg class="art" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true"
      style="background:${a.bg}">${a.body}</svg>`;
  };
  window.artBG = function (food) {
    const a = window.FOOD_ART[window.artIdFor(food)] || window.FOOD_ART.plate;
    return a.bg;
  };
})();
