const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
const $ = id => document.getElementById(id);

/* ===== الشريط المائل ===== */
(function(){
  const row = ['SQL','Python','Power BI','Java','Spring Boot','PostgreSQL','Pandas','Machine Learning','React']
    .map(w=>`<span>${w}</span><span>✺</span>`).join('');
  $('track').innerHTML = row+row+row+row;
})();

/* ===== الهيدر والقائمة ===== */
const header = $('header');
addEventListener('scroll',()=>header.classList.toggle('solid',scrollY>60),{passive:true});
const menuBtn = $('menuBtn'), links = $('links');
function setMenu(o){links.classList.toggle('open',o);menuBtn.setAttribute('aria-expanded',o);menuBtn.textContent=o?'✕':'☰'}
menuBtn.onclick=()=>setMenu(!links.classList.contains('open'));
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));

/* ===== المؤشر المخصص (للحاسوب فقط) ===== */
(function(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const c = $('cursor'); let tx=0,ty=0,x=0,y=0;
  addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;c.classList.add('on')});
  document.addEventListener('pointerleave',()=>c.classList.remove('on'));
  document.addEventListener('pointerover',e=>c.classList.toggle('big',!!e.target.closest('a,button,summary,.svc,.q')));
  (function loop(){x+=(tx-x)*.2;y+=(ty-y)*.2;c.style.transform=`translate(${x}px,${y}px)`;requestAnimationFrame(loop)})();
})();

