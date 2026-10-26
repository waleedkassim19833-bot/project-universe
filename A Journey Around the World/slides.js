const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let accent = "#3DF5C0";

/* ---------- تجهيز النصوص والحركة ---------- */
$$("[data-split]").forEach(el => {
  el.innerHTML = el.textContent.trim().split(/\s+/).map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`).join(" ");
});
$$(".slide").forEach(s => {
  const kids = [...s.children].flatMap(c => c.classList.contains("copy") ? [...c.children] : [c]);
  kids.forEach((c, i) => {
    if (c.classList.contains("norv") || c.hasAttribute("data-split")) return;
    c.classList.add("rv");
    c.style.setProperty("--d", i);
  });
});

/* ---------- خلفية الشبكة الحيّة ---------- */
const cv = $("#bg"), cx = cv.getContext("2d");
let W, H, nodes = [], pulses = [], mouse = { x: -999, y: -999 }, tick = 0;
function sizeBg() {
  W = cv.width = innerWidth; H = cv.height = innerHeight;
  const n = Math.min(110, Math.round(W * H / 16000));
  nodes = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }));
}
function bgFrame() {
  cx.clearRect(0, 0, W, H);
  for (const n of nodes) {
    if (!reduce) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 140 && d > 0) { n.x += dx / d * 1.6; n.y += dy / d * 1.6; }
    }
  }
  cx.lineWidth = 1; cx.strokeStyle = "#fff";
  for (let a = 0; a < nodes.length; a++) for (let b = a + 1; b < nodes.length; b++) {
    const d = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
    if (d < 150) {
      cx.globalAlpha = (1 - d / 150) * .2;
      cx.beginPath(); cx.moveTo(nodes[a].x, nodes[a].y); cx.lineTo(nodes[b].x, nodes[b].y); cx.stroke();
    }
  }
  cx.globalAlpha = .5; cx.fillStyle = "#fff";
  for (const n of nodes) { cx.beginPath(); cx.arc(n.x, n.y, 1.8, 0, 7); cx.fill(); }
  if (!reduce && ++tick % 35 === 0) {
    const a = nodes[Math.random() * nodes.length | 0];
    const near = nodes.filter(n => n !== a && Math.hypot(n.x - a.x, n.y - a.y) < 150);
    if (near.length) pulses.push({ a, b: near[Math.random() * near.length | 0], t: 0 });
  }
  cx.fillStyle = accent; cx.shadowColor = accent; cx.shadowBlur = 14; cx.globalAlpha = 1;
  pulses = pulses.filter(p => p.t < 1);
  for (const p of pulses) {
    p.t += .025;
    cx.beginPath(); cx.arc(p.a.x + (p.b.x - p.a.x) * p.t, p.a.y + (p.b.y - p.a.y) * p.t, 3.4, 0, 7); cx.fill();
  }
  cx.shadowBlur = 0; cx.globalAlpha = 1;
}
addEventListener("resize", sizeBg);
addEventListener("pointermove", e => {
  mouse.x = e.clientX; mouse.y = e.clientY;
  document.documentElement.style.setProperty("--mx", e.clientX + "px");
  document.documentElement.style.setProperty("--my", e.clientY + "px");
});
sizeBg();

/* ---------- كرة الأرض ثلاثية الأبعاد ---------- */
const CITY = {
  riyadh: [24.7, 46.7], cairo: [30.0, 31.2], london: [51.5, -0.1], tokyo: [35.7, 139.7],
  saopaulo: [-23.5, -46.6], sydney: [-33.9, 151.2], virginia: [38.9, -77.4], frankfurt: [50.1, 8.7],
  singapore: [1.35, 103.8], mumbai: [19.1, 72.9], lagos: [6.5, 3.4], sf: [37.8, -122.4], sanaa: [15.4, 44.2]
};
const vec = (lat, lon) => {
  const p = lat * Math.PI / 180, l = lon * Math.PI / 180;
  return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)];
};
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${n >> 8 & 255},${n & 255},${a})`; };


/* قارات مبسّطة (lon, lat) لتلوين نقاط اليابسة */
const LAND = [
  [[-168,66],[-156,71],[-125,70],[-95,70],[-80,70],[-62,60],[-55,52],[-66,44],[-76,35],[-81,25],[-83,29],[-90,30],[-97,26],[-97,20],[-94,18],[-90,21],[-87,21],[-88,16],[-83,15],[-83,10],[-78,8],[-80,7],[-86,11],[-92,14],[-105,20],[-110,24],[-112,29],[-117,32],[-122,37],[-124,42],[-124,48],[-135,58],[-150,60],[-165,55],[-158,58]],
  [[-78,8],[-72,12],[-62,10],[-52,5],[-50,0],[-35,-6],[-39,-14],[-41,-22],[-48,-26],[-58,-35],[-65,-42],[-68,-52],[-72,-52],[-75,-46],[-72,-30],[-70,-18],[-76,-14],[-81,-5],[-80,0],[-77,4]],
  [[-9,37],[-9,43],[-1,43.5],[-4.5,48],[-1,49],[2,51],[5,53],[8,54],[8,57],[10,58],[12,56],[14,55],[20,55],[22,59],[28,60],[22,64],[25,66],[20,70],[28,71],[40,67],[44,68],[60,69],[68,73],[80,73],[90,76],[105,78],[113,74],[130,71],[150,70],[170,70],[179,67],[179,64],[170,60],[162,58],[156,51],[142,52],[141,47],[135,43],[129,41],[129,35],[126,35],[126,38],[122,40],[121,37],[119,35],[122,30],[120,26],[116,22],[110,21],[108,16],[109,12],[105,9],[104,10],[101,13],[100,8],[103,1],[100,3],[98,8],[98,14],[94,17],[92,21],[88,22],[86,20],[80,15],[78,8],[76,10],[73,17],[72,21],[69,22],[67,25],[62,25],[57,26],[56,27],[52,28],[50,30],[46,33],[42,37],[36,36],[30,36],[27,37],[26,40],[23,40],[22,37],[19,40],[19,42],[14,45],[12,45],[16,41],[18,40],[16,38],[10,44],[3,43],[0,39],[-2,37],[-6,36]],
  [[-17,21],[-13,28],[-9,32],[-6,36],[10,37],[11,33],[20,31],[32,31],[34,28],[38,20],[43,12],[51,12],[51,10],[40,-3],[40,-15],[35,-24],[32,-29],[27,-34],[19,-35],[15,-27],[12,-17],[13,-8],[9,0],[9,4],[5,6],[-4,5],[-8,4],[-13,8],[-17,14]],
  [[35,29],[34,28],[39,22],[43,13],[45,13],[52,16],[57,19],[59,22],[56,26],[51,25],[48,30],[44,32],[38,32]],
  [[114,-22],[122,-18],[130,-12],[136,-12],[137,-16],[142,-11],[146,-19],[153,-26],[151,-34],[146,-39],[140,-38],[135,-34],[129,-32],[115,-34],[113,-26]],
  [[-55,60],[-43,60],[-22,70],[-20,80],[-40,83],[-65,81],[-70,77],[-58,75]],
  [[130,31],[135,34],[140,36],[142,40],[141,43],[145,44],[140,42],[137,37],[132,35]],
  [[-5,50],[1,51],[2,53],[-2,57],[-3,59],[-6,58],[-5,54],[-3,53]],
  [[95,5],[98,4],[106,-3],[104,-6],[100,-2]],
  [[109,1],[117,7],[119,1],[116,-4],[110,-3]],
  [[105,-6],[114,-7],[114,-8],[106,-7]],
  [[131,-1],[141,-3],[150,-10],[141,-9],[135,-4]],
  [[44,-25],[47,-25],[50,-15],[49,-12],[44,-17]]
];
const inPoly = (poly, lon, lat) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > lat) !== (yj > lat) && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const DOTS = (() => {
  const N = 2600, out = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - 2 * i / (N - 1), r = Math.sqrt(1 - y * y), th = 2.399963 * i;
    const x = r * Math.cos(th), z = r * Math.sin(th);
    const lat = Math.asin(y) * 180 / Math.PI, lon = Math.atan2(x, z) * 180 / Math.PI;
    out.push({ v: [x, y, z], land: lat < -68 || LAND.some(p => inPoly(p, lon, lat)) });
  }
  return out;
})();

