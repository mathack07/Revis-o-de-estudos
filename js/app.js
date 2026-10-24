/* ---------- Níveis ---------- */
const LEVELS = [
  {n:"Estagiário",xp:0},{n:"Escriturário",xp:100},{n:"Caixa",xp:250},{n:"Assistente",xp:500},
  {n:"Analista",xp:900},{n:"Gerente de relacionamento",xp:1400},{n:"Gerente geral",xp:2100},{n:"Superintendente",xp:3000}
];
const DAILY_GOAL = 60;
const BOXES = [1,3,7,15]; // dias até a próxima revisão
const XP = {card:5, right:10, review:15};

/* ---------- Estado salvo no aparelho ---------- */
const KEY = "role-estudos-v1";
const today = () => new Date().toLocaleDateString("sv-SE");
const dayDiff = (a,b) => Math.round((new Date(b) - new Date(a)) / 86400000);
function fresh(){ return {updatedAt:0, xp:0, streak:0, lastDay:null, todayDate:today(), todayXp:0, subjects:Object.keys(SUBJ), seen:{}, stats:{}, review:{}, sessions:0}; }
let st = fresh();
try { const raw = localStorage.getItem(KEY); if(raw) st = Object.assign(fresh(), JSON.parse(raw)); } catch(e){}
function save(){
  st.updatedAt = Date.now();
  try{ localStorage.setItem(KEY, JSON.stringify(st)); }catch(e){}
  Cloud.push(st);
}
/* Junta o progresso do aparelho com o da conta: fica o maior XP, e nenhum erro para revisar se perde. */
function merge(local, remote){
  const base = (remote.xp || 0) >= (local.xp || 0) ? remote : local;
  const other = base === remote ? local : remote;
  const out = Object.assign(fresh(), base);
  out.review = Object.assign({}, other.review || {}, base.review || {});
  out.stats = Object.assign({}, base.stats || {});
  for(const [k,v] of Object.entries(other.stats || {})){
    const b = out.stats[k] || {right:0, wrong:0};
    out.stats[k] = {right: Math.max(b.right, v.right), wrong: Math.max(b.wrong, v.wrong)};
  }
  out.streak = Math.max(local.streak || 0, remote.streak || 0);
  return out;
}
function rollDay(){
  if(st.todayDate !== today()){ st.todayDate = today(); st.todayXp = 0; }
  if(st.lastDay && dayDiff(st.lastDay, today()) > 1) st.streak = 0;
}
rollDay();

function levelOf(xp){
  let i = 0; while(i+1 < LEVELS.length && xp >= LEVELS[i+1].xp) i++;
  const cur = LEVELS[i], nxt = LEVELS[i+1];
  return {i, name:cur.n, next:nxt, pct: nxt ? (xp-cur.xp)/(nxt.xp-cur.xp) : 1};
}
function addXp(n){
  st.xp += n; st.todayXp += n;
  if(st.lastDay !== today()){
    st.streak = (st.lastDay && dayDiff(st.lastDay, today()) === 1) ? st.streak + 1 : 1;
    st.lastDay = today();
  }
  save();
  const p = document.createElement("div"); p.className = "xp-pop"; p.textContent = "+" + n + " XP";
  document.body.appendChild(p); setTimeout(()=>p.remove(), 1000);
}
const dueList = () => Object.entries(st.review).filter(([id,r]) => BY_ID[id] && r.due <= today()).map(([id])=>id);

