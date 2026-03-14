// =============================================================================
// BIOHACK 2026
// Team name: rex-the-devs

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
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeDistPopup(); closePhyloPopup(); }
  });
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
    const ecoResult  = computeEcoScore(sp, c);
    const ecoTotal   = ecoResult.total;
    const ecoColor   = ecoToColor(ecoTotal);
    const simColor   = simToColor(c.sim);

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
        <div class="cc-sim" style="color:${ecoColor}">${ecoTotal}%</div>
      </div>
      <div class="cc-sim-bar-wrap">
        <div class="cc-sim-bar" style="width:0%;background:${ecoColor}"></div>
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
          <span class="cc-stat-label">DNA similarity</span>
          <span class="cc-stat-value" style="color:${simColor}">${c.sim}%</span>
        </div>
      </div>`;
    card.onclick = () => selectCandidate(c, card);
    grid.appendChild(card);
    // Bar fills to eco score out of 100
    setTimeout(() => card.querySelector('.cc-sim-bar').style.width = ecoTotal + '%', 200);
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

  // Summary table
  renderSummaryTable(selectedExtinct, c, ecoResult);

  // Phylo tree — pass extinct + ALL candidates so tree covers the full clade
  // Clean ecotype notes from sci name before querying (e.g. "(plains ecotype)")
  const cleanExtinctSci = selectedExtinct.sci
    .replace(/\s*\(.*?\)/g, '')   // remove parenthetical notes
    .replace(' ssp. ', ' ')       // normalise subspecies
    .trim();
  const allCandidates = candidateSpecies[selectedExtinct.key] || [];
  drawPhyloTree(cleanExtinctSci, c.sci, allCandidates);

  // Trophic chart
  setTimeout(() => drawTrophicChart(selectedExtinct.key), 150);

  // Distribution chart
  setTimeout(() => drawDistributionChart(selectedExtinct.key, 'historic'), 150);

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
  const cx     = 170, cy = 130, R = 90;
  const keys   = Object.keys(factors);
  const n      = keys.length;
  const angleStep = (2 * Math.PI) / n;
  const angle  = i => -Math.PI / 2 + i * angleStep;
  const pt     = (i, r) => [
    cx + r * Math.cos(angle(i)),
    cy + r * Math.sin(angle(i)),
  ];

  // Grid rings
  [20, 40, 60, 80, 100].forEach(pct => {
    const r    = R * pct / 100;
    const ring = document.createElementNS(NS, 'polygon');
    const pts  = keys.map((_, i) => pt(i, r).join(',')).join(' ');
    ring.setAttribute('points', pts);
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', '#e2e8e2');
    ring.setAttribute('stroke-width', '1');
    svg.appendChild(ring);
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

  // Data dots + score labels
  scores.forEach((s, i) => {
    const [dx, dy] = pt(i, R * s / 100);
    const dotColor = s >= 65 ? '#1a6b35' : s >= 40 ? '#c47c1a' : '#c0392b';

    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('cx', dx); dot.setAttribute('cy', dy); dot.setAttribute('r', '5');
    dot.setAttribute('fill', dotColor);
    dot.setAttribute('stroke', 'white'); dot.setAttribute('stroke-width', '1.5');
    svg.appendChild(dot);

    // Score pill: nudge slightly outward from centre so it doesn't sit on the dot
    const nudge  = 14;
    const ang    = angle(i);
    const px     = dx + nudge * Math.cos(ang);
    const py     = dy + nudge * Math.sin(ang);
    const anchor = Math.abs(Math.cos(ang)) < 0.2 ? 'middle' : Math.cos(ang) > 0 ? 'start' : 'end';

    const pill = document.createElementNS(NS, 'text');
    pill.setAttribute('x', px);
    pill.setAttribute('y', py + 4);
    pill.setAttribute('text-anchor', anchor);
    pill.setAttribute('font-size', '10');
    pill.setAttribute('font-weight', '800');
    pill.setAttribute('font-family', "'Nunito',sans-serif");
    pill.setAttribute('fill', dotColor);
    pill.textContent = s;
    svg.appendChild(pill);
  });

  // Axis labels (outermost ring + extra margin)
  keys.forEach((k, i) => {
    const labelR = R + 28;
    const [x, y] = pt(i, labelR);
    const anchor = Math.abs(x - cx) < 8 ? 'middle' : x < cx ? 'end' : 'start';

    const words = k.split(' ');
    words.forEach((word, wi) => {
      const lbl = document.createElementNS(NS, 'text');
      lbl.setAttribute('x', x);
      lbl.setAttribute('y', y + 3 + wi * 11);
      lbl.setAttribute('text-anchor', anchor);
      lbl.setAttribute('font-size', '9');
      lbl.setAttribute('font-family', "'Nunito Sans',sans-serif");
      lbl.setAttribute('fill', '#5a7a62');
      lbl.setAttribute('font-weight', '600');
      lbl.textContent = word;
      svg.appendChild(lbl);
    });
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

  // Overlap interpretation summary
  const summaryEl = document.getElementById('temp-overlap-summary');
  if (summaryEl) {
    const overlapSize   = Math.max(0, ovMax - ovMin);
    const extinctRange  = extinct.tempMax  - extinct.tempMin  || 1;
    const pct           = Math.round((overlapSize / extinctRange) * 100);
    const candidateName = candidate.name;
    const extName       = extinct.name;

    let verdict, cls;
    if (pct >= 75) {
      verdict = `Strong overlap (${pct}% of ${extName}'s historic range). ${candidateName} already tolerates the full temperature window of the target habitat — climate adaptation edits are unlikely to be needed.`;
      cls = 'ok';
    } else if (pct >= 40) {
      verdict = `Partial overlap (${pct}% of ${extName}'s historic range). ${candidateName} shares part of the required thermal window, but would need to endure temperatures outside its current tolerance — targeted edits to thermoregulation genes may help.`;
      cls = 'warn';
    } else if (pct > 0) {
      verdict = `Minimal overlap (${pct}% of ${extName}'s historic range). ${candidateName} lives in a very different thermal environment — significant cold/heat adaptation would be required before wild release into the target habitat.`;
      cls = 'bad';
    } else {
      verdict = `No temperature overlap. ${candidateName}'s thermal range does not intersect with ${extName}'s historic habitat at all. Climate mismatch is a major barrier to de-extinction viability.`;
      cls = 'bad';
    }
    summaryEl.innerHTML = `<span class="temp-overlap-icon ${cls}"></span>${verdict}`;
    summaryEl.className = `temp-overlap-summary ${cls}`;
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

  const imgSrc = (typeof speciesImages !== 'undefined' && speciesImages[sp.key]) || '';

  const vc = document.getElementById('verdict-card');
  vc.style.background = '';
  vc.style.color = '#fff';
  vc.innerHTML = `
    ${imgSrc ? `
    <div class="verdict-img-wrap">
      <img src="${imgSrc}" class="verdict-img" alt="${sp.name}" />
      <div class="verdict-img-overlay" style="background: linear-gradient(to right, ${v.color}ee 38%, ${v.color}99 60%, ${adjustColor(v.color,-20)}44 100%);"></div>
    </div>` : `<div style="position:absolute;inset:0;background:linear-gradient(135deg,${v.color},${adjustColor(v.color,-20)});border-radius:var(--radius);"></div>`}
    <div class="verdict-deco"></div>
    <a href="methodology.html" class="verdict-help-btn" title="How we calculate this verdict">?</a>
    <div class="verdict-inner" style="position:relative;z-index:2;">
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
      <div style="flex-shrink:0;"></div>
    </div>`;
  vc.classList.add('open');
}

