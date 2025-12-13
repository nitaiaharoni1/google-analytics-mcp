#!/usr/bin/env node
/**
 * Test MCP Tools - Verify all tools are callable
 */

const { getToolDefinitions } = require('./dist/tools/index.js');

console.log('=== Testing MCP Tools Registration ===\n');

try {
  const tools = getToolDefinitions();
  console.log(`✅ Successfully loaded ${tools.length} tools\n`);
  
  console.log('=== Tool Names ===');
  tools.forEach((tool, index) => {
    console.log(`${index + 1}. ${tool.name}`);
  });
  
  console.log(`\n✅ All ${tools.length} tools are registered and accessible`);
  
  // Check for duplicates
  const names = tools.map(t => t.name);
  const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
  if (duplicates.length > 0) {
    console.log(`\n⚠️  Found duplicate tool names: ${duplicates.join(', ')}`);
  } else {
    console.log('✅ No duplicate tool names found');
  }
  
  // Check all tools have required fields
  const missingFields = [];
  tools.forEach(tool => {
    if (!tool.name) missingFields.push(`${tool.name || 'UNNAMED'}: missing name`);
    if (!tool.description) missingFields.push(`${tool.name}: missing description`);
    if (!tool.inputSchema) missingFields.push(`${tool.name}: missing inputSchema`);
    if (!tool.handler || typeof tool.handler !== 'function') {
      missingFields.push(`${tool.name}: missing or invalid handler`);
    }
  });
  
  if (missingFields.length > 0) {
    console.log(`\n❌ Tools with missing fields:`);
    missingFields.forEach(f => console.log(`   - ${f}`));
  } else {
    console.log('✅ All tools have required fields (name, description, inputSchema, handler)');
  }
  
} catch (error) {
  console.error('❌ Error loading tools:', error.message);
  process.exit(1);
}
