/* ========== المتغيرات ========== */
:root{
  --ink:#030824;
  --navy:#07124a;
  --royal:#1a3df0;
  --electric:#2f6bff;
  --cyan:#22d3ee;
  --gold:#fbbf24;
  --paper:#f3f6ff;
  --card:#ffffff;
  --text:#0d1b4c;
  --muted:#5a6794;
  --line:#dbe3fb;
  --radius:18px;
  --wrap:1200px;
  --font:'Cairo',system-ui,-apple-system,'Segoe UI',Tahoma,sans-serif;
}

*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:84px}
body{
  margin:0;font-family:var(--font);color:var(--text);background:var(--paper);
  line-height:1.8;-webkit-font-smoothing:antialiased;
}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
ul{list-style:none;margin:0;padding:0}
h1,h2,h3,p{margin:0}
button,input,textarea{font:inherit;color:inherit}

.wrap{width:min(100% - 40px,var(--wrap));margin-inline:auto}
.ic{width:1.15em;height:1.15em;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex:none}
.ic-cyan{color:var(--cyan)}
.ic-gold{color:var(--gold)}

:focus-visible{outline:3px solid var(--cyan);outline-offset:3px;border-radius:8px}
.skip{position:absolute;top:-60px;inset-inline-start:12px;background:#fff;color:#000;padding:8px 14px;border-radius:8px;z-index:100}
.skip:focus{top:12px}

/* ========== الهيدر ========== */
.site-header{
  position:fixed;inset:0 0 auto 0;z-index:50;
  transition:background .3s,box-shadow .3s,backdrop-filter .3s;
}
.site-header.scrolled{
  background:rgba(4,10,46,.82);backdrop-filter:blur(14px);
  box-shadow:0 8px 30px rgba(0,0,0,.25);
}
.nav{display:flex;align-items:center;justify-content:space-between;height:76px;gap:24px}
.brand{display:flex;align-items:center;gap:12px;font-weight:800;font-size:1.35rem;color:#fff;direction:ltr;letter-spacing:.2px}
.brand-mark{width:44px;height:36px}
.nav-links{display:flex;align-items:center;gap:6px}
.nav-links a{
  color:#dbe6ff;padding:6px 20px;border-radius:999px;font-weight:600;font-size:1rem;
  transition:background .2s,color .2s;
}
.nav-links a:hover{color:#fff;background:rgba(255,255,255,.1)}
.nav-links a.active{background:var(--electric);color:#fff}
.menu-btn{
  display:none;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);
  color:#fff;width:44px;height:44px;border-radius:12px;cursor:pointer;align-items:center;justify-content:center;
}
.menu-btn .ic{width:22px;height:22px}

/* ========== الهيرو ========== */
.hero{
  position:relative;overflow:hidden;color:#fff;
  padding:120px 0 0;min-height:700px;
  background:
    radial-gradient(900px 500px at 70% 10%,rgba(47,107,255,.55),transparent 60%),
    radial-gradient(700px 500px at 0% 90%,rgba(26,61,240,.55),transparent 60%),
    linear-gradient(180deg,#030824 0%,#06145c 60%,#0a2aa8 100%);
}
.hero::after{ /* انتقال ناعم إلى الأقسام الفاتحة */
  content:"";position:absolute;inset:auto 0 0 0;height:130px;
  background:linear-gradient(180deg,transparent,var(--paper));pointer-events:none;
}
.hero-glow{
  position:absolute;inset:0;pointer-events:none;opacity:.5;
  background:
    repeating-linear-gradient(115deg,transparent 0 60px,rgba(80,140,255,.06) 60px 61px);
}
.hero-grid{
  position:relative;z-index:2;display:grid;align-items:end;gap:24px;
  grid-template-columns:1.15fr 1fr .62fr;
  min-height:560px;
}
.hero-text{align-self:center;padding-bottom:70px}
.pill{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);
  padding:6px 18px;border-radius:999px;font-size:.95rem;margin-bottom:18px;color:#e6eeff;
}
.pill .ic{color:var(--gold)}
h1{display:flex;gap:18px;flex-wrap:wrap;font-weight:900;font-size:clamp(3.2rem,7vw,5.6rem);line-height:1.15;letter-spacing:-1px}
.h1-first{color:#fff}
.h1-last{
  background:linear-gradient(90deg,#22d3ee,#38bdf8 60%,#2f6bff);
  -webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 0 22px rgba(34,211,238,.35));
}
.role{font-size:clamp(1.3rem,2.4vw,1.75rem);font-weight:700;margin-top:6px;color:#fff}
.lead{max-width:520px;margin-top:14px;color:#c6d4ff;font-size:1.05rem}
.cta{display:flex;flex-wrap:wrap;gap:16px;margin-top:30px}

.btn{
  display:inline-flex;align-items:center;gap:10px;justify-content:center;
  padding:12px 28px;border-radius:14px;font-weight:700;font-size:1rem;cursor:pointer;border:1px solid transparent;
  transition:transform .2s,box-shadow .2s,background .2s;
}
.btn:hover{transform:translateY(-2px)}
.btn-primary{background:linear-gradient(90deg,#22d3ee,#2f6bff);color:#04123a;box-shadow:0 10px 30px rgba(34,211,238,.3)}
.btn-primary:hover{box-shadow:0 14px 36px rgba(34,211,238,.45)}
.btn-ghost{border-color:rgba(255,255,255,.35);color:#fff;background:rgba(255,255,255,.04)}
.btn-ghost:hover{background:rgba(255,255,255,.12)}
.btn-solid{background:var(--royal);color:#fff;box-shadow:0 10px 26px rgba(26,61,240,.28)}

/* الصورة والحلقة */
.hero-photo{position:relative;align-self:end;display:flex;justify-content:center}
.hero-photo img{position:relative;z-index:3;width:min(100%,470px);height:auto;filter:drop-shadow(0 20px 40px rgba(0,0,0,.45))}
.ring{position:absolute;border-radius:50%;pointer-events:none;z-index:1}
.ring-a{
  width:88%;aspect-ratio:1;top:6%;inset-inline:6%;
  border:3px solid rgba(120,190,255,.9);
  box-shadow:0 0 40px 6px rgba(47,107,255,.7),inset 0 0 60px rgba(47,107,255,.5);
  background:radial-gradient(circle,rgba(47,107,255,.25),transparent 70%);
}
.ring-b{
  width:100%;aspect-ratio:1;top:0;inset-inline:0;
  border:1px solid rgba(120,190,255,.35);
  animation:spin 40s linear infinite;
  border-top-color:var(--cyan);
}
@keyframes spin{to{transform:rotate(360deg)}}

/* الإحصائيات */
.stats{display:grid;gap:16px;align-self:center;padding-bottom:70px}
.stat{
  display:flex;align-items:center;gap:16px;padding:16px 22px;border-radius:var(--radius);
  background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.2);backdrop-filter:blur(8px);
}
.stat .ic{width:34px;height:34px}
.stat strong{display:block;font-size:1.9rem;line-height:1.1;font-weight:800}
.stat span{font-size:.92rem;color:#c6d4ff}

/* ========== شريط المجالات ========== */
.strip{
  position:relative;z-index:5;margin-top:-34px;
  display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px 24px;
  background:linear-gradient(180deg,#eef2ff,#fff);border:1px solid var(--line);
  border-radius:22px;padding:22px 34px;
  box-shadow:0 20px 50px rgba(26,61,240,.12);
}
.strip li{display:flex;align-items:center;gap:12px;font-weight:700;color:var(--text)}
.strip li .ic{width:26px;height:26px;color:var(--electric)}

/* ========== الأقسام العامة ========== */
.section{padding:90px 0}
.section-alt{background:#fff}
.sec-head{text-align:center;margin-bottom:34px}
.sec-head h2{font-size:clamp(2rem,4vw,2.7rem);font-weight:900;color:var(--text)}
.sec-head p{color:var(--muted);margin-top:6px}

/* من أنا */
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center}
.tag{
  display:inline-flex;align-items:center;gap:8px;background:#e3eaff;color:var(--royal);
  padding:4px 18px;border-radius:999px;font-weight:700;font-size:.95rem;margin-bottom:14px;
}
.about-text h2{font-size:clamp(1.8rem,3.4vw,2.5rem);font-weight:900;line-height:1.4;color:#0b2fd6}
.about-text > p{color:var(--muted);margin:12px 0 26px;max-width:520px}
.values{display:grid;gap:14px;margin-bottom:30px}
.values li{display:flex;align-items:center;gap:14px}
.v-ic{
  width:48px;height:48px;border-radius:14px;display:grid;place-items:center;
  background:#e8eeff;color:var(--electric);
}
.v-ic .ic{width:24px;height:24px}
.values strong{display:block;font-weight:800;line-height:1.3}
.values span{color:var(--muted);font-size:.92rem}

.code-card{
  background:linear-gradient(160deg,#0a1650,#050c33);border-radius:22px;overflow:hidden;
  border:1px solid rgba(80,130,255,.35);box-shadow:0 30px 60px rgba(8,25,120,.3);
}
.code-bar{display:flex;align-items:center;gap:8px;padding:14px 18px;background:rgba(255,255,255,.05);direction:ltr}
.code-bar i{width:12px;height:12px;border-radius:50%;background:#ff5f57}
.code-bar i:nth-child(2){background:#febc2e}
.code-bar i:nth-child(3){background:#28c840}
.code-bar span{margin-inline-start:auto;color:#8fa3e8;font-size:.85rem;font-family:Consolas,monospace}
.code-card pre{
  margin:0;padding:24px;color:#d7e2ff;font:500 .98rem/1.9 Consolas,'Courier New',monospace;overflow-x:auto;
}
.code-card .k{color:#c792ea}.code-card .s{color:#9ee493}.code-card .p{color:#7fdbff}.code-card .f{color:#ffd479}

/* المشاريع */
.filters{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:34px}
.chip{
  border:1px solid var(--line);background:var(--paper);padding:6px 22px;border-radius:999px;
  cursor:pointer;font-weight:700;color:var(--muted);transition:all .2s;
}
.chip:hover{border-color:var(--electric);color:var(--electric)}
.chip.is-on{background:var(--royal);border-color:var(--royal);color:#fff}
.projects{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:24px}
.project{
  background:var(--card);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;
  display:flex;flex-direction:column;transition:transform .25s,box-shadow .25s;
}
.project:hover{transform:translateY(-6px);box-shadow:0 22px 44px rgba(26,61,240,.15)}
.project[hidden]{display:none}
.thumb{height:160px;display:grid;place-items:center;color:#fff}
.thumb .ic{width:54px;height:54px;stroke-width:1.5;opacity:.95}
.t1{background:linear-gradient(135deg,#1a3df0,#22d3ee)}
.t2{background:linear-gradient(135deg,#6d28d9,#2f6bff)}
.t3{background:linear-gradient(135deg,#0e7490,#22d3ee)}
.t4{background:linear-gradient(135deg,#0a2aa8,#7c3aed)}
.t5{background:linear-gradient(135deg,#2f6bff,#0ea5e9)}
.t6{background:linear-gradient(135deg,#1e3a8a,#06b6d4)}
.p-body{padding:20px 22px 22px;display:flex;flex-direction:column;gap:6px;flex:1}
.p-cat{color:var(--electric);font-weight:700;font-size:.85rem}
.p-body h3{font-size:1.2rem;font-weight:800}
.p-body p{color:var(--muted);font-size:.95rem;flex:1}
.p-link{display:inline-flex;align-items:center;gap:8px;margin-top:8px;color:var(--royal);font-weight:700}
.p-link .ic{transition:transform .2s}
.p-link:hover .ic{transform:translateX(-5px)}

/* المهارات */
.skills{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:22px}
.skill{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:22px 24px}
.s-top{display:flex;justify-content:space-between;align-items:center;font-weight:800;margin-bottom:12px}
.s-top span{display:inline-flex;align-items:center;gap:10px}
.s-top .ic{color:var(--electric);width:22px;height:22px}
.s-top b{color:var(--royal)}
.bar{height:10px;border-radius:99px;background:#e3eaff;overflow:hidden}
.bar i{display:block;height:100%;width:0;border-radius:99px;background:linear-gradient(90deg,var(--electric),var(--cyan));transition:width 1.2s cubic-bezier(.2,.8,.2,1)}
.skill small{display:block;margin-top:10px;color:var(--muted);direction:ltr;text-align:right}

/* تواصل */
.contact{
  background:
    radial-gradient(700px 400px at 85% 0%,rgba(47,107,255,.5),transparent 60%),
    linear-gradient(180deg,#06145c,#030824);
  color:#fff;
}
.contact-grid{display:grid;grid-template-columns:1fr 1.1fr;gap:50px;align-items:start}
.contact-info h2{font-size:clamp(2rem,4vw,2.7rem);font-weight:900}
.contact-info > p{color:#c6d4ff;margin:8px 0 26px;max-width:420px}
.contact-info li{display:flex;align-items:center;gap:14px;margin-bottom:16px;color:#e6eeff}
.contact-info li .ic{width:44px;height:44px;padding:11px;border-radius:12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);color:var(--cyan)}
.contact-info a:hover{color:var(--cyan)}
.form{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.18);border-radius:22px;padding:28px;backdrop-filter:blur(8px)}
.field{margin-bottom:18px}
.field label{display:block;font-weight:700;margin-bottom:6px;color:#e6eeff}
.field input,.field textarea{
  width:100%;padding:12px 16px;border-radius:12px;background:rgba(3,8,36,.6);
  border:1px solid rgba(255,255,255,.22);color:#fff;resize:vertical;transition:border-color .2s,box-shadow .2s;
}
.field input:focus,.field textarea:focus{outline:none;border-color:var(--cyan);box-shadow:0 0 0 3px rgba(34,211,238,.25)}
.field.invalid input,.field.invalid textarea{border-color:#ff7a8a}
.err{display:block;min-height:1.2em;font-size:.85rem;color:#ffb3bd;margin-top:4px}
.form-ok{display:flex;align-items:center;gap:8px;margin-top:14px;color:#8ff0c0;font-weight:700}
.form-ok[hidden]{display:none}

/* الفوتر */
.footer{background:#020618;color:#9fb0e6;padding:22px 0;font-size:.92rem}
.footer .wrap{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}
.footer a:hover{color:var(--cyan)}

/* ========== الجوال والتابلت ========== */
@media (max-width:1024px){
  .hero-grid{grid-template-columns:1fr 1fr;min-height:0}
  .hero-text{grid-column:1 / -1;padding-bottom:10px}
  .hero-photo{grid-column:1}
  .stats{grid-column:2;padding-bottom:40px}
  .about-grid,.contact-grid{grid-template-columns:1fr}
}
@media (max-width:760px){
  .menu-btn{display:inline-flex}
  .nav-links{
    position:absolute;inset:76px 0 auto 0;flex-direction:column;align-items:stretch;gap:4px;
    background:rgba(4,10,46,.97);padding:14px 20px 20px;border-bottom:1px solid rgba(255,255,255,.12);
    transform:translateY(-12px);opacity:0;visibility:hidden;transition:all .25s;
  }
  .nav-links.open{transform:none;opacity:1;visibility:visible}
  .nav-links a{text-align:center;padding:10px}
  .hero{padding-top:100px}
  .hero-grid{grid-template-columns:1fr}
  .hero-photo,.stats{grid-column:1}
  .hero-photo img{width:min(88%,380px)}
  .stats{grid-template-columns:1fr 1fr;padding-bottom:50px}
  .stat{flex-direction:column;align-items:flex-start;gap:8px;padding:14px 16px}
  .strip{padding:18px 20px;justify-content:center}
  .section{padding:64px 0}
  .skills{grid-template-columns:1fr}
  .brand{font-size:1.15rem}
}

@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{animation:none!important;transition:none!important}
}