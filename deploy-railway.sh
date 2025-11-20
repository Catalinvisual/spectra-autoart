# Railway Deployment Script
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Railway deployment process...${NC}"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}Railway CLI not found. Installing...${NC}"
    npm install -g @railway/cli
fi

# Login to Railway
echo -e "${YELLOW}Please login to Railway:${NC}"
railway login

# Create new project
echo -e "${YELLOW}Creating new Railway project...${NC}"
railway init --name spectra-autoart

# Add PostgreSQL plugin (optional, if needed for future database)
# railway add --plugin postgresql

# Set environment variables
echo -e "${YELLOW}Setting environment variables...${NC}"
echo "Please enter your environment variables:"

read -p "Google Sheets Spreadsheet ID: " spreadsheet_id
read -p "Google Service Account Email: " service_email
read -p "Google Private Key: " private_key
read -p "JWT Secret (min 32 characters): " jwt_secret
read -p "Admin Email: " admin_email
read -p "Admin Password: " admin_password

railway variables set PORT=8080
railway variables set CLIENT_ORIGIN=https://spectra-autoart-production.up.railway.app
railway variables set GOOGLE_SHEETS_SPREADSHEET_ID="$spreadsheet_id"
railway variables set GOOGLE_SERVICE_ACCOUNT_EMAIL="$service_email"
railway variables set GOOGLE_PRIVATE_KEY="$private_key"
railway variables set JWT_SECRET="$jwt_secret"
railway variables set ADMIN_DEFAULT_EMAIL="$admin_email"
railway variables set ADMIN_DEFAULT_PASSWORD="$admin_password"

# Deploy the application
echo -e "${YELLOW}Deploying application...${NC}"
railway up

# Show deployment status
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo -e "${YELLOW}Application URL:${NC}"
railway status

echo -e "${GREEN}🎉 Your Spectra AutoArt application is now live on Railway!${NC}"
echo -e "${YELLOW}Don't forget to update your Google Sheets sharing settings with the service account email.${NC}"