import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';

interface SMILESValidatorProps {
  smiles: string;
  onValidationChange: (isValid: boolean) => void;
}

const SMILESValidator: React.FC<SMILESValidatorProps> = ({ smiles, onValidationChange }) => {
  const [validation, setValidation] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
  }>({
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: []
  });

  const validateSMILES = (smilesString: string) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (!smilesString || smilesString.trim().length === 0) {
      errors.push('SMILES string is empty');
      return { isValid: false, errors, warnings, suggestions };
    }

    const trimmed = smilesString.trim();

    // Check for balanced parentheses
    const openParens = (trimmed.match(/\(/g) || []).length;
    const closeParens = (trimmed.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push('Unbalanced parentheses');
      suggestions.push('Check that all opening parentheses have matching closing ones');
    }

    // Check for balanced brackets
    const openBrackets = (trimmed.match(/\[/g) || []).length;
    const closeBrackets = (trimmed.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      errors.push('Unbalanced square brackets');
      suggestions.push('Check that all opening brackets have matching closing ones');
    }

    // Check for valid atom symbols
    const hasValidAtoms = /[CNOSPFClBrI]/.test(trimmed);
    if (!hasValidAtoms) {
      errors.push('No recognizable atom symbols found');
      suggestions.push('Include common atoms like C, N, O, S, P, F, Cl, Br, I');
    }

    // Check for invalid characters
    const validChars = /^[A-Za-z0-9@+\-\[\]()=#:/.\\%]+$/;
    if (!validChars.test(trimmed)) {
      errors.push('Contains invalid characters');
      suggestions.push('Use only valid SMILES characters: letters, numbers, @, +, -, [], (), =, #, :, /, \\, %');
    }

    // Warnings for potentially problematic patterns
    if (trimmed.length > 200) {
      warnings.push('Very long SMILES string - may be complex to visualize');
    }

    if ((trimmed.match(/C/g) || []).length > 50) {
      warnings.push('Large molecule - 3D rendering may be slow');
    }

    // Check for common mistakes
    if (trimmed.includes('..')) {
      errors.push('Double dots are not valid in SMILES');
      suggestions.push('Remove consecutive dots');
    }

    if (trimmed.includes('--')) {
      errors.push('Double dashes are not valid in SMILES');
      suggestions.push('Use single dash for bonds');
    }

    const isValid = errors.length === 0;
    return { isValid, errors, warnings, suggestions };
  };

  useEffect(() => {
    const result = validateSMILES(smiles);
    setValidation(result);
    onValidationChange(result.isValid);
  }, [smiles, onValidationChange]);

  if (!smiles || smiles.trim().length === 0) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      {/* Validation Status */}
      <div className="flex items-center gap-2">
        {validation.isValid ? (
          <>
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-700 dark:text-green-300 font-medium">
              Valid SMILES format
            </span>
          </>
        ) : (
          <>
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700 dark:text-red-300 font-medium">
              Invalid SMILES format
            </span>
          </>
        )}
      </div>

      {/* Errors */}
      {validation.errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 
                       rounded-lg p-3">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
            Errors:
          </h4>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {validation.warnings.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 
                       rounded-lg p-3">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Warnings:
          </h4>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            {validation.warnings.map((warning, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {validation.suggestions.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 
                       rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Suggestions:
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            {validation.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SMILESValidator;