import { useState, useMemo, useRef, useEffect } from 'react';
import { Zap, ArrowUpRight, ArrowDownRight, Minus, Gauge, Wind, Package, Sparkles, Crosshair, RotateCcw, Search, ChevronDown } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { POKEDEX } from './data/pokedex';
import { ITEMS_DB } from './data/items';
import { ABILITIES_DB } from './data/habilidades';
import type { Weather, Terrain } from './App';
import { CHAMPIONS_ROSTER } from './data/lista-champions';
// Importamos correctamente las listas externas (y ya no las declaramos abajo)
import { SPEED_THREATS, VGC_BUILDS } from './data/builds';

const TYPE_COLORS: Record<string, string> = {
  Normal: 'bg-[#A8A77A]', Fire: 'bg-[#EE8130]', Water: 'bg-[#6390F0]', Electric: 'bg-[#F7D02C]',
  Grass: 'bg-[#7AC74C]', Ice: 'bg-[#96D9D6]', Fighting: 'bg-[#C22E28]', Poison: 'bg-[#A33EA1]',
  Ground: 'bg-[#E2BF65]', Flying: 'bg-[#A98FF3]', Psychic: 'bg-[#F95587]', Bug: 'bg-[#A6B91A]',
  Rock: 'bg-[#B8A038]', Ghost: 'bg-[#735797]', Dragon: 'bg-[#6F35FC]', Dark: 'bg-[#705746]',
  Steel: 'bg-[#B7B7CE]', Fairy: 'bg-[#D685AD]',
};

// --- FUSIÓN DE LISTAS ---
const COMBINED_SPEED_THREATS = [
  ...VGC_BUILDS.map(build => ({
    id: `vgc_${build.id}`,
    name: `${build.name} (Build)`,
    speciesId: build.speciesId,
    itemId: build.itemId,
    abilityId: build.abilityId,
    defaultEvs: build.defaultEvs.spe,
    defaultNature: build.defaultNature.spe
  })),
  ...SPEED_THREATS
];

// --- SISTEMAS DE SPRITES HD Y RESCATE LOCAL ---
const getSpriteUrl = (id: string) => {
  if (!id) return '';
  if (POKEDEX[id] && POKEDEX[id].sprite) return POKEDEX[id].sprite;

  const spriteFixes: Record<string, string> = {
    'rotomwash': 'rotom-wash', 'rotomheat': 'rotom-heat', 'rotommow': 'rotom-mow',
    'rotomfrost': 'rotom-frost', 'rotomfan': 'rotom-fan', 'basculegionm': 'basculegion',
    'basculegionf': 'basculegion-f', 'aegislash': 'aegislash', 'aegislashblade': 'aegislash-blade', 
    'palafinhero': 'palafin-hero', 'megameganium': 'meganium-mega', 'feraligatrmega': 'feraligatr-mega',
    'typhlosionmega': 'typhlosion-mega', 'dragonitemega': 'dragonite-mega', 'glimmoramega': 'glimmora-mega',
    'lycanrocmidnight': 'lycanroc-midnight', 'lycanrocdusk': 'lycanroc-dusk'
  };

  let cleanId = id.replace('_', '');
  
  if (spriteFixes[cleanId]) {
    cleanId = spriteFixes[cleanId];
  } else {
    // CORRECCIÓN: Showdown usa -megax y -megay (sin el último guion)
    if (cleanId.endsWith('megax')) cleanId = cleanId.replace('megax', '-megax');
    else if (cleanId.endsWith('megay')) cleanId = cleanId.replace('megay', '-megay');
    else if (cleanId.endsWith('mega')) cleanId = cleanId.replace('mega', '-mega');
  }

  return `https://play.pokemonshowdown.com/sprites/dex/${cleanId}.png`;
};

// CORRECCIÓN: Devolvemos el "salvavidas" a la carpeta local que borré sin querer
const handleSpriteError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  if (target.src.includes('/dex/')) {
    const urlParts = target.src.split('/');
    target.src = `/sprites/${urlParts[urlParts.length - 1]}`;
  } else if (!target.src.includes('0.png')) {
    target.src = 'https://play.pokemonshowdown.com/sprites/0.png';
  }
};

