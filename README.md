# De-Extinction Explorer · BioHack 2026

**Team:** rex-the-devs

An interactive web tool for evaluating the scientific viability of de-extinction across six Canadian and globally significant extinct species. Built for BioHack 2026.

---

## What it does

The explorer lets you select an extinct species, choose a living candidate for de-extinction, and instantly generates a full ecological and genomic analysis — including a verdict on whether revival is advisable and under what conditions.

For each species pair it produces:

- **DNA Similarity** — whole-genome identity score between the extinct and candidate species
- **Ecological Factor Scores** — radar chart across 7 weighted factors (climate match, biome, habitat intactness, food availability, human pressure, diet compatibility, predator risk)
- **Temperature Range Comparison** — visual overlap between historic and modern thermal tolerances
- **Trophic Population Dynamics** — modelled population trends for the species and its trophic context over time
- **Species Distribution** — historic vs. modern habitat occurrence maps (bubble chart)
- **Phylogenetic Tree** — generated live from the [Open Tree of Life API](https://opentreeoflife.org), covering the extinct species and all living candidates
- **De-Extinction Verdict** — one of five outcomes (Wild Relocate, Wild GMO, Captive Only, Do Not Attempt, Not Possible) based on a scored decision tree


## File structure

```
index.html        — Main explorer app
methodology.html  — Full explanation of scoring logic and data sources
styles.css        — All styling
app.js            — UI rendering, chart generation, phylogenetic tree
scoring.js        — Ecological scoring functions and verdict decision tree
data.js           — Species data, trophic indices, distribution data, citations
images/           — Species illustration images for verdict card
```

---

## Phylogenetic trees API

Phylogenetic trees are generated live via the [Open Tree of Life v3 API](https://api.opentreeoflife.org).


## Deployment Link
https://rex-the-dev-biohack2026.netlify.app/