// =============================================================================
// Phylogenetic tree — generated on-the-spot via Open Tree of Life API
// =============================================================================
// Inputs:  cleaned extinct sci name + selected candidate sci name
//          + full list of all candidate objects for this extinct species
// Process: 1. TNRS  → resolve ALL names to OTT IDs
//          2. induced_subtree → Newick covering all taxa
//          3. Parse Newick → JS tree
//          4. Cladogram SVG:
//             • leaf nodes only are classified as extinct / selected / relative
//             • ancestor / internal nodes are always grey (never misclassified)
//             • leaf labels shown as pill badges, always visible at right margin
//             • internal node labels shown as tooltip on hover only
//             • selected candidate gets halo ring + bold label
// Fallback: network unavailable → friendly message
// =============================================================================

const _phyloCache = {};

// ── Sci-name sanitiser — strips ecotype notes, ssp. etc. ─────────
function sanitiseSciName(raw) {
  return (raw || '')
    .replace(/\s*\(.*?\)/g, '')   // remove "(plains ecotype)" etc.
    .replace(/\s+ssp\.\s+/g, ' ') // Canis lupus ssp. x → Canis lupus x
    .replace(/\s+subsp\.\s+/g, ' ')
    .trim();
}

async function drawPhyloTree(extinctSci, selectedCandidateSci, allCandidates) {
  const svg = document.getElementById('phylo-svg');
  const NS  = 'http://www.w3.org/2000/svg';

  // Clear + show loading
  svg.setAttribute('viewBox', '0 0 600 60');
  svg.setAttribute('width',  '100%');
  svg.setAttribute('height', '60');
  svg.innerHTML = '';
  const loading = document.createElementNS(NS, 'text');
  loading.setAttribute('x', '300'); loading.setAttribute('y', '32');
  loading.setAttribute('text-anchor', 'middle');
  loading.setAttribute('font-family', "'Nunito Sans',sans-serif");
  loading.setAttribute('font-size', '13'); loading.setAttribute('fill', '#7a9a82');
  loading.textContent = 'Generating phylogenetic tree from Open Tree of Life…';
  svg.appendChild(loading);

  // Build name list: extinct + every candidate (sanitised)
  const allCandidateSciNames = (allCandidates || []).map(c => sanitiseSciName(c.sci));
  const cleanExtinct = sanitiseSciName(extinctSci);
  const cleanSelected = sanitiseSciName(selectedCandidateSci);
  const namesToQuery  = [cleanExtinct, ...allCandidateSciNames].filter(Boolean);
  const cacheKey      = namesToQuery.join('||');

  if (_phyloCache[cacheKey]) {
    renderPhyloSVG(svg, NS, _phyloCache[cacheKey], cleanExtinct, cleanSelected, allCandidateSciNames);
    return;
  }

  try {
    // Step 1: TNRS — resolve names → OTT IDs
    const tnrsRes = await fetch('https://api.opentreeoflife.org/v3/tnrs/match_names', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ names: namesToQuery, do_approximate_matching: true }),
    });
    if (!tnrsRes.ok) throw new Error('TNRS failed: ' + tnrsRes.status);
    const tnrsData = await tnrsRes.json();

    const ottIds = [];
    tnrsData.results.forEach(result => {
      const match = result.matches?.[0];
      if (match?.taxon?.ott_id) ottIds.push(match.taxon.ott_id);
    });
    if (ottIds.length < 2) throw new Error('Could not resolve enough species names');

    // Step 2: induced_subtree → Newick
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
    renderPhyloSVG(svg, NS, root, cleanExtinct, cleanSelected, allCandidateSciNames);

  } catch (err) {
    console.warn('Phylo API error:', err.message);
    showPhyloFallback(svg, NS, cleanExtinct, cleanSelected, err.message);
  }
}

// ── Newick parser ─────────────────────────────────────────────────
function parseNewick(s) {
  const tokens = s.match(/\(|\)|,|;|:[^,);()]+|[^,();:]+/g) || [];
  let pos = 0;
  function parseNode() {
    const node = { name: '', branchLength: null, children: [] };
    if (tokens[pos] === '(') {
      pos++;
      node.children.push(parseNode());
      while (tokens[pos] === ',') { pos++; node.children.push(parseNode()); }
      if (tokens[pos] === ')') pos++;
    }
    if (pos < tokens.length && tokens[pos] !== '(' && tokens[pos] !== ')' &&
        tokens[pos] !== ',' && tokens[pos] !== ';' && !tokens[pos].startsWith(':')) {
      node.name = tokens[pos].replace(/_/g, ' ').trim();
      pos++;
    }
    if (pos < tokens.length && tokens[pos]?.startsWith(':')) {
      node.branchLength = parseFloat(tokens[pos].slice(1)) || 0;
      pos++;
    }
    return node;
  }
  return parseNode();
}

// ── Cladogram layout ──────────────────────────────────────────────
function layoutCladogram(root, W, H, pad) {
  function leafCount(n) {
    return n.children.length === 0 ? 1 : n.children.reduce((s,c) => s + leafCount(c), 0);
  }
  const totalLeaves = leafCount(root);
  const rowH = (H - pad.top - pad.bottom) / Math.max(1, totalLeaves - 1);
  let leafIdx = 0;
  function assignY(n) {
    if (n.children.length === 0) { n._y = pad.top + leafIdx++ * rowH; }
    else {
      n.children.forEach(assignY);
      const ys = n.children.map(c => c._y);
      n._y = (Math.min(...ys) + Math.max(...ys)) / 2;
    }
  }
  assignY(root);
  function treeDepth(n) {
    return n.children.length === 0 ? 0 : 1 + Math.max(...n.children.map(treeDepth));
  }
  const maxDepth = treeDepth(root) || 1;
  const xStep    = (W - pad.left - pad.right) / maxDepth;
  function assignX(n, depth) {
    n._x = n.children.length === 0 ? W - pad.right : pad.left + depth * xStep;
    n.children.forEach(c => assignX(c, depth + 1));
  }
  assignX(root, 0);
}