function makeGlobe(canvas) {
  const ctx = canvas.getContext("2d");
  const g = { rot: -.8, tilt: .35, tRot: null, tTilt: 0, drag: false, arcs: [], marks: [], rings: [] };
  let cxp = 0, cyp = 0, R = 0, d = 1;

  function fit() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return false;
    d = Math.min(devicePixelRatio || 1, 2);
    const w = Math.round(r.width * d), h = Math.round(r.height * d);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    cxp = w / 2; cyp = h / 2; R = Math.min(w, h) * .37;
    return true;
  }
  function proj(v, alt = 1) {
    const cr = Math.cos(g.rot), sr = Math.sin(g.rot);
    const x = v[0] * cr + v[2] * sr, y = v[1], z = -v[0] * sr + v[2] * cr;
    const ct = Math.cos(g.tilt), st = Math.sin(g.tilt);
    return [cxp + R * alt * x, cyp - R * alt * (y * ct - z * st), y * st + z * ct];
  }
  g.focus = (lat, lon) => {
    g.tRot = -lon * Math.PI / 180;
    g.tTilt = Math.max(-.6, Math.min(.8, lat * Math.PI / 180 * .7));
  };
  g.addArc = (A, B, c, dur, delay = 0, fade = false) => {
    const a = vec(...A), b = vec(...B);
    const om = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))) || 1e-3;
    const h = .08 + .28 * om / Math.PI, s = [];
    for (let k = 0; k <= 56; k++) {
      const t = k / 56, s1 = Math.sin((1 - t) * om) / Math.sin(om), s2 = Math.sin(t * om) / Math.sin(om);
      s.push({ v: [s1 * a[0] + s2 * b[0], s1 * a[1] + s2 * b[1], s1 * a[2] + s2 * b[2]], alt: 1 + h * Math.sin(Math.PI * t) });
    }
    g.arcs.push({ s, c, dur, t0: performance.now() + delay, fade });
  };
  g.addRing = (loc, c, dur, delay = 0) => g.rings.push({ loc, c, dur, t0: performance.now() + delay });

  g.draw = now => {
    if (!fit()) return;
    if (!g.drag) {
      if (g.tRot !== null) {
        let df = g.tRot - g.rot; df = Math.atan2(Math.sin(df), Math.cos(df));
        g.rot += df * .07; g.tilt += (g.tTilt - g.tilt) * .07;
      } else if (!reduce) g.rot += .0022;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let gr = ctx.createRadialGradient(cxp, cyp, R * .85, cxp, cyp, R * 1.4);
    gr.addColorStop(0, rgba(accent, .28)); gr.addColorStop(1, rgba(accent, 0));
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(cxp, cyp, R * 1.4, 0, 7); ctx.fill();
    gr = ctx.createRadialGradient(cxp - R * .35, cyp - R * .4, R * .1, cxp, cyp, R);
    gr.addColorStop(0, "#2a2a8a"); gr.addColorStop(1, "#0d0c33");
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(cxp, cyp, R, 0, 7); ctx.fill();
    ctx.strokeStyle = rgba(accent, .5); ctx.lineWidth = 1.5 * d; ctx.stroke();

    for (const p of DOTS) {
      const q = proj(p.v);
      if (q[2] <= 0) continue;
      if (p.land) { ctx.fillStyle = `rgba(255,255,255,${.3 + .6 * q[2]})`; ctx.fillRect(q[0], q[1], 2.2 * d, 2.2 * d); }
      else { ctx.fillStyle = `rgba(255,255,255,${.05 + .1 * q[2]})`; ctx.fillRect(q[0], q[1], 1.3 * d, 1.3 * d); }
    }
    ctx.lineWidth = d; ctx.strokeStyle = "rgba(255,255,255,.1)";
    const line = (fn, n) => {
      ctx.beginPath(); let pen = false;
      for (let i = 0; i <= n; i++) {
        const q = proj(fn(i));
        if (q[2] > 0) { pen ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); pen = true; } else pen = false;
      }
      ctx.stroke();
    };
    for (let la = -60; la <= 60; la += 30) line(i => vec(la, i * 6), 60);
    for (let lo = 0; lo < 360; lo += 30) line(i => vec(-90 + i * 6, lo), 30);

    for (let i = g.arcs.length - 1; i >= 0; i--) {
      const a = g.arcs[i];
      if (now < a.t0) continue;
      const t = Math.min(1, (now - a.t0) / a.dur);
      let al = 1;
      if (a.fade && t >= 1) { al = 1 - (now - a.t0 - a.dur) / 1200; if (al <= 0) { g.arcs.splice(i, 1); continue; } }
      const end = Math.floor(56 * t);
      ctx.lineWidth = 2 * d; ctx.strokeStyle = rgba(a.c, .85 * al); ctx.shadowColor = a.c; ctx.shadowBlur = 10 * d;
      ctx.beginPath(); let pen = false, hq = null;
      for (let k = 0; k <= end; k++) {
        const q = proj(a.s[k].v, a.s[k].alt);
        if (q[2] > 0) { pen ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); pen = true; hq = q; } else pen = false;
      }
      ctx.stroke();
      if (t < 1 && hq) { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(hq[0], hq[1], 4 * d, 0, 7); ctx.fill(); }
      ctx.shadowBlur = 0;
    }
    for (let i = g.rings.length - 1; i >= 0; i--) {
      const r = g.rings[i];
      if (now < r.t0) continue;
      const t = (now - r.t0) / r.dur;
      if (t > 1) { g.rings.splice(i, 1); continue; }
      const q = proj(vec(...r.loc));
      if (q[2] > 0) { ctx.strokeStyle = rgba(r.c, 1 - t); ctx.lineWidth = 2 * d; ctx.beginPath(); ctx.arc(q[0], q[1], (8 + 46 * t) * d, 0, 7); ctx.stroke(); }
    }
    for (const m of g.marks) {
      const q = proj(vec(m.lat, m.lon));
      if (q[2] <= .02) continue;
      ctx.shadowColor = m.c; ctx.shadowBlur = 16 * d; ctx.fillStyle = m.c;
      ctx.beginPath(); ctx.arc(q[0], q[1], (m.r || 3) * d, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      if (m.label) {
        ctx.fillStyle = "#fff"; ctx.font = `600 ${13 * d}px "Readex Pro",Tahoma,sans-serif`; ctx.textAlign = "center";
        ctx.fillText(m.label, q[0], q[1] - 12 * d);
      }
    }
  };

  let lx = 0, ly = 0;
  canvas.addEventListener("pointerdown", e => { g.drag = true; g.tRot = null; lx = e.clientX; ly = e.clientY; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = "grabbing"; });
  canvas.addEventListener("pointermove", e => {
    if (!g.drag) return;
    g.rot += (e.clientX - lx) * .006;
    g.tilt = Math.max(-.9, Math.min(1, g.tilt + (e.clientY - ly) * .004));
    lx = e.clientX; ly = e.clientY;
  });
  ["pointerup", "pointercancel"].forEach(ev => canvas.addEventListener(ev, () => { g.drag = false; canvas.style.cursor = "grab"; }));
  return g;
}

