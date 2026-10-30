import fs from 'fs';

let content = fs.readFileSync('src/components/AboutPage.tsx', 'utf8');

// Fix imports
content = content.replace("import { LeafBranch, VegBadge, WhatsAppIcon } from './Icons';", "import { LeafBranch, WhatsAppIcon } from './Icons';");

// Fix lines 227-240
content = content.replace(/\{\s*&&\s*\(\s*<button[\s\S]*?<\/button>\s*\)\s*\}/, '');

fs.writeFileSync('src/components/AboutPage.tsx', content, 'utf8');
console.log('Fixed AboutPage.tsx');
