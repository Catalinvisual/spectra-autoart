# 🔧 Fix Google Sheets Integration in Railway Production

## Problem Summary
Your production application is using demo data instead of real Google Sheets data, even though you've configured the Railway environment variables.

## Root Cause
The Google Sheets service is not initializing because the environment variables are not being loaded in the Railway production environment.

## Quick Solution Steps

### 1. Verify Current Railway Configuration
Run this command to check your current Railway variables:
```bash
railway variables
```

### 2. Set Google Sheets Environment Variables
Based on the details you provided, set these exact values in Railway:

```bash
railway variables set GOOGLE_SHEETS_SPREADSHEET_ID="1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90"
railway variables set GOOGLE_SERVICE_ACCOUNT_EMAIL="spectra-autoart@spectra-autoart.iam.gserviceaccount.com"
railway variables set GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCqHRdowGztApz3\n3TbsjDZTPuXBi6YM4a9KH2EfMlmp2Ny58fGnmOIqEi9PzLbRYH5K/k+y09bzJzyz\nbK3CR/qjhU7oNfxqCmzlanJC/n5+UwNrdbVPxnBaXgbJT6N5gOPiKB0auYzgE9AG\n8zh7PqvGpu3oynfvnpz5I/x55CnhsAOkRsN8JGnO6XxAC9Vb2AK7dx7uiWvSU8Gc\nbzIs+j4M1DOLQ9Kh273gmUUC26oQolxcq4nuPQXTsukH81V/HDKHZGPkQ/Qm+OZh\nzVK9nua161mrAusq4CZMdtWhoZ3rQyPIfWaNW7MC+eTRFW65M6A/0qAYCh8uX0s1\n7nU29bIxAgMBAAECggEAJAaLKZTuvHa8NUW01v2Ol6yPTaC8Zqf4zlK857VrBaw2\nem6BhcO7ybsWJ+krokW0GT+oMy/nqpDZqwnN9oH102Fs54JfVTml/CPB1Ow+b5Q2\n+i/wWNemfYzCFSn3bcjc+c0S9NDsw5uOh5pEkN0h1a0OXylZovZNOfnkAxBNykx6\ng1Lhaim3qG7YmxNy/Z3xdwTBAuixvMOmAYmeXeIM3XJKCVuHsIir91fcIU59iqJL\nl209OIe6FVhDj7OIAuouxlqX/eZwu4fizz5ch0k7QQNuiWq7e2/JfTylDaJ/cKRa\n3bnD4WtAxbondEww1GF/FPzBmcs5XqF09VRhYv1TkQKBgQDlCfUf6DnX18Rp7+LM\nKQClpPpGAVHN4wIbRD1QHvtVighTuKuk38cUsLEBZt/3BYsRLWHoFHLux0c61LDw\nNPcBoY/i6ciwu3l5Jh4OO4KUFf6kBwQl8IhxUJocNPeSMgIX+Q9QxceQ6mAvrH8S\n6wmpYA7PGJPLlZxAEuT3dg/8vQKBgQC+I27JgAxm3/Mx92a70e6HebftNDyHpQiE\n4bEZ0tDpJbgqfruAE9wZUJhjUDxtGNqkVc3fNBkGHVQSitqEmeq5xOrMMEcpoleY\n7WHD7wiYTk+L/omSaI+nBTrYL5BU93kqUSlUMc08XMGswq/nHGI7XtFmTRUi2VKz\np9E9IiU0hQKBgDG5W7I1pHkrqsSlA8P3EuDjVEJmfvAH3Kk2w2jlkQMdGHm0me8N\ndhcT1RnMz8q9NVfhVmQgLGOSd/BZxKAhn46HGMnWn29fBBw9HkFQwiSMMeBCdbAW\n7EhNi2ecSDNBEBtMQvryNUVM3Nz8wgnFZS+UXyKu30dPj8CJWZQv2YCxAoGBAJuX\nKShwxTVF25+uwP2/G373BqBv13x0exUqDp+AGP5ApIT5sftrxPdeMWVLmjb4WKqT\noGUfH78WLt8BizFpNmAQGMdAVmtmcmItFoycRR9FLej0QKVzNOJK8E1KFsTAwgDz\n62r/WeAkU0RJCGKJooTM4XPibgJXbkqfcCSjlWh1AoGALcA1/2bnvIwht+HQEpzB\nRBjb4DGwnixVfJ92s1CXuCWcJk3gKuqMHFTQwpp59dMHF+EjRc9mQZtSckaZ/xVW\ndPF8S3Zf80RoPf9cWEMR7C0g1gDqCMft81K+xuIX/XijxOKjTF5o7d2M4RMLDGqZ\nmlsTsXu9FiWXbhS3KsX0CT4=\n-----END PRIVATE KEY-----"
```

### 3. Deploy to Railway
```bash
railway up
```

### 4. Verify the Deployment
After deployment, check the logs to confirm Google Sheets is working:
```bash
railway logs
```

You should see these messages in the logs:
- `🔍 Checking Google Sheets credentials...`
- `✅ Google Sheets service initialized successfully`
- `📊 Google Sheets structure created: [your-spreadsheet-id]`

## 🔍 Diagnostic Scripts

I've created several diagnostic scripts to help troubleshoot:

### Quick Local Check
```bash
node scripts/debug-railway-env.js
```

### Production Railway Verification
```bash
railway run node scripts/verify-production-railway.js
```

### Deployment Helper
```bash
node scripts/deploy-and-verify.js
```

## 🎯 Expected Behavior After Fix

1. **Server Startup**: You should see "✅ Google Sheets service initialized successfully" in logs
2. **Vehicle Data**: The /api/vehicles endpoint should return data from your Google Sheet
3. **Services Data**: Vehicle services should load from Google Sheets in production
4. **No Demo Messages**: You should NOT see "⚠️ Google Sheets not configured - using demo data"

## 🚨 Common Issues and Solutions

### Issue: "Google Sheets credentials not configured"
**Solution**: The environment variables are not set correctly. Use the commands in step 2 above.

### Issue: "Invalid private key format"
**Solution**: The private key needs proper newline characters. Railway should handle this automatically, but if issues persist, try:
```bash
railway variables set GOOGLE_PRIVATE_KEY="$(echo -e "your-private-key-with-newlines")"
```

### Issue: "Spreadsheet not found"
**Solution**: 
1. Verify the spreadsheet ID is correct
2. Ensure the service account email has editor access to the spreadsheet
3. Check that Google Sheets API is enabled in Google Cloud Console

### Issue: "Permission denied"
**Solution**: Add the service account email as an editor to your Google Sheet:
1. Open your Google Sheet
2. Click "Share" button
3. Add: `spectra-autoart@spectra-autoart.iam.gserviceaccount.com` as Editor

## 📋 Verification Checklist

After deployment, verify:
- [ ] Railway logs show "Google Sheets service initialized successfully"
- [ ] No "using demo data" messages in logs
- [ ] /api/vehicles returns actual data from your sheet
- [ ] Vehicle services are loaded from Google Sheets
- [ ] Application works without the black page issue

## 🆘 Still Having Issues?

If the problem persists after following these steps:

1. **Check Railway logs**: `railway logs --tail 100`
2. **Run verification script**: `railway run node scripts/verify-production-railway.js`
3. **Test API endpoints**: Check if `/api/vehicles` returns real data
4. **Verify spreadsheet access**: Ensure service account has editor permissions

The Google Sheets integration should now work correctly in production! 🎉