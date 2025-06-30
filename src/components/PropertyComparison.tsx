import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle } from 'lucide-react';
import { CompoundAnalysis } from '../utils/constants';

interface PropertyComparisonProps {
  analysis1: CompoundAnalysis;
  analysis2: CompoundAnalysis;
}

const PropertyComparison: React.FC<PropertyComparisonProps> = ({ analysis1, analysis2 }) => {
  const ComparisonRow: React.FC<{
    label: string;
    value1: number | string;
    value2: number | string;
    unit?: string;
    higherIsBetter?: boolean;
    description: string;
  }> = ({ label, value1, value2, unit = '', higherIsBetter = false, description }) => {
    const numValue1 = typeof value1 === 'number' ? value1 : parseFloat(value1.toString());
    const numValue2 = typeof value2 === 'number' ? value2 : parseFloat(value2.toString());
    
    let comparison = 'equal';
    let icon = <Minus className="w-4 h-4 text-gray-400" />;
    
    if (!isNaN(numValue1) && !isNaN(numValue2)) {
      if (numValue1 > numValue2) {
        comparison = higherIsBetter ? 'better1' : 'worse1';
        icon = higherIsBetter ? 
          <TrendingUp className="w-4 h-4 text-green-500" /> : 
          <TrendingDown className="w-4 h-4 text-red-500" />;
      } else if (numValue1 < numValue2) {
        comparison = higherIsBetter ? 'worse1' : 'better1';
        icon = higherIsBetter ? 
          <TrendingDown className="w-4 h-4 text-red-500" /> : 
          <TrendingUp className="w-4 h-4 text-green-500" />;
      }
    }

    return (
      <div className="grid grid-cols-5 gap-4 py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
        <div className="col-span-2">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        <div className="text-center">
          <p className={`font-semibold ${comparison === 'better1' ? 'text-green-600' : comparison === 'worse1' ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
            {typeof value1 === 'number' ? value1.toFixed(2) : value1}{unit}
          </p>
        </div>
        <div className="flex justify-center">
          {icon}
        </div>
        <div className="text-center">
          <p className={`font-semibold ${comparison === 'better1' ? 'text-red-600' : comparison === 'worse1' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
            {typeof value2 === 'number' ? value2.toFixed(2) : value2}{unit}
          </p>
        </div>
      </div>
    );
  };

  const DrugLikenessComparison: React.FC<{
    label: string;
    value1: boolean | number;
    value2: boolean | number;
    isViolation?: boolean;
  }> = ({ label, value1, value2, isViolation = false }) => {
    const getBetter = (val: boolean | number) => {
      if (typeof val === 'boolean') return val;
      return isViolation ? val === 0 : val > 0;
    };

    const better1 = getBetter(value1);
    const better2 = getBetter(value2);

    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {better1 ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm font-semibold">
              {typeof value1 === 'boolean' ? (value1 ? 'Yes' : 'No') : value1}
            </span>
          </div>
          <div className="w-8 text-center">
            <span className="text-gray-400">vs</span>
          </div>
          <div className="flex items-center gap-1">
            {better2 ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm font-semibold">
              {typeof value2 === 'boolean' ? (value2 ? 'Yes' : 'No') : value2}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Property Comparison
        </h3>
        <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
          <div className="col-span-2">Property</div>
          <div className="text-center">{analysis1.name}</div>
          <div className="text-center">Comparison</div>
          <div className="text-center">{analysis2.name}</div>
        </div>
      </div>

      {/* Molecular Properties */}
      <div className="space-y-1">
        <ComparisonRow
          label="Molecular Weight"
          value1={analysis1.properties.molecularWeight}
          value2={analysis2.properties.molecularWeight}
          unit=" g/mol"
          description="Mass of the molecule"
        />
        <ComparisonRow
          label="LogP"
          value1={analysis1.properties.logP}
          value2={analysis2.properties.logP}
          description="Lipophilicity (higher = more lipophilic)"
        />
        <ComparisonRow
          label="H-Bond Donors"
          value1={analysis1.properties.hbondDonors}
          value2={analysis2.properties.hbondDonors}
          higherIsBetter={false}
          description="Fewer donors often better for permeability"
        />
        <ComparisonRow
          label="H-Bond Acceptors"
          value1={analysis1.properties.hbondAcceptors}
          value2={analysis2.properties.hbondAcceptors}
          higherIsBetter={false}
          description="Fewer acceptors often better for permeability"
        />
        <ComparisonRow
          label="Rotatable Bonds"
          value1={analysis1.properties.rotatablebonds}
          value2={analysis2.properties.rotatablebonds}
          higherIsBetter={false}
          description="Molecular flexibility (lower = more rigid)"
        />
        <ComparisonRow
          label="Polar Surface Area"
          value1={analysis1.properties.polarSurfaceArea}
          value2={analysis2.properties.polarSurfaceArea}
          unit=" Ų"
          higherIsBetter={false}
          description="Lower PSA often better for permeability"
        />
      </div>

      {/* Drug-likeness Comparison */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Drug-likeness Comparison
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h5 className="font-medium text-gray-700 dark:text-gray-300">Rule Violations</h5>
            <DrugLikenessComparison
              label="Lipinski Violations"
              value1={analysis1.drugLikeness.lipinskiViolations}
              value2={analysis2.drugLikeness.lipinskiViolations}
              isViolation={true}
            />
            <DrugLikenessComparison
              label="Veber Violations"
              value1={analysis1.drugLikeness.veberViolations}
              value2={analysis2.drugLikeness.veberViolations}
              isViolation={true}
            />
          </div>
          <div className="space-y-2">
            <h5 className="font-medium text-gray-700 dark:text-gray-300">Likeness Assessment</h5>
            <DrugLikenessComparison
              label="Lead-like"
              value1={analysis1.drugLikeness.leadLikeness}
              value2={analysis2.drugLikeness.leadLikeness}
            />
            <DrugLikenessComparison
              label="Drug-like"
              value1={analysis1.drugLikeness.drugLikeness}
              value2={analysis2.drugLikeness.drugLikeness}
            />
          </div>
        </div>
      </div>

      {/* ADMET Comparison */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ADMET Comparison
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h5 className="font-medium text-gray-700 dark:text-gray-300">{analysis1.name}</h5>
            <div className="space-y-2 text-sm">
              <div><strong>BBB:</strong> {analysis1.admet.bloodBrainBarrier}</div>
              <div><strong>Absorption:</strong> {analysis1.admet.humanIntestinalAbsorption}</div>
              <div><strong>CYP450:</strong> {analysis1.admet.cyp450Inhibition.join(', ') || 'None'}</div>
              <div><strong>Toxicity:</strong> {analysis1.admet.toxicity}</div>
            </div>
          </div>
          <div className="space-y-3">
            <h5 className="font-medium text-gray-700 dark:text-gray-300">{analysis2.name}</h5>
            <div className="space-y-2 text-sm">
              <div><strong>BBB:</strong> {analysis2.admet.bloodBrainBarrier}</div>
              <div><strong>Absorption:</strong> {analysis2.admet.humanIntestinalAbsorption}</div>
              <div><strong>CYP450:</strong> {analysis2.admet.cyp450Inhibition.join(', ') || 'None'}</div>
              <div><strong>Toxicity:</strong> {analysis2.admet.toxicity}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyComparison;