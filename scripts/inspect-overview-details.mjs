import fs from 'fs';

const overviewData = JSON.parse(fs.readFileSync('scripts/parsed-overview-data.json', 'utf-8'));
const resPage = overviewData.pages.restaurant['20648277'];

console.log('--- SECTION RES DETAILS ---');
console.log(JSON.stringify(resPage.sections.SECTION_RES_DETAILS, null, 2));

console.log('--- SECTION REVIEW HIGHLIGHTS ---');
console.log(JSON.stringify(resPage.sections.SECTION_REVIEW_HIGHLIGHTS, null, 2));
