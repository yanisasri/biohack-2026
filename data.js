// =============================================================================
// BIOHACK 2026
// Team name: rex-the-devs

// data.js — Species data
// =============================================================================
// To add a new extinct species:
//   1. Add one object to `extinctSpecies`  (sci name is used for the phylo API)
//   2. Add its candidates to `candidateSpecies[key]`
//   3. Add its trophic timeline to `trophicData[key]`
//   4. Add its distribution grid to `distributionData[key]`
// 
//   Phylogenetic trees generate automatically from sci names via Open Tree of Life.
//
// All species data sourced from:
//   Genetic:    NCBI GenBank / RefSeq / published phylogenetic studies
//   Ecological: IUCN Red List / GBIF / peer-reviewed ecology literature
//   Feasibility: BioHack 2026 Genetic Comparisons Dataset (PDF)
// =============================================================================

// ── Biome codes ───────────────────────────────────────────────────
const BIOME_LABELS = {
  tundra:    'Arctic tundra / steppe',
  boreal:    'Boreal forest / taiga',
  temperate: 'Temperate forest',
  tropical:  'Tropical / subtropical forest',
  savanna:   'Savanna / grassland',
  island:    'Tropical island forest',
  wetland:   'Freshwater wetland / stream',
  coastal:   'Coastal / marine',
  alpine:    'Alpine / montane',
};

// ── Diet codes ────────────────────────────────────────────────────
const DIET_LABELS = {
  grazer:      'Graminoid grazer',
  browser:     'Browser / mixed',
  frugivore:   'Frugivore / seed disperser',
  carnivore:   'Carnivore / apex predator',
  omnivore:    'Omnivore',
  insectivore: 'Invertivore / insectivore',
  piscivore:   'Piscivore / filter feeder',
};

