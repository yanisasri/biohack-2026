// =============================================================================
// data.js — Species data
// =============================================================================
// To add a new extinct species:
//   1. Add an object to `extinctSpecies`  (include sci name — used for phylo API)
//   2. Add its candidates to `candidateSpecies[key]`  (include sci name)
//   That's it. Phylogenetic trees are generated automatically via the
//   Open Tree of Life API using the scientific names you provide.
//
// Field reference:
//   Extinct species
//     tempMin / tempMax   : mean annual temperature range of historic habitat (°C)
//     biome               : habitat biome code (see BIOME_LABELS below)
//     dietType            : diet category code (see DIET_LABELS below)
//     timeSinceExt        : years since extinction (number)
//
//   Candidate species
//     sim                 : overall genomic similarity % from BLAST/ClustalW
//     tempMin / tempMax   : candidate's current temperature range (°C)
//     biome               : candidate's current biome code
//     dietType            : candidate's diet category
//     divergenceMya       : divergence time in millions of years (number)
//     invasivePredators   : true if invasive predators threaten the target habitat
//     habitatIntact       : 0–100, % of historic habitat still ecologically intact
//     preyAvailability    : 0–100, % availability of historic prey/food sources today
//     humanPressure       : 0–100, human land-use pressure in target range (higher = worse)
// =============================================================================

// ── Biome codes ───────────────────────────────────────────────────
const BIOME_LABELS = {
  tundra:       'Arctic tundra / steppe',
  boreal:       'Boreal forest / taiga',
  temperate:    'Temperate forest',
  tropical:     'Tropical / subtropical forest',
  savanna:      'Savanna / grassland',
  island:       'Tropical island forest',
  wetland:      'Freshwater wetland / stream',
  coastal:      'Coastal / marine',
  alpine:       'Alpine / montane',
};

// ── Diet codes ────────────────────────────────────────────────────
const DIET_LABELS = {
  grazer:       'Graminoid grazer',
  browser:      'Browser / mixed',
  frugivore:    'Frugivore / seed disperser',
  carnivore:    'Carnivore / apex predator',
  omnivore:     'Omnivore',
  insectivore:  'Insectivore',
  piscivore:    'Piscivore / filter feeder',
};

// ── Extinct species ───────────────────────────────────────────────
const extinctSpecies = [
  {
    key:          'mammoth',
    name:         'Woolly Mammoth',
    sci:          'Mammuthus primigenius',
    period:       'Pleistocene · ~3,900 BP',
    cause:        'Rapid climate warming & human overhunting',
    range:        'Siberia, N. Eurasia, N. America',
    role:         'Ecosystem engineer',
    icon:         '🦣',
    cardColor:    '#e8f4e8',
    cardAccent:   '#2d7a4a',
    heroColor:    '#1a5c35',
    desc:         'The iconic Ice Age giant. Adapted to frigid steppe with dense wool, curved foraging tusks, and cold-adapted haemoglobin.',
    // Measurable ecological parameters
    tempMin:      -15,
    tempMax:       0,
    biome:        'tundra',
    dietType:     'grazer',
    timeSinceExt: 3900,
  },
  {
    key:          'dodo',
    name:         'Dodo',
    sci:          'Raphus cucullatus',
    period:       'Holocene · ~1690 AD',
    cause:        'Hunting & introduced predators',
    range:        'Mauritius, Indian Ocean',
    role:         'Seed disperser',
    icon:         '🦤',
    cardColor:    '#fef3e2',
    cardAccent:   '#c47c1a',
    heroColor:    '#9a5c10',
    desc:         'Entirely flightless and fearless of humans — a trait that made it catastrophically easy to hunt. Closest living relative: the Nicobar Pigeon.',
    tempMin:      22,
    tempMax:      30,
    biome:        'island',
    dietType:     'frugivore',
    timeSinceExt: 343,
  },
  {
    key:          'nfwolf',
    name:         'Newfoundland Wolf',
    sci:          'Canis lupus ssp. labradorius',
    period:       'Holocene · ~1930s',
    cause:        'Human overhunting & prey depletion',
    range:        'Newfoundland & Labrador, N. Quebec',
    role:         'Apex predator',
    icon:         '🐺',
    cardColor:    '#eaf0fb',
    cardAccent:   '#2a4fa0',
    heroColor:    '#1c3a7a',
    desc:         'A subspecies of grey wolf adapted to island isolation. Key predator regulating caribou herds. Extirpated by ~1930 through persecution and prey collapse.',
    tempMin:      -10,
    tempMax:       8,
    biome:        'boreal',
    dietType:     'carnivore',
    timeSinceExt: 95,
  },
];