/* ===== القصة: جزيئات تتحول من ضجيج إلى قرارات ===== */
(function(){
  const story = $('story'), cv = $('cv'), ctx = cv.getContext('2d');
  const caps = [...document.querySelectorAll('.cap')], dots = [...document.querySelectorAll('.dots li')], hint = $('hint');
  let W,H,dpr,N,sz,P=[],G=[[],[],[]],T=[],smooth=0,active=-1,vis=true;
  const mouse = {x:-9999,y:-9999,on:false};
  const rnd=(a,b)=>a+Math.random()*(b-a), lerp=(a,b,t)=>a+(b-a)*t;
  const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
  const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  const gauss=()=>(Math.random()+Math.random()+Math.random()-1.5)/1.5;

  function textPoints(word,cx,cy,bw,bh){
    const oc = document.createElement('canvas'); oc.width=Math.ceil(W); oc.height=Math.ceil(H);
    const o = oc.getContext('2d');
    const fam = '"Reem Kufi","Readex Pro",Tahoma,sans-serif';
    o.font = `700 300px ${fam}`; o.direction='rtl';
    const w = o.measureText(word).width || 600;
    const fs = Math.min(300*bw*.92/w, bh*1.25);
    o.font = `700 ${fs}px ${fam}`; o.textAlign='center'; o.textBaseline='middle'; o.fillStyle='#000';
    o.fillText(word,cx,cy);
    const d = o.getImageData(0,0,oc.width,oc.height).data, st = Math.max(2,Math.round(fs/105)), pts=[];
    for(let y=0;y<oc.height;y+=st) for(let x=0;x<oc.width;x+=st) if(d[(y*oc.width+x)*4+3]>140) pts.push([x+rnd(-1,1),y+rnd(-1,1)]);
    for(let i=pts.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pts[i],pts[j]]=[pts[j],pts[i]]}
    return pts;
  }

  function build(){
    const r = cv.getBoundingClientRect(); W=r.width; H=r.height; if(!W||!H) return;
    dpr = Math.min(devicePixelRatio||1,2);
    cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); ctx.setTransform(dpr,0,0,dpr,0,0);
    const mob = W<700; N = mob?1700:4400; sz = mob?2.2:2.8;
    const cx=W/2, cy=mob?H*.33:H*.37, bw=mob?W*.9:Math.min(W*.82,1100), bh=mob?H*.3:H*.44, base=cy+bh/2;
    P=[]; G=[[],[],[]];
    for(let i=0;i<N;i++){
      const g = Math.random()<.62?0:(Math.random()<.65?1:2);
      P.push({d:Math.random(),s:sz*(g===2?.7:1)*(.8+Math.random()*.6),ph:rnd(0,6.28),sp:.5+Math.random(),ox:0,oy:0,vx:0,vy:0});
      G[g].push(i);
    }
    T=[0,1,2,3].map(()=>new Float32Array(N*2));
    for(let i=0;i<N;i++){T[0][2*i]=rnd(0,W);T[0][2*i+1]=rnd(0,H)}
    const hs=[.25,.38,.52,.66,.8,.94,1,.88,.7,.52,.34,.22], nb=hs.length, slot=bw/nb, bwid=slot*.7, tot=hs.reduce((a,b)=>a+b,0);
    for(let i=0;i<N;i++){
      let q=Math.random()*tot,k=0; while(k<nb-1&&q>hs[k]){q-=hs[k];k++}
      T[1][2*i]=cx-bw/2+slot*(k+.5)+rnd(-bwid/2,bwid/2);
      T[1][2*i+1]=base-Math.random()*hs[k]*bh;
    }
    const f=t=>.12+.72*Math.pow(t,1.35)+.06*Math.sin(t*10);
    for(let i=0;i<N;i++){
      const t=Math.random(), yl=base-f(t)*bh;
      T[2][2*i]=cx-bw/2+t*bw;
      T[2][2*i+1]= Math.random()<.72 ? yl+gauss()*bh*.035 : yl+Math.random()*(base-yl);
    }
    const pts = textPoints('قرارات',cx,cy,bw,bh);
    for(let i=0;i<N;i++){
      const p = pts.length ? pts[i%pts.length] : [cx+Math.cos(i)*bw*.2,cy+Math.sin(i)*bh*.3];
      const j = i>=pts.length ? 1.6 : 0;
      T[3][2*i]=p[0]+rnd(-j,j); T[3][2*i+1]=p[1]+rnd(-j,j);
    }
  }

  function setActive(a){
    if(a===active) return; active=a;
    caps.forEach((c,i)=>c.classList.toggle('on',i===a));
    dots.forEach((d,i)=>d.classList.toggle('on',i===a));
  }

  const amps=[26,5,5,1.5];
  function frame(now){
    requestAnimationFrame(frame);
    if(!vis||!P.length) return;
    const rect = story.getBoundingClientRect(), span = rect.height-innerHeight;
    const p = clamp(-rect.top/span);
    const target = clamp((p-.03)/.94)*3;
    smooth = reduce ? target : smooth+(target-smooth)*.09;
    const sf = smooth, i0 = Math.min(2,Math.floor(sf)), t = sf-i0;
    setActive(clamp(Math.round(sf),0,3));
    hint.classList.toggle('off',p>.02);
    const a = reduce?0:lerp(amps[i0],amps[i0+1],t), m = clamp(sf*1.2);
    const orange = `rgb(${lerp(140,255,m)|0},${lerp(128,90,m)|0},${lerp(118,31,m)|0})`;
    const A=T[i0], B=T[i0+1], R=110, R2=R*R;
    ctx.clearRect(0,0,W,H);
    const X=new Float32Array(N), Y=new Float32Array(N);
    for(let i=0;i<N;i++){
      const pt=P[i], e=ease(clamp((t-pt.d*.5)/.5));
      let x=A[2*i]*(1-e)+B[2*i]*e, y=A[2*i+1]*(1-e)+B[2*i+1]*e;
      if(!reduce){x+=Math.sin(now*.0006*pt.sp+pt.ph)*a; y+=Math.cos(now*.0005*pt.sp+pt.ph*1.3)*a}
      if(mouse.on){
        const dx=x-mouse.x, dy=y-mouse.y, d2=dx*dx+dy*dy;
        if(d2<R2){const d=Math.sqrt(d2)||1, f=(1-d/R)*5; pt.vx+=dx/d*f; pt.vy+=dy/d*f}
      }
      pt.vx+=-pt.ox*.06; pt.vy+=-pt.oy*.06; pt.vx*=.82; pt.vy*=.82; pt.ox+=pt.vx; pt.oy+=pt.vy;
      X[i]=x+pt.ox; Y[i]=y+pt.oy;
    }
    const cols=[orange,'rgba(243,238,230,.92)','rgba(184,172,154,.55)'];
    for(let g=0;g<3;g++){
      ctx.fillStyle=cols[g];
      const arr=G[g];
      for(let k=0;k<arr.length;k++){const i=arr[k], s=P[i].s; ctx.fillRect(X[i],Y[i],s,s)}
    }
  }

  const pin = story.querySelector('.pin');
  pin.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;mouse.on=true});
  pin.addEventListener('pointerleave',()=>mouse.on=false);
  new IntersectionObserver(es=>es.forEach(en=>vis=en.isIntersecting)).observe(story);

  let rt; addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(build,200)});
  const fontReady = (document.fonts && document.fonts.load)
    ? Promise.race([document.fonts.load('700 120px "Reem Kufi"','قرارات'),new Promise(r=>setTimeout(r,1800))])
    : Promise.resolve();
  fontReady.catch(()=>{}).then(()=>{build();requestAnimationFrame(frame)});
})();