// ── Render cladogram SVG ──────────────────────────────────────────
function renderPhyloSVG(svg, NS, root, extinctSci, selectedCandidateSci, allCandidateSciNames) {
  function leafCount(n) { return n.children.length === 0 ? 1 : n.children.reduce((s,c)=>s+leafCount(c),0); }
  function treeDepthFn(n) { return n.children.length === 0 ? 0 : 1 + Math.max(...n.children.map(treeDepthFn)); }

  const leaves   = leafCount(root);
  const depth    = treeDepthFn(root) || 1;
  const ROW_H    = 30;
  const H        = Math.max(200, leaves * ROW_H + 80);
  // Width scales with depth — extra room so internal node labels don't crowd
  const W        = Math.max(760, depth * 150 + 320);
  const pad      = { top: 38, bottom: 56, left: 28, right: 260 };

  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  // Set real pixel width — the .phylo-scroll wrapper handles horizontal scrolling
  svg.setAttribute('width',  W);
  svg.setAttribute('height', H);

  layoutCladogram(root, W, H, pad);

  // ── Leaf-only classifier — never mis-tags ancestor nodes ──────
  // Returns: 'extinct' | 'selected' | 'relative' | 'ancestor'
  function classify(n) {
    if (n.children.length > 0) return 'ancestor'; // internal node: always ancestor
    const name = (n.name || '').toLowerCase().replace(/_/g, ' ');
    if (!name) return 'ancestor';

    // Need at least 2 words (genus + epithet) to safely match a leaf
    const nameWords = name.split(/\s+/).filter(w => w.length > 2);

    // Check extinct — require BOTH genus and epithet to match (not just genus)
    const extWords = extinctSci.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const extMatch = extWords.length >= 2
      ? extWords.every(w => name.includes(w))
      : extWords.some(w => w.length > 4 && name.includes(w));
    if (extMatch) return 'extinct';

    // Check selected candidate
    const selWords = selectedCandidateSci.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const selMatch = selWords.length >= 2
      ? selWords.every(w => name.includes(w))
      : selWords.some(w => w.length > 4 && name.includes(w));
    if (selMatch) return 'selected';

    // Check other candidates
    for (const sci of allCandidateSciNames) {
      const relWords = sci.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const relMatch = relWords.length >= 2
        ? relWords.every(w => name.includes(w))
        : relWords.some(w => w.length > 4 && name.includes(w));
      if (relMatch) return 'relative';
    }

    return 'ancestor';
  }

  const COLORS = {
    extinct:  { stroke: '#c0392b', dotFill: '#c0392b', text: '#c0392b', badge: '#fde8e8', badgeText: '#9b1c1c' },
    selected: { stroke: '#1a5c35', dotFill: '#1a5c35', text: '#1a5c35', badge: '#d1fae5', badgeText: '#065f46' },
    relative: { stroke: '#5a9a70', dotFill: '#ffffff', text: '#5a9a70', badge: '#ecfdf5', badgeText: '#1a7a4a' },
    ancestor: { stroke: '#b0cfc0', dotFill: '#e8f4e8', text: '#7a9a82', badge: null,     badgeText: null       },
  };

  function isLeaf(n) { return n.children.length === 0; }

  // ── Draw edges ────────────────────────────────────────────────
  function drawEdges(n) {
    n.children.forEach(child => {
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d',            `M${n._x},${n._y} H${child._x} V${child._y}`);
      path.setAttribute('fill',         'none');
      path.setAttribute('stroke',       '#d0e8d8');
      path.setAttribute('stroke-width', '1.5');
      svg.appendChild(path);
      drawEdges(child);
    });
  }
  drawEdges(root);

  // Highlight path to selected candidate
  function findPath(n, path = []) {
    const cur = [...path, n];
    if (isLeaf(n) && classify(n) === 'selected') return cur;
    for (const c of n.children) { const r = findPath(c, cur); if (r) return r; }
    return null;
  }
  const selPath = findPath(root);
  if (selPath && selPath.length > 1) {
    for (let i = 0; i < selPath.length - 1; i++) {
      const p = selPath[i], c = selPath[i+1];
      const hi = document.createElementNS(NS, 'path');
      hi.setAttribute('d',            `M${p._x},${p._y} H${c._x} V${c._y}`);
      hi.setAttribute('fill',         'none');
      hi.setAttribute('stroke',       '#1a5c35');
      hi.setAttribute('stroke-width', '2');
      svg.appendChild(hi);
    }
  }

  // ── Draw nodes ────────────────────────────────────────────────
  function drawNodes(n) {
    const cls    = classify(n);
    const colors = COLORS[cls];
    const leaf   = isLeaf(n);
    const r      = leaf ? 6 : 3.5;

    // Selected candidate outer ring
    if (cls === 'selected') {
      const halo = document.createElementNS(NS, 'circle');
      halo.setAttribute('cx', n._x); halo.setAttribute('cy', n._y); halo.setAttribute('r', r + 5);
      halo.setAttribute('fill', 'none');
      halo.setAttribute('stroke', '#1a5c35');
      halo.setAttribute('stroke-width', '1.2');
      halo.setAttribute('stroke-dasharray', '3,2');
      svg.appendChild(halo);
    }

    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('cx', n._x); dot.setAttribute('cy', n._y); dot.setAttribute('r', r);
    dot.setAttribute('fill',         leaf ? colors.dotFill : colors.dotFill);
    dot.setAttribute('stroke',       colors.stroke);
    dot.setAttribute('stroke-width', cls === 'selected' ? '2.5' : '1.5');
    dot.setAttribute('style', 'cursor:pointer');
    svg.appendChild(dot);

    // ── Leaf: draw pill badge label ──────────────────────────
    if (leaf && n.name) {
      let label = n.name;
      if (cls === 'extinct')  label += '  †';
      if (cls === 'selected') label += '  ★';

      const bx = n._x + 14;
      const by = n._y;

      // Pill background
      if (colors.badge) {
        const pill = document.createElementNS(NS, 'rect');
        // Estimate text width: ~6.5px/char at 10.5px font
        const tw = label.length * 6.5 + 14;
        pill.setAttribute('x',      bx - 4);
        pill.setAttribute('y',      by - 10);
        pill.setAttribute('width',  tw);
        pill.setAttribute('height', 20);
        pill.setAttribute('rx',     '10');
        pill.setAttribute('fill',   colors.badge);
        pill.setAttribute('stroke', colors.stroke);
        pill.setAttribute('stroke-width', '0.8');
        svg.appendChild(pill);
      }

      const txt = document.createElementNS(NS, 'text');
      txt.setAttribute('x',           bx + 3);
      txt.setAttribute('y',           by + 4);
      txt.setAttribute('font-family', "'Nunito Sans',sans-serif");
      txt.setAttribute('font-size',   cls === 'selected' ? '11.5' : '10.5');
      txt.setAttribute('fill',        colors.badgeText || colors.text);
      txt.setAttribute('font-weight', cls === 'selected' ? '800' : '700');
      txt.setAttribute('font-style',  cls !== 'ancestor' ? 'italic' : 'normal');
      txt.textContent = label;
      svg.appendChild(txt);
    }

    // ── Internal node: small label above the dot ─────────────
    if (!leaf && n.name) {
      const txt = document.createElementNS(NS, 'text');
      txt.setAttribute('x',           n._x);
      txt.setAttribute('y',           n._y - 9);
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('font-family', "'Nunito Sans',sans-serif");
      txt.setAttribute('font-size',   '9');
      txt.setAttribute('fill',        '#9ab8aa');
      txt.setAttribute('font-style',  'italic');
      txt.setAttribute('font-weight', '400');
      txt.textContent = n.name;
      svg.appendChild(txt);
    }

    n.children.forEach(drawNodes);
  }
  drawNodes(root);

  // ── Legend ────────────────────────────────────────────────────
  const legendItems = [
    ['#c0392b', true,  '#fde8e8', '† Extinct species'],
    ['#1a5c35', true,  '#d1fae5', '★ Selected candidate'],
    ['#5a9a70', false, '#ecfdf5', 'Other living relatives'],
    ['#b0cfc0', true,  '#e8f4e8', 'Ancestor / clade'],
  ];
  const lStartX = 10;
  legendItems.forEach(([stroke, filled, badge, lbl], i) => {
    const lx = lStartX + i * 180, ly = H - 16;
    // Mini pill
    const pr = document.createElementNS(NS, 'rect');
    pr.setAttribute('x', lx); pr.setAttribute('y', ly - 8);
    pr.setAttribute('width', '14'); pr.setAttribute('height', '14');
    pr.setAttribute('rx', '7');
    pr.setAttribute('fill', badge);
    pr.setAttribute('stroke', stroke); pr.setAttribute('stroke-width', '1.2');
    svg.appendChild(pr);
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', lx + 18); t.setAttribute('y', ly + 3);
    t.setAttribute('font-family', "'Nunito Sans',sans-serif");
    t.setAttribute('font-size', '9.5'); t.setAttribute('fill', '#7a9a82');
    t.textContent = lbl;
    svg.appendChild(t);
  });

  // ── Source ────────────────────────────────────────────────────
  const src = document.createElementNS(NS, 'text');
  src.setAttribute('x', W - 4); src.setAttribute('y', H - 4);
  src.setAttribute('text-anchor', 'end');
  src.setAttribute('font-family', "'Nunito Sans',sans-serif");
  src.setAttribute('font-size', '8.5'); src.setAttribute('fill', '#c0d8c8');
  src.textContent = 'Source: Open Tree of Life v3 · opentreeoflife.org';
  svg.appendChild(src);
}

