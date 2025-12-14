#!/bin/sh
echo "Starting Railway server script at $(date)"
echo "Current directory: $(pwd)"
echo "Navigating to /app/server"
cd /app/server || { echo "Failed to navigate to /app/server"; exit 1; }
echo "Current directory after cd: $(pwd)"
echo "Starting npm start"
npm start