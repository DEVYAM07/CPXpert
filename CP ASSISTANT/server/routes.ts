export async function registerRoutes(app: Express): Promise<Server> {
    // Define the API routes
    const httpServer = createServer(app);
    
    // Setup WebSocket server for real-time feedback
    const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
    
    // Set up body parsing middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Map to store active update intervals for each user
    const codeforcesProfileUpdates = new Map<number, NodeJS.Timeout>();
    
    // Start real-time updates for a user's Codeforces profile
    function startCodeforcesProfileUpdates(userId: number, handle: string) {
      // Stop any existing updates
      stopCodeforcesProfileUpdates(userId);
      
      console.log(`Starting real-time updates for Codeforces profile ${handle}`);
      
      // Set up interval to fetch profile updates every 15 seconds
      const intervalId = setInterval(async () => {
        try {
          console.log(`Refreshing Codeforces profile for user ${userId}, handle: ${handle}`);
          
          // Fetch latest profile data
          const cfData = await fetchCodeforcesProfile(handle);
          
          // Update profile in database
          const profile = await storage.updateCodeforcesProfile(userId, {
            rating: cfData.rating,
            maxRating: cfData.maxRating,
            rank: cfData.rank,
            problemsSolved: cfData.problemsSolved,
            contestsParticipated: cfData.contestsParticipated,
            profileData: cfData.profileData
          });
          
          console.log(`Successfully updated Codeforces profile for ${handle}`);
          
          // Broadcast update via WebSocket
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'codeforces_profile_update',
                userId,
                handle,
                data: profile,
                timestamp: new Date().toISOString()
              }));
            }
          });
        } catch (error) {
          console.error(`Error updating Codeforces profile for ${handle}:`, error);
        }
      }, 15000); // Update every 15 seconds
      
      // Store interval ID for later cleanup
      codeforcesProfileUpdates.set(userId, intervalId);
      console.log(`Started real-time updates for Codeforces profile ${handle}`);
    }
    
    // Stop real-time updates for a user
    function stopCodeforcesProfileUpdates(userId: number) {
      const intervalId = codeforcesProfileUpdates.get(userId);
      
      if (intervalId) {
        clearInterval(intervalId);
        codeforcesProfileUpdates.delete(userId);
        console.log(`Stopped real-time updates for user ${userId}`);
      }
    }
  
    // WebSocket message handler
    wss.on('connection', (ws) => {
      console.log('Client connected to WebSocket');
      
      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message.toString());
          
          if (data.type === 'debug_request' && ws.readyState === WebSocket.OPEN) {
            const { problemStatement, code, language, userId } = data;
            
            try {
              // Generate debugging analysis using Gemini
              const aiResponse = await geminiDebugAnalysis(problemStatement, code, language);
              
              // Send response back via WebSocket
              ws.send(JSON.stringify({
                type: 'debug_response',
                response: aiResponse
              }));
              
              // Store debug session if userId is provided
              if (userId) {
                await storage.createDebugSession({
                  problemStatement,
                  code,
                  language,
                  aiResponse,
                  userId
                });
              }
            } catch (error) {
              console.error("WebSocket debug request error:", error);
              ws.send(JSON.stringify({ 
                type: 'error', 
                message: 'Failed to generate debug analysis' 
              }));
            }
          } else if (data.type === 'explain_request' && ws.readyState === WebSocket.OPEN) {
            const { problemStatement, solutionCode, language, userId } = data;
            
            try {
              // Generate explanation using Gemini
              const aiResponse = await geminiExplanation(problemStatement, solutionCode, language);
              
              // Send response back via WebSocket
              ws.send(JSON.stringify({
                type: 'explain_response',
                response: aiResponse
              }));
              
              // Store explain session if userId is provided
              if (userId) {
                await storage.createExplainSession({
                  problemStatement,
                  solutionCode,
                  language,
                  aiResponse,
                  userId
                });
              }
            } catch (error) {
              console.error("WebSocket explain request error:", error);
              ws.send(JSON.stringify({ 
                type: 'error', 
                message: 'Failed to generate explanation' 
              }));
            }
          } else if (data.type === 'start_codeforces_updates') {
            const { userId, handle } = data;
            startCodeforcesProfileUpdates(userId, handle);
          } else if (data.type === 'stop_codeforces_updates') {
            const { userId } = data;
            stopCodeforcesProfileUpdates(userId);
          }
        } catch (err) {
          console.error('WebSocket message error:', err);
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'error', message: 'Failed to process request' }));
          }
        }
      });
      
      ws.on('close', () => {
        console.log('Client disconnected from WebSocket');
      });
    });
    
    // REST API routes would go here
    
    return httpServer;
  }