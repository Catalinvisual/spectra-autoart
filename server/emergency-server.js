// Emergency server for Railway - starts immediately
import express from 'express';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck endpoints - MUST work for Railway
app.get('/ping', (req, res) => {
  console.log('📍 Emergency ping received - responding with pong');
  res.status(200).send('pong');
});

app.head('/ping', (req, res) => {
  console.log('📍 Emergency head ping received - responding with 200');
  res.sendStatus(200);
});

app.get('/health', (req, res) => {
  console.log('📍 Emergency health check received');
  res.json({ 
    status: 'emergency', 
    timestamp: new Date().toISOString(),
    message: 'Railway emergency server running'
  });
});

// Start server immediately
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚨 EMERGENCY SERVER STARTED on port ${PORT}`);
  console.log(`🚨 Healthcheck available at: http://0.0.0.0:${PORT}/ping`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🚨 Emergency server shutting down...');
  server.close(() => {
    console.log('🚨 Emergency server closed');
    process.exit(0);
  });
});