// ── State ─────────────────────────────────────────────────────────
let selectedExtinct   = null;
let selectedCandidate = null;
let accessAttempts    = 0;

// ── Init ──────────────────────────────────────────────────────────
function init() {
  buildSpeciesStack();
  document.getElementById('access-key')
    .addEventListener('keydown', e => { if (e.key === 'Enter') tryAccess(); });
}

// ── Species stack ─────────────────────────────────────────────────
function buildSpeciesStack() {
  const stack = document.getElementById('species-stack');
  extinctSpecies.forEach((sp, i) => {
    const card = document.createElement('div');
    card.className = 'species-card';
    card.id = 'sc-' + sp.key;
    card.style.background  = sp.cardColor;
    card.style.color       = sp.cardAccent;
    card.innerHTML = `
      <div class="card-dot"></div>
      <span class="card-emoji">${sp.icon}</span>
      <div class="card-name">${sp.name}</div>
      <div class="card-sci">${sp.sci}</div>
      <div class="card-period">${sp.period}</div>`;
    card.onclick = () => openSpecies(sp);
    stack.appendChild(card);

    // Stagger entrance
    card.style.opacity = '0';
    card.style.transform = 'translateX(-20px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease, border-color 0.2s, box-shadow 0.2s';
      card.style.opacity = '1';
      card.style.transform = 'translateX(0)';
    }, 80 + i * 100);
  });

  // Set hero dots
  const dotsEl = document.getElementById('hero-dots');
  extinctSpecies.forEach((sp, i) => {
    const d = document.createElement('div');
    d.className = 'hero-dot';
    d.id = 'dot-' + sp.key;
    d.onclick = () => openSpecies(sp);
    dotsEl.appendChild(d);
  });

  // Show welcome hero
  setHeroWelcome();
}

// ── Welcome hero ──────────────────────────────────────────────────
function setHeroWelcome() {
  const hero = document.getElementById('hero');
  hero.style.background = 'linear-gradient(135deg, #1a5c35 0%, #0f3a22 100%)';
  hero.style.color = '#fff';
  hero.innerHTML = `
    <div class="hero-deco hero-deco-1"></div>
    <div class="hero-deco hero-deco-2"></div>
    <div class="hero-deco hero-deco-3"></div>
    <div class="hero-welcome">
      <div class="hero-welcome-emoji">🦕</div>
      <div class="hero-welcome-title">De-Extinction Explorer</div>
      <div class="hero-welcome-sub">Select an extinct species from the left to begin your analysis.</div>
    </div>
    <div class="hero-dots" id="hero-dots"></div>`;
  extinctSpecies.forEach((sp, i) => {
    const d = document.createElement('div');
    d.className = 'hero-dot';
    d.id = 'dot-' + sp.key;
    d.onclick = () => openSpecies(extinctSpecies[i]);
    document.getElementById('hero-dots').appendChild(d);
  });
}

// ── Open species ──────────────────────────────────────────────────
function openSpecies(sp) {
  selectedExtinct   = sp;
  selectedCandidate = null;

  // Update cards
  document.querySelectorAll('.species-card').forEach(c => c.classList.remove('active'));
  const sc = document.getElementById('sc-' + sp.key);
  if (sc) sc.classList.add('active');

  // Update hero
  renderHero(sp);

  // Show candidate section, hide analysis + verdict
  showSection('candidate-section');
  hideSection('analysis-section');
  document.getElementById('analysis-panel').classList.remove('open');
  document.getElementById('verdict-card').classList.remove('open');

  buildCandidates(sp);

  setTimeout(() => {
    document.getElementById('candidate-section')
      .scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 200);
}

// ── Render hero ───────────────────────────────────────────────────
function renderHero(sp) {
  const hero = document.getElementById('hero');
  hero.style.transition = 'background 0.4s ease';
  hero.style.background = `linear-gradient(135deg, ${sp.heroColor} 0%, ${adjustColor(sp.heroColor, -20)} 100%)`;
  hero.style.color = '#fff';

  hero.innerHTML = `
    <div class="hero-deco hero-deco-1"></div>
    <div class="hero-deco hero-deco-2"></div>
    <div class="hero-deco hero-deco-3"></div>
    <div class="hero-inner">
      <div class="hero-left">
        <div class="hero-tag">Extinct Species</div>
        <div class="hero-name">${sp.name}</div>
        <div class="hero-sci">${sp.sci}</div>
        <p class="hero-desc">${sp.desc}</p>
        <div class="hero-facts">
          <div class="fact-chip"><span>Extinct</span>${sp.period}</div>
          <div class="fact-chip"><span>Cause</span>${sp.cause}</div>
          <div class="fact-chip"><span>Habitat</span>${sp.habitat}</div>
          <div class="fact-chip"><span>Genome</span>${sp.genome}</div>
          <div class="fact-chip"><span>DNA</span>${sp.dnaQuality}</div>
          <div class="fact-chip"><span>Range</span>${sp.range}</div>
          <div class="fact-chip"><span>Diet</span>${sp.diet}</div>
          <div class="fact-chip"><span>Weight</span>${sp.weight}</div>
          <div class="fact-chip"><span>Length</span>${sp.length}</div>
        </div>
        <button class="hero-cta" onclick="document.getElementById('candidate-section').scrollIntoView({behavior:'smooth'})">
          ↓ Choose a Candidate Species
        </button>
      </div>
      <div class="hero-emoji">${sp.icon}</div>
    </div>
    <div class="hero-dots" id="hero-dots"></div>`;

  // Re-add dots
  extinctSpecies.forEach((s, i) => {
    const d = document.createElement('div');
    d.className = 'hero-dot' + (s.key === sp.key ? ' active' : '');
    d.onclick = () => openSpecies(extinctSpecies[i]);
    document.getElementById('hero-dots').appendChild(d);
  });
}

// ── Candidates ────────────────────────────────────────────────────
function buildCandidates(sp) {
  const grid = document.getElementById('candidate-grid');
  grid.innerHTML = '';
  candidateSpecies[sp.key].forEach(c => {
    const simColor = c.sim >= 70 ? '#1a6b35' : c.sim >= 50 ? '#c47c1a' : '#c0392b';
    const card = document.createElement('div');
    card.className = 'candidate-card';
    card.innerHTML = `
      <div class="cc-check">✓</div>
      <div class="cc-top">
        <span class="cc-emoji">${c.icon}</span>
        <div class="cc-info">
          <div class="cc-name">${c.name}</div>
          <div class="cc-sci">${c.sci}</div>
        </div>
        <div class="cc-sim" style="color:${simColor}">${c.sim}%</div>
      </div>
      <div class="cc-sim-bar-wrap">
        <div class="cc-sim-bar" style="width:0%;background:${simColor}"></div>
      </div>
      <div class="cc-status">${c.status}</div>
      <div class="cc-notes">${c.notes}</div>`;
    card.onclick = () => selectCandidate(c, card);
    grid.appendChild(card);
    setTimeout(() => card.querySelector('.cc-sim-bar').style.width = c.sim + '%', 200);
  });
}

function selectCandidate(c, cardEl) {
  document.querySelectorAll('.candidate-card').forEach(x => x.classList.remove('selected'));
  cardEl.classList.add('selected');
  selectedCandidate = c;
  renderAnalysis(c);
}

// ── Analysis ──────────────────────────────────────────────────────
function renderAnalysis(c) {
  showSection('analysis-section');
  document.getElementById('analysis-panel').classList.add('open');

  // Sim score
  const pct   = c.sim;
  const color = pct >= 70 ? '#1a6b35' : pct >= 50 ? '#c47c1a' : '#c0392b';
  const simEl = document.getElementById('sim-big');
  simEl.textContent = pct + '%';
  simEl.style.color = color;
  const barEl = document.getElementById('sim-bar');
  barEl.style.width      = '0%';
  barEl.style.background = color;
  setTimeout(() => barEl.style.width = pct + '%', 50);

  // Label
  setText('sim-label', pct >= 70 ? 'High similarity' : pct >= 50 ? 'Moderate similarity' : 'Low similarity');

  // Breakdown
  renderBreakdown(pct, color);

  // Eco cards
  renderEcoCards(c);

  // Phylo tree
  drawPhyloTree(selectedExtinct.key, c.name);

  // Verdict (after short delay for effect)
  setTimeout(() => renderVerdict(c), 500);

  setTimeout(() => {
    document.getElementById('analysis-section')
      .scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function renderBreakdown(pct, color) {
  const cont = document.getElementById('breakdown-rows');
  cont.innerHTML = '';
  breakdownLabels.forEach((lbl, i) => {
    const v   = Math.min(99, Math.max(8, pct + (Math.random()-.5)*20));
    const col = v >= 70 ? '#1a6b35' : v >= 50 ? '#c47c1a' : '#c0392b';
    const row = document.createElement('div');
    row.className = 'br-row';
    row.innerHTML = `
      <div class="br-name">${lbl}</div>
      <div class="br-track"><div class="br-fill" style="width:0%;background:${col}"></div></div>
      <div class="br-pct" style="color:${col}">${Math.round(v)}%</div>`;
    cont.appendChild(row);
    setTimeout(() => row.querySelector('.br-fill').style.width = v + '%', 80 + i*90);
  });
}

function renderEcoCards(c) {
  const eco  = ecoFactors[selectedExtinct.key]?.[c.name];
  const cont = document.getElementById('eco-row');
  cont.innerHTML = '';
  if (!eco) {
    cont.innerHTML = `<div style="grid-column:1/-1;font-size:13px;color:var(--text-faint);">No ecological data available for this candidate.</div>`;
    return;
  }
  const factors = [
    { key: 'climate',       label: 'Climate Match' },
    { key: 'habitat',       label: 'Habitat'       },
    { key: 'foodChain',     label: 'Food Web'      },
    { key: 'predatorRisk',  label: 'Predator Risk' },
    { key: 'humanConflict', label: 'Human Impact'  },
  ];
  factors.forEach(f => {
    const d   = eco[f.key];
    const cls = d.score >= 65 ? 'ok' : d.score >= 45 ? 'warn' : 'bad';
    const div = document.createElement('div');
    div.className = 'eco-item';
    div.innerHTML = `
      <div class="eco-label">${f.label}</div>
      <div class="eco-val ${cls}">${d.label}</div>
      <div class="eco-bar"><div class="eco-bar-fill ${cls}" style="width:0%"></div></div>
      <div class="eco-note">${d.note}</div>`;
    cont.appendChild(div);
    setTimeout(() => div.querySelector('.eco-bar-fill').style.width = d.score + '%', 200);
  });
}

// ── Phylo SVG ─────────────────────────────────────────────────────
function drawPhyloTree(extKey, candidateName) {
  const svg  = document.getElementById('phylo-svg');
  const tree = phyloTrees[extKey];
  if (!tree) { svg.innerHTML = ''; return; }

  const W = 560, H = 160;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', H);
  svg.innerHTML = '';

  const allX = tree.nodes.map(n=>n.x), allY = tree.nodes.map(n=>n.y);
  const scX = (W-80)/(Math.max(...allX)-Math.min(...allX)||1);
  const scY = (H-40)/(Math.max(...allY)-Math.min(...allY)||1);
  const ox  = 20 - Math.min(...allX)*scX;
  const oy  = 20 - Math.min(...allY)*scY;

  const nodeMap = {};
  tree.nodes.forEach(n => nodeMap[n.id] = n);
  const px = n => n.x*scX+ox;
  const py = n => n.y*scY+oy;

  const ns = 'http://www.w3.org/2000/svg';

  // Edges
  tree.edges.forEach(([a,b]) => {
    const na = nodeMap[a], nb = nodeMap[b];
    const path = document.createElementNS(ns,'path');
    const midX = px(nb) - 2;
    path.setAttribute('d', `M${px(na)},${py(na)} L${midX},${py(na)} L${midX},${py(nb)}`);
    path.setAttribute('fill','none');
    path.setAttribute('stroke','#d0e8d8');
    path.setAttribute('stroke-width','2');
    svg.appendChild(path);
  });

  // Nodes + labels
  tree.nodes.forEach(n => {
    const cx = px(n), cy = py(n);
    const colMap = { ancestor: '#b0cfc0', extinct: '#c0392b', candidate: '#1a6b35' };
    const col = colMap[n.type];

    const dot = document.createElementNS(ns,'circle');
    dot.setAttribute('cx',cx); dot.setAttribute('cy',cy);
    dot.setAttribute('r', n.type==='ancestor'?4:6);
    dot.setAttribute('fill', col);
    dot.setAttribute('stroke','white');
    dot.setAttribute('stroke-width','1.5');
    svg.appendChild(dot);

    const txt = document.createElementNS(ns,'text');
    txt.setAttribute('x', cx+10); txt.setAttribute('y', cy+4);
    txt.setAttribute('font-family',"'Nunito Sans',sans-serif");
    txt.setAttribute('font-size', n.type==='ancestor'?'10':'11');
    txt.setAttribute('fill', n.type==='ancestor'?'#7a9a82':col);
    txt.setAttribute('font-weight', n.type==='ancestor'?'400':'700');
    txt.textContent = n.label;
    svg.appendChild(txt);
  });

  // Legend
  [['#c0392b','† Extinct'],['#1a6b35','Candidate/relative'],['#b0cfc0','Ancestor']].forEach(([col,lbl],i) => {
    const lx = 10+i*150, ly = H-6;
    const d = document.createElementNS(ns,'circle');
    d.setAttribute('cx',lx); d.setAttribute('cy',ly); d.setAttribute('r',4); d.setAttribute('fill',col);
    svg.appendChild(d);
    const t = document.createElementNS(ns,'text');
    t.setAttribute('x',lx+8); t.setAttribute('y',ly+4);
    t.setAttribute('font-family',"'Nunito Sans',sans-serif");
    t.setAttribute('font-size','9'); t.setAttribute('fill','#7a9a82');
    t.textContent = lbl;
    svg.appendChild(t);
  });
}

// ── Verdict ───────────────────────────────────────────────────────
function renderVerdict(c) {
  const key = computeVerdict(selectedExtinct.key, c);
  const v   = verdictScenarios[key];
  const sp  = selectedExtinct;

  const eco = ecoFactors[sp.key]?.[c.name];
  const avg = eco ? Math.round(Object.values(eco).reduce((a,b)=>a+b.score,0)/5) : 0;

  const detailMap = {
    impossible:   `Genomic divergence between ${c.name} and ${sp.name} is too large. The genetic editing burden would exceed current technology and likely produce an organism unable to survive.`,
    'wild-reloc': `High genomic similarity and suitable ecological conditions support direct relocation of ${c.name} to ${sp.name}'s historic range without significant genetic modification.`,
    'wild-gm':    `Genomic similarity is sufficient but targeted modifications (e.g. cold-adaptation loci, morphological traits) are required before wild release.`,
    captive:      `Genetic de-extinction is feasible but habitat conditions are insufficient for wild release. Controlled revival is recommended until restoration conditions improve.`,
    'no-attempt': `While genetic de-extinction may be technically possible, ecological conditions present unacceptable risks — invasive predators, habitat loss, or human conflict make revival inadvisable.`,
  };

  const vc = document.getElementById('verdict-card');
  vc.style.background = `linear-gradient(135deg, ${v.color} 0%, ${adjustColor(v.color,-20)} 100%)`;
  vc.style.color = '#fff';
  vc.innerHTML = `
    <div class="verdict-deco"></div>
    <div class="verdict-inner">
      <div>
        <div class="verdict-label">De-Extinction Verdict</div>
        <div class="verdict-title">${v.text}</div>
        <div class="verdict-sub">${sp.name} × ${c.name} · ${c.sim}% genomic similarity</div>
        <div class="verdict-detail">${detailMap[key]}</div>
        <div class="verdict-logic">
          <strong>Decision path:</strong> Genomic similarity ${c.sim}% → ${c.sim>=70?'✓ above 70%':c.sim>=50?'⚠ 50–70%':'✗ below 50%'} &nbsp;|&nbsp;
          Ecological score ${avg}/100 → ${avg>=60?'✓ habitat viable':avg>=45?'⚠ partial':'✗ unsuitable'}<br>
          → <strong>${v.sub}</strong>
        </div>
      </div>
      <div class="verdict-emoji-big">${sp.icon}</div>
    </div>`;
  vc.classList.add('open');
}

// ── Helpers ───────────────────────────────────────────────────────
function showSection(id) {
  const el = document.getElementById(id);
  el.classList.remove('open'); void el.offsetWidth; el.classList.add('open');
}
function hideSection(id) { document.getElementById(id).classList.remove('open'); }
function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

function adjustColor(hex, amount) {
  // Darken/lighten a hex color
  const num = parseInt(hex.replace('#',''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return '#' + [r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
}


document.addEventListener('DOMContentLoaded', init);