"""
Molecular Analysis Module using RDKit
Handles SMILES processing, 3D structure generation, and property calculations
"""

import logging
from typing import Dict, Any, Optional
import numpy as np

try:
    from rdkit import Chem
    from rdkit.Chem import AllChem, Descriptors, rdMolDescriptors, Crippen
    from rdkit.Chem.rdMolDescriptors import CalcNumRotatableBonds, CalcTPSA
    RDKIT_AVAILABLE = True
except ImportError:
    RDKIT_AVAILABLE = False

logger = logging.getLogger(__name__)

class MolecularAnalyzer:
    """RDKit-based molecular analyzer for compound structure and properties"""
    
    def __init__(self):
        self.rdkit_available = RDKIT_AVAILABLE
        if not self.rdkit_available:
            logger.warning("RDKit not available - molecular analysis will be limited")
    
    def is_rdkit_available(self) -> bool:
        """Check if RDKit is properly installed"""
        return self.rdkit_available
    
    def validate_smiles(self, smiles: str) -> bool:
        """Validate SMILES string"""
        if not self.rdkit_available:
            return False
        
        try:
            mol = Chem.MolFromSmiles(smiles)
            return mol is not None
        except Exception as e:
            logger.error(f"SMILES validation error: {e}")
            return False
    
    def generate_3d_structure(self, mol) -> Optional[str]:
        """Generate 3D conformer and return MOL block"""
        try:
            # Add hydrogens for proper 3D structure
            mol_with_h = Chem.AddHs(mol)
            
            # Generate 3D conformer
            result = AllChem.EmbedMolecule(mol_with_h, randomSeed=42)
            if result != 0:
                # Try with different parameters if embedding fails
                result = AllChem.EmbedMolecule(mol_with_h, useRandomCoords=True, randomSeed=42)
            
            if result == 0:
                # Optimize geometry
                AllChem.MMFFOptimizeMolecule(mol_with_h)
                
                # Return MOL block for 3Dmol.js
                return Chem.MolToMolBlock(mol_with_h)
            else:
                logger.warning("Failed to generate 3D conformer")
                return None
                
        except Exception as e:
            logger.error(f"3D structure generation error: {e}")
            return None
    
    def calculate_properties(self, mol) -> Dict[str, float]:
        """Calculate molecular properties using RDKit descriptors"""
        try:
            return {
                'molecularWeight': Descriptors.MolWt(mol),
                'logP': Crippen.MolLogP(mol),
                'hbondDonors': rdMolDescriptors.CalcNumHBD(mol),
                'hbondAcceptors': rdMolDescriptors.CalcNumHBA(mol),
                'rotatablebonds': CalcNumRotatableBonds(mol),
                'polarSurfaceArea': CalcTPSA(mol),
                'heavyAtomCount': mol.GetNumHeavyAtoms(),
                'ringCount': rdMolDescriptors.CalcNumRings(mol),
                'aromaticRings': rdMolDescriptors.CalcNumAromaticRings(mol),
                'heteroAtoms': rdMolDescriptors.CalcNumHeteroatoms(mol)
            }
        except Exception as e:
            logger.error(f"Property calculation error: {e}")
            return {}
    
    def assess_drug_likeness(self, properties: Dict[str, float]) -> Dict[str, Any]:
        """Assess drug-likeness using Lipinski's Rule of Five and other rules"""
        try:
            # Lipinski's Rule of Five violations
            lipinski_violations = 0
            if properties['molecularWeight'] > 500:
                lipinski_violations += 1
            if properties['logP'] > 5:
                lipinski_violations += 1
            if properties['hbondDonors'] > 5:
                lipinski_violations += 1
            if properties['hbondAcceptors'] > 10:
                lipinski_violations += 1
            
            # Veber's rule violations
            veber_violations = 0
            if properties['rotatablebonds'] > 10:
                veber_violations += 1
            if properties['polarSurfaceArea'] > 140:
                veber_violations += 1
            
            # Lead-likeness (more restrictive)
            lead_like = (
                properties['molecularWeight'] <= 350 and
                properties['logP'] <= 3 and
                properties['rotatablebonds'] <= 7
            )
            
            # Drug-likeness assessment
            drug_like = lipinski_violations <= 1 and veber_violations == 0
            
            return {
                'lipinskiViolations': lipinski_violations,
                'veberViolations': veber_violations,
                'leadLikeness': lead_like,
                'drugLikeness': drug_like
            }
            
        except Exception as e:
            logger.error(f"Drug-likeness assessment error: {e}")
            return {
                'lipinskiViolations': 0,
                'veberViolations': 0,
                'leadLikeness': False,
                'drugLikeness': False
            }
    
    def predict_admet(self, properties: Dict[str, float]) -> Dict[str, Any]:
        """Predict ADMET properties using simple rules and known relationships"""
        try:
            # Blood-brain barrier permeability (simplified prediction)
            bbb_score = properties['logP'] - properties['polarSurfaceArea'] / 100
            if bbb_score > 0 and properties['polarSurfaceArea'] < 90:
                bbb_prediction = "Likely to cross BBB"
            elif bbb_score < -1 or properties['polarSurfaceArea'] > 140:
                bbb_prediction = "Unlikely to cross BBB"
            else:
                bbb_prediction = "Moderate BBB permeability"
            
            # Human intestinal absorption
            if properties['polarSurfaceArea'] < 140 and properties['molecularWeight'] < 500:
                hia_prediction = "High absorption expected"
            elif properties['polarSurfaceArea'] > 200 or properties['molecularWeight'] > 800:
                hia_prediction = "Poor absorption expected"
            else:
                hia_prediction = "Moderate absorption expected"
            
            # CYP450 inhibition (very basic prediction)
            cyp_inhibition = []
            if properties['molecularWeight'] > 300 and properties['logP'] > 2:
                cyp_inhibition.extend(['CYP3A4', 'CYP2D6'])
            if properties['heteroAtoms'] > 5:
                cyp_inhibition.append('CYP2C9')
            
            # Toxicity assessment (basic)
            if properties['logP'] > 5 or properties['molecularWeight'] > 600:
                toxicity = "Potential toxicity concerns"
            elif properties['heteroAtoms'] > 8:
                toxicity = "Monitor for metabolic issues"
            else:
                toxicity = "Low toxicity expected"
            
            return {
                'bloodBrainBarrier': bbb_prediction,
                'humanIntestinalAbsorption': hia_prediction,
                'cyp450Inhibition': cyp_inhibition,
                'toxicity': toxicity
            }
            
        except Exception as e:
            logger.error(f"ADMET prediction error: {e}")
            return {
                'bloodBrainBarrier': 'Unknown',
                'humanIntestinalAbsorption': 'Unknown',
                'cyp450Inhibition': [],
                'toxicity': 'Unknown'
            }
    
    def analyze_compound(self, smiles: str, compound_name: str = "Unknown") -> Dict[str, Any]:
        """Complete compound analysis pipeline"""
        if not self.rdkit_available:
            return {
                'success': False,
                'error': 'RDKit is not available for molecular analysis'
            }
        
        try:
            # Parse SMILES
            mol = Chem.MolFromSmiles(smiles)
            if mol is None:
                return {
                    'success': False,
                    'error': f'Invalid SMILES string: {smiles}'
                }
            
            # Calculate properties
            properties = self.calculate_properties(mol)
            if not properties:
                return {
                    'success': False,
                    'error': 'Failed to calculate molecular properties'
                }
            
            # Generate 3D structure
            structure_3d = self.generate_3d_structure(mol)
            if not structure_3d:
                logger.warning("Using 2D structure as 3D generation failed")
                structure_3d = Chem.MolToMolBlock(mol)
            
            # Assess drug-likeness
            drug_likeness = self.assess_drug_likeness(properties)
            
            # Predict ADMET properties
            admet = self.predict_admet(properties)
            
            # Get molecular formula
            formula = rdMolDescriptors.CalcMolFormula(mol)
            
            return {
                'success': True,
                'data': {
                    'smiles': smiles,
                    'name': compound_name,
                    'formula': formula,
                    'properties': properties,
                    'drugLikeness': drug_likeness,
                    'admet': admet,
                    'structure3D': structure_3d
                }
            }
            
        except Exception as e:
            logger.error(f"Compound analysis error: {e}")
            return {
                'success': False,
                'error': f'Analysis failed: {str(e)}'
            }