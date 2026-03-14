// =============================================================================
// app.js — UI rendering only.
// =============================================================================
// This file is includes information about rendering the user interface, handling interactions, and calling
// the scoring functions defined in scoring.js. It intentionally does NOT include any information about
// how the scores are computed or how the final verdict is reached — that logic is fully encapsulated in scoring.js.
//
// =============================================================================

let selectedExtinct   = null;
let selectedCandidate = null;
let accessAttempts    = 0;

// ── Init ──────────────────────────────────────────────────────────
function init() {
  buildSpeciesStack();
  document.getElementById('access-key')
    .addEventListener('keydown', e => { if (e.key === 'Enter') tryAccess(); });
}

// ── Species stack (left column) ───────────────────────────────────
function buildSpeciesStack() {
  const stack = document.getElementById('species-stack');
  extinctSpecies.forEach((sp, i) => {
    const card = document.createElement('div');
    card.className = 'species-card';
    card.id = 'sc-' + sp.key;
    card.style.background = sp.cardColor;
    card.style.color      = sp.cardAccent;
    card.innerHTML = `
      <div class="card-dot"></div>
      <span class="card-emoji">${sp.icon}</span>
      <div class="card-name">${sp.name}</div>
      <div class="card-sci">${sp.sci}</div>
      <div class="card-period">${sp.period}</div>`;
    card.onclick = () => openSpecies(sp);
    stack.appendChild(card);

    card.style.opacity   = '0';
    card.style.transform = 'translateX(-20px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease, border-color 0.2s, box-shadow 0.2s';
      card.style.opacity    = '1';
      card.style.transform  = 'translateX(0)';
    }, 80 + i * 100);
  });

  setHeroWelcome();
}

// ── Welcome state ─────────────────────────────────────────────────
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
    d.onclick   = () => openSpecies(extinctSpecies[i]);
    document.getElementById('hero-dots').appendChild(d);
  });
}

