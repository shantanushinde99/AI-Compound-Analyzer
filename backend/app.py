"""
AI Compound Analyzer - Backend Server
Powered by RDKit for molecular analysis and LLM for natural language processing
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from molecular_analyzer import MolecularAnalyzer
from llm_processor import LLMProcessor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize components
analyzer = MolecularAnalyzer()
llm_processor = LLMProcessor()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'AI Compound Analyzer Backend is running',
        'rdkit_available': analyzer.is_rdkit_available(),
        'compounds_available': len(llm_processor.get_available_compounds()),
        'version': '1.0.0'
    })

@app.route('/api/analyze', methods=['POST'])
def analyze_compound():
    """Main analysis endpoint"""
    try:
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({
                'success': False,
                'error': 'No query provided'
            }), 400

        query = data['query'].strip()
        if not query:
            return jsonify({
                'success': False,
                'error': 'Empty query provided'
            }), 400

        logger.info(f"Processing query: {query}")

        # Step 1: Process natural language query with LLM
        try:
            smiles_result = llm_processor.query_to_smiles(query)
            if not smiles_result['success']:
                return jsonify({
                    'success': False,
                    'error': f"LLM Processing Error: {smiles_result['error']}",
                    'suggestions': smiles_result.get('suggestions', [])
                })
            
            smiles = smiles_result['smiles']
            compound_name = smiles_result['name']
            iupac_name = smiles_result.get('iupac_name', 'IUPAC name not available')
            functional_groups = smiles_result.get('functional_groups', [])
            
        except Exception as e:
            logger.error(f"LLM processing error: {str(e)}")
            # Fallback: try to use query directly as SMILES
            smiles = query
            compound_name = 'Unknown Compound'
            iupac_name = 'IUPAC name not available'
            functional_groups = []

        # Step 2: Analyze compound with RDKit
        try:
            analysis_result = analyzer.analyze_compound(smiles, compound_name)
            
            if not analysis_result['success']:
                return jsonify({
                    'success': False,
                    'error': f"Molecular Analysis Error: {analysis_result['error']}"
                })

            # Add additional information from LLM processing
            analysis_result['data']['iupacName'] = iupac_name
            analysis_result['data']['functionalGroups'] = functional_groups

            logger.info(f"Successfully analyzed compound: {compound_name}")
            return jsonify({
                'success': True,
                'data': analysis_result['data']
            })

        except Exception as e:
            logger.error(f"Molecular analysis error: {str(e)}")
            return jsonify({
                'success': False,
                'error': f"Failed to analyze molecular structure: {str(e)}"
            })

    except Exception as e:
        logger.error(f"Unexpected server error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f"Server error: {str(e)}"
        }), 500

@app.route('/api/validate-smiles', methods=['POST'])
def validate_smiles():
    """Validate SMILES string endpoint"""
    try:
        data = request.get_json()
        if not data or 'smiles' not in data:
            return jsonify({
                'success': False,
                'error': 'No SMILES provided'
            }), 400

        smiles = data['smiles'].strip()
        is_valid = analyzer.validate_smiles(smiles)
        
        # Get validation details from LLM processor
        validation_details = llm_processor.validate_smiles_format(smiles)
        
        return jsonify({
            'success': True,
            'valid': is_valid,
            'smiles': smiles,
            'validation': validation_details
        })

    except Exception as e:
        logger.error(f"SMILES validation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/compounds', methods=['GET'])
def get_available_compounds():
    """Get list of available compounds"""
    try:
        compounds = llm_processor.get_available_compounds()
        return jsonify({
            'success': True,
            'compounds': compounds,
            'count': len(compounds)
        })
    except Exception as e:
        logger.error(f"Error getting compounds: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # Check if RDKit is available
    if not analyzer.is_rdkit_available():
        logger.error("RDKit is not available! Please install it: pip install rdkit")
        exit(1)
    
    logger.info("Starting AI Compound Analyzer Backend...")
    logger.info("RDKit is available and ready for molecular analysis")
    logger.info(f"Loaded {len(llm_processor.get_available_compounds())} compounds in database")
    
    # Run development server
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        threaded=True
    )