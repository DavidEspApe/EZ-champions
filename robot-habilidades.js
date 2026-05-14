import fs from 'fs';
import https from 'https';

// 1. LEER LA LISTA REAL
const content = fs.readFileSync('src/data/lista-champions.ts', 'utf8');
const matches = content.match(/['"]([a-z0-9_]+)['"]/gi);
const ROSTER = [...new Set(matches.map(m => m.replace(/['"]/g, '')))];

// 2. TRADUCTOR DE NOMBRES
const getApiName = (id) => {
  let name = id.replace('_', '');
  
  // Reglas dinámicas para formas regionales
  if (name.endsWith('alola')) name = name.replace('alola', '-alola');
  if (name.endsWith('galar')) name = name.replace('galar', '-galar');
  if (name.endsWith('hisui')) name = name.replace('hisui', '-hisui');
  if (name.endsWith('paldea')) name = name.replace('paldea', '-paldea');
  
  // Reglas dinámicas para las Megas Oficiales
  if (name.endsWith('megax')) name = name.replace('megax', '-mega-x');
  else if (name.endsWith('megay')) name = name.replace('megay', '-mega-y');
  else if (name.endsWith('mega')) name = name.replace('mega', '-mega');
  
  const map = {
    'kommoo': 'kommo-o',
    'mrrime': 'mr-rime',
    'meowstic': 'meowstic-male',
    'aegislash': 'aegislash-shield',
    'gourgeist': 'gourgeist-average',
    'lycanroc': 'lycanroc-midday',
    'mimikyu': 'mimikyu-disguised',
    'morpeko': 'morpeko-full-belly',
    'basculegion': 'basculegion-male',
    'hooh': 'ho-oh',
    'porygonz': 'porygon-z',
    'tinglu': 'ting-lu',
    'chienpao': 'chien-pao',
    'wochien': 'wo-chien',
    'chiyu': 'chi-yu',
    'ironvaliant': 'iron-valiant',
    'roaringmoon': 'roaring-moon',
    'walkingwake': 'walking-wake',
    'ironleaves': 'iron-leaves',
    'gougingfire': 'gouging-fire',
    'ragingbolt': 'raging-bolt',
    'ironboulder': 'iron-boulder',
    'ironcrown': 'iron-crown',
    'greattusk': 'great-tusk',
    'screamtail': 'scream-tail',
    'brutebonnet': 'brute-bonnet',
    'fluttermane': 'flutter-mane',
    'slitherwing': 'slither-wing',
    'sandyshocks': 'sandy-shocks',
    'irontreads': 'iron-treads',
    'ironbundle': 'iron-bundle',
    'ironhands': 'iron-hands',
    'ironjugulis': 'iron-jugulis',
    'ironmoth': 'iron-moth',
    'ironthorns': 'iron-thorns',
    'rotomwash': 'rotom-wash',
    'rotomheat': 'rotom-heat',
    'rotommow': 'rotom-mow',
    'rotomfrost': 'rotom-frost',
    'rotomfan': 'rotom-fan',
    
    // --- LOS NUEVOS REBELDES DE TU LISTA ---
    'floetteeternal': 'floette-eternal',
    'taurospaldeacombat': 'tauros-paldea-combat-breed',
    'taurospaldeablaze': 'tauros-paldea-blaze-breed',
    'taurospaldeaaqua': 'tauros-paldea-aqua-breed',
    'maushold': 'maushold-family-of-four',
    'palafin': 'palafin-zero'
  };
  
  return map[name] || name;
};

const toTitleCase = (str) => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

const fetchJson = (url) => new Promise((resolve) => {
  https.get(url, { headers: { 'User-Agent': 'ChampionsCalc/2.1' } }, (res) => {
    if (res.statusCode !== 200) { resolve(null); return; }
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve(JSON.parse(data)));
  }).on('error', () => resolve(null));
});

async function run() {
  console.log(`Iniciando descarga para ${ROSTER.length} Pokémon encontrados en tu lista...`);
  const db = {};

  for (let i = 0; i < ROSTER.length; i++) {
    const id = ROSTER[i];
    const apiName = getApiName(id);
    process.stdout.write(`[${i + 1}/${ROSTER.length}] Buscando ${id} (API: ${apiName})... `);
    
    const data = await fetchJson(`https://pokeapi.co/api/v2/pokemon/${apiName}`);
    if (data && data.abilities) {
      db[id] = data.abilities.map(a => toTitleCase(a.ability.name));
      console.log('¡OK!');
    } else {
      // Es normal que falle aquí para las Megas Custom (Clefablemega, etc.)
      console.log('❌ No encontrado en la API (Usará la tuya custom o No Ability).');
    }
    
    await new Promise(r => setTimeout(r, 100));
  }

  fs.writeFileSync('src/data/habilidades-descargadas.ts', `export const POKEMON_ABILITIES: Record<string, string[]> = ${JSON.stringify(db, null, 2)};\n`);
  console.log('\n¡ÉXITO! Archivo actualizado.');
}

run();