// ── Open species ──────────────────────────────────────────────────
function openSpecies(sp) {
  selectedExtinct   = sp;
  selectedCandidate = null;

  document.querySelectorAll('.species-card').forEach(c => c.classList.remove('active'));
  document.getElementById('sc-' + sp.key)?.classList.add('active');

  renderHero(sp);
  buildCandidates(sp);

  showSection('candidate-section');
  hideSection('analysis-section');
  document.getElementById('analysis-panel').classList.remove('open');
  document.getElementById('verdict-card').classList.remove('open');

  setTimeout(() => {
    document.getElementById('candidate-section')
      .scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 200);
}

// ── Hero panel ────────────────────────────────────────────────────
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
          <div class="fact-chip"><span>Biome</span>${BIOME_LABELS[sp.biome] || sp.biome}</div>
          <div class="fact-chip"><span>Range</span>${sp.range}</div>
          <div class="fact-chip"><span>Role</span>${sp.role}</div>
          <div class="fact-chip"><span>Diet</span>${DIET_LABELS[sp.dietType] || sp.dietType}</div>
          <div class="fact-chip"><span>Temp range</span>${sp.tempMin}°C to ${sp.tempMax}°C</div>
        </div>
        <button class="hero-cta" onclick="document.getElementById('candidate-section').scrollIntoView({behavior:'smooth'})">
          ↓ Choose a Candidate Species
        </button>
      </div>
      <div class="hero-emoji">${sp.icon}</div>
    </div>
    <div class="hero-dots" id="hero-dots"></div>`;

  extinctSpecies.forEach((s, i) => {
    const d = document.createElement('div');
    d.className = 'hero-dot' + (s.key === sp.key ? ' active' : '');
    d.onclick   = () => openSpecies(extinctSpecies[i]);
    document.getElementById('hero-dots').appendChild(d);
  });
}

// ── Candidate grid ────────────────────────────────────────────────
function buildCandidates(sp) {
  const grid = document.getElementById('candidate-grid');
  grid.innerHTML = '';

  const candidates = candidateSpecies[sp.key] || [];
  candidates.forEach(c => {
    // Pre-compute scores so card can show a quick preview
    const ecoResult = computeEcoScore(sp, c);
    const simColor  = simToColor(c.sim);

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
      <div class="cc-stats">
        <div class="cc-stat">
          <span class="cc-stat-label">Status</span>
          <span class="cc-stat-value">${c.status}</span>
        </div>
        <div class="cc-stat">
          <span class="cc-stat-label">Divergence</span>
          <span class="cc-stat-value">${c.divergenceMya} Mya</span>
        </div>
        <div class="cc-stat">
          <span class="cc-stat-label">Biome</span>
          <span class="cc-stat-value">${BIOME_LABELS[c.biome] || c.biome}</span>
        </div>
        <div class="cc-stat">
          <span class="cc-stat-label">Diet</span>
          <span class="cc-stat-value">${DIET_LABELS[c.dietType] || c.dietType}</span>
        </div>
        <div class="cc-stat">
          <span class="cc-stat-label">Temp range</span>
          <span class="cc-stat-value">${c.tempMin}°C to ${c.tempMax}°C</span>
        </div>
        <div class="cc-stat">
          <span class="cc-stat-label">Eco score</span>
          <span class="cc-stat-value" style="color:${ecoToColor(ecoResult.total)}">${ecoResult.total}/100</span>
        </div>
      </div>`;
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

  const pct   = c.sim;
  const color = simToColor(pct);

  const simEl = document.getElementById('sim-big');
  simEl.textContent = pct + '%';
  simEl.style.color = color;

  const barEl = document.getElementById('sim-bar');
  barEl.style.width      = '0%';
  barEl.style.background = color;
  setTimeout(() => barEl.style.width = Math.min(pct, 100) + '%', 50);

  const simLabel = pct >= 99 ? 'Very high similarity'
                 : pct >= 95 ? 'High similarity'
                 : pct >= 80 ? 'Moderate similarity'
                 : 'Low similarity';
  setText('sim-label', simLabel);

  const ecoResult = computeEcoScore(selectedExtinct, c);

  // Radar chart
  setTimeout(() => drawRadarChart(ecoResult.factors), 100);

  // Temperature range chart
  drawTempChart(selectedExtinct, c);

  // Eco factor bars
  renderEcoCards(ecoResult);

  // Summary table
  renderSummaryTable(selectedExtinct, c, ecoResult);

  // Phylo tree — async, fetches from Open Tree of Life using scientific names
  const adjustedSciName = selectedExtinct.sci.replace(' ssp. ', ' '); // For API compatibility
  drawPhyloTree(adjustedSciName, c.sci);

  setTimeout(() => renderVerdict(c), 500);
  setTimeout(() => {
    document.getElementById('analysis-section')
      .scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// ── Radar chart ───────────────────────────────────────────────────
function drawRadarChart(factors) {
  const svg    = document.getElementById('radar-svg');
  svg.innerHTML = '';
  const NS     = 'http://www.w3.org/2000/svg';
  const cx     = 130, cy = 105, R = 80;
  const keys   = Object.keys(factors);
  const n      = keys.length;
  const angleStep = (2 * Math.PI) / n;
  // Start at top (-π/2)
  const angle  = i => -Math.PI / 2 + i * angleStep;
  const pt     = (i, r) => [
    cx + r * Math.cos(angle(i)),
    cy + r * Math.sin(angle(i)),
  ];

  // Grid rings
  [20, 40, 60, 80, 100].forEach(pct => {
    const r     = R * pct / 100;
    const ring  = document.createElementNS(NS, 'polygon');
    const pts   = keys.map((_, i) => pt(i, r).join(',')).join(' ');
    ring.setAttribute('points', pts);
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', '#e2e8e2');
    ring.setAttribute('stroke-width', '1');
    svg.appendChild(ring);
    // Label 100 ring
    if (pct === 100 || pct === 50) {
      const lbl = document.createElementNS(NS, 'text');
      lbl.setAttribute('x', cx + 4);
      lbl.setAttribute('y', cy - r + 4);
      lbl.setAttribute('font-size', '8');
      lbl.setAttribute('fill', '#b0cfc0');
      lbl.setAttribute('font-family', "'Nunito Sans',sans-serif");
      lbl.textContent = pct;
      svg.appendChild(lbl);
    }
  });

  // Axis lines
  keys.forEach((_, i) => {
    const [x, y] = pt(i, R);
    const line   = document.createElementNS(NS, 'line');
    line.setAttribute('x1', cx); line.setAttribute('y1', cy);
    line.setAttribute('x2', x);  line.setAttribute('y2', y);
    line.setAttribute('stroke', '#e2e8e2');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
  });

  // Data polygon
  const scores = keys.map(k => factors[k].score);
  const polyPts = scores.map((s, i) => pt(i, R * s / 100).join(',')).join(' ');
  const poly    = document.createElementNS(NS, 'polygon');
  poly.setAttribute('points', polyPts);
  poly.setAttribute('fill', 'rgba(26,107,53,0.15)');
  poly.setAttribute('stroke', '#1a6b35');
  poly.setAttribute('stroke-width', '2');
  svg.appendChild(poly);

  // Data dots
  scores.forEach((s, i) => {
    const [x, y] = pt(i, R * s / 100);
    const dot    = document.createElementNS(NS, 'circle');
    dot.setAttribute('cx', x); dot.setAttribute('cy', y); dot.setAttribute('r', '4');
    dot.setAttribute('fill', s >= 65 ? '#1a6b35' : s >= 40 ? '#c47c1a' : '#c0392b');
    dot.setAttribute('stroke', 'white'); dot.setAttribute('stroke-width', '1.5');
    svg.appendChild(dot);
  });

  // Labels
  keys.forEach((k, i) => {
    const labelR = R + 22;
    const [x, y] = pt(i, labelR);
    const lbl    = document.createElementNS(NS, 'text');
    lbl.setAttribute('x', x);
    lbl.setAttribute('y', y + 3);
    lbl.setAttribute('text-anchor', Math.abs(x - cx) < 5 ? 'middle' : x < cx ? 'end' : 'start');
    lbl.setAttribute('font-size', '9');
    lbl.setAttribute('font-family', "'Nunito Sans',sans-serif");
    lbl.setAttribute('fill', '#5a7a62');
    lbl.setAttribute('font-weight', '600');
    // Wrap long labels
    const words = k.split(' ');
    if (words.length > 1 && Math.abs(x - cx) > 20) {
      lbl.textContent = words[0];
      const lbl2 = document.createElementNS(NS, 'text');
      lbl2.setAttribute('x', x);
      lbl2.setAttribute('y', y + 13);
      lbl2.setAttribute('text-anchor', lbl.getAttribute('text-anchor'));
      lbl2.setAttribute('font-size', '9');
      lbl2.setAttribute('font-family', "'Nunito Sans',sans-serif");
      lbl2.setAttribute('fill', '#5a7a62');
      lbl2.setAttribute('font-weight', '600');
      lbl2.textContent = words.slice(1).join(' ');
      svg.appendChild(lbl2);
    } else {
      lbl.textContent = k;
    }
    svg.appendChild(lbl);
  });
}

// ── Temperature range chart ───────────────────────────────────────
function drawTempChart(extinct, candidate) {
  const svg = document.getElementById('temp-svg');
  svg.innerHTML = '';
  const NS  = 'http://www.w3.org/2000/svg';
  const W   = 480, H = 120;
  const PAD = { left: 100, right: 20, top: 20, bottom: 30 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top  - PAD.bottom;

  // Determine scale from all values
  const allTemps = [extinct.tempMin, extinct.tempMax, candidate.tempMin, candidate.tempMax];
  const minT = Math.min(...allTemps) - 5;
  const maxT = Math.max(...allTemps) + 5;
  const scaleX = v => PAD.left + ((v - minT) / (maxT - minT)) * chartW;

  // Axis line
  const axis = document.createElementNS(NS, 'line');
  axis.setAttribute('x1', PAD.left); axis.setAttribute('y1', H - PAD.bottom);
  axis.setAttribute('x2', W - PAD.right); axis.setAttribute('y2', H - PAD.bottom);
  axis.setAttribute('stroke', '#d0e0d8'); axis.setAttribute('stroke-width', '1');
  svg.appendChild(axis);

  // Tick marks and labels
  const ticks = [];
  for (let t = Math.ceil(minT / 5) * 5; t <= maxT; t += 5) ticks.push(t);
  ticks.forEach(t => {
    const x    = scaleX(t);
    const tick = document.createElementNS(NS, 'line');
    tick.setAttribute('x1', x); tick.setAttribute('y1', H - PAD.bottom);
    tick.setAttribute('x2', x); tick.setAttribute('y2', H - PAD.bottom + 4);
    tick.setAttribute('stroke', '#b0cfc0'); tick.setAttribute('stroke-width', '1');
    svg.appendChild(tick);
    const lbl = document.createElementNS(NS, 'text');
    lbl.setAttribute('x', x); lbl.setAttribute('y', H - PAD.bottom + 14);
    lbl.setAttribute('text-anchor', 'middle');
    lbl.setAttribute('font-size', '9'); lbl.setAttribute('fill', '#7a9a82');
    lbl.setAttribute('font-family', "'Nunito Sans',sans-serif");
    lbl.textContent = t + '°C';
    svg.appendChild(lbl);
  });

  // Zero line
  if (minT < 0 && maxT > 0) {
    const zl = document.createElementNS(NS, 'line');
    zl.setAttribute('x1', scaleX(0)); zl.setAttribute('y1', PAD.top);
    zl.setAttribute('x2', scaleX(0)); zl.setAttribute('y2', H - PAD.bottom);
    zl.setAttribute('stroke', '#c0e0c8'); zl.setAttribute('stroke-width', '1');
    zl.setAttribute('stroke-dasharray', '3,3');
    svg.appendChild(zl);
  }

  // Draw species bars
  const species = [
    { label: extinct.name,   min: extinct.tempMin,   max: extinct.tempMax,   color: '#c0392b', y: PAD.top + 10 },
    { label: candidate.name, min: candidate.tempMin, max: candidate.tempMax, color: '#1a6b35', y: PAD.top + 42 },
  ];

  // Overlap region
  const ovMin = Math.max(extinct.tempMin, candidate.tempMin);
  const ovMax = Math.min(extinct.tempMax, candidate.tempMax);
  if (ovMin < ovMax) {
    const ovRect = document.createElementNS(NS, 'rect');
    ovRect.setAttribute('x', scaleX(ovMin));
    ovRect.setAttribute('y', PAD.top + 8);
    ovRect.setAttribute('width',  Math.max(0, scaleX(ovMax) - scaleX(ovMin)));
    ovRect.setAttribute('height', 36);
    ovRect.setAttribute('fill', 'rgba(26,107,53,0.12)');
    svg.appendChild(ovRect);
  }

  species.forEach(sp => {
    // Row label
    const lbl = document.createElementNS(NS, 'text');
    lbl.setAttribute('x', PAD.left - 6); lbl.setAttribute('y', sp.y + 12);
    lbl.setAttribute('text-anchor', 'end');
    lbl.setAttribute('font-size', '10'); lbl.setAttribute('fill', sp.color);
    lbl.setAttribute('font-family', "'Nunito Sans',sans-serif");
    lbl.setAttribute('font-weight', '700');
    lbl.textContent = sp.label.length > 14 ? sp.label.split(' ').slice(0,2).join(' ') : sp.label;
    svg.appendChild(lbl);

    // Bar
    const bar = document.createElementNS(NS, 'rect');
    bar.setAttribute('x',      scaleX(sp.min));
    bar.setAttribute('y',      sp.y);
    bar.setAttribute('width',  Math.max(2, scaleX(sp.max) - scaleX(sp.min)));
    bar.setAttribute('height', 22);
    bar.setAttribute('rx',     '4');
    bar.setAttribute('fill',   sp.color);
    bar.setAttribute('opacity','0.8');
    svg.appendChild(bar);

    // Min/max labels
    [sp.min, sp.max].forEach((val, idx) => {
      const vl = document.createElementNS(NS, 'text');
      vl.setAttribute('x', idx === 0 ? scaleX(val) - 3 : scaleX(val) + 3);
      vl.setAttribute('y', sp.y + 14);
      vl.setAttribute('text-anchor', idx === 0 ? 'end' : 'start');
      vl.setAttribute('font-size', '9'); vl.setAttribute('fill', '#fff');
      vl.setAttribute('font-family', "'Nunito Sans',sans-serif");
      vl.setAttribute('font-weight', '700');
      vl.textContent = val + '°C';
      svg.appendChild(vl);
    });
  });

  // Overlap label
  if (ovMin < ovMax) {
    const olbl = document.createElementNS(NS, 'text');
    olbl.setAttribute('x', (scaleX(ovMin) + scaleX(ovMax)) / 2);
    olbl.setAttribute('y', PAD.top + 56);
    olbl.setAttribute('text-anchor', 'middle');
    olbl.setAttribute('font-size', '9'); olbl.setAttribute('fill', '#1a6b35');
    olbl.setAttribute('font-family', "'Nunito Sans',sans-serif");
    olbl.setAttribute('font-weight', '700');
    olbl.textContent = 'Overlap';
    svg.appendChild(olbl);
  }
}

// ── Ecological factor bars (vertical list) ────────────────────────
function renderEcoCards(ecoResult) {
  const cont = document.getElementById('eco-row');
  cont.innerHTML = '';

  Object.entries(ecoResult.factors).forEach(([label, { score }]) => {
    const cls = score >= 65 ? 'ok' : score >= 40 ? 'warn' : 'bad';
    const div = document.createElement('div');
    div.className = 'eco-item';
    div.innerHTML = `
      <div class="eco-item-left">
        <div class="eco-label">${label}</div>
      </div>
      <div class="eco-item-bar-wrap">
        <div class="eco-bar-fill ${cls}" style="width:0%"></div>
      </div>
      <div class="eco-val ${cls}">${scoreLabel(score)} · ${score}</div>`;
    cont.appendChild(div);
    setTimeout(() => div.querySelector('.eco-bar-fill').style.width = score + '%', 200);
  });
}

// ── Summary comparison table ──────────────────────────────────────
function renderSummaryTable(extinct, candidate, ecoResult) {
  const cont = document.getElementById('summary-table');

  const pill = (val, cls) =>
    `<span class="tbl-pill ${cls}">${val}</span>`;

  const ecoTotal   = ecoResult.total;
  const ecoClsPill = ecoTotal >= 65 ? 'ok' : ecoTotal >= 40 ? 'warn' : 'bad';
  const simCls     = candidate.sim >= 99 ? 'ok' : candidate.sim >= 90 ? 'warn' : 'bad';

  // Temp overlap score for display
  const tempScore = ecoResult.factors['Climate match']?.score ?? 0;
  const tempCls   = tempScore >= 65 ? 'ok' : tempScore >= 40 ? 'warn' : 'bad';
  const biomeCls  = ecoResult.factors['Biome match']?.score >= 65 ? 'ok'
                  : ecoResult.factors['Biome match']?.score >= 40 ? 'warn' : 'bad';

  const rows = [
    {
      factor: 'Genomic similarity',
      extinct: '—',
      candidate: pill(candidate.sim + '%', simCls),
      note: 'Whole-genome identity from BLAST alignment',
    },
    {
      factor: 'Divergence time',
      extinct: '—',
      candidate: `${candidate.divergenceMya} Mya`,
      note: 'Time since lineage split',
    },
    {
      factor: 'Biome',
      extinct: BIOME_LABELS[extinct.biome] || extinct.biome,
      candidate: BIOME_LABELS[candidate.biome] || candidate.biome,
      note: pill(scoreLabel(ecoResult.factors['Biome match']?.score ?? 0), biomeCls),
    },
    {
      factor: 'Temp range',
      extinct: `${extinct.tempMin}°C – ${extinct.tempMax}°C`,
      candidate: `${candidate.tempMin}°C – ${candidate.tempMax}°C`,
      note: pill(scoreLabel(tempScore) + ' overlap', tempCls),
    },
    {
      factor: 'Diet type',
      extinct: DIET_LABELS[extinct.dietType] || extinct.dietType,
      candidate: DIET_LABELS[candidate.dietType] || candidate.dietType,
      note: pill(scoreLabel(ecoResult.factors['Diet compatibility']?.score ?? 0), ecoResult.factors['Diet compatibility']?.score >= 65 ? 'ok' : ecoResult.factors['Diet compatibility']?.score >= 40 ? 'warn' : 'bad'),
    },
    {
      factor: 'Habitat intactness',
      extinct: '—',
      candidate: `${candidate.habitatIntact ?? '—'}%`,
      note: pill(scoreLabel(ecoResult.factors['Habitat intactness']?.score ?? 0), ecoResult.factors['Habitat intactness']?.score >= 65 ? 'ok' : ecoResult.factors['Habitat intactness']?.score >= 40 ? 'warn' : 'bad'),
    },
    {
      factor: 'Invasive predators',
      extinct: '—',
      candidate: candidate.invasivePredators ? '⚠ Present' : '✓ None',
      note: candidate.invasivePredators ? pill('High risk', 'bad') : pill('Low risk', 'ok'),
    },
    {
      factor: 'Ecological composite',
      extinct: '—',
      candidate: `${ecoTotal}/100`,
      note: pill(scoreLabel(ecoTotal), ecoClsPill),
    },
  ];

  cont.innerHTML = `
    <table class="summary-table">
      <thead>
        <tr>
          <th>Factor</th>
          <th class="col-extinct">${extinct.name}</th>
          <th>${candidate.name}</th>
          <th>Assessment</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td>${r.factor}</td>
            <td class="col-extinct">${r.extinct}</td>
            <td>${r.candidate}</td>
            <td>${r.note}</td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

// ── Verdict card ──────────────────────────────────────────────────
function renderVerdict(c) {
  const key       = computeVerdict(selectedExtinct, c);
  const ecoResult = computeEcoScore(selectedExtinct, c);
  const v         = verdictScenarios[key];
  const sp        = selectedExtinct;

  // Build factor summary rows
  const factorRows = Object.entries(ecoResult.factors).map(([label, { score }]) => {
    const col = score >= 65 ? '#86efac' : score >= 40 ? '#fcd34d' : '#fca5a5';
    return `<tr>
      <td style="padding:4px 10px;font-size:12px;opacity:0.8;">${label}</td>
      <td style="padding:4px 10px;font-size:12px;font-weight:700;color:${col};">${scoreLabel(score)} (${score}/100)</td>
    </tr>`;
  }).join('');

  const ecoTotal  = ecoResult.total;
  const ecoColor  = ecoTotal >= 65 ? '#86efac' : ecoTotal >= 40 ? '#fcd34d' : '#fca5a5';
  const simColor2 = c.sim >= 99 ? '#86efac' : c.sim >= 90 ? '#fcd34d' : '#fca5a5';

  const detailMap = {
    impossible:   `Genomic similarity between ${c.name} and ${sp.name} falls below the viability threshold. The editing burden required exceeds current technological capability.`,
    'wild-reloc': `High genomic similarity and strong ecological compatibility support direct relocation of ${c.name} to ${sp.name}'s historic range without significant genetic modification.`,
    'wild-gm':    `Genomic similarity is sufficient for de-extinction, but targeted genetic modifications are required before wild release — particularly to restore key adaptive traits.`,
    captive:      `Genetic de-extinction is feasible but ecological conditions are insufficient for wild release. Controlled revival in a managed environment is recommended first.`,
    'no-attempt': `While genetic de-extinction may be technically possible, ecological conditions — including invasive predators, habitat loss, or human conflict — make reintroduction inadvisable at this time.`,
  };

  const vc = document.getElementById('verdict-card');
  vc.style.background = `linear-gradient(135deg, ${v.color} 0%, ${adjustColor(v.color, -20)} 100%)`;
  vc.style.color = '#fff';
  vc.innerHTML = `
    <div class="verdict-deco"></div>
    <div class="verdict-inner">
      <div>
        <div class="verdict-label">De-Extinction Verdict</div>
        <div class="verdict-title">${v.text}</div>
        <div class="verdict-sub">${sp.name} × ${c.name}</div>
        <div class="verdict-detail">${detailMap[key]}</div>
        <div class="verdict-logic">
          <table style="width:100%;border-collapse:collapse;">
            <tr style="border-bottom:1px solid rgba(255,255,255,0.15);">
              <td style="padding:5px 10px;font-size:12px;opacity:0.8;">Genomic similarity</td>
              <td style="padding:5px 10px;font-size:12px;font-weight:700;color:${simColor2};">${c.sim}%</td>
            </tr>
            ${factorRows}
            <tr style="border-top:1px solid rgba(255,255,255,0.2);">
              <td style="padding:7px 10px;font-size:12px;font-weight:700;">Ecological composite</td>
              <td style="padding:7px 10px;font-size:12px;font-weight:700;color:${ecoColor};">${ecoTotal}/100</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="verdict-emoji-big">${sp.icon}</div>
    </div>`;
  vc.classList.add('open');
}

// =============================================================================
// Phylogenetic tree — Open Tree of Life API
// =============================================================================
// Inputs:  extinct species sci name  +  candidate species sci name
// Process: 1. TNRS  → resolve names to OTT IDs
//          2. induced_subtree → Newick string covering both taxa
//          3. Parse Newick → JS tree
//          4. Render cladogram SVG with colour-coded nodes
// Fallback: if API unreachable, shows a friendly offline message
// =============================================================================

// Cache so we don't re-fetch the same pair
const _phyloCache = {};

async function drawPhyloTree(extinctSci, candidateSci) {
  const svg = document.getElementById('phylo-svg');
  const NS = 'http://www.w3.org/2000/svg';

  // Loading state
  svg.setAttribute('viewBox', '0 0 600 60');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '60');
  svg.innerHTML = '';
  const loading = document.createElementNS(NS, 'text');
  loading.setAttribute('x', '300'); loading.setAttribute('y', '32');
  loading.setAttribute('text-anchor', 'middle');
  loading.setAttribute('font-family', "'Nunito Sans',sans-serif");
  loading.setAttribute('font-size', '13'); loading.setAttribute('fill', '#7a9a82');
  loading.textContent = 'Loading phylogenetic tree from Open Tree of Life…';
  svg.appendChild(loading);

  const cacheKey = `${extinctSci}||${candidateSci}`;
  if (_phyloCache[cacheKey]) {
    renderPhyloSVG(svg, NS, _phyloCache[cacheKey], extinctSci, candidateSci);
    return;
  }

  try {
    // ── Fetch all relevant species ───────────────────────
    const names = [extinctSci, candidateSci, ...getLivingRelatives(extinctSci)];
    const tnrsRes = await fetch('https://api.opentreeoflife.org/v3/tnrs/match_names', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ names, do_approximate_matching: true }),
    });
    if (!tnrsRes.ok) throw new Error('TNRS failed: ' + tnrsRes.status);
    const tnrsData = await tnrsRes.json();

    // Compute OTT IDs and build a list for the tree
    const ottIds = [];
    tnrsData.results.forEach(result => {
      const match = result.matches?.[0];
      if (match?.taxon?.ott_id) {
        ottIds.push(match.taxon.ott_id);
      }
    });

    if (ottIds.length < 2) throw new Error('Could not resolve all species names');

    // ── Get induced subtree Newick ───────────────────────
    const treeRes = await fetch('https://api.opentreeoflife.org/v3/tree_of_life/induced_subtree', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ott_ids: ottIds, label_format: 'name' }),
    });
    if (!treeRes.ok) throw new Error('induced_subtree failed: ' + treeRes.status);
    const treeData = await treeRes.json();
    if (!treeData.newick) throw new Error('No Newick in response');

    const root = parseNewick(treeData.newick);
    _phyloCache[cacheKey] = root;

    renderPhyloSVG(svg, NS, root, extinctSci, candidateSci);

  } catch (err) {
    console.warn('Phylo API error:', err.message);
    showPhyloFallback(svg, NS, extinctSci, candidateSci, err.message);
  }
}

