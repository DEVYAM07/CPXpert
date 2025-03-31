import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import MemoryStore from 'memorystore';
import { registerRoutes } from './routes';
import { log, setupVite, serveStatic } from './vite';

const app = express();
const port = process.env.PORT || 3000;

// Setup Vite development middleware if in development mode
async function start() {
  if (process.env.NODE_ENV === 'development') {
    // In development, use Vite's dev server
    await setupVite(app, null as any);
  } else {
    // In production, serve static files and handle SPA routing
    serveStatic(app);
  }
  
  // Register API routes and WebSocket server
  const httpServer = await registerRoutes(app);
  
  // Catch-all route for SPA
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: './dist/client' });
  });
  
  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Global error handler:', err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({ message });
  });
  
  // Start the server
  httpServer.listen(port, () => {
    log(`Server running at http://localhost:${port}`, 'server');
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});