// =============================================================================
// EXTINCT SPECIES
// tempMin/tempMax represent the full annual temperature range of the
// species' historic habitat (source: PDF Table 3 ecological comparison data).
// =============================================================================
const extinctSpecies = [
  {
    key:          'mammoth',
    name:         'Woolly Mammoth',
    sci:          'Mammuthus primigenius',
    period:       '~4,000 years ago',
    cause:        'Climate warming & human overhunting',
    range:        'N. Siberia, Alaska, Canada, N. Europe',
    role:         'Ecosystem engineer',
    icon:         '🦣',
    cardColor:    '#e8f4e8',
    cardAccent:   '#2d7a4a',
    heroColor:    '#1a5c35',
    desc:         'The iconic Ice Age giant. Maintained tundra-steppe grasslands through grazing and nutrient cycling. Adapted to cold permafrost environments with dense wool and cold-adapted haemoglobin.',
    // PDF Table 3: winter −40 to −10°C, summer 0 to 15°C → full range −40 to 15
    tempMin:      -40,
    tempMax:       15,
    biome:        'tundra',
    dietType:     'grazer',
    timeSinceExt: 4000,
  },
  {
    key:          'dodo',
    name:         'Dodo',
    sci:          'Raphus cucullatus',
    period:       '~1681 AD',
    cause:        'Hunting & introduced predators',
    range:        'Mauritius, Indian Ocean',
    role:         'Seed disperser',
    icon:         '🦤',
    cardColor:    '#fef3e2',
    cardAccent:   '#c47c1a',
    heroColor:    '#9a5c10',
    desc:         'Entirely flightless and fearless of humans. Supported Mauritius forest regeneration as a seed disperser. Hunted to extinction within ~80 years of European contact.',
    // PDF Table 3: 23–30°C
    tempMin:      23,
    tempMax:      30,
    biome:        'island',
    dietType:     'frugivore',
    timeSinceExt: 345,
  },
  {
    key:          'nfwolf',
    name:         'Newfoundland Wolf',
    sci:          'Canis lupus labradorius',
    period:       '~1930s',
    cause:        'Human overhunting & prey depletion',
    range:        'Island of Newfoundland, Canada',
    role:         'Apex predator',
    icon:         '🐺',
    cardColor:    '#eaf0fb',
    cardAccent:   '#2a4fa0',
    heroColor:    '#1c3a7a',
    desc:         'Island-adapted grey wolf subspecies that regulated caribou and moose populations. Extirpated by ~1930 through human persecution and woodland caribou collapse.',
    // PDF Table 3: winter −15 to 0°C, summer 10 to 20°C → full range −15 to 20
    tempMin:      -15,
    tempMax:       20,
    biome:        'boreal',
    dietType:     'carnivore',
    timeSinceExt: 95,
  },
  {
    key:          'banffdace',
    name:         'Banff Longnose Dace',
    sci:          'Rhinichthys cataractae smithi',
    period:       '~1987 AD',
    cause:        'Thermal habitat loss & invasive species',
    range:        'Cave & Basin Hot Springs, Banff National Park, AB',
    role:         'Freshwater consumer / aquatic insect regulator',
    icon:         '🐟',
    cardColor:    '#e3f0fb',
    cardAccent:   '#1a6fa0',
    heroColor:    '#124e74',
    desc:         'Endemic to warm spring-fed streams in Banff National Park. Maintained aquatic insect populations. Lost when its unique thermal habitat was altered and invasive scuds outcompeted it.',
    // PDF Table 3: 18–27°C (warm spring environment)
    tempMin:      18,
    tempMax:      27,
    biome:        'wetland',
    dietType:     'insectivore',
    timeSinceExt: 38,
  },
  {
    key:          'labradorduck',
    name:         'Labrador Duck',
    sci:          'Camptorhynchus labradorius',
    period:       '~1878 AD',
    cause:        'Overhunting & coastal habitat loss',
    range:        'N. Atlantic coast, Labrador to New York',
    role:         'Coastal marine invertebrate predator',
    icon:         '🦆',
    cardColor:    '#f5eee8',
    cardAccent:   '#8b4513',
    heroColor:    '#6b3010',
    desc:         'Specialist sea duck of cold North Atlantic coastal waters. Filtered mollusks and crustaceans from shallow marine benthos. Last confirmed sighting 1878 off Long Island.',
    // PDF Table 3: 0–15°C (cold coastal marine climate)
    tempMin:       0,
    tempMax:      15,
    biome:        'coastal',
    dietType:     'piscivore',
    timeSinceExt: 147,
  },
  {
    key:          'grizzly',
    name:         'Grizzly Bear',
    sci:          'Ursus arctos horribilis',
    period:       'Regionally extinct ~1890s',
    cause:        'Hunting, habitat loss & prey collapse',
    range:        'Mountain forests, alpine meadows & river valleys, W. Canada',
    role:         'Omnivorous keystone species',
    icon:         '🐻',
    cardColor:    '#f7efe4',
    cardAccent:   '#8b5e2d',
    heroColor:    '#6b4220',
    desc:         'Omnivorous keystone species influencing multiple trophic levels across mountain forests, alpine meadows, and river valleys. Regionally extirpated through persecution and habitat loss.',
    // PDF Table 3: −30 to 20°C
    tempMin:      -30,
    tempMax:       20,
    biome:        'alpine',
    dietType:     'omnivore',
    timeSinceExt: 130,
  },
];