function getLivingRelatives(extinctSci) {
  // Fetch or compile living relatives for the specific extinct species from your dataset or an API
  // Example: Return a list of common living relatives as scientific names
  const relatives = {
    'Mammuthus primigenius': ['Elephas maximus', 'Loxodonta africana'], // example relatives
    'Canis lupus labradorius': ['Canis lupus'], // includes the grey wolf
    // Add more extinct species as needed
  };
  return relatives[extinctSci] || [];
}

// ── Newick parser ─────────────────────────────────────────────────
// Converts a Newick string into a nested { name, branchLength, children[] }
function parseNewick(s) {
  // Tokenise into parens, commas, colons, semicolons, and name/length strings
  const tokens = s.match(/\(|\)|,|;|:[^,);()]+|[^,();:]+/g) || [];
  let pos = 0;

  function parseNode() {
    const node = { name: '', branchLength: null, children: [] };

    if (tokens[pos] === '(') {
      pos++; // consume '('
      node.children.push(parseNode());
      while (tokens[pos] === ',') {
        pos++;
        node.children.push(parseNode());
      }
      if (tokens[pos] === ')') pos++; // consume ')'
    }

    // Optional label after closing paren or for leaf
    if (pos < tokens.length && tokens[pos] !== '(' && tokens[pos] !== ')' &&
        tokens[pos] !== ',' && tokens[pos] !== ';' && !tokens[pos].startsWith(':')) {
      node.name = tokens[pos].replace(/_/g, ' ').trim();
      pos++;
    }

    // Optional branch length
    if (pos < tokens.length && tokens[pos]?.startsWith(':')) {
      node.branchLength = parseFloat(tokens[pos].slice(1)) || 0;
      pos++;
    }

    return node;
  }

  const root = parseNode();
  return root;
}

