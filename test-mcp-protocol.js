#!/usr/bin/env node
/**
 * Test MCP Protocol - Simulate MCP tool call
 */

const { handleToolCall } = require('./dist/tools/index.js');

console.log('=== Testing MCP Protocol Tool Calls ===\n');

// Simulate MCP tool call request
const testRequest = {
  params: {
    name: 'get_account_summaries',
    arguments: {}
  }
};

console.log('Testing handleToolCall with:', testRequest.params.name);
console.log('');

handleToolCall(testRequest)
  .then(result => {
    console.log('✅ Tool call completed');
    console.log('Result type:', result.isError ? 'Error' : 'Success');
    console.log('Content type:', result.content[0]?.type);
    
    if (result.isError) {
      const errorData = JSON.parse(result.content[0].text);
      console.log('Error:', errorData.error);
      console.log('Message:', errorData.message);
      
      // Auth errors are expected without credentials
      if (errorData.message.includes('auth') || errorData.message.includes('credentials')) {
        console.log('\n✅ Handler works correctly (auth required as expected)');
      } else {
        console.log('\n⚠️  Unexpected error type');
      }
    } else {
      console.log('✅ Tool executed successfully');
    }
  })
  .catch(error => {
    console.error('❌ Tool call failed:', error.message);
    process.exit(1);
  });
