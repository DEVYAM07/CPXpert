# CPXpert


CPXpert: AI-Powered Competitive Programming Assistant


🚀 Overview
CPXpert is a cutting-edge, AI-powered platform designed to revolutionize competitive programming education and practice. Built with a modern "GenZ" UI and powered by Google's Gemini API, CP Assist combines real-time code analysis, personalized learning paths, and dynamic problem recommendations to help programmers of all levels improve their skills.

✨ Key Features
🐛 Debug Mode
Real-time Code Analysis: Submit problematic code and receive instant, AI-powered debugging feedback
Performance Optimization: Get suggestions to optimize time/space complexity and prevent TLE issues
Edge Case Detection: Identify potential edge cases that might break your solution
Comprehensive Fixes: Receive detailed explanations with code snippets showing how to fix issues
Session History: All debugging sessions are saved for future reference
💡 Explain Mode
Algorithm Breakdown: Get in-depth explanations of solution approaches and algorithms
Visual Traces: Step-by-step algorithm visualization with examples
Complexity Analysis: Detailed time/space complexity analysis with mathematical reasoning
Pattern Recognition: Connect solutions to similar problem patterns for better learning
Intuition Building: Understand the "why" behind efficient solutions
📊 Codeforces Integration
Profile Linking: Connect your Codeforces account for personalized recommendations
Real-time Updates: Get profile updates every 15 seconds with WebSocket technology
Quick Profile Search: Look up any Codeforces user to view their stats and rating
Adaptive Recommendations: Get problem suggestions based on your current rating and solved problems
📚 Study Planning
Personalized Study Routines: Generate custom study plans based on your:
Current rating
Target rating
Weak topics
Available study hours
Contest participation frequency
Tailored Content: Get topic-specific resources and practice problems
Progress Tracking: Monitor your improvement over time
📝 Problem Management
Smart Recommendations: Get problem suggestions matched to your skill level
Problem Database: Access a comprehensive collection of competitive programming problems
Custom Problem Lists: Create and manage personal problem collections
Solution Storage: Save and organize your solutions
📖 Learning Resources
Curated Material: Access high-quality tutorials, videos, articles, and courses
Difficulty Filtering: Find resources matched to your level
Topic-based Search: Discover resources for specific algorithms or techniques
💻 Technology Stack
Frontend
React: For building the interactive UI
TypeScript: For type-safe code development
Tailwind CSS: For modern, responsive styling
Shadcn UI: For consistent component design
React Query: For efficient data fetching and caching
Monaco Editor: For code editing with syntax highlighting
WebSocket: For real-time communication
Framer Motion: For smooth animations and transitions
Backend
Node.js & Express: For the server framework
WebSocket: For real-time bi-directional communication
Drizzle ORM: For database operations
PostgreSQL: For persistent data storage
Gemini API: For AI-powered code analysis and explanations
Express Sessions: For user authentication
📋 Installation & Setup
Prerequisites
Node.js 16+
PostgreSQL database
Gemini API key
Installation Steps
Clone the repository

git clone https://github.com/yourusername/cp-assist.git
cd cp-assist
Install dependencies

npm install
Set up environment variables
Create a .env file in the root directory with the following:

DATABASE_URL=postgresql://username:password@localhost:5432/cpdb
GEMINI_API_KEY=your_gemini_api_key
SESSION_SECRET=your_session_secret
Initialize the database

npm run db:push
Start the development server

npm run dev
Build for production

npm run build
npm start
🌟 Usage Examples
Debug Mode
Input buggy code like:

int findMissingNumber(vector<int>& nums) {
    int n = nums.size();
    int sum = 0;
    for (int i = 0; i <= n; i++) {
        sum += nums[i];
    }
    int expectedSum = n * (n + 1) / 2;
    return expectedSum - sum;
}
Receive detailed analysis:

❌ Bug Detected: Array index out of bounds at i = n
⚠️ Logic Error: The expected sum calculation is correct, but the actual sum computation has issues
🧠 Solution: Fix the loop bounds and adjust the logic
⏱️ Complexity: O(n) time, O(1) space
📝 Fixed Code: Properly implemented solution with explanation

Personalized problem recommendations based on your history
📈 Future Roadmap
AI Contest Simulation: Practice with AI-generated contests tailored to your skill level
Group Study Rooms: Collaborate with friends on problem-solving
Interview Prep Mode: Specialized practice for coding interviews
Performance Analytics: Detailed stats and improvement tracking
Mobile App: Access CP Assist on the go
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgements
Gemini API for powering the AI functionality
Codeforces for the competitive programming platform and API
Shadcn UI for the beautiful component library
All the competitive programmers who provided feedback during development
THNAK YOU !! 



https://github.com/user-attachments/assets/75b2036c-0518-4630-bbf5-573ae80abedd