/* ===== جرّب بنفسك ===== */
(function(){
  const esc = s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const S = [
    {q:'أي فرع يخسر؟', file:'branches.sql',
     tokens:[['c','-- ربح كل فرع هذا الربع\n'],['k','SELECT'],['',' branch, '],['f','SUM'],['','(revenue - cost) '],['k','AS'],['',' profit\n'],['k','FROM'],['',' sales\n'],['k','GROUP BY'],['',' branch\n'],['k','ORDER BY'],['',' profit '],['k','DESC'],['',';']],
     kind:'bars', unit:'K', data:[['الرياض',420],['جدة',310],['مكة',120],['أبها',60],['الدمام',-85]],
     insight:'فرع <b>الدمام</b> يخسر <b>85 ألف</b> ريال هذا الربع، والسبب الأكبر مخزون راكد.'},
    {q:'كم سنبيع الشهر القادم؟', file:'forecast.py',
     tokens:[['k','import'],['',' pandas '],['k','as'],['',' pd\n'],['k','from'],['',' sklearn.ensemble '],['k','import'],['',' RandomForestRegressor\n\n'],['',"sales = pd."],['f','read_sql'],['','('],['s','"SELECT * FROM monthly_sales"'],['',', conn)\n'],['',"model = "],['f','RandomForestRegressor'],['','().'],['f','fit'],['','(X, y)\n'],['f','print'],['','(model.'],['f','predict'],['','(next_month))']],
     kind:'line', hist:[40,46,44,52,58,55,63,70,68,76], fc:[76,81,86],
     insight:'المتوقع <b>5.2 مليون</b> ريال الشهر القادم، بزيادة <b>9%</b> عن هذا الشهر.'},
    {q:'من أكثر عملائنا ربحًا؟', file:'customers.sql',
     tokens:[['c','-- أعلى 5 عملاء من حيث الربح\n'],['k','SELECT'],['',' customer, '],['f','SUM'],['','(profit) '],['k','AS'],['',' total\n'],['k','FROM'],['',' orders\n'],['k','GROUP BY'],['',' customer\n'],['k','ORDER BY'],['',' total '],['k','DESC'],['\n',''],['k','LIMIT'],['',' '],['n','5'],['',';']],
     kind:'bars', unit:'K', data:[['شركة النخبة',640],['مجموعة الأفق',520],['مؤسسة الريان',310],['شركة الواحة',240],['مؤسسة السلام',150]],
     insight:'<b>20%</b> من العملاء يحققون <b>80%</b> من أرباحك، فركّز عليهم.'}
  ];
  const qs=$('qs'), code=$('code'), result=$('result'), file=$('file');
  qs.innerHTML = S.map((s,i)=>`<button class="q" role="tab" aria-selected="false" data-i="${i}">${s.q}</button>`).join('');
  const render=(tokens,n)=>{let out='',left=n;for(const [c,t] of tokens){if(left<=0)break;const part=t.slice(0,left);left-=t.length;out+=c?`<span class="t-${c}">${esc(part)}</span>`:esc(part)}return out};
  function barsHTML(s){
    const mx=Math.max(...s.data.map(d=>Math.abs(d[1])));
    return `<div class="rows">${s.data.map(d=>`<div class="row"><span>${d[0]}</span><span class="tr"><span class="bar ${d[1]<0?'neg':''}" data-w="${Math.abs(d[1])/mx*100}"></span></span><b class="${d[1]<0?'neg':''}">${d[1]>0?'+':''}${d[1]}${s.unit}</b></div>`).join('')}</div>`;
  }
  function lineHTML(s){
    const all=s.hist.concat(s.fc.slice(1)), mx=Math.max(...all)+8, w=600, h=200, step=w/(all.length-1);
    const pt=(v,i)=>`${(i*step).toFixed(1)},${(h-v/mx*h+10).toFixed(1)}`;
    const hp=s.hist.map((v,i)=>pt(v,i)).join(' ');
    const fp=s.fc.map((v,i)=>pt(v,s.hist.length-1+i)).join(' ');
    return `<svg class="line-svg" viewBox="0 0 ${w} ${h+30}"><polyline class="hist draw" style="--len:1400" points="${hp}"/><polyline class="fc" points="${fp}"/><text x="${(s.hist.length-1)*step}" y="${h+26}">اليوم</text><text x="${(all.length-1)*step-20}" y="${h+26}">القادم</text></svg>`;
  }
  let tm;
  function run(i){
    clearTimeout(tm); const s=S[i];
    qs.querySelectorAll('.q').forEach((b,j)=>b.setAttribute('aria-selected',j===i));
    file.textContent=s.file; result.classList.remove('show'); result.innerHTML='';
    const total=s.tokens.reduce((a,t)=>a+t[1].length,0); let n=0;
    (function step(){
      n = reduce ? total : Math.min(total,n+2);
      code.innerHTML = render(s.tokens,n)+(n<total?'<i class="caret"></i>':'');
      if(n<total) tm=setTimeout(step,16);
      else tm=setTimeout(()=>{
        result.innerHTML=(s.kind==='bars'?barsHTML(s):lineHTML(s))+`<p class="insight">${s.insight}</p>`;
        requestAnimationFrame(()=>requestAnimationFrame(()=>{
          result.classList.add('show');
          result.querySelectorAll('.bar').forEach(b=>b.style.width=b.dataset.w+'%');
        }));
      },reduce?0:260);
    })();
  }
  qs.addEventListener('click',e=>{const b=e.target.closest('.q'); if(b) run(+b.dataset.i)});
  new IntersectionObserver((es,ob)=>{if(es[0].isIntersecting){run(0);ob.disconnect()}},{threshold:.35}).observe($('demo'));
})();

