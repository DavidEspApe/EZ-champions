import { POKEDEX } from './pokedex';
import { CHAMPIONS_ROSTER } from './lista-champions';
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
    id: 'floetteeternalmega_off', name: 'Mega Floette - Offensive', speciesId: 'floetteeternalmega', itemId: 'floettite', abilityId: 'Flower Veil',
    defaultEvs: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
    defaultNature: { atk: 0.9, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.1 },
    moves: ['moonblast', 'dazzlinggleam', 'lightofruin', 'protect']
  },
  {
    id: 'floetteeternalmega_cm', name: 'Mega Floette - Calm Mind', speciesId: 'floetteeternalmega', itemId: 'floettite', abilityId: 'Flower Veil',
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

// AquÃ­ guardamos la lista masiva que creamos para el SpeedMode
/* export const SPEED_THREATS = ... */
export const SPEED_THREATS = CHAMPIONS_ROSTER.filter(id => POKEDEX[id]).map(id => POKEDEX[id]).flatMap((poke: any) => [
  { id: poke.id + '_fastest', name: poke.name + ' - Fastest', speciesId: poke.id, itemId: 'None', abilityId: poke.abilities[0] || 'No Ability', defaultEvs: 32, defaultNature: 1.1 },
  { id: poke.id + '_maxevs', name: poke.name + ' - Max EVs', speciesId: poke.id, itemId: 'None', abilityId: poke.abilities[0] || 'No Ability', defaultEvs: 32, defaultNature: 1.0 },
  { id: poke.id + '_base', name: poke.name + ' - Base', speciesId: poke.id, itemId: 'None', abilityId: poke.abilities[0] || 'No Ability', defaultEvs: 0, defaultNature: 1.0 },
  { id: poke.id + '_slowest', name: poke.name + ' - Slowest', speciesId: poke.id, itemId: 'None', abilityId: poke.abilities[0] || 'No Ability', defaultEvs: 0, defaultNature: 0.9 }
]);

