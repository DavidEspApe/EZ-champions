import type { PokemonType } from './tipos';

export interface Item {
  id: string;
  name: string;
  atkMod?: number;
  spaMod?: number;
  defMod?: number;
  spdMod?: number;
  speMod?: number;
  damageMod?: number;
  boostType?: PokemonType;
  boostMod?: number; 
  resistType?: PokemonType;
  resistMod?: number; 
  isBerry?: boolean;  
  sprite?: string;
}

export const ITEMS_DB: Record<string, Item> = {
  'None': { id: 'None', name: '(none)' },

  'Choice Scarf': { id: 'Choice Scarf', name: 'Choice Scarf', speMod: 1.5 },
  'Leftovers': { id: 'Leftovers', name: 'Leftovers' },
  'Light Ball': { id: 'Light Ball', name: 'Light Ball', atkMod: 2, spaMod: 2 }, // Solo para Pikachu
  'Focus Sash': { id: 'Focus Sash', name: 'Focus Sash' },
  'Focus Band': { id: 'Focus Band', name: 'Focus Band' },
  'Bright Powder': { id: 'Bright Powder', name: 'Bright Powder' },
  'Quick Claw': { id: 'Quick Claw', name: 'Quick Claw' },
  'Shell Bell': { id: 'Shell Bell', name: 'Shell Bell' },
  'King\'s Rock': { id: 'King\'s Rock', name: 'King\'s Rock' },
  'Mental Herb': { id: 'Mental Herb', name: 'Mental Herb' },
  'White Herb': { id: 'White Herb', name: 'White Herb' },

  // --- POTENCIADORES DE TIPO (x1.2) ---
  'Silk Scarf': { id: 'Silk Scarf', name: 'Silk Scarf', boostType: 'Normal', boostMod: 1.2 },
  'Charcoal': { id: 'Charcoal', name: 'Charcoal', boostType: 'Fire', boostMod: 1.2 },
  'Mystic Water': { id: 'Mystic Water', name: 'Mystic Water', boostType: 'Water', boostMod: 1.2 },
  'Magnet': { id: 'Magnet', name: 'Magnet', boostType: 'Electric', boostMod: 1.2 },
  'Miracle Seed': { id: 'Miracle Seed', name: 'Miracle Seed', boostType: 'Grass', boostMod: 1.2 },
  'Never-Melt Ice': { id: 'Never-Melt Ice', name: 'Never-Melt Ice', boostType: 'Ice', boostMod: 1.2 },
  'Black Belt': { id: 'Black Belt', name: 'Black Belt', boostType: 'Fighting', boostMod: 1.2 },
  'Poison Barb': { id: 'Poison Barb', name: 'Poison Barb', boostType: 'Poison', boostMod: 1.2 },
  'Soft Sand': { id: 'Soft Sand', name: 'Soft Sand', boostType: 'Ground', boostMod: 1.2 },
  'Sharp Beak': { id: 'Sharp Beak', name: 'Sharp Beak', boostType: 'Flying', boostMod: 1.2 },
  'Twisted Spoon': { id: 'Twisted Spoon', name: 'Twisted Spoon', boostType: 'Psychic', boostMod: 1.2 },
  'Silver Powder': { id: 'Silver Powder', name: 'Silver Powder', boostType: 'Bug', boostMod: 1.2 },
  'Hard Stone': { id: 'Hard Stone', name: 'Hard Stone', boostType: 'Rock', boostMod: 1.2 },
  'Spell Tag': { id: 'Spell Tag', name: 'Spell Tag', boostType: 'Ghost', boostMod: 1.2 },
  'Dragon Fang': { id: 'Dragon Fang', name: 'Dragon Fang', boostType: 'Dragon', boostMod: 1.2 },
  'Black Glasses': { id: 'Black Glasses', name: 'Black Glasses', boostType: 'Dark', boostMod: 1.2 },
  'Metal Coat': { id: 'Metal Coat', name: 'Metal Coat', boostType: 'Steel', boostMod: 1.2 },
  'Fairy Feather': { id: 'Fairy Feather', name: 'Fairy Feather', boostType: 'Fairy', boostMod: 1.2 },

  // --- BAYAS REDUCTORAS DE DAÑO (x0.5 si es Súper Eficaz) ---
  'Occa Berry': { id: 'Occa Berry', name: 'Occa Berry', resistType: 'Fire', resistMod: 0.5, isBerry: true },
  'Passho Berry': { id: 'Passho Berry', name: 'Passho Berry', resistType: 'Water', resistMod: 0.5, isBerry: true },
  'Wacan Berry': { id: 'Wacan Berry', name: 'Wacan Berry', resistType: 'Electric', resistMod: 0.5, isBerry: true },
  'Rindo Berry': { id: 'Rindo Berry', name: 'Rindo Berry', resistType: 'Grass', resistMod: 0.5, isBerry: true },
  'Yache Berry': { id: 'Yache Berry', name: 'Yache Berry', resistType: 'Ice', resistMod: 0.5, isBerry: true },
  'Chople Berry': { id: 'Chople Berry', name: 'Chople Berry', resistType: 'Fighting', resistMod: 0.5, isBerry: true },
  'Kebia Berry': { id: 'Kebia Berry', name: 'Kebia Berry', resistType: 'Poison', resistMod: 0.5, isBerry: true },
  'Shuca Berry': { id: 'Shuca Berry', name: 'Shuca Berry', resistType: 'Ground', resistMod: 0.5, isBerry: true },
  'Coba Berry': { id: 'Coba Berry', name: 'Coba Berry', resistType: 'Flying', resistMod: 0.5, isBerry: true },
  'Payapa Berry': { id: 'Payapa Berry', name: 'Payapa Berry', resistType: 'Psychic', resistMod: 0.5, isBerry: true },
  'Tanga Berry': { id: 'Tanga Berry', name: 'Tanga Berry', resistType: 'Bug', resistMod: 0.5, isBerry: true },
  'Chilan Berry': { id: 'Chilan Berry', name: 'Chilan Berry', resistType: 'Normal', resistMod: 0.5, isBerry: true },
  'Charti Berry': { id: 'Charti Berry', name: 'Charti Berry', resistType: 'Rock', resistMod: 0.5, isBerry: true },
  'Kasib Berry': { id: 'Kasib Berry', name: 'Kasib Berry', resistType: 'Ghost', resistMod: 0.5, isBerry: true },
  'Haban Berry': { id: 'Haban Berry', name: 'Haban Berry', resistType: 'Dragon', resistMod: 0.5, isBerry: true },
  'Colbur Berry': { id: 'Colbur Berry', name: 'Colbur Berry', resistType: 'Dark', resistMod: 0.5, isBerry: true },
  'Babiri Berry': { id: 'Babiri Berry', name: 'Babiri Berry', resistType: 'Steel', resistMod: 0.5, isBerry: true },
  'Roseli Berry': { id: 'Roseli Berry', name: 'Roseli Berry', resistType: 'Fairy', resistMod: 0.5, isBerry: true },

  // --- OTRAS BAYAS ---
  'Aspear Berry': { id: 'Aspear Berry', name: 'Aspear Berry' },
  'Cheri Berry': { id: 'Cheri Berry', name: 'Cheri Berry' },
  'Chesto Berry': { id: 'Chesto Berry', name: 'Chesto Berry' },
  'Leppa Berry': { id: 'Leppa Berry', name: 'Leppa Berry' },
  'Lum Berry': { id: 'Lum Berry', name: 'Lum Berry' },
  'Oran Berry': { id: 'Oran Berry', name: 'Oran Berry' },
  'Pecha Berry': { id: 'Pecha Berry', name: 'Pecha Berry' },
  'Persim Berry': { id: 'Persim Berry', name: 'Persim Berry' },
  'Rawst Berry': { id: 'Rawst Berry', name: 'Rawst Berry' },
  'Sitrus Berry': { id: 'Sitrus Berry', name: 'Sitrus Berry' },


  // --- MEGA STONES (INCLUIDAS LAS CUSTOM) ---
  'abomasite': { id: 'abomasite', name: 'Abomasite', sprite: '/sprites/abomasite.png?v=2' },
  'absolite': { id: 'absolite', name: 'Absolite', sprite: '/sprites/absolite.png?v=2' },
  'aerodactylite': { id: 'aerodactylite', name: 'Aerodactylite', sprite: '/sprites/aerodactylite.png?v=2' },
  'aggronite': { id: 'aggronite', name: 'Aggronite', sprite: '/sprites/aggronite.png?v=2' },
  'alakazite': { id: 'alakazite', name: 'Alakazite', sprite: '/sprites/alakazite.png?v=2' },
  'altarianite': { id: 'altarianite', name: 'Altarianite', sprite: '/sprites/altarianite.png?v=2' },
  'ampharosite': { id: 'ampharosite', name: 'Ampharosite', sprite: '/sprites/ampharosite.png?v=2' },
  'audinite': { id: 'audinite', name: 'Audinite', sprite: '/sprites/audinite.png?v=2' },
  'banettite': { id: 'banettite', name: 'Banettite', sprite: '/sprites/banettite.png?v=2' },
  'beedrillite': { id: 'beedrillite', name: 'Beedrillite', sprite: '/sprites/beedrillite.png?v=2' },
  'blastoisinite': { id: 'blastoisinite', name: 'Blastoisinite', sprite: '/sprites/blastoisinite.png?v=2' },
  'cameruptite': { id: 'cameruptite', name: 'Cameruptite', sprite: '/sprites/cameruptite.png?v=2' },
  'chandelurite': { id: 'chandelurite', name: 'Chandelurite', sprite: '/sprites/chandelurite.png?v=2' },
  'charizarditex': { id: 'charizarditex', name: 'Charizardite X', sprite: '/sprites/charizarditex.png?v=2' },
  'charizarditey': { id: 'charizarditey', name: 'Charizardite Y', sprite: '/sprites/charizarditey.png?v=2' },
  'chesnaughtite': { id: 'chesnaughtite', name: 'Chesnaughtite', sprite: '/sprites/chesnaughtite.png?v=2' },
  'chimechite': { id: 'chimechite', name: 'Chimechite', sprite: '/sprites/chimechite.png?v=2' },
  'clefablite': { id: 'clefablite', name: 'Clefablite', sprite: '/sprites/clefablite.png?v=2' },
  'crabominite': { id: 'crabominite', name: 'Crabominite', sprite: '/sprites/crabominite.png?v=2' },
  'delphoxite': { id: 'delphoxite', name: 'Delphoxite', sprite: '/sprites/delphoxite.png?v=2' },
  'dragoninite': { id: 'dragoninite', name: 'Dragoninite', sprite: '/sprites/dragoninite.png?v=2' },
  'drampanite': { id: 'drampanite', name: 'Drampanite', sprite: '/sprites/drampanite.png?v=2' },
  'emboarite': { id: 'emboarite', name: 'Emboarite', sprite: '/sprites/emboarite.png?v=2' },
  'excadrite': { id: 'excadrite', name: 'Excadrite', sprite: '/sprites/excadrite.png?v=2' },
  'feraligite': { id: 'feraligite', name: 'Feraligite', sprite: '/sprites/feraligite.png?v=2' },
  'floettite': { id: 'floettite', name: 'Floettite', sprite: '/sprites/floettite.png?v=2' },
  'froslassite': { id: 'froslassite', name: 'Froslassite', sprite: '/sprites/froslassite.png?v=2' },
  'galladite': { id: 'galladite', name: 'Galladite', sprite: '/sprites/galladite.png?v=2' },
  'garchompite': { id: 'garchompite', name: 'Garchompite', sprite: '/sprites/garchompite.png?v=2' },
  'gardevoirite': { id: 'gardevoirite', name: 'Gardevoirite', sprite: '/sprites/gardevoirite.png?v=2' },
  'gengarite': { id: 'gengarite', name: 'Gengarite', sprite: '/sprites/gengarite.png?v=2' },
  'glalitite': { id: 'glalitite', name: 'Glalitite', sprite: '/sprites/glalitite.png?v=2' },
  'glimmoranite': { id: 'glimmoranite', name: 'Glimmoranite', sprite: '/sprites/glimmoranite.png?v=2' },
  'golurkite': { id: 'golurkite', name: 'Golurkite', sprite: '/sprites/golurkite.png?v=2' },
  'greninjite': { id: 'greninjite', name: 'Greninjite', sprite: '/sprites/greninjite.png?v=2' },
  'gyaradosite': { id: 'gyaradosite', name: 'Gyaradosite', sprite: '/sprites/gyaradosite.png?v=2' },
  'hawluchanite': { id: 'hawluchanite', name: 'Hawluchanite', sprite: '/sprites/hawluchanite.png?v=2' },
  'heracronite': { id: 'heracronite', name: 'Heracronite', sprite: '/sprites/heracronite.png?v=2' },
  'houndoominite': { id: 'houndoominite', name: 'Houndoominite', sprite: '/sprites/houndoominite.png?v=2' },
  'kangaskhanite': { id: 'kangaskhanite', name: 'Kangaskhanite', sprite: '/sprites/kangaskhanite.png?v=2' },
  'lopunnite': { id: 'lopunnite', name: 'Lopunnite', sprite: '/sprites/lopunnite.png?v=2' },
  'lucarionite': { id: 'lucarionite', name: 'Lucarionite', sprite: '/sprites/lucarionite.png?v=2' },
  'manectite': { id: 'manectite', name: 'Manectite', sprite: '/sprites/manectite.png?v=2' },
  'medichamite': { id: 'medichamite', name: 'Medichamite', sprite: '/sprites/medichamite.png?v=2' },
  'meganiumite': { id: 'meganiumite', name: 'Meganiumite', sprite: '/sprites/meganiumite.png?v=2' },
  'meowsticite': { id: 'meowsticite', name: 'Meowsticite', sprite: '/sprites/meowsticite.png?v=2' },
  'pidgeotite': { id: 'pidgeotite', name: 'Pidgeotite', sprite: '/sprites/pidgeotite.png?v=2' },
  'pinsirite': { id: 'pinsirite', name: 'Pinsirite', sprite: '/sprites/pinsirite.png?v=2' },
  'sablenite': { id: 'sablenite', name: 'Sablenite', sprite: '/sprites/sablenite.png?v=2' },
  'scizorite': { id: 'scizorite', name: 'Scizorite', sprite: '/sprites/scizorite.png?v=2' },
  'scovillainite': { id: 'scovillainite', name: 'Scovillainite', sprite: '/sprites/scovillainite.png?v=2' },
  'sharpedonite': { id: 'sharpedonite', name: 'Sharpedonite', sprite: '/sprites/sharpedonite.png?v=2' },
  'skarmorite': { id: 'skarmorite', name: 'Skarmorite', sprite: '/sprites/skarmorite.png?v=2' },
  'slowbronite': { id: 'slowbronite', name: 'Slowbronite', sprite: '/sprites/slowbronite.png?v=2' },
  'starminite': { id: 'starminite', name: 'Starminite', sprite: '/sprites/starminite.png?v=2' },
  'steelixite': { id: 'steelixite', name: 'Steelixite', sprite: '/sprites/steelixite.png?v=2' },
  'tyranitarite': { id: 'tyranitarite', name: 'Tyranitarite', sprite: '/sprites/tyranitarite.png?v=2' },
  'venusaurite': { id: 'venusaurite', name: 'Venusaurite', sprite: '/sprites/venusaurite.png?v=2' },
  'victreebelite': { id: 'victreebelite', name: 'Victreebelite', sprite: '/sprites/victreebelite.png?v=2' },

  'raichunitex': { id: 'raichunitex', name: 'Raichunite X', sprite: '/sprites/raichunitex.png?v=2' },

  'raichunitey': { id: 'raichunitey', name: 'Raichunite Y', sprite: '/sprites/raichunitey.png?v=2' },


  // [AUTO-SCRAPED: 2026-09-12]
  'golisopodite': { id: 'golisopodite', name: 'Golisopodite', sprite: '/sprites/golisopodite.png?v=2' },


  // [AUTO-SCRAPED: 2026-09-12]
  'mawilite': { id: 'mawilite', name: 'Mawilite', sprite: '/sprites/mawilite.png?v=2' },


  // [AUTO-SCRAPED: 2026-09-12]
  'sceptilite': { id: 'sceptilite', name: 'Sceptilite', sprite: '/sprites/sceptilite.png?v=2' },

  // [AUTO-SCRAPED: 2026-09-12]
  'blazikenite': { id: 'blazikenite', name: 'Blazikenite', sprite: '/sprites/blazikenite.png?v=2' },

  // [AUTO-SCRAPED: 2026-09-12]
  'swampertite': { id: 'swampertite', name: 'Swampertite', sprite: '/sprites/swampertite.png?v=2' },

  // [AUTO-SCRAPED: 2026-09-12]
  'scolipite': { id: 'scolipite', name: 'Scolipite', sprite: '/sprites/scolipite.png?v=2' },

  // [AUTO-SCRAPED: 2026-09-12]
  'scraftinite': { id: 'scraftinite', name: 'Scraftinite', sprite: '/sprites/scraftinite.png?v=2' },

  // [AUTO-SCRAPED: 2026-09-12]
  'eelektrossite': { id: 'eelektrossite', name: 'Eelektrossite', sprite: '/sprites/eelektrossite.png?v=2' },

  // [AUTO-SCRAPED: 2026-09-12]
  'pyroarite': { id: 'pyroarite', name: 'Pyroarite', sprite: '/sprites/pyroarite.png?v=2' },

  // [AUTO-SCRAPED: 2026-09-12]
  'falinksite': { id: 'falinksite', name: 'Falinksite', sprite: '/sprites/falinksite.png?v=2' },

  // [AUTO-SCRAPED: 2026-09-12]
  'metagrossite': { id: 'metagrossite', name: 'Metagrossite', sprite: '/sprites/metagrossite.png?v=2' },

  // [AUTO-SCRAPED: 2026-09-12]
  'staraptite': { id: 'staraptite', name: 'Staraptite', sprite: '/sprites/staraptite.png?v=2' },

  // [AUTO-SCRAPED: 2026-09-12]
  'malamarite': { id: 'malamarite', name: 'Malamarite', sprite: '/sprites/malamarite.png?v=2' },

  // [AUTO-SCRAPED: 2026-09-12]
  'barbaracite': { id: 'barbaracite', name: 'Barbaracite', sprite: '/sprites/barbaracite.png?v=2' },

  // [AUTO-SCRAPED: 2026-09-12]
  'dragalgite': { id: 'dragalgite', name: 'Dragalgite', sprite: '/sprites/dragalgite.png?v=2' },


  // [AUTO-SCRAPED: 2026-09-12]
  'salamencite': { id: 'salamencite', name: 'Salamencite', sprite: '/sprites/salamencite.png?v=2' },

  // [AUTO-SCRAPED: 2026-09-12]
  'baxcalibrite': { id: 'baxcalibrite', name: 'Baxcalibrite', sprite: '/sprites/baxcalibrite.png?v=2' },

  'lucarionitez' : { id: 'lucarionitez', name: 'Lucarionite Z', sprite: '/sprites/lucarionitez.png?v=2' },

  'garchompitez' : { id: 'garchompitez', name: 'Garchompite Z', sprite: '/sprites/garchompitez.png?v=2' },

  'absolitez' : { id: 'absolitez', name: 'Absolite Z', sprite: '/sprites/absolitez.png?v=2' },

  'widelens': { id: 'widelens', name: 'Wide Lens', sprite: '/sprites/widelens.png?v=2' },
  'muscleband': { id: 'muscleband', name: 'Muscle Band', sprite: '/sprites/muscleband.png?v=2' },
  'wiseglasses': { id: 'wiseglasses', name: 'Wise Glasses', sprite: '/sprites/wiseglasses.png?v=2' },
  'lightclay': { id: 'lightclay', name: 'Light Clay', sprite: '/sprites/lightclay.png?v=2' },
  'lifeorb': { id: 'lifeorb', name: 'Life Orb', damageMod: 1.3, sprite: '/sprites/lifeorb.png?v=2' },
  'expertbelt': { id: 'expertbelt', name: 'Expert Belt', sprite: '/sprites/expertbelt.png?v=2' },
  'metronome': { id: 'metronome', name: 'Metronome', sprite: '/sprites/metronome.png?v=2' },
  'scopelens': { id: 'scopelens', name: 'Scope Lens', sprite: '/sprites/scopelens.png?v=2' },
  'ironball': { id: 'ironball', name: 'Iron Ball', speMod: 0.5, sprite: '/sprites/ironball.png?v=2' },
  'heatrock': { id: 'heatrock', name: 'Heat Rock', sprite: '/sprites/heatrock.png?v=2' },
  'icerock': { id: 'icerock', name: 'Ice Rock', sprite: '/sprites/icerock.png?v=2' },
  'damprock': { id: 'damprock', name: 'Damp Rock', sprite: '/sprites/damprock.png?v=2' },
  'smoothrock': { id: 'smoothrock', name: 'Smooth Rock', sprite: '/sprites/smoothrock.png?v=2' },
  'shedshell': { id: 'shedshell', name: 'Shed Shell', sprite: '/sprites/shedshell.png?v=2' },
  'bigroot': { id: 'bigroot', name: 'Big Root', sprite: '/sprites/bigroot.png?v=2' },
  'rockyhelmet': { id: 'rockyhelmet', name: 'Rocky Helmet', sprite: '/sprites/rockyhelmet.png?v=2' },
  'redcard': { id: 'redcard', name: 'Red Card', sprite: '/sprites/redcard.png?v=2' },
  'airballoon': { id: 'airballoon', name: 'Air Balloon', sprite: '/sprites/airballoon.png?v=2' },
  'ejectbutton': { id: 'ejectbutton', name: 'Eject Button', sprite: '/sprites/ejectbutton.png?v=2' },
  'bindingband': { id: 'bindingband', name: 'Binding Band', sprite: '/sprites/bindingband.png?v=2' },
  'leek': { id: 'leek', name: 'Leek', sprite: '/sprites/leek.png?v=2' },
  'normalgem': { id: 'normalgem', name: 'Normal Gem', boostType: 'Normal', boostMod: 1.3, sprite: '/sprites/normalgem.png?v=2' },
  'terrainextender': { id: 'terrainextender', name: 'Terrain Extender', sprite: '/sprites/terrainextender.png?v=2' },
  'electricseed': { id: 'electricseed', name: 'Electric Seed', sprite: '/sprites/electricseed.png?v=2' },
  'psychicseed': { id: 'psychicseed', name: 'Psychic Seed', sprite: '/sprites/psychicseed.png?v=2' },
  'mistyseed': { id: 'mistyseed', name: 'Misty Seed', sprite: '/sprites/mistyseed.png?v=2' },
  'grassyseed': { id: 'grassyseed', name: 'Grassy Seed', sprite: '/sprites/grassyseed.png?v=2' },
};
