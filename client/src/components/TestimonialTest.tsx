import React, { useState } from 'react';
import { publicAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';

// Test component for testimonial submission
const TestimonialTest: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  const runTestimonialTest = async () => {
    setIsTesting(true);
    setTestResult('');
    
    try {
      console.log('🧪 Starting testimonial submission test...');
      
      // Test data
      const testData = {
        name: 'Test User ' + Date.now(),
        rating: 5,
        comment: 'This is a test testimonial submitted at ' + new Date().toISOString()
      };
      
      console.log('📤 Submitting testimonial:', testData);
      
      // Submit testimonial
      const response = await publicAPI.submitTestimonial(testData);
      
      console.log('✅ Testimonial submitted successfully:', response);
      showSuccess('Testimonial submitted successfully!');
      setTestResult('✅ Test passed! Check Google Sheets for the new testimonial.');
      
    } catch (error) {
      console.error('❌ Testimonial submission failed:', error);
      showError('Testimonial submission failed: ' + (error as Error).message);
      setTestResult('❌ Test failed: ' + (error as Error).message);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #ccc', margin: '20px', borderRadius: '8px' }}>
      <h3>🧪 Testimonial Submission Test</h3>
      <p>This will submit a test testimonial to verify the system works.</p>
      <button 
        onClick={runTestimonialTest} 
        disabled={isTesting}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: isTesting ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isTesting ? 'not-allowed' : 'pointer'
        }}
      >
        {isTesting ? 'Testing...' : 'Run Test'}
      </button>
      {testResult && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: testResult.includes('✅') ? '#d4edda' : '#f8d7da', borderRadius: '4px' }}>
          {testResult}
        </div>
      )}
    </div>
  );
};

export default TestimonialTest;