const G1 = makeGlobe($("#g1")), G2 = makeGlobe($("#g2"));
G1.marks = Object.values(CITY).map(([lat, lon]) => ({ lat, lon, c: "#fff", r: 2.6 }));
let lastSpawn = 0;
function spawnTraffic(now) {
  if (reduce || now - lastSpawn < 1000) return;
  lastSpawn = now;
  const k = Object.keys(CITY), a = k[Math.random() * k.length | 0];
  let b = k[Math.random() * k.length | 0]; if (b === a) b = "virginia";
  G1.addArc(CITY[a], CITY[b], accent, 1800, 0, true);
}

/* ---------- الحلقة الرئيسية ---------- */
function loop(now) {
  bgFrame();
  if (cur === 0) { spawnTraffic(now); G1.draw(now); }
  if (cur === 5) G2.draw(now);
  requestAnimationFrame(loop);
}

/* ---------- قصاصات الاحتفال ---------- */
const fx = $("#fx"), fc = fx.getContext("2d");
function confetti(count = 140) {
  fx.width = innerWidth; fx.height = innerHeight;
  const cols = ["#3DF5C0", "#FF6B81", "#FFD166", "#8EC5FF", "#fff"];
  const ps = Array.from({ length: count }, () => ({
    x: innerWidth / 2, y: innerHeight * .65,
    vx: (Math.random() - .5) * 18, vy: -Math.random() * 16 - 6,
    s: 5 + Math.random() * 7, c: cols[Math.random() * cols.length | 0],
    r: Math.random() * 6, vr: (Math.random() - .5) * .35
  }));
  (function f() {
    fc.clearRect(0, 0, fx.width, fx.height);
    let alive = false;
    for (const p of ps) {
      p.vy += .38; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.vx *= .99;
      if (p.y < innerHeight + 20) alive = true;
      fc.save(); fc.translate(p.x, p.y); fc.rotate(p.r); fc.fillStyle = p.c; fc.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); fc.restore();
    }
    if (alive) requestAnimationFrame(f); else fc.clearRect(0, 0, fx.width, fx.height);
  })();
}

