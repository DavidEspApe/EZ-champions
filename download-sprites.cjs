const fs = require('fs');
const https = require('https');
const path = require('path');

const itemsPath = 'src/data/items.ts';
let content = fs.readFileSync(itemsPath, 'utf8');

// Find all occurrences of sprite: 'https://...'
const regex = /'([^']+)'\s*:\s*\{[^}]*sprite:\s*'([^']+)'[^}]*\}/g;
let match;
let downloads = [];

while ((match = regex.exec(content)) !== null) {
    const id = match[1];
    const url = match[2];
    
    if (url.startsWith('http')) {
        downloads.push({ id, url });
    }
}

if (downloads.length === 0) {
    console.log("No external sprites found.");
    process.exit(0);
}

console.log(`Found ${downloads.length} external sprites to download.`);

let completed = 0;
downloads.forEach(({ id, url }) => {
    const filePath = path.join('public', 'sprites', `${id}.png`);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${id}.png`);
            
            // Replace the URL in the content with the local path
            content = content.replace(`sprite: '${url}'`, `sprite: '/sprites/${id}.png'`);
            
            completed++;
            if (completed === downloads.length) {
                fs.writeFileSync(itemsPath, content, 'utf8');
                console.log("All downloads finished and items.ts updated.");
            }
        });
    }).on('error', (err) => {
        fs.unlink(filePath, () => {});
        console.error(`Error downloading ${id}: ${err.message}`);
    });
});