// ── Offline fallback ──────────────────────────────────────────────
function showPhyloFallback(svg, NS, extinctSci, candidateSci, reason) {
  const W = 600, H = 80;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width',   '100%');
  svg.setAttribute('height',  H);
  svg.innerHTML = '';

  const badge = document.createElementNS(NS, 'text');
  badge.setAttribute('x', W / 2); badge.setAttribute('y', 28);
  badge.setAttribute('text-anchor', 'middle');
  badge.setAttribute('font-family', "'Nunito Sans',sans-serif");
  badge.setAttribute('font-size', '13'); badge.setAttribute('fill', '#c47c1a');
  badge.textContent = '⚠ Could not load phylogenetic tree (network unavailable)';
  svg.appendChild(badge);

  const sub = document.createElementNS(NS, 'text');
  sub.setAttribute('x', W / 2); sub.setAttribute('y', 48);
  sub.setAttribute('text-anchor', 'middle');
  sub.setAttribute('font-family', "'Nunito Sans',sans-serif");
  sub.setAttribute('font-size', '10'); sub.setAttribute('fill', '#b0cfc0');
  sub.textContent = `Taxa queried: "${extinctSci}" · "${candidateSci}"  —  ${reason}`;
  svg.appendChild(sub);
}

// ── Helpers ───────────────────────────────────────────────────────
// ── Trophic population dynamics chart ────────────────────────────
let trophicChartInstance = null;
function drawTrophicChart(extKey) {
  const d = trophicData[extKey];
  if (!d) return;

  if (trophicChartInstance) { trophicChartInstance.destroy(); trophicChartInstance = null; }

  // Build legend
  const legend = document.getElementById('trophic-legend');
  legend.innerHTML = [
    ['#639922', d.lowerLabel],
    ['#c0392b', d.targetLabel],
    ['#7777cc', d.upperLabel],
  ].map(([col, lbl]) =>
    `<span class="trophic-legend-item">
       <span class="trophic-legend-dot" style="background:${col}"></span>${lbl}
     </span>`
  ).join('');

  // Mark extinction event
  const extIdx = d.extIndex;

  // Vertical annotation via a dataset of a single point with huge radius? 
  // We'll use a custom annotation-free approach: shade via a dataset.
  trophicChartInstance = new Chart(document.getElementById('trophic-chart'), {
    type: 'line',
    data: {
      labels: d.timeLabels,
      datasets: [
        {
          label: d.lowerLabel,
          data: d.lower,
          borderColor: '#639922',
          backgroundColor: '#63992218',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
        {
          label: d.targetLabel,
          data: d.target,
          borderColor: '#c0392b',
          backgroundColor: '#c0392b18',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
        {
          label: d.upperLabel,
          data: d.upper,
          borderColor: '#7777cc',
          backgroundColor: '#7777cc12',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ctx.dataset.label + ': ' + ctx.parsed.y,
          }
        },
      },
      scales: {
        x: {
          ticks: { maxRotation: 45, font: { size: 9, family: "'Nunito Sans',sans-serif" }, maxTicksLimit: 7, color: '#7a9a82' },
          grid: { color: 'rgba(0,0,0,0.05)' },
        },
        y: {
          title: { display: true, text: 'Relative index', font: { size: 10, family: "'Nunito Sans',sans-serif" }, color: '#7a9a82' },
          min: 0, max: 105,
          ticks: { font: { size: 9, family: "'Nunito Sans',sans-serif" }, color: '#7a9a82', stepSize: 25 },
          grid: { color: 'rgba(0,0,0,0.05)' },
        }
      },
    },
    plugins: [{
      id: 'extinctionLine',
      afterDraw(chart) {
        const { ctx, chartArea, scales } = chart;
        if (!chartArea) return;
        const xScale = scales.x;
        const xPos = xScale.getPixelForValue(extIdx);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xPos, chartArea.top);
        ctx.lineTo(xPos, chartArea.bottom);
        ctx.strokeStyle = 'rgba(192,57,43,0.45)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = "bold 9px 'Nunito Sans',sans-serif";
        ctx.fillStyle = 'rgba(192,57,43,0.7)';
        ctx.textAlign = 'center';
        ctx.fillText('† Extinct', xPos, chartArea.top - 4);
        ctx.restore();
      }
    }]
  });

  const caption = document.getElementById('trophic-caption');
  caption.textContent = 'Relative population indices (modelled). Collapse of lower trophic levels precedes megafauna extinction by 200–400 years.';
}

