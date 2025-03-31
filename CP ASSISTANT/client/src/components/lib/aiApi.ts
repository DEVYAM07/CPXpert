import axios from 'axios';

interface DebugRequest {
  problemStatement: string;
  code: string;
  language: string;
  userId?: number;
}

interface ExplainRequest {
  problemStatement: string;
  solutionCode: string;
  language: string;
  userId?: number;
}

export const sendDebugRequest = async (data: DebugRequest): Promise<string> => {
  try {
    const response = await axios.post('/api/ai/debug', data);
    return response.data.result;
  } catch (error) {
    console.error('Debug API error:', error);
    throw new Error('Failed to analyze code. Please try again later.');
  }
};

export const sendExplainRequest = async (data: ExplainRequest): Promise<string> => {
  try {
    const response = await axios.post('/api/ai/explain', data);
    return response.data.result;
  } catch (error) {
    console.error('Explain API error:', error);
    throw new Error('Failed to generate explanation. Please try again later.');
  }
};

export const searchCodeforcesProfile = async (handle: string): Promise<any> => {
  try {
    const response = await axios.get(`/api/codeforces/search?handle=${encodeURIComponent(handle)}`);
    return response.data;
  } catch (error) {
    console.error('Codeforces profile search error:', error);
    throw new Error('Failed to find Codeforces profile');
  }
};