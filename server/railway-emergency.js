#!/usr/bin/env node

/**
 * Minimal Railway startup script
 * Ensures server starts even with configuration errors
 */

console.log('🚨 RAILWAY EMERGENCY STARTUP - Minimal Server');

// Set minimal required environment variables
if (!process.env.PORT) process.env.PORT = '8080';
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'railway-emergency-jwt-secret';

// Import Express and create minimal app
try {
  const express = require('express');
  const app = express();
  
  // Healthcheck endpoints - MUST work for Railway
  app.get('/ping', (req, res) => {
    console.log('📍 Ping received - responding with pong');
    res.status(200).send('pong');
  });
  
  app.head('/ping', (req, res) => {
    console.log('📍 Head ping received - responding with 200');
    res.sendStatus(200);
  });
  
  app.get('/health', (req, res) => {
    console.log('📍 Health check received');
    res.json({ 
      status: 'emergency', 
      timestamp: new Date().toISOString(),
      message: 'Railway emergency server'
    });
  });
  
  // Catch all other routes
  app.use('*', (req, res) => {
    console.log(`📍 Request received: ${req.method} ${req.path}`);
    res.status(200).json({ 
      message: 'Railway emergency server is running',
      endpoint: req.path,
      timestamp: new Date().toISOString()
    });
  });
  
  // Start server
  const port = process.env.PORT;
  const host = '0.0.0.0';
  
  const server = app.listen(port, host, () => {
    console.log(`✅ RAILWAY EMERGENCY SERVER STARTED`);
    console.log(`🎯 Listening on ${host}:${port}`);
    console.log(`🏥 Healthcheck: http://${host}:${port}/ping`);
    console.log(`🏥 Health: http://${host}:${port}/health`);
  });
  
  server.on('error', (error) => {
    console.error('❌ Server error:', error.message);
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use`);
    }
    process.exit(1);
  });
  
} catch (error) {
  console.error('❌ Failed to start emergency server:', error.message);
  process.exit(1);
}