/* ---------- التنقل بين الشرائح ---------- */
const slides = $$(".slide"), counter = $("#counter"), bar = $(".bar i"), wipe = $("#wipe");
const enter = {};
let cur = 0, first = true, swapT = 0;
function show(n) {
  cur = Math.max(0, Math.min(slides.length - 1, n));
  counter.textContent = `${cur + 1} / ${slides.length}`;
  bar.style.width = `${(cur + 1) / slides.length * 100}%`;
  accent = slides[cur].dataset.accent || "#3DF5C0";
  document.body.style.setProperty("--accent", accent);
  try { history.replaceState(null, "", `#${cur + 1}`); } catch (e) {}
  const swap = () => { slides.forEach((s, k) => (s.hidden = k !== cur)); if (enter[cur]) enter[cur](); };
  clearTimeout(swapT);
  if (first || reduce) { first = false; swap(); return; }
  wipe.classList.remove("go"); void wipe.offsetWidth; wipe.classList.add("go");
  swapT = setTimeout(swap, 340);
}
const next = () => show(cur + 1), prev = () => show(cur - 1);

document.addEventListener("keydown", e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const t = e.target;
  if (t.closest && t.closest("input,textarea,select")) return;
  switch (e.key) {
    case "ArrowLeft": case "PageDown": e.preventDefault(); next(); break;
    case " ": if (t.closest && t.closest("button")) return; e.preventDefault(); next(); break;
    case "ArrowRight": case "PageUp": e.preventDefault(); prev(); break;
    case "Home": show(0); break;
    case "End": show(slides.length - 1); break;
    case "f": case "F": toggleFs(); break;
  }
});
$("#next").onclick = next;
$("#prev").onclick = prev;
document.addEventListener("click", e => {
  const g = e.target.closest("[data-go]");
  if (!g) return;
  g.dataset.go === "first" ? show(0) : next();
});
let sx = null;
document.addEventListener("touchstart", e => { sx = e.target.closest("input,.noswipe") ? null : e.touches[0].clientX; }, { passive: true });
document.addEventListener("touchend", e => {
  if (sx === null) return;
  const dx = e.changedTouches[0].clientX - sx;
  if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
  sx = null;
});
function toggleFs() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
}
$("#fs").onclick = toggleFs;

/* ---------- 2: الرحلة ---------- */
(function () {
  const st = $$("#journey .st"), fill = $("#jfill"), pk = $("#packet"), ms = $("#jms"), tx = $("#jtext"), go = $("#jgo");
  const T = [
    "المتصفح يقرأ العنوان ويحوّله إلى طلب HTTP.",
    "DNS: ما عنوان IP لهذا الاسم؟ فيأتي الجواب رقمًا.",
    "مصافحة TLS: اتفاق على مفتاح تشفير، فيظهر القفل.",
    "الخادم أو CDN يجد الملفات ويرسلها: HTML ثم CSS ثم JS.",
    "المتصفح يبني الصفحة ويرسمها على شاشتك."
  ];
  const M = [0, 20, 80, 160, 300], INTRO = "اضغط الزر وراقب الرحلة محطة بعد محطة.";
  let raf = 0;
  function paint(p) {
    fill.style.width = p * 100 + "%";
    pk.style.insetInlineStart = (10 + p * 80) + "%";
    const seg = Math.min(3, Math.floor(p * 4)), l = p * 4 - seg;
    ms.textContent = Math.round(M[seg] + (M[seg + 1] - M[seg]) * l);
    let a = -1;
    st.forEach((s, k) => { const on = p >= k / 4 - .001; s.classList.toggle("on", on); if (on) a = k; });
    if (a >= 0) tx.textContent = T[a];
  }
  function reset() {
    cancelAnimationFrame(raf);
    fill.style.width = "0%"; pk.style.insetInlineStart = "10%"; ms.textContent = "0";
    st.forEach(s => s.classList.remove("on"));
    tx.textContent = INTRO; go.textContent = "⏎ Enter";
  }
  go.onclick = () => {
    cancelAnimationFrame(raf);
    const t0 = performance.now(), D = reduce ? 600 : 6500;
    go.textContent = "…";
    raf = requestAnimationFrame(function f(now) {
      const p = Math.max(0, Math.min(1, (now - t0) / D));
      paint(p);
      if (p < 1) raf = requestAnimationFrame(f);
      else { tx.textContent = "اكتملت الرحلة في ٣٠٠ ملّي ثانية. وكل محطة يمكن تسريعها."; go.textContent = "↻ أعد الرحلة"; }
    });
  };
  enter[1] = reset;
})();

