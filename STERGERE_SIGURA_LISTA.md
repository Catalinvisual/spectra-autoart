# LISTĂ FIȘIERE CARE POT FI ȘTERSE ÎN SIGURANȚĂ

## ⚠️ ATENȚIE: Verifică întotdeauna înainte de a șterge!

### 🔴 FIȘIERE DE TEST - 100% SIGUR (pot fi șterse fără grijă)

test-get-services.js
test-edit.js
debug-sheets.js
debug-jwt-auth.js
check-sheets.js
test_cancellation_email.js
test_production_login.js
test_production_auth.js
test_real_auth.js
test_correct_auth.js
test_admin_endpoints.js
test_admin_with_auth.js
test_direct_admin.js
test_sheets_sync.js
test_patch_with_debug.js
test_patch_error_handling.js
test_patch_detailed.js
test_calendar_update.js
simple_update_test.js
simple_patch_test.js
test_google_sheets_update.js
detailed_patch_test.js
test-bulletproof-healthcheck.js
test-ultimate-solution.js
test-emergency-server.js
test-healthcheck.js
check_booking_data.js
monitor_deployment.js
debug_service_state.js
debug_production_status.js
debug_google_sheets_service.js
comprehensive_production_test.js
check_production_status.js
wait_for_deployment.js
troubleshoot_deployment.js

### 🟡 FIȘIERE DE FORCE/DEPLOYMENT - SIGUR
create_github_package.js
force_push_nuclear.js
create_package.js
build_and_push.js
force_push_all.js
persistent_git_commit.js
final_git_push.js
force_git_commit.js
rollback_to_stable.js

### 🔵 FIȘIERE POWERHELL DE TEST - SIGUR
test-debug-updateData.ps1
test-final-persistence.ps1
test-direct-google-sheets.ps1
test-verify-permanence.ps1
test-permanent-patch.ps1
test-patch-debug.ps1
test-patch-simple.ps1
test-all-columns-fixed.ps1
test-all-columns.ps1
test-curl.ps1
test-getcolumnindex.ps1
test-ultimul.ps1
test-final.ps1
test-different-values.ps1
test-fresh-token.ps1
test-logout-simple.ps1
test-logout-login.ps1
test-simple-admin.ps1
test-admin-full.ps1
test-update-simple.ps1
test-update.ps1
wait_and_check.ps1
test_patch_simple.ps1

### 🟢 FIȘIERE SHELL/BAT DE TEST - SIGUR
force_redeploy.sh
deploy_demo_fix.sh
force_redeploy_final.sh
deploy_demo_fix.bat

### 🟠 FIȘIERE DE TEST DIN SERVER - SIGUR (toate fișierele server/test*.js)
server/test_new_booking_demo.js
server/test_edit_booking_demo.js
server/test_cancel_booking_demo.js
server/test_edit_correct_id.js
server/test_create_and_edit.js
server/test_admin_edit.js
server/test_debug_state.js
server/test_debug_services.js
server/test_vehicle_service_structure.js
server/test_admin_response_structure.js
server/test_admin_edit_complete.js
server/test_correct_booking_structure.js
server/test_correct_booking_route.js
server/test_server_processing.js
server/test_server_logs.js
server/test_complete_flow.js
server/test_token_and_edit.js
server/test_create_booking_8081.js
server/test_create_booking_demo.js
server/test_real_server_services.js
server/test_real_services.js
server/test_admin_logic.js
server/test_server_endpoint.js
server/test_server_direct.js
server/test_server_startup.js
server/test_server_services.js
server/test_server_state.js
server/test_direct_initialize.js
server/test_admin_context.js
server/test_initialize_demo.js
server/test_vehicle_service.js
server/test-get-booking.js
server/test_token.js
server/test-client-email.js
server/test-resend.js

### 🟣 FIȘIERE DOCKERFILE MULTIPLE - SIGUR
Dockerfile.simple
Dockerfile.production
railway-bulletproof-v2.Dockerfile
railway-hybrid-prod.Dockerfile

### 🔴 FIȘIERE DOCUMENTAȚIE - OPȚIONAL
generate-token.js
generate_jwt.js
generate_correct_token.js
generate_simple_token.js
get_admin_token.js
email-troubleshooting-guide.js
DEVELOPMENT_GUIDE.md
GOOGLE_SHEETS_FIX.md
RAILWAY_DEPLOYMENT.md
RAILWAY_GOOGLE_SHEETS_SETUP.md

### ⚫ FIȘIERE TEMPORARE ȘI CIUDATE - SIGUR
Service.updateData to clear cache and force reload after updates
deployment_trigger.txt
ROLLBACK_COMPLETED.txt

### 🟤 DIRECTOR TEMPORAR - SIGUR
temp-git-fix/ (tot directorul)

### 🔵 COMPONENTĂ DE TEST - SIGUR
client/src/components/TestimonialTest.tsx

## 📊 STATISTICI
- Total fișiere de test: ~80+ fișiere
- Total fișiere debug/deployment: ~20+ fișiere
- Total fișiere documentație: ~10 fișiere
- Estimare spațiu economisit: ~5-10 MB

## ✅ VERIFICARE FINALĂ
Înainte de a șterge, asigură-te că:
1. Nu ștergi fișierele esențiale menționate mai sus
2. Faci un backup sau commit înainte de ștergere
3. Testezi aplicația după ștergere
4. Verifici că nu ai șters fișiere care sunt importate în codul principal

## ⚠️ CE NU TREBUIE ȘTERS SUB NICIUN CHIP:
- railway-start.js (este folosit pentru pornire)
- Dockerfile (principal)
- Toate package.json
- Fișiere din server/src/ (cu excepția celor de test)
- Fișiere din client/src/ (cu excepția TestimonialTest.tsx)
- server/config/service-account.json
- uploads/gallery/ (conține imagini)