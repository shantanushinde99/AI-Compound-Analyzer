import React from 'react';
import { 
  Atom, 
  Droplets, 
  Zap, 
  Shield, 
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { CompoundAnalysis } from '../utils/constants';

interface PropertyDashboardProps {
  analysis: CompoundAnalysis;
}

const PropertyDashboard: React.FC<PropertyDashboardProps> = ({ analysis }) => {
  const { properties, drugLikeness, admet } = analysis;

  const PropertyCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    unit?: string;
    description: string;
    color: string;
  }> = ({ icon, title, value, unit, description, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {typeof value === 'number' ? value.toFixed(2) : value}
        </span>
        {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
      </div>
    </div>
  );

  const DrugLikenessIndicator: React.FC<{
    label: string;
    value: boolean | number;
    isViolation?: boolean;
  }> = ({ label, value, isViolation = false }) => {
    const isGood = isViolation ? value === 0 : value === true;
    
    return (
      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <div className="flex items-center gap-2">
          {isGood ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
          <span className="text-sm font-semibold">
            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Basic Properties */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Atom className="w-5 h-5 text-blue-500" />
          Molecular Properties
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <PropertyCard
            icon={<Atom className="w-4 h-4 text-white" />}
            title="Molecular Weight"
            value={properties.molecularWeight}
            unit="g/mol"
            description="Mass of the molecule"
            color="bg-blue-500"
          />
          <PropertyCard
            icon={<Droplets className="w-4 h-4 text-white" />}
            title="LogP"
            value={properties.logP}
            description="Lipophilicity (octanol-water partition)"
            color="bg-green-500"
          />
          <PropertyCard
            icon={<Zap className="w-4 h-4 text-white" />}
            title="H-Bond Donors"
            value={properties.hbondDonors}
            description="Number of hydrogen bond donors"
            color="bg-purple-500"
          />
          <PropertyCard
            icon={<Zap className="w-4 h-4 text-white" />}
            title="H-Bond Acceptors"
            value={properties.hbondAcceptors}
            description="Number of hydrogen bond acceptors"
            color="bg-orange-500"
          />
          <PropertyCard
            icon={<Activity className="w-4 h-4 text-white" />}
            title="Rotatable Bonds"
            value={properties.rotatablebonds}
            description="Molecular flexibility"
            color="bg-indigo-500"
          />
          <PropertyCard
            icon={<Shield className="w-4 h-4 text-white" />}
            title="Polar Surface Area"
            value={properties.polarSurfaceArea}
            unit="Ų"
            description="Topological polar surface area"
            color="bg-teal-500"
          />
          <PropertyCard
            icon={<Atom className="w-4 h-4 text-white" />}
            title="Heavy Atoms"
            value={properties.heavyAtomCount}
            description="Non-hydrogen atoms"
            color="bg-red-500"
          />
          <PropertyCard
            icon={<Activity className="w-4 h-4 text-white" />}
            title="Ring Count"
            value={properties.ringCount}
            description="Number of rings in structure"
            color="bg-pink-500"
          />
        </div>
      </div>

      {/* Drug-likeness */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-500" />
          Drug-likeness Assessment
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Rule Violations</h4>
              <DrugLikenessIndicator
                label="Lipinski Rule of 5 Violations"
                value={drugLikeness.lipinskiViolations}
                isViolation={true}
              />
              <DrugLikenessIndicator
                label="Veber Rule Violations"
                value={drugLikeness.veberViolations}
                isViolation={true}
              />
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Likeness Assessment</h4>
              <DrugLikenessIndicator
                label="Lead-like Properties"
                value={drugLikeness.leadLikeness}
              />
              <DrugLikenessIndicator
                label="Drug-like Properties"
                value={drugLikeness.drugLikeness}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ADMET Properties */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          ADMET Predictions
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <Brain className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Blood-Brain Barrier</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{admet.bloodBrainBarrier}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <Activity className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Intestinal Absorption</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{admet.humanIntestinalAbsorption}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                <Zap className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">CYP450 Inhibition</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {admet.cyp450Inhibition.length > 0 ? admet.cyp450Inhibition.join(', ') : 'None predicted'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Toxicity</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{admet.toxicity}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compound Information */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Compound Information</h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">SMILES</p>
              <p className="mt-1 font-mono text-sm text-gray-900 dark:text-white break-all">
                {analysis.smiles}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Molecular Formula</p>
              <p className="mt-1 font-mono text-lg text-gray-900 dark:text-white">
                {analysis.formula}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Compound Name</p>
              <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white capitalize">
                {analysis.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDashboard;