import fs from 'fs';
import path from 'path';

const viewerPath = path.resolve('Greenwood_Zomato_Data/gallery_viewer.html');
let html = fs.readFileSync(viewerPath, 'utf-8');

// Replace /images/zomato/ with ./images/ so opening directly in browser from file system works seamlessly
html = html.replaceAll('/images/zomato/', './images/');

fs.writeFileSync(viewerPath, html, 'utf-8');
console.log('Updated gallery_viewer.html with relative paths for local viewing!');