// =============================================================================
// CANDIDATE SPECIES
// sim, divergenceMya, geneModifications: PDF Table 2 (Genetic Comparison Dataset)
// tempMin/tempMax, biome, dietType: PDF Table 3 (Ecological Comparison Dataset)
// habitatIntact, preyAvailability, humanPressure: PDF Table 5 (Feasibility Assessment)
//   habitatIntact  0–100 : Moderate=50, High=75, Low=25 (source: PDF Table 5)
//   preyAvailability 0–100 : same scale
//   humanPressure  0–100 : higher = worse (High conflict=70, Moderate=50, Low=25)
// invasivePredators: PDF Table 3 / Table 5 ecological notes
// =============================================================================
const candidateSpecies = {

  // ── Woolly Mammoth ───────────────────────────────────────────────
  mammoth: [
    {
      name:              'Asian Elephant',
      sci:               'Elephas maximus',
      sim:               99.6,               // PDF Table 2
      icon:              '🐘',
      status:            'Endangered',
      divergenceMya:     6,                  // PDF Table 2: ~6 million years
      geneModifications: '50–60',            // PDF Table 2
      reintroMethod:     'CRISPR-Cas9 gene editing', // PDF Table 4
      // PDF Table 3: 18–35°C
      tempMin:           18,
      tempMax:           35,
      biome:             'tropical',
      dietType:          'browser',
      // PDF Table 5: habitat "Moderate", food web "Moderate", conflict "Moderate"
      habitatIntact:     50,
      preyAvailability:  50,
      humanPressure:     50,
      invasivePredators: false,
      feasibility:       'Moderate – controlled reserves recommended',
    },
    {
      name:              'African Elephant',
      sci:               'Loxodonta africana',
      sim:               99.5,               // PDF Table 2
      icon:              '🐘',
      status:            'Endangered',
      divergenceMya:     7,                  // PDF Table 2: ~7 million years
      geneModifications: '60–70',            // PDF Table 2
      reintroMethod:     'CRISPR-Cas9 gene editing',
      // PDF Table 3: 10–40°C (sub-Saharan savanna)
      tempMin:           10,
      tempMax:           40,
      biome:             'savanna',
      dietType:          'browser',
      // Greater climate/biome mismatch vs Asian elephant — lower scores
      habitatIntact:     40,
      preyAvailability:  45,
      humanPressure:     60,
      invasivePredators: false,
      feasibility:       'Low – major climate and biome mismatch',
    },
  ],

  // ── Dodo ─────────────────────────────────────────────────────────
  dodo: [
    {
      name:              'Nicobar Pigeon',
      sci:               'Caloenas nicobarica',
      sim:               95,                 // PDF Table 2
      icon:              '🕊',
      status:            'Near Threatened',
      divergenceMya:     25,                 // PDF Table 2: ~25 million years
      geneModifications: '200–300',          // PDF Table 2
      reintroMethod:     'Genome editing in avian embryos', // PDF Table 4
      // PDF Table 3: 24–31°C (coastal woodlands, small islands)
      tempMin:           24,
      tempMax:           31,
      biome:             'island',
      dietType:          'frugivore',
      // PDF Table 5: habitat "Moderate", food web "High", conflict "Low"
      habitatIntact:     50,
      preyAvailability:  75,
      humanPressure:     25,
      // Rats, cats, mongoose still present on Mauritius (PDF Table 3 notes)
      invasivePredators: true,
      feasibility:       'Moderate to High – possible on protected islands',
    },
    {
      name:              'New Zealand Pigeon',
      sci:               'Hemiphaga novaeseelandiae',
      sim:               93.5,              // PDF Table 2: 93–94% — midpoint
      icon:              '🕊',
      status:            'Least Concern',
      divergenceMya:     30,               // PDF Table 2: ~30 million years
      geneModifications: '250–350',        // PDF Table 2
      reintroMethod:     'Genome editing in avian embryos',
      // PDF Table 3: winter 0–10°C, summer 15–25°C → full range 0–25°C
      tempMin:           0,
      tempMax:           25,
      biome:             'temperate',
      dietType:          'frugivore',
      // Temperate NZ vs tropical Mauritius — greater mismatch
      habitatIntact:     40,
      preyAvailability:  60,
      humanPressure:     30,
      // Predators largely cleared on NZ offshore islands
      invasivePredators: false,
      feasibility:       'Low to Moderate – significant climate mismatch',
    },
  ],

  // ── Newfoundland Wolf ─────────────────────────────────────────────
  nfwolf: [
    {
      name:              'Grey Wolf',
      sci:               'Canis lupus',
      sim:               99.9,              // PDF Table 2
      icon:              '🐺',
      status:            'Least Concern',
      divergenceMya:     0.1,              // PDF Table 2: ~0.1 million years
      geneModifications: '5–10',           // PDF Table 2
      reintroMethod:     'Selective breeding + minimal CRISPR', // PDF Table 4
      // PDF Table 3: −40 to 40°C (very wide range, forests/tundra/grasslands)
      tempMin:           -40,
      tempMax:            40,
      biome:             'boreal',
      dietType:          'carnivore',
      // PDF Table 5: habitat "High", food web "High", conflict "High"
      habitatIntact:     75,
      preyAvailability:  75,
      humanPressure:     70,
      invasivePredators: false,
      feasibility:       'High – requires strong wildlife management',
    },
    {
      name:              'Greenland Wolf',
      sci:               'Canis lupus orion',
      sim:               99.8,             // PDF Table 2
      icon:              '🐺',
      status:            'Endangered (Greenland)',
      divergenceMya:     0.15,            // PDF Table 2: ~0.15 million years
      geneModifications: '8–15',          // PDF Table 2
      reintroMethod:     'Selective breeding + minimal CRISPR',
      // PDF Table 3: winter −50 to −10°C, summer −5 to 10°C → full range −50 to 10
      tempMin:           -50,
      tempMax:            10,
      biome:             'tundra',
      dietType:          'carnivore',
      // Arctic-adapted; boreal Newfoundland is warmer — partial fit
      habitatIntact:     60,
      preyAvailability:  65,
      humanPressure:     40,
      invasivePredators: false,
      feasibility:       'Moderate – arctic adaptation requires acclimatisation to boreal',
    },
  ],

  // ── Banff Longnose Dace ───────────────────────────────────────────
  banffdace: [
    {
      name:              'Longnose Dace',
      sci:               'Rhinichthys cataractae',
      sim:               99.7,             // PDF Table 2
      icon:              '🐟',
      status:            'Least Concern',
      divergenceMya:     0.05,            // PDF Table 2: ~0.05 million years
      geneModifications: '5–12',          // PDF Table 2
      reintroMethod:     'Selective breeding / population restoration', // PDF Table 4
      // PDF Table 3: 5–20°C (cool, fast-flowing streams)
      tempMin:           5,
      tempMax:           20,
      biome:             'wetland',
      dietType:          'insectivore',
      // PDF Table 5: habitat "Low", food web "Moderate", conflict "Low"
      habitatIntact:     25,
      preyAvailability:  50,
      humanPressure:     25,
      invasivePredators: false,
      feasibility:       'Low – habitat restoration required first',
    },
    {
      name:              'Umpqua Dace',
      sci:               'Rhinichthys evermanni',
      sim:               98.5,             // PDF Table 2
      icon:              '🐟',
      status:            'Least Concern',
      divergenceMya:     1.5,             // PDF Table 2: ~1–2 Mya — midpoint
      geneModifications: '15–30',         // PDF Table 2
      reintroMethod:     'Selective breeding / population restoration',
      // PDF Table 3: 8–20°C (clear freshwater streams, rocky substrate)
      tempMin:           8,
      tempMax:           20,
      biome:             'wetland',
      dietType:          'insectivore',
      habitatIntact:     25,
      preyAvailability:  45,
      humanPressure:     25,
      invasivePredators: false,
      feasibility:       'Low – temperature mismatch with warm spring habitat',
    },
    {
      name:              'Speckled Dace',
      sci:               'Rhinichthys osculus',
      sim:               98.2,             // PDF Table 2
      icon:              '🐟',
      status:            'Least Concern',
      divergenceMya:     2.5,             // PDF Table 2: ~2–3 Mya — midpoint
      geneModifications: '20–40',         // PDF Table 2
      reintroMethod:     'Selective breeding / population restoration',
      // PDF Table 3: 5–22°C (streams, rivers, desert spring systems)
      tempMin:           5,
      tempMax:           22,
      biome:             'wetland',
      dietType:          'insectivore',
      habitatIntact:     25,
      preyAvailability:  40,
      humanPressure:     25,
      invasivePredators: false,
      feasibility:       'Low – broad thermal range but mismatch with warm spring',
    },
  ],

  // ── Labrador Duck ─────────────────────────────────────────────────
  labradorduck: [
    {
      name:              "Steller's Eider",
      sci:               'Polysticta stelleri',
      sim:               92.5,             // PDF Table 2: 92–93% — midpoint
      icon:              '🦆',
      status:            'Vulnerable',
      divergenceMya:     35,              // PDF Table 2: ~35 million years
      geneModifications: '300–400',       // PDF Table 2
      reintroMethod:     'Genome reconstruction (high difficulty)', // PDF Table 4
      // PDF Table 3: −10 to 10°C (arctic/sub-arctic coastal tundra)
      tempMin:           -10,
      tempMax:            10,
      biome:             'coastal',
      dietType:          'piscivore',
      // PDF Table 5: habitat "Low", food web "Low to Moderate", conflict "Low"
      habitatIntact:     25,
      preyAvailability:  37,
      humanPressure:     25,
      invasivePredators: false,
      feasibility:       'Very Low – not recommended',
    },
    {
      name:              'Mallard Duck',
      sci:               'Anas platyrhynchos',
      sim:               90.5,            // PDF Table 2: 90–91% — midpoint
      icon:              '🦆',
      status:            'Least Concern',
      divergenceMya:     40,             // PDF Table 2: ~40 million years
      geneModifications: '350–450',      // PDF Table 2
      reintroMethod:     'Genome reconstruction (very high difficulty)',
      // PDF Table 3: −20 to 30°C (freshwater wetlands)
      tempMin:           -20,
      tempMax:            30,
      biome:             'wetland',
      dietType:          'omnivore',
      // Freshwater wetland vs cold marine coastal — major ecological mismatch
      habitatIntact:     25,
      preyAvailability:  25,
      humanPressure:     40,
      invasivePredators: false,
      feasibility:       'Very Low – major dietary and habitat divergence from marine',
    },
  ],

  // ── Grizzly Bear ─────────────────────────────────────────────────
  grizzly: [
    {
      name:              'Brown Bear',
      sci:               'Ursus arctos',
      sim:               99.8,            // PDF Table 2
      icon:              '🐻',
      status:            'Least Concern',
      divergenceMya:     0.15,           // PDF Table 2: ~0.1–0.2 Mya — midpoint
      geneModifications: '5–15',         // PDF Table 2
      reintroMethod:     'Reintroduction / minimal genetic modification', // PDF Table 4
      // PDF Table 3: −40 to 30°C (forests, mountains, tundra, coastal)
      tempMin:           -40,
      tempMax:            30,
      biome:             'alpine',
      dietType:          'omnivore',
      // PDF Table 5: habitat "High", food web "High", conflict "High"
      habitatIntact:     75,
      preyAvailability:  75,
      humanPressure:     70,
      invasivePredators: false,
      feasibility:       'High – feasible via reintroduction programs',
    },
  ],
};

