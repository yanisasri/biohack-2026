// ── Extinct species ───────────────────────────────────────────────
const extinctSpecies = [
  {
    key:        'mammoth',
    name:       'Woolly Mammoth',
    sci:        'Mammuthus primigenius',
    period:     'Pleistocene · ~3,900 BP', 
    cause:      'Rapid climate warming & human overhunting',
    habitat:    'Sub‑Arctic tundra/steppe',
    range:      'Siberia, N. Eurasia, N. America',
    diet:       'Graminoid grazers',
    role:       'Ecosystem engineer',
    temp:       '-5 °C',
    icon:       '🦣',
    cardColor:  '#e8f4e8',
    cardAccent: '#2d7a4a',
    heroColor:  '#1a5c35',
    heroLight:  '#e8f4e8',
    desc:       'The iconic Ice Age giant. Adapted to frigid steppe with dense wool, curved foraging tusks, and cold-adapted haemoglobin.',
  },
  {
    key:        'dodo',
    name:       'Dodo',
    sci:        'Raphus cucullatus',
    period:     'Holocene · ~1690 AD',
    cause:      'Hunting & introduced predators',
    habitat:    'Tropical coastal forest',
    range:      'Mauritius, Indian Ocean',
    diet:       'Fruit, seeds',
    role:       'Seed dispenser',
    temp:       '22 - 30 °C',
    icon:       '🦤',
    cardColor:  '#fef3e2',
    cardAccent: '#c47c1a',
    heroColor:  '#9a5c10',
    heroLight:  '#fef3e2',
    desc:       'Entirely flightless and fearless of humans, a trait that made it catastrophically easy to hunt.',
  },
  {
    key:        'nfwolf',
    name:       'Newfoundland Wolf',
    sci:        'Canis lupus subspecies C.l. labradorius',
    period:     'Holocene · ~1930s',
    cause:      'Human overhunting & prey depletion',
    habitat:    'Boreal forest, tundra edge',
    range:      'Newfoundland & Labrador, & northern Quebec, Canada',
    diet:       'Caribou, small mammals',
    role:       'Apex predator',
    temp:       '-2 °C',
    icon:       '🐺',
    cardColor:  '#eaf0fb',
    cardAccent: '#2a4fa0',
    heroColor:  '#1c3a7a',
    heroLight:  '#eaf0fb',
    desc:       'A subspecies of grey wolf adapted to island isolation. Key predator regulating caribou herds on Newfoundland. Extirpated by ~1930 through human persecution and prey collapse.',
  },
];

// ── Candidate species ─────────────────────────────────────────────
const candidateSpecies = {
  mammoth: [
    { name: 'Asian Elephant',           sci: 'Elephas maximus',           sim: 99.6, icon: '🐘', status: 'Endangered',      temp: '25 °C',    diet: 'Mixed grazer / browser',   habitat: 'Tropical / subtropical forest',   divergence: '~6 million years' },
    { name: 'African Savanna Elephant', sci: 'Loxodonta africana',        sim: 99.5, icon: '🐘', status: 'Endangered',      temp: '28 °C',    diet: 'Mixed grazer / browser',   habitat: 'Savanna / grassland',   divergence: '~7 million years' }
  ],
  dodo: [
    { name: 'Nicobar Pigeon',          sci: 'Caloenas nicobarica',  sim: 95, icon: '🕊', status: 'Near Threatened', temp: '22 - 33 °C',    diet: 'Fruit, seeds' ,    habitat: 'Coastal woodlands, islands',   divergence: '~25 million years' },
    { name: 'Victoria Crowned Pigeon', sci: 'Goura victoria',       sim: 94, icon: '🕊', status: 'Vulnerable',      temp: '10 - 30 °C',    diet: 'Grains, seeds' ,   habitat: 'Urban / cliffs',   divergence: '~30 million years' }
  ],
  nfwolf: [
    { name: 'Grey Wolf',         sci: 'Canis lupus',    sim: 99.9, icon: '🐺', status: 'Least Concern',       temp: '-10 - 10 °C',    diet: 'Ungulates, caribou',   habitat: 'Boreal forest & alpine',   divergence: '~0.1 million years' },
    { name: 'Eastern Wolf',      sci: 'Canis lycaon',   sim: 99.7, icon: '🐺', status: 'Threatened (Canada)', temp: '0 - 15 °C',      diet: 'Deer, moose',      habitat: 'Mixed forest / Great Lakes region',   divergence: '~0.5 million years' }
  ],
};




