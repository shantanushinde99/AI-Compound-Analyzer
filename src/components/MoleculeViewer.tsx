import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Download, Maximize, Palette, Info } from 'lucide-react';

interface MoleculeViewerProps {
  molBlock: string;
  compoundName: string;
  functionalGroups?: string[];
}

declare global {
  interface Window {
    $3Dmol: any;
  }
}

const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ 
  molBlock, 
  compoundName, 
  functionalGroups = [] 
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [colorScheme, setColorScheme] = useState<'cpk' | 'rainbow' | 'greyscale'>('cpk');
  const [selectedAtom, setSelectedAtom] = useState<any>(null);
  const [showAtomInfo, setShowAtomInfo] = useState(false);

  useEffect(() => {
    if (!viewerRef.current || !window.$3Dmol || !molBlock) return;

    // Initialize 3Dmol viewer
    const config = {
      backgroundColor: colorScheme === 'greyscale' ? '#f5f5f5' : 'white',
      antialias: true,
      cartoonQuality: 10
    };

    const newViewer = window.$3Dmol.createViewer(viewerRef.current, config);
    
    // Add molecule from MOL block
    newViewer.addModel(molBlock, 'mol');
    
    // Set visualization style based on color scheme
    const getColorScheme = () => {
      switch (colorScheme) {
        case 'rainbow':
          return 'rainbow';
        case 'greyscale':
          return 'greyCarbon';
        default:
          return 'Jmol';
      }
    };

    newViewer.setStyle({}, {
      stick: {
        radius: 0.15,
        colorscheme: getColorScheme()
      },
      sphere: {
        radius: 0.3,
        colorscheme: getColorScheme()
      }
    });

    // Add click handler for atoms
    newViewer.setClickable({}, true, (atom: any) => {
      setSelectedAtom({
        element: atom.elem,
        index: atom.index,
        x: atom.x,
        y: atom.y,
        z: atom.z,
        bonds: atom.bonds?.length || 0
      });
      setShowAtomInfo(true);
    });

    // Set view and render
    newViewer.zoomTo();
    newViewer.render();
    
    setViewer(newViewer);

    // Cleanup
    return () => {
      if (newViewer) {
        newViewer.clear();
      }
    };
  }, [molBlock, colorScheme]);

  const resetView = () => {
    if (viewer) {
      viewer.zoomTo();
      viewer.render();
    }
  };

  const zoomIn = () => {
    if (viewer) {
      viewer.zoom(1.2);
      viewer.render();
    }
  };

  const zoomOut = () => {
    if (viewer) {
      viewer.zoom(0.8);
      viewer.render();
    }
  };

  const downloadImage = () => {
    if (viewer) {
      const canvas = viewerRef.current?.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = `${compoundName.replace(/\s+/g, '_')}_structure.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getAtomDescription = (element: string) => {
    const descriptions: { [key: string]: string } = {
      'C': 'Carbon - Forms the backbone of organic molecules',
      'N': 'Nitrogen - Often found in amino groups and rings',
      'O': 'Oxygen - Common in alcohols, carbonyls, and ethers',
      'H': 'Hydrogen - Most abundant atom in organic compounds',
      'S': 'Sulfur - Found in amino acids and many drugs',
      'P': 'Phosphorus - Important in phosphates and DNA/RNA',
      'F': 'Fluorine - Common halogen in pharmaceuticals',
      'Cl': 'Chlorine - Halogen substituent',
      'Br': 'Bromine - Larger halogen atom',
      'I': 'Iodine - Heaviest common halogen'
    };
    return descriptions[element] || `${element} - Chemical element`;
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              3D Structure: {compoundName}
            </h3>
            {functionalGroups.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {functionalGroups.slice(0, 4).map((group) => (
                  <span
                    key={group}
                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 
                             text-blue-800 dark:text-blue-200 rounded-full"
                  >
                    {group}
                  </span>
                ))}
                {functionalGroups.length > 4 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 
                                 text-gray-600 dark:text-gray-400 rounded-full">
                    +{functionalGroups.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Color Scheme Selector */}
            <select
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value as any)}
              className="text-xs bg-white dark:bg-gray-600 border border-gray-300 
                       dark:border-gray-500 rounded px-2 py-1"
            >
              <option value="cpk">CPK Colors</option>
              <option value="rainbow">Rainbow</option>
              <option value="greyscale">Greyscale</option>
            </select>
            
            <button
              onClick={resetView}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 
                       dark:hover:text-blue-400 transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={zoomIn}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 
                       dark:hover:text-blue-400 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={zoomOut}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 
                       dark:hover:text-blue-400 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={downloadImage}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 
                       dark:hover:text-blue-400 transition-colors"
              title="Download Image"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 
                       dark:hover:text-blue-400 transition-colors"
              title="Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div
          ref={viewerRef}
          className={`molecule-viewer bg-gradient-to-br from-gray-50 to-gray-100 
                     dark:from-gray-700 dark:to-gray-800 ${
                       isFullscreen ? 'h-screen' : 'h-96'
                     }`}
          style={{ 
            width: '100%',
            minHeight: isFullscreen ? '100vh' : '400px'
          }}
        />
        
        {/* Atom Information Popup */}
        {showAtomInfo && selectedAtom && (
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg 
                         shadow-lg border border-gray-200 dark:border-gray-600 p-4 max-w-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Atom Information
              </h4>
              <button
                onClick={() => setShowAtomInfo(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Element:</span> {selectedAtom.element}
              </div>
              <div>
                <span className="font-medium">Index:</span> {selectedAtom.index}
              </div>
              <div>
                <span className="font-medium">Bonds:</span> {selectedAtom.bonds}
              </div>
              <div>
                <span className="font-medium">Position:</span> 
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  x: {selectedAtom.x?.toFixed(2)}<br/>
                  y: {selectedAtom.y?.toFixed(2)}<br/>
                  z: {selectedAtom.z?.toFixed(2)}
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {getAtomDescription(selectedAtom.element)}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {!molBlock && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-600 rounded-full 
                            flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-400 rounded-full"></div>
              </div>
              <p className="text-lg font-medium">No Structure to Display</p>
              <p className="text-sm">Analyze a compound to see its 3D structure</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div>
            💡 Click and drag to rotate • Scroll to zoom • Click atoms for info
          </div>
          <div className="flex items-center gap-2">
            <Info className="w-3 h-3" />
            <span>Color scheme: {colorScheme.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoleculeViewer;