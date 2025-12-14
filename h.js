// Healthcheck server pentru Railway - Integrat cu Express
// Creat: $(date)

import http from 'http';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const PORT = process.env.PORT || 8080;

console.log('🚀 Healthcheck server pornit pe portul:', PORT);

let expressApp = null;
let expressServer = null;

const server = http.createServer((req, res) => {
  console.log(`📍 Request primit: ${req.url} la ${new Date().toISOString()}`);
  
  if (req.url === '/ping' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    console.log('✅ Healthcheck răspuns: OK');
  } else if (expressApp) {
    // Forward request to Express server
    console.log(`📍 Forwarding request to Express: ${req.url}`);
    expressApp(req, res);
  } else {
    res.writeHead(503, { 'Content-Type': 'text/plain' });
    res.end('Express server not ready');
    console.log('❌ Express server not ready pentru:', req.url);
  }
});

server.listen(PORT, () => {
  console.log(`✅ Healthcheck server ascultă pe portul ${PORT}`);
  
  // Start Express server după 2 secunde
  setTimeout(async () => {
    console.log('🚀 Pornesc Express serverul principal...');
    
    try {
      const module = await import('./server/src/index.js');
      expressApp = module.default || module.app;
      console.log('✅ Express server module loaded successfully!');
      
      if (expressApp && typeof expressApp === 'function') {
        console.log('✅ Express app function available for request forwarding');
      } else {
        console.log('⚠️  Express app function not found in module');
      }
    } catch (error) {
      console.error('❌ Eroare la pornirea Express server:', error.message);
      console.log('🔄 Încerc din nou...');
      
      setTimeout(async () => {
        try {
          const module = await import('./server/src/index.js');
          expressApp = module.default || module.app;
          console.log('✅ Express server pornit din a doua încercare!');
        } catch (error2) {
          console.error('❌ Eroare finală:', error2.message);
        }
      }, 3000);
    }
  }, 2000);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM primit, opresc serverul...');
  server.close(() => {
    console.log('✅ Server oprit gracefully');
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error.message);
  // Nu opri serverul în producție
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});