// ── Cladogram layout ──────────────────────────────────────────────
// Assigns (x, y) pixel positions to every node for a right-to-left cladogram.
// Leaves are pinned to the right; internal nodes are positioned by depth.
function layoutCladogram(root, W, H, pad) {
  // Count leaves
  function leafCount(n) {
    return n.children.length === 0 ? 1 : n.children.reduce((s, c) => s + leafCount(c), 0);
  }
  const totalLeaves = leafCount(root);
  const rowH = (H - pad.top - pad.bottom) / Math.max(1, totalLeaves - 1);

  // Assign y to leaves top-to-bottom, average for internals
  let leafIdx = 0;
  function assignY(n) {
    if (n.children.length === 0) {
      n._y = pad.top + leafIdx * rowH;
      leafIdx++;
    } else {
      n.children.forEach(assignY);
      const ys = n.children.map(c => c._y);
      n._y = (Math.min(...ys) + Math.max(...ys)) / 2;
    }
  }
  assignY(root);

  // Depth for cladogram (equal branch lengths)
  function treeDepth(n) {
    return n.children.length === 0 ? 0 : 1 + Math.max(...n.children.map(treeDepth));
  }
  const maxDepth = treeDepth(root) || 1;
  const xStep    = (W - pad.left - pad.right) / maxDepth;

  function assignX(n, depth) {
    n._x = n.children.length === 0
      ? W - pad.right              // leaves pinned right
      : pad.left + depth * xStep;  // internals by depth
    n.children.forEach(c => assignX(c, depth + 1));
  }
  assignX(root, 0);
}