// TEST DATA



// ── Ecological factors per candidate ─────────────────────────────
const ecoFactors = {
  mammoth: {
    'Asian Elephant':           { climate: { score: 38, label: 'Low',      note: '+2°C avg since extinction; tundra-steppe shrinking' }, habitat: { score: 52, label: 'Partial', note: 'Siberian tundra degraded 34%; permafrost thawing' }, foodChain: { score: 72, label: 'Good',    note: 'Steppe grasses still present; woolly plants reduced' }, predatorRisk: { score: 85, label: 'Low',      note: 'No large predators in target reintroduction zones' }, humanConflict: { score: 40, label: 'Moderate', note: 'Overlap with northern communities & resource extraction' } },
    'African Savanna Elephant': { climate: { score: 20, label: 'Very Low', note: 'Tropical origin — extreme mismatch with tundra' },     habitat: { score: 18, label: 'Very Low', note: 'No overlap with historic mammoth range' },           foodChain: { score: 45, label: 'Partial', note: 'Different food sources; dietary modification needed' }, predatorRisk: { score: 80, label: 'Low',      note: 'Minimal apex predators in target habitat' },          humanConflict: { score: 30, label: 'High',     note: 'Relocation from Africa adds logistical complexity' } },
    'Sumatran Elephant':        { climate: { score: 35, label: 'Low',      note: 'Tropical forest origin — adaptation required' },       habitat: { score: 30, label: 'Low',      note: 'Tropical forest vs arctic steppe — major mismatch' },  foodChain: { score: 50, label: 'Partial', note: 'Some dietary overlap possible with modification' },    predatorRisk: { score: 82, label: 'Low',      note: 'No major predators in tundra zones' },                humanConflict: { score: 35, label: 'High',     note: 'Conservation status of source population limits use' } },
  },
  dodo: {
    'Nicobar Pigeon':       { climate: { score: 80, label: 'Good',    note: 'Mauritius climate largely preserved since 1681' },     habitat: { score: 65, label: 'Moderate', note: 'Coastal forest remains but invasives altered structure' }, foodChain: { score: 70, label: 'Good',    note: 'Frugivore diet supported; native fruit recovering' }, predatorRisk: { score: 30, label: 'High',     note: 'Rats, cats & mongoose still present — original threat' }, humanConflict: { score: 60, label: 'Moderate', note: 'Tourism economy could support reintroduction' } },
    'Rodrigues Solitaire':  { climate: { score: 75, label: 'Good',    note: 'Similar island ecology; climate compatible' },         habitat: { score: 55, label: 'Partial',  note: 'Both islands deforested since 17th century' },          foodChain: { score: 68, label: 'Good',    note: 'Island frugivore niche still partially available' },  predatorRisk: { score: 28, label: 'High',     note: 'Invasive predators remain major threat' },               humanConflict: { score: 55, label: 'Moderate', note: 'Small island limits viable population size' } },
    'Victoria Crowned Pigeon': { climate: { score: 55, label: 'Partial', note: 'New Guinea habitat differs from Mauritius' },       habitat: { score: 40, label: 'Low',      note: 'Rainforest vs island coastal — significant divergence' }, foodChain: { score: 60, label: 'Moderate', note: 'Frugivore — broadly compatible but prey mismatch' }, predatorRisk: { score: 25, label: 'High',     note: 'Invasive predators on Mauritius remain uncontrolled' },  humanConflict: { score: 50, label: 'Moderate', note: 'Conservation status limits availability' } },
  },
  nfwolf: {
    'Eastern Wolf':      { climate: { score: 85, label: 'Good',     note: 'Boreal forest climate match; minor warming tolerable' }, habitat: { score: 80, label: 'Good',     note: 'NL boreal largely intact; ~75% range accessible' },   foodChain: { score: 78, label: 'Good',    note: 'Caribou & moose recovering in Newfoundland' },       predatorRisk: { score: 88, label: 'Low',      note: 'No apex competitors; black bear non-competitive' }, humanConflict: { score: 60, label: 'Moderate', note: 'Livestock & hunting community opposition moderate' } },
    'Great Plains Wolf': { climate: { score: 72, label: 'Good',     note: 'Boreal-adapted; adjustment from plains origin needed' }, habitat: { score: 68, label: 'Moderate', note: 'Forest viable but different from plains origin' },     foodChain: { score: 75, label: 'Good',    note: 'Prey base available and recovering' },                predatorRisk: { score: 85, label: 'Low',      note: 'Minimal apex competitors in target range' },        humanConflict: { score: 55, label: 'Moderate', note: 'Yellowstone program experience useful' } },
    'Domestic Dog':      { climate: { score: 70, label: 'Moderate', note: 'Broadly adaptable but domestication barriers' },        habitat: { score: 30, label: 'Low',      note: 'Human-associated genetics incompatible with wild' },   foodChain: { score: 20, label: 'Very Low', note: 'Domesticated hunting behaviour deeply altered' },     predatorRisk: { score: 40, label: 'Moderate', note: 'Domestication selects away from predatory behaviour' }, humanConflict: { score: 10, label: 'Low',      note: 'Human-familiar but ecologically unsuitable' } },
  },
};

