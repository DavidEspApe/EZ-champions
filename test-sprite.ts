import { ITEMS_DB } from './src/data/items';

const items = ['Barbaracite', 'Baxcalibrite', 'Dragalgite', 'Mawilite', 'Salamencite', 'Sceptilite', 'Scolipite', 'Scraftinite', 'Staraptite'];

items.forEach(itemName => {
    const item = Object.values(ITEMS_DB).find(i => i.name === itemName);
    let sprite = '';
    if (item && item.sprite) {
        sprite = item.sprite;
    } else {
        let cleanName = itemName.toLowerCase().replace(/'/g, '');
        cleanName = cleanName.replace(/[^a-z0-9]+/g, '-');
        cleanName = cleanName.replace(/^-+|-+$/g, '');
        sprite = `https://play.pokemonshowdown.com/sprites/itemicons/${cleanName}.png`;
    }
    console.log(`${itemName} => ${sprite}`);
});
