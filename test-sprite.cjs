const fs = require('fs');

const itemsPath = 'src/data/items.ts';
let content = fs.readFileSync(itemsPath, 'utf8');

const items = ['Barbaracite', 'Baxcalibrite', 'Dragalgite', 'Mawilite', 'Salamencite', 'Sceptilite', 'Scolipite', 'Scraftinite', 'Staraptite'];

items.forEach(itemName => {
    // We just find name: 'itemName' and see the sprite
    const regex = new RegExp(`name:\\s*'${itemName}',\\s*sprite:\\s*'([^']+)'`);
    const match = regex.exec(content);
    if (match) {
        console.log(`${itemName} => ${match[1]}`);
    } else {
        console.log(`${itemName} => NO MATCH`);
    }
});
