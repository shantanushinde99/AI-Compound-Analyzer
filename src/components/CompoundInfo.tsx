import React, { useState } from 'react';
import { Copy, Check, Info, Beaker, AlertTriangle } from 'lucide-react';
import { CompoundAnalysis } from '../utils/constants';

interface CompoundInfoProps {
  analysis: CompoundAnalysis;
}

const CompoundInfo: React.FC<CompoundInfoProps> = ({ analysis }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatMolecularFormula = (formula: string): string => {
    return formula.replace(/(\d+)/g, (match) => {
      const subscriptMap: { [key: string]: string } = {
        '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
        '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
      };
      return match.split('').map(digit => subscriptMap[digit] || digit).join('');
    });
  };

  const getToxicityWarnings = () => {
    const warnings = [];
    
    if (analysis.properties.logP > 5) {
      warnings.push('High lipophilicity may cause toxicity');
    }
    
    if (analysis.properties.molecularWeight > 600) {
      warnings.push('High molecular weight may limit bioavailability');
    }
    
    if (analysis.admet.cyp450Inhibition.length > 0) {
      warnings.push(`Potential CYP450 interactions: ${analysis.admet.cyp450Inhibition.join(', ')}`);
    }
    
    if (analysis.properties.polarSurfaceArea > 200) {
      warnings.push('Very high polar surface area may limit absorption');
    }
    
    return warnings;
  };

  const warnings = getToxicityWarnings();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Beaker className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Compound Information
        </h3>
      </div>

      <div className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Common Name
              </label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {analysis.name}
                </span>
                <button
                  onClick={() => copyToClipboard(analysis.name, 'name')}
                  className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Copy name"
                >
                  {copiedField === 'name' ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                IUPAC Name
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                  {analysis.iupacName || 'Not available'}
                </span>
                {analysis.iupacName && (
                  <button
                    onClick={() => copyToClipboard(analysis.iupacName!, 'iupac')}
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                    title="Copy IUPAC name"
                  >
                    {copiedField === 'iupac' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Molecular Formula
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xl font-mono text-gray-900 dark:text-white">
                  {formatMolecularFormula(analysis.formula)}
                </span>
                <button
                  onClick={() => copyToClipboard(analysis.formula, 'formula')}
                  className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Copy formula"
                >
                  {copiedField === 'formula' ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                SMILES String
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                  <span className="text-sm font-mono text-gray-900 dark:text-white break-all">
                    {analysis.smiles}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(analysis.smiles, 'smiles')}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Copy SMILES"
                >
                  {copiedField === 'smiles' ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Functional Groups */}
            {analysis.functionalGroups && analysis.functionalGroups.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Functional Groups
                </label>
                <div className="flex flex-wrap gap-2">
                  {analysis.functionalGroups.map((group, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 
                               dark:text-blue-200 rounded-full text-sm font-medium capitalize"
                    >
                      {group}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Facts */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 
                       dark:to-purple-900/30 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Quick Facts
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Molecular Weight</span>
              <div className="font-semibold text-gray-900 dark:text-white">
                {analysis.properties.molecularWeight.toFixed(1)} g/mol
              </div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">LogP</span>
              <div className="font-semibold text-gray-900 dark:text-white">
                {analysis.properties.logP.toFixed(2)}
              </div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">H-Bond Donors</span>
              <div className="font-semibold text-gray-900 dark:text-white">
                {analysis.properties.hbondDonors}
              </div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">H-Bond Acceptors</span>
              <div className="font-semibold text-gray-900 dark:text-white">
                {analysis.properties.hbondAcceptors}
              </div>
            </div>
          </div>
        </div>

        {/* Toxicity Warnings */}
        {warnings.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 
                         rounded-lg p-4">
            <h4 className="font-medium text-red-900 dark:text-red-300 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Potential Concerns
            </h4>
            <ul className="space-y-1">
              {warnings.map((warning, index) => (
                <li key={index} className="text-sm text-red-800 dark:text-red-300 flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Drug-likeness Summary */}
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 
                       rounded-lg p-4">
          <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">
            Drug-likeness Summary
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-green-700 dark:text-green-300">Lipinski Violations:</span>
              <span className="ml-2 font-semibold">
                {analysis.drugLikeness.lipinskiViolations}/4
              </span>
            </div>
            <div>
              <span className="text-green-700 dark:text-green-300">Drug-like:</span>
              <span className="ml-2 font-semibold">
                {analysis.drugLikeness.drugLikeness ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompoundInfo;