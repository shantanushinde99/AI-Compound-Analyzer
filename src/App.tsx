import React, { useState, useEffect } from 'react';
import { Beaker, Moon, Sun, Wifi, WifiOff, GitCompare, Lightbulb } from 'lucide-react';
import CompoundInput from './components/CompoundInput';
import MoleculeViewer from './components/MoleculeViewer';
import PropertyDashboard from './components/PropertyDashboard';
import InteractivePropertyPanel from './components/InteractivePropertyPanel';
import AtomLegend from './components/AtomLegend';
import CompareMode from './components/CompareMode';
import ExportOptions from './components/ExportOptions';
import QueryTemplates from './components/QueryTemplates';
import CompoundInfo from './components/CompoundInfo';
import { CompoundAnalyzerAPI } from './services/api';
import { CompoundAnalysis } from './utils/constants';
// Import the image
import BlackCircle from './black_circle_360x360.png';

function App() {
  const [analysis, setAnalysis] = useState<CompoundAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [backendStatus, setBackendStatus] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'analyze' | 'compare' | 'templates'>('analyze');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    // Check backend status on load
    checkBackendStatus();
    
    // Check periodically
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkBackendStatus = async () => {
    const status = await CompoundAnalyzerAPI.healthCheck();
    setBackendStatus(status);
  };

  const handleAnalyze = async (query: string): Promise<CompoundAnalysis | null> => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await CompoundAnalyzerAPI.analyzeCompound(query);
      
      if (response.success && response.data) {
        setAnalysis(response.data);
        return response.data;
      } else {
        setError(response.error || 'Analysis failed');
        return null;
      }
    } catch (err) {
      setError('Unexpected error occurred during analysis');
      console.error('Analysis error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuerySelect = (query: string) => {
    setActiveTab('analyze');
    handleAnalyze(query);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Beaker className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AI Compound Analyzer
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Advanced Molecular Analysis with Interactive Visualization
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Backend Status */}
              <div className="flex items-center gap-2">
                {backendStatus === null ? (
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                ) : backendStatus ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Backend {backendStatus === null ? 'Checking...' : backendStatus ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 
                         dark:hover:text-white transition-colors rounded-lg
                         hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Black Circle Image */}
              <img
                src={BlackCircle}
                alt="Black Circle"
                className="w-20 h-20 object-contain absolute right-4 "
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'analyze'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Beaker className="w-4 h-4" />
            Analyze
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'compare'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            Compare
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'templates'
                ? 'bg-yellow-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            Templates
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Backend Offline Warning */}
        {backendStatus === false && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 
                         rounded-lg p-4">
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-300">Backend Server Offline</h3>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  The Python backend server is not running. Please start it with: <code className="bg-red-100 dark:bg-red-800 px-2 py-1 rounded">npm run backend</code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'analyze' && (
          <>
            <CompoundInput onAnalyze={handleAnalyze} isLoading={isLoading} />

            {/* Error Display */}
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 
                             rounded-lg p-4">
                <h3 className="font-medium text-red-800 dark:text-red-300 mb-2">Analysis Error</h3>
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Results */}
            {analysis && (
              <div className="space-y-8">
                {/* Compound Information */}
                <CompoundInfo analysis={analysis} />

                {/* 3D Viewer and Legend */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <MoleculeViewer 
                      molBlock={analysis.structure3D} 
                      compoundName={analysis.name}
                      functionalGroups={analysis.functionalGroups}
                    />
                  </div>
                  <div>
                    <AtomLegend />
                  </div>
                </div>

                {/* Export Options */}
                <ExportOptions analysis={analysis} />

                {/* Interactive Property Panel */}
                <InteractivePropertyPanel analysis={analysis} />

                {/* Properties Dashboard */}
                <PropertyDashboard analysis={analysis} />
              </div>
            )}

            {/* Getting Started */}
            {!analysis && !isLoading && !error && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 
                                dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
                    <Beaker className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Ready to Analyze Compounds
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Enter a compound name, SMILES string, or natural language query to get started 
                    with AI-powered molecular analysis and 3D visualization.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 text-left">
                    <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">🚀 New Features:</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                      <li>• <strong>Expanded Library:</strong> 20+ compounds including pharmaceuticals</li>
                      <li>• <strong>Enhanced 3D Viewer:</strong> Clickable atoms with detailed information</li>
                      <li>• <strong>SMILES Validation:</strong> Real-time format checking and suggestions</li>
                      <li>• <strong>Functional Groups:</strong> Automatic detection and highlighting</li>
                      <li>• <strong>Toxicity Warnings:</strong> AI-powered safety assessments</li>
                      <li>• <strong>Copy Features:</strong> Easy sharing of SMILES and formulas</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'compare' && (
          <CompareMode onAnalyze={handleAnalyze} isLoading={isLoading} />
        )}

        {activeTab === 'templates' && (
          <QueryTemplates onQuerySelect={handleQuerySelect} isLoading={isLoading} />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Advanced Molecular Analysis with Interactive Visualization</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;