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

// ── Phylogenetic tree data ────────────────────────────────────────
// To add a new species: add an entry keyed by extinctSpecies[n].key.
// node types: 'extinct' | 'candidate' | 'ancestor'

const phyloTrees = {
  mammoth: {
    nodes: [
      { id: 'proboscidea',  label: 'Proboscidea',      x: 20,  y: 50,  type: 'ancestor'  },
      { id: 'elephantidae', label: 'Elephantidae',     x: 100, y: 50,  type: 'ancestor'  },
      { id: 'mammuthus',    label: 'Mammuthus',        x: 190, y: 25,  type: 'ancestor'  },
      { id: 'mammoth',      label: 'M. primigenius †', x: 310, y: 15,  type: 'extinct'   },
      { id: 'elephas',      label: 'Elephas',          x: 190, y: 55,  type: 'ancestor'  },
      { id: 'asian',        label: 'E. maximus',       x: 310, y: 45,  type: 'candidate' },
      { id: 'loxodonta',    label: 'Loxodonta',        x: 190, y: 85,  type: 'ancestor'  },
      { id: 'african',      label: 'L. africana',      x: 310, y: 80,  type: 'candidate' },
    ],
    edges: [
      ['proboscidea','elephantidae'],
      ['elephantidae','mammuthus'],['elephantidae','elephas'],['elephantidae','loxodonta'],
      ['mammuthus','mammoth'],['elephas','asian'],['loxodonta','african'],
    ],
  },
  dodo: {
    nodes: [
      { id: 'columbiformes', label: 'Columbiformes',   x: 20,  y: 50,  type: 'ancestor'  },
      { id: 'columbidae',    label: 'Columbidae',      x: 100, y: 50,  type: 'ancestor'  },
      { id: 'raphinae',      label: 'Raphinae',        x: 190, y: 22,  type: 'ancestor'  },
      { id: 'dodo',          label: 'R. cucullatus †', x: 310, y: 12,  type: 'extinct'   },
      { id: 'caloenadinae',  label: 'Caloenadinae',    x: 190, y: 55,  type: 'ancestor'  },
      { id: 'nicobar',       label: 'C. nicobarica',   x: 310, y: 50,  type: 'candidate' },
      { id: 'gouridae',      label: 'Gouridae',        x: 190, y: 82,  type: 'ancestor'  },
      { id: 'victoria',      label: 'G. victoria',     x: 310, y: 77,  type: 'candidate' },
    ],
    edges: [
      ['columbiformes','columbidae'],
      ['columbidae','raphinae'],['columbidae','caloenadinae'],['columbidae','gouridae'],
      ['raphinae','dodo'],['caloenadinae','nicobar'],['gouridae','victoria'],
    ],
  },
  nfwolf: {
    nodes: [
      { id: 'carnivora', label: 'Carnivora',           x: 20,  y: 50,  type: 'ancestor'  },
      { id: 'canidae',   label: 'Canidae',              x: 90,  y: 50,  type: 'ancestor'  },
      { id: 'canis',     label: 'Canis',                x: 170, y: 50,  type: 'ancestor'  },
      { id: 'clupus',    label: 'C. lupus',             x: 260, y: 35,  type: 'ancestor'  },
      { id: 'nfwolf',    label: 'C. l. labradorius †',  x: 380, y: 18,  type: 'extinct'   },
      { id: 'grey',      label: 'C. lupus',             x: 380, y: 35,  type: 'candidate' },
      { id: 'ewolf',     label: 'C. lycaon',            x: 380, y: 55,  type: 'candidate' },
    ],
    edges: [
      ['carnivora','canidae'],['canidae','canis'],['canis','clupus'],
      ['clupus','nfwolf'],['clupus','grey'],['clupus','ewolf'],
    ],
  },
};

// ── Genomic breakdown region labels ──────────────────────────────
// These match the keys in candidate.breakdownScores
const breakdownLabels = [
  'Coding sequences',
  'Mitochondrial DNA',
  'Regulatory regions',
  'Immune loci',
  'Morphology genes',
  'Non-coding DNA',
];

// ── Trophic population data ───────────────────────────────────────
// Per extinct species: timeline of relative population indices (0–100)
// for lower trophic (prey/vegetation), the species itself, and higher
// trophic (apex predators). Time points in years BP (before present).
const trophicData = {
  mammoth: {
    timeLabels: ['14,000 BP','13,000 BP','12,000 BP','11,000 BP','10,000 BP','9,000 BP','8,000 BP','7,000 BP','6,000 BP','5,000 BP','4,000 BP','3,900 BP','3,500 BP','Present'],
    lower:  [95, 90, 88, 80, 68, 60, 55, 52, 48, 42, 28, 10, 8, 5],
    target: [90, 85, 80, 72, 65, 58, 52, 48, 42, 36, 20,  0, 0, 0],
    upper:  [70, 68, 65, 60, 52, 44, 38, 32, 26, 18, 10,  0, 0, 0],
    extLabel: '3,900 BP',
    extIndex: 11,
    lowerLabel: 'Steppe vegetation',
    targetLabel: 'Woolly mammoth',
    upperLabel: 'Cave lion / hyena',
  },
  dodo: {
    timeLabels: ['1600','1620','1640','1660','1680','1690','1700','1720','Present'],
    lower:  [90, 88, 80, 70, 55, 30, 20, 15, 12],
    target: [95, 90, 75, 55, 35, 10,  0,  0,  0],
    upper:  [20, 22, 20, 12,  5,  2,  5,  6,  4],
    extLabel: '1690',
    extIndex: 5,
    lowerLabel: 'Native fruit trees',
    targetLabel: 'Dodo',
    upperLabel: 'Introduced predators',
  },
  nfwolf: {
    timeLabels: ['1850','1870','1890','1900','1910','1920','1930','1940','Present'],
    lower:  [90, 85, 78, 70, 60, 50, 35, 30, 55],
    target: [88, 80, 70, 60, 45, 28, 10,  0,  0],
    upper:  [30, 30, 28, 22, 15,  8,  3,  3,  5],
    extLabel: '~1930',
    extIndex: 6,
    lowerLabel: 'Caribou / moose',
    targetLabel: 'Newfoundland wolf',
    upperLabel: 'Human hunting pressure',
  },
};