// ── Candidate species ─────────────────────────────────────────────
// breakdownScores: replace with your actual BLAST/ClustalW per-region values.
// All other fields should be sourced from IUCN, NatureServe, GBIF, ECCC, etc.

const candidateSpecies = {
  mammoth: [
    {
      name:              'Asian Elephant',
      sci:               'Elephas maximus',
      sim:               99.6,
      icon:              '🐘',
      status:            'Endangered',
      divergenceMya:     6,
      tempMin:           20,
      tempMax:           30,
      biome:             'tropical',
      dietType:          'browser',
      habitatIntact:     52,   // % of mammoth's historic tundra still intact (source: IUCN 2022)
      preyAvailability:  72,   // % of historic forage still present (source: Zimov 2005)
      humanPressure:     40,   // land-use pressure in target zone (source: GBIF)
      invasivePredators: false,
    },
    {
      name:              'African Savanna Elephant',
      sci:               'Loxodonta africana',
      sim:               99.5,
      icon:              '🐘',
      status:            'Endangered',
      divergenceMya:     7,
      tempMin:           20,
      tempMax:           35,
      biome:             'savanna',
      dietType:          'browser',
      habitatIntact:     52,
      preyAvailability:  45,
      humanPressure:     60,
      invasivePredators: false,
    },
  ],

  dodo: [
    {
      name:              'Nicobar Pigeon',
      sci:               'Caloenas nicobarica',
      sim:               95,
      icon:              '🕊',
      status:            'Near Threatened',
      divergenceMya:     25,
      tempMin:           22,
      tempMax:           33,
      biome:             'island',
      dietType:          'frugivore',
      habitatIntact:     65,   // coastal forest condition on Mauritius (source: IUCN Mauritius)
      preyAvailability:  70,   // native fruit tree recovery (source: NatureServe)
      humanPressure:     40,
      invasivePredators: true, // rats, cats, mongoose still present
    },
    {
      name:              'Victoria Crowned Pigeon',
      sci:               'Goura victoria',
      sim:               94,
      icon:              '🕊',
      status:            'Near Threatened',
      divergenceMya:     30,
      tempMin:           24,
      tempMax:           30,
      biome:             'tropical',
      dietType:          'frugivore',
      habitatIntact:     65,
      preyAvailability:  60,
      humanPressure:     50,
      invasivePredators: true,
    },
  ],

  nfwolf: [
    {
      name:              'Grey Wolf',
      sci:               'Canis lupus',
      sim:               99.9,
      icon:              '🐺',
      status:            'Least Concern',
      divergenceMya:     0.1,
      tempMin:           -15,
      tempMax:           10,
      biome:             'boreal',
      dietType:          'carnivore',
      habitatIntact:     80,   // NL boreal largely intact (source: NatureServe)
      preyAvailability:  78,   // caribou & moose recovering (source: ECCC 2022)
      humanPressure:     40,
      invasivePredators: false,
    },
    {
      name:              'Eastern Wolf',
      sci:               'Canis lycaon',
      sim:               99.7,
      icon:              '🐺',
      status:            'Threatened (Canada)',
      divergenceMya:     0.5,
      tempMin:           -5,
      tempMax:           15,
      biome:             'temperate',
      dietType:          'carnivore',
      habitatIntact:     68,
      preyAvailability:  75,
      humanPressure:     45,
      invasivePredators: false,
    },
  ],
};

// ── Verdict scenario display config ──────────────────────────────
// The verdict KEY is computed by scoring.js — this just maps key → display
const verdictScenarios = {
  impossible:   { text: 'NOT POSSIBLE',      sub: 'Genomic divergence too high for viable de-extinction',                             color: '#b91c1c' },
  'wild-reloc': { text: 'WILD — RELOCATE',   sub: 'De-extinction possible · extant species can be relocated to historic habitat',     color: '#166534' },
  'wild-gm':    { text: 'WILD — GMO NEEDED', sub: 'De-extinction possible · genetically modified extant species should be relocated', color: '#14532d' },
  captive:      { text: 'CAPTIVITY ONLY',    sub: 'De-extinction possible · revival should occur in a controlled environment',        color: '#92400e' },
  'no-attempt': { text: 'DO NOT ATTEMPT',    sub: 'De-extinction possible but ecological conditions make it inadvisable',             color: '#78350f' },
};