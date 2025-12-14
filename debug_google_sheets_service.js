import GoogleSheetsService from './server/src/services/googleSheetsService.js';

console.log('🔍 Debugging GoogleSheetsService...');
console.log('📊 Service instance:', GoogleSheetsService);
console.log('📊 isInitialized:', GoogleSheetsService.isInitialized);
console.log('📊 isDemoMode:', GoogleSheetsService.isDemoMode);
console.log('📊 Type of service:', typeof GoogleSheetsService);
console.log('📊 Constructor name:', GoogleSheetsService.constructor.name);
console.log('📊 All properties:', Object.keys(GoogleSheetsService));
console.log('📊 All properties (inherited):', Object.getOwnPropertyNames(Object.getPrototypeOf(GoogleSheetsService)));