const handleIconError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  
  // PASO 1: Si falla en internet, busca en tu PC con el nombre exacto (ej: fairy-feather.png o charizardite-x.png)
  if (target.src.includes('play.pokemonshowdown.com')) {
    const urlParts = target.src.split('/');
    const fileName = urlParts[urlParts.length - 1];
    target.src = `/sprites/${fileName}`;
  } 
  // PASO 2: Si también falla en tu PC y el nombre tenía guiones, prueba a buscarlo SIN guiones (ej: fairyfeather.png)
  else if (target.src.includes('/sprites/') && target.src.includes('-')) {
    // Reemplaza todos los guiones por nada
    target.src = target.src.replace(/-/g, '');
  } 
  // PASO 3: Si ya ha intentado todo y no existe de ninguna forma, lo oculta
  else {
    target.style.display = 'none';
  }
};
const getItemSpriteUrl = (itemName: string) => {
  if (!itemName || itemName === 'No Item' || itemName === 'None') return '';
  let cleanName = itemName.toLowerCase().replace(/'/g, '');
  cleanName = cleanName.replace(/[^a-z0-9]+/g, '-');
  return `https://play.pokemonshowdown.com/sprites/itemicons/${cleanName}.png`;
};

const checkAbility = (abilityIdStr: string, abilityObj: any, enName: string, esName: string) => {
  if (!abilityIdStr && !abilityObj) return false;
  const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "");
  const combined = `${abilityIdStr} ${abilityObj?.name || ''} ${abilityObj?.id || ''}`;
  const nCombined = normalize(combined);
  return nCombined.includes(normalize(enName)) || nCombined.includes(normalize(esName));
};

const calcSpeedStat = (base: number, evs: number, nature: number) => {
  const rawBase = Math.floor(((2 * base + 31) * 50) / 100) + 5;
  return Math.floor((rawBase + evs) * nature);
};

const getSliderStyle = (val: number, colorRgba: string) => ({
  background: `linear-gradient(to right, ${colorRgba} ${(val / 32) * 100}%, white ${(val / 32) * 100}%)`
});

const isMegaForm = (speciesId: string) => {
  if (!speciesId) return false;
  if (speciesId === 'yanmega') return false; // Por si acaso Yanmega entra al juego
  return speciesId.endsWith('mega') || speciesId.endsWith('megax') || speciesId.endsWith('megay');
};

const autoEquipMegaItem = (newSpeciesId: string) => {
  if (!isMegaForm(newSpeciesId)) return null;
  // Borra la terminación de Mega SOLO del final del ID
  const base = newSpeciesId.replace(/megax$|megay$|mega$/, '');
  const possibleItems = Object.keys(ITEMS_DB).filter(k => k.includes('ite') && k.startsWith(base.substring(0, 4)));
  if (newSpeciesId.endsWith('megax')) return possibleItems.find(i => i.endsWith('x')) || 'None';
  if (newSpeciesId.endsWith('megay')) return possibleItems.find(i => i.endsWith('y')) || 'None';
  return possibleItems[0] || 'None';
};

const getTransformData = (speciesId: string, itemId: string) => {
  if (!speciesId) return null;
  
  if (speciesId === 'aegislash') return { target: 'aegislashblade', label: 'Blade Form' };
  if (speciesId === 'aegislashblade') return { target: 'aegislash', label: 'Shield Form' };
  if (speciesId === 'palafin') return { target: 'palafinhero', label: 'Hero Form' };
  if (speciesId === 'palafinhero') return { target: 'palafin', label: 'Zero Form' };

  if (isMegaForm(speciesId)) {
    const base = speciesId.replace(/megax$|megay$|mega$/, '');
    return { target: base, label: 'Revert Form' };
  }

  if (itemId && itemId !== 'None') {
    if (POKEDEX[`${speciesId}megax`] && itemId === autoEquipMegaItem(`${speciesId}megax`)) {
      return { target: `${speciesId}megax`, label: 'Mega Evolve X' };
    }
    if (POKEDEX[`${speciesId}megay`] && itemId === autoEquipMegaItem(`${speciesId}megay`)) {
      return { target: `${speciesId}megay`, label: 'Mega Evolve Y' };
    }
    if (POKEDEX[`${speciesId}mega`] && itemId === autoEquipMegaItem(`${speciesId}mega`)) {
      return { target: `${speciesId}mega`, label: 'Mega Evolve' };
    }
  }
  return null;
};

