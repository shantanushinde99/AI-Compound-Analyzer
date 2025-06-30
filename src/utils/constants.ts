export interface MolecularProperties {
  molecularWeight: number;
  logP: number;
  hbondDonors: number;
  hbondAcceptors: number;
  rotatablebonds: number;
  polarSurfaceArea: number;
  heavyAtomCount: number;
  ringCount: number;
  aromaticRings: number;
  heteroAtoms: number;
}

export interface CompoundAnalysis {
  smiles: string;
  name: string;
  formula: string;
  iupacName?: string;
  functionalGroups?: string[];
  properties: MolecularProperties;
  drugLikeness: {
    lipinskiViolations: number;
    veberViolations: number;
    leadLikeness: boolean;
    drugLikeness: boolean;
  };
  admet: {
    bloodBrainBarrier: string;
    humanIntestinalAbsorption: string;
    cyp450Inhibition: string[];
    toxicity: string;
  };
  structure3D: string; // MOL block format
}

export interface AnalysisResponse {
  success: boolean;
  data?: CompoundAnalysis;
  error?: string;
}

export const ATOM_COLORS = {
  // Standard Jmol/PyMOL color scheme
  C: '#909090',   // Carbon - gray
  N: '#3050F8',   // Nitrogen - blue
  O: '#FF0D0D',   // Oxygen - red
  H: '#FFFFFF',   // Hydrogen - white
  S: '#FFFF30',   // Sulfur - yellow
  P: '#FF8000',   // Phosphorus - orange
  F: '#90E050',   // Fluorine - green
  Cl: '#1FF01F',  // Chlorine - green
  Br: '#A62929',  // Bromine - brown
  I: '#940094',   // Iodine - purple
  // Metals
  Na: '#AB5CF2',  // Sodium - violet
  K: '#8F40D4',   // Potassium - violet
  Ca: '#3DFF00',  // Calcium - green
  Mg: '#8AFF00',  // Magnesium - green
  Fe: '#E06633',  // Iron - orange
  Zn: '#7D80B0',  // Zinc - blue-gray
  Cu: '#C88033',  // Copper - brown
  // Other common elements
  B: '#FFB5B5',   // Boron - pink
  Si: '#F0C8A0',  // Silicon - tan
  default: '#FF69B4' // Default - pink
};

// Expanded compound library with diverse pharmaceuticals and chemicals
export const EXAMPLE_COMPOUNDS = [
  // Pain relievers and anti-inflammatories
  'aspirin',
  'ibuprofen', 
  'paracetamol',
  'naproxen',
  
  // Stimulants and psychoactive compounds
  'caffeine',
  'nicotine',
  'methamphetamine',
  'cocaine',
  'lsd',
  'thc',
  
  // Opioids and analgesics
  'morphine',
  'codeine',
  
  // Antibiotics
  'penicillin',
  'amoxicillin',
  
  // Hormones and neurotransmitters
  'adrenaline',
  'epinephrine',
  
  // Diabetes medication
  'metformin',
  
  // Common chemicals
  'ethanol',
  'acetone',
  'chloroform',
  'citric acid',
  'glucose'
];

export const ANALYSIS_TIPS = [
  'Try natural language: "Show me the structure of aspirin"',
  'Compare compounds: "Compare caffeine and paracetamol"',
  'Ask about properties: "Is ibuprofen likely to cross the blood-brain barrier?"',
  'Use SMILES directly: "CC(=O)OC1=CC=CC=C1C(=O)O"',
  'Ask for specific analyses: "What are the toxicity concerns for morphine?"',
  'Request visualizations: "Visualize the 3D structure of penicillin"',
  'Explore functional groups: "What functional groups are in aspirin?"',
  'Check drug-likeness: "Is caffeine suitable as an oral drug?"'
];

// Molecular formula formatting utility
export const formatMolecularFormula = (formula: string): string => {
  const subscriptMap: { [key: string]: string } = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };
  
  return formula.replace(/(\d+)/g, (match) => {
    return match.split('').map(digit => subscriptMap[digit] || digit).join('');
  });
};

// Functional group descriptions
export const FUNCTIONAL_GROUP_DESCRIPTIONS: { [key: string]: string } = {
  'hydroxyl': 'OH group - found in alcohols and phenols',
  'carboxyl': 'COOH group - found in carboxylic acids',
  'carbonyl': 'C=O group - found in aldehydes and ketones',
  'amine': 'NH₂ group - basic nitrogen-containing group',
  'amide': 'CONH group - found in proteins and many drugs',
  'ester': 'COO group - found in fats and many pharmaceuticals',
  'ether': 'C-O-C group - oxygen bridge between carbons',
  'phenyl': 'Benzene ring - aromatic six-membered ring',
  'methyl': 'CH₃ group - simple alkyl substituent',
  'nitro': 'NO₂ group - electron-withdrawing group',
  'sulfonate': 'SO₃ group - found in detergents and drugs',
  'phosphate': 'PO₄ group - found in DNA, RNA, and energy molecules'
};

// Color scheme options for 3D viewer
export const COLOR_SCHEMES = {
  cpk: 'CPK Colors (Standard)',
  rainbow: 'Rainbow (High Contrast)',
  greyscale: 'Greyscale (Colorblind Friendly)'
};

// Toxicity warning thresholds
export const TOXICITY_THRESHOLDS = {
  highLogP: 5,
  highMolecularWeight: 600,
  highPolarSurfaceArea: 200,
  maxRotatableBonds: 10
};