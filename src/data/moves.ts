import { Generations } from '@smogon/calc';

const gen = Generations.get(9);

export const MOVES_DB: Record<string, any> = {};

for (const move of gen.moves) {
  const cleanId = move.name.toLowerCase().replace(/[^a-z0-9]/g, '');

  MOVES_DB[cleanId] = {
    id: cleanId,
    name: move.name,
    type: move.type,
    category: move.category,
    power: move.basePower || 0, 
    accuracy: move.accuracy || 100,
    priority: move.priority || 0,
    isSpread: move.target === 'allAdjacentFoes' || move.target === 'allAdjacent',
    flags: [] as string[],
    
    // --- EXCEPCIONES DE DAÑO ÚNICAS ---
    // Liofilización pega x2 al agua
    isFreezeDry: cleanId === 'freezedry',
    // Psicocarga, Onda Mental y Espada Santa pegan a la Defensa Física
    overrideDefensiveStat: ['psyshock', 'psystrike', 'secretsword'].includes(cleanId) ? 'def' : null,
    // Plancha Corporal pega usando la Defensa Física del atacante
    overrideOffensiveStat: cleanId === 'bodypress' ? 'def' : null,
    // Juego Sucio pega con el Ataque Físico del rival
    useTargetAttack: cleanId === 'foulplay'
  };

  const currentMove = MOVES_DB[cleanId];

  if (move.flags) {
    if (move.flags.contact) currentMove.flags.push('contact'); 
    if (move.flags.sound) currentMove.flags.push('sound');     
    if (move.flags.punch) currentMove.flags.push('punch');     
    if (move.flags.pulse) currentMove.flags.push('pulse');     
    if (move.flags.bite) currentMove.flags.push('bite');       
    if (move.flags.bullet) currentMove.flags.push('bullet');   
    if (move.flags.slicing) currentMove.flags.push('slicing'); 
  }
  if (move.secondaries || move.isDrop) currentMove.flags.push('secondary');
  if (move.recoil || move.hasCrashDamage) currentMove.flags.push('recoil');
  if (move.multihit) currentMove.flags.push('multihit');
}