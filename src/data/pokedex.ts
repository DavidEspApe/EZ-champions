import { Generations } from '@smogon/calc';
import { CUSTOM_POKEDEX } from './champions-custom';
import { MOVES_DB } from './moves'; 
import { POKEMON_ABILITIES } from './habilidades-descargadas';
import { LEARNSETS_CUSTOM } from './learnsets-custom';
import { LEARNSETS as ROBOT_LEARNSETS } from './learnsets';

const gen = Generations.get(9);

// Sacamos la lista de ataques disponibles en la DB para filtrar de forma segura
const allMoveIds = Object.keys(MOVES_DB);

export const POKEDEX: Record<string, any> = {};

// 1. Cargar Pokémon Oficiales
for (const pokemon of gen.species) {
  const cleanId = pokemon.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Decidimos qué lista de ataques usar (Prioridad: Tu lista manual > Robot)
  const manualMoves = LEARNSETS_CUSTOM[cleanId];
  const selectedMoves = manualMoves && manualMoves.length > 0 ? manualMoves : (ROBOT_LEARNSETS[cleanId] || []);

  POKEDEX[cleanId] = {
    id: cleanId,
    name: pokemon.name, 
    baseStats: { ...pokemon.baseStats },
    types: pokemon.types,
    abilities: POKEMON_ABILITIES[cleanId] || ['No Ability'],
    weightkg: pokemon.weightkg || 50.0,
    // FILTRO DE SEGURIDAD: Solo pasamos ataques que el moves.ts conoce
    learnset: selectedMoves.filter(moveId => allMoveIds.includes(moveId))
  };
}

// --- NUEVO: REPARACIÓN DE MEGAS OFICIALES ---
// Hacemos que hereden los ataques de su forma normal si los tienen vacíos
Object.keys(POKEDEX).forEach(cleanId => {
  if (POKEDEX[cleanId].learnset.length === 0) {
    // Le quitamos el "mega", "megax" o "megay" al final del nombre
    let baseId = cleanId.replace(/mega[xy]?$/, '');
    if (baseId !== cleanId && POKEDEX[baseId]) {
      POKEDEX[cleanId].learnset = [...POKEDEX[baseId].learnset];
    }
  }
});

// --- HERENCIA PARA LYCANROC ---
// Hace que el Nocturno y el Crepuscular copien los ataques del Diurno automáticamente
['lycanrocmidnight', 'lycanrocdusk'].forEach(lycanId => {
  if (POKEDEX[lycanId] && POKEDEX['lycanroc']) {
    // Si no le has puesto ataques propios en LEARNSETS_CUSTOM, coge los del normal
    if (!LEARNSETS_CUSTOM[lycanId] || LEARNSETS_CUSTOM[lycanId].length === 0) {
      POKEDEX[lycanId].learnset = [...POKEDEX['lycanroc'].learnset];
    }
  }
});

// 2. Inyectar las Megas Custom y Formas Especiales
Object.keys(CUSTOM_POKEDEX).forEach(customId => {
  const customData = CUSTOM_POKEDEX[customId];
  const baseForm = customData.baseSpecies && POKEDEX[customData.baseSpecies] ? POKEDEX[customData.baseSpecies] : null;

  const customLearnset = LEARNSETS_CUSTOM[customId];
  
  // HERENCIA DE ATAQUES
  let fallbackLearnset = baseForm ? baseForm.learnset : allMoveIds;
  if (baseForm && customData.extraMoves) {
    fallbackLearnset = [...baseForm.learnset, ...customData.extraMoves];
  }

  // HERENCIA DE HABILIDADES
  const finalAbilities = customData.abilities || (baseForm ? baseForm.abilities : ['No Ability']);

  POKEDEX[customId] = {
    id: customId,
    ...POKEDEX[customId], 
    types: baseForm ? baseForm.types : ['Normal'],
    abilities: finalAbilities,
    weightkg: baseForm ? baseForm.weightkg : 50.0,
    learnset: customLearnset && customLearnset.length > 0 ? customLearnset : fallbackLearnset,
    ...customData 
  };

  // Filtro de seguridad
  POKEDEX[customId].learnset = POKEDEX[customId].learnset.filter((moveId: string) => allMoveIds.includes(moveId));
});