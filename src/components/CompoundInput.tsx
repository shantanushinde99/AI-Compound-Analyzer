import React, { useState } from 'react';
import { Search, Zap, HelpCircle, Loader, Lightbulb, ChevronDown } from 'lucide-react';
import { EXAMPLE_COMPOUNDS, ANALYSIS_TIPS } from '../utils/constants';
import SMILESValidator from './SMILESValidator';

interface CompoundInputProps {
  onAnalyze: (query: string) => void;
  isLoading: boolean;
}

const CompoundInput: React.FC<CompoundInputProps> = ({ onAnalyze, isLoading }) => {
  const [query, setQuery] = useState('');
  const [showTips, setShowTips] = useState(false);
  const [showCompoundList, setShowCompoundList] = useState(false);
  const [isValidSMILES, setIsValidSMILES] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading && isValidSMILES) {
      onAnalyze(query.trim());
    }
  };

  const handleExampleClick = (compound: string) => {
    setQuery(`Analyze the structure and properties of ${compound}`);
    setShowCompoundList(false);
  };

  const handleCompoundSelect = (compound: string) => {
    setQuery(compound);
    setShowCompoundList(false);
  };

  const isSMILESLike = (text: string): boolean => {
    // Simple heuristic to detect if input might be SMILES
    const smilesPattern = /^[A-Za-z0-9@+\-\[\]()=#:/.\\%]+$/;
    return smilesPattern.test(text.trim()) && 
           text.includes('C') && 
           text.length > 3 && 
           !text.includes(' ');
  };

  const getSuggestions = () => {
    if (!query.trim()) return [];
    
    const queryLower = query.toLowerCase();
    return EXAMPLE_COMPOUNDS.filter(compound => 
      compound.toLowerCase().includes(queryLower) ||
      queryLower.includes(compound.toLowerCase())
    ).slice(0, 5);
  };

  const suggestions = getSuggestions();

  // Group compounds by category for better organization
  const compoundCategories = {
    'Pain Relievers': ['aspirin', 'ibuprofen', 'paracetamol', 'naproxen'],
    'Stimulants': ['caffeine', 'nicotine', 'methamphetamine'],
    'Opioids': ['morphine', 'codeine'],
    'Antibiotics': ['penicillin', 'amoxicillin'],
    'Psychoactive': ['thc', 'cocaine', 'lsd'],
    'Hormones': ['adrenaline', 'epinephrine'],
    'Diabetes': ['metformin'],
    'Common Chemicals': ['ethanol', 'acetone', 'chloroform', 'citric acid', 'glucose']
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            AI Compound Analyzer
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter a compound name, SMILES string, or natural language query
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 'Show me the structure of aspirin' or 'CC(=O)OC1=CC=CC=C1C(=O)O'"
            className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 
                     rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowTips(!showTips)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <HelpCircle className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors" />
          </button>
        </div>

        {/* SMILES Validation */}
        {isSMILESLike(query) && (
          <SMILESValidator 
            smiles={query} 
            onValidationChange={setIsValidSMILES}
          />
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && query.length > 2 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              Did you mean:
            </h4>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setQuery(suggestion)}
                  className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 
                           hover:bg-blue-200 dark:hover:bg-blue-800
                           text-blue-800 dark:text-blue-200 rounded-md
                           transition-colors duration-200 capitalize"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={!query.trim() || isLoading || !isValidSMILES}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400
                     text-white font-medium rounded-lg transition-all duration-200
                     flex items-center gap-2 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Analyze
              </>
            )}
          </button>

          {/* Quick Examples */}
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_COMPOUNDS.slice(0, 4).map((compound) => (
              <button
                key={compound}
                type="button"
                onClick={() => handleExampleClick(compound)}
                disabled={isLoading}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 
                         hover:bg-gray-200 dark:hover:bg-gray-600
                         text-gray-700 dark:text-gray-300 rounded-md
                         transition-colors duration-200 capitalize
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {compound}
              </button>
            ))}
          </div>

          {/* Show All Compounds Button */}
          <button
            type="button"
            onClick={() => setShowCompoundList(!showCompoundList)}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 
                     hover:bg-green-200 dark:hover:bg-green-800
                     text-green-800 dark:text-green-200 rounded-md
                     transition-colors duration-200 flex items-center gap-1
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            All Compounds ({EXAMPLE_COMPOUNDS.length})
            <ChevronDown className={`w-3 h-3 transition-transform ${showCompoundList ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Full Compound List */}
        {showCompoundList && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Available Compounds ({EXAMPLE_COMPOUNDS.length} total):
            </h4>
            <div className="space-y-3">
              {Object.entries(compoundCategories).map(([category, compounds]) => (
                <div key={category}>
                  <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                    {category}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {compounds.map((compound) => (
                      <button
                        key={compound}
                        type="button"
                        onClick={() => handleCompoundSelect(compound)}
                        className="px-3 py-1 text-sm bg-white dark:bg-gray-600 
                                 hover:bg-blue-50 dark:hover:bg-blue-900
                                 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300
                                 border border-gray-200 dark:border-gray-500 rounded-md
                                 transition-colors duration-200 capitalize"
                      >
                        {compound}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showTips && (
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
              💡 Analysis Tips:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              {ANALYSIS_TIPS.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default CompoundInput;