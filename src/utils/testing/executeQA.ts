// Execute the complete payment flow QA test and generate report
console.log('🚀 EXECUTING COMPLETE PAYMENT FLOW QA TEST');
console.log('===========================================');

import('./completeFlowQA.js').then(async (module) => {
  const results = await module.simulateCompletePaymentFlow();
  module.generateQAReport(results);
  return results;
});