// ── Render cladogram SVG ──────────────────────────────────────────
function renderPhyloSVG(svg, NS, root, extinctSci, candidateSci) {
  // Dynamic height based on leaf count
  function leafCount(n) { return n.children.length === 0 ? 1 : n.children.reduce((s,c)=>s+leafCount(c),0); }
  const leaves  = leafCount(root);
  const ROW_H   = 26;
  const H       = Math.max(180, leaves * ROW_H + 70);
  const W       = 700;
  const pad     = { top: 20, bottom: 40, left: 20, right: 220 };

  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width',   '100%');
  svg.setAttribute('height',  H);

  layoutCladogram(root, W, H, pad);

  // Colour helper — match by name substring
  function nodeColor(name) {
    if (!name) return '#b0cfc0';
    const n = name.toLowerCase();
    const e = extinctSci.toLowerCase().split(' ');
    const c = candidateSci.toLowerCase().split(' ');
    // Genus or species word match
    if (e.some(w => w.length > 3 && n.includes(w))) return '#c0392b';  // extinct
    if (c.some(w => w.length > 3 && n.includes(w))) return '#1a6b35';  // candidate
    return '#b0cfc0';  // ancestor / other
  }

  function isLeaf(n) { return n.children.length === 0; }

  // Draw edges first (so nodes sit on top)
  function drawEdges(n) {
    n.children.forEach(child => {
      // Horizontal from parent x to child x at parent y, then vertical to child y
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', `M${n._x},${n._y} H${child._x} V${child._y}`);
      path.setAttribute('fill',         'none');
      path.setAttribute('stroke',       '#d0e8d8');
      path.setAttribute('stroke-width', '1.8');
      svg.appendChild(path);
      drawEdges(child);
    });
  }
  drawEdges(root);

  // Draw nodes + labels
  function drawNodes(n) {
    const col    = nodeColor(n.name);
    const radius = isLeaf(n) ? 5 : 3;

    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('cx', n._x); dot.setAttribute('cy', n._y);
    dot.setAttribute('r',  radius);
    dot.setAttribute('fill',         isLeaf(n) ? col : '#e8f4e8');
    dot.setAttribute('stroke',       col);
    dot.setAttribute('stroke-width', '2');
    svg.appendChild(dot);

    if (n.name) {
      const txt = document.createElementNS(NS, 'text');
      const isExtinct   = nodeColor(n.name) === '#c0392b';
      const isCandidate = nodeColor(n.name) === '#1a6b35';

      txt.setAttribute('x',           n._x + (isLeaf(n) ? 9 : 5));
      txt.setAttribute('y',           n._y + 4);
      txt.setAttribute('font-family', "'Nunito Sans',sans-serif");
      txt.setAttribute('font-size',   isLeaf(n) ? '11' : '9');
      txt.setAttribute('fill',        isLeaf(n) ? col : '#7a9a82');
      txt.setAttribute('font-weight', isLeaf(n) ? '700' : '400');
      txt.setAttribute('font-style',  'italic');

      // Append † for extinct species
      txt.textContent = isExtinct ? n.name + ' †' : n.name;
      svg.appendChild(txt);
    }

    n.children.forEach(drawNodes);
  }
  drawNodes(root);

  // Source attribution
  const src = document.createElementNS(NS, 'text');
  src.setAttribute('x', W - 4); src.setAttribute('y', H - 4);
  src.setAttribute('text-anchor', 'end');
  src.setAttribute('font-family', "'Nunito Sans',sans-serif");
  src.setAttribute('font-size',   '9'); src.setAttribute('fill', '#b0cfc0');
  src.textContent = 'Source: Open Tree of Life v3 · opentreeoflife.org';
  svg.appendChild(src);

  // Legend
  const legendItems = [
    ['#c0392b', '† Extinct'],
    ['#1a6b35', 'Living relative / candidate'],
    ['#b0cfc0', 'Ancestor / internal node'],
  ];
  legendItems.forEach(([col, lbl], i) => {
    const lx = 10 + i * 200, ly = H - 12;
    const d  = document.createElementNS(NS, 'circle');
    d.setAttribute('cx', lx); d.setAttribute('cy', ly);
    d.setAttribute('r', 5); d.setAttribute('fill', col);
    svg.appendChild(d);
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', lx + 9); t.setAttribute('y', ly + 4);
    t.setAttribute('font-family', "'Nunito Sans',sans-serif");
    t.setAttribute('font-size',   '10'); t.setAttribute('fill', '#7a9a82');
    t.textContent = lbl;
    svg.appendChild(t);
  });
}

