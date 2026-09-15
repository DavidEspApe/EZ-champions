import fs from 'fs';

const VALID_TYPES = ['Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];

const text = fs.readFileSync('src/data/champions-custom.ts', 'utf-8');
const objText = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
let customDex;
try {
  customDex = eval('(' + objText + ')');
} catch (e) {
  console.error('Error parsing champions-custom.ts:', e.message);
  process.exit(1);
}

let errorsCount = 0;
let warningsCount = 0;

for (const [id, mon] of Object.entries(customDex)) {
  const logError = (msg) => { console.log(`\x1b[31m[ERROR]\x1b[0m \x1b[33m${id}\x1b[0m: ${msg}`); errorsCount++; };
  const logWarn = (msg) => { console.log(`\x1b[35m[WARN]\x1b[0m  \x1b[33m${id}\x1b[0m: ${msg}`); warningsCount++; };

  if (!mon.name) logError('Missing name');
  
  if (!mon.types || !Array.isArray(mon.types) || mon.types.length === 0) {
    logError('Missing or invalid types array');
  } else {
    for (const t of mon.types) {
      if (!VALID_TYPES.includes(t)) logError(`Invalid type: "${t}"`);
    }
    if (mon.types.length > 2) logError(`Too many types: ${mon.types.length}`);
  }

  if (!mon.baseStats) {
    logError('Missing baseStats');
  } else {
    const requiredStats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
    for (const s of requiredStats) {
      if (typeof mon.baseStats[s] !== 'number') logError(`Invalid baseStat: ${s} is not a number`);
      else if (mon.baseStats[s] <= 0 || mon.baseStats[s] > 255) logWarn(`Stat ${s} is unusual (${mon.baseStats[s]})`);
    }
  }

  if (!mon.abilities || !Array.isArray(mon.abilities)) {
    logError('Missing abilities array');
  } else {
    if (mon.abilities.length === 0) logWarn('Empty abilities array');
    for (const a of mon.abilities) {
      if (typeof a !== 'string') logError(`Invalid ability type: ${a}`);
    }
  }

  if (typeof mon.weightkg !== 'number') logError(`Invalid weightkg: ${mon.weightkg}`);
  else if (mon.weightkg <= 0) logWarn(`Weight is zero or negative`);
}

console.log(`\nScan complete: \x1b[31m${errorsCount} Errors\x1b[0m, \x1b[35m${warningsCount} Warnings\x1b[0m across ${Object.keys(customDex).length} pokemon.`);
