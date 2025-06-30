"""
LLM Processing Module for Natural Language to SMILES Conversion
Handles compound name recognition and SMILES generation
"""

import logging
import re
from typing import Dict, Any
import json

logger = logging.getLogger(__name__)

class LLMProcessor:
    """Natural language processor for compound analysis queries"""
    
    def __init__(self):
        # Expanded compound database with diverse pharmaceuticals and chemicals
        self.compound_database = {
            # Pain relievers and anti-inflammatories
            'aspirin': 'CC(=O)OC1=CC=CC=C1C(=O)O',
            'ibuprofen': 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O',
            'paracetamol': 'CC(=O)NC1=CC=C(C=C1)O',
            'acetaminophen': 'CC(=O)NC1=CC=C(C=C1)O',
            'naproxen': 'COC1=CC2=C(C=C1)C=C(C=C2)C(C)C(=O)O',
            
            # Stimulants and psychoactive compounds
            'caffeine': 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
            'nicotine': 'CN1CCCC1C2=CN=CC=C2',
            'methamphetamine': 'CC(CC1=CC=CC=C1)NC',
            'cocaine': 'COC(=O)C1C(CC2CCC(C1N2C)OC(=O)C3=CC=CC=C3)C',
            'lsd': 'CCN(CC)C(=O)C1CN(C2CC3=CNC4=CC=CC(=C34)C2=C1)C',
            'thc': 'CCCCCC1=CC(=C2C3C=C(CCC3C(OC2=C1)(C)C)C)O',
            'tetrahydrocannabinol': 'CCCCCC1=CC(=C2C3C=C(CCC3C(OC2=C1)(C)C)C)O',
            
            # Opioids and analgesics
            'morphine': 'CN1CC[C@]23C4=C5C=CC(O)=C4O[C@H]2[C@@H](O)C=C[C@H]3[C@H]1C5',
            'codeine': 'COC1=CC2=C3[C@H]4[C@H]5CC[C@@H](N4C)C[C@@H]3OC6=C2C1=CC=C6O5',
            
            # Antibiotics
            'penicillin': 'CC1([C@@H](N2[C@H](S1)[C@@H](C2=O)NC(=O)CC3=CC=CC=C3)C(=O)O)C',
            'amoxicillin': 'CC1([C@@H](N2[C@H](S1)[C@@H](C2=O)NC(=O)[C@@H](C3=CC=C(C=C3)O)N)C(=O)O)C',
            'penicillin g': 'CC1([C@@H](N2[C@H](S1)[C@@H](C2=O)NC(=O)CC3=CC=CC=C3)C(=O)O)C',
            
            # Hormones and neurotransmitters
            'adrenaline': 'CNC[C@@H](C1=CC(=C(C=C1)O)O)O',
            'epinephrine': 'CNC[C@@H](C1=CC(=C(C=C1)O)O)O',
            
            # Diabetes medication
            'metformin': 'CN(C)C(=N)N=C(N)N',
            
            # Common chemicals
            'ethanol': 'CCO',
            'methanol': 'CO',
            'acetone': 'CC(=O)C',
            'chloroform': 'C(Cl)(Cl)Cl',
            'citric acid': 'C(C(=O)O)C(CC(=O)O)(C(=O)O)O',
            'sulfuric acid': 'OS(=O)(=O)O',
            
            # Aromatics and organics
            'benzene': 'C1=CC=CC=C1',
            'toluene': 'CC1=CC=CC=C1',
            'phenol': 'C1=CC=C(C=C1)O',
            'aniline': 'C1=CC=C(C=C1)N',
            
            # Nucleotides and biomolecules
            'adenine': 'C1=NC2=C(N1)C(=NC=N2)N',
            'guanine': 'C1=NC2=C(N1)C(=O)NC(=N2)N',
            'cytosine': 'C1=CN(C(=O)N=C1N)C2C(C(C(O2)CO)O)O',
            'thymine': 'CC1=CN(C(=O)NC1=O)C2C(C(C(O2)CO)O)O',
            'glucose': 'C([C@@H]1[C@H]([C@@H]([C@H]([C@H](O1)O)O)O)O)O'
        }
        
        # IUPAC names for compounds
        self.iupac_names = {
            'aspirin': '2-acetoxybenzoic acid',
            'ibuprofen': '2-(4-isobutylphenyl)propionic acid',
            'paracetamol': 'N-(4-hydroxyphenyl)acetamide',
            'acetaminophen': 'N-(4-hydroxyphenyl)acetamide',
            'caffeine': '1,3,7-trimethylpurine-2,6-dione',
            'morphine': '(5α,6α)-7,8-didehydro-4,5-epoxy-17-methylmorphinan-3,6-diol',
            'codeine': '(5α,6α)-7,8-didehydro-4,5-epoxy-3-methoxy-17-methylmorphinan-6-ol',
            'nicotine': '3-(1-methylpyrrolidin-2-yl)pyridine',
            'ethanol': 'ethyl alcohol',
            'methanol': 'methyl alcohol',
            'benzene': 'benzene',
            'glucose': 'D-glucose',
            'naproxen': '2-(6-methoxynaphthalen-2-yl)propionic acid',
            'amoxicillin': '(2S,5R,6R)-6-[[(2R)-2-amino-2-(4-hydroxyphenyl)acetyl]amino]-3,3-dimethyl-7-oxo-4-thia-1-azabicyclo[3.2.0]heptane-2-carboxylic acid',
            'metformin': 'N,N-dimethylimidodicarbonimidic diamide',
            'adrenaline': '(R)-4-(1-hydroxy-2-(methylamino)ethyl)benzene-1,2-diol',
            'epinephrine': '(R)-4-(1-hydroxy-2-(methylamino)ethyl)benzene-1,2-diol'
        }
        
        # Functional groups detection patterns
        self.functional_groups = {
            'hydroxyl': r'O[H]',
            'carboxyl': r'C\(=O\)O[H]?',
            'carbonyl': r'C=O',
            'amine': r'N[H]?[H]?',
            'amide': r'C\(=O\)N',
            'ester': r'C\(=O\)O[^H]',
            'ether': r'[^H]O[^H]',
            'phenyl': r'c1ccccc1',
            'methyl': r'C[H]?[H]?[H]?',
            'nitro': r'N\(=O\)=O',
            'sulfonate': r'S\(=O\)\(=O\)',
            'phosphate': r'P\(=O\)'
        }
        
        # Common patterns for SMILES detection
        self.smiles_pattern = re.compile(r'^[A-Za-z0-9@+\-\[\]()=#:/.\\%]+$')
    
    def format_molecular_formula(self, formula: str) -> str:
        """Format molecular formula with proper subscripts"""
        subscript_map = str.maketrans('0123456789', '₀₁₂₃₄₅₆₇₈₉')
        return formula.translate(subscript_map)
    
    def get_iupac_name(self, compound_name: str) -> str:
        """Get IUPAC name for compound"""
        return self.iupac_names.get(compound_name.lower(), 'IUPAC name not available')
    
    def detect_functional_groups(self, smiles: str) -> list:
        """Detect functional groups in SMILES string"""
        detected_groups = []
        for group_name, pattern in self.functional_groups.items():
            if re.search(pattern, smiles, re.IGNORECASE):
                detected_groups.append(group_name)
        return detected_groups
    
    def suggest_similar_compounds(self, query: str) -> list:
        """Suggest similar compounds based on query"""
        query_lower = query.lower()
        suggestions = []
        
        # Exact matches first
        for compound in self.compound_database.keys():
            if compound in query_lower:
                suggestions.append(compound)
        
        # Partial matches
        for compound in self.compound_database.keys():
            if any(word in compound for word in query_lower.split()) and compound not in suggestions:
                suggestions.append(compound)
        
        # Limit to top 5 suggestions
        return suggestions[:5]
    
    def extract_compound_name(self, query: str) -> str:
        """Extract compound name from natural language query"""
        query_lower = query.lower()
        
        # Look for known compounds in the query
        for compound_name in self.compound_database.keys():
            if compound_name in query_lower:
                return compound_name
        
        # Try to extract compound name from common patterns
        patterns = [
            r'structure of (\w+)',
            r'analyze (\w+)',
            r'properties of (\w+)',
            r'show me (\w+)',
            r'what is (\w+)',
            r'compound (\w+)',
            r'drug (\w+)',
            r'molecule (\w+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, query_lower)
            if match:
                potential_name = match.group(1)
                if potential_name in self.compound_database:
                    return potential_name
        
        return "unknown compound"
    
    def is_smiles_string(self, text: str) -> bool:
        """Check if text appears to be a SMILES string"""
        text = text.strip()
        
        # Basic SMILES validation
        if len(text) < 2:
            return False
        
        # Must contain at least one letter (atom symbol)
        if not re.search(r'[A-Za-z]', text):
            return False
        
        # Check for common SMILES characters
        if self.smiles_pattern.match(text):
            # Additional checks for valid SMILES patterns
            if any(char in text for char in 'CNOSPFClBrI'):
                return True
        
        return False
    
    def validate_smiles_format(self, smiles: str) -> Dict[str, Any]:
        """Validate SMILES format and provide feedback"""
        if not smiles or len(smiles.strip()) < 2:
            return {
                'valid': False,
                'error': 'SMILES string too short',
                'suggestions': ['Try a longer SMILES string', 'Use a compound name instead']
            }
        
        # Check for balanced parentheses and brackets
        if smiles.count('(') != smiles.count(')'):
            return {
                'valid': False,
                'error': 'Unbalanced parentheses in SMILES',
                'suggestions': ['Check parentheses are properly closed']
            }
        
        if smiles.count('[') != smiles.count(']'):
            return {
                'valid': False,
                'error': 'Unbalanced brackets in SMILES',
                'suggestions': ['Check brackets are properly closed']
            }
        
        # Check for valid atom symbols
        if not re.search(r'[CNOSPFClBrI]', smiles):
            return {
                'valid': False,
                'error': 'No recognizable atom symbols found',
                'suggestions': ['Include common atoms like C, N, O, S']
            }
        
        return {'valid': True}
    
    def query_to_smiles(self, query: str) -> Dict[str, Any]:
        """Convert natural language query to SMILES string"""
        try:
            query = query.strip()
            
            # Check if query is already a SMILES string
            if self.is_smiles_string(query):
                validation = self.validate_smiles_format(query)
                if validation['valid']:
                    return {
                        'success': True,
                        'smiles': query,
                        'name': 'Unknown Compound',
                        'iupac_name': 'IUPAC name not available',
                        'functional_groups': self.detect_functional_groups(query),
                        'method': 'direct_smiles'
                    }
                else:
                    return {
                        'success': False,
                        'error': validation['error'],
                        'suggestions': validation['suggestions']
                    }
            
            # Extract compound name from query
            compound_name = self.extract_compound_name(query)
            
            # Look up SMILES in database
            if compound_name in self.compound_database:
                smiles = self.compound_database[compound_name]
                return {
                    'success': True,
                    'smiles': smiles,
                    'name': compound_name.title(),
                    'iupac_name': self.get_iupac_name(compound_name),
                    'functional_groups': self.detect_functional_groups(smiles),
                    'method': 'database_lookup'
                }
            
            # If no compound found, try to use the query as a compound name directly
            query_clean = re.sub(r'[^\w\s]', '', query.lower())
            words = query_clean.split()
            
            for word in words:
                if word in self.compound_database:
                    smiles = self.compound_database[word]
                    return {
                        'success': True,
                        'smiles': smiles,
                        'name': word.title(),
                        'iupac_name': self.get_iupac_name(word),
                        'functional_groups': self.detect_functional_groups(smiles),
                        'method': 'word_match'
                    }
            
            # Suggest similar compounds
            suggestions = self.suggest_similar_compounds(query)
            
            # Final fallback - return error with suggestions
            return {
                'success': False,
                'error': f'Could not identify compound from query: "{query}". Try using a known compound name or SMILES string.',
                'suggestions': suggestions if suggestions else list(self.compound_database.keys())[:10]
            }
            
        except Exception as e:
            logger.error(f"LLM processing error: {e}")
            return {
                'success': False,
                'error': f'Failed to process query: {str(e)}'
            }
    
    def get_available_compounds(self) -> list:
        """Get list of available compounds in database"""
        return sorted(self.compound_database.keys())
    
    def add_compound(self, name: str, smiles: str, iupac_name: str = None) -> bool:
        """Add new compound to database"""
        try:
            name_clean = name.lower().strip()
            self.compound_database[name_clean] = smiles
            if iupac_name:
                self.iupac_names[name_clean] = iupac_name
            logger.info(f"Added compound: {name} -> {smiles}")
            return True
        except Exception as e:
            logger.error(f"Failed to add compound: {e}")
            return False
    
    def get_compound_info(self, compound_name: str) -> Dict[str, Any]:
        """Get comprehensive compound information"""
        name_lower = compound_name.lower()
        if name_lower in self.compound_database:
            smiles = self.compound_database[name_lower]
            return {
                'name': compound_name.title(),
                'smiles': smiles,
                'iupac_name': self.get_iupac_name(name_lower),
                'functional_groups': self.detect_functional_groups(smiles)
            }
        return None