/* ---------- Utilidades ---------- */
const $app = document.getElementById("app");
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle = a => { a = a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const cvar = s => `style="--c:var(${SUBJ[s].c})"`;
const fmtDate = d => { const n = dayDiff(today(), d); return n<=0 ? "hoje" : n===1 ? "amanhã" : `em ${n} dias`; };

/* ---------- Abas ---------- */
let tab = "home", sess = null;
document.getElementById("tabs").addEventListener("click", e => {
  const b = e.target.closest("button[data-tab]"); if(!b) return;
  sess = null; tab = b.dataset.tab; render();
});
function setTabs(){
  document.querySelectorAll("#tabs button").forEach(b => b.toggleAttribute("aria-current", b.dataset.tab===tab && !sess));
  document.querySelectorAll("#tabs button").forEach(b => { if(b.dataset.tab===tab && !sess) b.setAttribute("aria-current","page"); });
  document.getElementById("tabs").hidden = !!sess;
}

let authView = null; // "login" quando a tela de entrada está aberta
function render(){
  if(authView) return renderLogin();
  setTabs();
  if(sess) return renderSession();
  if(tab==="home") renderHome();
  else if(tab==="review") renderReview();
  else renderProgress();
  window.scrollTo(0,0);
}

function header(){
  return `<div class="top"><div class="brand">Rolê de <span>Estudos</span></div>
    <div class="pills"><div class="pill" title="Dias seguidos"><span class="flame">●</span>${st.streak} ${st.streak===1?"dia":"dias"}</div>
    <div class="pill" title="Pontos">${st.xp} XP</div></div></div>`;
}

function renderHome(){
  const lv = levelOf(st.xp), due = dueList().length;
  const goalPct = Math.min(1, st.todayXp/DAILY_GOAL);
  $app.innerHTML = `${header()}
  <section class="level">
    <div class="level-row"><div><div class="label">Seu nível</div><div class="level-name">${lv.name}</div></div>
      <div class="muted" style="font-variant-numeric:tabular-nums">${lv.next ? `${lv.next.xp - st.xp} XP para ${lv.next.n}` : "Nível máximo"}</div></div>
    <div class="bar"><i style="width:${lv.pct*100}%"></i></div>
    <div class="goal"><div class="goal-row"><span>Meta do dia</span><b>${Math.min(st.todayXp,DAILY_GOAL)} / ${DAILY_GOAL} XP</b></div>
      <div class="bar gold"><i style="width:${goalPct*100}%"></i></div></div>
  </section>
  <section class="stack">
    <h2>O que vai rolar hoje?</h2>
    <p class="muted">Toque para ligar ou desligar matérias.</p>
    <div class="chips" id="chips">${Object.entries(SUBJ).map(([k,v]) =>
      `<button class="chip" data-s="${k}" aria-pressed="${st.subjects.includes(k)}" ${cvar(k)}><span class="dot"></span>${v.name}</button>`).join("")}</div>
  </section>
  <section class="stack">
    <button class="btn" id="go" ${st.subjects.length?"":"disabled"}>Começar sessão de 10 minutos</button>
    <p class="note">15 itens misturando cards rápidos e questões de múltipla escolha.</p>
    ${due ? `<div class="review-cta"><div><b>Revisar erros</b><div class="note">Questões que você errou e voltaram hoje</div></div>
      <button class="btn small" id="rv">Revisar <span class="badge" style="margin-left:6px">${due}</span></button></div>` : ""}
  </section>`;
  document.getElementById("chips").onclick = e => {
    const c = e.target.closest(".chip"); if(!c) return;
    const s = c.dataset.s;
    st.subjects = st.subjects.includes(s) ? st.subjects.filter(x=>x!==s) : [...st.subjects, s];
    save(); renderHome();
  };
  document.getElementById("go").onclick = startSession;
  const rv = document.getElementById("rv"); if(rv) rv.onclick = startReview;
}

/* ---------- Montagem da sessão ---------- */
function pickItems(){
  const pool = ITEMS.filter(i => st.subjects.includes(i.s));
  const rank = arr => shuffle(arr).sort((a,b) => (st.seen[a.id]||0) - (st.seen[b.id]||0));
  const cards = rank(pool.filter(i=>i.t==="card")), quizzes = rank(pool.filter(i=>i.t==="quiz"));
  const out = [];
  // padrão: card, quiz, quiz (o card ensina, as questões fixam)
  while(out.length < 15 && (cards.length || quizzes.length)){
    if(cards.length) out.push(cards.shift());
    if(quizzes.length && out.length<15) out.push(quizzes.shift());
    if(quizzes.length && out.length<15) out.push(quizzes.shift());
  }
  return out;
}
function startSession(){ sess = {mode:"normal", list:pickItems(), i:0, right:0, wrong:0, xp:0, answered:false}; render(); }
function startReview(){ const l = shuffle(dueList().map(id=>BY_ID[id])); if(!l.length) return; sess = {mode:"review", list:l, i:0, right:0, wrong:0, xp:0, answered:false}; render(); }

function renderSession(){
  if(sess.i >= sess.list.length) return renderResult();
  const it = sess.list[sess.i], n = sess.list.length;
  const kind = it.t==="card" ? "Card" : (sess.mode==="review" ? "Revisão" : "Questão");
  let inner;
  if(it.t==="card"){
    inner = `<h2 class="card-title">${it.title}</h2>
      <div class="card-body">${it.body.map(p=>`<p>${p}</p>`).join("")}</div>
      ${it.tip ? `<p class="tip">${it.tip}</p>` : ""}
      <div class="spacer"></div>
      <button class="btn" id="next">Entendi, próximo</button>`;
  } else {
    if(!sess.order || sess.orderFor !== it.id){ sess.order = shuffle(it.o.map((_,k)=>k)); sess.orderFor = it.id; }
    inner = `<p class="q">${esc(it.q)}</p>
      <div class="opts" id="opts">${sess.order.map((k,pos)=>`<button class="opt" data-k="${k}"><span class="let">${"ABCDE"[pos]}</span><span>${esc(it.o[k])}</span></button>`).join("")}</div>
      <div id="fb"></div><div class="spacer"></div>
      <p class="src">${it.src}</p>`;
  }
  $app.innerHTML = `<div class="sess-top"><button class="x" id="quit" aria-label="Sair da sessão">×</button>
      <div class="bar"><i style="width:${sess.i/n*100}%"></i></div><span class="count">${sess.i+1}/${n}</span></div>
    <article class="item" ${cvar(it.s)}>
      <div class="tag"><span class="dot"></span>${SUBJ[it.s].name}<span class="kind">· ${kind}</span></div>
      ${inner}
    </article>`;
  document.getElementById("quit").onclick = () => { sess = null; render(); };
  if(it.t==="card"){
    document.getElementById("next").onclick = () => {
      st.seen[it.id] = (st.seen[it.id]||0)+1; addXp(XP.card); sess.xp += XP.card; sess.i++; render();
    };
  } else {
    document.getElementById("opts").onclick = e => {
      const b = e.target.closest(".opt"); if(!b || b.disabled) return;
      answer(it, +b.dataset.k);
    };
  }
  window.scrollTo(0,0);
}

function answer(it, k){
  const ok = k === it.a;
  st.seen[it.id] = (st.seen[it.id]||0)+1;
  const s = st.stats[it.s] || (st.stats[it.s] = {right:0, wrong:0});
  ok ? s.right++ : s.wrong++;
  if(ok){
    sess.right++;
    const gain = sess.mode==="review" ? XP.review : XP.right;
    sess.xp += gain; addXp(gain);
    if(st.review[it.id]){
      const box = st.review[it.id].box + 1;
      if(box >= BOXES.length) delete st.review[it.id];
      else st.review[it.id] = {box, due: addDays(BOXES[box])};
    }
  } else {
    sess.wrong++;
    st.review[it.id] = {box:0, due: addDays(BOXES[0])};
  }
  save();
  document.querySelectorAll(".opt").forEach(b => {
    b.disabled = true;
    const bk = +b.dataset.k;
    if(bk === it.a) b.classList.add("right");
    else if(bk === k) b.classList.add("wrong");
  });
  const last = sess.i + 1 >= sess.list.length;
  document.getElementById("fb").innerHTML = `<div class="fb ${ok?"ok":"no"}">
      <strong>${ok ? "Acertou!" : "Não foi dessa vez"}</strong>
      <p>${esc(it.e)}</p>
      ${ok ? "" : `<p class="note">Essa questão volta na sua revisão amanhã.</p>`}
    </div>
    <button class="btn" id="next" style="margin-top:14px">${last ? "Ver resultado" : "Próximo"}</button>`;
  const nb = document.getElementById("next");
  nb.onclick = () => { sess.i++; render(); };
  nb.focus({preventScroll:true});
  nb.scrollIntoView({behavior:"smooth", block:"nearest"});
}
function addDays(n){ const d = new Date(); d.setDate(d.getDate()+n); return d.toLocaleDateString("sv-SE"); }

function renderResult(){
  if(!sess.done){ sess.done = true; st.sessions++; save(); }
  const total = sess.right + sess.wrong;
  const lv = levelOf(st.xp);
  $app.innerHTML = `<article class="item result" style="--c:var(--accent)">
      <div class="label">${sess.mode==="review" ? "Revisão concluída" : "Sessão concluída"}</div>
      <div class="big">+${sess.xp} XP</div>
      <p class="muted">Nível ${lv.name}${lv.next ? ` · faltam ${lv.next.xp - st.xp} XP para ${lv.next.n}` : ""}</p>
      <div class="stats-grid">
        <div class="stat"><b>${sess.right}</b><span>acertos</span></div>
        <div class="stat"><b>${sess.wrong}</b><span>erros</span></div>
        <div class="stat"><b>${st.streak}</b><span>${st.streak===1?"dia seguido":"dias seguidos"}</span></div>
      </div>
      ${sess.wrong ? `<p class="note">${sess.wrong} ${sess.wrong===1?"questão foi":"questões foram"} para a revisão de amanhã.</p>` : (total ? `<p class="note">Gabaritou. Nenhum erro para revisar.</p>` : "")}
      <div class="stack" style="width:100%">
        <button class="btn" id="again">Mais uma sessão</button>
        <button class="btn ghost" id="home">Voltar ao início</button>
      </div>
    </article>`;
  document.getElementById("again").onclick = startSession;
  document.getElementById("home").onclick = () => { sess = null; tab = "home"; render(); };
}

function renderReview(){
  const entries = Object.entries(st.review).filter(([id])=>BY_ID[id]).sort((a,b)=>a[1].due.localeCompare(b[1].due));
  const due = dueList().length;
  $app.innerHTML = `${header()}
  <section class="stack"><h1>Revisão de erros</h1>
    <p class="muted">Cada questão errada volta amanhã. Acertou de novo? Ela volta em 3, depois 7 e depois 15 dias, até você dominar.</p></section>
  <button class="btn" id="rv" ${due?"":"disabled"}>${due ? `Revisar ${due} ${due===1?"questão":"questões"} agora` : "Nada para revisar hoje"}</button>
  <section class="panel"><h2>Na fila</h2>
    ${entries.length ? `<div class="rv-list">${entries.map(([id,r]) => { const it = BY_ID[id];
      return `<div class="rv" ${cvar(it.s)}><div class="tag"><span class="dot"></span>${SUBJ[it.s].name}</div><span>${esc(it.q)}</span><span class="when">Volta ${fmtDate(r.due)} · etapa ${r.box+1} de ${BOXES.length}</span></div>`; }).join("")}</div>`
      : `<p class="muted">Sua fila está vazia. Os erros das sessões aparecem aqui.</p>`}
  </section>`;
  document.getElementById("rv").onclick = startReview;
}

function renderProgress(){
  const lv = levelOf(st.xp);
  const rows = Object.entries(SUBJ).map(([k,v]) => {
    const s = st.stats[k] || {right:0, wrong:0}, t = s.right + s.wrong, pct = t ? s.right/t : 0;
    return `<div class="subj-row" ${cvar(k)}><span class="subj-name"><span class="dot"></span>${v.name}</span>
      <span class="pct">${t ? `${Math.round(pct*100)}% de ${t}` : "sem respostas"}</span><div class="bar"><i style="width:${pct*100}%"></i></div></div>`;
  }).join("");
  $app.innerHTML = `${header()}
  <h1>Seu progresso</h1>
  <section class="panel"><h2>Aproveitamento por matéria</h2>${rows}</section>
  <section class="panel"><h2>Trilha de níveis</h2>
    <div class="levels">${LEVELS.map((l,i)=>`<div class="${i===lv.i?"now":""}"><span>${l.n}</span><span>${l.xp} XP</span></div>`).join("")}</div></section>
  <section class="panel"><h2>Conta</h2>
    ${accountHtml()}
    <p class="note">As questões são de treino, no estilo da banca Cesgranrio.</p>
    <p class="note">${st.sessions} ${st.sessions===1?"sessão concluída":"sessões concluídas"} até agora.</p>
    <div id="reset"><button class="danger" id="r1">Apagar meu progresso</button></div>
  </section>`;
  document.getElementById("r1").onclick = () => {
    document.getElementById("reset").innerHTML = `<p class="note">Tem certeza? Isso zera XP, sequência e revisões.</p>
      <div style="display:flex;gap:8px;margin-top:8px"><button class="btn small" id="r2" style="background:var(--bad)">Apagar</button><button class="btn small ghost" id="r3">Cancelar</button></div>`;
    document.getElementById("r2").onclick = () => { st = fresh(); save(); renderProgress(); };
    document.getElementById("r3").onclick = renderProgress;
  };
  const li = document.getElementById("login"); if(li) li.onclick = () => { authView = "login"; render(); };
  const lo = document.getElementById("logout"); if(lo) lo.onclick = async () => {
    await Cloud.signOut(); st = fresh(); try{ localStorage.removeItem(KEY); }catch(e){} render();
  };
}

function accountHtml(){
  if(!Cloud.enabled) return `<p class="note">Seu progresso está salvo só neste aparelho. O login aparece aqui quando o Firebase for configurado.</p>`;
  if(Cloud.user) return `<p>Conectado como <b>${esc(Cloud.user.displayName || Cloud.user.email || "você")}</b>. Seu progresso é salvo na conta e aparece em qualquer aparelho.</p>
    <button class="btn ghost small" id="logout">Sair da conta</button>`;
  return `<p class="note">Você está usando sem conta. Entre para levar seu progresso entre celular e computador.</p>
    <button class="btn small" id="login">Entrar com Google</button>`;
}

function renderLogin(){
  document.getElementById("tabs").hidden = true;
  $app.innerHTML = `<div class="top"><div class="brand">Rolê de <span>Estudos</span></div></div>
  <section class="panel">
    <h1>Entre para salvar seu progresso</h1>
    <p class="muted">Com a conta Google, seus pontos, sequência e revisões aparecem no celular e no computador. Se for a primeira vez, a conta é criada na hora.</p>
    <button class="btn" id="gg">Entrar com Google</button>
    <p class="note" id="err" hidden></p>
    <button class="btn ghost" id="skip">Continuar sem conta</button>
  </section>`;
  document.getElementById("skip").onclick = () => {
    try{ localStorage.setItem(KEY + "-skip", "1"); }catch(e){}
    authView = null; render();
  };
  document.getElementById("gg").onclick = async () => {
    const btn = document.getElementById("gg"); btn.disabled = true; btn.textContent = "Abrindo o Google...";
    try{ await Cloud.signInGoogle(); }
    catch(e){
      const er = document.getElementById("err"); er.hidden = false;
      er.textContent = e && e.code === "auth/popup-closed-by-user" ? "A janela do Google foi fechada antes de terminar. Toque em Entrar com Google de novo." : "Não deu para entrar agora. Confira sua internet e tente de novo.";
      btn.disabled = false; btn.textContent = "Entrar com Google";
    }
  };
}

async function loadFromAccount(){
  const remote = await Cloud.pull();
  st = remote ? merge(st, remote) : st;
  rollDay(); save();
}
async function boot(){
  const user = await Cloud.init(async u => { if(u){ authView = null; await loadFromAccount(); } render(); });
  if(user) await loadFromAccount();
  let skipped = false; try{ skipped = localStorage.getItem(KEY + "-skip") === "1"; }catch(e){}
  if(Cloud.enabled && !user && !skipped) authView = "login";
  render();
}
boot();