/* ===== عدّاد الأرقام ===== */
const io = new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if(!en.isIntersecting) return;
    const el=en.target, to=+el.dataset.to, suf=el.dataset.suffix||'';
    if(reduce){el.textContent=to+suf; io.unobserve(el); return}
    const t0=performance.now(), dur=1700;
    (function tick(t){
      const p=Math.min((t-t0)/dur,1), e=1-Math.pow(1-p,3);
      el.textContent=Math.round(to*e)+(p===1?suf:'');
      if(p<1) requestAnimationFrame(tick);
    })(t0);
    io.unobserve(el);
  });
},{threshold:.6});
document.querySelectorAll('[data-to]').forEach(n=>io.observe(n));

/* ===== الأسئلة: سؤال واحد مفتوح ===== */
document.querySelectorAll('#faq-list details').forEach(d=>{
  d.addEventListener('toggle',()=>{
    if(d.open) document.querySelectorAll('#faq-list details').forEach(o=>{if(o!==d) o.open=false});
  });
});

/* ===== النموذج: يفتح واتساب برسالة جاهزة ===== */
const form=$('form'), toast=$('toast');
const setErr=(name,msg)=>{
  form.querySelector(`[data-for="${name}"]`).textContent=msg;
  form.elements[name].classList.toggle('invalid',!!msg);
};
function showToast(m){toast.textContent=m;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),4200)}
form.addEventListener('submit',e=>{
  e.preventDefault();
  const f=form.elements; let ok=true;
  if(f.name.value.trim().length<2){setErr('name','اكتب اسمك من فضلك');ok=false}else setErr('name','');
  if(!/^\S+@\S+\.\S+$/.test(f.email.value.trim())){setErr('email','اكتب بريدًا إلكترونيًا صحيحًا');ok=false}else setErr('email','');
  if(f.msg.value.trim().length<10){setErr('msg','اكتب وصفًا لا يقل عن ١٠ أحرف');ok=false}else setErr('msg','');
  if(!ok) return;
  const text=`السلام عليكم، أنا ${f.name.value.trim()}\nالخدمة: ${f.type.value}\nالبريد: ${f.email.value.trim()}\n\n${f.msg.value.trim()}`;
  window.open('https://wa.me/966543676979?text='+encodeURIComponent(text),'_blank','noopener');
  form.reset();
  showToast('جاري فتح واتساب لإرسال طلبك.');
});
$('yr').textContent=new Date().getFullYear();