// --- INPUT DE EVs INTERACTIVO ---
const EvInput = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => {
  const [val, setVal] = useState(value.toString());
  useEffect(() => setVal(value.toString()), [value]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed)) onChange(Math.min(32, Math.max(0, parsed)));
  };
  return (
    <input type="number" value={val} onChange={handleChange} onBlur={() => setVal(value.toString())} className="w-8 text-[10px] text-center font-bold bg-slate-800 border border-slate-600 rounded text-white focus:border-blue-400 focus:bg-slate-700 outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
  );
};

const NatureSelect = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => (
  <div className="flex items-center bg-slate-800 rounded border border-slate-600 overflow-hidden shrink-0">
    <button onClick={() => onChange(1.1)} className={`w-6 py-0.5 text-[10px] font-black transition-colors ${value > 1.0 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`} title="Beneficial Nature (+10%)">+</button>
    <button onClick={() => onChange(1.0)} className={`w-6 py-0.5 text-[10px] font-black transition-colors border-l border-r border-slate-700 ${value === 1.0 ? 'bg-slate-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`} title="Neutral Nature">...</button>
    <button onClick={() => onChange(0.9)} className={`w-6 py-0.5 text-[10px] font-black transition-colors ${value < 1.0 ? 'bg-rose-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`} title="Hindering Nature (-10%)">-</button>
  </div>
);

