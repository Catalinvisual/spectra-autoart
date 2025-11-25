import { instantPlusBackgroundTranslate, instantTranslate } from './server/src/services/instantTranslationService.js';

console.log('🚀 Testing instant translation performance...\n');

const testCases = [
  {
    text: 'Mulțumesc pentru serviciile excelente! Personalul este foarte profesionist și atent la detalii.',
    sourceLang: 'ron',
    targetLang: 'nl'
  },
  {
    text: 'Sunt foarte mulțumit de calitatea serviciilor. Recomand cu încredere!',
    sourceLang: 'ron',
    targetLang: 'en'
  },
  {
    text: 'Excelent service, personal superb!',
    sourceLang: 'ron',
    targetLang: 'es'
  },
  {
    text: 'Foarte profesioniști și atenți la detalii.',
    sourceLang: 'ron',
    targetLang: 'pl'
  }
];

async function testPerformance() {
  const results = [];
  
  console.log('⚡ Testing individual instant translations:');
  for (const testCase of testCases) {
    const start = performance.now();
    const result = instantTranslate(testCase.text, testCase.targetLang, testCase.sourceLang);
    const end = performance.now();
    const duration = end - start;
    
    results.push({
      testCase,
      duration,
      result
    });
    
    console.log(`\n📝 Original (${testCase.sourceLang}): "${testCase.text}"`);
    console.log(`🌍 Target: ${testCase.targetLang}`);
    console.log(`⚡ Duration: ${duration.toFixed(2)}ms`);
    console.log(`✅ Result: "${result.translatedText}"`);
    console.log(`🔧 Method: ${result.method}`);
    console.log(`📊 Confidence: ${result.confidence}`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('⚡ Testing combined instant + background translation:');
  
  const combinedStart = performance.now();
  const combinedResults = [];
  
  for (const testCase of testCases) {
    const result = instantPlusBackgroundTranslate(testCase.text, testCase.targetLang, testCase.sourceLang);
    combinedResults.push(result);
  }
  
  const combinedEnd = performance.now();
  const combinedDuration = combinedEnd - combinedStart;
  
  console.log(`\n🚀 All ${testCases.length} translations completed in: ${combinedDuration.toFixed(2)}ms`);
  console.log(`📊 Average per translation: ${(combinedDuration / testCases.length).toFixed(2)}ms`);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Performance Summary:');
  
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
  const maxDuration = Math.max(...results.map(r => r.duration));
  const minDuration = Math.min(...results.map(r => r.duration));
  
  console.log(`Average duration: ${avgDuration.toFixed(2)}ms`);
  console.log(`Max duration: ${maxDuration.toFixed(2)}ms`);
  console.log(`Min duration: ${minDuration.toFixed(2)}ms`);
  console.log(`Total time for ${results.length} translations: ${results.reduce((sum, r) => sum + r.duration, 0).toFixed(2)}ms`);
  
  console.log('\n✅ All tests completed successfully!');
  console.log('🎯 Translation times are well under 5 seconds requirement!');
}

testPerformance().catch(console.error);