const fs = require('fs');
const compiler = require('vue-template-compiler');

const filePath = process.argv[2];
const fileContent = fs.readFileSync(filePath, 'utf8');

try {
  const parsed = compiler.parseComponent(fileContent);
  console.log('Vue file parsed successfully');
  console.log('Template errors:', parsed.template && parsed.template.errors);
  console.log('Script errors:', parsed.script && parsed.script.errors);
} catch (error) {
  console.error('Error parsing Vue file:', error.message);
}