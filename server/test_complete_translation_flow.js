/**
 * Test complet pentru fluxul de traducere DeepL
 * Testează: detectare limbă, traducere în 5 limbi, salvare Google Sheets
 */

import dotenv from 'dotenv';
import { translateMultipleWithDeepL, detectLanguageWithDeepL } from './src/services/deeplTranslationService.js';
import GoogleSheetsService from './src/services/googleSheetsService.js';

// Încarcă variabilele de mediu
dotenv.config();

async function testCompleteTranslationFlow() {
  console.log('🚀 Începere test complet flux traducere DeepL...\n');
  
  // Test 1: Detectare limbă română
  const romanianText = "Serviciile oferite au depășit cu mult așteptările mele. Personalul este foarte profesionist și atent la detalii. Recomand cu încredere!";
  
  console.log('📝 Test 1: Detectare limbă română');
  console.log(`Text original: ${romanianText}`);
  
  try {
    const detectedLanguage = await detectLanguageWithDeepL(romanianText);
    console.log(`✅ Limbă detectată: ${detectedLanguage}`);
    
    if (detectedLanguage !== 'RO') {
      console.log(`⚠️ Atenție: Limba detectată este ${detectedLanguage}, dar ne așteptam la RO`);
    }
  } catch (error) {
    console.error('❌ Eroare detectare limbă:', error.message);
    return;
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Test 2: Traducere în toate cele 5 limbi
  console.log('🌐 Test 2: Traducere în 5 limbi folosind DeepL');
  
  const targetLanguages = ['NL', 'EN', 'ES', 'PL', 'RO'];
  
  try {
    const startTime = Date.now();
    const translations = await translateMultipleWithDeepL(romanianText, targetLanguages, 'RO');
    const duration = Date.now() - startTime;
    
    console.log(`✅ Traducere completă în ${duration}ms:\n`);
    
    Object.entries(translations).forEach(([lang, translation]) => {
      console.log(`${lang}: ${translation}`);
    });
    
    // Verificăm că traducerile sunt diferite de textul original
    const uniqueTranslations = Object.values(translations).filter(t => t !== romanianText);
    console.log(`\n📊 ${uniqueTranslations.length}/4 traduceri unice (excluzând limba sursă)`);
    
    if (uniqueTranslations.length < 4) {
      console.log('⚠️ Atenție: Unele traduceri sunt identice cu textul original');
    }
    
  } catch (error) {
    console.error('❌ Eroare traducere multiplă:', error.message);
    return;
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Test 3: Salvare în Google Sheets
  console.log('📊 Test 3: Salvare testimonial în Google Sheets');
  
  try {
    // Creează un testimonial complet
    const translations = await translateMultipleWithDeepL(romanianText, targetLanguages, 'RO');
    
    const testimonialData = [
      `test-${Date.now()}`,           // ID
      'George',                       // Name
      '5',                            // Rating
      translations['NL'] || romanianText, // Comment_NL
      translations['EN'] || romanianText, // Comment_EN
      translations['ES'] || romanianText, // Comment_ES
      translations['PL'] || romanianText, // Comment_PL
      translations['RO'] || romanianText, // Comment_RO
      'true',                         // Active
      new Date().toISOString().split('T')[0] // Created_Date
    ];
    
    console.log('📤 Salvare date testimonial:');
    console.log(`ID: ${testimonialData[0]}`);
    console.log(`Nume: ${testimonialData[1]}`);
    console.log(`Rating: ${testimonialData[2]}`);
    console.log(`NL: ${testimonialData[3].substring(0, 50)}...`);
    console.log(`EN: ${testimonialData[4].substring(0, 50)}...`);
    console.log(`ES: ${testimonialData[5].substring(0, 50)}...`);
    console.log(`PL: ${testimonialData[6].substring(0, 50)}...`);
    console.log(`RO: ${testimonialData[7].substring(0, 50)}...`);
    
    // Salvează în Google Sheets
    await GoogleSheetsService.appendData('Testimonials', testimonialData);
    console.log('\n✅ Testimonial salvat cu succes în Google Sheets!');
    
  } catch (error) {
    console.error('❌ Eroare salvare Google Sheets:', error.message);
    return;
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Test 4: Verificare integritate date
  console.log('🔍 Test 4: Verificare integritate date salvate');
  
  try {
    // Obține ultimele testimoniale
    const allTestimonials = await GoogleSheetsService.getData('Testimonials');
    
    if (allTestimonials.length > 1) {
      const lastTestimonial = allTestimonials[allTestimonials.length - 1];
      const headers = allTestimonials[0];
      
      console.log('📋 Ultimul testimonial salvat:');
      headers.forEach((header, index) => {
        if (header.includes('Comment')) {
          console.log(`${header}: ${lastTestimonial[index]?.substring(0, 60)}...`);
        } else {
          console.log(`${header}: ${lastTestimonial[index]}`);
        }
      });
      
      // Verificăm că toate coloanele de comentarii au conținut diferit
      const commentColumns = [3, 4, 5, 6, 7]; // Comment_NL, Comment_EN, Comment_ES, Comment_PL, Comment_RO
      const comments = commentColumns.map(i => lastTestimonial[i]);
      const uniqueComments = new Set(comments);
      
      console.log(`\n📊 ${uniqueComments.size}/5 comentarii unice în coloane`);
      
      if (uniqueComments.size < 4) {
        console.log('⚠️ Atenție: Unele coloane au conținut identic');
      } else {
        console.log('✅ Toate coloanele au conținut diferit - traducere reușită!');
      }
      
    } else {
      console.log('⚠️ Nu există testimoniale în Google Sheets');
    }
    
  } catch (error) {
    console.error('❌ Eroare verificare date:', error.message);
  }
  
  console.log('\n🎉 Test complet finalizat!');
}

// Rulează testul
testCompleteTranslationFlow().catch(error => {
  console.error('❌ Eroare test:', error);
  process.exit(1);
});