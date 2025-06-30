import React from 'react';
import { Zap, Brain, GitCompare, Eye, AlertTriangle } from 'lucide-react';

interface QueryTemplatesProps {
  onQuerySelect: (query: string) => void;
  isLoading: boolean;
}

const QueryTemplates: React.FC<QueryTemplatesProps> = ({ onQuerySelect, isLoading }) => {
  const templates = [
    {
      category: 'Structure Analysis',
      icon: <Eye className="w-4 h-4" />,
      color: 'bg-blue-500',
      queries: [
        'Show me the 3D structure of aspirin',
        'Visualize the molecular structure of caffeine',
        'Display the structure and formula of ibuprofen',
        'Analyze the geometry of morphine'
      ]
    },
    {
      category: 'Property Analysis',
      icon: <Brain className="w-4 h-4" />,
      color: 'bg-green-500',
      queries: [
        'What are the drug-like properties of paracetamol?',
        'Calculate the lipophilicity of nicotine',
        'Show molecular weight and polar surface area of penicillin',
        'Analyze the hydrogen bonding potential of codeine'
      ]
    },
    {
      category: 'ADMET Predictions',
      icon: <AlertTriangle className="w-4 h-4" />,
      color: 'bg-orange-500',
      queries: [
        'Is caffeine likely to cross the blood-brain barrier?',
        'Predict the absorption properties of aspirin',
        'What are the toxicity concerns for morphine?',
        'Analyze the metabolic stability of ibuprofen'
      ]
    },
    {
      category: 'Comparisons',
      icon: <GitCompare className="w-4 h-4" />,
      color: 'bg-purple-500',
      queries: [
        'Compare aspirin and ibuprofen properties',
        'How does caffeine differ from nicotine?',
        'Compare the toxicity of morphine vs codeine',
        'Analyze differences between paracetamol and aspirin'
      ]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Quick Query Templates
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 ml-2">
          Click to try these example queries
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div key={template.category} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 ${template.color} rounded-lg`}>
                <div className="text-white">
                  {template.icon}
                </div>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {template.category}
              </h4>
            </div>
            
            <div className="space-y-2">
              {template.queries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => onQuerySelect(query)}
                  disabled={isLoading}
                  className="w-full text-left p-3 text-sm bg-gray-50 dark:bg-gray-700 
                           hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg
                           text-gray-700 dark:text-gray-300 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed
                           border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 
                     dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          💡 Pro Tips:
        </h4>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>• Use natural language - the AI understands context</li>
          <li>• Try specific questions about properties you're interested in</li>
          <li>• Compare multiple compounds to understand differences</li>
          <li>• Ask about drug development implications</li>
        </ul>
      </div>
    </div>
  );
};

export default QueryTemplates;