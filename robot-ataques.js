import fs from 'fs';
import https from 'https';

// Tu lista original (¡Añade aquí los de Paldea, Hisui y Megas si los separaste!)
const ROSTER = [
  'venusaur', 'charizard', 'blastoise', 'beedrill', 'pidgeot', 'arbok', 'pikachu', 'raichu',
  'clefable', 'ninetales', 'arcanine', 'alakazam', 'machamp', 'victreebel', 'slowbro',
  'gengar', 'kangaskhan', 'starmie', 'pinsir', 'tauros', 'gyarados', 'ditto', 'vaporeon',
  'jolteon', 'flareon', 'aerodactyl', 'snorlax', 'dragonite', 'meganium', 'typhlosion',
  'feraligatr', 'ariados', 'ampharos', 'azumarill', 'politoed', 'espeon', 'umbreon', 'slowking',
  'forretress', 'steelix', 'scizor', 'heracross', 'skarmory', 'houndoom', 'tyranitar', 'pelipper',
  'gardevoir', 'sableye', 'aggron', 'medicham', 'manectric', 'sharpedo', 'camerupt', 'torkoal',
  'altaria', 'milotic', 'castform', 'banette', 'chimecho', 'absol', 'glalie', 'torterra',
  'infernape', 'empoleon', 'luxray', 'roserade', 'rampardos', 'bastiodon', 'lopunny', 'spiritomb',
  'garchomp', 'lucario', 'hippowdon', 'toxicroak', 'abomasnow', 'weavile', 'rhyperior', 'leafeon',
  'glaceon', 'gliscor', 'mamoswine', 'gallade', 'froslass', 'rotom', 'serperior', 'emboar',
  'samurott', 'watchog', 'liepard', 'simisage', 'simisear', 'simipour', 'excadrill', 'audino',
  'conkeldurr', 'whimsicott', 'krookodile', 'cofagrigus', 'garbodor', 'zoroark', 'reuniclus',
  'vanilluxe', 'emolga', 'chandelure', 'beartic', 'stunfisk', 'golurk', 'hydreigon', 'volcarona',
  'chesnaught', 'delphox', 'greninja', 'diggersby', 'talonflame', 'vivillon', 'floette',
  'florges', 'pangoro', 'furfrou', 'meowstic', 'aegislash', 'aromatisse', 'slurpuff', 'clawitzer',
  'heliolisk', 'tyrantrum', 'aurorus', 'sylveon', 'hawlucha', 'dedenne', 'goodra', 'klefki',
  'trevenant', 'gourgeist', 'avalugg', 'noivern', 'decidueye', 'incineroar', 'primarina',
  'toucannon', 'crabominable', 'lycanroc', 'toxapex', 'mudsdale', 'araquanid', 'salazzle',
  'tsareena', 'oranguru', 'passimian', 'mimikyu', 'drampa', 'kommoo', 'corviknight', 'flapple',
  'appletun', 'sandaconda', 'polteageist', 'hatterene', 'mrrime', 'runerigus', 'alcremie',
  'morpeko', 'dragapult',
  
  // --- AÑADE AQUÍ LOS NUEVOS SI FALTAN EN TU ARRAY ORIGINAL ---
  'raichualola', 'ninetalesalola', 'arcaninehisui', 'slowbrogalar', 'taurospaldeacombat', 
  'taurospaldeablaze', 'taurospaldeaaqua', 'typhlosionhisui', 'slowkinggalar', 'samurotthisui', 
  'zoroarkhisui', 'stunfiskgalar', 'avalugghisui', 'decidueyehisui', 'wyrdeer', 'kleavor', 
  'basculegion', 'sneasler', 'meowscarada', 'skeledirge', 'quaquaval', 'maushold', 'garganacl', 
  'armarouge', 'ceruledge', 'bellibolt', 'scovillain', 'espathra', 'tinkaton', 'palafin', 
  'orthworm', 'glimmora', 'farigiraf', 'kingambit', 'sinistcha', 'archaludon', 'hydrapple', 
  'venusaurmega', 'charizardmegax', 'charizardmegay', 'gengarmega' // Añade el resto de megas...
];

// EL SÚPER-TRADUCTOR INCORPORADO A TU CÓDIGO
const getApiName = (id) => {
  let name = id.replace('_', '');
  
  // Las Megas aprenden lo mismo que su forma base
  if (name.endsWith('megax')) return name.replace('megax', '');
  if (name.endsWith('megay')) return name.replace('megay', '');
  if (name.endsWith('mega')) return name.replace('mega', '');
  
  // Reglas para formas regionales
  if (name.endsWith('alola')) name = name.replace('alola', '-alola');
  if (name.endsWith('galar')) name = name.replace('galar', '-galar');
  if (name.endsWith('hisui')) name = name.replace('hisui', '-hisui');
  if (name.endsWith('paldea')) name = name.replace('paldea', '-paldea');
  
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
    'floetteeternal': 'floette-eternal',
    'taurospaldeacombat': 'tauros-paldea-combat-breed',
    'taurospaldeablaze': 'tauros-paldea-blaze-breed',
    'taurospaldeaaqua': 'tauros-paldea-aqua-breed',
    'maushold': 'maushold-family-of-four',
    'palafin': 'palafin-zero'
  };
  
  return map[name] || name;
};

const fetchJson = (url) => new Promise((resolve, reject) => {
  https.get(url, { headers: { 'User-Agent': 'ChampionsCalc/3.0' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve(res.statusCode === 200 ? JSON.parse(data) : null));
  }).on('error', reject);
});

async function run() {
  console.log('Iniciando descarga de ataques desde PokeAPI (tomará 1 minuto)...');
  const db = {};

  for (let i = 0; i < ROSTER.length; i++) {
    const id = ROSTER[i];
    const apiName = getApiName(id);
    process.stdout.write(`[${i + 1}/${ROSTER.length}] Descargando ${id} (Buscando: ${apiName})... `);
    
    try {
      const data = await fetchJson(`https://pokeapi.co/api/v2/pokemon/${apiName}`);
      if (data && data.moves) {
        // Quitamos los guiones para que coincidan con la calculadora (ej: u-turn -> uturn)
        db[id] = data.moves.map(m => m.move.name.replace(/-/g, ''));
        console.log(`¡OK! (${db[id].length} ataques)`);
      } else {
        console.log('❌ No encontrado. (Usará lista vacía)');
        db[id] = [];
      }
    } catch(e) { 
      console.log('❌ Error de conexión.'); 
      db[id] = [];
    }
    
    // Pausa para no saturar la API
    await new Promise(r => setTimeout(r, 100));
  }

  // Genera el archivo directamente donde lo tenías: src/data/learnsets.ts
  fs.writeFileSync('src/data/learnsets.ts', `export const LEARNSETS: Record<string, string[]> = ${JSON.stringify(db, null, 2)};\n`);
  console.log('\n¡ÉXITO! Archivo src/data/learnsets.ts generado mágicamente y con todas las formas raras.');
}

run();