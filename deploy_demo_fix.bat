@echo off
echo 🚀 Deploying Google Sheets Service demo mode fix...

REM Check if we're in the right directory
if not exist "server\src\services\googleSheetsService.js" (
    echo ❌ Error: Google Sheets Service file not found!
    exit /b 1
)

echo ✅ Google Sheets Service file found

REM Check if the fix is in place
findstr /C:"Production environment detected - enabling demo mode" server\src\services\googleSheetsService.js >nul
if %errorlevel% equ 0 (
    echo ✅ Demo mode fix is present in Google Sheets Service
) else (
    echo ❌ Demo mode fix not found in Google Sheets Service!
    exit /b 1
)

echo 📦 Building and deploying to Railway...

REM Navigate to server directory
cd server

REM Install dependencies if needed
echo 📦 Installing dependencies...
call npm install

REM Build the server
echo 🔨 Building server...
call npm run build 2>nul || echo No build script found, skipping...

REM Deploy to Railway
echo 🚄 Deploying to Railway...
call railway up

echo ✅ Deployment initiated!
echo 📝 The server will restart with the demo mode fix.
echo ⏳ Please wait 2-3 minutes for the deployment to complete.
echo 🌐 After deployment, test the admin endpoints at:
echo    - https://spectraautoart.nl/api/admin/dashboard
echo    - https://spectraautoart.nl/api/admin/bookings  
echo    - https://spectraautoart.nl/api/admin/body-types

pause