// =============================================================================
// TROPHIC POPULATION DYNAMICS
// Relative population indices (0–100) for three trophic levels over time.
//   lower  : prey / vegetation / food source for the extinct species
//   target : the extinct species itself
//   upper  : predators or pressures acting on the extinct species
//
// Data modelled from fossil records, museum specimens, historical surveys,
// and ecology literature (sources cited per species below).
// =============================================================================
const trophicData = {

  // Sources: GBIF fossil pollen, paleontological surveys, Zimov 2005 (Pleistocene Park)
  mammoth: {
    timeLabels: ['14,000 BP','13,000 BP','12,000 BP','11,000 BP','10,000 BP',
                 '9,000 BP','8,000 BP','7,000 BP','6,000 BP','5,000 BP',
                 '4,000 BP','3,900 BP','3,500 BP','Present'],
    lower:  [95, 90, 88, 80, 68, 60, 55, 52, 48, 42, 28, 10,  8,  5],
    target: [90, 85, 80, 72, 65, 58, 52, 48, 42, 36, 20,  0,  0,  0],
    upper:  [70, 68, 65, 60, 52, 44, 38, 32, 26, 18, 10,  0,  0,  0],
    extLabel:    '3,900 BP',
    extIndex:    11,
    lowerLabel:  'Steppe-tundra vegetation',
    targetLabel: 'Woolly Mammoth',
    upperLabel:  'Cave lion / hyena / human hunters',
  },

  // Sources: Roberts & Solow 2003, GBIF Mauritius records, museum specimens
  dodo: {
    timeLabels: ['1600','1610','1620','1630','1640','1650','1660','1670','1680','1690','1700','1720','Present'],
    lower:  [90, 90, 88, 85, 80, 72, 65, 55, 42, 28, 20, 15, 12],
    target: [95, 94, 92, 85, 75, 60, 48, 35, 22,  5,  0,  0,  0],
    upper:  [ 5,  8, 12, 18, 22, 28, 30, 25, 15,  8, 12, 14,  8],
    extLabel:    '~1681',
    extIndex:    9,
    lowerLabel:  'Native Mauritian fruit trees',
    targetLabel: 'Dodo',
    upperLabel:  'Introduced predators (rats, pigs, cats)',
  },

  // Sources: Parks Canada historical records, Newfoundland caribou population surveys
  nfwolf: {
    timeLabels: ['1850','1860','1870','1880','1890','1900','1910','1920','1930','1940','Present'],
    lower:  [90, 88, 85, 80, 72, 65, 58, 50, 38, 35, 58],
    target: [88, 85, 80, 72, 62, 52, 40, 25,  5,  0,  0],
    upper:  [20, 22, 25, 28, 30, 25, 20, 15,  8,  5,  6],
    extLabel:    '~1930',
    extIndex:    8,
    lowerLabel:  'Caribou / moose (Newfoundland)',
    targetLabel: 'Newfoundland Wolf',
    upperLabel:  'Human hunting pressure',
  },

  // Sources: Parks Canada Cave & Basin records, COSEWIC 1987 assessment
  banffdace: {
    timeLabels: ['1960','1965','1970','1975','1980','1983','1987','1990','2000','Present'],
    lower:  [85, 82, 75, 65, 50, 32, 18, 12, 10,  8],
    target: [90, 88, 78, 60, 42, 20,  5,  0,  0,  0],
    upper:  [10, 12, 14, 12, 10,  8,  6,  8,  6,  4],
    extLabel:    '1987',
    extIndex:    6,
    lowerLabel:  'Aquatic invertebrates (Cave & Basin)',
    targetLabel: 'Banff Longnose Dace',
    upperLabel:  'Invasive brook trout / scuds',
  },

  // Sources: Chilton 1997, COSEWIC historical records, museum specimen data
  labradorduck: {
    timeLabels: ['1800','1820','1840','1850','1860','1865','1870','1875','1878','1900','Present'],
    lower:  [90, 88, 82, 78, 68, 60, 52, 42, 30, 28, 48],
    target: [88, 85, 76, 65, 50, 38, 24, 12,  5,  0,  0],
    upper:  [10, 14, 18, 22, 28, 35, 38, 35, 28, 18, 12],
    extLabel:    '1878',
    extIndex:    8,
    lowerLabel:  'Coastal mollusks & crustaceans',
    targetLabel: 'Labrador Duck',
    upperLabel:  'Commercial hunting pressure',
  },

  // Sources: Mowat 1998, COSEWIC historical surveys, bison population collapse records
  grizzly: {
    timeLabels: ['1800','1820','1840','1860','1870','1880','1890','1900','Present'],
    lower:  [95, 92, 85, 72, 58, 42, 25, 20, 32],
    target: [90, 88, 78, 62, 48, 30, 10,  0,  0],
    upper:  [20, 22, 25, 24, 22, 18, 10,  6,  8],
    extLabel:    '~1890',
    extIndex:    6,
    lowerLabel:  'Bison / prairie vegetation',
    targetLabel: 'Grizzly Bear',
    upperLabel:  'Human hunting & settlement pressure',
  },
};

