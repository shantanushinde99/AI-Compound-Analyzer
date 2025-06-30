import React, { useState } from 'react';
import { GitCompare, ArrowRight, Zap } from 'lucide-react';
import MoleculeViewer from './MoleculeViewer';
import PropertyComparison from './PropertyComparison';
import { CompoundAnalysis } from '../utils/constants';

interface CompareModeProps {
  onAnalyze: (query: string) => Promise<CompoundAnalysis | null>;
  isLoading: boolean;
}

const CompareMode: React.FC<CompareModeProps> = ({ onAnalyze, isLoading }) => {
  const [compound1, setCompound1] = useState('');
  const [compound2, setCompound2] = useState('');
  const [analysis1, setAnalysis1] = useState<CompoundAnalysis | null>(null);
  const [analysis2, setAnalysis2] = useState<CompoundAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    if (!compound1.trim() || !compound2.trim()) {
      setError('Please enter both compounds to compare');
      return;
    }

    setError(null);
    setAnalysis1(null);
    setAnalysis2(null);

    try {
      const [result1, result2] = await Promise.all([
        onAnalyze(compound1.trim()),
        onAnalyze(compound2.trim())
      ]);

      setAnalysis1(result1);
      setAnalysis2(result2);
    } catch (err) {
      setError('Failed to analyze compounds for comparison');
    }
  };

  const handleQuickCompare = (comp1: string, comp2: string) => {
    setCompound1(comp1);
    setCompound2(comp2);
    // Auto-trigger comparison
    setTimeout(() => {
      handleCompareSpecific(comp1, comp2);
    }, 100);
  };

  const handleCompareSpecific = async (comp1: string, comp2: string) => {
    setError(null);
    setAnalysis1(null);
    setAnalysis2(null);

    try {
      const [result1, result2] = await Promise.all([
        onAnalyze(comp1),
        onAnalyze(comp2)
      ]);

      setAnalysis1(result1);
      setAnalysis2(result2);
    } catch (err) {
      setError('Failed to analyze compounds for comparison');
    }
  };

  const quickComparisons = [
    { comp1: 'aspirin', comp2: 'ibuprofen', label: 'Pain Relievers', category: 'analgesics' },
    { comp1: 'caffeine', comp2: 'nicotine', label: 'Stimulants', category: 'stimulants' },
    { comp1: 'morphine', comp2: 'codeine', label: 'Opioids', category: 'opioids' },
    { comp1: 'penicillin', comp2: 'amoxicillin', label: 'Antibiotics', category: 'antibiotics' },
    { comp1: 'thc', comp2: 'cocaine', label: 'Psychoactive', category: 'psychoactive' },
    { comp1: 'ethanol', comp2: 'methanol', label: 'Alcohols', category: 'alcohols' }
  ];

  // Define compound groups for category comparisons
  const compoundGroups = {
    opioids: ['morphine', 'codeine'],
    antibiotics: ['penicillin', 'amoxicillin'],
    stimulants: ['caffeine', 'nicotine', 'methamphetamine'],
    analgesics: ['aspirin', 'ibuprofen', 'paracetamol', 'naproxen'],
    psychoactive: ['thc', 'cocaine', 'lsd'],
    alcohols: ['ethanol', 'methanol']
  };

  const handleCategoryCompare = (category: string) => {
    const compounds = compoundGroups[category as keyof typeof compoundGroups];
    if (compounds && compounds.length >= 2) {
      handleQuickCompare(compounds[0], compounds[1]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Compare Input */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <GitCompare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Compare Compounds
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Analyze and compare two compounds side-by-side
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Compound
            </label>
            <input
              type="text"
              value={compound1}
              onChange={(e) => setCompound1(e.target.value)}
              placeholder="e.g., aspirin or CC(=O)OC1=CC=CC=C1C(=O)O"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       placeholder-gray-500 dark:placeholder-gray-400
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Second Compound
            </label>
            <input
              type="text"
              value={compound2}
              onChange={(e) => setCompound2(e.target.value)}
              placeholder="e.g., ibuprofen or CC(C)CC1=CC=C(C=C1)C(C)C(=O)O"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       placeholder-gray-500 dark:placeholder-gray-400
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleCompare}
            disabled={isLoading || !compound1.trim() || !compound2.trim()}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400
                     text-white font-medium rounded-lg transition-all duration-200
                     flex items-center gap-2 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Comparing...
              </>
            ) : (
              <>
                <GitCompare className="w-4 h-4" />
                Compare
              </>
            )}
          </button>

          <div className="flex flex-wrap gap-2">
            {quickComparisons.map(({ comp1, comp2, label, category }) => (
              <button
                key={`${comp1}-${comp2}`}
                onClick={() => handleQuickCompare(comp1, comp2)}
                disabled={isLoading}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 
                         hover:bg-gray-200 dark:hover:bg-gray-600
                         text-gray-700 dark:text-gray-300 rounded-md
                         transition-colors duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Quick Compare Buttons */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quick Category Comparisons:
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(compoundGroups).map(([category, compounds]) => (
              <button
                key={category}
                onClick={() => handleCategoryCompare(category)}
                disabled={isLoading}
                className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 
                         hover:bg-blue-200 dark:hover:bg-blue-800
                         text-blue-800 dark:text-blue-200 rounded-md
                         transition-colors duration-200 capitalize
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {category} ({compounds.length})
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 
                         rounded-lg p-3">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>

      {/* Comparison Results */}
      {(analysis1 || analysis2) && (
        <div className="space-y-6">
          {/* 3D Structures Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              {analysis1 ? (
                <MoleculeViewer 
                  molBlock={analysis1.structure3D} 
                  compoundName={analysis1.name}
                  functionalGroups={analysis1.functionalGroups}
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-96 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Failed to analyze first compound</p>
                </div>
              )}
            </div>
            <div>
              {analysis2 ? (
                <MoleculeViewer 
                  molBlock={analysis2.structure3D} 
                  compoundName={analysis2.name}
                  functionalGroups={analysis2.functionalGroups}
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-96 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Failed to analyze second compound</p>
                </div>
              )}
            </div>
          </div>

          {/* Property Comparison */}
          {analysis1 && analysis2 && (
            <PropertyComparison analysis1={analysis1} analysis2={analysis2} />
          )}
        </div>
      )}
    </div>
  );
};

export default CompareMode;