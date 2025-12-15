#!/bin/bash

echo "🚨 FORȚÂND REDEPLOYMENT RAILWAY - ÎNCERCARE FINALĂ..."
echo "==================================="

# Creăm un fișier mic pentru a triggera deployment
echo "$(date): Forcing Railway redeployment" > deployment_trigger.txt

git add deployment_trigger.txt
git commit -m "Force Railway redeployment - final attempt to fix demo mode"
git push origin main

echo "✅ Commit creat și pushat!"
echo "⏳ Railway ar trebui să detecteze schimbarea și să redeployeze în 1-2 minute..."
echo "🔍 Așteaptă 2 minute și apoi rulează: node check_production_status.js"