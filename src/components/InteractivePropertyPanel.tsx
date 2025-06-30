import React, { useState } from 'react';
import { HelpCircle, Info, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { CompoundAnalysis } from '../utils/constants';

interface InteractivePropertyPanelProps {
  analysis: CompoundAnalysis;
}

const InteractivePropertyPanel: React.FC<InteractivePropertyPanelProps> = ({ analysis }) => {
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null);

  const propertyInsights = {
    molecularWeight: {
      explanation: "Molecular weight affects drug absorption, distribution, and elimination. The 'Rule of 5' suggests optimal drugs have MW < 500 Da.",
      interpretation: analysis.properties.molecularWeight > 500 
        ? "⚠️ High molecular weight may limit oral bioavailability" 
        : "✅ Good molecular weight for drug-like properties",
      suggestions: analysis.properties.molecularWeight > 500 
        ? ["Consider removing non-essential functional groups", "Fragment into smaller, linked molecules"]
        : ["Molecular weight is within optimal range"]
    },
    logP: {
      explanation: "LogP measures lipophilicity - how well a compound dissolves in fats vs water. Optimal range is typically 0-3 for drugs.",
      interpretation: analysis.properties.logP > 5 
        ? "⚠️ Very lipophilic - may have poor solubility and toxicity issues"
        : analysis.properties.logP < 0 
        ? "⚠️ Very hydrophilic - may have poor membrane permeability"
        : "✅ Good lipophilicity balance",
      suggestions: analysis.properties.logP > 5 
        ? ["Add polar groups (OH, NH2, COOH)", "Consider prodrug approach"]
        : analysis.properties.logP < 0
        ? ["Add lipophilic groups", "Consider ester or ether linkages"]
        : ["LogP is in optimal range"]
    },
    hbondDonors: {
      explanation: "Hydrogen bond donors (NH, OH groups) affect permeability. Lipinski's rule suggests ≤5 donors for good oral absorption.",
      interpretation: analysis.properties.hbondDonors > 5 
        ? "⚠️ Too many H-bond donors may limit permeability"
        : "✅ H-bond donor count supports good permeability",
      suggestions: analysis.properties.hbondDonors > 5 
        ? ["Convert OH groups to ethers", "Replace NH2 with less polar groups"]
        : ["H-bond donor count is optimal"]
    },
    hbondAcceptors: {
      explanation: "Hydrogen bond acceptors (N, O atoms) also affect permeability. Lipinski's rule suggests ≤10 acceptors.",
      interpretation: analysis.properties.hbondAcceptors > 10 
        ? "⚠️ Too many H-bond acceptors may limit permeability"
        : "✅ H-bond acceptor count supports good permeability",
      suggestions: analysis.properties.hbondAcceptors > 10 
        ? ["Reduce carbonyl groups", "Consider less polar alternatives"]
        : ["H-bond acceptor count is optimal"]
    },
    rotatablebonds: {
      explanation: "Rotatable bonds indicate molecular flexibility. Too many (>10) can reduce oral bioavailability.",
      interpretation: analysis.properties.rotatablebonds > 10 
        ? "⚠️ High flexibility may reduce bioavailability"
        : analysis.properties.rotatablebonds < 3
        ? "ℹ️ Very rigid structure - may affect binding"
        : "✅ Good flexibility balance",
      suggestions: analysis.properties.rotatablebonds > 10 
        ? ["Introduce ring constraints", "Replace flexible linkers with rigid ones"]
        : ["Rotatable bond count is reasonable"]
    },
    polarSurfaceArea: {
      explanation: "Polar Surface Area (PSA) predicts drug transport properties. PSA < 140 Ų typically needed for good permeability.",
      interpretation: analysis.properties.polarSurfaceArea > 140 
        ? "⚠️ High PSA may limit membrane permeability"
        : "✅ PSA supports good membrane permeability",
      suggestions: analysis.properties.polarSurfaceArea > 140 
        ? ["Reduce polar functional groups", "Consider masking polar groups as prodrugs"]
        : ["Polar surface area is optimal"]
    }
  };

  const PropertyInsightCard: React.FC<{
    propertyKey: string;
    title: string;
    value: number;
    unit?: string;
  }> = ({ propertyKey, title, value, unit = '' }) => {
    const insight = propertyInsights[propertyKey as keyof typeof propertyInsights];
    const isExpanded = expandedProperty === propertyKey;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => setExpandedProperty(isExpanded ? null : propertyKey)}
          className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {value.toFixed(2)}{unit}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-gray-400" />
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        </button>

        {isExpanded && insight && (
          <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <div className="pt-4 space-y-3">
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-1 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  What does this mean?
                </h5>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {insight.explanation}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                  Interpretation:
                </h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {insight.interpretation}
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-3">
                <h5 className="font-medium text-yellow-900 dark:text-yellow-300 mb-1 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Suggestions:
                </h5>
                <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
                  {insight.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Interactive Property Analysis
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 ml-2">
          Click on properties to learn more
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PropertyInsightCard
          propertyKey="molecularWeight"
          title="Molecular Weight"
          value={analysis.properties.molecularWeight}
          unit=" g/mol"
        />
        <PropertyInsightCard
          propertyKey="logP"
          title="LogP (Lipophilicity)"
          value={analysis.properties.logP}
        />
        <PropertyInsightCard
          propertyKey="hbondDonors"
          title="H-Bond Donors"
          value={analysis.properties.hbondDonors}
        />
        <PropertyInsightCard
          propertyKey="hbondAcceptors"
          title="H-Bond Acceptors"
          value={analysis.properties.hbondAcceptors}
        />
        <PropertyInsightCard
          propertyKey="rotatablebonds"
          title="Rotatable Bonds"
          value={analysis.properties.rotatablebonds}
        />
        <PropertyInsightCard
          propertyKey="polarSurfaceArea"
          title="Polar Surface Area"
          value={analysis.properties.polarSurfaceArea}
          unit=" Ų"
        />
      </div>
    </div>
  );
};

export default InteractivePropertyPanel;