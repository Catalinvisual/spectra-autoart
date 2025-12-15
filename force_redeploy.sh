#!/bin/bash

echo "🚨 FORȚÂND REDEPLOYMENT RAILWAY..."
echo "==================================="

# Metoda 1: Push unui commit empty pentru a triggera deployment
echo "📦 Creând commit empty pentru a triggera deployment..."
git commit --allow-empty -m "Force Railway redeployment - fix Google Sheets demo mode"
git push origin main

echo "✅ Commit empty creat și pushat!"
echo "⏳ Railway ar trebui să detecteze schimbarea și să redeployeze în 1-2 minute..."
echo ""
echo "Dacă nu funcționează, încercați:"
echo "1. Railway Dashboard → Deployments → Redeploy"
echo "2. Railway CLI: railway up"
echo "3. Railway Dashboard → Settings → Redeploy"