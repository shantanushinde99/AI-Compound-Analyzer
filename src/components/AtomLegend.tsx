import React, { useState } from 'react';
import { Palette, ChevronDown, ChevronUp } from 'lucide-react';
import { ATOM_COLORS } from '../utils/constants';

const AtomLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const commonAtoms = [
    { symbol: 'C', name: 'Carbon', description: 'Backbone of organic molecules' },
    { symbol: 'N', name: 'Nitrogen', description: 'Often in amino groups, rings' },
    { symbol: 'O', name: 'Oxygen', description: 'In alcohols, carbonyls, ethers' },
    { symbol: 'H', name: 'Hydrogen', description: 'Most abundant atom' },
    { symbol: 'S', name: 'Sulfur', description: 'In amino acids, drugs' },
    { symbol: 'P', name: 'Phosphorus', description: 'In phosphates, DNA/RNA' },
    { symbol: 'F', name: 'Fluorine', description: 'Common in pharmaceuticals' },
    { symbol: 'Cl', name: 'Chlorine', description: 'Halogen substituent' }
  ];

  const lessCommonAtoms = [
    { symbol: 'Br', name: 'Bromine', description: 'Larger halogen' },
    { symbol: 'I', name: 'Iodine', description: 'Heaviest common halogen' },
    { symbol: 'Na', name: 'Sodium', description: 'Metal ion' },
    { symbol: 'K', name: 'Potassium', description: 'Metal ion' },
    { symbol: 'Ca', name: 'Calcium', description: 'Metal ion' },
    { symbol: 'Mg', name: 'Magnesium', description: 'Metal ion' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 
                 dark:hover:bg-gray-600 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Atom Color Legend
            </h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Common Atoms */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Common Elements
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {commonAtoms.map(({ symbol, name, description }) => (
                <div
                  key={symbol}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg
                           hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-500 flex-shrink-0"
                    style={{ 
                      backgroundColor: ATOM_COLORS[symbol as keyof typeof ATOM_COLORS] || ATOM_COLORS.default,
                      boxShadow: symbol === 'H' ? '0 0 0 1px #666' : 'none'
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-gray-900 dark:text-white">
                        {symbol}
                      </span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Less Common Atoms */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Other Elements
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {lessCommonAtoms.map(({ symbol, name, description }) => (
                <div
                  key={symbol}
                  className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg
                           hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  title={description}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-500 flex-shrink-0"
                    style={{ 
                      backgroundColor: ATOM_COLORS[symbol as keyof typeof ATOM_COLORS] || ATOM_COLORS.default
                    }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-bold text-xs text-gray-900 dark:text-white">
                        {symbol}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Color Scheme Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 
                         rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              🎨 Color Scheme
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              Colors follow the standard <strong>Jmol/PyMOL</strong> convention used in molecular visualization software worldwide.
            </p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• <strong>CPK colors:</strong> Based on element properties and visibility</li>
              <li>• <strong>Consistent:</strong> Same colors across all scientific software</li>
              <li>• <strong>Intuitive:</strong> Red for oxygen, blue for nitrogen, etc.</li>
            </ul>
          </div>

          {/* Interactive Tips */}
          <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-300 mb-2">
              💡 Viewing Tips
            </h4>
            <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
              <li>• Hover over atoms in the 3D viewer to see element info</li>
              <li>• Different visualization styles may show atoms differently</li>
              <li>• Bond colors typically match the connected atoms</li>
              <li>• Use this legend to identify functional groups quickly</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtomLegend;