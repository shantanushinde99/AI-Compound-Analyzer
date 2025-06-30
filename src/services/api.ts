import axios from 'axios';
import { AnalysisResponse } from '../utils/constants';

const API_BASE_URL = 'http://localhost:5000/api';

export class CompoundAnalyzerAPI {
  static async analyzeCompound(query: string): Promise<AnalysisResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, {
        query: query.trim()
      }, {
        timeout: 30000, // 30 second timeout for LLM processing
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Analysis API Error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          return {
            success: false,
            error: 'Backend server is not running. Please start the Python backend.'
          };
        } else if (error.response?.status === 500) {
          return {
            success: false,
            error: error.response.data?.error || 'Server error during analysis'
          };
        } else if (error.code === 'ECONNABORTED') {
          return {
            success: false,
            error: 'Analysis timeout - the compound may be too complex to process quickly'
          };
        }
      }

      return {
        success: false,
        error: 'Failed to analyze compound. Please try again.'
      };
    }
  }

  static async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }
}