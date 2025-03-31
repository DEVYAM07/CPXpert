import axios from 'axios';

const API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'gemini-1.5-pro';

// Debug prompt template with GenZ styling
const DEBUG_PROMPT = `
You are Algo-Z, a competitive programming AI assistant with a GenZ personality. Your task is to analyze code and provide debugging help.

Problem Statement:
{{problemStatement}}

User's Code:
\`\`\`{{language}}
{{code}}
\`\`\`

Provide a detailed, engaging analysis following these steps:
1. Identify bugs, inefficiencies, and potential issues
2. Analyze time and space complexity
3. Suggest optimizations with code examples
4. Highlight edge cases that might break the code
5. Explain the fixes in a clear, engaging way

Use emojis, modern slang (but keep it professional), and visual formatting to make your response engaging.
Include a section with actual fixed code.
Format your response in markdown with proper code highlighting.
`;

// Explain prompt template with GenZ styling
const EXPLAIN_PROMPT = `
You are Algo-Z, a competitive programming AI assistant with a GenZ personality. Your task is to explain code algorithms in an engaging, educational way.

Problem Statement:
{{problemStatement}}

Solution Code:
\`\`\`{{language}}
{{code}}
\`\`\`

Provide a detailed, exciting explanation following these steps:
1. Identify the core algorithm(s) and data structures used
2. Explain the solution approach with clear step-by-step breakdown
3. Analyze time and space complexity with mathematical reasoning
4. Create a visual trace/walkthrough of the algorithm on a small example
5. Highlight key insights and clever techniques used
6. Connect this solution to similar problem patterns

Use emojis, modern slang (but keep it professional), and visual formatting to make your response engaging.
Include ASCII diagrams or table-based visualizations where appropriate.
Format your response in markdown with proper code highlighting.
`;

// Function to generate debug analysis using Gemini
export async function generateDebugAnalysis(
  problemStatement: string,
  code: string,
  language: string
): Promise<string> {
  try {
    // Replace placeholders in prompt template
    const prompt = DEBUG_PROMPT
      .replace('{{problemStatement}}', problemStatement)
      .replace('{{language}}', language)
      .replace('{{code}}', code);

    // Call Gemini API
    const response = await callGeminiAPI(prompt);
    return response;
  } catch (error) {
    console.error('Error generating debug analysis:', error);
    return `⚠️ Could not connect to Gemini API. Please check your connection or API key.`;
  }
}

// Function to generate code explanation using Gemini
export async function generateCodeExplanation(
  problemStatement: string,
  code: string,
  language: string
): Promise<string> {
  try {
    // Replace placeholders in prompt template
    const prompt = EXPLAIN_PROMPT
      .replace('{{problemStatement}}', problemStatement)
      .replace('{{language}}', language)
      .replace('{{code}}', code);

    // Call Gemini API
    const response = await callGeminiAPI(prompt);
    return response;
  } catch (error) {
    console.error('Error generating code explanation:', error);
    return `⚠️ Could not connect to Gemini API. Please check your connection or API key.`;
  }
}

// Helper function to call Gemini API
async function callGeminiAPI(prompt: string): Promise<string> {
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY not found in environment variables');
  }

  try {
    const modelEndpoint = `${BASE_URL}/models/${MODEL}:generateContent?key=${API_KEY}`;
    
    const response = await axios.post(
      modelEndpoint,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192
        }
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Extract text from response
    const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return generatedText;
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw error;
  }
}