// =============================================================================
// SPECIES DISTRIBUTION DATA
// Occurrence grid: [longitude, latitude, density (0–100)]
//   historic : pre-extinction occurrence from fossil pollen, museum specimens, GBIF
//   modern   : ecologically comparable surviving habitat (GBIF SDM, IUCN range maps)
// =============================================================================
const distributionData = {

  // Sources: GBIF fossil pollen, Zimov Pleistocene Park, IUCN tundra range maps
  mammoth: {
    title:  'Mammoth steppe-tundra habitat',
    xLabel: 'Longitude (°E)',
    yLabel: 'Latitude (°N)',
    historic: [
      [30,68,70],[40,70,85],[50,72,90],[60,70,88],[70,68,80],[80,66,75],
      [90,65,82],[100,64,78],[110,63,72],[120,62,68],[130,61,60],[140,60,55],
      [150,62,50],[160,63,45],[170,64,40],[35,72,80],[45,74,88],[55,73,85],
      [65,71,82],[75,69,76],[85,67,70],[95,66,75],[105,65,68],[115,63,62],
      [-140,68,65],[-150,67,60],[-160,66,55],[-145,69,70],[-155,68,62],
    ],
    modern: [
      [50,72,30],[60,70,25],[70,68,20],[80,66,18],[90,65,22],[100,64,15],
      [110,63,12],[120,62,10],[130,61,8],[55,73,28],[65,71,20],[75,69,15],
      [45,74,25],[35,72,15],[40,70,18],
    ],
  },

  // Sources: GBIF Mauritius occurrence records, IUCN Mauritius forest assessment
  dodo: {
    title:  'Mauritius island forest habitat',
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

  // Sources: Parks Canada range maps, ECCC boreal forest assessment, GBIF wolf records
  nfwolf: {
    title:  'Newfoundland boreal forest habitat',
    xLabel: 'Longitude (°W)',
    yLabel: 'Latitude (°N)',
    historic: [
      [53,48,80],[54,48,85],[55,49,88],[56,49,82],[57,50,78],[58,50,75],
      [59,51,70],[60,51,68],[53,49,75],[54,50,80],[55,50,85],[56,51,78],
      [57,51,72],[58,52,68],[59,52,65],[54,49,82],[55,51,80],[56,50,75],
    ],
    modern: [
      [53,48,18],[54,48,22],[55,49,28],[56,49,20],[57,50,15],[55,50,24],
      [54,50,20],[56,51,18],[53,49,12],[57,51,14],[58,50,10],
    ],
  },

  // Sources: Parks Canada Cave & Basin surveys, COSEWIC 1987, GBIF freshwater data
  banffdace: {
    title:  'Banff hot spring habitat (Cave & Basin)',
    xLabel: 'Longitude (°W)',
    yLabel: 'Latitude (°N)',
    historic: [
      [115.92,51.17,95],[115.93,51.18,90],[115.91,51.17,85],[115.92,51.16,88],
      [115.93,51.17,80],[115.90,51.18,75],[115.94,51.17,70],[115.92,51.19,72],
    ],
    modern: [
      [115.92,51.17,12],[115.93,51.18,10],[115.91,51.17,8],[115.92,51.16,6],
    ],
  },

  // Sources: Chilton 1997, GBIF museum specimens, IUCN coastal habitat range maps
  labradorduck: {
    title:  'North Atlantic coastal wintering habitat',
    xLabel: 'Longitude (°W)',
    yLabel: 'Latitude (°N)',
    historic: [
      [68,44,80],[70,43,85],[72,42,88],[74,41,82],[76,40,78],[78,39,70],
      [66,45,75],[72,44,80],[74,43,72],[76,42,68],[68,43,70],[70,42,75],
    ],
    modern: [
      [68,44,25],[70,43,30],[72,42,35],[74,41,28],[76,40,20],[72,44,22],
    ],
  },

  // Sources: GBIF historical grizzly records, ECCC prairie habitat assessment, Mowat 1998
  grizzly: {
    title:  'Canadian Rocky Mountain & Great Plains habitat',
    xLabel: 'Longitude (°W)',
    yLabel: 'Latitude (°N)',
    historic: [
      [110,50,85],[112,50,88],[114,51,82],[108,50,78],[106,49,75],[104,49,70],
      [110,51,80],[112,52,75],[114,52,72],[108,51,68],[106,50,65],[104,50,60],
      [110,49,80],[112,49,82],[108,52,70],[106,51,68],
    ],
    modern: [
      [114,52,22],[116,52,28],[118,53,20],[114,51,18],[116,51,15],[118,52,12],
      [120,53,18],[120,52,15],
    ],
  },
};

// =============================================================================
// VERDICT SCENARIO DISPLAY CONFIG
// Keys are computed by scoring.js — this just maps key → display text + colour
// =============================================================================
const verdictScenarios = {
  impossible:   { text: 'NOT POSSIBLE',      sub: 'Genomic divergence too high for viable de-extinction',                             color: '#b91c1c' },
  'wild-reloc': { text: 'WILD — RELOCATE',   sub: 'De-extinction possible · extant species can be relocated to historic habitat',     color: '#166534' },
  'wild-gm':    { text: 'WILD — GMO NEEDED', sub: 'De-extinction possible · genetically modified extant species should be relocated', color: '#14532d' },
  captive:      { text: 'CAPTIVITY ONLY',    sub: 'De-extinction possible · revival should occur in a controlled environment',        color: '#92400e' },
  'no-attempt': { text: 'DO NOT ATTEMPT',    sub: 'De-extinction possible but ecological conditions make it inadvisable',             color: '#78350f' },
};

// =============================================================================
// SPECIES ILLUSTRATION IMAGES
// Place images in an "images/" folder next to index.html.
// =============================================================================
const speciesImages = {
  mammoth:      'images/moolly.webp',
  dodo:         'images/dodo.jpg',
  nfwolf:       'images/newfoundland.jpeg',
  banffdace:    'images/banfflongnosedace.webp',
  labradorduck: 'images/labradorduck.jpg',
  grizzly:      'images/grizzlybear.jpg',
};