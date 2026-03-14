// =============================================================================
// scoring.js — Decision logic & ecological scoring
// =============================================================================
// This file is the ONLY place that encodes your team's scientific reasoning.
// app.js calls these functions but knows nothing about the logic inside them.
//
// To change how verdicts are computed, edit this file only.
// To add a new species, you do NOT need to touch this file at all.
// =============================================================================

// ── Temperature overlap score (0–100) ────────────────────────────
// Measures how much the candidate's temperature range overlaps with the
// extinct species' range. Full overlap = 100. No overlap = 0.
// Why it matters: a candidate from a mismatched climate will struggle to
// survive or reproduce in the extinct species' restored habitat.
function scoreTempOverlap(extinct, candidate) {
  const overlapLow  = Math.max(extinct.tempMin, candidate.tempMin);
  const overlapHigh = Math.min(extinct.tempMax, candidate.tempMax);
  const overlap     = Math.max(0, overlapHigh - overlapLow);
  const extinctRange = extinct.tempMax - extinct.tempMin || 1;
  return Math.round((overlap / extinctRange) * 100);
}

// ── Biome match score (0–100) ─────────────────────────────────────
// Exact match = 100. Related biomes score partial credit.
// Why it matters: biome determines vegetation, prey, and microclimate
// conditions that the revived species must adapt to from day one.
function scoreBiomeMatch(extinct, candidate) {
  if (extinct.biome === candidate.biome) return 100;
  const related = {
    tundra:    ['boreal', 'alpine'],
    boreal:    ['tundra', 'temperate'],
    temperate: ['boreal', 'savanna'],
    tropical:  ['island', 'savanna'],
    island:    ['tropical', 'coastal'],
    savanna:   ['temperate', 'tropical'],
    alpine:    ['tundra', 'boreal'],
    wetland:   ['coastal'],
    coastal:   ['island', 'wetland'],
  };
  const rel = related[extinct.biome] || [];
  if (rel.includes(candidate.biome)) return 55;
  return 15;
}

// ── Diet match score (0–100) ──────────────────────────────────────
// Exact match = 100. Broadly compatible diets score partial credit.
// Why it matters: a candidate with a very different diet may not fill
// the extinct species' ecological niche, limiting de-extinction value.
function scoreDietMatch(extinct, candidate) {
  if (extinct.dietType === candidate.dietType) return 100;
  const compatible = {
    grazer:      ['browser', 'omnivore'],
    browser:     ['grazer', 'omnivore', 'frugivore'],
    frugivore:   ['browser', 'omnivore'],
    carnivore:   ['omnivore'],
    omnivore:    ['grazer', 'browser', 'frugivore', 'carnivore', 'insectivore'],
    insectivore: ['omnivore'],
    piscivore:   [],
  };
  const compat = compatible[extinct.dietType] || [];
  if (compat.includes(candidate.dietType)) return 60;
  return 10;
}

// ── Divergence score (0–100) ──────────────────────────────────────
// More recent divergence = higher score. Uses a logarithmic decay.
// Why it matters: the more recently two lineages split, the fewer
// genetic edits are needed to reconstruct the extinct phenotype.
function scoreDivergence(candidate) {
  const mya = candidate.divergenceMya || 1;
  // Log scale: 0.1 Mya → ~96, 1 Mya → ~80, 10 Mya → ~50, 50+ Mya → <20
  const score = Math.max(0, 100 - 20 * Math.log10(mya + 0.1) - 10);
  return Math.round(Math.min(100, score));
}

// ── Composite ecological score (0–100) ────────────────────────────
// Weighted average of all ecological factors.
// Returns an object with individual factor scores and a total.
// Why each factor is weighted the way it is:
//   tempOverlap    (25%) — climate mismatch is the most immediate barrier
//   biomeMatch     (20%) — determines whether habitat can support the species
//   habitatIntact  (20%) — even a good biome match fails if habitat is degraded
//   preyAvail      (15%) — food source availability drives population viability
//   humanPressure  (10%) — human conflict determines long-term survival odds
//   dietMatch      (10%) — functional role fit matters for ecosystem integration
function computeEcoScore(extinct, candidate) {
  const temp     = scoreTempOverlap(extinct, candidate);
  const biome    = scoreBiomeMatch(extinct, candidate);
  const diet     = scoreDietMatch(extinct, candidate);
  const diverg   = scoreDivergence(candidate);
  const habitat  = candidate.habitatIntact    ?? 50;
  const prey     = candidate.preyAvailability ?? 50;
  // Invert human pressure: high pressure = low score
  const human    = 100 - (candidate.humanPressure ?? 50);
  // Predator penalty: active invasive predators reduce score
  const predator = candidate.invasivePredators ? 25 : 85;

  const factors = {
    'Climate match':       { score: temp,    weight: 0.20 },
    'Biome match':         { score: biome,   weight: 0.15 },
    'Habitat intactness':  { score: habitat, weight: 0.20 },
    'Food availability':   { score: prey,    weight: 0.15 },
    'Human pressure':      { score: human,   weight: 0.10 },
    'Diet compatibility':  { score: diet,    weight: 0.10 },
    'Predator risk':       { score: predator,weight: 0.10 },
  };

  let total = 0;
  for (const f of Object.values(factors)) {
    total += f.score * f.weight;
  }

  return { factors, total: Math.round(total) };
}

// ── Label helper ──────────────────────────────────────────────────
function scoreLabel(score) {
  if (score >= 75) return 'Good';
  if (score >= 55) return 'Moderate';
  if (score >= 35) return 'Low';
  return 'Very Low';
}

// ── Verdict decision tree ─────────────────────────────────────────
// Returns one of the 5 verdict keys defined in verdictScenarios.
//
// Decision logic (your team defines this — this is a placeholder):
//   Step 1 — Genomic gate: sim below threshold → impossible
//   Step 2 — Invasive predators present → cannot go wild
//   Step 3 — Ecological composite score determines wild vs captive
//   Step 4 — Climate/biome match determines whether GMO is needed
//
// NOTE: this function is intentionally simple so your team can replace
// it with your own scored decision tree or flowchart logic.
function computeVerdict(extinct, candidate) {
  const sim   = candidate.sim;
  const eco   = computeEcoScore(extinct, candidate);
  const ecoTotal = eco.total;

  const climateScore = eco.factors['Climate match'].score;
  const biomeScore   = eco.factors['Biome match'].score;

  // Step 1: Genomic gate
  // Below 60% similarity → editing burden too high, not viable
  if (sim < 60) return 'impossible';

  // Step 2: Invasive predators → wild release is blocked
  if (candidate.invasivePredators) {
    if (ecoTotal >= 45) return 'captive';
    return 'no-attempt';
  }

  // Step 3: Ecological composite gates wild release
  if (ecoTotal >= 65) {
    // Strong ecological fit — check if GMO is needed
    // GMO needed if climate or biome is a significant mismatch
    if (climateScore >= 60 && biomeScore >= 60) return 'wild-reloc';
    return 'wild-gm';
  }

  if (ecoTotal >= 40) {
    // Partial ecological fit — captive revival only
    return 'captive';
  }

  // Poor ecological fit — possible but should not be attempted
  return 'no-attempt';
}