// ── Phylogenetic tree data ────────────────────────────────────────
const phyloTrees = {
  mammoth: {
    nodes: [
      { id: 'proboscidea',  label: 'Proboscidea',      x: 20,  y: 50,  type: 'ancestor' },
      { id: 'elephantidae', label: 'Elephantidae',     x: 100, y: 50,  type: 'ancestor' },
      { id: 'mammuthus',    label: 'Mammuthus',        x: 190, y: 25,  type: 'ancestor' },
      { id: 'mammoth',      label: 'M. primigenius †', x: 310, y: 15,  type: 'extinct'  },
      { id: 'elephas',      label: 'Elephas',          x: 190, y: 55,  type: 'ancestor' },
      { id: 'asian',        label: 'E. maximus',       x: 310, y: 45,  type: 'candidate'},
      { id: 'sumatran',     label: 'E. m. sumatranus', x: 310, y: 62,  type: 'candidate'},
      { id: 'loxodonta',    label: 'Loxodonta',        x: 190, y: 85,  type: 'ancestor' },
      { id: 'african',      label: 'L. africana',      x: 310, y: 80,  type: 'candidate'},
    ],
    edges: [['proboscidea','elephantidae'],['elephantidae','mammuthus'],['elephantidae','elephas'],['elephantidae','loxodonta'],['mammuthus','mammoth'],['elephas','asian'],['elephas','sumatran'],['loxodonta','african']],
  },
  dodo: {
    nodes: [
      { id: 'columbiformes', label: 'Columbiformes', x: 20,  y: 50,  type: 'ancestor'  },
      { id: 'columbidae',    label: 'Columbidae',    x: 100, y: 50,  type: 'ancestor'  },
      { id: 'raphinae',      label: 'Raphinae',      x: 190, y: 22,  type: 'ancestor'  },
      { id: 'dodo',          label: 'R. cucullatus †',x: 310, y: 12, type: 'extinct'   },
      { id: 'pezophaps',     label: 'P. solitaria †',x: 310, y: 28,  type: 'candidate' },
      { id: 'caloenadinae',  label: 'Caloenadinae',  x: 190, y: 55,  type: 'ancestor'  },
      { id: 'nicobar',       label: 'C. nicobarica', x: 310, y: 50,  type: 'candidate' },
      { id: 'gouridae',      label: 'Gouridae',      x: 190, y: 82,  type: 'ancestor'  },
      { id: 'victoria',      label: 'G. victoria',   x: 310, y: 77,  type: 'candidate' },
    ],
    edges: [['columbiformes','columbidae'],['columbidae','raphinae'],['columbidae','caloenadinae'],['columbidae','gouridae'],['raphinae','dodo'],['raphinae','pezophaps'],['caloenadinae','nicobar'],['gouridae','victoria']],
  },
  nfwolf: {
    nodes: [
      { id: 'carnivora',   label: 'Carnivora',           x: 20,  y: 50,  type: 'ancestor'  },
      { id: 'canidae',     label: 'Canidae',              x: 90,  y: 50,  type: 'ancestor'  },
      { id: 'canis',       label: 'Canis',                x: 170, y: 50,  type: 'ancestor'  },
      { id: 'clupus',      label: 'C. lupus',             x: 250, y: 35,  type: 'ancestor'  },
      { id: 'nfwolf',      label: 'C. l. labradorius †',  x: 370, y: 15,  type: 'extinct'   },
      { id: 'ewolf',       label: 'C. l. lycaon',         x: 370, y: 32,  type: 'candidate' },
      { id: 'gpwolf',      label: 'C. l. nubilus',        x: 370, y: 48,  type: 'candidate' },
      { id: 'familiaris',  label: 'C. l. familiaris',     x: 370, y: 65,  type: 'candidate' },
    ],
    edges: [['carnivora','canidae'],['canidae','canis'],['canis','clupus'],['clupus','nfwolf'],['clupus','ewolf'],['clupus','gpwolf'],['clupus','familiaris']],
  },
};

