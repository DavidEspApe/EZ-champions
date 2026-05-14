import type { PokemonType } from './tipos';

export interface Item {
  id: string;
  name: string;
  // Multiplicadores directos a las Estadísticas
  atkMod?: number;
  spaMod?: number;
  defMod?: number;
  spdMod?: number;
  speMod?: number;
  // Multiplicadores al Daño Final
  damageMod?: number;
  
  // Potenciadores de tipo
  boostType?: PokemonType;
  boostMod?: number; 
  
  // Bayas reductoras de daño
  resistType?: PokemonType;
  resistMod?: number; 
  isBerry?: boolean;  
}

export const ITEMS_DB: Record<string, Item> = {
  'None': { id: 'None', name: '(none)' },

  // --- OBJETOS BASE DE LA LISTA ---
  'Choice Scarf': { id: 'Choice Scarf', name: 'Choice Scarf', speMod: 1.5 },
  'Leftovers': { id: 'Leftovers', name: 'Leftovers' },
  'Light Ball': { id: 'Light Ball', name: 'Light Ball', atkMod: 2, spaMod: 2 }, // Solo para Pikachu
  'Focus Sash': { id: 'Focus Sash', name: 'Focus Sash' },
  'Focus Band': { id: 'Focus Band', name: 'Focus Band' },
  'Bright Powder': { id: 'Bright Powder', name: 'Bright Powder' },
  'Quick Claw': { id: 'Quick Claw', name: 'Quick Claw' },
  'Scope Lens': { id: 'Scope Lens', name: 'Scope Lens' },
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
  'abomasite': { id: 'abomasite', name: 'Abomasite' },
  'absolite': { id: 'absolite', name: 'Absolite' },
  'aerodactylite': { id: 'aerodactylite', name: 'Aerodactylite' },
  'aggronite': { id: 'aggronite', name: 'Aggronite' },
  'alakazite': { id: 'alakazite', name: 'Alakazite' },
  'altarianite': { id: 'altarianite', name: 'Altarianite' },
  'ampharosite': { id: 'ampharosite', name: 'Ampharosite' },
  'audinite': { id: 'audinite', name: 'Audinite' },
  'banettite': { id: 'banettite', name: 'Banettite' },
  'beedrillite': { id: 'beedrillite', name: 'Beedrillite' },
  'blastoisinite': { id: 'blastoisinite', name: 'Blastoisinite' },
  'cameruptite': { id: 'cameruptite', name: 'Cameruptite' },
  'chandelurite': { id: 'chandelurite', name: 'Chandelurite' },
  'charizarditex': { id: 'charizarditex', name: 'Charizardite X' },
  'charizarditey': { id: 'charizarditey', name: 'Charizardite Y' },
  'chesnaughtite': { id: 'chesnaughtite', name: 'Chesnaughtite' },
  'chimechite': { id: 'chimechite', name: 'Chimechite' },
  'clefablite': { id: 'clefablite', name: 'Clefablite' },
  'crabominite': { id: 'crabominite', name: 'Crabominite' },
  'delphoxite': { id: 'delphoxite', name: 'Delphoxite' },
  'dragoninite': { id: 'dragoninite', name: 'Dragoninite' },
  'drampanite': { id: 'drampanite', name: 'Drampanite' },
  'emboarite': { id: 'emboarite', name: 'Emboarite' },
  'excadrite': { id: 'excadrite', name: 'Excadrite' },
  'feraligite': { id: 'feraligite', name: 'Feraligite' },
  'floettite': { id: 'floettite', name: 'Floettite' },
  'froslassite': { id: 'froslassite', name: 'Froslassite' },
  'galladite': { id: 'galladite', name: 'Galladite' },
  'garchompite': { id: 'garchompite', name: 'Garchompite' },
  'gardevoirite': { id: 'gardevoirite', name: 'Gardevoirite' },
  'gengarite': { id: 'gengarite', name: 'Gengarite' },
  'glalitite': { id: 'glalitite', name: 'Glalitite' },
  'glimmoranite': { id: 'glimmoranite', name: 'Glimmoranite' },
  'golurkite': { id: 'golurkite', name: 'Golurkite' },
  'greninjite': { id: 'greninjite', name: 'Greninjite' },
  'gyaradosite': { id: 'gyaradosite', name: 'Gyaradosite' },
  'hawluchanite': { id: 'hawluchanite', name: 'Hawluchanite' },
  'heracronite': { id: 'heracronite', name: 'Heracronite' },
  'houndoominite': { id: 'houndoominite', name: 'Houndoominite' },
  'kangaskhanite': { id: 'kangaskhanite', name: 'Kangaskhanite' },
  'lopunnite': { id: 'lopunnite', name: 'Lopunnite' },
  'lucarionite': { id: 'lucarionite', name: 'Lucarionite' },
  'manectite': { id: 'manectite', name: 'Manectite' },
  'medichamite': { id: 'medichamite', name: 'Medichamite' },
  'meganiumite': { id: 'meganiumite', name: 'Meganiumite' },
  'meowsticite': { id: 'meowsticite', name: 'Meowsticite' },
  'pidgeotite': { id: 'pidgeotite', name: 'Pidgeotite' },
  'pinsirite': { id: 'pinsirite', name: 'Pinsirite' },
  'sablenite': { id: 'sablenite', name: 'Sablenite' },
  'scizorite': { id: 'scizorite', name: 'Scizorite' },
  'scovillainite': { id: 'scovillainite', name: 'Scovillainite' },
  'sharpedonite': { id: 'sharpedonite', name: 'Sharpedonite' },
  'skarmorite': { id: 'skarmorite', name: 'Skarmorite' },
  'slowbronite': { id: 'slowbronite', name: 'Slowbronite' },
  'starminite': { id: 'starminite', name: 'Starminite' },
  'steelixite': { id: 'steelixite', name: 'Steelixite' },
  'tyranitarite': { id: 'tyranitarite', name: 'Tyranitarite' },
  'venusaurite': { id: 'venusaurite', name: 'Venusaurite' },
  'victreebelite': { id: 'victreebelite', name: 'Victreebelite' }

};