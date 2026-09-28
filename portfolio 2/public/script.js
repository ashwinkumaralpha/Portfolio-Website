// ===== Edit your content here =====
const projects = [
  {t:'Task Manager',c:'fullstack',d:'MERN app with auth, drag-and-drop boards and real-time updates.',s:['React','Node.js','MongoDB'],live:'#',code:'#'},
  {t:'Weather Dashboard',c:'frontend',d:'Responsive dashboard with 7-day forecast and location search.',s:['JavaScript','API','CSS'],live:'#',code:'#'},
  {t:'Blog REST API',c:'backend',d:'Express API with JWT auth, pagination and full test coverage.',s:['Express','MySQL','JWT'],live:'#',code:'#'},
  {t:'E-commerce Store',c:'fullstack',d:'Product catalogue, cart and checkout with Stripe test mode.',s:['Next.js','Node.js','MongoDB'],live:'#',code:'#'}
];
const resume = {
  exp:[{h:'Full-Stack Developer Intern',s:'Company Name · 2026',p:'Built this portfolio and REST APIs; wrote reusable React components.'},
       {h:'Freelance Web Developer',s:'2025 – Present',p:'Delivered business websites using HTML, CSS, JavaScript and WordPress.'}],
  edu:[{h:'B.E. in Computer Science',s:'Your College · 2022 – 2026',p:'Relevant: Data Structures, DBMS, Web Technologies.'}],
  skills:[['HTML / CSS',92],['JavaScript',88],['React',82],['Node.js / Express',80],['MongoDB / MySQL',75],['Git & GitHub',85]]
};
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// Projects + filter
function showProjects(f) {
  $('#grid').innerHTML = projects.filter(p => f === 'all' || p.c === f).map(p => `
    <article class="card"><h3>${esc(p.t)}</h3><p>${esc(p.d)}</p>
    <div class="tags">${p.s.map(x => `<span>${esc(x)}</span>`).join('')}</div>
    <div class="links"><a href="${p.live}">Live demo</a><a href="${p.code}">Source</a></div></article>`).join('');
}
$$('.chip').forEach(b => b.onclick = () => { $$('.chip').forEach(x => x.classList.toggle('on', x === b)); showProjects(b.dataset.f); });
showProjects('all');

// Resume tabs
function showTab(t) {
  $('#panel').innerHTML = t === 'skills'
    ? resume.skills.map(([n, v]) => `<div class="bar"><b>${n}</b><div><i style="width:0" data-w="${v}%"></i></div></div>`).join('')
    : resume[t].map(i => `<div class="item"><h3>${esc(i.h)}</h3><small>${esc(i.s)}</small><p>${esc(i.p)}</p></div>`).join('');
  requestAnimationFrame(() => $$('.bar i').forEach(i => i.style.width = i.dataset.w));
}
$$('.tab').forEach(b => b.onclick = () => { $$('.tab').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); }); showTab(b.dataset.t); });
showTab('exp');

// Rotating word in hero
const words = ['database', 'server', 'API', 'browser']; let w = 0;
if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
  setInterval(() => { w = (w + 1) % words.length; $('#swap').textContent = words[w]; }, 2200);
$('#yr').textContent = new Date().getFullYear();

// Contact form
$('#form').addEventListener('submit', async e => {
  e.preventDefault();
  const st = $('#status'), btn = e.target.querySelector('button'), data = Object.fromEntries(new FormData(e.target));
  btn.disabled = true; st.className = ''; st.textContent = 'Sending…';
  try {
    const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const j = await r.json();
    if (!j.ok) throw new Error(j.error);
    st.className = 'ok'; st.textContent = 'Message sent. I will reply soon.'; e.target.reset();
  } catch (err) { st.className = 'err'; st.textContent = err.message || 'Something went wrong. Please try again.'; }
  btn.disabled = false;
});
