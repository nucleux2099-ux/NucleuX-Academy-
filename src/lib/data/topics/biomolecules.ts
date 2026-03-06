/**
 * NucleuX Academy - Biomolecules Topics
 * 
 * Comprehensive biochemistry topics covering structural chemistry of life
 * Sources: Harper's Illustrated Biochemistry 32nd Ed, Stryer Biochemistry 9th Ed
 */

import type { LibraryTopic } from '../../types/library';

export const BIOMOLECULES_TOPICS: LibraryTopic[] = [
  // =============================================================================
  // CARBOHYDRATES - STRUCTURE & CLASSIFICATION
  // =============================================================================
  {
    id: 'carbohydrate-structure',
    subjectId: 'biochemistry',
    subspecialtyId: 'biochem-biomolecules',
    name: 'Carbohydrate Structure & Classification',
    slug: 'carbohydrate-structure',
    description: 'Monosaccharides, disaccharides, polysaccharides, and their chemical properties',
    content: {
      concept: `# Carbohydrate Structure & Classification

## Definition

> Carbohydrates are polyhydroxy aldehydes or ketones, or substances that yield these on hydrolysis. General formula: **(CH₂O)ₙ**

## Classification

### By Number of Sugar Units
| Type | Units | Examples |
|------|-------|----------|
| **Monosaccharides** | 1 | Glucose, Fructose, Galactose |
| **Disaccharides** | 2 | Sucrose, Lactose, Maltose |
| **Oligosaccharides** | 3-10 | Maltotriose, Raffinose |
| **Polysaccharides** | >10 | Starch, Glycogen, Cellulose |

### By Functional Group
- **Aldoses**: Aldehyde group (e.g., Glucose, Ribose)
- **Ketoses**: Ketone group (e.g., Fructose, Ribulose)

### By Carbon Number
| Carbons | Name | Examples |
|---------|------|----------|
| 3 | Triose | Glyceraldehyde, Dihydroxyacetone |
| 4 | Tetrose | Erythrose |
| 5 | Pentose | Ribose, Xylose |
| 6 | Hexose | Glucose, Galactose, Fructose |
| 7 | Heptose | Sedoheptulose |

## Monosaccharides

### D and L Configuration
- Based on position of OH on chiral carbon **farthest from carbonyl**
- **D-sugars**: OH on RIGHT (most biological sugars)
- **L-sugars**: OH on LEFT (rare in nature)

> 💎 **D-Glucose** is the most important sugar in human metabolism
> Almost all naturally occurring sugars are D-isomers

### Epimers
- Differ in configuration at a **single chiral carbon**
| Epimers of Glucose | Difference at Carbon |
|--------------------|---------------------|
| Mannose | C-2 |
| Galactose | C-4 |

### Anomers (α and β)
- Differ at the **anomeric carbon** (C-1 in aldoses, C-2 in ketoses)
- **α-anomer**: OH below plane (cis to reference)
- **β-anomer**: OH above plane (trans to reference)
- **Mutarotation**: Interconversion of α ⇌ β forms in solution

### Important Monosaccharides
\`\`\`
GLUCOSE (Aldohexose):
├── Primary fuel for most tissues
├── Only fuel for RBC, lens, cornea, brain (normally)
└── Precursor for glycogen, pentoses, glycoproteins

FRUCTOSE (Ketohexose):
├── Sweetest natural sugar
├── Found in honey, fruits, HFCS
└── Phosphorylated by fructokinase (liver)

GALACTOSE (Aldohexose):
├── C-4 epimer of glucose
├── Component of lactose
├── Deficient metabolism → Galactosemia
└── Important for glycoproteins, glycolipids
\`\`\`

## Disaccharides

| Disaccharide | Composition | Linkage | Source |
|--------------|-------------|---------|--------|
| **Maltose** | Glc + Glc | α(1→4) | Starch digestion |
| **Isomaltose** | Glc + Glc | α(1→6) | Glycogen branch points |
| **Lactose** | Gal + Glc | β(1→4) | Milk |
| **Sucrose** | Glc + Fru | α,β(1→2) | Table sugar |
| **Trehalose** | Glc + Glc | α,α(1→1) | Insects, fungi |

### Reducing vs Non-Reducing Sugars
- **Reducing**: Free anomeric carbon can reduce Cu²⁺ (Maltose, Lactose)
- **Non-reducing**: No free anomeric carbon (Sucrose - both anomeric carbons linked)

## Polysaccharides

### Homopolysaccharides (Single sugar type)
| Type | Monomer | Linkage | Function | Source |
|------|---------|---------|----------|--------|
| **Starch** | Glucose | α(1→4), α(1→6) | Energy storage | Plants |
| **Glycogen** | Glucose | α(1→4), α(1→6) | Energy storage | Animals |
| **Cellulose** | Glucose | β(1→4) | Structure | Plant cell walls |
| **Chitin** | GlcNAc | β(1→4) | Structure | Arthropod exoskeleton |

### Starch vs Glycogen
| Feature | Starch | Glycogen |
|---------|--------|----------|
| Source | Plants | Animals |
| Components | Amylose + Amylopectin | Single polymer |
| Branching | Every 24-30 residues | Every 8-12 residues |
| Solubility | Less soluble | More soluble |

> 💎 **Glycogen is more branched** than starch → more non-reducing ends → faster glucose release

### Heteropolysaccharides
- **Glycosaminoglycans (GAGs)**: Repeating disaccharide units
  - Hyaluronic acid
  - Chondroitin sulfate
  - Heparan sulfate
  - Keratan sulfate`,
      keyPoints: [
        'Carbohydrates are polyhydroxy aldehydes (aldoses) or ketones (ketoses)',
        'D-sugars have OH on right at chiral carbon farthest from carbonyl',
        'Epimers differ at one chiral carbon: Mannose (C-2), Galactose (C-4) are epimers of glucose',
        'α and β anomers differ at anomeric carbon; mutarotation interconverts them',
        'Reducing sugars have free anomeric carbon; Sucrose is non-reducing',
        'Glycogen has more branch points (every 8-12) than starch (every 24-30)',
        'β(1→4) linkages in cellulose cannot be digested by humans'
      ],
      examPrep: {
        summary: `**Carbohydrate Structure - Quick Review**

📊 **Classification**:
- By units: Mono-, Di-, Oligo-, Polysaccharides
- By group: Aldoses vs Ketoses
- By carbons: Triose, Pentose, Hexose

🔄 **Isomers**:
- Epimers: Differ at ONE carbon
  - Glucose↔Mannose (C-2)
  - Glucose↔Galactose (C-4)
- Anomers: Differ at anomeric carbon (α vs β)

🧪 **Reducing Sugars**: Have FREE anomeric carbon
- Reducing: Maltose, Lactose, Glucose
- Non-reducing: Sucrose (both anomeric carbons linked)

🔗 **Polysaccharides**:
- Glycogen: α(1→4), α(1→6), branches q8-12
- Cellulose: β(1→4), cannot digest`,
        mnemonics: [
          'GAL at C-4: Galactose differs from Glucose at C-4',
          'MAN-2: Mannose differs at C-2',
          'Sucrose is Sweet but NOT a reducer (both anomeric carbons occupied)'
        ],
        highYield: [
          'Only D-sugars are biologically significant in humans',
          'Lactose is the only sugar synthesized in mammary gland',
          'Cellulose has β(1→4) linkage - humans lack cellulase',
          'Glycogen\'s high branching = rapid glucose mobilization'
        ],
        commonMCQs: [
          'Epimer of glucose at C-4: Galactose',
          'Non-reducing disaccharide: Sucrose',
          'Storage polysaccharide in animals: Glycogen',
          'Linkage in cellulose: β(1→4)'
        ]
      },
      textbookRefs: [
        {
          textbook: "Harper's Illustrated Biochemistry",
          edition: '32nd',
          chapter: 'Chapter 14',
          chapterTitle: 'Carbohydrates of Physiological Significance',
          pages: '132-144'
        }
      ],
      retrievalCards: [
        {
          id: 'carb-1',
          question: 'What is the structural difference between α and β anomers?',
          answer: 'They differ in the configuration at the anomeric carbon (C-1 in aldoses). α has OH below the ring plane, β has OH above the ring plane.',
          difficulty: 1
        },
        {
          id: 'carb-2',
          question: 'Why is sucrose a non-reducing sugar while maltose is reducing?',
          answer: 'In sucrose, both anomeric carbons participate in the glycosidic bond (α,β 1→2), leaving no free anomeric carbon. In maltose, only one anomeric carbon is involved in the α(1→4) bond.',
          difficulty: 2
        },
        {
          id: 'carb-3',
          question: 'What is the clinical significance of glycogen having more branch points than starch?',
          answer: 'More branch points = more non-reducing ends = more sites for glycogen phosphorylase action = faster glucose release during glycogenolysis',
          difficulty: 2
        }
      ],
      cases: []
    },
    prerequisites: [],
    relatedTopics: ['glycolysis', 'glycogen-metabolism', 'gluconeogenesis'],
    difficulty: 2,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'FMGE'],
    estimatedMinutes: 35,
    hasContent: {
      concept: true,
      examPrep: true,
      textbook: true,
      retrievalCards: true,
      cases: false,
      grindeMap: false
    },
    createdAt: '2025-02-08',
    updatedAt: '2025-02-08'
  },

  // =============================================================================
  // LIPID STRUCTURE & CLASSIFICATION
  // =============================================================================
  {
    id: 'lipid-structure',
    subjectId: 'biochemistry',
    subspecialtyId: 'biochem-biomolecules',
    name: 'Lipid Structure & Classification',
    slug: 'lipid-structure',
    description: 'Fatty acids, triglycerides, phospholipids, sphingolipids, and steroids',
    content: {
      concept: `# Lipid Structure & Classification

## Definition

> Lipids are heterogeneous compounds related by their **insolubility in water** and **solubility in nonpolar solvents**.

## Classification

### Simple Lipids (Esters of FA + Alcohol)
1. **Fats/Oils (Triacylglycerols)**: FA + Glycerol
2. **Waxes**: FA + Long-chain alcohols

### Complex Lipids (FA + Alcohol + Other groups)
1. **Phospholipids**: Contain phosphate
   - Glycerophospholipids
   - Sphingophospholipids
2. **Glycolipids**: Contain carbohydrate
3. **Lipoproteins**: Lipid + Protein

### Derived Lipids
- Fatty acids
- Steroids (Cholesterol)
- Fat-soluble vitamins (A, D, E, K)
- Eicosanoids (Prostaglandins, Leukotrienes)

## Fatty Acids

### Classification
| Type | Double Bonds | Examples |
|------|--------------|----------|
| **Saturated (SFA)** | 0 | Palmitic (16:0), Stearic (18:0) |
| **Monounsaturated (MUFA)** | 1 | Oleic (18:1 ω-9) |
| **Polyunsaturated (PUFA)** | ≥2 | Linoleic (18:2 ω-6), α-Linolenic (18:3 ω-3) |

### Essential Fatty Acids
- **Cannot be synthesized** by humans
- Must be obtained from diet

| EFA | Omega | Found In | Derivative |
|-----|-------|----------|------------|
| **Linoleic acid** | ω-6 | Vegetable oils | Arachidonic acid |
| **α-Linolenic acid** | ω-3 | Flaxseed, fish | EPA, DHA |

> 💎 Humans **cannot introduce double bonds beyond C-9** from carboxyl end
> Hence ω-6 and ω-3 fatty acids are essential

### Omega (ω) Nomenclature
- Position of FIRST double bond from **methyl (omega) end**
- ω-3: First double bond at C-3 from CH₃
- ω-6: First double bond at C-6 from CH₃
- ω-9: First double bond at C-9 from CH₃ (can synthesize)

## Triacylglycerols (TAG)

- Three fatty acids esterified to glycerol
- Main storage form of lipids
- Hydrophobic, stored in adipose tissue
- Hydrolyzed by lipases → Glycerol + 3 FFA

## Phospholipids

### Glycerophospholipids
\`\`\`
Structure:
├── Glycerol backbone
├── Position 1: Saturated FA
├── Position 2: Unsaturated FA
└── Position 3: Phosphate + Head group

Head Groups:
├── Choline → Phosphatidylcholine (Lecithin)
├── Ethanolamine → Phosphatidylethanolamine
├── Serine → Phosphatidylserine
├── Inositol → Phosphatidylinositol (PI)
└── Glycerol → Phosphatidylglycerol
\`\`\`

> 💎 **Phosphatidylcholine (Lecithin)**: Main component of lung surfactant
> L/S ratio >2 indicates fetal lung maturity

### Sphingolipids
- Backbone: **Sphingosine** (not glycerol)
- Sphingosine + FA = **Ceramide**

| Sphingolipid | Components | Location |
|--------------|------------|----------|
| **Sphingomyelin** | Ceramide + Phosphocholine | Myelin sheath |
| **Cerebrosides** | Ceramide + Single sugar | Brain, nerve |
| **Gangliosides** | Ceramide + Oligosaccharide + Sialic acid | Nerve cell membrane |

## Cholesterol & Steroids

### Cholesterol Structure
- 27-carbon compound
- Four fused rings (Cyclopentanoperhydrophenanthrene)
- Single hydroxyl group (C-3)

### Functions of Cholesterol
1. Cell membrane fluidity regulation
2. Precursor for:
   - Bile acids
   - Steroid hormones (glucocorticoids, mineralocorticoids, sex hormones)
   - Vitamin D

### Steroid Hormones
\`\`\`
Cholesterol
    ↓
Pregnenolone
    ├── Progesterone
    ├── Cortisol (Glucocorticoid)
    ├── Aldosterone (Mineralocorticoid)
    ├── Testosterone (Androgen)
    └── Estradiol (Estrogen)
\`\`\``,
      keyPoints: [
        'Lipids are defined by insolubility in water, solubility in organic solvents',
        'Essential fatty acids: Linoleic (ω-6) and α-Linolenic (ω-3)',
        'Humans cannot introduce double bonds beyond C-9 position',
        'Phosphatidylcholine (Lecithin) is main component of lung surfactant',
        'Sphingolipids have sphingosine backbone; glycerophospholipids have glycerol',
        'Sphingomyelin is abundant in myelin sheath',
        'Cholesterol is precursor for bile acids, steroid hormones, vitamin D'
      ],
      examPrep: {
        summary: `**Lipid Structure - Quick Review**

📊 **Classification**:
- Simple: TAG, Waxes
- Complex: Phospholipids, Glycolipids
- Derived: Steroids, FA, Eicosanoids

🧬 **Essential Fatty Acids** (Cannot synthesize):
- Linoleic acid (ω-6) → Arachidonic acid
- α-Linolenic acid (ω-3) → EPA, DHA

🔬 **Phospholipids**:
- Glycerophospholipids: Glycerol backbone
- Sphingolipids: Sphingosine backbone

💊 **Clinical**:
- L/S ratio >2 = Fetal lung maturity
- Sphingolipidoses = Storage diseases`,
        mnemonics: [
          'EFA: Linoleic and Linolenic - both start with "L" for Life (essential)',
          'Omega position: Count from Methyl end (ω = last letter = end)',
          'LECITHIN = Lung surfactant (L for L)'
        ],
        highYield: [
          'Arachidonic acid (ω-6) is precursor for prostaglandins',
          'DHA (ω-3) is crucial for brain and retinal development',
          'Phosphatidylserine on outer membrane = apoptosis signal',
          'Gangliosides contain sialic acid (NANA)'
        ],
        commonMCQs: [
          'Essential fatty acids: Linoleic and α-Linolenic',
          'Main phospholipid in lung surfactant: Phosphatidylcholine',
          'Backbone in sphingomyelin: Sphingosine',
          'Precursor of prostaglandins: Arachidonic acid'
        ]
      },
      textbookRefs: [
        {
          textbook: "Harper's Illustrated Biochemistry",
          edition: '32nd',
          chapter: 'Chapter 15',
          chapterTitle: 'Lipids of Physiological Significance',
          pages: '145-158'
        }
      ],
      retrievalCards: [
        {
          id: 'lipid-1',
          question: 'Why are linoleic and α-linolenic acids essential?',
          answer: 'Humans lack the enzymes (Δ12 and Δ15 desaturases) to introduce double bonds beyond carbon 9 from the carboxyl end.',
          difficulty: 2
        },
        {
          id: 'lipid-2',
          question: 'What is the structural difference between glycerophospholipids and sphingolipids?',
          answer: 'Glycerophospholipids have glycerol as backbone; sphingolipids have sphingosine (an amino alcohol) as backbone.',
          difficulty: 2
        },
        {
          id: 'lipid-3',
          question: 'What is the clinical significance of L/S ratio?',
          answer: 'Lecithin/Sphingomyelin ratio >2 in amniotic fluid indicates fetal lung maturity and reduced risk of respiratory distress syndrome.',
          difficulty: 2
        }
      ],
      cases: []
    },
    prerequisites: [],
    relatedTopics: ['beta-oxidation', 'lipid-synthesis', 'cholesterol-metabolism'],
    difficulty: 2,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'FMGE'],
    estimatedMinutes: 35,
    hasContent: {
      concept: true,
      examPrep: true,
      textbook: true,
      retrievalCards: true,
      cases: false,
      grindeMap: false
    },
    createdAt: '2025-02-08',
    updatedAt: '2025-02-08'
  },

  // =============================================================================
  // AMINO ACIDS - STRUCTURE & CLASSIFICATION
  // =============================================================================
  {
    id: 'amino-acid-structure',
    subjectId: 'biochemistry',
    subspecialtyId: 'biochem-biomolecules',
    name: 'Amino Acid Structure & Classification',
    slug: 'amino-acid-structure',
    description: 'Structure, properties, and classification of the 20 standard amino acids',
    content: {
      concept: `# Amino Acid Structure & Classification

## Basic Structure

> All amino acids (except proline) have:
> - **α-carbon** with 4 substituents
> - **Amino group (-NH₂)**
> - **Carboxyl group (-COOH)**
> - **R group (side chain)** - determines properties
> - **Hydrogen atom**

### Stereochemistry
- α-carbon is chiral (except Glycine)
- Biological amino acids are **L-isomers**
- D-amino acids found in bacterial cell walls

## Classification by R Group

### Non-Polar (Hydrophobic)
| Amino Acid | Abbrev | Features |
|------------|--------|----------|
| Glycine | Gly, G | Smallest, only achiral AA |
| Alanine | Ala, A | Simple methyl R group |
| Valine | Val, V | Branched chain |
| Leucine | Leu, L | Branched chain |
| Isoleucine | Ile, I | Branched chain |
| Proline | Pro, P | Cyclic, imino acid |
| Methionine | Met, M | Contains sulfur |
| Phenylalanine | Phe, F | Aromatic |
| Tryptophan | Trp, W | Aromatic, largest AA |

### Polar Uncharged
| Amino Acid | Abbrev | Features |
|------------|--------|----------|
| Serine | Ser, S | Hydroxyl group |
| Threonine | Thr, T | Hydroxyl group |
| Cysteine | Cys, C | Thiol group, disulfide bonds |
| Asparagine | Asn, N | Amide of Aspartate |
| Glutamine | Gln, Q | Amide of Glutamate |
| Tyrosine | Tyr, Y | Aromatic with OH |

### Positively Charged (Basic) at pH 7
| Amino Acid | Abbrev | pKa (R group) |
|------------|--------|---------------|
| Lysine | Lys, K | 10.5 |
| Arginine | Arg, R | 12.5 (most basic) |
| Histidine | His, H | 6.0 (buffer at physiological pH) |

### Negatively Charged (Acidic) at pH 7
| Amino Acid | Abbrev | pKa (R group) |
|------------|--------|---------------|
| Aspartate | Asp, D | 3.9 |
| Glutamate | Glu, E | 4.2 |

## Special Categories

### Essential Amino Acids
> **PVT TIM HALL** (10 in children, 8 in adults)
- **P**henylalanine
- **V**aline
- **T**hreonine
- **T**ryptophan
- **I**soleucine
- **M**ethionine
- **H**istidine (essential in children)
- **A**rginine (essential in children)
- **L**eucine
- **L**ysine

### Branched Chain Amino Acids (BCAA)
- **Leucine, Isoleucine, Valine**
- Metabolized in muscle (not liver)
- Deficiency in Maple Syrup Urine Disease

### Aromatic Amino Acids
- **Phenylalanine, Tyrosine, Tryptophan**
- Absorb UV light at 280 nm

### Sulfur-Containing
- **Methionine** (essential, initiator)
- **Cysteine** (semi-essential, from methionine)

### Glucogenic vs Ketogenic

| Type | Amino Acids |
|------|-------------|
| **Purely Ketogenic** | Leucine, Lysine |
| **Both** | Isoleucine, Phenylalanine, Tyrosine, Tryptophan, Threonine |
| **Glucogenic** | All others |

> 💎 Memory: **Leucine and Lysine are purely Ketogenic** (both start with L)

## Ionization & pI

### Henderson-Hasselbalch Equation
\`\`\`
pH = pKa + log([A⁻]/[HA])
\`\`\`

### Isoelectric Point (pI)
- pH at which amino acid has **no net charge**
- For neutral AA: pI = (pKa₁ + pKa₂)/2
- For acidic AA: pI = (pKa₁ + pKaR)/2
- For basic AA: pI = (pKa₂ + pKaR)/2`,
      keyPoints: [
        'All amino acids except glycine are L-isomers and chiral',
        'Essential amino acids: PVT TIM HALL (10 including His, Arg for children)',
        'Branched chain AAs (Leu, Ile, Val) are metabolized in muscle',
        'Leucine and Lysine are purely ketogenic',
        'Histidine has pKa ~6.0, acts as buffer at physiological pH',
        'Cysteine forms disulfide bonds (-S-S-)',
        'Aromatic AAs absorb UV at 280 nm'
      ],
      examPrep: {
        summary: `**Amino Acid Structure - Quick Review**

📊 **Classification by Charge (pH 7)**:
- Basic (+): Lys, Arg, His
- Acidic (-): Asp, Glu
- Neutral: All others

🔑 **Essential AAs**: PVT TIM HALL
P-Phe, V-Val, T-Thr, T-Trp, I-Ile, M-Met
H-His, A-Arg, L-Leu, L-Lys

⚡ **Special Groups**:
- BCAA: Leu, Ile, Val (muscle metabolism)
- Ketogenic only: Leu, Lys
- Sulfur: Met, Cys
- Aromatic: Phe, Tyr, Trp

🧪 **Unique Properties**:
- Glycine: Only achiral AA
- Proline: Imino acid (cyclic)
- His: Buffer at pH 7 (pKa ~6)`,
        mnemonics: [
          'PVT TIM HALL: Essential amino acids',
          'Ketogenic only: Leucine & Lysine (both L)',
          'BCAA are VIL-lains in MSUD: Val, Ile, Leu',
          'Basic AAs are positive (HLR = His, Lys, Arg)'
        ],
        highYield: [
          'Tryptophan is precursor for serotonin and niacin',
          'Tyrosine is precursor for catecholamines and thyroid hormones',
          'Methionine provides methyl groups (SAM)',
          'Glutamate is main excitatory neurotransmitter'
        ],
        commonMCQs: [
          'Only achiral amino acid: Glycine',
          'Amino acid acting as buffer at physiological pH: Histidine',
          'Purely ketogenic amino acids: Leucine and Lysine',
          'Branched chain amino acids: Valine, Leucine, Isoleucine'
        ]
      },
      textbookRefs: [
        {
          textbook: "Harper's Illustrated Biochemistry",
          edition: '32nd',
          chapter: 'Chapter 3',
          chapterTitle: 'Amino Acids & Peptides',
          pages: '18-28'
        }
      ],
      retrievalCards: [
        {
          id: 'aa-1',
          question: 'Which amino acids are purely ketogenic?',
          answer: 'Leucine and Lysine - they can only form ketone bodies, not glucose.',
          difficulty: 1
        },
        {
          id: 'aa-2',
          question: 'Why is histidine an effective buffer at physiological pH?',
          answer: 'Histidine has a pKa of ~6.0 for its imidazole side chain, which is close to physiological pH 7.4, allowing it to accept/donate protons effectively.',
          difficulty: 2
        },
        {
          id: 'aa-3',
          question: 'Why are branched chain amino acids metabolized in muscle rather than liver?',
          answer: 'The liver lacks significant branched-chain α-ketoacid dehydrogenase complex activity. Muscle tissue has high activity of this enzyme, so BCAA catabolism occurs primarily in muscle.',
          difficulty: 3
        }
      ],
      cases: []
    },
    prerequisites: [],
    relatedTopics: ['protein-structure', 'amino-acid-metabolism', 'urea-cycle'],
    difficulty: 2,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'FMGE'],
    estimatedMinutes: 35,
    hasContent: {
      concept: true,
      examPrep: true,
      textbook: true,
      retrievalCards: true,
      cases: false,
      grindeMap: false
    },
    createdAt: '2025-02-08',
    updatedAt: '2025-02-08'
  },

  // =============================================================================
  // PROTEIN STRUCTURE
  // =============================================================================
  {
    id: 'protein-structure',
    subjectId: 'biochemistry',
    subspecialtyId: 'biochem-biomolecules',
    name: 'Protein Structure',
    slug: 'protein-structure',
    description: 'Primary, secondary, tertiary, and quaternary structure of proteins',
    content: {
      concept: `# Protein Structure

## Levels of Protein Structure

### Primary Structure
- **Linear sequence** of amino acids in polypeptide chain
- Held by **peptide bonds** (covalent)
- Determines all higher levels of structure
- Written from N-terminus to C-terminus

### Peptide Bond
\`\`\`
Features:
├── Formed between α-COOH and α-NH₂
├── Releases H₂O (dehydration)
├── PLANAR (partial double bond character)
├── Trans configuration (usually)
├── Rigid - no rotation
└── C-N bond length: 1.33 Å (between single and double)
\`\`\`

### Secondary Structure
- Local folding patterns stabilized by **H-bonds**
- Between C=O and N-H of backbone

| Type | H-bonding | Features |
|------|-----------|----------|
| **α-Helix** | i to i+4 | Right-handed, 3.6 residues/turn |
| **β-Sheet** | Between strands | Parallel or antiparallel |
| **β-Turn** | i to i+3 | Reverses direction, Pro/Gly common |
| **Random coil** | — | No regular pattern |

> 💎 **α-Helix**: R groups point outward; H-bonds are intrastrand
> **β-Sheet**: R groups alternate above/below; H-bonds are interstrand

### Amino Acids in Secondary Structure
| AA | Effect |
|----|--------|
| **Proline** | Helix BREAKER (no N-H for H-bond) |
| **Glycine** | Flexible, in β-turns |
| **Alanine** | Helix FORMER |
| Leu, Met, Glu | Helix formers |

### Tertiary Structure
- **Overall 3D shape** of single polypeptide
- Stabilized by multiple interactions:

| Interaction | Strength | Example |
|-------------|----------|---------|
| **Disulfide bonds** | Covalent | Cys-Cys |
| **Ionic bonds** | Strong | Lys-Asp |
| **Hydrophobic** | Moderate | Leu-Val in core |
| **H-bonds** | Moderate | Ser-Asn |
| **Van der Waals** | Weak | All atoms |

### Quaternary Structure
- Association of **multiple polypeptide subunits**
- Present only in oligomeric proteins
- Same interactions as tertiary structure

| Protein | Subunits |
|---------|----------|
| Hemoglobin | α₂β₂ (tetramer) |
| Immunoglobulin | 2 Heavy + 2 Light chains |
| Lactate dehydrogenase | H₄, M₄, or hybrid tetramers |

## Protein Domains

- **Independent folding units** within a protein
- Often correspond to functional regions
- Examples: DNA-binding domain, kinase domain

## Fibrous vs Globular Proteins

| Feature | Fibrous | Globular |
|---------|---------|----------|
| Shape | Long, rod-like | Compact, spherical |
| Function | Structural | Enzymatic, regulatory |
| Examples | Collagen, Keratin, Elastin | Hemoglobin, Enzymes |
| Solubility | Insoluble | Soluble |

## Collagen (Important Fibrous Protein)

\`\`\`
Features:
├── Triple helix (3 chains)
├── Repeating Gly-X-Y sequence
├── X often = Proline
├── Y often = Hydroxyproline or Hydroxylysine
├── Glycine at every 3rd position (fits in center)
└── Cross-linking for stability
\`\`\`

> 💎 **Vitamin C** is required for hydroxylation of Pro and Lys
> Deficiency → Scurvy (defective collagen)`,
      keyPoints: [
        'Peptide bond is planar, rigid, usually trans configuration',
        'α-Helix: H-bonds between i and i+4 residues, 3.6 residues per turn',
        'Proline is helix breaker; Alanine is helix former',
        'Tertiary structure stabilized by disulfide bonds, ionic, hydrophobic, H-bonds, VDW',
        'Quaternary structure = multiple subunits (e.g., Hb is α₂β₂)',
        'Collagen has Gly-X-Y repeat, requires hydroxyproline (needs Vitamin C)',
        'Globular proteins are soluble and functional; fibrous are structural'
      ],
      examPrep: {
        summary: `**Protein Structure - Quick Review**

📊 **Levels**:
- 1° - Sequence (peptide bonds)
- 2° - Local folding (H-bonds): α-helix, β-sheet
- 3° - 3D shape (all interactions)
- 4° - Subunit assembly

🔗 **Stabilizing Forces** (3°/4°):
- Covalent: Disulfide bonds
- Non-covalent: Ionic, Hydrophobic, H-bonds, VDW

⚡ **α-Helix**:
- Right-handed, 3.6 residues/turn
- H-bonds: i to i+4
- Pro = BREAKER, Ala = FORMER

🧬 **Collagen**:
- Triple helix
- Gly-X-Y repeat
- Needs Vitamin C for hydroxylation`,
        mnemonics: [
          'Pro BREAKS helix (no N-H); Ala is ABLE to form helix',
          'α-helix: 3.6 residues = almost 4, H-bond i to i+4',
          'Collagen: Gly is Glue in center of triple helix'
        ],
        highYield: [
          'Sickle cell: Glu→Val in β-globin (primary structure change)',
          'Scurvy: Defective collagen due to lack of hydroxyproline',
          'Antiparallel β-sheets are more stable than parallel'
        ],
        commonMCQs: [
          'Number of residues per turn in α-helix: 3.6',
          'Helix-breaking amino acid: Proline',
          'Covalent bond stabilizing tertiary structure: Disulfide bond',
          'Amino acid at every 3rd position in collagen: Glycine'
        ]
      },
      textbookRefs: [
        {
          textbook: "Harper's Illustrated Biochemistry",
          edition: '32nd',
          chapter: 'Chapter 4-5',
          chapterTitle: 'Proteins: Higher Orders of Structure',
          pages: '29-52'
        }
      ],
      retrievalCards: [
        {
          id: 'prot-1',
          question: 'Why is proline a helix breaker?',
          answer: 'Proline\'s cyclic structure introduces a fixed kink and lacks an amide hydrogen (N-H) needed for α-helix hydrogen bonding.',
          difficulty: 2
        },
        {
          id: 'prot-2',
          question: 'What is the role of glycine in collagen?',
          answer: 'Glycine occupies every third position (Gly-X-Y) because it\'s the smallest amino acid and fits in the crowded center of the triple helix.',
          difficulty: 2
        },
        {
          id: 'prot-3',
          question: 'How does Vitamin C deficiency lead to scurvy?',
          answer: 'Vitamin C is a cofactor for prolyl and lysyl hydroxylases. Without it, proline and lysine cannot be hydroxylated, resulting in unstable collagen with defective cross-linking.',
          difficulty: 2
        }
      ],
      cases: []
    },
    prerequisites: ['amino-acid-structure'],
    relatedTopics: ['hemoglobin', 'collagen-disorders', 'protein-folding'],
    difficulty: 2,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'FMGE'],
    estimatedMinutes: 40,
    hasContent: {
      concept: true,
      examPrep: true,
      textbook: true,
      retrievalCards: true,
      cases: false,
      grindeMap: false
    },
    createdAt: '2025-02-08',
    updatedAt: '2025-02-08'
  },

  // =============================================================================
  // NUCLEOTIDE STRUCTURE
  // =============================================================================
  {
    id: 'nucleotide-structure',
    subjectId: 'biochemistry',
    subspecialtyId: 'biochem-biomolecules',
    name: 'Nucleotide Structure',
    slug: 'nucleotide-structure',
    description: 'Purines, pyrimidines, nucleosides, nucleotides, and nucleic acid structure',
    content: {
      concept: `# Nucleotide Structure

## Components of Nucleotides

### Three Parts
1. **Nitrogenous Base** (Purine or Pyrimidine)
2. **Pentose Sugar** (Ribose or Deoxyribose)
3. **Phosphate group(s)** (1-3)

### Nomenclature
| Components | Name |
|------------|------|
| Base only | Base (Adenine) |
| Base + Sugar | Nucleoside (Adenosine) |
| Base + Sugar + Phosphate | Nucleotide (AMP, ADP, ATP) |

## Nitrogenous Bases

### Purines (Two rings - "PURe As Gold")
\`\`\`
PURINE (9-membered)
├── Adenine (6-amino)
└── Guanine (2-amino, 6-keto)
\`\`\`

### Pyrimidines (One ring - "CUT the PY")
\`\`\`
PYRIMIDINE (6-membered)
├── Cytosine (4-amino, 2-keto)
├── Uracil (2,4-diketo) - RNA only
└── Thymine (5-methyl uracil) - DNA only
\`\`\`

> 💎 **PURe As Gold**: Purines = Adenine, Guanine (2 rings = Pure gold)
> **CUT the PY**: Pyrimidines = C, U, T

### Base Pairing (Watson-Crick)
| DNA | RNA |
|-----|-----|
| A = T (2 H-bonds) | A = U (2 H-bonds) |
| G ≡ C (3 H-bonds) | G ≡ C (3 H-bonds) |

> 💎 G-C pairs are MORE stable (3 H-bonds) than A-T pairs (2 H-bonds)
> High GC content → Higher melting temperature (Tm)

## Pentose Sugars

| Sugar | Features | Found in |
|-------|----------|----------|
| **Ribose** | OH at C-2' | RNA |
| **Deoxyribose** | H at C-2' | DNA |

### Nucleoside Formation
- Base attached to C-1' of sugar via **N-glycosidic bond**
- N-9 of purines, N-1 of pyrimidines

## DNA Structure

### Primary Structure
- Phosphodiester bonds between 3'-OH and 5'-phosphate
- Direction: 5' → 3'
- Antiparallel strands

### Double Helix (B-DNA)
\`\`\`
Features:
├── Right-handed helix
├── 10.5 bp per turn
├── 3.4 nm per turn
├── Major and minor grooves
├── Bases inside, sugar-phosphate outside
└── Bases stacked (hydrophobic, π-π interactions)
\`\`\`

### DNA Forms
| Feature | A-DNA | B-DNA | Z-DNA |
|---------|-------|-------|-------|
| Helix | Right | Right | LEFT |
| bp/turn | 11 | 10.5 | 12 |
| Conditions | Dehydrated | Physiological | High salt, GC-rich |

## RNA Types

| Type | Size | Function |
|------|------|----------|
| **mRNA** | Variable | Carries genetic code |
| **tRNA** | ~75 nt | Carries amino acids (cloverleaf) |
| **rRNA** | Various | Ribosome component |
| **snRNA** | Small | Splicing (spliceosome) |
| **miRNA** | ~22 nt | Gene regulation |

### RNA vs DNA
| Feature | DNA | RNA |
|---------|-----|-----|
| Sugar | Deoxyribose | Ribose |
| Bases | A, G, C, T | A, G, C, U |
| Structure | Double-stranded | Usually single-stranded |
| Stability | More stable | Less stable (2'-OH) |
| Location | Nucleus | Nucleus + Cytoplasm |`,
      keyPoints: [
        'Purines (A, G) have 2 rings; Pyrimidines (C, U, T) have 1 ring',
        'Nucleoside = Base + Sugar; Nucleotide = Base + Sugar + Phosphate',
        'G-C pairs have 3 H-bonds; A-T pairs have 2 H-bonds',
        'DNA contains thymine; RNA contains uracil',
        'B-DNA is the physiological form (right-handed, 10.5 bp/turn)',
        'Z-DNA is left-handed, forms in GC-rich regions',
        'RNA is less stable due to 2\'-OH group'
      ],
      examPrep: {
        summary: `**Nucleotide Structure - Quick Review**

🧬 **Bases**:
- Purines (2 rings): Adenine, Guanine
- Pyrimidines (1 ring): Cytosine, Uracil, Thymine

🔗 **Base Pairing**:
- G ≡ C (3 H-bonds) - stronger
- A = T/U (2 H-bonds)

📊 **DNA Forms**:
- B-DNA: Normal, right-handed
- Z-DNA: Left-handed, GC-rich
- A-DNA: Dehydrated

🔬 **Key Differences**:
- DNA: Deoxyribose, Thymine, double-stranded
- RNA: Ribose, Uracil, single-stranded`,
        mnemonics: [
          'PURe As Gold: Purines = A, G (2 rings)',
          'CUT the PY: Pyrimidines = C, U, T (1 ring)',
          'G-C = 3 bonds (G has 3 letters in "GEE")',
          'Thymine has a THY-methyl group (methyl-uracil)'
        ],
        highYield: [
          'High GC content = higher melting temperature',
          'RNA has 2\'-OH making it more susceptible to alkaline hydrolysis',
          'Z-DNA may play role in gene regulation'
        ],
        commonMCQs: [
          'Base present in RNA but not DNA: Uracil',
          'Number of H-bonds between G and C: 3',
          'Left-handed DNA form: Z-DNA',
          'Most stable base pair: G-C'
        ]
      },
      textbookRefs: [
        {
          textbook: "Harper's Illustrated Biochemistry",
          edition: '32nd',
          chapter: 'Chapter 32',
          chapterTitle: 'Nucleotides',
          pages: '328-338'
        }
      ],
      retrievalCards: [
        {
          id: 'nuc-1',
          question: 'Why is RNA less stable than DNA?',
          answer: 'RNA has a 2\'-OH group on ribose that makes it susceptible to alkaline hydrolysis. DNA has H at 2\' position (deoxyribose), making it more stable.',
          difficulty: 2
        },
        {
          id: 'nuc-2',
          question: 'What determines the melting temperature (Tm) of DNA?',
          answer: 'GC content - higher GC content means higher Tm because G-C pairs have 3 hydrogen bonds vs 2 for A-T pairs.',
          difficulty: 2
        },
        {
          id: 'nuc-3',
          question: 'What is the structural difference between thymine and uracil?',
          answer: 'Thymine has a methyl group at C-5 position; Uracil lacks this methyl group. Thymine = 5-methyluracil.',
          difficulty: 1
        }
      ],
      cases: []
    },
    prerequisites: [],
    relatedTopics: ['dna-replication', 'transcription', 'purine-metabolism'],
    difficulty: 2,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'FMGE'],
    estimatedMinutes: 35,
    hasContent: {
      concept: true,
      examPrep: true,
      textbook: true,
      retrievalCards: true,
      cases: false,
      grindeMap: false
    },
    createdAt: '2025-02-08',
    updatedAt: '2025-02-08'
  },

  // =============================================================================
  // HEMOGLOBIN STRUCTURE & FUNCTION
  // =============================================================================
  {
    id: 'hemoglobin-structure',
    subjectId: 'biochemistry',
    subspecialtyId: 'biochem-biomolecules',
    name: 'Hemoglobin Structure & Function',
    slug: 'hemoglobin-structure',
    description: 'Heme structure, oxygen binding, cooperativity, and hemoglobinopathies',
    content: {
      concept: `# Hemoglobin Structure & Function

## Hemoglobin Structure

### Quaternary Structure
- **Tetramer**: 2 α-globin + 2 β-globin chains (α₂β₂)
- Each subunit contains one **heme** group
- Total: 4 heme groups, can carry 4 O₂ molecules

### Heme Structure
\`\`\`
Components:
├── Protoporphyrin IX ring
├── Central Fe²⁺ ion (ferrous)
├── 6 coordination sites:
│   ├── 4 with pyrrole nitrogens
│   ├── 1 with proximal histidine (F8)
│   └── 1 for O₂ binding
\`\`\`

> 💎 **Fe must be Fe²⁺ (ferrous)** to bind O₂
> Fe³⁺ (ferric) = Methemoglobin (cannot bind O₂)

### Hemoglobin Types
| Type | Composition | When Present |
|------|-------------|--------------|
| HbA | α₂β₂ | Adult (97%) |
| HbA₂ | α₂δ₂ | Adult (2-3%) |
| HbF | α₂γ₂ | Fetal |
| HbA₁c | Glycated HbA | Diabetic marker |

## Oxygen Binding

### Oxygen Dissociation Curve
- **Sigmoidal** (S-shaped) for Hemoglobin
- **Hyperbolic** for Myoglobin
- Sigmoidal shape due to **cooperativity**

### Cooperativity
- Binding of O₂ to one subunit increases affinity of other subunits
- **T-state (Tense)**: Low O₂ affinity (deoxy-Hb)
- **R-state (Relaxed)**: High O₂ affinity (oxy-Hb)

### P50
- pO₂ at which Hb is **50% saturated**
- Normal P50 = **26-27 mmHg**
- **Increased P50** = Right shift = Decreased affinity
- **Decreased P50** = Left shift = Increased affinity

## Factors Affecting O₂ Affinity

### Right Shift (Decreased Affinity) - "CADET face Right"
| Factor | Mechanism |
|--------|-----------|
| ↑ CO₂ | Bohr effect |
| ↑ Acid (↓pH) | Bohr effect |
| ↑ 2,3-DPG | Stabilizes T-state |
| ↑ Exercise | All above increase |
| ↑ Temperature | Destabilizes R-state |

### Left Shift (Increased Affinity)
- Opposite of above
- **Fetal hemoglobin (HbF)**: γ-chains bind 2,3-DPG poorly
- **Carbon monoxide**: Binds 200× stronger than O₂
- **Methemoglobin**: Cannot bind O₂

## Bohr Effect

> Release of O₂ in tissues is facilitated by ↓pH and ↑CO₂

\`\`\`
In Tissues:
CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻
              ↓
        H⁺ binds to Hb
              ↓
    Promotes O₂ release (Right shift)

In Lungs:
O₂ binds Hb → H⁺ released
              ↓
    H⁺ + HCO₃⁻ → CO₂ + H₂O
              ↓
        CO₂ exhaled
\`\`\`

## Clinical Correlations

### Hemoglobinopathies
| Disease | Defect | Features |
|---------|--------|----------|
| **Sickle Cell** | β6 Glu→Val | HbS polymerizes when deoxy |
| **Thalassemia** | ↓ Globin synthesis | α or β chain deficiency |
| **Methemoglobinemia** | Fe³⁺ state | Cyanosis, chocolate blood |

### Carbon Monoxide Poisoning
- CO binds Hb with 200× greater affinity than O₂
- Forms **carboxyhemoglobin (COHb)**
- Shifts curve LEFT
- Cherry red color
- Treatment: 100% O₂, hyperbaric O₂`,
      keyPoints: [
        'Adult Hb (HbA) is α₂β₂ tetramer with 4 heme groups',
        'Fe²⁺ (ferrous) binds O₂; Fe³⁺ (ferric) cannot (methemoglobin)',
        'Hemoglobin shows sigmoidal O₂ curve due to cooperativity',
        'Right shift (↓affinity): ↑CO₂, ↓pH, ↑2,3-DPG, ↑temp (CADET)',
        'Bohr effect: ↓pH promotes O₂ release in tissues',
        'HbF has higher O₂ affinity (γ chains bind 2,3-DPG poorly)',
        'CO binds 200× stronger than O₂, causes left shift'
      ],
      examPrep: {
        summary: `**Hemoglobin - Quick Review**

🔬 **Structure**:
- α₂β₂ tetramer (HbA)
- 4 heme groups, 4 O₂ binding sites
- Fe²⁺ required for O₂ binding

📈 **O₂ Dissociation Curve**:
- Sigmoidal (cooperativity)
- P50 = 26-27 mmHg

➡️ **Right Shift** (↓affinity): CADET
- CO₂↑, Acid↑, DPG↑, Exercise, Temp↑

⬅️ **Left Shift** (↑affinity):
- HbF, CO, Methemoglobin

🩺 **Clinical**:
- Sickle cell: β6 Glu→Val
- CO poisoning: 200× affinity`,
        mnemonics: [
          'CADET face Right: CO₂, Acid, 2,3-DPG, Exercise, Temperature',
          'Right = Release O₂ to tissues',
          'CO is clingy: 200× affinity, won\'t let go'
        ],
        highYield: [
          'HbF has higher O₂ affinity than HbA - facilitates placental transfer',
          'Sickle cell: Point mutation β6 Glu→Val creates hydrophobic patch',
          '2,3-DPG is produced during glycolysis in RBCs'
        ],
        commonMCQs: [
          'Normal P50 of hemoglobin: 26-27 mmHg',
          'Composition of HbF: α₂γ₂',
          'Sickle cell mutation: Glutamate to Valine at β6',
          'CO binding affinity compared to O₂: 200 times greater'
        ]
      },
      textbookRefs: [
        {
          textbook: "Harper's Illustrated Biochemistry",
          edition: '32nd',
          chapter: 'Chapter 6',
          chapterTitle: 'Proteins: Myoglobin & Hemoglobin',
          pages: '53-66'
        }
      ],
      retrievalCards: [
        {
          id: 'hb-1',
          question: 'Why does HbF have higher O₂ affinity than HbA?',
          answer: 'HbF contains γ-chains instead of β-chains. γ-chains bind 2,3-DPG less avidly, so HbF remains in the R-state (high affinity) more readily.',
          difficulty: 2
        },
        {
          id: 'hb-2',
          question: 'Explain the Bohr effect.',
          answer: 'The Bohr effect describes how ↓pH and ↑CO₂ decrease Hb oxygen affinity, promoting O₂ release in metabolically active tissues. H⁺ ions bind to Hb and stabilize the T-state.',
          difficulty: 2
        },
        {
          id: 'hb-3',
          question: 'Why is CO poisoning dangerous despite low concentrations?',
          answer: 'CO binds Hb with 200× greater affinity than O₂ AND causes a left shift in remaining hemes (preventing O₂ release to tissues). Double effect: less O₂ carried AND less released.',
          difficulty: 3
        }
      ],
      cases: []
    },
    prerequisites: ['protein-structure'],
    relatedTopics: ['heme-synthesis', 'porphyrias', 'thalassemia'],
    difficulty: 3,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'FMGE'],
    estimatedMinutes: 40,
    hasContent: {
      concept: true,
      examPrep: true,
      textbook: true,
      retrievalCards: true,
      cases: false,
      grindeMap: false
    },
    createdAt: '2025-02-08',
    updatedAt: '2025-02-08'
  },

  // =============================================================================
  // GLYCOSAMINOGLYCANS & PROTEOGLYCANS
  // =============================================================================
  {
    id: 'glycosaminoglycans',
    subjectId: 'biochemistry',
    subspecialtyId: 'biochem-biomolecules',
    name: 'Glycosaminoglycans & Proteoglycans',
    slug: 'glycosaminoglycans',
    description: 'Structure, synthesis, and clinical significance of GAGs and mucopolysaccharidoses',
    content: {
      concept: `# Glycosaminoglycans & Proteoglycans

## Definition

> **Glycosaminoglycans (GAGs)** are long, unbranched polysaccharides composed of repeating disaccharide units. One sugar is always an amino sugar (GlcNAc or GalNAc).

## Structure of GAGs

### Common Features
- Linear, unbranched chains
- Repeating disaccharide units
- Highly **negatively charged** (sulfate, carboxyl groups)
- Attract water → gel-like matrix

### Major GAGs
| GAG | Disaccharide | Sulfated? | Location |
|-----|--------------|-----------|----------|
| **Hyaluronic acid** | GlcUA + GlcNAc | NO | Synovial fluid, vitreous |
| **Chondroitin sulfate** | GlcUA + GalNAc | YES | Cartilage |
| **Heparan sulfate** | GlcUA/IdUA + GlcNAc | YES | Cell surfaces |
| **Heparin** | GlcUA/IdUA + GlcNAc | YES (most) | Mast cells |
| **Keratan sulfate** | Gal + GlcNAc | YES | Cornea, cartilage |
| **Dermatan sulfate** | IdUA + GalNAc | YES | Skin, vessels |

> 💎 **Hyaluronic acid is the ONLY non-sulfated GAG**
> Also the only GAG not attached to protein

## Proteoglycans

- GAG chains covalently attached to core protein
- **Aggregan**: Major cartilage proteoglycan
- Forms huge aggregates with hyaluronic acid

\`\`\`
Structure:
Hyaluronic acid (backbone)
    ├── Link protein
    └── Aggrecan (core protein + GAG chains)
\`\`\`

## Synthesis

### General Pathway
1. Core protein synthesized in RER
2. Tetrasaccharide linker added (Xyl-Gal-Gal-GlcUA)
3. GAG chain elongated in Golgi
4. Sulfation by sulfotransferases (requires PAPS)

### PAPS (3'-Phosphoadenosine-5'-phosphosulfate)
- Universal sulfate donor
- Required for all sulfation reactions

## Degradation

- Occurs in **lysosomes**
- Requires specific **exoglycosidases** and **sulfatases**
- Deficiency → **Mucopolysaccharidoses (MPS)**

## Mucopolysaccharidoses (MPS)

> Lysosomal storage diseases caused by deficiency of enzymes degrading GAGs

| Disease | Deficient Enzyme | GAG Accumulated |
|---------|------------------|-----------------|
| **Hurler (MPS I)** | α-L-Iduronidase | Dermatan, Heparan sulfate |
| **Hunter (MPS II)** | Iduronate sulfatase | Dermatan, Heparan sulfate |
| **Sanfilippo (MPS III)** | Various | Heparan sulfate |
| **Morquio (MPS IV)** | Galactosamine-6-sulfatase | Keratan sulfate |

> 💎 **Hunter is the ONLY X-linked MPS** (no corneal clouding)
> All others are autosomal recessive

### Clinical Features of MPS
- Coarse facies
- Skeletal abnormalities (dysostosis multiplex)
- Hepatosplenomegaly
- Corneal clouding (except Hunter)
- Mental retardation (except Morquio)
- Urinary GAG excretion`,
      keyPoints: [
        'GAGs are repeating disaccharides with amino sugar + uronic acid',
        'Hyaluronic acid is the only non-sulfated, protein-free GAG',
        'Proteoglycans = Core protein + GAG chains',
        'PAPS is the universal sulfate donor',
        'GAGs degraded in lysosomes by exoglycosidases and sulfatases',
        'MPS are lysosomal storage diseases with GAG accumulation',
        'Hunter syndrome is X-linked; all other MPS are autosomal recessive'
      ],
      examPrep: {
        summary: `**GAGs & Proteoglycans - Quick Review**

📊 **GAGs**:
- Repeating disaccharides
- Highly negatively charged
- Hyaluronic acid = ONLY non-sulfated

🔬 **Major GAGs**:
- Hyaluronic acid: Synovial fluid
- Chondroitin sulfate: Cartilage
- Heparin: Mast cells (anticoagulant)
- Keratan sulfate: Cornea

💊 **MPS Diseases**:
- Hurler (I): α-Iduronidase deficiency
- Hunter (II): X-linked, no corneal clouding
- Morquio (IV): Keratan sulfate, normal IQ`,
        mnemonics: [
          'Hurler = Horrible corneal clouding; Hunter = He has NO corneal clouding (X-linked)',
          'PAPS = Provides All Phospho-Sulfates',
          'Hyaluronic = Huge (large), Hydrated, no Heparan-like sulfation'
        ],
        highYield: [
          'Hunter is X-linked - affects males, no corneal clouding',
          'Morquio patients have normal intelligence',
          'Dermatan and heparan sulfate accumulate in Hurler and Hunter'
        ],
        commonMCQs: [
          'Only non-sulfated GAG: Hyaluronic acid',
          'X-linked MPS: Hunter syndrome (MPS II)',
          'GAG accumulated in Morquio: Keratan sulfate',
          'Universal sulfate donor: PAPS'
        ]
      },
      textbookRefs: [
        {
          textbook: "Harper's Illustrated Biochemistry",
          edition: '32nd',
          chapter: 'Chapter 48',
          chapterTitle: 'Glycosaminoglycans',
          pages: '524-535'
        }
      ],
      retrievalCards: [
        {
          id: 'gag-1',
          question: 'Why does hyaluronic acid attract water?',
          answer: 'It has many negatively charged carboxyl groups that attract cations and water, creating a hydrated gel matrix.',
          difficulty: 2
        },
        {
          id: 'gag-2',
          question: 'Why does Hunter syndrome lack corneal clouding unlike other MPS?',
          answer: 'Hunter is due to iduronate sulfatase deficiency. While the exact mechanism is unclear, the pattern of GAG accumulation in Hunter differs, sparing corneal tissue.',
          difficulty: 3
        },
        {
          id: 'gag-3',
          question: 'What is the diagnostic test for MPS?',
          answer: 'Urinary GAG excretion is increased. Specific enzyme assays in leukocytes or fibroblasts confirm the diagnosis.',
          difficulty: 2
        }
      ],
      cases: []
    },
    prerequisites: ['carbohydrate-structure'],
    relatedTopics: ['lysosomal-storage-diseases', 'collagen-disorders'],
    difficulty: 3,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'FMGE'],
    estimatedMinutes: 35,
    hasContent: {
      concept: true,
      examPrep: true,
      textbook: true,
      retrievalCards: true,
      cases: false,
      grindeMap: false
    },
    createdAt: '2025-02-08',
    updatedAt: '2025-02-08'
  },

  // =============================================================================
  // GLYCOPROTEINS
  // =============================================================================
  {
    id: 'glycoproteins',
    subjectId: 'biochemistry',
    subspecialtyId: 'biochem-biomolecules',
    name: 'Glycoproteins',
    slug: 'glycoproteins',
    description: 'N-linked and O-linked glycosylation, ABO blood groups, and CDG disorders',
    content: {
      concept: `# Glycoproteins

## Definition

> **Glycoproteins** are proteins with covalently attached oligosaccharide chains. They differ from proteoglycans in having shorter, branched carbohydrate chains.

## Types of Glycosylation

### N-Linked Glycosylation
- Sugar attached to **nitrogen** of **Asparagine**
- Consensus sequence: **Asn-X-Ser/Thr** (X ≠ Pro)
- Begins in **RER**, completed in **Golgi**
- Core structure added as preformed unit (Dolichol-PP-oligosaccharide)

\`\`\`
Process:
1. Dolichol-PP-oligosaccharide assembled (RER membrane)
2. Transferred to Asn in nascent protein
3. Trimming by glucosidases (RER)
4. Processing in Golgi (terminal glycosylation)
\`\`\`

### O-Linked Glycosylation
- Sugar attached to **oxygen** of **Serine or Threonine**
- No consensus sequence
- Occurs entirely in **Golgi**
- Sugars added one at a time
- First sugar usually **GalNAc**

### Comparison
| Feature | N-Linked | O-Linked |
|---------|----------|----------|
| Site | Asn | Ser, Thr |
| Consensus | Asn-X-Ser/Thr | None |
| Location | RER + Golgi | Golgi only |
| Assembly | Block transfer | Sequential |

## Functions of Glycoproteins

1. **Cell signaling and recognition**
2. **Protein folding and stability**
3. **Protection from proteases**
4. **Blood group antigens**
5. **Hormone receptors**
6. **Immunoglobulins**

## ABO Blood Group System

> Based on glycosyltransferases adding sugars to H antigen

### H Antigen (Precursor)
- Fucose added to oligosaccharide chain
- Present in all blood types (most in O)

### ABO Antigens
| Blood Type | Enzyme | Sugar Added | Antigen |
|------------|--------|-------------|---------|
| A | N-acetylgalactosaminyltransferase | GalNAc | A |
| B | Galactosyltransferase | Galactose | B |
| AB | Both enzymes | Both | A and B |
| O | Neither (no transferase) | None | H only |

> 💎 **Bombay phenotype (Oh)**: Lacks H antigen (no FUT1)
> Cannot make A, B, or H antigens; can only receive Oh blood

## Congenital Disorders of Glycosylation (CDG)

> Group of disorders affecting glycoprotein synthesis

### Common Features
- Multisystem involvement
- Neurological abnormalities
- Failure to thrive
- Inverted nipples, abnormal fat pads

### Types
| Type | Defect |
|------|--------|
| CDG-Ia (most common) | Phosphomannomutase 2 (PMM2) |
| CDG-Ib | Phosphomannose isomerase |

### Diagnosis
- Isoelectric focusing of transferrin
- Abnormal pattern due to undersialylation`,
      keyPoints: [
        'N-linked: Attached to Asn in Asn-X-Ser/Thr sequence',
        'O-linked: Attached to Ser/Thr, occurs only in Golgi',
        'N-linked begins with Dolichol-PP-oligosaccharide in RER',
        'ABO blood groups determined by glycosyltransferases',
        'Type O has H antigen only (no A or B transferase)',
        'Bombay phenotype lacks H antigen, cannot make A, B, or H',
        'CDG-Ia: Phosphomannomutase 2 deficiency, most common CDG'
      ],
      examPrep: {
        summary: `**Glycoproteins - Quick Review**

📊 **Glycosylation Types**:
- N-linked: Asn-X-Ser/Thr, RER→Golgi
- O-linked: Ser/Thr, Golgi only

🩸 **ABO Blood Groups**:
- A: GalNAc added to H
- B: Gal added to H
- O: H antigen only
- Bombay: No H (needs Oh blood)

🧬 **CDG**:
- Multisystem, neurological
- CDG-Ia: PMM2 deficiency
- Diagnosis: Transferrin IEF`,
        mnemonics: [
          'N-linked = N-asparagine; O-linked = O-xygen on Ser/Thr',
          'Blood type O = Only H antigen (no other sugar added)',
          'Bombay = Blocked H synthesis'
        ],
        highYield: [
          'Tunicamycin inhibits N-linked glycosylation',
          'Calnexin and calreticulin are chaperones in glycoprotein folding',
          'Defective glycosylation = misfolded proteins → degradation'
        ],
        commonMCQs: [
          'Consensus sequence for N-linked glycosylation: Asn-X-Ser/Thr',
          'Blood type with only H antigen: Type O',
          'Most common CDG: CDG-Ia (PMM2 deficiency)',
          'Location of O-linked glycosylation: Golgi only'
        ]
      },
      textbookRefs: [
        {
          textbook: "Harper's Illustrated Biochemistry",
          edition: '32nd',
          chapter: 'Chapter 47',
          chapterTitle: 'Glycoproteins',
          pages: '510-523'
        }
      ],
      retrievalCards: [
        {
          id: 'gp-1',
          question: 'Why cannot people with Bombay phenotype receive normal O blood?',
          answer: 'Bombay individuals lack the H antigen (have anti-H antibodies). Even type O blood has H antigen, which would cause a transfusion reaction. They can only receive Oh (Bombay) blood.',
          difficulty: 3
        },
        {
          id: 'gp-2',
          question: 'What is the role of dolichol in N-linked glycosylation?',
          answer: 'Dolichol phosphate serves as a lipid carrier for the oligosaccharide precursor. The complete oligosaccharide is assembled on dolichol-PP and then transferred en bloc to asparagine residues.',
          difficulty: 2
        },
        {
          id: 'gp-3',
          question: 'How does O blood type differ from Bombay phenotype?',
          answer: 'Type O has H antigen but lacks A and B transferases. Bombay lacks H antigen entirely (defective H-transferase/FUT1), so cannot form H, A, or B antigens.',
          difficulty: 2
        }
      ],
      cases: []
    },
    prerequisites: ['carbohydrate-structure', 'protein-structure'],
    relatedTopics: ['blood-groups', 'protein-targeting', 'lysosomal-enzymes'],
    difficulty: 3,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'FMGE'],
    estimatedMinutes: 35,
    hasContent: {
      concept: true,
      examPrep: true,
      textbook: true,
      retrievalCards: true,
      cases: false,
      grindeMap: false
    },
    createdAt: '2025-02-08',
    updatedAt: '2025-02-08'
  }
];