// ── Verdict scenarios ─────────────────────────────────────────────
const verdictScenarios = {
  impossible:   { text: 'NOT POSSIBLE',      sub: 'Genomic divergence too high for viable de-extinction',                              cls: 'impossible', color: '#c0392b' },
  'wild-reloc': { text: 'WILD — RELOCATE',   sub: 'De-extinction possible · extant species can be relocated to historic habitat',      cls: 'wild',       color: '#1a6b35' },
  'wild-gm':    { text: 'WILD — GMO NEEDED', sub: 'De-extinction possible · genetically modified extant species should be relocated',  cls: 'wild-gm',    color: '#2d7a00' },
  captive:      { text: 'CAPTIVITY ONLY',    sub: 'De-extinction possible · revival should occur in a controlled environment',         cls: 'captive',    color: '#c47c1a' },
  'no-attempt': { text: 'DO NOT ATTEMPT',    sub: 'De-extinction possible but ecological conditions make it inadvisable',              cls: 'no-attempt', color: '#7a4e00' },
};

// Verdict logic — REPLACE with your own decision tree
function computeVerdict(extinctKey, candidate) {
  const eco = ecoFactors[extinctKey]?.[candidate.name];
  if (!eco) return candidate.ecology || 'impossible';
  const sim = candidate.sim;
  const climateOk = eco.climate.score >= 60;
  const habitatOk = eco.habitat.score >= 55;
  const foodOk    = eco.foodChain.score >= 60;
  const predSafe  = eco.predatorRisk.score >= 60;
  const humanOk   = eco.humanConflict.score >= 50;
  const wildOk    = climateOk && habitatOk && foodOk && predSafe && humanOk;
  const partialOk = (climateOk || habitatOk) && foodOk && predSafe;
  if (sim < 40)                  return 'impossible';
  if (sim >= 85 && wildOk)       return 'wild-reloc';
  if (sim >= 70 && wildOk)       return 'wild-gm';
  if (sim >= 70 && partialOk)    return 'wild-gm';
  if (sim >= 50 && !wildOk)      return 'captive';
  if (sim >= 40)                 return 'no-attempt';
  return 'impossible';
}

// ── Breakdown labels ──────────────────────────────────────────────
const breakdownLabels = ['Coding sequences','Mitochondrial DNA','Regulatory regions','Immune loci','Morphology genes','Non-coding DNA'];