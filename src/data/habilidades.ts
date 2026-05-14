import type { PokemonType } from './tipos';

export interface Ability {
  id: string;
  name: string;
  // Multiplicadores directos de estadísticas
  atkMod?: number;
  spaMod?: number;
  defMod?: number;
  spdMod?: number;
  speMod?: number;
  
  // Multiplicadores condicionales de Velocidad
  speedWeather?: 'Sun' | 'Rain' | 'Sand' | 'Snow';
  speedTerrain?: 'Electric';
  
  // Multiplicadores condicionales de Daño (Por categoría de movimiento)
  boostFlag?: 'punch' | 'bite' | 'pulse' | 'slicing' | 'sound' | 'contact';
  boostFlagMod?: number;
  
  // Multiplicadores de Daño (Por Tipo Elemental)
  boostType?: PokemonType;
  boostTypeMod?: number;
  
  // Inmunidades y Resistencias
  immuneTypes?: PokemonType[];
  resistTypes?: { type: PokemonType; mod: number }[];
}

export const ABILITIES_DB: Record<string, Ability> = {
  'No Ability': { id: 'No Ability', name: 'No Ability' },

  // --- MULTIPLICADORES DE ESTADÍSTICAS BRUTOS ---
  'Huge Power': { id: 'Huge Power', name: 'Huge Power', atkMod: 2 },
  'Pure Power': { id: 'Pure Power', name: 'Pure Power', atkMod: 2 },
  'Gorilla Tactics': { id: 'Gorilla Tactics', name: 'Gorilla Tactics', atkMod: 1.5 },
  
  // --- DOBLADORES DE VELOCIDAD POR CLIMA/CAMPO ---
  'Swift Swim': { id: 'Swift Swim', name: 'Swift Swim', speedWeather: 'Rain' },
  'Chlorophyll': { id: 'Chlorophyll', name: 'Chlorophyll', speedWeather: 'Sun' },
  'Sand Rush': { id: 'Sand Rush', name: 'Sand Rush', speedWeather: 'Sand' },
  'Slush Rush': { id: 'Slush Rush', name: 'Slush Rush', speedWeather: 'Snow' },
  'Surge Surfer': { id: 'Surge Surfer', name: 'Surge Surfer', speedTerrain: 'Electric' },

  // --- POTENCIADORES DE MOVIMIENTOS POR ETIQUETA (FLAGS) ---
  'Iron Fist': { id: 'Iron Fist', name: 'Iron Fist', boostFlag: 'punch', boostFlagMod: 1.2 },
  'Strong Jaw': { id: 'Strong Jaw', name: 'Strong Jaw', boostFlag: 'bite', boostFlagMod: 1.5 },
  'Mega Launcher': { id: 'Mega Launcher', name: 'Mega Launcher', boostFlag: 'pulse', boostFlagMod: 1.5 },
  'Tough Claws': { id: 'Tough Claws', name: 'Tough Claws', boostFlag: 'contact', boostFlagMod: 1.3 },
  'Sharpness': { id: 'Sharpness', name: 'Sharpness', boostFlag: 'slicing', boostFlagMod: 1.5 },
  'Punk Rock': { id: 'Punk Rock', name: 'Punk Rock', boostFlag: 'sound', boostFlagMod: 1.3 },

  // --- POTENCIADORES DE TIPO ELEMENTAL ---
  'Transistor': { id: 'Transistor', name: 'Transistor', boostType: 'Electric', boostTypeMod: 1.3 },
  'Dragon\'s Maw': { id: 'Dragon\'s Maw', name: 'Dragon\'s Maw', boostType: 'Dragon', boostTypeMod: 1.5 },
  'Steelworker': { id: 'Steelworker', name: 'Steelworker', boostType: 'Steel', boostTypeMod: 1.5 },
  'Water Bubble': { id: 'Water Bubble', name: 'Water Bubble', boostType: 'Water', boostTypeMod: 2, resistTypes: [{ type: 'Fire', mod: 0.5 }] },

  // --- INMUNIDADES COMUNES ---
  'Levitate': { id: 'Levitate', name: 'Levitate', immuneTypes: ['Ground'] },
  'Earth Eater': { id: 'Earth Eater', name: 'Earth Eater', immuneTypes: ['Ground'] },
  'Volt Absorb': { id: 'Volt Absorb', name: 'Volt Absorb', immuneTypes: ['Electric'] },
  'Motor Drive': { id: 'Motor Drive', name: 'Motor Drive', immuneTypes: ['Electric'] },
  'Lightning Rod': { id: 'Lightning Rod', name: 'Lightning Rod', immuneTypes: ['Electric'] },
  'Water Absorb': { id: 'Water Absorb', name: 'Water Absorb', immuneTypes: ['Water'] },
  'Storm Drain': { id: 'Storm Drain', name: 'Storm Drain', immuneTypes: ['Water'] },
  'Dry Skin': { id: 'Dry Skin', name: 'Dry Skin', immuneTypes: ['Water'] },
  'Flash Fire': { id: 'Flash Fire', name: 'Flash Fire', immuneTypes: ['Fire'], boostType: 'Fire', boostTypeMod: 1.5 },
  'Well-Baked Body': { id: 'Well-Baked Body', name: 'Well-Baked Body', immuneTypes: ['Fire'] },
  'Sap Sipper': { id: 'Sap Sipper', name: 'Sap Sipper', immuneTypes: ['Grass'] },
  'Soundproof': { id: 'Soundproof', name: 'Soundproof' }, // Se gestiona directamente con la flag 'sound' en la fórmula

  // --- OTRAS REDUCCIONES DE DAÑO ---
  'Thick Fat': { id: 'Thick Fat', name: 'Thick Fat', resistTypes: [{ type: 'Fire', mod: 0.5 }, { type: 'Ice', mod: 0.5 }] },
  'Purifying Salt': { id: 'Purifying Salt', name: 'Purifying Salt', resistTypes: [{ type: 'Ghost', mod: 0.5 }] },
  'Fluffy': { id: 'Fluffy', name: 'Fluffy', resistTypes: [{ type: 'Fire', mod: 2 }] } // Fluffy también reduce el contacto a la mitad, lo meteremos en la fórmula luego
};