// ── Species distribution chart ────────────────────────────────────
let distChartInstance = null;
let currentDistView   = 'historic';

function setDistView(view, btn) {
  currentDistView = view;
  document.querySelectorAll('.dist-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if (selectedExtinct) drawDistributionChart(selectedExtinct.key, view);
}

function drawDistributionChart(extKey, view) {
  const d = distributionData[extKey];
  if (!d) return;

  if (distChartInstance) { distChartInstance.destroy(); distChartInstance = null; }

  const historicColor = 'rgba(26,107,53,0.65)';
  const modernColor   = 'rgba(192,57,43,0.65)';
  const overlapColor  = 'rgba(196,124,26,0.75)';

  let datasets = [];
  let captionText = '';

  if (view === 'historic') {
    datasets = [{
      label: 'Historic occurrences',
      data: d.historic.map(([x, y, v]) => ({ x, y, r: Math.max(3, v / 14) })),
      backgroundColor: historicColor,
      borderColor: 'rgba(26,107,53,0.9)',
      borderWidth: 0.5,
    }];
    captionText = 'Historic occurrence records — broad pre-extinction distribution.';
  } else if (view === 'modern') {
    datasets = [{
      label: 'Modern suitable habitat',
      data: d.modern.map(([x, y, v]) => ({ x, y, r: Math.max(3, v / 14) })),
      backgroundColor: modernColor,
      borderColor: 'rgba(192,57,43,0.9)',
      borderWidth: 0.5,
    }];
    captionText = 'Modern habitat suitability — range contracted and fragmented since extinction.';
  } else {
    // Overlap: show both, colour-coded
    datasets = [
      {
        label: 'Historic only',
        data: d.historic.map(([x, y, v]) => ({ x, y, r: Math.max(2, v / 16) })),
        backgroundColor: 'rgba(26,107,53,0.35)',
        borderColor: 'rgba(26,107,53,0.5)',
        borderWidth: 0.5,
      },
      {
        label: 'Modern suitable',
        data: d.modern.map(([x, y, v]) => ({ x, y, r: Math.max(2, v / 16) })),
        backgroundColor: overlapColor,
        borderColor: 'rgba(196,124,26,0.9)',
        borderWidth: 0.5,
      },
    ];
    captionText = 'Overlap zone: only ~' + (extKey === 'mammoth' ? '28' : extKey === 'dodo' ? '40' : '35') + '% of historic habitat retains comparable conditions today.';
  }

  // Axis bounds
  const allX = [...d.historic, ...d.modern].map(p => p[0]);
  const allY = [...d.historic, ...d.modern].map(p => p[1]);
  const minX = Math.min(...allX), maxX = Math.max(...allX);
  const minY = Math.min(...allY), maxY = Math.max(...allY);
  const padX = (maxX - minX) * 0.12 || 1;
  const padY = (maxY - minY) * 0.18 || 1;

  distChartInstance = new Chart(document.getElementById('dist-chart'), {
    type: 'bubble',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: datasets.length > 1, position: 'top', labels: { font: { size: 10, family: "'Nunito Sans',sans-serif" }, color: '#7a9a82', boxWidth: 10, padding: 8 } },
        tooltip: {
          callbacks: {
            label: ctx => `${d.xLabel.split(' ')[0]}: ${ctx.parsed.x.toFixed(1)}° · ${d.yLabel.split(' ')[0]}: ${ctx.parsed.y.toFixed(1)}°`
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: d.xLabel, font: { size: 10, family: "'Nunito Sans',sans-serif" }, color: '#7a9a82' },
          min: minX - padX, max: maxX + padX,
          ticks: { font: { size: 9, family: "'Nunito Sans',sans-serif" }, color: '#7a9a82' },
          grid: { color: 'rgba(0,0,0,0.04)' },
        },
        y: {
          title: { display: true, text: d.yLabel, font: { size: 10, family: "'Nunito Sans',sans-serif" }, color: '#7a9a82' },
          min: minY - padY, max: maxY + padY,
          ticks: { font: { size: 9, family: "'Nunito Sans',sans-serif" }, color: '#7a9a82' },
          grid: { color: 'rgba(0,0,0,0.04)' },
        }
      }
    }
  });

  document.getElementById('dist-caption').textContent = captionText;
}

// ── Distribution info popup ───────────────────────────────────────
function openDistPopup() {
  document.getElementById('dist-popup-overlay').classList.add('open');
}

function closeDistPopup(e) {
  if (!e || e.target === document.getElementById('dist-popup-overlay') || e.currentTarget.classList.contains('dist-popup-close')) {
    document.getElementById('dist-popup-overlay').classList.remove('open');
  }
}

// ── Phylogenetic tree info popup ──────────────────────────────────
function openPhyloPopup() {
  document.getElementById('phylo-popup-overlay').classList.add('open');
}

function closePhyloPopup(e) {
  if (!e || e.target === document.getElementById('phylo-popup-overlay') || e.currentTarget.classList.contains('dist-popup-close')) {
    document.getElementById('phylo-popup-overlay').classList.remove('open');
  }
}

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