// ── Offline fallback ──────────────────────────────────────────────
function showPhyloFallback(svg, NS, extinctSci, candidateSci, reason) {
  const W = 600, H = 80;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width',   '100%');
  svg.setAttribute('height',  H);
  svg.innerHTML  = '';

  const badge = document.createElementNS(NS, 'text');
  badge.setAttribute('x', W / 2); badge.setAttribute('y', 28);
  badge.setAttribute('text-anchor', 'middle');
  badge.setAttribute('font-family', "'Nunito Sans',sans-serif");
  badge.setAttribute('font-size',   '13'); badge.setAttribute('fill', '#c47c1a');
  badge.textContent = '⚠ Could not load phylogenetic tree (network unavailable)';
  svg.appendChild(badge);

  const sub = document.createElementNS(NS, 'text');
  sub.setAttribute('x', W / 2); sub.setAttribute('y', 48);
  sub.setAttribute('text-anchor', 'middle');
  sub.setAttribute('font-family', "'Nunito Sans',sans-serif");
  sub.setAttribute('font-size',   '10'); sub.setAttribute('fill', '#b0cfc0');
  sub.textContent = `Taxa queried: "${extinctSci}" · "${candidateSci}"  —  ${reason}`;
  svg.appendChild(sub);
}

// ── Helpers ───────────────────────────────────────────────────────
function showSection(id) {
  const el = document.getElementById(id);
  el.classList.remove('open'); void el.offsetWidth; el.classList.add('open');
}
function hideSection(id) { document.getElementById(id).classList.remove('open'); }
function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

function simToColor(pct) {
  if (pct >= 99) return '#1a6b35';
  if (pct >= 90) return '#c47c1a';
  return '#c0392b';
}

function ecoToColor(score) {
  if (score >= 65) return '#1a6b35';
  if (score >= 40) return '#c47c1a';
  return '#c0392b';
}

function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

document.addEventListener('DOMContentLoaded', init);