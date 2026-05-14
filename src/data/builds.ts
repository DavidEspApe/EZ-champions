// src/data/builds.ts

export interface VGCBuild {
  id: string;
  name: string;
  speciesId: string;
  itemId: string;
  abilityId: string;
  defaultEvs: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
  defaultNature: { atk: number; def: number; spa: number; spd: number; spe: number };
  moves: string[];
}

export const VGC_BUILDS: VGCBuild[] = [
  {
    id: 'aerodactyl_sash', name: 'Aerodactyl - Focus Sash', speciesId: 'aerodactyl', itemId: 'Focus Sash', abilityId: 'Unnerve',
    defaultEvs: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
    defaultNature: { atk: 1.0, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.1 },
    moves: ['rockslide', 'dualwingbeat', 'tailwind', 'taunt']
  },
  {
    id: 'aegislash_leftovers', name: 'Aegislash - Leftovers', speciesId: 'aegislash', itemId: 'Leftovers', abilityId: 'Stance Change',
    defaultEvs: { hp: 32, atk: 0, def: 0, spa: 32, spd: 2, spe: 0 },
    defaultNature: { atk: 1.0, def: 1.0, spa: 1.1, spd: 1.0, spe: 0.9 },
    moves: ['shadowball', 'flashcannon', 'wideguard', 'kingsshield']
  },
  {
    id: 'aegislash_spelltag', name: 'Aegislash - Spell Tag', speciesId: 'aegislash', itemId: 'Spell Tag', abilityId: 'Stance Change',
    defaultEvs: { hp: 32, atk: 32, def: 0, spa: 0, spd: 2, spe: 0 },
    defaultNature: { atk: 1.1, def: 1.0, spa: 0.9, spd: 1.0, spe: 0.9 }, 
    moves: ['poltergeist', 'shadowsneak', 'ironhead', 'sacredsword']
  },
  {
    id: 'arcaninehisui_scarf', name: 'Arcanine-Hisui - Choice Scarf', speciesId: 'arcaninehisui', itemId: 'Choice Scarf', abilityId: 'Intimidate',
    defaultEvs: { hp: 1, atk: 32, def: 0, spa: 0, spd: 1, spe: 32 },
    defaultNature: { atk: 1.1, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.0 }, 
    moves: ['flareblitz', 'rockslide', 'extremespeed', 'headsmash']
  },
  {
    id: 'archaludon_leftovers', name: 'Archaludon - Leftovers', speciesId: 'archaludon', itemId: 'Leftovers', abilityId: 'Stamina',
    defaultEvs: { hp: 32, atk: 0, def: 0, spa: 32, spd: 2, spe: 0 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 }, 
    moves: ['electroshot', 'flashcannon', 'dracometeor', 'dragonpulse']
  },
  {
    id: 'archaludon_sitrus', name: 'Archaludon - Sitrus Berry', speciesId: 'archaludon', itemId: 'Sitrus Berry', abilityId: 'Stamina',
    defaultEvs: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
    moves: ['electroshot', 'flashcannon', 'dracometeor', 'aurasphere']
  },
  {
    id: 'basculegion_scarf', name: 'Basculegion - Choice Scarf', speciesId: 'basculegion', itemId: 'Choice Scarf', abilityId: 'Adaptability',
    defaultEvs: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
    defaultNature: { atk: 1.1, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.0 },
    moves: ['lastrespects', 'wavecrash', 'flipturn', 'aquajet']
  },
  {
    id: 'basculegion_water', name: 'Basculegion - Mystic Water', speciesId: 'basculegion', itemId: 'Mystic Water', abilityId: 'Swift Swim',
    defaultEvs: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
    defaultNature: { atk: 1.1, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.0 },
    moves: ['lastrespects', 'wavecrash', 'flipturn', 'aquajet']
  },
  {
    id: 'blastoisemega_off', name: 'Mega Blastoise - Offensive', speciesId: 'blastoisemega', itemId: 'blastoisinite', abilityId: 'Mega Launcher',
    defaultEvs: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
    moves: ['waterspout', 'aurasphere', 'darkpulse', 'icebeam']
  },
  {
    id: 'charizardmegay_off', name: 'Mega Charizard Y - Offensive', speciesId: 'charizardmegay', itemId: 'charizarditey', abilityId: 'Drought',
    defaultEvs: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
    moves: ['heatwave', 'weatherball', 'solarbeam', 'airslash']
  },
  {
    id: 'charizardmegax_dd', name: 'Mega Charizard X - Dragon Dance', speciesId: 'charizardmegax', itemId: 'charizarditex', abilityId: 'Tough Claws',
    defaultEvs: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
    defaultNature: { atk: 1.1, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.0 },
    moves: ['flareblitz', 'dragonclaw', 'thunderpunch', 'dragondance']
  },
  {
    id: 'clefable_sitrus', name: 'Clefable - Sitrus Berry', speciesId: 'clefable', itemId: 'Sitrus Berry', abilityId: 'Unaware',
    defaultEvs: { hp: 32, atk: 0, def: 32, spa: 0, spd: 2, spe: 0 },
    defaultNature: { atk: 0.9, def: 1.1, spa: 1.0, spd: 1.0, spe: 1.0 },
    moves: ['moonblast', 'icywind', 'followme', 'helpinghand']
  },
  {
    id: 'corviknight_leftovers', name: 'Corviknight - Leftovers', speciesId: 'corviknight', itemId: 'Leftovers', abilityId: 'Mirror Armor',
    defaultEvs: { hp: 32, atk: 0, def: 32, spa: 0, spd: 2, spe: 0 },
    defaultNature: { atk: 1.0, def: 1.1, spa: 0.9, spd: 1.0, spe: 1.0 }, 
    moves: ['bravebird', 'bodypress', 'roost', 'tailwind']
  },
  {
    id: 'corviknight_sitrus', name: 'Corviknight - Sitrus Berry', speciesId: 'corviknight', itemId: 'Sitrus Berry', abilityId: 'Mirror Armor',
    defaultEvs: { hp: 20, atk: 24, def: 3, spa: 0, spd: 1, spe: 18 },
    defaultNature: { atk: 1.1, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.0 },
    moves: ['bravebird', 'bodypress', 'ironhead', 'bulkup']
  },
  {
    id: 'delphoxmega_off', name: 'Mega Delphox - Offensive', speciesId: 'delphoxmega', itemId: 'delphoxite', abilityId: 'Magic Guard',
    defaultEvs: { hp: 1, atk: 0, def: 1, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.1 },
    moves: ['heatwave', 'psychic', 'psyshock', 'dazzlinggleam']
  },
  {
    id: 'dragapult_sash', name: 'Dragapult - Focus Sash', speciesId: 'dragapult', itemId: 'Focus Sash', abilityId: 'Clear Body',
    defaultEvs: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
    defaultNature: { atk: 1.0, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.1 },
    moves: ['dragondarts', 'phantomforce', 'psychicfangs', 'willowisp']
  },
  {
    id: 'dragonitemega_off', name: 'Mega Dragonite - Offensive', speciesId: 'dragonitemega', itemId: 'dragoninite', abilityId: 'Multiscale',
    defaultEvs: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
    moves: ['dracometeor', 'hurricane', 'extremespeed', 'thunder']
  },
  {
    id: 'excadrill_sash', name: 'Excadrill - Focus Sash', speciesId: 'excadrill', itemId: 'Focus Sash', abilityId: 'Sand Rush',
    defaultEvs: { hp: 0, atk: 32, def: 2, spa: 0, spd: 0, spe: 32 },
    defaultNature: { atk: 1.1, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.0 },
    moves: ['highhorsepower', 'ironhead', 'rockslide', 'earthquake']
  },
  {
    id: 'excadrillmega_off', name: 'Mega Excadrill - Offensive', speciesId: 'excadrillmega', itemId: 'excadrite', abilityId: 'Sand Rush',
    defaultEvs: { hp: 0, atk: 32, def: 2, spa: 0, spd: 0, spe: 32 },
    defaultNature: { atk: 1.0, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.1 }, 
    moves: ['highhorsepower', 'ironhead', 'rockslide', 'earthquake']
  },
  {
    id: 'floettemega_off', name: 'Mega Floette - Offensive', speciesId: 'floettemega', itemId: 'floettite', abilityId: 'Flower Veil',
    defaultEvs: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.1 },
    moves: ['moonblast', 'dazzlinggleam', 'lightofruin', 'protect']
  },
  {
    id: 'floettemega_cm', name: 'Mega Floette - Calm Mind', speciesId: 'floettemega', itemId: 'floettite', abilityId: 'Flower Veil',
    defaultEvs: { hp: 26, atk: 0, def: 2, spa: 25, spd: 0, spe: 13 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
    moves: ['moonblast', 'dazzlinggleam', 'drainingkiss', 'calmmind']
  },
  {
    id: 'farigiraf_sitrus', name: 'Farigiraf - Sitrus Berry', speciesId: 'farigiraf', itemId: 'Sitrus Berry', abilityId: 'Armor Tail',
    defaultEvs: { hp: 32, atk: 0, def: 2, spa: 32, spd: 0, spe: 0 },
    defaultNature: { atk: 1.0, def: 1.0, spa: 1.1, spd: 1.0, spe: 0.9 },
    moves: ['psychic', 'hypervoice', 'dazzlinggleam', 'trickroom']
  },
  {
    id: 'froslassmega_veil', name: 'Mega Froslass - Aurora Veil', speciesId: 'froslassmega', itemId: 'froslassite', abilityId: 'Magic Guard',
    defaultEvs: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.1 },
    moves: ['blizzard', 'shadowball', 'thunderbolt', 'auroraveil']
  },
  {
    id: 'maushold_chople', name: 'Maushold - Chople Berry', speciesId: 'maushold', itemId: 'Chople Berry', abilityId: 'Friend Guard',
    defaultEvs: { hp: 32, atk: 0, def: 2, spa: 0, spd: 0, spe: 32 },
    defaultNature: { atk: 1.0, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.1 },
    moves: ['superfang', 'feint', 'followme', 'taunt']
  },
  {
    id: 'garchomp_scarf', name: 'Garchomp - Choice Scarf', speciesId: 'garchomp', itemId: 'Choice Scarf', abilityId: 'Rough Skin',
    defaultEvs: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
    defaultNature: { atk: 1.1, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.0 },
    moves: ['earthquake', 'dragonclaw', 'rockslide', 'stompingtantrum']
  },
  {
    id: 'garchomp_lum', name: 'Garchomp - Lum Berry', speciesId: 'garchomp', itemId: 'Lum Berry', abilityId: 'Rough Skin',
    defaultEvs: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
    defaultNature: { atk: 1.0, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.1 },
    moves: ['earthquake', 'dragonclaw', 'rockslide', 'stompingtantrum']
  },
  {
    id: 'gardevoirmega_tr', name: 'Mega Gardevoir - Trick Room', speciesId: 'gardevoirmega', itemId: 'gardevoirite', abilityId: 'Pixilate',
    defaultEvs: { hp: 32, atk: 0, def: 2, spa: 32, spd: 0, spe: 0 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
    moves: ['hypervoice', 'psyshock', 'psychic', 'trickroom']
  },
  {
    id: 'gardevoir_scarf', name: 'Gardevoir - Choice Scarf', speciesId: 'gardevoir', itemId: 'Choice Scarf', abilityId: 'Trace',
    defaultEvs: { hp: 0, atk: 0, def: 2, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.1 },
    moves: ['moonblast', 'psyshock', 'dazzlinggleam', 'icywind']
  },
  {
    id: 'gengarmega_off', name: 'Mega Gengar - Offensive', speciesId: 'gengarmega', itemId: 'gengarite', abilityId: 'Shadow Tag',
    defaultEvs: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.1 },
    moves: ['shadowball', 'sludgebomb', 'icywind', 'protect']
  },
  {
    id: 'gengarmega_perish', name: 'Mega Gengar - Perish Song', speciesId: 'gengarmega', itemId: 'gengarite', abilityId: 'Shadow Tag',
    defaultEvs: { hp: 32, atk: 0, def: 9, spa: 1, spd: 1, spe: 23 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.1 },
    moves: ['shadowball', 'sludgebomb', 'perishsong', 'disable']
  },
  {
    id: 'gengar_sash', name: 'Gengar - Focus Sash', speciesId: 'gengar', itemId: 'Focus Sash', abilityId: 'Cursed Body',
    defaultEvs: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.1 },
    moves: ['shadowball', 'sludgebomb', 'icywind', 'protect']
  },
  {
    id: 'glimmoramega_off', name: 'Mega Glimmora - Offensive', speciesId: 'glimmoramega', itemId: 'glimmoranite', abilityId: 'Toxic Debris',
    defaultEvs: { hp: 1, atk: 0, def: 0, spa: 32, spd: 1, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.1 },
    moves: ['powergem', 'sludgebomb', 'sludgewave', 'earthpower']
  },
  {
    id: 'gyaradosmega_dd', name: 'Mega Gyarados - Dragon Dance', speciesId: 'gyaradosmega', itemId: 'gyaradosite', abilityId: 'Mold Breaker',
    defaultEvs: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
    defaultNature: { atk: 1.0, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.1 },
    moves: ['waterfall', 'crunch', 'earthquake', 'dragondance']
  },
  {
    id: 'gyarados_sitrus', name: 'Gyarados - Sitrus Berry', speciesId: 'gyarados', itemId: 'Sitrus Berry', abilityId: 'Intimidate',
    defaultEvs: { hp: 32, atk: 32, def: 2, spa: 0, spd: 0, spe: 0 },
    defaultNature: { atk: 1.1, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.0 },
    moves: ['waterfall', 'icefang', 'taunt', 'thunderwave']
  },
  {
    id: 'hydreigon_scarf', name: 'Hydreigon - Choice Scarf', speciesId: 'hydreigon', itemId: 'Choice Scarf', abilityId: 'Levitate',
    defaultEvs: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
    moves: ['darkpulse', 'dracometeor', 'earthpower', 'flamethrower']
  },
  {
    id: 'rotomheat_scarf', name: 'Rotom-Heat - Choice Scarf', speciesId: 'rotomheat', itemId: 'Choice Scarf', abilityId: 'Levitate',
    defaultEvs: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
    moves: ['overheat', 'electroweb', 'voltswitch', 'trick']
  },
  {
    id: 'rotomheat_sitrus', name: 'Rotom-Heat - Sitrus Berry', speciesId: 'rotomheat', itemId: 'Sitrus Berry', abilityId: 'Levitate',
    defaultEvs: { hp: 32, atk: 0, def: 0, spa: 32, spd: 0, spe: 2 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
    moves: ['overheat', 'thunderbolt', 'voltswitch', 'willowisp']
  },
  {
    id: 'typhlosionhisui_scarf', name: 'Typhlosion-Hisui - Choice Scarf', speciesId: 'typhlosionhisui', itemId: 'Choice Scarf', abilityId: 'Frisk',
    defaultEvs: { hp: 1, atk: 0, def: 1, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
    moves: ['eruption', 'shadowball', 'heatwave', 'overheat']
  },
  {
    id: 'zoroarkhisui_sash', name: 'Zoroark-Hisui - Focus Sash', speciesId: 'zoroarkhisui', itemId: 'Focus Sash', abilityId: 'Illusion',
    defaultEvs: { hp: 1, atk: 0, def: 1, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.1 },
    moves: ['hypervoice', 'bittermalice', 'icywind', 'psychic']
  },
  {
    id: 'ninetalesalola_ice', name: 'Ninetales-Alola - Never-Melt Ice', speciesId: 'ninetalesalola', itemId: 'Never-Melt Ice', abilityId: 'Snow Warning',
    defaultEvs: { hp: 1, atk: 0, def: 1, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.1 },
    moves: ['blizzard', 'freezedry', 'icywind', 'moonblast']
  },
  {
    id: 'ninetalesalola_sash', name: 'Ninetales-Alola - Focus Sash', speciesId: 'ninetalesalola', itemId: 'Focus Sash', abilityId: 'Snow Warning',
    defaultEvs: { hp: 1, atk: 0, def: 1, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.1 },
    moves: ['blizzard', 'icywind', 'auroraveil', 'encore']
  },
  {
    id: 'incineroar_sitrus', name: 'Incineroar - Sitrus Berry', speciesId: 'incineroar', itemId: 'Sitrus Berry', abilityId: 'Intimidate',
    defaultEvs: { hp: 32, atk: 0, def: 14, spa: 0, spd: 20, spe: 0 },
    defaultNature: { atk: 1.0, def: 1.0, spa: 0.9, spd: 1.1, spe: 1.0 },
    moves: ['flareblitz', 'darkestlariat', 'fakeout', 'partingshot']
  },
  {
    id: 'kangaskhanmega_jolly', name: 'Mega Kangaskhan - Jolly', speciesId: 'kangaskhanmega', itemId: 'kangaskhanite', abilityId: 'Parental Bond',
    defaultEvs: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
    defaultNature: { atk: 1.0, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.1 },
    moves: ['fakeout', 'doubleedge', 'suckerpunch', 'drainpunch']
  },
  {
    id: 'kangaskhanmega_adamant', name: 'Mega Kangaskhan - Adamant', speciesId: 'kangaskhanmega', itemId: 'kangaskhanite', abilityId: 'Parental Bond',
    defaultEvs: { hp: 32, atk: 32, def: 0, spa: 0, spd: 0, spe: 2 },
    defaultNature: { atk: 1.1, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.0 },
    moves: ['fakeout', 'doubleedge', 'suckerpunch', 'drainpunch']
  },
  {
    id: 'kingambit_glasses', name: 'Kingambit - Black Glasses', speciesId: 'kingambit', itemId: 'Black Glasses', abilityId: 'Defiant',
    defaultEvs: { hp: 32, atk: 32, def: 0, spa: 0, spd: 2, spe: 0 },
    defaultNature: { atk: 1.1, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.0 },
    moves: ['kowtowcleave', 'ironhead', 'suckerpunch', 'lowkick']
  },
  {
    id: 'kommoo_off', name: 'Kommo-o - Leftovers Off', speciesId: 'kommoo', itemId: 'Leftovers', abilityId: 'Soundproof',
    defaultEvs: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
    moves: ['clangingscales', 'aurasphere', 'vacuumwave', 'clangoroussoul']
  },
  {
    id: 'kommoo_def', name: 'Kommo-o - Leftovers Def', speciesId: 'kommoo', itemId: 'Leftovers', abilityId: 'Soundproof',
    defaultEvs: { hp: 32, atk: 0, def: 32, spa: 0, spd: 0, spe: 2 },
    defaultNature: { atk: 0.9, def: 1.1, spa: 1.0, spd: 1.0, spe: 1.0 },
    moves: ['bodypress', 'flamethrower', 'dracometeor', 'irondefense']
  },
  {
    id: 'meganiummega_off', name: 'Mega Meganium - Offensive', speciesId: 'meganiummega', itemId: 'meganiumite', abilityId: 'Mega Sol',
    defaultEvs: { hp: 32, atk: 0, def: 0, spa: 32, spd: 0, spe: 2 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
    moves: ['solarbeam', 'dazzlinggleam', 'weatherball', 'earthpower']
  },
  {
    id: 'milotic_leftovers', name: 'Milotic - Leftovers', speciesId: 'milotic', itemId: 'Leftovers', abilityId: 'Competitive',
    defaultEvs: { hp: 32, atk: 0, def: 32, spa: 0, spd: 2, spe: 0 },
    defaultNature: { atk: 0.9, def: 1.1, spa: 1.0, spd: 1.0, spe: 1.0 },
    moves: ['scald', 'icywind', 'icebeam', 'recover']
  },
  {
    id: 'palafinhero_water', name: 'Palafin-Hero - Mystic Water', speciesId: 'palafinhero', itemId: 'Mystic Water', abilityId: 'Zero to Hero',
    defaultEvs: { hp: 32, atk: 32, def: 0, spa: 0, spd: 0, spe: 2 },
    defaultNature: { atk: 1.1, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.0 },
    moves: ['wavecrash', 'jetpunch', 'flipturn', 'closecombat']
  },
  {
    id: 'pelipper_sash', name: 'Pelipper - Focus Sash', speciesId: 'pelipper', itemId: 'Focus Sash', abilityId: 'Drizzle',
    defaultEvs: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
    moves: ['weatherball', 'hurricane', 'muddywater', 'tailwind']
  },
  {
    id: 'pelipper_scarf', name: 'Pelipper - Choice Scarf', speciesId: 'pelipper', itemId: 'Choice Scarf', abilityId: 'Drizzle',
    defaultEvs: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.1 },
    moves: ['weatherball', 'hurricane', 'icywind', 'muddywater']
  },
  {
    id: 'politoed_scarf', name: 'Politoed - Choice Scarf', speciesId: 'politoed', itemId: 'Choice Scarf', abilityId: 'Drizzle',
    defaultEvs: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.1 },
    moves: ['weatherball', 'icywind', 'muddywater', 'icebeam']
  },
  {
    id: 'politoed_leftovers', name: 'Politoed - Leftovers', speciesId: 'politoed', itemId: 'Leftovers', abilityId: 'Drizzle',
    defaultEvs: { hp: 32, atk: 0, def: 32, spa: 0, spd: 2, spe: 0 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.0, spd: 1.1, spe: 1.0 },
    moves: ['weatherball', 'icywind', 'helpinghand', 'perishsong']
  },
  {
    id: 'primarina_water', name: 'Primarina - Mystic Water', speciesId: 'primarina', itemId: 'Mystic Water', abilityId: 'Liquid Voice',
    defaultEvs: { hp: 32, atk: 0, def: 0, spa: 32, spd: 0, spe: 2 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
    moves: ['hypervoice', 'moonblast', 'dazzlinggleam', 'icebeam']
  },
  {
    id: 'rotomwash_sitrus', name: 'Rotom-Wash - Sitrus Berry', speciesId: 'rotomwash', itemId: 'Sitrus Berry', abilityId: 'Levitate',
    defaultEvs: { hp: 32, atk: 0, def: 0, spa: 32, spd: 0, spe: 2 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
    moves: ['hydropump', 'thunderbolt', 'voltswitch', 'willowisp']
  },
  {
    id: 'rotomwash_scarf', name: 'Rotom-Wash - Choice Scarf', speciesId: 'rotomwash', itemId: 'Choice Scarf', abilityId: 'Levitate',
    defaultEvs: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
    moves: ['hydropump', 'electroweb', 'voltswitch', 'trick']
  },
  {
    id: 'sableye_roseli', name: 'Sableye - Roseli Berry', speciesId: 'sableye', itemId: 'Roseli Berry', abilityId: 'Prankster',
    defaultEvs: { hp: 32, atk: 0, def: 2, spa: 0, spd: 32, spe: 0 },
    defaultNature: { atk: 1.0, def: 1.0, spa: 0.9, spd: 1.1, spe: 1.0 },
    moves: ['foulplay', 'fakeout', 'encore', 'willowisp']
  },
  {
    id: 'scizormega_off', name: 'Mega Scizor - Offensive', speciesId: 'scizormega', itemId: 'scizorite', abilityId: 'Technician',
    defaultEvs: { hp: 32, atk: 32, def: 0, spa: 0, spd: 2, spe: 0 },
    defaultNature: { atk: 1.1, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.0 },
    moves: ['bulletpunch', 'bugbite', 'closecombat', 'swordsdance']
  },
  {
    id: 'sinistcha_sitrus', name: 'Sinistcha - Sitrus Berry', speciesId: 'sinistcha', itemId: 'Sitrus Berry', abilityId: 'Hospitality',
    defaultEvs: { hp: 32, atk: 0, def: 14, spa: 0, spd: 20, spe: 0 },
    defaultNature: { atk: 0.9, def: 1.1, spa: 1.0, spd: 1.0, spe: 1.0 }, 
    moves: ['matchagotcha', 'shadowball', 'ragepowder', 'trickroom']
  },
  {
    id: 'sneasler_herb', name: 'Sneasler - White Herb', speciesId: 'sneasler', itemId: 'White Herb', abilityId: 'Unburden',
    defaultEvs: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
    defaultNature: { atk: 1.0, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.1 },
    moves: ['closecombat', 'direclaw', 'fakeout', 'rockslide']
  },
  {
    id: 'starmiemega_off', name: 'Mega Starmie - Offensive', speciesId: 'starmiemega', itemId: 'starminite', abilityId: 'Protean',
    defaultEvs: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
    defaultNature: { atk: 1.0, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.1 },
    moves: ['liquidation', 'zenheadbutt', 'icespinner', 'aquajet']
  },
  {
    id: 'sylveon_fairy', name: 'Sylveon - Fairy Feather', speciesId: 'sylveon', itemId: 'Fairy Feather', abilityId: 'Pixilate',
    defaultEvs: { hp: 32, atk: 0, def: 0, spa: 32, spd: 0, spe: 2 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
    moves: ['hypervoice', 'hyperbeam', 'quickattack', 'mysticalfire']
  },
  {
    id: 'talonflame_beak', name: 'Talonflame - Sharp Beak', speciesId: 'talonflame', itemId: 'Sharp Beak', abilityId: 'Gale Wings',
    defaultEvs: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
    defaultNature: { atk: 1.0, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.1 },
    moves: ['flareblitz', 'bravebird', 'dualwingbeat', 'tailwind']
  },
  {
    id: 'torkoal_charcoal', name: 'Torkoal - Charcoal', speciesId: 'torkoal', itemId: 'Charcoal', abilityId: 'Drought',
    defaultEvs: { hp: 32, atk: 0, def: 0, spa: 32, spd: 2, spe: 0 },
    defaultNature: { atk: 1.0, def: 1.0, spa: 1.1, spd: 1.0, spe: 0.9 }, 
    moves: ['eruption', 'heatwave', 'weatherball', 'earthpower']
  },
  {
    id: 'tyranitar_scarf', name: 'Tyranitar - Choice Scarf', speciesId: 'tyranitar', itemId: 'Choice Scarf', abilityId: 'Sand Stream',
    defaultEvs: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
    defaultNature: { atk: 1.0, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.1 },
    moves: ['rockslide', 'knockoff', 'icepunch', 'lowkick']
  },
  {
    id: 'tyranitarmega_adamant', name: 'Mega Tyranitar - Adamant', speciesId: 'tyranitarmega', itemId: 'tyranitarite', abilityId: 'Sand Stream',
    defaultEvs: { hp: 32, atk: 32, def: 0, spa: 0, spd: 2, spe: 0 },
    defaultNature: { atk: 1.1, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.0 },
    moves: ['rockslide', 'knockoff', 'highhorsepower', 'lowkick']
  },
  {
    id: 'tyranitarmega_dd', name: 'Mega Tyranitar - Dragon Dance', speciesId: 'tyranitarmega', itemId: 'tyranitarite', abilityId: 'Sand Stream',
    defaultEvs: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
    defaultNature: { atk: 1.0, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.1 },
    moves: ['rockslide', 'knockoff', 'dragondance', 'protect']
  },
  {
    id: 'venusaur_sash', name: 'Venusaur - Focus Sash', speciesId: 'venusaur', itemId: 'Focus Sash', abilityId: 'Chlorophyll',
    defaultEvs: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
    moves: ['leafstorm', 'sludgebomb', 'earthpower', 'sleeppowder']
  },
  {
    id: 'venusaurmega_off', name: 'Mega Venusaur - Offensive', speciesId: 'venusaurmega', itemId: 'venusaurite', abilityId: 'Thick Fat',
    defaultEvs: { hp: 32, atk: 0, def: 0, spa: 32, spd: 0, spe: 2 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
    moves: ['energyball', 'sludgebomb', 'earthpower', 'leafstorm']
  },
  {
    id: 'whimsicott_sash', name: 'Whimsicott - Focus Sash', speciesId: 'whimsicott', itemId: 'Focus Sash', abilityId: 'Prankster',
    defaultEvs: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.1 },
    moves: ['moonblast', 'tailwind', 'encore', 'protect']
  }
];

// Aquí guardamos la lista masiva que creamos para el SpeedMode
export const SPEED_THREATS = [
  // Sneasler
  { id: 'sneasler_fastest', name: 'Sneasler - fastest', speciesId: 'sneasler', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'sneasler_maxevs', name: 'Sneasler - maxEVs', speciesId: 'sneasler', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'sneasler_base', name: 'Sneasler - Base', speciesId: 'sneasler', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'sneasler_slowest', name: 'Sneasler - slowest', speciesId: 'sneasler', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Garchomp
  { id: 'garchomp_fastest', name: 'Garchomp - fastest', speciesId: 'garchomp', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'garchomp_maxevs', name: 'Garchomp - maxEVs', speciesId: 'garchomp', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'garchomp_base', name: 'Garchomp - Base', speciesId: 'garchomp', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'garchomp_slowest', name: 'Garchomp - slowest', speciesId: 'garchomp', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Kingambit
  { id: 'kingambit_fastest', name: 'Kingambit - fastest', speciesId: 'kingambit', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'kingambit_maxevs', name: 'Kingambit - maxEVs', speciesId: 'kingambit', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'kingambit_base', name: 'Kingambit - Base', speciesId: 'kingambit', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'kingambit_slowest', name: 'Kingambit - slowest', speciesId: 'kingambit', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Basculegion
  { id: 'basculegion_fastest', name: 'Basculegion - fastest', speciesId: 'basculegion', itemId: 'None', abilityId: 'Swift Swim', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'basculegion_maxevs', name: 'Basculegion - maxEVs', speciesId: 'basculegion', itemId: 'None', abilityId: 'Swift Swim', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'basculegion_base', name: 'Basculegion - Base', speciesId: 'basculegion', itemId: 'None', abilityId: 'Swift Swim', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'basculegion_slowest', name: 'Basculegion - slowest', speciesId: 'basculegion', itemId: 'None', abilityId: 'Swift Swim', defaultEvs: 0, defaultNature: 0.9 },

  // Incineroar
  { id: 'incineroar_fastest', name: 'Incineroar - fastest', speciesId: 'incineroar', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'incineroar_maxevs', name: 'Incineroar - maxEVs', speciesId: 'incineroar', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'incineroar_base', name: 'Incineroar - Base', speciesId: 'incineroar', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'incineroar_slowest', name: 'Incineroar - slowest', speciesId: 'incineroar', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Sinistcha
  { id: 'sinistcha_fastest', name: 'Sinistcha - fastest', speciesId: 'sinistcha', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'sinistcha_maxevs', name: 'Sinistcha - maxEVs', speciesId: 'sinistcha', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'sinistcha_base', name: 'Sinistcha - Base', speciesId: 'sinistcha', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'sinistcha_slowest', name: 'Sinistcha - slowest', speciesId: 'sinistcha', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Mega Floette
  { id: 'floettemega_fastest', name: 'Mega Floette - fastest', speciesId: 'floettemega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'floettemega_maxevs', name: 'Mega Floette - maxEVs', speciesId: 'floettemega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'floettemega_base', name: 'Mega Floette - Base', speciesId: 'floettemega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'floettemega_slowest', name: 'Mega Floette - slowest', speciesId: 'floettemega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Mega Charizard Y
  { id: 'charizardmegay_fastest', name: 'Mega Charizard Y - fastest', speciesId: 'charizardmegay', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'charizardmegay_maxevs', name: 'Mega Charizard Y - maxEVs', speciesId: 'charizardmegay', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'charizardmegay_base', name: 'Mega Charizard Y - Base', speciesId: 'charizardmegay', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'charizardmegay_slowest', name: 'Mega Charizard Y - slowest', speciesId: 'charizardmegay', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Pelipper
  { id: 'pelipper_fastest', name: 'Pelipper - fastest', speciesId: 'pelipper', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'pelipper_maxevs', name: 'Pelipper - maxEVs', speciesId: 'pelipper', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'pelipper_base', name: 'Pelipper - Base', speciesId: 'pelipper', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'pelipper_slowest', name: 'Pelipper - slowest', speciesId: 'pelipper', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Aerodactyl
  { id: 'aerodactyl_fastest', name: 'Aerodactyl - fastest', speciesId: 'aerodactyl', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'aerodactyl_maxevs', name: 'Aerodactyl - maxEVs', speciesId: 'aerodactyl', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'aerodactyl_base', name: 'Aerodactyl - Base', speciesId: 'aerodactyl', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'aerodactyl_slowest', name: 'Aerodactyl - slowest', speciesId: 'aerodactyl', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Archaludon
  { id: 'archaludon_fastest', name: 'Archaludon - fastest', speciesId: 'archaludon', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'archaludon_maxevs', name: 'Archaludon - maxEVs', speciesId: 'archaludon', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'archaludon_base', name: 'Archaludon - Base', speciesId: 'archaludon', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'archaludon_slowest', name: 'Archaludon - slowest', speciesId: 'archaludon', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Rotom-Wash
  { id: 'rotomwash_fastest', name: 'Rotom-Wash - fastest', speciesId: 'rotomwash', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'rotomwash_maxevs', name: 'Rotom-Wash - maxEVs', speciesId: 'rotomwash', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'rotomwash_base', name: 'Rotom-Wash - Base', speciesId: 'rotomwash', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'rotomwash_slowest', name: 'Rotom-Wash - slowest', speciesId: 'rotomwash', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Farigiraf
  { id: 'farigiraf_fastest', name: 'Farigiraf - fastest', speciesId: 'farigiraf', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'farigiraf_maxevs', name: 'Farigiraf - maxEVs', speciesId: 'farigiraf', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'farigiraf_base', name: 'Farigiraf - Base', speciesId: 'farigiraf', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'farigiraf_slowest', name: 'Farigiraf - slowest', speciesId: 'farigiraf', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Milotic
  { id: 'milotic_fastest', name: 'Milotic - fastest', speciesId: 'milotic', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'milotic_maxevs', name: 'Milotic - maxEVs', speciesId: 'milotic', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'milotic_base', name: 'Milotic - Base', speciesId: 'milotic', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'milotic_slowest', name: 'Milotic - slowest', speciesId: 'milotic', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Whimsicott
  { id: 'whimsicott_fastest', name: 'Whimsicott - fastest', speciesId: 'whimsicott', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'whimsicott_maxevs', name: 'Whimsicott - maxEVs', speciesId: 'whimsicott', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'whimsicott_base', name: 'Whimsicott - Base', speciesId: 'whimsicott', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'whimsicott_slowest', name: 'Whimsicott - slowest', speciesId: 'whimsicott', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Mega Froslass
  { id: 'froslassmega_fastest', name: 'Mega Froslass - fastest', speciesId: 'froslassmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'froslassmega_maxevs', name: 'Mega Froslass - maxEVs', speciesId: 'froslassmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'froslassmega_base', name: 'Mega Froslass - Base', speciesId: 'froslassmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'froslassmega_slowest', name: 'Mega Froslass - slowest', speciesId: 'froslassmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Aegislash
  { id: 'aegislash_fastest', name: 'Aegislash - fastest', speciesId: 'aegislash', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'aegislash_maxevs', name: 'Aegislash - maxEVs', speciesId: 'aegislash', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'aegislash_base', name: 'Aegislash - Base', speciesId: 'aegislash', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'aegislash_slowest', name: 'Aegislash - slowest', speciesId: 'aegislash', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Sylveon
  { id: 'sylveon_fastest', name: 'Sylveon - fastest', speciesId: 'sylveon', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'sylveon_maxevs', name: 'Sylveon - maxEVs', speciesId: 'sylveon', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'sylveon_base', name: 'Sylveon - Base', speciesId: 'sylveon', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'sylveon_slowest', name: 'Sylveon - slowest', speciesId: 'sylveon', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Mega Aerodactyl
  { id: 'aerodactylmega_fastest', name: 'Mega Aerodactyl - fastest', speciesId: 'aerodactylmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'aerodactylmega_maxevs', name: 'Mega Aerodactyl - maxEVs', speciesId: 'aerodactylmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'aerodactylmega_base', name: 'Mega Aerodactyl - Base', speciesId: 'aerodactylmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'aerodactylmega_slowest', name: 'Mega Aerodactyl - slowest', speciesId: 'aerodactylmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Talonflame
  { id: 'talonflame_fastest', name: 'Talonflame - fastest', speciesId: 'talonflame', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'talonflame_maxevs', name: 'Talonflame - maxEVs', speciesId: 'talonflame', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'talonflame_base', name: 'Talonflame - Base', speciesId: 'talonflame', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'talonflame_slowest', name: 'Talonflame - slowest', speciesId: 'talonflame', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Mega Tyranitar
  { id: 'tyranitarmega_fastest', name: 'Mega Tyranitar - fastest', speciesId: 'tyranitarmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'tyranitarmega_maxevs', name: 'Mega Tyranitar - maxEVs', speciesId: 'tyranitarmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'tyranitarmega_base', name: 'Mega Tyranitar - Base', speciesId: 'tyranitarmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'tyranitarmega_slowest', name: 'Mega Tyranitar - slowest', speciesId: 'tyranitarmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Maushold
  { id: 'maushold_fastest', name: 'Maushold - fastest', speciesId: 'maushold', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'maushold_maxevs', name: 'Maushold - maxEVs', speciesId: 'maushold', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'maushold_base', name: 'Maushold - Base', speciesId: 'maushold', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'maushold_slowest', name: 'Maushold - slowest', speciesId: 'maushold', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Mega Delphox
  { id: 'delphoxmega_fastest', name: 'Mega Delphox - fastest', speciesId: 'delphoxmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'delphoxmega_maxevs', name: 'Mega Delphox - maxEVs', speciesId: 'delphoxmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'delphoxmega_base', name: 'Mega Delphox - Base', speciesId: 'delphoxmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'delphoxmega_slowest', name: 'Mega Delphox - slowest', speciesId: 'delphoxmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Mega Gengar
  { id: 'gengarmega_fastest', name: 'Mega Gengar - fastest', speciesId: 'gengarmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'gengarmega_maxevs', name: 'Mega Gengar - maxEVs', speciesId: 'gengarmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'gengarmega_base', name: 'Mega Gengar - Base', speciesId: 'gengarmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'gengarmega_slowest', name: 'Mega Gengar - slowest', speciesId: 'gengarmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Corviknight
  { id: 'corviknight_fastest', name: 'Corviknight - fastest', speciesId: 'corviknight', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'corviknight_maxevs', name: 'Corviknight - maxEVs', speciesId: 'corviknight', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'corviknight_base', name: 'Corviknight - Base', speciesId: 'corviknight', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'corviknight_slowest', name: 'Corviknight - slowest', speciesId: 'corviknight', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Mega Dragonite
  { id: 'dragonitemega_fastest', name: 'Mega Dragonite - fastest', speciesId: 'dragonitemega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'dragonitemega_maxevs', name: 'Mega Dragonite - maxEVs', speciesId: 'dragonitemega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'dragonitemega_base', name: 'Mega Dragonite - Base', speciesId: 'dragonitemega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'dragonitemega_slowest', name: 'Mega Dragonite - slowest', speciesId: 'dragonitemega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Torkoal
  { id: 'torkoal_fastest', name: 'Torkoal - fastest', speciesId: 'torkoal', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'torkoal_maxevs', name: 'Torkoal - maxEVs', speciesId: 'torkoal', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'torkoal_base', name: 'Torkoal - Base', speciesId: 'torkoal', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'torkoal_slowest', name: 'Torkoal - slowest', speciesId: 'torkoal', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Mega Meganium
  { id: 'meganiummega_fastest', name: 'Mega Meganium - fastest', speciesId: 'meganiummega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'meganiummega_maxevs', name: 'Mega Meganium - maxEVs', speciesId: 'meganiummega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'meganiummega_base', name: 'Mega Meganium - Base', speciesId: 'meganiummega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'meganiummega_slowest', name: 'Mega Meganium - slowest', speciesId: 'meganiummega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Mega Scovillain
  { id: 'scovillainmega_fastest', name: 'Mega Scovillain - fastest', speciesId: 'scovillainmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'scovillainmega_maxevs', name: 'Mega Scovillain - maxEVs', speciesId: 'scovillainmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'scovillainmega_base', name: 'Mega Scovillain - Base', speciesId: 'scovillainmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'scovillainmega_slowest', name: 'Mega Scovillain - slowest', speciesId: 'scovillainmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Mega Blastoise
  { id: 'blastoisemega_fastest', name: 'Mega Blastoise - fastest', speciesId: 'blastoisemega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'blastoisemega_maxevs', name: 'Mega Blastoise - maxEVs', speciesId: 'blastoisemega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'blastoisemega_base', name: 'Mega Blastoise - Base', speciesId: 'blastoisemega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'blastoisemega_slowest', name: 'Mega Blastoise - slowest', speciesId: 'blastoisemega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Venusaur
  { id: 'venusaur_fastest', name: 'Venusaur - fastest', speciesId: 'venusaur', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'venusaur_maxevs', name: 'Venusaur - maxEVs', speciesId: 'venusaur', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'venusaur_base', name: 'Venusaur - Base', speciesId: 'venusaur', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'venusaur_slowest', name: 'Venusaur - slowest', speciesId: 'venusaur', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Excadrill
  { id: 'excadrill_fastest', name: 'Excadrill - fastest', speciesId: 'excadrill', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'excadrill_maxevs', name: 'Excadrill - maxEVs', speciesId: 'excadrill', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'excadrill_base', name: 'Excadrill - Base', speciesId: 'excadrill', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'excadrill_slowest', name: 'Excadrill - slowest', speciesId: 'excadrill', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Mega Kangaskhan
  { id: 'kangaskhanmega_fastest', name: 'Mega Kangaskhan - fastest', speciesId: 'kangaskhanmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'kangaskhanmega_maxevs', name: 'Mega Kangaskhan - maxEVs', speciesId: 'kangaskhanmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'kangaskhanmega_base', name: 'Mega Kangaskhan - Base', speciesId: 'kangaskhanmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'kangaskhanmega_slowest', name: 'Mega Kangaskhan - slowest', speciesId: 'kangaskhanmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Kommo-o
  { id: 'kommoo_fastest', name: 'Kommo-o - fastest', speciesId: 'kommoo', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'kommoo_maxevs', name: 'Kommo-o - maxEVs', speciesId: 'kommoo', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'kommoo_base', name: 'Kommo-o - Base', speciesId: 'kommoo', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'kommoo_slowest', name: 'Kommo-o - slowest', speciesId: 'kommoo', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Primarina
  { id: 'primarina_fastest', name: 'Primarina - fastest', speciesId: 'primarina', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'primarina_maxevs', name: 'Primarina - maxEVs', speciesId: 'primarina', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'primarina_base', name: 'Primarina - Base', speciesId: 'primarina', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'primarina_slowest', name: 'Primarina - slowest', speciesId: 'primarina', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Mega Gardevoir
  { id: 'gardevoirmega_fastest', name: 'Mega Gardevoir - fastest', speciesId: 'gardevoirmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'gardevoirmega_maxevs', name: 'Mega Gardevoir - maxEVs', speciesId: 'gardevoirmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'gardevoirmega_base', name: 'Mega Gardevoir - Base', speciesId: 'gardevoirmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'gardevoirmega_slowest', name: 'Mega Gardevoir - slowest', speciesId: 'gardevoirmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Sableye
  { id: 'sableye_fastest', name: 'Sableye - fastest', speciesId: 'sableye', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'sableye_maxevs', name: 'Sableye - maxEVs', speciesId: 'sableye', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'sableye_base', name: 'Sableye - Base', speciesId: 'sableye', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'sableye_slowest', name: 'Sableye - slowest', speciesId: 'sableye', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Dragonite
  { id: 'dragonite_fastest', name: 'Dragonite - fastest', speciesId: 'dragonite', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'dragonite_maxevs', name: 'Dragonite - maxEVs', speciesId: 'dragonite', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'dragonite_base', name: 'Dragonite - Base', speciesId: 'dragonite', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'dragonite_slowest', name: 'Dragonite - slowest', speciesId: 'dragonite', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Mega Scizor
  { id: 'scizormega_fastest', name: 'Mega Scizor - fastest', speciesId: 'scizormega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'scizormega_maxevs', name: 'Mega Scizor - maxEVs', speciesId: 'scizormega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'scizormega_base', name: 'Mega Scizor - Base', speciesId: 'scizormega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'scizormega_slowest', name: 'Mega Scizor - slowest', speciesId: 'scizormega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Tyranitar
  { id: 'tyranitar_fastest', name: 'Tyranitar - fastest', speciesId: 'tyranitar', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'tyranitar_maxevs', name: 'Tyranitar - maxEVs', speciesId: 'tyranitar', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'tyranitar_base', name: 'Tyranitar - Base', speciesId: 'tyranitar', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'tyranitar_slowest', name: 'Tyranitar - slowest', speciesId: 'tyranitar', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Politoed
  { id: 'politoed_fastest', name: 'Politoed - fastest', speciesId: 'politoed', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'politoed_maxevs', name: 'Politoed - maxEVs', speciesId: 'politoed', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'politoed_base', name: 'Politoed - Base', speciesId: 'politoed', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'politoed_slowest', name: 'Politoed - slowest', speciesId: 'politoed', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Alolan Ninetales
  { id: 'ninetalesalola_fastest', name: 'Alolan Ninetales - fastest', speciesId: 'ninetalesalola', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'ninetalesalola_maxevs', name: 'Alolan Ninetales - maxEVs', speciesId: 'ninetalesalola', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'ninetalesalola_base', name: 'Alolan Ninetales - Base', speciesId: 'ninetalesalola', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'ninetalesalola_slowest', name: 'Alolan Ninetales - slowest', speciesId: 'ninetalesalola', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Mega Venusaur
  { id: 'venusaurmega_fastest', name: 'Mega Venusaur - fastest', speciesId: 'venusaurmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'venusaurmega_maxevs', name: 'Mega Venusaur - maxEVs', speciesId: 'venusaurmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'venusaurmega_base', name: 'Mega Venusaur - Base', speciesId: 'venusaurmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'venusaurmega_slowest', name: 'Mega Venusaur - slowest', speciesId: 'venusaurmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Rotom-Heat
  { id: 'rotomheat_fastest', name: 'Rotom-Heat - fastest', speciesId: 'rotomheat', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'rotomheat_maxevs', name: 'Rotom-Heat - maxEVs', speciesId: 'rotomheat', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'rotomheat_base', name: 'Rotom-Heat - Base', speciesId: 'rotomheat', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'rotomheat_slowest', name: 'Rotom-Heat - slowest', speciesId: 'rotomheat', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Mega Lopunny
  { id: 'lopunnymega_fastest', name: 'Mega Lopunny - fastest', speciesId: 'lopunnymega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'lopunnymega_maxevs', name: 'Mega Lopunny - maxEVs', speciesId: 'lopunnymega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'lopunnymega_base', name: 'Mega Lopunny - Base', speciesId: 'lopunnymega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'lopunnymega_slowest', name: 'Mega Lopunny - slowest', speciesId: 'lopunnymega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Dragapult
  { id: 'dragapult_fastest', name: 'Dragapult - fastest', speciesId: 'dragapult', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'dragapult_maxevs', name: 'Dragapult - maxEVs', speciesId: 'dragapult', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'dragapult_base', name: 'Dragapult - Base', speciesId: 'dragapult', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'dragapult_slowest', name: 'Dragapult - slowest', speciesId: 'dragapult', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Mega Aggron
  { id: 'aggronmega_fastest', name: 'Mega Aggron - fastest', speciesId: 'aggronmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'aggronmega_maxevs', name: 'Mega Aggron - maxEVs', speciesId: 'aggronmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'aggronmega_base', name: 'Mega Aggron - Base', speciesId: 'aggronmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'aggronmega_slowest', name: 'Mega Aggron - slowest', speciesId: 'aggronmega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Hydreigon
  { id: 'hydreigon_fastest', name: 'Hydreigon - fastest', speciesId: 'hydreigon', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'hydreigon_maxevs', name: 'Hydreigon - maxEVs', speciesId: 'hydreigon', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'hydreigon_base', name: 'Hydreigon - Base', speciesId: 'hydreigon', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'hydreigon_slowest', name: 'Hydreigon - slowest', speciesId: 'hydreigon', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Palafin
  { id: 'palafin_fastest', name: 'Palafin - fastest', speciesId: 'palafin', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'palafin_maxevs', name: 'Palafin - maxEVs', speciesId: 'palafin', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'palafin_base', name: 'Palafin - Base', speciesId: 'palafin', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'palafin_slowest', name: 'Palafin - slowest', speciesId: 'palafin', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Palafin-Hero
  { id: 'palafinhero_fastest', name: 'Palafin-Hero - fastest', speciesId: 'palafinhero', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'palafinhero_maxevs', name: 'Palafin-Hero - maxEVs', speciesId: 'palafinhero', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'palafinhero_base', name: 'Palafin-Hero - Base', speciesId: 'palafinhero', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'palafinhero_slowest', name: 'Palafin-Hero - slowest', speciesId: 'palafinhero', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Mega Glimmora
  { id: 'glimmoramega_fastest', name: 'Mega Glimmora - fastest', speciesId: 'glimmoramega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'glimmoramega_maxevs', name: 'Mega Glimmora - maxEVs', speciesId: 'glimmoramega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'glimmoramega_base', name: 'Mega Glimmora - Base', speciesId: 'glimmoramega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'glimmoramega_slowest', name: 'Mega Glimmora - slowest', speciesId: 'glimmoramega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 },

  // Mega Crabominable
  { id: 'crabominablemega_fastest', name: 'Mega Crabominable - fastest', speciesId: 'crabominablemega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: 'crabominablemega_maxevs', name: 'Mega Crabominable - maxEVs', speciesId: 'crabominablemega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: 'crabominablemega_base', name: 'Mega Crabominable - Base', speciesId: 'crabominablemega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: 'crabominablemega_slowest', name: 'Mega Crabominable - slowest', speciesId: 'crabominablemega', itemId: 'None', abilityId: 'No Ability', defaultEvs: 0, defaultNature: 0.9 }
];