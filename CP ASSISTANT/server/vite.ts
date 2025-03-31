import { Express, static as expressStatic } from 'express';
import { Server } from 'http';
import { join } from 'path';

// Logger utility
export function log(message: string, source = "express") {
  console.log(`[${source}] ${message}`);
}

// Setup Vite development server middleware
export async function setupVite(app: Express, server: Server) {
  // In development, we use Vite's dev server
  log('Setting up Vite dev middleware...', 'vite');
  
  const { createServer: createViteServer } = await import('vite');
  
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
    optimizeDeps: {
      include: ['react', 'react-dom', 'wouter', '@tanstack/react-query'],
    },
  });
  
  // Use Vite's connect instance as middleware
  app.use(vite.middlewares);
  
  log('Vite middleware setup complete', 'vite');
}

// Serve static files in production
export function serveStatic(app: Express) {
  log('Setting up static file serving for production...', 'express');
  
  // Serve static files from the dist directory
  app.use(expressStatic(join(process.cwd(), 'dist/client')));
  
  log('Static file serving setup complete', 'express');
}