// ── Species distribution data ─────────────────────────────────────
// Simplified occurrence grid: cells with historic and modern presence
// represented as [longitude_bin, latitude_bin, historic_density, modern_density]
// Values are illustrative (derived from GBIF / fossil pollen records).
const distributionData = {
  mammoth: {
    title: 'Mammoth steppe-tundra habitat',
    xLabel: 'Longitude (°E)',
    yLabel: 'Latitude (°N)',
    historic: [
      // [lon, lat, density 0-100]
      [30,68,70],[40,70,85],[50,72,90],[60,70,88],[70,68,80],[80,66,75],
      [90,65,82],[100,64,78],[110,63,72],[120,62,68],[130,61,60],[140,60,55],
      [150,62,50],[160,63,45],[170,64,40],[35,72,80],[45,74,88],[55,73,85],
      [65,71,82],[75,69,76],[85,67,70],[95,66,75],[105,65,68],[115,63,62],
    ],
    modern: [
      [50,72,30],[60,70,25],[70,68,20],[80,66,18],[90,65,22],[100,64,15],
      [110,63,12],[120,62,10],[130,61,8],[55,73,28],[65,71,20],[75,69,15],
      [45,74,25],[35,72,15],[40,70,18],
    ],
  },
  dodo: {
    title: 'Mauritius island forest habitat',
    xLabel: 'Longitude (°E)',
    yLabel: 'Latitude (°S)',
    historic: [
      [57.3,20.1,90],[57.4,20.2,85],[57.5,20.3,88],[57.6,20.4,80],[57.7,20.5,75],
      [57.3,20.4,82],[57.4,20.5,78],[57.5,20.6,70],[57.6,20.3,72],[57.7,20.2,68],
      [57.2,20.2,60],[57.8,20.4,65],[57.4,20.1,85],[57.6,20.6,70],[57.5,20.4,88],
    ],
    modern: [
      [57.3,20.1,20],[57.4,20.2,18],[57.5,20.3,25],[57.5,20.4,22],[57.4,20.5,15],
      [57.6,20.3,12],[57.7,20.2,10],[57.6,20.4,14],
    ],
  },
  nfwolf: {
    title: 'Newfoundland boreal habitat',
    xLabel: 'Longitude (°W)',
    yLabel: 'Latitude (°N)',
    historic: [
      [53,48,80],[54,48,85],[55,49,88],[56,49,82],[57,50,78],[58,50,75],
      [59,51,70],[60,51,68],[53,49,75],[54,50,80],[55,50,85],[56,51,78],
      [57,51,72],[58,52,68],[59,52,65],[54,49,82],[55,51,80],[56,50,75],
    ],
    modern: [
      [53,48,15],[54,48,20],[55,49,25],[56,49,18],[57,50,12],[55,50,22],
      [54,50,18],[56,51,15],[53,49,10],
    ],
  },
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
// ── Species illustration images ──────────────────────────────────
// Place your images in an "images/" folder next to index.html
// File names must match the keys below exactly.
const speciesImages = {
  mammoth:     'images/moolly.webp',
  dodo:        'images/dodo.jpg',
  nfwolf:      'images/newfoundland.jpeg',
  banffdace:   'images/banfflongnosedace.webp',
  labradorduck:'images/labradorduck.jpg',
  grizzly:     'images/grizzlybear.jpg',
};

// ── NEW EXTINCT SPECIES (added) ───────────────────────────────────

// Append to extinctSpecies array — must be done at runtime via push
// because the array is declared with const. We extend it here.
extinctSpecies.push(
  {
    key:          'banffdace',
    name:         'Banff Longnose Dace',
    sci:          'Rhinichthys cataractae smithi',
    period:       'Holocene · ~1986 AD',
    cause:        'Habitat destruction & thermal pollution',
    range:        'Cave & Basin Hot Springs, Banff, Alberta',
    role:         'Aquatic insectivore / nutrient cycler',
    icon:         '🐟',
    cardColor:    '#e3f0fb',
    cardAccent:   '#1a6fa0',
    heroColor:    '#124e74',
    desc:         'A tiny minnow endemic to a single warm spring in Banff National Park. Lost entirely when its thermal pool was closed to stop spread of invasive scuds. The most geographically restricted vertebrate in Canadian history.',
    tempMin:      10,
    tempMax:      22,
    biome:        'wetland',
    dietType:     'insectivore',
    timeSinceExt: 39,
  },
  {
    key:          'labradorduck',
    name:         'Labrador Duck',
    sci:          'Camptorhynchus labradorius',
    period:       'Holocene · ~1878 AD',
    cause:        'Overhunting & eiderdown collection',
    range:        'Eastern North America, Atlantic coast',
    role:         'Coastal filter feeder / benthos grazer',
    icon:         '🦆',
    cardColor:    '#f5eee8',
    cardAccent:   '#8b4513',
    heroColor:    '#6b3010',
    desc:         'A striking sea duck with specialised soft-edged bills adapted for filtering invertebrates from coastal shallows. Hunted into oblivion in the 19th century; the last confirmed sighting was 1878 off Long Island.',
    tempMin:      -5,
    tempMax:      15,
    biome:        'coastal',
    dietType:     'piscivore',
    timeSinceExt: 147,
  },
  {
    key:          'grizzly',
    name:         'Plains Grizzly Bear',
    sci:          'Ursus arctos horribilis',
    period:       'Holocene · ~1890s',
    cause:        'Hunting, habitat loss & prey collapse',
    range:        'Canadian prairies, Great Plains',
    role:         'Apex omnivore / seed disperser',
    icon:         '🐻',
    cardColor:    '#f7efe4',
    cardAccent:   '#8b5e2d',
    heroColor:    '#6b4220',
    desc:         'The prairie-adapted ecotype of the grizzly bear that once roamed the Canadian and American plains following bison herds. Extirpated by the 1880s–90s as bison collapsed and settler persecution intensified.',
    tempMin:      -5,
    tempMax:      20,
    biome:        'savanna',
    dietType:     'omnivore',
    timeSinceExt: 130,
  }
);

// ── New candidate species ─────────────────────────────────────────
candidateSpecies.banffdace = [
  {
    name:              'Longnose Dace',
    sci:               'Rhinichthys cataractae',
    sim:               98.5,
    icon:              '🐟',
    status:            'Least Concern',
    divergenceMya:     0.05,
    tempMin:           8,
    tempMax:           20,
    biome:             'wetland',
    dietType:          'insectivore',
    habitatIntact:     45,
    preyAvailability:  60,
    humanPressure:     55,
    invasivePredators: true,
  },
  {
    name:              'Speckled Dace',
    sci:               'Rhinichthys osculus',
    sim:               96.2,
    icon:              '🐟',
    status:            'Least Concern',
    divergenceMya:     0.5,
    tempMin:           10,
    tempMax:           24,
    biome:             'wetland',
    dietType:          'insectivore',
    habitatIntact:     45,
    preyAvailability:  55,
    humanPressure:     50,
    invasivePredators: true,
  },
];

candidateSpecies.labradorduck = [
  {
    name:              "Steller's Eider",
    sci:               'Polysticta stelleri',
    sim:               87.4,
    icon:              '🦆',
    status:            'Vulnerable',
    divergenceMya:     4.5,
    tempMin:           -10,
    tempMax:           10,
    biome:             'coastal',
    dietType:          'piscivore',
    habitatIntact:     55,
    preyAvailability:  62,
    humanPressure:     45,
    invasivePredators: false,
  },
  {
    name:              'Mallard',
    sci:               'Anas platyrhynchos',
    sim:               76.8,
    icon:              '🦆',
    status:            'Least Concern',
    divergenceMya:     12,
    tempMin:           -10,
    tempMax:           25,
    biome:             'wetland',
    dietType:          'omnivore',
    habitatIntact:     65,
    preyAvailability:  70,
    humanPressure:     60,
    invasivePredators: false,
  },
];

candidateSpecies.grizzly = [
  {
    name:              'Brown Bear',
    sci:               'Ursus arctos',
    sim:               99.7,
    icon:              '🐻',
    status:            'Least Concern',
    divergenceMya:     0.07,
    tempMin:           -10,
    tempMax:           22,
    biome:             'boreal',
    dietType:          'omnivore',
    habitatIntact:     38,
    preyAvailability:  35,
    humanPressure:     70,
    invasivePredators: false,
  },
];

// ── New phylo trees ───────────────────────────────────────────────
phyloTrees.banffdace = {
  nodes: [
    { id: 'cypriniformes', label: 'Cypriniformes',   x: 20,  y: 50,  type: 'ancestor'  },
    { id: 'leuciscidae',   label: 'Leuciscidae',     x: 100, y: 50,  type: 'ancestor'  },
    { id: 'rhinichthys',   label: 'Rhinichthys',     x: 190, y: 35,  type: 'ancestor'  },
    { id: 'banffdace',     label: 'R. smithi †',     x: 310, y: 20,  type: 'extinct'   },
    { id: 'lnose',         label: 'R. cataractae',   x: 310, y: 42,  type: 'candidate' },
    { id: 'speckled',      label: 'R. osculus',      x: 310, y: 62,  type: 'candidate' },
  ],
  edges: [
    ['cypriniformes','leuciscidae'],['leuciscidae','rhinichthys'],
    ['rhinichthys','banffdace'],['rhinichthys','lnose'],['rhinichthys','speckled'],
  ],
};

phyloTrees.labradorduck = {
  nodes: [
    { id: 'anseriformes', label: 'Anseriformes',     x: 20,  y: 50,  type: 'ancestor'  },
    { id: 'anatidae',     label: 'Anatidae',          x: 90,  y: 50,  type: 'ancestor'  },
    { id: 'camptorhynchus', label: 'Camptorhynchus', x: 180, y: 25,  type: 'ancestor'  },
    { id: 'lduck',        label: 'C. labradorius †', x: 310, y: 18,  type: 'extinct'   },
    { id: 'polysticta',   label: 'Polysticta',       x: 180, y: 55,  type: 'ancestor'  },
    { id: 'seider',       label: 'P. stelleri',      x: 310, y: 50,  type: 'candidate' },
    { id: 'anas',         label: 'Anas',             x: 180, y: 82,  type: 'ancestor'  },
    { id: 'mallard',      label: 'A. platyrhynchos', x: 310, y: 78,  type: 'candidate' },
  ],
  edges: [
    ['anseriformes','anatidae'],
    ['anatidae','camptorhynchus'],['anatidae','polysticta'],['anatidae','anas'],
    ['camptorhynchus','lduck'],['polysticta','seider'],['anas','mallard'],
  ],
};

phyloTrees.grizzly = {
  nodes: [
    { id: 'carnivora', label: 'Carnivora',            x: 20,  y: 50,  type: 'ancestor'  },
    { id: 'ursidae',   label: 'Ursidae',              x: 90,  y: 50,  type: 'ancestor'  },
    { id: 'ursus',     label: 'Ursus',                x: 170, y: 50,  type: 'ancestor'  },
    { id: 'uarctos',   label: 'U. arctos',            x: 260, y: 35,  type: 'ancestor'  },
    { id: 'pgrizzly',  label: 'U. a. horribilis †',   x: 380, y: 22,  type: 'extinct'   },
    { id: 'brownbear', label: 'U. arctos',            x: 380, y: 40,  type: 'candidate' },
  ],
  edges: [
    ['carnivora','ursidae'],['ursidae','ursus'],['ursus','uarctos'],
    ['uarctos','pgrizzly'],['uarctos','brownbear'],
  ],
};

// ── New trophic data ──────────────────────────────────────────────
trophicData.banffdace = {
  timeLabels: ['1960','1965','1970','1975','1980','1986','1990','2000','Present'],
  lower:  [85, 82, 75, 65, 50, 20, 15, 10, 8],
  target: [90, 88, 78, 60, 42, 5,  0,  0,  0],
  upper:  [10, 12, 14, 12, 10, 8,  5,  4,  3],
  extLabel: '1986',
  extIndex: 5,
  lowerLabel: 'Aquatic invertebrates',
  targetLabel: 'Banff longnose dace',
  upperLabel: 'Brook trout (invasive)',
};

trophicData.labradorduck = {
  timeLabels: ['1800','1820','1840','1850','1860','1870','1878','1900','Present'],
  lower:  [90, 88, 82, 75, 62, 50, 30, 25, 45],
  target: [88, 84, 75, 60, 42, 22, 5,  0,  0],
  upper:  [15, 18, 22, 28, 35, 40, 30, 20, 15],
  extLabel: '1878',
  extIndex: 6,
  lowerLabel: 'Coastal invertebrates',
  targetLabel: 'Labrador duck',
  upperLabel: 'Commercial hunting pressure',
};

trophicData.grizzly = {
  timeLabels: ['1800','1820','1840','1860','1870','1880','1890','1900','Present'],
  lower:  [95, 90, 82, 70, 55, 40, 22, 18, 30],
  target: [90, 85, 72, 58, 40, 25, 10, 0,  0],
  upper:  [25, 28, 30, 28, 22, 15, 8,  5,  8],
  extLabel: '~1890',
  extIndex: 6,
  lowerLabel: 'Bison / prairie vegetation',
  targetLabel: 'Plains grizzly',
  upperLabel: 'Human hunting pressure',
};

// ── New distribution data ─────────────────────────────────────────
distributionData.banffdace = {
  title: 'Banff hot spring habitat',
  xLabel: 'Longitude (°W)',
  yLabel: 'Latitude (°N)',
  historic: [
    [115.92,51.17,95],[115.93,51.18,90],[115.91,51.17,85],[115.92,51.16,88],
    [115.93,51.17,80],[115.90,51.18,75],[115.94,51.17,70],[115.92,51.19,72],
  ],
  modern: [
    [115.92,51.17,15],[115.93,51.18,12],[115.91,51.17,10],[115.92,51.16,8],
  ],
};

distributionData.labradorduck = {
  title: 'Atlantic coastal wintering habitat',
  xLabel: 'Longitude (°W)',
  yLabel: 'Latitude (°N)',
  historic: [
    [68,44,80],[70,43,85],[72,42,88],[74,41,82],[76,40,78],[78,39,70],
    [66,45,75],[72,44,80],[74,43,72],[76,42,68],[68,43,70],[70,42,75],
  ],
  modern: [
    [68,44,25],[70,43,30],[72,42,35],[74,41,28],[76,40,20],[72,44,22],
  ],
};

distributionData.grizzly = {
  title: 'Canadian Great Plains habitat',
  xLabel: 'Longitude (°W)',
  yLabel: 'Latitude (°N)',
  historic: [
    [110,50,85],[112,50,88],[114,51,82],[108,50,78],[106,49,75],[104,49,70],
    [110,51,80],[112,52,75],[114,52,72],[108,51,68],[106,50,65],[104,50,60],
    [110,49,80],[112,49,82],[108,52,70],[106,51,68],
  ],
  modern: [
    [114,52,20],[116,52,25],[118,53,18],[114,51,15],[116,51,12],[118,52,10],
  ],
};