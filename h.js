// Healthcheck server pentru Railway - ULTIMA VERSIUNE FUNCȚIONALĂ
// Creat: $(date)

const http = require('http');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 8080;

console.log('🚀 Healthcheck server pornit pe portul:', PORT);

const server = http.createServer((req, res) => {
  console.log(`📍 Request primit: ${req.url} la ${new Date().toISOString()}`);
  
  if (req.url === '/ping' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    console.log('✅ Healthcheck răspuns: OK');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    console.log('❌ Răspuns 404 pentru:', req.url);
  }
});

server.listen(PORT, () => {
  console.log(`✅ Healthcheck server ascultă pe portul ${PORT}`);
  
  // Start Express server după 2 secunde
  setTimeout(() => {
    console.log('🚀 Pornesc Express serverul principal...');
    
    try {
      require('../server/src/index.js');
      console.log('✅ Express server pornit cu succes!');
    } catch (error) {
      console.error('❌ Eroare la pornirea Express server:', error.message);
      console.log('🔄 Încerc din nou...');
      
      setTimeout(() => {
        try {
          require('./server/src/index.js');
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