const SpeedBuildSelector = ({ selectedId, onSelect }: { selectedId: string, onSelect: (id: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const selectedBuild = COMBINED_SPEED_THREATS.find(b => b.id === selectedId) || COMBINED_SPEED_THREATS[0];
  const filteredOptions = COMBINED_SPEED_THREATS.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 flex justify-between items-center cursor-pointer hover:border-rose-500 text-sm font-bold text-white transition-colors" onClick={() => setIsOpen(!isOpen)}>
        <span className="truncate">{selectedBuild ? selectedBuild.name : 'Select Build...'}</span>
        <ChevronDown size={14} className="text-slate-400 shrink-0 ml-1" />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-[100] overflow-hidden">
          <div className="p-2 border-b border-slate-700 flex items-center gap-2 bg-slate-900">
            <Search size={14} className="text-slate-400" />
            <input type="text" autoFocus placeholder="Search build..." className="bg-transparent w-full outline-none text-white text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.map(build => (
              <div key={build.id} className="px-3 py-2 hover:bg-rose-600 cursor-pointer text-xs text-white border-b border-slate-700/50 last:border-0" onClick={() => { onSelect(build.id); setIsOpen(false); setSearch(''); }}>
                {build.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PokemonSelector = ({ selectedId, onSelect }: { selectedId: string, onSelect: (id: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false); const [search, setSearch] = useState(''); const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const selectedPoke = selectedId ? POKEDEX[selectedId] : null;
  // Ocultar aegislashblade de la lista manual
  const sortedOptions = useMemo(() => CHAMPIONS_ROSTER.filter(id => POKEDEX[id] && id !== 'aegislashblade' && id !== 'palafinhero').sort((a, b) => POKEDEX[a].name.localeCompare(POKEDEX[b].name)), []);
  const filteredOptions = sortedOptions.filter(id => POKEDEX[id].name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 flex justify-between items-center cursor-pointer hover:border-blue-500 text-sm font-bold text-white" onClick={() => setIsOpen(!isOpen)}>
        <span className="truncate">{selectedPoke ? selectedPoke.name : 'Select Species...'}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-[100] overflow-hidden">
          <div className="p-2 border-b border-slate-700 flex items-center gap-2 bg-slate-900"><Search size={14} className="text-slate-400" /><input type="text" autoFocus placeholder="Search..." className="bg-transparent w-full outline-none text-white text-xs" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.map(id => <div key={id} className="px-3 py-2 hover:bg-blue-600 cursor-pointer text-xs text-white" onClick={() => { onSelect(id); setIsOpen(false); setSearch(''); }}>{POKEDEX[id].name}</div>)}
          </div>
        </div>
      )}
    </div>
  );
};

const ItemSelector = ({ selectedId, onSelect, colorClass, disabled = false }: { selectedId: string, onSelect: (id: string) => void, colorClass: string, disabled?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false); const [search, setSearch] = useState(''); const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const selectedItem = selectedId && selectedId !== 'None' ? ITEMS_DB[selectedId] : null;
  const sortedOptions = useMemo(() => Object.values(ITEMS_DB).sort((a, b) => a.name.localeCompare(b.name)), []);
  const filteredOptions = sortedOptions.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative" ref={wrapperRef}>
      <div className={`w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 flex justify-between items-center transition-all ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-800' : `cursor-pointer hover:border-blue-500 ${colorClass}`}`} onClick={() => !disabled && setIsOpen(!isOpen)}>
        <div className="flex items-center gap-1.5 overflow-hidden flex-1">
          {selectedItem && <img src={getItemSpriteUrl(selectedItem.name)} alt="" className="w-5 h-5 object-contain flex-shrink-0" onError={handleIconError} />}
          <span className="truncate text-[11px] font-bold text-white leading-tight">{selectedItem ? selectedItem.name : 'No Item'}</span>
        </div>
        <ChevronDown size={12} className="text-slate-400 shrink-0 ml-1" />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-[100] overflow-hidden">
          <div className="p-2 border-b border-slate-700 flex items-center gap-2 bg-slate-900"><Search size={14} className="text-slate-400" /><input type="text" autoFocus placeholder="Search Item..." className="bg-transparent w-full outline-none text-white text-xs" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="max-h-48 overflow-y-auto">
            <div className={`px-3 py-2 hover:bg-slate-600 cursor-pointer text-xs text-white flex items-center gap-2`} onClick={() => { onSelect('None'); setIsOpen(false); setSearch(''); }}>No Item</div>
            {filteredOptions.filter(i => i.id !== 'None').map(item => (
              <div key={item.id} className={`px-3 py-2 hover:bg-blue-600 cursor-pointer text-[11px] text-white flex items-center gap-2`} onClick={() => { onSelect(item.id); setIsOpen(false); setSearch(''); }}>
                <img src={getItemSpriteUrl(item.name)} alt="" className="w-5 h-5 object-contain flex-shrink-0" onError={handleIconError} />
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function SpeedMode({ weather, terrain, setWeather, setTerrain }: { weather?: Weather, terrain?: Terrain, setWeather?: (w: Weather) => void, setTerrain?: (t: Terrain) => void }) {
  const [userSpeciesId, setUserSpeciesId] = useLocalStorage('speed-user-species', 'garchomp');
  // Salvavidas para userPokemon
  const userPokemon = POKEDEX[userSpeciesId] || POKEDEX['garchomp'];

  const [userAbilityId, setUserAbilityId] = useLocalStorage('speed-user-ability', userPokemon.abilities[0] || 'No Ability');
  const [userItemId, setUserItemId] = useLocalStorage('speed-user-item', 'None');
  const [userEvs, setUserEvs] = useLocalStorage<number>('speed-user-evs', 0);
  const [userNature, setUserNature] = useLocalStorage<number>('speed-user-nature', 1.0);
  const [userTailwind, setUserTailwind] = useLocalStorage('speed-user-tailwind', false);
  const [userParalyzed, setUserParalyzed] = useLocalStorage('speed-user-para', false);

  const [rivalBuildId, setRivalBuildId] = useLocalStorage('speed-rival-build', COMBINED_SPEED_THREATS[0].id);
  const [enemyTailwind, setEnemyTailwind] = useLocalStorage('speed-enemy-tailwind', false);
  const [enemyParalyzed, setEnemyParalyzed] = useLocalStorage('speed-enemy-para', false);

  const [rivalSpeciesOverride, setRivalSpeciesOverride] = useState<string | null>(null);
  const [rivalAbilityOverride, setRivalAbilityOverride] = useState<string | null>(null);

  const userAbility = ABILITIES_DB[userAbilityId] || ABILITIES_DB['No Ability'];
  const userItem = ITEMS_DB[userItemId] || ITEMS_DB['None'];
  const transformData = getTransformData(userSpeciesId, userItemId);

  // (En SpeedMode la lista se llama COMBINED_SPEED_THREATS en vez de VGC_BUILDS)
  const activeBuild = useMemo(() => COMBINED_SPEED_THREATS.find(b => b.id === rivalBuildId) || COMBINED_SPEED_THREATS[0], [rivalBuildId]);
  
  const rivalPokemon = POKEDEX[rivalSpeciesOverride || activeBuild.speciesId] || POKEDEX['garchomp'];
  
  const rivalAbilityId = rivalAbilityOverride || activeBuild.abilityId;
  const rivalAbility = ABILITIES_DB[rivalAbilityId] || { name: rivalAbilityId }; 
  const rivalItem = ITEMS_DB[activeBuild.itemId] || { name: activeBuild.itemId };

  const handleSpeciesChange = (newSpeciesId: string) => {
    setUserSpeciesId(newSpeciesId);
    setUserAbilityId(POKEDEX[newSpeciesId]?.abilities[0] || 'No Ability');
    
    // Reseteos al cambiar de Pokémon
    setUserEvs(0);
    setUserNature(1.0);
    
    const megaItem = autoEquipMegaItem(newSpeciesId);
    if (megaItem) setUserItemId(megaItem);
    else setUserItemId('None');
  };

  

  const handleRivalChange = (newBuildId: string) => {
    setRivalBuildId(newBuildId);
    setRivalSpeciesOverride(null);
    setRivalAbilityOverride(null);
    // (deja aquí debajo los setCrits o lo que ya tuvieras)
  };

  const handleReset = () => {
    setUserSpeciesId('garchomp');
    setUserAbilityId(POKEDEX['garchomp'].abilities[0] || 'No Ability');
    setUserItemId('None');
    setUserEvs(0); setUserNature(1.0);
    setUserTailwind(false); 
    setUserParalyzed(false);
    setEnemyTailwind(false);
    setEnemyParalyzed(false);
    setRivalBuildId(COMBINED_SPEED_THREATS[0].id);
    setWeather?.('None'); 
    setTerrain?.('None');
  };

  const userSpeed = useMemo(() => {
    let stat = calcSpeedStat(userPokemon.baseStats.spe, userEvs, userNature);
    if (userItem.speMod) stat = Math.floor(stat * userItem.speMod);
    if (userAbility.speMod) stat = Math.floor(stat * userAbility.speMod);

    if (checkAbility(userAbilityId, userAbility, 'Swift Swim', 'Nado Rapido') && weather === 'Rain') stat = Math.floor(stat * 2);
    if (checkAbility(userAbilityId, userAbility, 'Chlorophyll', 'Clorofila') && weather === 'Sun') stat = Math.floor(stat * 2);
    if (checkAbility(userAbilityId, userAbility, 'Sand Rush', 'Impetu Arena') && weather === 'Sand') stat = Math.floor(stat * 2);
    if (checkAbility(userAbilityId, userAbility, 'Slush Rush', 'Quitanieves') && weather === 'Snow') stat = Math.floor(stat * 2);
    if (checkAbility(userAbilityId, userAbility, 'Surge Surfer', 'Cola Surf') && terrain === 'Electric') stat = Math.floor(stat * 2);
    if (checkAbility(userAbilityId, userAbility, 'Protosynthesis', 'Protosintesis') && weather === 'Sun') stat = Math.floor(stat * 1.5);
    if (checkAbility(userAbilityId, userAbility, 'Quark Drive', 'Carga Cuark') && terrain === 'Electric') stat = Math.floor(stat * 1.5);

    if (userTailwind) stat = Math.floor(stat * 2);
    if (userParalyzed && !userPokemon.types.includes('Electric')) stat = Math.floor(stat * 0.5);
    return stat;
  }, [userPokemon, userEvs, userNature, userItem, userAbility, userAbilityId, userTailwind, userParalyzed, weather, terrain]);

  const enemySpeed = useMemo(() => {
    let stat = calcSpeedStat(rivalPokemon.baseStats.spe, activeBuild.defaultEvs, activeBuild.defaultNature);
    if (rivalItem.speMod) stat = Math.floor(stat * rivalItem.speMod);
    if (rivalAbility.speMod) stat = Math.floor(stat * rivalAbility.speMod);

    const rivalAbilId = activeBuild.abilityId;
    if (checkAbility(rivalAbilId, rivalAbility, 'Swift Swim', 'Nado Rapido') && weather === 'Rain') stat = Math.floor(stat * 2);
    if (checkAbility(rivalAbilId, rivalAbility, 'Chlorophyll', 'Clorofila') && weather === 'Sun') stat = Math.floor(stat * 2);
    if (checkAbility(rivalAbilId, rivalAbility, 'Sand Rush', 'Impetu Arena') && weather === 'Sand') stat = Math.floor(stat * 2);
    if (checkAbility(rivalAbilId, rivalAbility, 'Slush Rush', 'Quitanieves') && weather === 'Snow') stat = Math.floor(stat * 2);
    if (checkAbility(rivalAbilId, rivalAbility, 'Surge Surfer', 'Cola Surf') && terrain === 'Electric') stat = Math.floor(stat * 2);
    if (checkAbility(rivalAbilId, rivalAbility, 'Protosynthesis', 'Protosintesis') && weather === 'Sun') stat = Math.floor(stat * 1.5);
    if (checkAbility(rivalAbilId, rivalAbility, 'Quark Drive', 'Carga Cuark') && terrain === 'Electric') stat = Math.floor(stat * 1.5);

    if (enemyTailwind) stat = Math.floor(stat * 2);
    if (enemyParalyzed && !rivalPokemon.types.includes('Electric')) stat = Math.floor(stat * 0.5);
    return stat;
  }, [rivalPokemon, activeBuild, rivalItem, rivalAbility, enemyTailwind, enemyParalyzed, weather, terrain]);

  const speedDiff = userSpeed - enemySpeed;
  const isFaster = speedDiff > 0;
  const isTie = speedDiff === 0;
  const maxSpeedScale = Math.max(userSpeed, enemySpeed, 300) * 1.1;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className={`rounded-2xl p-6 text-center border-2 shadow-xl transition-colors duration-500 ${isTie ? 'bg-slate-800 border-slate-600' : isFaster ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-rose-900/30 border-rose-500/50'}`}>
        <div className="flex items-center justify-center gap-3 mb-2">
          {isTie ? <Minus className="text-slate-400" size={32} /> : isFaster ? <ArrowUpRight className="text-emerald-400" size={32} /> : <ArrowDownRight className="text-rose-400" size={32} />}
          <h2 className={`text-3xl font-black uppercase tracking-wider ${isTie ? 'text-slate-300' : isFaster ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isTie ? 'Speed Tie' : isFaster ? 'You are faster' : 'You are slower'}
          </h2>
        </div>
        <p className="text-slate-400 text-lg">{isTie ? 'Decided by a 50/50 speed tie.' : `Difference of `} {!isTie && <span className="font-bold text-white text-xl">{Math.abs(speedDiff)} points</span>}</p>
        <div className="mt-8 max-w-2xl mx-auto space-y-4">
          <div className="flex items-center gap-4"><span className="w-16 text-right font-bold text-blue-400">{userSpeed}</span><div className="flex-1 bg-slate-800 rounded-full h-4 overflow-hidden relative"><div className="bg-blue-500 h-full transition-all duration-500 rounded-full" style={{ width: `${Math.min((userSpeed / maxSpeedScale) * 100, 100)}%` }} /></div></div>
          <div className="flex items-center gap-4"><span className="w-16 text-right font-bold text-rose-400">{enemySpeed}</span><div className="flex-1 bg-slate-800 rounded-full h-4 overflow-hidden relative"><div className="bg-rose-500 h-full transition-all duration-500 rounded-full" style={{ width: `${Math.min((enemySpeed / maxSpeedScale) * 100, 100)}%` }} /></div></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
            <div className="flex items-center gap-2 text-blue-400"><Gauge size={20} /><h3 className="font-bold text-lg">Your Pokémon</h3></div>
            <button onClick={handleReset} title="Reset" className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-rose-600 transition-colors"><RotateCcw size={14}/></button>
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full">
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="w-20 h-20 flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-700 shadow-inner overflow-hidden">
                  <img src={getSpriteUrl(userSpeciesId)} alt={userPokemon.name} className="max-h-16 object-contain" onError={handleSpriteError} />
                </div>
                <div className="flex gap-1">{userPokemon.types.map(t => <span key={t} className={`${TYPE_COLORS[t]} text-white text-[8px] font-black px-1 rounded uppercase border border-black/10`}>{t.substring(0,3)}</span>)}</div>
              </div>
              <div className="flex-1 flex flex-col justify-start w-full">
            <label className="block text-sm mb-1 text-slate-400">Species</label>
            <PokemonSelector selectedId={userSpeciesId} onSelect={handleSpeciesChange} />
            
            {/* BOTÓN INTELIGENTE DE TRANSFORMACIÓN / MEGA */}
            {transformData && (
              <button 
                onClick={() => {
                  setUserSpeciesId(transformData.target);
                  setUserAbilityId(POKEDEX[transformData.target]?.abilities[0] || 'No Ability');
                }} 
                className="mt-2 w-full py-1.5 bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-500/50 rounded-lg text-xs font-bold hover:bg-fuchsia-600/40 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={12} /> {transformData.label}
              </button>
            )}
          </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div><label className="block text-sm mb-1 text-slate-400 flex items-center gap-1"><Sparkles size={14}/> Ability</label>
                <select value={userAbilityId} onChange={(e) => setUserAbilityId(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 outline-none text-blue-300">
                  {userPokemon.abilities.map((ab: string) => <option key={ab} value={ab}>{ABILITIES_DB[ab]?.name || ab}</option>)}
                </select>
              </div>
              <div><label className="block text-sm mb-1 text-slate-400 flex items-center gap-1"><Package size={14}/> Item</label>
                <ItemSelector 
                    selectedId={userItemId} 
                    onSelect={setUserItemId} 
                    colorClass="text-rose-300 hover:border-rose-500" // (El color que toque)
                    disabled={isMegaForm(userSpeciesId)} 
                  />
              </div>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="flex items-center gap-2 font-bold text-blue-400">
                  <Gauge size={16}/> Speed
                </span>
                <div className="flex items-center gap-3">
                  <NatureSelect value={userNature} onChange={setUserNature} />
                  <span className="text-xl font-mono text-white flex items-center gap-1">
                    {userSpeed}
                    {checkAbility(userAbilityId, userAbility, 'Swift Swim', 'Nado Rapido') && weather === 'Rain' && <span className="text-[10px] text-blue-300 bg-blue-900/50 px-1 rounded ml-1">x2</span>}
                    {checkAbility(userAbilityId, userAbility, 'Chlorophyll', 'Clorofila') && weather === 'Sun' && <span className="text-[10px] text-orange-300 bg-orange-900/50 px-1 rounded ml-1">x2</span>}
                    {checkAbility(userAbilityId, userAbility, 'Sand Rush', 'Impetu Arena') && weather === 'Sand' && <span className="text-[10px] text-yellow-500 bg-yellow-900/50 px-1 rounded ml-1">x2</span>}
                    {checkAbility(userAbilityId, userAbility, 'Slush Rush', 'Quitanieves') && weather === 'Snow' && <span className="text-[10px] text-cyan-300 bg-cyan-900/50 px-1 rounded ml-1">x2</span>}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-slate-400 mb-1"><span>EVs:</span></div>
              <div className="flex items-center gap-2">
                <input type="range" min="0" max="32" value={userEvs} onChange={(e) => setUserEvs(Number(e.target.value))} className="flex-1 accent-blue-500 bg-white rounded-full h-1.5 appearance-none cursor-pointer" style={getSliderStyle(userEvs, 'rgba(59, 130, 246, 0.4)')} />
                <EvInput value={userEvs} onChange={setUserEvs} />
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-6 pt-4 border-t border-slate-700">
            <button onClick={() => setUserTailwind(!userTailwind)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-colors border ${userTailwind ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-700'}`}><Wind size={16} /> Tailwind</button>
            <button onClick={() => setUserParalyzed(!userParalyzed)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-colors border ${userParalyzed ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-700'}`}><Zap size={16} /> Paralyzed</button>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-rose-400 border-b border-slate-700 pb-2"><Crosshair size={20} /><h3 className="font-bold text-lg">Rival Build</h3></div>
          <div className="space-y-4 flex-1">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full">
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="w-20 h-20 flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-700 shadow-inner overflow-hidden">
                  <img 
                    src={getSpriteUrl(rivalPokemon.id)} 
                    alt={rivalPokemon.name} 
                    className="max-h-16 object-contain" 
                    onError={handleSpriteError}
                  />
                </div>
                <div className="flex gap-1">{rivalPokemon.types.map(t => <span key={t} className={`${TYPE_COLORS[t]} text-white text-[8px] font-black px-1 rounded uppercase border border-black/10`}>{t.substring(0,3)}</span>)}</div>
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm mb-1 text-slate-400">Select Rival</label>
                <SpeedBuildSelector selectedId={rivalBuildId} onSelect={handleRivalChange} />
                {/* BOTÓN INTELIGENTE DEL RIVAL */}
                {(() => {
                  const transformData = getTransformData(rivalPokemon.id, activeBuild.itemId);
                  if (!transformData) return null;
                  return (
                    <button 
                      onClick={() => {
                        setRivalSpeciesOverride(transformData.target);
                        setRivalAbilityOverride(POKEDEX[transformData.target]?.abilities[0] || 'No Ability');
                      }} 
                      className="mt-2 w-full py-1.5 bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-500/50 rounded-lg text-xs font-bold hover:bg-fuchsia-600/40 transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={12} /> {transformData.label}
                    </button>
                  );
                })()}
              </div>
            </div>
            
            {/* NUEVA CAJA DE ESTADÍSTICAS DEL RIVAL (Velocidad, Nat, EVs) */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 mt-4 space-y-3">
              
              <div className="flex justify-between items-center mb-1">
                <span className="flex items-center gap-2 font-bold text-blue-400 uppercase tracking-wider text-xs">
                  <Gauge size={14}/> Final Speed
                </span>
                <span className="text-xl font-mono text-white font-bold">{enemySpeed}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                <div className="flex flex-col text-center">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Base</span>
                  <span className="font-mono text-white text-sm">{rivalPokemon.baseStats.spe}</span>
                </div>
                <div className="flex flex-col text-center border-l border-r border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Nature</span>
                  <span className="font-mono text-sm">
                    {activeBuild.defaultNature === 1.1 && <span className="text-emerald-400 font-bold">+</span>}
                    {activeBuild.defaultNature === 1.0 && <span className="text-slate-300">...</span>}
                    {activeBuild.defaultNature === 0.9 && <span className="text-rose-400 font-bold">-</span>}
                  </span>
                </div>
                <div className="flex flex-col text-center">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">EVs</span>
                  <span className="font-mono text-blue-300 text-sm font-bold">{activeBuild.defaultEvs}</span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-slate-800 space-y-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px] font-bold uppercase">Item:</span>
                  <span className="text-[11px] text-rose-300 font-bold flex items-center gap-1.5 bg-rose-900/30 px-2 py-0.5 rounded border border-rose-900/50">
                    <img src={getItemSpriteUrl(rivalItem.name)} alt="" className="w-3.5 h-3.5 object-contain" onError={handleIconError} />
                    <span className="truncate">{rivalItem.name}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px] font-bold uppercase">Ability:</span>
                  <span className="text-[11px] text-yellow-300 font-bold flex items-center gap-1.5 bg-yellow-900/30 px-2 py-0.5 rounded border border-yellow-900/50">
                    <Sparkles size={10} className="shrink-0" />
                    <span className="truncate">{rivalAbility.name || 'No Ability'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-6 pt-4 border-t border-slate-700">
            <button onClick={() => setEnemyTailwind(!enemyTailwind)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-colors border ${enemyTailwind ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-700'}`}><Wind size={16} /> Tailwind</button>
            <button onClick={() => setEnemyParalyzed(!enemyParalyzed)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-colors border ${enemyParalyzed ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-700'}`}><Zap size={16} /> Paralyzed</button>
          </div>
        </div>
      </div>
    </div>
  );
}