/* ---------- 3: DNS ---------- */
(function () {
  const form = $("#dnsForm"), inp = $("#dnsIn"), out = $("#dnsOut"), chips = $("#dnsChips");
  let tok = 0;
  const ipOf = n => {
    let h = 0; for (const c of n) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return [104, 172, 151, 76, 34, 13][h % 6] + "." + ((h >>> 3) % 256) + "." + ((h >>> 11) % 256) + "." + ((h >>> 19) % 254 + 1);
  };
  async function look() {
    const my = ++tok;
    const name = inp.value.trim().toLowerCase().replace(/^https?:\/\//, "").split(/[/?#]/)[0] || "my-site.pages.dev";
    inp.value = name;
    const parts = name.split("."), tld = "." + parts[parts.length - 1], zone = parts.slice(-2).join("."), ip = ipOf(name);
    out.innerHTML = "";
    const rows = [
      ["الخادم الجذر لا يعرف الجواب، لكنه يعرف من يعرف.", `. (root) → ask ${tld}`],
      ["خادم النطاق العلوي يدلّك على الخادم المسؤول عن اسمك.", `${tld} → ask ns1.${zone}`],
      ["الخادم المسؤول يعطيك الجواب: عنوان IP.", `ns1.${zone} → ${ip}`],
      ["تم. الآن يعرف المتصفح أين يطرق الباب. (العنوان توضيحي)", `✓ ${name} = ${ip}`]
    ];
    for (let k = 0; k < rows.length; k++) {
      await sleep(reduce ? 0 : 650);
      if (my !== tok) return;
      out.insertAdjacentHTML("beforeend", `<div class="row${k === 3 ? " done" : ""}"><span>${rows[k][0]}</span><code>${esc(rows[k][1])}</code></div>`);
    }
  }
  ["google.com", "wikipedia.org", "netlify.app", "your-name.pages.dev"].forEach(d => {
    const b = document.createElement("button"); b.type = "button"; b.textContent = d; b.dir = "ltr";
    b.onclick = () => { inp.value = d; look(); };
    chips.append(b);
  });
  form.onsubmit = e => { e.preventDefault(); look(); };
  enter[2] = () => { inp.value = "my-site.pages.dev"; look(); };
})();

/* ---------- 4: TLS ---------- */
(function () {
  const log = $("#tlsLog"), go = $("#tlsGo"), lock = $("#lockbox"), sc = $("#cipher");
  const S = [
    { w: "c", code: "ClientHello", t: "مرحبًا! هذه طرق التشفير التي أفهمها." },
    { w: "s", code: "ServerHello + Certificate", t: "اخترت هذا التشفير، وهذه شهادتي لتتأكد أنني الموقع الحقيقي." },
    { w: "c", code: "Key Exchange", t: "لنتّفق على مفتاح سري لا يعرفه أحد غيرنا." },
    { w: "s", code: "Finished 🔒", t: "تم. من الآن كل ما نتبادله مشفّر." }
  ];
  let k = 0, timer = 0;
  function scramble() {
    const fin = "7f3a 9ce1 b244 d0a8 f5", H = "0123456789abcdef";
    let f = 0; clearInterval(timer);
    timer = setInterval(() => {
      f++;
      sc.textContent = [...fin].map((c, i) => c === " " ? " " : (i < f / 1.6 ? c : H[Math.random() * 16 | 0])).join("");
      if (f > fin.length * 1.6 + 2) { clearInterval(timer); sc.textContent = fin; }
    }, 50);
  }
  function reset() { clearInterval(timer); log.innerHTML = ""; k = 0; lock.classList.remove("on"); sc.textContent = "····"; go.textContent = "الخطوة الأولى"; }
  go.onclick = () => {
    if (k >= S.length) { reset(); return; }
    const s = S[k++];
    log.insertAdjacentHTML("beforeend", `<div class="bub ${s.w}"><code>${s.code}</code><span>${s.t}</span></div>`);
    if (k === S.length) { lock.classList.add("on"); scramble(); go.textContent = "↻ أعد المصافحة"; }
    else go.textContent = "الخطوة التالية";
  };
  enter[3] = reset;
})();

/* ---------- 5: HTTP ---------- */
(function () {
  const D = {
    200: { ico: "✅", c: "#3DF5C0", t: "OK: تمام", x: "الخادم وجد الملف وأرسله. هذا ما تتمنى رؤيته دائمًا.", p: "/index.html", st: "HTTP/1.1 200 OK",
      h: ["Content-Type: text/html; charset=utf-8", "Content-Length: 4821", "", "<!DOCTYPE html><html lang=\"ar\" dir=\"rtl\">…"] },
    301: { ico: "↪️", c: "#FFD166", t: "انتقلت الصفحة", x: "الخادم يقول: العنوان تغيّر، اذهب إلى هناك. يحدث عند التحويل إلى https.", p: "/", st: "HTTP/1.1 301 Moved Permanently",
      h: ["Location: https://my-site.pages.dev/", "Content-Length: 0", ""] },
    404: { ico: "🔍", c: "#FF6B81", t: "غير موجودة", x: "الخادم يعمل لكنه لم يجد الصفحة. غالبًا اسم الملف أو حالة الأحرف: Index.HTML ليس index.html.", p: "/Index.HTML", st: "HTTP/1.1 404 Not Found",
      h: ["Content-Type: text/html", "Content-Length: 146", "", "<h1>404: Page not found</h1>"] },
    500: { ico: "🔥", c: "#FF6B81", t: "عطل في الخادم", x: "الخطأ عند الخادم لا عندك. في المواقع الثابتة نادر جدًا، وهذه إحدى مزاياها.", p: "/api/orders", st: "HTTP/1.1 500 Internal Server Error",
      h: ["Content-Type: text/plain", "Content-Length: 21", "", "Something went wrong"] }
  };
  const chips = $("#codeChips"), term = $("#httpTerm"), v = $("#verdict");
  let tok = 0;
  async function run(code) {
    const my = ++tok, d = D[code];
    $$("button", chips).forEach(b => b.classList.toggle("on", b.dataset.c == code));
    term.innerHTML = "";
    v.style.setProperty("--c", d.c);
    v.classList.remove("pop"); void v.offsetWidth; v.classList.add("pop");
    $("#vnum").textContent = code; $("#vico").textContent = d.ico; $("#vtitle").textContent = d.t; $("#vtext").textContent = d.x;
    const lines = [["req", `GET ${d.p} HTTP/1.1`], ["req", "Host: my-site.pages.dev"], ["req", "Accept: text/html"], ["req", ""], ["stt", d.st], ...d.h.map(h => ["res", h])];
    for (const [cl, tx] of lines) {
      await sleep(reduce ? 0 : 260);
      if (my !== tok) return;
      term.insertAdjacentHTML("beforeend", `<div class="ln ${cl}">${esc(tx) || "&nbsp;"}</div>`);
    }
  }
  Object.keys(D).forEach(c => {
    const b = document.createElement("button"); b.type = "button"; b.textContent = c; b.dataset.c = c; b.dir = "ltr";
    b.onclick = () => run(c);
    chips.append(b);
  });
  enter[4] = () => run(200);
})();

/* ---------- 6: CDN مع الكرة ---------- */
(function () {
  const C = [["الرياض", 10800, 80, "riyadh"], ["اليمن", 11600, 900, "sanaa"], ["القاهرة", 9000, 120, "cairo"], ["لندن", 5900, 50, "london"],
    ["طوكيو", 10900, 60, "tokyo"], ["ساو باولو", 7600, 100, "saopaulo"], ["سيدني", 15700, 90, "sydney"]];
  const box = $("#cityChips"), bo = $("#barOrigin"), be = $("#barEdge"), mo = $("#msOrigin"), me = $("#msEdge"), note = $("#cdnNote");
  function tween(el, to) {
    const from = +el.textContent || 0, t0 = performance.now();
    requestAnimationFrame(function f(now) {
      const p = Math.max(0, Math.min(1, (now - t0) / 900));
      el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(f);
    });
  }
  function pick(k) {
    $$("button", box).forEach((b, j) => b.classList.toggle("on", j === k));
    const [n, ko, ke, key] = C[k], o = Math.round(12 + ko / 70), e = Math.round(6 + ke / 70);
    bo.style.width = Math.min(100, o / 260 * 100) + "%";
    be.style.width = Math.min(100, e / 260 * 100) + "%";
    tween(mo, o); tween(me, e);
    note.textContent = `زائر من ${n}: الطلب يقطع ${ko.toLocaleString("en")} كم إلى الخادم الأصلي، أو ${ke} كم فقط إلى أقرب نسخة. أسرع بنحو ${Math.round(o / e)} ${Math.round(o / e) <= 10 ? "مرات" : "مرة"}. (أرقام تقديرية)`;
    const V = CITY[key], O = CITY.virginia, a = vec(...V), b = vec(...O);
    const m = [a[0] + b[0], a[1] + b[1], a[2] + b[2]], len = Math.hypot(...m) || 1;
    G2.focus(Math.asin(m[1] / len) * 180 / Math.PI, Math.atan2(m[0], m[2]) * 180 / Math.PI);
    G2.arcs.length = 0; G2.rings.length = 0;
    G2.marks = [
      { lat: O[0], lon: O[1], c: "#FF6B81", r: 6, label: "الخادم الأصلي" },
      { lat: V[0], lon: V[1], c: "#3DF5C0", r: 6, label: n }
    ];
    const dur = 600 + o * 8;
    G2.addArc(V, O, "#FF6B81", dur);
    G2.addArc(O, V, "#FFD166", dur, dur);
    G2.addRing(V, "#3DF5C0", 700); G2.addRing(V, "#3DF5C0", 700, 350);
  }
  C.forEach((c, k) => { const b = document.createElement("button"); b.type = "button"; b.textContent = c[0]; b.onclick = () => pick(k); box.append(b); });
  enter[5] = () => { bo.style.width = be.style.width = "0%"; mo.textContent = me.textContent = "0"; note.textContent = ""; G2.arcs.length = 0; setTimeout(() => pick(0), 700); };
})();

/* ---------- 7: الطبقات ---------- */
(function () {
  const mock = $("#mock"), cap = $("#lcap"), btn = $("#likeBtn"), n = $("#likeN");
  const CAP = [
    "HTML وحده: المحتوى والهيكل. يعمل، لكنه يشبه صفحات التسعينات.",
    "أضفنا CSS: الألوان والخطوط والتخطيط. المحتوى نفسه بمظهر آخر.",
    "أضفنا JavaScript: الصفحة صارت حيّة. اضغط الزر وجرّب."
  ];
  let layer = 1, likes = 0;
  function set(l) {
    layer = l; mock.dataset.layer = l; cap.textContent = CAP[l - 1];
    $$("#layerSeg button").forEach(b => b.classList.toggle("on", +b.dataset.l === l));
  }
  $$("#layerSeg button").forEach(b => b.onclick = () => set(+b.dataset.l));
  btn.onclick = () => {
    if (layer < 3) {
      mock.classList.remove("shake"); void mock.offsetWidth; mock.classList.add("shake");
      cap.textContent = "الزر موجود، لكنه لا يفعل شيئًا بدون JavaScript.";
      return;
    }
    n.textContent = ++likes;
    const h = document.createElement("span");
    h.className = "heart"; h.textContent = "❤️"; h.style.insetInlineStart = (35 + Math.random() * 30) + "%";
    mock.append(h); setTimeout(() => h.remove(), 1400);
  };
  enter[6] = () => { likes = 0; n.textContent = 0; set(1); };
})();

/* ---------- 8: السباق ---------- */
(function () {
  const R = [["3G", 1.5], ["4G", 25], ["ألياف", 300]];
  const lanes = $("#raceLanes"), mbR = $("#mbR"), mb = $("#mb"), cmp = $("#compress"), go = $("#raceGo"), sum = $("#raceSum");
  lanes.innerHTML = R.map(r => `<div class="lane"><span>${r[0]}</span><div class="track"><i></i></div><b dir="ltr">—</b></div>`).join("");
  let raf = 0;
  const size = () => +mbR.value * (cmp.checked ? .3 : 1);
  const fmt = t => t < 1 ? t.toFixed(2) : t.toFixed(1);
  function reset() {
    cancelAnimationFrame(raf);
    $$(".track i", lanes).forEach(i => i.style.width = "0%");
    $$("b", lanes).forEach(b => b.textContent = "—");
    sum.textContent = "";
  }
  mbR.oninput = () => { mb.textContent = mbR.value; reset(); };
  cmp.onchange = reset;
  go.onclick = () => {
    reset();
    const s = size(), times = R.map(r => s * 8 / r[1]), mx = Math.max(...times);
    const dur = times.map(t => reduce ? 200 : Math.max(350, t / mx * 7000));
    const bars = $$(".track i", lanes), lab = $$("b", lanes), t0 = performance.now();
    raf = requestAnimationFrame(function f(now) {
      let alive = false;
      bars.forEach((bar, k) => {
        const p = Math.max(0, Math.min(1, (now - t0) / dur[k]));
        bar.style.width = p * 100 + "%";
        lab[k].textContent = fmt(times[k] * p) + " s";
        if (p < 1) alive = true;
      });
      if (alive) raf = requestAnimationFrame(f);
      else sum.textContent = `بوزن ${s.toFixed(1)} MB ينتظر زائر 3G نحو ${fmt(times[0])} ثانية، وتظهر الصفحة على الألياف في ${fmt(times[2])}. ${cmp.checked ? "ضغط الصور وفّر الكثير." : "جرّب تفعيل ضغط الصور."}`;
    });
  };
  enter[7] = () => { mbR.value = 5; mb.textContent = "5"; cmp.checked = false; reset(); };
})();

/* ---------- 9: من الفكرة إلى الرابط ---------- */
(function () {
  const st = $$("#pipe .st"), fill = $("#pfill"), log = $("#depLog"), res = $("#depRes"), go = $("#depGo");
  let tok = 0;
  const L = [
    [0, '> prompt: "build my portfolio site, Arabic RTL"'],
    [1, "… the AI is writing the code"],
    [2, "✓ index.html    4.2 KB"],
    [2, "✓ style.css     3.1 KB"],
    [2, "✓ slides.js     2.4 KB"],
    [3, "↑ uploading 3 files to Cloudflare Pages"],
    [3, "✓ distributed to the global network"],
    [4, "🎉 https://your-name.pages.dev"]
  ];
  function reset() {
    tok++; log.innerHTML = ""; st.forEach(s => s.classList.remove("on")); fill.style.width = "0%";
    res.classList.remove("on"); res.querySelector("b").textContent = "—"; go.textContent = "انشر الآن";
  }
  go.onclick = async () => {
    reset(); const my = tok; go.textContent = "…";
    for (const [s, t] of L) {
      await sleep(reduce ? 0 : 650);
      if (my !== tok) return;
      st.forEach((e, k) => e.classList.toggle("on", k <= s));
      fill.style.width = (s / 4 * 100) + "%";
      log.insertAdjacentHTML("beforeend", `<div class="ln res">${esc(t)}</div>`);
    }
    res.classList.add("on"); res.querySelector("b").textContent = "your-name.pages.dev";
    confetti(120); go.textContent = "↻ أعد النشر";
  };
  enter[8] = reset;
})();

/* ---------- 10: الاختبار (بنك أسئلة، وكل جولة جديدة بأسئلة مختلفة) ---------- */
(function () {
  const POOL = [
    { q: "ما الذي يحوّل اسم الموقع إلى عنوان IP؟", o: ["DNS", "CSS", "PDF"], a: 0, x: "DNS دليل الهاتف: اسم يدخل، رقم يخرج." },
    { q: "ما وظيفة TLS؟", o: ["تسريع الصور", "تشفير الاتصال بين المتصفح والخادم", "حفظ الملفات"], a: 1, x: "هو سبب القفل 🔒 بجوار الرابط." },
    { q: "ماذا يعني الرمز 404؟", o: ["الخادم معطّل", "تم نقل الصفحة", "الصفحة غير موجودة"], a: 2, x: "غالبًا اسم ملف خاطئ. تذكّر index.html بأحرف صغيرة." },
    { q: "لماذا يجعل CDN الموقع أسرع؟", o: ["يضغط الإنترنت كله", "يقرّب نسخة من موقعك إلى الزائر", "يحذف الصور"], a: 1, x: "المسافة الأقصر تعني انتظارًا أقل." },
    { q: "أي طبقة تجعل الزر يتفاعل حين تضغطه؟", o: ["HTML", "CSS", "JavaScript"], a: 2, x: "HTML يبني، وCSS يزيّن، وJavaScript يحرّك." },
    { q: "ماذا يحدث أولًا بعد أن تضغط Enter؟", o: ["المتصفح يسأل DNS عن عنوان IP", "الخادم يرسل الصور", "تُطبع الصفحة"], a: 0, x: "قبل أي اتصال لا بد من معرفة العنوان الرقمي." },
    { q: "أي رمز يعني أن الصفحة وصلت بنجاح؟", o: ["500", "200", "404"], a: 1, x: "200 تعني OK: كل شيء تمام." },
    { q: "ماذا يعني الرمز 500؟", o: ["الصفحة غير موجودة", "تم نقل الصفحة", "عطل في الخادم"], a: 2, x: "الخطأ هنا عند الخادم لا عندك." },
    { q: "ماذا يعني الرمز 301؟", o: ["انتقلت الصفحة إلى عنوان آخر", "الخادم معطّل", "الصفحة محذوفة"], a: 0, x: "الخادم يقول لك: اذهب إلى العنوان الجديد." },
    { q: "ماذا يظهر بجوار الرابط حين يعمل التشفير؟", o: ["علم", "قفل", "صورة"], a: 1, x: "القفل علامة أن الاتصال مشفّر بـ TLS." },
    { q: "ما دور الخادم الجذر في DNS؟", o: ["يشفّر الاتصال", "يضغط الصور", "يدلّك على خادم النطاق العلوي"], a: 2, x: "هو لا يعرف الجواب، لكنه يعرف من يعرف." },
    { q: "أي طبقة مسؤولة عن الألوان والخطوط؟", o: ["CSS", "HTML", "DNS"], a: 0, x: "CSS يزيّن الصفحة ويرتّبها." },
    { q: "أي طبقة تبني هيكل الصفحة ومحتواها؟", o: ["TLS", "CDN", "HTML"], a: 2, x: "HTML هو الهيكل: العناوين والنصوص والأزرار." },
    { q: "ما أفضل طريقة لتسريع تحميل صفحة ثقيلة؟", o: ["ضغط الصور", "إضافة فيديو في الخلفية", "تكبير الخط"], a: 0, x: "الصور غالبًا أثقل جزء في الصفحة." },
    { q: "كم تقريبًا تستغرق رحلة تحميل الصفحة في هذا العرض؟", o: ["٣٠ ثانية", "٣ دقائق", "٠٫٣ ثانية"], a: 2, x: "نحو ثلث ثانية من Enter إلى الشاشة." },
    { q: "ما الملف الرئيسي الذي يفتحه المتصفح أولًا في موقعك؟", o: ["index.html", "style.css", "slides.js"], a: 0, x: "اسمه index.html بأحرف صغيرة في أعلى المجلد." },
    { q: "ما الذي يحمي كلمة المرور من المتجسس على الشبكة؟", o: ["ضغط الصور", "التشفير TLS", "CSS"], a: 1, x: "يحوّل الكلام الواضح إلى رموز لا تُقرأ." },
    { q: "لماذا يتأخر الزائر البعيد عن الخادم الأصلي؟", o: ["الألوان أكثر", "الخط أكبر", "المسافة أطول"], a: 2, x: "كل كيلومتر إضافي يضيف انتظارًا، وهنا يأتي دور CDN." }
  ];
  const box = $("#quiz");
  const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  let used = new Set(), round = [], qi = 0, sc = 0;
  function newRound() {
    let avail = POOL.map((_, i) => i).filter(i => !used.has(i));
    if (avail.length < 5) { used.clear(); avail = POOL.map((_, i) => i); }
    round = shuffle(avail).slice(0, 5).map(i => {
      used.add(i);
      const q = POOL[i], order = shuffle(q.o.map((_, k) => k));
      return { q: q.q, o: order.map(k => q.o[k]), a: order.indexOf(q.a), x: q.x };
    });
    qi = 0; sc = 0;
  }
  function render() {
    delete box.dataset.lock;
    if (qi >= round.length) {
      const msg = sc === 5 ? "علامة كاملة! أنت تعرف الرحلة بكل محطاتها." : sc >= 3 ? "ممتاز. راجع المحطة التي أخطأت فيها." : "ارجع إلى الشرائح السابقة وجرّب مرة أخرى.";
      box.innerHTML = `<p class="score" dir="ltr">${sc} / ${round.length}</p><p class="lead">${msg}</p><button class="cta sm" id="qRe" type="button">اختبار جديد بأسئلة أخرى</button>`;
      $("#qRe").onclick = () => { newRound(); render(); };
      if (sc >= 3) confetti(sc === 5 ? 260 : 160);
      return;
    }
    const q = round[qi];
    box.innerHTML = `<div class="dots">${round.map((_, k) => `<i class="${k <= qi ? "on" : ""}"></i>`).join("")}</div><p class="qq">${q.q}</p>${q.o.map((t, k) => `<button class="opt" data-k="${k}" type="button">${t}</button>`).join("")}<p class="qex"></p>`;
    $$(".opt", box).forEach(b => b.onclick = () => {
      if (box.dataset.lock) return;
      box.dataset.lock = 1;
      const k = +b.dataset.k;
      $$(".opt", box)[q.a].classList.add("ok");
      if (k !== q.a) b.classList.add("no"); else { sc++; confetti(50); }
      $(".qex", box).textContent = q.x;
      const nx = document.createElement("button");
      nx.className = "cta sm"; nx.type = "button"; nx.textContent = qi < round.length - 1 ? "السؤال التالي" : "النتيجة";
      nx.onclick = () => { qi++; render(); };
      box.append(nx);
    });
  }
  enter[9] = () => { newRound(); render(); };
})();

/* ---------- 11: الختام ---------- */
enter[10] = () => {
  const el = $("#big"), t0 = performance.now();
  requestAnimationFrame(function f(now) {
    const p = Math.max(0, Math.min(1, (now - t0) / 1600));
    el.textContent = (0.3 * (1 - Math.pow(1 - p, 3))).toFixed(2);
    if (p < 1) requestAnimationFrame(f);
  });
};

/* ---------- البداية ---------- */
const fromHash = () => (parseInt(location.hash.slice(1), 10) - 1) || 0;
addEventListener("hashchange", () => show(fromHash()));
show(fromHash());
requestAnimationFrame(loop);