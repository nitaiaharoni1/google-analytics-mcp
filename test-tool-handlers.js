#!/usr/bin/env node
/**
 * Test Tool Handlers - Verify handlers can be called
 */

const { getToolDefinitions } = require('./dist/tools/index.js');

console.log('=== Testing Tool Handlers ===\n');

const tools = getToolDefinitions();
let tested = 0;
let errors = 0;

// Test a few key tools with minimal valid inputs
const testCases = [
  { name: 'get_account_summaries', args: {} },
  { name: 'list_accounts', args: {} },
  { name: 'list_properties', args: {} },
];

console.log('Testing handler callability (will fail without auth, but should not crash):\n');

testCases.forEach(({ name, args }) => {
  const tool = tools.find(t => t.name === name);
  if (!tool) {
    console.log(`❌ ${name}: Tool not found`);
    errors++;
    return;
  }
  
  try {
    // Just verify the handler exists and is callable
    if (typeof tool.handler !== 'function') {
      console.log(`❌ ${name}: Handler is not a function`);
      errors++;
      return;
    }
    
    // Try to call it (will fail without auth, but shouldn't crash)
    const promise = tool.handler(args);
    if (!(promise instanceof Promise)) {
      console.log(`❌ ${name}: Handler does not return a Promise`);
      errors++;
      return;
    }
    
    console.log(`✅ ${name}: Handler is callable and returns Promise`);
    tested++;
  } catch (error) {
    // If it's an auth error, that's expected - handler works
    if (error.message.includes('auth') || error.message.includes('credentials')) {
      console.log(`✅ ${name}: Handler works (auth required as expected)`);
      tested++;
    } else {
      console.log(`❌ ${name}: Handler error: ${error.message}`);
      errors++;
    }
  }
});

console.log(`\n📊 Results: ${tested} passed, ${errors} errors`);
process.exit(errors > 0 ? 1 : 0);
