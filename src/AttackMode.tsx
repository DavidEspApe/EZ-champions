import { useState, useMemo, useRef, useEffect } from 'react';
import { Crosshair, Shield, Heart, ShieldAlert, Activity, Swords, Search, ChevronDown, Package, Sparkles, Flame, Users, RotateCcw } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { POKEDEX } from './data/pokedex';
import { MOVES_DB } from './data/moves';
import { getEffectiveness } from './data/tipos';
import { ITEMS_DB } from './data/items';
import { ABILITIES_DB } from './data/habilidades';
import type { Weather, Terrain } from './App';
import { CHAMPIONS_ROSTER } from './data/lista-champions';
import { VGC_BUILDS } from './data/builds';

const TYPE_COLORS: Record<string, string> = {
  Normal: 'bg-[#A8A77A]', Fire: 'bg-[#EE8130]', Water: 'bg-[#6390F0]', Electric: 'bg-[#F7D02C]',
  Grass: 'bg-[#7AC74C]', Ice: 'bg-[#96D9D6]', Fighting: 'bg-[#C22E28]', Poison: 'bg-[#A33EA1]',
  Ground: 'bg-[#E2BF65]', Flying: 'bg-[#A98FF3]', Psychic: 'bg-[#F95587]', Bug: 'bg-[#A6B91A]',
  Rock: 'bg-[#B8A038]', Ghost: 'bg-[#735797]', Dragon: 'bg-[#6F35FC]', Dark: 'bg-[#705746]',
  Steel: 'bg-[#B7B7CE]', Fairy: 'bg-[#D685AD]',
};

// --- SISTEMA DE SPRITES HD Y RESCATE LOCAL ---
const getSpriteUrl = (id: string) => {
  if (!id) return '';
  if (POKEDEX[id] && POKEDEX[id].sprite) return POKEDEX[id].sprite;
  const spriteFixes: Record<string, string> = {
    'rotomwash': 'rotom-wash', 'rotomheat': 'rotom-heat', 'rotommow': 'rotom-mow', 'rotomfrost': 'rotom-frost', 'rotomfan': 'rotom-fan', 
    'basculegionm': 'basculegion', 'basculegionf': 'basculegion-f', 'aegislash': 'aegislash', 'aegislashblade': 'aegislash-blade', 
    'palafinhero': 'palafin-hero', 'megameganium': 'meganium-mega', 'feraligatrmega': 'feraligatr-mega',
    'typhlosionmega': 'typhlosion-mega', 'dragonitemega': 'dragonite-mega', 'glimmoramega': 'glimmora-mega',
    'lycanrocmidnight': 'lycanroc-midnight', 'lycanrocdusk': 'lycanroc-dusk'
  };
  let cleanId = id.replace('_', '');
  if (spriteFixes[id]) cleanId = spriteFixes[id];
  else {
    if (cleanId.endsWith('megax')) cleanId = cleanId.replace('megax', '-mega-x');
    else if (cleanId.endsWith('megay')) cleanId = cleanId.replace('megay', '-mega-y');
    else if (cleanId.endsWith('mega')) cleanId = cleanId.replace('mega', '-mega');
  }
  return `https://play.pokemonshowdown.com/sprites/dex/${cleanId}.png`;
};

const handleSpriteError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  if (target.src.includes('/dex/')) {
    const urlParts = target.src.split('/');
    target.src = `/sprites/${urlParts[urlParts.length - 1]}`;
  } else if (!target.src.includes('0.png')) target.src = 'https://play.pokemonshowdown.com/sprites/0.png';
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
  cleanName = cleanName.replace(/^-+|-+$/g, '');
  return `https://play.pokemonshowdown.com/sprites/itemicons/${cleanName}.png`;
};

// --- TRADUCTOR Y BUSCADOR INTELIGENTE DE HABILIDADES ---
const checkAbility = (abilityIdStr: string, abilityObj: any, enName: string, esName: string) => {
  if (!abilityIdStr && !abilityObj) return false;
  const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "");
  const combined = `${abilityIdStr} ${abilityObj?.name || ''} ${abilityObj?.id || ''}`;
  const nCombined = normalize(combined);
  return nCombined.includes(normalize(enName)) || nCombined.includes(normalize(esName));
};

const calcHP = (base: number, evs: number) => Math.floor(((2 * base + 31) * 50) / 100) + 50 + 10 + evs;
const calcStat = (base: number, evs: number, nature: number) => Math.floor((Math.floor(((2 * base + 31) * 50) / 100) + 5 + evs) * nature);

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

const pokeRound = (n: number) => Math.floor(n);

const calculateDamageRolls = (level: number, power: number, attackStat: number, defenseStat: number, mods: any) => {
  if (power === 0) return Array(16).fill(0);
  let baseDmg = Math.floor(Math.floor((Math.floor((2 * level) / 5 + 2) * power * attackStat) / defenseStat) / 50) + 2;
  
  if (mods.spreadMod && mods.spreadMod !== 1) baseDmg = pokeRound(baseDmg * mods.spreadMod);
  if (mods.weatherMod && mods.weatherMod !== 1) baseDmg = pokeRound(baseDmg * mods.weatherMod);
  if (mods.critMod && mods.critMod !== 1) baseDmg = pokeRound(baseDmg * mods.critMod);
  
  return Array.from({ length: 16 }, (_, i) => {
    let d = Math.floor((baseDmg * (85 + i)) / 100);
    if (mods.stab && mods.stab !== 1) d = pokeRound(d * mods.stab);
    if (mods.eff && mods.eff !== 1) d = Math.floor(d * mods.eff);
    if (mods.burnMod && mods.burnMod !== 1) d = Math.floor(d * mods.burnMod);
    
    const otherMods = (mods.itemMod || 1) * (mods.defenderItemMod || 1) * (mods.terrainMod || 1) * (mods.screenMod || 1) * (mods.hhMod || 1) * (mods.fgMod || 1) * (mods.atkAbilityMod || 1) * (mods.defAbilityMod || 1) * (mods.protectMod || 1);
    if (otherMods !== 1) d = pokeRound(d * otherMods);
    
    return Math.max(1, d);
  });
};

// --- NUEVO COMPONENTE: INPUT DE EVs INTERACTIVO ---
const EvInput = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => {
  const [val, setVal] = useState(value.toString());
  
  useEffect(() => {
    setVal(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed)) {
      onChange(Math.min(32, Math.max(0, parsed)));
    }
  };

  const handleBlur = () => {
    let parsed = parseInt(val, 10);
    if (isNaN(parsed) || parsed < 0) parsed = 0;
    if (parsed > 32) parsed = 32;
    setVal(parsed.toString());
    onChange(parsed);
  };

  return (
    <input
      type="number"
      min="0"
      max="32"
      value={val}
      onChange={handleChange}
      onBlur={handleBlur}
      className="w-8 text-[10px] text-center font-bold bg-slate-800 border border-slate-600 rounded text-white focus:border-rose-400 focus:bg-slate-700 outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  );
};

const NatureSelect = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => (
  <div className="flex items-center bg-slate-800 rounded border border-slate-600 overflow-hidden shrink-0">
    <button onClick={() => onChange(1.1)} className={`w-6 py-0.5 text-[10px] font-black transition-colors ${value > 1.0 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`} title="Beneficial Nature (+10%)">+</button>
    <button onClick={() => onChange(1.0)} className={`w-6 py-0.5 text-[10px] font-black transition-colors border-l border-r border-slate-700 ${value === 1.0 ? 'bg-slate-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`} title="Neutral Nature">...</button>
    <button onClick={() => onChange(0.9)} className={`w-6 py-0.5 text-[10px] font-black transition-colors ${value < 1.0 ? 'bg-rose-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`} title="Hindering Nature (-10%)">-</button>
  </div>
);

// --- COMPONENTE: SELECTOR DE BUILDS CON BUSCADOR ---
const BuildSelector = ({ selectedId, onSelect, builds }: { selectedId: string, onSelect: (id: string) => void, builds: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedBuild = builds.find(b => b.id === selectedId) || builds[0];
  const filteredOptions = builds.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 flex justify-between items-center cursor-pointer hover:border-emerald-500 text-sm font-bold text-white transition-colors" onClick={() => setIsOpen(!isOpen)}>
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
              <div key={build.id} className="px-3 py-2 hover:bg-emerald-600 cursor-pointer text-xs text-white border-b border-slate-700/50 last:border-0" onClick={() => { onSelect(build.id); setIsOpen(false); setSearch(''); }}>
                {build.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- SELECTORES ALFABÉTICOS ---
const PokemonSelector = ({ selectedId, onSelect }: { selectedId: string, onSelect: (id: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false); const [search, setSearch] = useState(''); const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const selectedPoke = selectedId ? POKEDEX[selectedId] : null;
  const sortedOptions = useMemo(() => CHAMPIONS_ROSTER.filter(id => POKEDEX[id] && id !== 'aegislashblade' && id !== 'palafinhero').sort((a, b) => POKEDEX[a].name.localeCompare(POKEDEX[b].name)), []);
  const filteredOptions = sortedOptions.filter(id => POKEDEX[id].name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 flex justify-between items-center cursor-pointer hover:border-rose-500 text-sm font-bold text-white" onClick={() => setIsOpen(!isOpen)}>
        <span className="truncate">{selectedPoke ? selectedPoke.name : 'Select Species...'}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-[100] overflow-hidden">
          <div className="p-2 border-b border-slate-700 flex items-center gap-2 bg-slate-900"><Search size={14} className="text-slate-400" /><input type="text" autoFocus placeholder="Search..." className="bg-transparent w-full outline-none text-white text-xs" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.map(id => <div key={id} className="px-3 py-2 hover:bg-rose-600 cursor-pointer text-xs text-white" onClick={() => { onSelect(id); setIsOpen(false); setSearch(''); }}>{POKEDEX[id].name}</div>)}
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

const MoveSelector = ({ selectedMoveId, onSelect, learnset }: { selectedMoveId: string | null, onSelect: (id: string) => void, learnset: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const selectedMove = selectedMoveId ? MOVES_DB[selectedMoveId] : null;
  const filteredMoves = learnset.map(id => MOVES_DB[id]).filter(m => m && m.name.toLowerCase().includes(search.toLowerCase()));
  
  return (
    <div className="relative" ref={wrapperRef}>
      <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 flex justify-between items-center cursor-pointer hover:border-rose-500 text-sm" onClick={() => setIsOpen(!isOpen)}>
        {selectedMove ? (
          <div className="flex items-center gap-2 overflow-hidden w-full">
            <img src={`/sprites/${selectedMove.type.toLowerCase()}.png`} alt={selectedMove.type} className="h-4 object-contain shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} title={selectedMove.type} />
            <span className="text-white font-bold truncate flex-1">{selectedMove.name}</span>
            <img src={`/sprites/${selectedMove.category.toLowerCase()}.png`} alt={selectedMove.category} className="h-4 object-contain shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} title={selectedMove.category} />
          </div>
        ) : (
          <span className="text-slate-500">Empty</span>
        )}
        <ChevronDown size={14} className="text-slate-400 shrink-0 ml-2" />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-[100] overflow-hidden">
          <div className="p-2 border-b border-slate-700 flex items-center gap-2 bg-slate-900"><Search size={14} className="text-slate-400" /><input type="text" autoFocus placeholder="Search move..." className="bg-transparent w-full outline-none text-white text-xs" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="max-h-48 overflow-y-auto">
            <div className="px-3 py-2 hover:bg-rose-600 cursor-pointer text-xs text-slate-400" onClick={() => { onSelect(''); setIsOpen(false); }}>-- Remove --</div>
            {filteredMoves.map(move => (
              <div key={move.id} className="px-3 py-2 hover:bg-rose-600 cursor-pointer flex justify-between items-center text-xs gap-2" onClick={() => { onSelect(move.id); setIsOpen(false); setSearch(''); }}>
                <div className="flex items-center gap-2 overflow-hidden">
                  <img src={`/sprites/${move.type.toLowerCase()}.png`} alt={move.type} className="h-4 object-contain shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  <span className="text-white truncate">{move.name}</span>
                </div>
                <img src={`/sprites/${move.category.toLowerCase()}.png`} alt={move.category} className="h-4 object-contain shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function AttackMode({ weather, terrain, setWeather, setTerrain }: { weather?: Weather, terrain?: Terrain, setWeather?: (w: Weather) => void, setTerrain?: (t: Terrain) => void }) {
  const [userSpeciesId, setUserSpeciesId] = useLocalStorage('atk-user-species', 'dragapult');
  const userPokemon = POKEDEX[userSpeciesId] || POKEDEX['dragapult'];
  const [userAbilityId, setUserAbilityId] = useLocalStorage('atk-user-ability', userPokemon.abilities[0] || 'No Ability');
  const [userItemId, setUserItemId] = useLocalStorage('atk-user-item', 'None'); 
  const [atkEvs, setAtkEvs] = useLocalStorage('atk-user-atkevs', 0);
  const [spaEvs, setSpaEvs] = useLocalStorage('atk-user-spaevs', 0);
  const [atkNature, setAtkNature] = useLocalStorage('atk-user-atknature', 1.0);
  const [spaNature, setSpaNature] = useLocalStorage('atk-user-spanature', 1.0);
  const [userMoves, setUserMoves] = useLocalStorage<string[]>('atk-user-moves', ['', '', '', '']);
  const [isBurned, setIsBurned] = useLocalStorage('atk-user-burn', false);
  const [isDoubles, setIsDoubles] = useLocalStorage('atk-user-doubles', false);
  
  const [rivalBuildId, setRivalBuildId] = useLocalStorage('atk-rival-build', VGC_BUILDS[0].id);
  const [rivalProtect, setRivalProtect] = useLocalStorage('atk-rival-protect', false);

  const [rivalSpeciesOverride, setRivalSpeciesOverride] = useState<string | null>(null);
  const [rivalAbilityOverride, setRivalAbilityOverride] = useState<string | null>(null);
  
  const [crits, setCrits] = useState<boolean[]>([false, false, false, false]);
  const [hitsSelected, setHitsSelected] = useState<number[]>([0, 0, 0, 0]);

  const userAbility = ABILITIES_DB[userAbilityId] || ABILITIES_DB['No Ability'];
  const userItem = ITEMS_DB[userItemId] || ITEMS_DB['None'];
  const transformData = getTransformData(userSpeciesId, userItemId);

  // Derivamos la habilidad del rival directamente de la Build
  const activeBuild = useMemo(() => VGC_BUILDS.find(b => b.id === rivalBuildId) || VGC_BUILDS[0], [rivalBuildId]);
  
  const rivalPokemon = POKEDEX[rivalSpeciesOverride || activeBuild.speciesId] || POKEDEX['garchomp'];
  
  const rivalAbilityId = rivalAbilityOverride || activeBuild.abilityId;
  // EL TRUCO: Si no lo encuentra en la base de datos, crea un objeto falso con el nombre que escribimos
  const rivalAbility = ABILITIES_DB[rivalAbilityId] || { name: rivalAbilityId }; 
  const rivalItem = ITEMS_DB[activeBuild.itemId] || { name: activeBuild.itemId };

  const handleSpeciesChange = (newSpeciesId: string) => {
    setUserSpeciesId(newSpeciesId);
    setUserAbilityId(POKEDEX[newSpeciesId]?.abilities[0] || 'No Ability');
    
    // Reseteos al cambiar de Pokémon
    setAtkEvs(0);
    setSpaEvs(0);
    setAtkNature(1.0);
    setSpaNature(1.0);
    setUserMoves(['', '', '', '']);
    
    const megaItem = autoEquipMegaItem(newSpeciesId);
    if (megaItem) setUserItemId(megaItem);
    else setUserItemId('None');
  };


  const handleRivalChange = (newBuildId: string) => {
    setRivalBuildId(newBuildId);
    setRivalSpeciesOverride(null);
    setRivalAbilityOverride(null);
  };

  const handleReset = () => {
    setUserSpeciesId('dragapult'); setUserAbilityId(POKEDEX['dragapult'].abilities[0] || 'No Ability'); setUserItemId('None');
    setAtkEvs(0); setSpaEvs(0); setAtkNature(1.0); setSpaNature(1.0);
    setUserMoves(['', '', '', '']); setIsBurned(false); setIsDoubles(false); 
    setRivalBuildId(VGC_BUILDS[0].id); setRivalProtect(false);
    setCrits([false, false, false, false]);
    setHitsSelected([0, 0, 0, 0]);
    setWeather?.('None'); setTerrain?.('None');
  };

  // --- STATS DEL ATACANTE (TÚ) Y BOOST BOLALUZ ---
  const isLightBall = userItem && userItem.name ? userItem.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === 'lightball' : false;
  const itemAtkMod = isLightBall ? (userPokemon.id.includes('pikachu') ? 2 : 1) : (userItem.atkMod || 1);
  const itemSpaMod = isLightBall ? (userPokemon.id.includes('pikachu') ? 2 : 1) : (userItem.spaMod || 1);

  const baseAtkStat = useMemo(() => calcStat(userPokemon.baseStats.atk, atkEvs, atkNature), [userPokemon, atkEvs, atkNature]);
  const baseSpaStat = useMemo(() => calcStat(userPokemon.baseStats.spa, spaEvs, spaNature), [userPokemon, spaEvs, spaNature]);
  const baseUserDefStat = useMemo(() => calcStat(userPokemon.baseStats.def, 0, 1.0), [userPokemon]); 
  
  const finalAtkStat = Math.floor(baseAtkStat * itemAtkMod);
  const finalSpaStat = Math.floor(baseSpaStat * itemSpaMod);
  const finalUserDefStat = Math.floor(baseUserDefStat * (userItem.defMod || 1));

  // --- STATS DEL DEFENSOR (RIVAL) ---
  const rivalHp = useMemo(() => calcHP(rivalPokemon.baseStats.hp, activeBuild.defaultEvs.hp || 0), [rivalPokemon, activeBuild]);
  const baseRivalDef = useMemo(() => calcStat(rivalPokemon.baseStats.def, activeBuild.defaultEvs.def || 0, activeBuild.defaultNature?.def || 1.0), [rivalPokemon, activeBuild]);
  const baseRivalSpd = useMemo(() => calcStat(rivalPokemon.baseStats.spd, activeBuild.defaultEvs.spd || 0, activeBuild.defaultNature?.spd || 1.0), [rivalPokemon, activeBuild]);
  const baseRivalAtk = useMemo(() => calcStat(rivalPokemon.baseStats.atk, 0, 1.0), [rivalPokemon]); 

  // --- MEGA SOL BYPASS EN DEFENSA ---
  const attackerHasMegaSol = checkAbility(userAbilityId, userAbility, 'Mega Sol', 'Mega Sol');
  const activeWeather = attackerHasMegaSol ? 'Sun' : weather;

  let finalRivalDef = baseRivalDef; let finalRivalSpd = baseRivalSpd;
  if (!attackerHasMegaSol) {
    if (weather === 'Snow' && rivalPokemon.types.includes('Ice')) finalRivalDef = Math.floor(finalRivalDef * 1.5);
    if (weather === 'Sand' && rivalPokemon.types.includes('Rock')) finalRivalSpd = Math.floor(finalRivalSpd * 1.5);
  }
  if (checkAbility(activeBuild.abilityId, rivalAbility, 'Marvel Scale', 'Escama Especial')) finalRivalDef = Math.floor(finalRivalDef * 1.5); 

  // --- AURA FEÉRICA ---
  const isFairyAuraOnField = checkAbility(userAbilityId, userAbility, 'Fairy Aura', 'Aura Feerica') || checkAbility(activeBuild.abilityId, rivalAbility, 'Fairy Aura', 'Aura Feerica');

  return (
    <div className="max-w-7xl mx-auto p-4 grid xl:grid-cols-3 gap-6">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 col-span-1 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-slate-700 pb-2">
          <div className="flex items-center gap-2 text-rose-400"><Crosshair size={20} /><h3 className="font-bold text-lg">Attacker (You)</h3></div>
          <button onClick={handleReset} title="Reset" className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:bg-rose-600 transition-colors"><RotateCcw size={14}/></button>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-20 h-20 flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-700 shadow-inner overflow-hidden">
              <img src={getSpriteUrl(userSpeciesId)} alt={userPokemon.name} className="max-h-16 object-contain" onError={handleSpriteError} />
            </div>
            <div className="flex gap-1">{userPokemon.types.map(t => <span key={t} className={`${TYPE_COLORS[t]} text-white text-[8px] font-black px-1 rounded uppercase border border-black/10`}>{t.substring(0,3)}</span>)}</div>
          </div>
          <div className="flex-1 flex flex-col justify-start">
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
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm mb-1 text-slate-400 flex items-center gap-1"><Sparkles size={14}/> Ability</label>
            <select value={userAbilityId} onChange={(e) => setUserAbilityId(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 outline-none text-rose-300">
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
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Moves</label>
            <div className="flex gap-2">
              <button onClick={() => setIsBurned(!isBurned)} className={`px-2 py-0.5 rounded text-[10px] border font-bold uppercase ${isBurned ? 'bg-orange-600 border-orange-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>Burn</button>
              <button onClick={() => setIsDoubles(!isDoubles)} className={`px-2 py-0.5 rounded text-[10px] border flex items-center gap-1 ${isDoubles ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}><Users size={12}/> Double Target</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">{[0, 1, 2, 3].map(i => <MoveSelector key={i} selectedMoveId={userMoves[i]} learnset={userPokemon.learnset} onSelect={(id) => { const nm = [...userMoves]; nm[i] = id; setUserMoves(nm); }} />)}</div>
        </div>
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-rose-400 flex items-center gap-1"><Swords size={16}/> Physical Atk</span>
              <div className="flex gap-2 items-center">
                <NatureSelect value={atkNature} onChange={setAtkNature} />
                <span className="text-xl font-mono text-white flex items-center gap-1">{finalAtkStat}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-slate-400 font-bold">EVs:</span>
              <input type="range" min="0" max="32" value={atkEvs} onChange={(e) => setAtkEvs(Number(e.target.value))} className="flex-1 accent-rose-500 rounded-full h-1.5 appearance-none cursor-pointer" style={getSliderStyle(atkEvs, 'rgba(244, 63, 94, 0.4)')} />
              <EvInput value={atkEvs} onChange={setAtkEvs} />
            </div>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-purple-400 flex items-center gap-1"><Swords size={16}/> Special Atk</span>
              <div className="flex gap-2 items-center">
                <NatureSelect value={spaNature} onChange={setSpaNature} />
                <span className="text-xl font-mono text-white flex items-center gap-1">{finalSpaStat}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-slate-400 font-bold">EVs:</span>
              <input type="range" min="0" max="32" value={spaEvs} onChange={(e) => setSpaEvs(Number(e.target.value))} className="flex-1 accent-purple-500 rounded-full h-1.5 appearance-none cursor-pointer" style={getSliderStyle(spaEvs, 'rgba(168, 85, 247, 0.4)')} />
              <EvInput value={spaEvs} onChange={setSpaEvs} />
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-1 xl:col-span-2 space-y-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-4">
            <div className="flex items-center gap-2 text-emerald-400"><Shield size={20} /><h3 className="font-bold text-lg">Defender (Rival)</h3></div>
            <button onClick={() => setRivalProtect(!rivalProtect)} className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-colors border ${rivalProtect ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-600 text-slate-500 hover:bg-slate-700'}`}>
              <ShieldAlert size={14}/> Protect
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mb-4 items-start">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="w-20 h-20 flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-700 shadow-inner overflow-hidden">
                <img src={getSpriteUrl(rivalPokemon.id)} alt={rivalPokemon.name} className="max-h-16 object-contain" onError={handleSpriteError} />
              </div>
              <div className="flex gap-1">{rivalPokemon.types.map(t => <span key={t} className={`${TYPE_COLORS[t]} text-white text-[8px] font-black px-1 rounded uppercase border border-black/10`}>{t.substring(0,3)}</span>)}</div>
            </div>
            
            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block text-sm mb-1 text-slate-400">Rival Build</label>
                <BuildSelector selectedId={rivalBuildId} onSelect={handleRivalChange} builds={VGC_BUILDS} />
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

              {/* CAJAS ESTÁTICAS DE HABILIDAD Y OBJETO DE LA BUILD */}
              <div className="flex gap-2">
                <div className="p-2 flex-1 bg-slate-900/80 rounded border border-yellow-900/50 text-xs text-yellow-300 flex items-center gap-2">
                  <Sparkles size={14} className="shrink-0" />
                  <span className="truncate font-bold">{rivalAbility.name || 'No Ability'}</span>
                </div>
                <div className="p-2 flex-1 bg-slate-900/80 rounded border border-emerald-900/50 text-xs text-emerald-300 flex items-center gap-2">
                  <img src={getItemSpriteUrl(rivalItem.name)} alt="" className="w-4 h-4 object-contain flex-shrink-0" onError={handleIconError} />
                  <span className="truncate font-bold">{rivalItem.name || 'No Item'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-700 text-center">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Max HP</span>
              <div className="text-lg font-mono text-white">{rivalHp}</div>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-700 text-center">
              <span className="text-[10px] font-bold text-orange-400 uppercase flex justify-center items-center gap-1">
                Defense
                {activeBuild.defaultNature?.def === 1.1 && <span className="text-rose-400 font-black text-xs">+</span>}
                {activeBuild.defaultNature?.def === 0.9 && <span className="text-blue-400 font-black text-xs">-</span>}
              </span>
              <div className="text-lg font-mono text-white">{finalRivalDef}</div>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-700 text-center">
              <span className="text-[10px] font-bold text-indigo-400 uppercase flex justify-center items-center gap-1">
                Sp. Def
                {activeBuild.defaultNature?.spd === 1.1 && <span className="text-rose-400 font-black text-xs">+</span>}
                {activeBuild.defaultNature?.spd === 0.9 && <span className="text-blue-400 font-black text-xs">-</span>}
              </span>
              <div className="text-lg font-mono text-white">{finalRivalSpd}</div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {userMoves.map((moveId, idx) => {
            const move = MOVES_DB[moveId]; 
            if (!move) return <div key={idx} className="rounded-xl border border-dashed border-slate-700 bg-slate-800/30 flex items-center justify-center p-8 text-slate-500 text-xs">Empty</div>;
            
            const isCrit = crits[idx];

            let atkStatUsed = move.overrideOffensiveStat === 'def' 
              ? finalUserDefStat 
              : (move.useTargetAttack ? baseRivalAtk : (move.category === 'Physical' ? finalAtkStat : finalSpaStat));
              
            let defStatUsed = (move.category === 'Physical' || move.overrideDefensiveStat === 'def') 
              ? finalRivalDef 
              : finalRivalSpd;

            // --- PROTECT & BYPASS LOGIC (25% DAMAGE REDUCTION) ---
            let isProtected = false;
            let protectMod = 1;
            let isPartiallyProtected = false;
            
            if (rivalProtect && move.category !== 'Status') {
              const hasUnseenFist = checkAbility(userAbilityId, userAbility, 'Unseen Fist', 'Puño Invisible');
              const hasPiercingDrill = checkAbility(userAbilityId, userAbility, 'Piercing Drill', 'Taladro Perforador');
              
              if ((hasUnseenFist || hasPiercingDrill) && move.flags?.includes('contact')) {
                protectMod = 0.25;
                isPartiallyProtected = true;
              } else {
                isProtected = true;
              }
            }

            // --- MÚLTIPLES GOLPES Y SELECTOR ---
            let minHits = 1; let maxHits = 1; let isMulti = false;
            let availableHits: number[] = [];

            if (move.flags?.includes('multihit')) {
              isMulti = true;
              if (checkAbility(userAbilityId, userAbility, 'Skill Link', 'Encadenar')) {
                availableHits = [5];
              } else {
                if (['doublekick', 'doublehit', 'dualwingbeat', 'dragondarts', 'bonemerang', 'geargrind', 'dualchop', 'twinbeam'].includes(move.id)) availableHits = [2];
                else if (['surgingstrikes', 'tripleaxel', 'triplekick'].includes(move.id)) availableHits = [3];
                else if (move.id === 'populationbomb') availableHits = [1,2,3,4,5,6,7,8,9,10];
                else availableHits = [2, 3, 4, 5];
              }
            } else if (checkAbility(userAbilityId, userAbility, 'Parental Bond', 'Amor Filial')) {
              availableHits = [1.25];
              isMulti = true;
            }

            if (availableHits.length > 0) {
              const selectedHits = hitsSelected[idx] || 0;
              if (selectedHits > 0 && availableHits.includes(selectedHits)) {
                minHits = selectedHits; maxHits = selectedHits;
              } else {
                minHits = availableHits[0]; maxHits = availableHits[availableHits.length - 1];
              }
            }

            // --- CÁLCULO DE PESO DINÁMICO ---
            const getWeight = (poke: any, abilId: string, ability: any, item: any) => {
              let w = poke.weightkg || 50;
              if (checkAbility(abilId, ability, 'Heavy Metal', 'Metal Pesado')) w *= 2;
              if (checkAbility(abilId, ability, 'Light Metal', 'Metal Liviano')) w *= 0.5;
              if (item.id === 'Float Stone' || item.name === 'Piedra Pómez') w *= 0.5;
              return w;
            };

            const attackerWeight = getWeight(userPokemon, userAbilityId, userAbility, userItem);
            const defenderWeight = getWeight(rivalPokemon, activeBuild.abilityId, rivalAbility, rivalItem);
            
            let dynamicPower = move.power;
            let moveType = move.type;

            // WEATHER BALL LOGIC
            if (move.id === 'weatherball') {
              if (activeWeather === 'Sun') { moveType = 'Fire'; dynamicPower = 100; }
              else if (activeWeather === 'Rain') { moveType = 'Water'; dynamicPower = 100; }
              else if (activeWeather === 'Sand') { moveType = 'Rock'; dynamicPower = 100; }
              else if (activeWeather === 'Snow') { moveType = 'Ice'; dynamicPower = 100; }
            }

            if (move.id === 'heavyslam' || move.id === 'heatcrash') {
              const r = defenderWeight / attackerWeight;
              dynamicPower = r <= 0.2 ? 120 : r <= 0.25 ? 100 : r <= 0.33 ? 80 : r <= 0.5 ? 60 : 40;
            }
            if (move.id === 'lowkick' || move.id === 'grassknot') {
              const w = defenderWeight;
              dynamicPower = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
            }

            // ACROBATICS LOGIC
            if (move.id === 'acrobatics') {
              if (!userItemId || userItemId === 'None' || userItemId === 'No Item') {
                dynamicPower *= 2;
              }
            }

            // --- CAMBIO DE TIPO DEL ATAQUE ---
            let typeAbilityMod = 1;
            if (moveType === 'Normal') {
              if (checkAbility(userAbilityId, userAbility, 'Pixilate', 'Piel Feerica')) { moveType = 'Fairy'; typeAbilityMod = 1.3; }
              else if (checkAbility(userAbilityId, userAbility, 'Aerilate', 'Piel Celeste')) { moveType = 'Flying'; typeAbilityMod = 1.3; }
              else if (checkAbility(userAbilityId, userAbility, 'Refrigerate', 'Piel Helada')) { moveType = 'Ice'; typeAbilityMod = 1.3; }
              else if (checkAbility(userAbilityId, userAbility, 'Dragonize', 'Dragonize')) { moveType = 'Dragon'; typeAbilityMod = 1.2; }
            }
            if (move.flags?.includes('sound') && checkAbility(userAbilityId, userAbility, 'Liquid Voice', 'Voz Liquida')) moveType = 'Water';

            let stab = (userPokemon.types.includes(moveType) || checkAbility(userAbilityId, userAbility, 'Protean', 'Mutatipo')) ? 1.5 : 1;
            if (stab > 1 && checkAbility(userAbilityId, userAbility, 'Adaptability', 'Adaptable')) stab = 2;

            let eff = getEffectiveness(moveType, rivalPokemon.types);
            if (move.isFreezeDry && rivalPokemon.types.includes('Water')) eff *= 4; 

            if (checkAbility(userAbilityId, userAbility, 'Scrappy', 'Intrepido') && (moveType === 'Normal' || moveType === 'Fighting')) {
              eff = getEffectiveness(moveType, rivalPokemon.types.filter((t: string) => t !== 'Ghost'));
            }

            if (moveType === 'Ground' && (checkAbility(activeBuild.abilityId, rivalAbility, 'Levitate', 'Levitacion') || checkAbility(activeBuild.abilityId, rivalAbility, 'Earth Eater', 'Geofagia'))) eff = 0;
            if (moveType === 'Water' && (checkAbility(activeBuild.abilityId, rivalAbility, 'Water Absorb', 'Absorbe Agua') || checkAbility(activeBuild.abilityId, rivalAbility, 'Storm Drain', 'Colector'))) eff = 0;
            if (moveType === 'Electric' && (checkAbility(activeBuild.abilityId, rivalAbility, 'Volt Absorb', 'Absorbe Elec') || checkAbility(activeBuild.abilityId, rivalAbility, 'Motor Drive', 'Electromotor') || checkAbility(activeBuild.abilityId, rivalAbility, 'Lightning Rod', 'Pararrayos'))) eff = 0;
            if (moveType === 'Fire' && checkAbility(activeBuild.abilityId, rivalAbility, 'Flash Fire', 'Absorbe Fuego')) eff = 0;
            if (moveType === 'Grass' && checkAbility(activeBuild.abilityId, rivalAbility, 'Sap Sipper', 'Herbivoro')) eff = 0;
            if (move.flags?.includes('sound') && checkAbility(activeBuild.abilityId, rivalAbility, 'Soundproof', 'Insonorizar')) eff = 0;
            if (move.flags?.includes('bullet') && checkAbility(activeBuild.abilityId, rivalAbility, 'Bulletproof', 'Antibalas')) eff = 0;

            if (isProtected) eff = 0;

            let atkAbilityMod = 1;
            if (move.category === 'Physical' && checkAbility(userAbilityId, userAbility, 'Huge Power', 'Potencia')) atkAbilityMod *= 2;
            if (move.category === 'Physical' && checkAbility(userAbilityId, userAbility, 'Pure Power', 'Energia Pura')) atkAbilityMod *= 2;
            if (move.category === 'Physical' && checkAbility(userAbilityId, userAbility, 'Guts', 'Agallas') && isBurned) atkAbilityMod *= 1.5;
            if (move.category === 'Special' && checkAbility(userAbilityId, userAbility, 'Solar Power', 'Poder Solar') && activeWeather === 'Sun') atkAbilityMod *= 1.5;
            if (checkAbility(userAbilityId, userAbility, 'Sand Force', 'Poder Arena') && weather === 'Sand' && ['Rock', 'Ground', 'Steel'].includes(moveType)) atkAbilityMod *= 1.3;
            if (checkAbility(userAbilityId, userAbility, 'Tough Claws', 'Garra Dura') && move.flags?.includes('contact')) atkAbilityMod *= 1.33;
            if (checkAbility(userAbilityId, userAbility, 'Iron Fist', 'Puno Ferreo') && move.flags?.includes('punch')) atkAbilityMod *= 1.2;
            if (checkAbility(userAbilityId, userAbility, 'Reckless', 'Audaz') && move.flags?.includes('recoil')) atkAbilityMod *= 1.2;
            if (checkAbility(userAbilityId, userAbility, 'Sharpness', 'Cortante') && move.flags?.includes('slicing')) atkAbilityMod *= 1.5;
            if (checkAbility(userAbilityId, userAbility, 'Mega Launcher', 'Megadisparador') && move.flags?.includes('pulse')) atkAbilityMod *= 1.5;
            if (checkAbility(userAbilityId, userAbility, 'Strong Jaw', 'Mandibula Fuerte') && move.flags?.includes('bite')) atkAbilityMod *= 1.5;
            if (checkAbility(userAbilityId, userAbility, 'Technician', 'Experto') && dynamicPower <= 60) atkAbilityMod *= 1.5;
            if (checkAbility(userAbilityId, userAbility, 'Water Bubble', 'Pompa') && moveType === 'Water') atkAbilityMod *= 2;
            if (checkAbility(userAbilityId, userAbility, 'Sheer Force', 'Potencia Bruta') && move.flags?.includes('secondary')) atkAbilityMod *= 1.3;
            
            // AURA FEÉRICA
            if (moveType === 'Fairy' && isFairyAuraOnField) atkAbilityMod *= 1.333;
            atkAbilityMod *= typeAbilityMod;

            let defAbilityMod = 1;
            if (checkAbility(activeBuild.abilityId, rivalAbility, 'Thick Fat', 'Sebo') && ['Fire', 'Ice'].includes(moveType)) defAbilityMod *= 0.5;
            if (checkAbility(activeBuild.abilityId, rivalAbility, 'Fur Coat', 'Pelaje Recio') && move.category === 'Physical') defAbilityMod *= 0.5;
            if (checkAbility(activeBuild.abilityId, rivalAbility, 'Water Bubble', 'Pompa') && moveType === 'Fire') defAbilityMod *= 0.5;
            if (checkAbility(activeBuild.abilityId, rivalAbility, 'Fluffy', 'Peluche')) {
              if (move.flags?.includes('contact')) defAbilityMod *= 0.5;
              if (moveType === 'Fire') defAbilityMod *= 2;
            }
            if (checkAbility(activeBuild.abilityId, rivalAbility, 'Multiscale', 'Compensacion')) defAbilityMod *= 0.5;
            if (checkAbility(activeBuild.abilityId, rivalAbility, 'Solid Rock', 'Roca Solida') && eff > 1) defAbilityMod *= 0.75;
            if (checkAbility(activeBuild.abilityId, rivalAbility, 'Filter', 'Filtro') && eff > 1) defAbilityMod *= 0.75;

            let itemBoostToPower = 1;
      let itemMod = userItem.damageMod || 1; 
      const isLightBallAttacker = userItem && userItem.name ? userItem.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === 'lightball' : false;
      if (isLightBallAttacker) itemMod = 1;

      if (userItem.expertBelt && eff > 1) itemMod = 1.2;
      if (userItem.boostType === moveType && userItem.boostMod) {
         itemBoostToPower = userItem.boostMod;
         itemMod = 1;
      } 
      let defenderItemMod = 1;
      if (rivalItem.resistType === moveType && eff > 1) defenderItemMod = rivalItem.resistMod || 0.5; 

      let weatherMod = 1;
      if (activeWeather === 'Sun') { if (moveType === 'Fire') weatherMod = 1.5; if (moveType === 'Water') weatherMod = 0.5; } 
      else if (activeWeather === 'Rain') { if (moveType === 'Water') weatherMod = 1.5; if (moveType === 'Fire') weatherMod = 0.5; }

      let terrainMod = 1; 
      const isAttackerGrounded = !userPokemon.types.includes('Flying') && !checkAbility(userAbilityId, userAbility, 'Levitate', 'Levitacion') && userItem.id !== 'airballoon';
      const isDefenderGrounded = !rivalPokemon.types.includes('Flying') && !checkAbility(activeBuild.abilityId, rivalAbility, 'Levitate', 'Levitacion') && rivalItem.id !== 'airballoon';

      if (terrain === 'Electric' && isAttackerGrounded && moveType === 'Electric') terrainMod *= 1.3;
      if (terrain === 'Grassy' && isAttackerGrounded && moveType === 'Grass') terrainMod *= 1.3;
      if (terrain === 'Psychic' && isAttackerGrounded && moveType === 'Psychic') terrainMod *= 1.3;
      
      if (terrain === 'Grassy' && isDefenderGrounded && ['earthquake', 'bulldoze', 'magnitude'].includes(move.id)) terrainMod *= 0.5;
      if (terrain === 'Misty' && isDefenderGrounded && moveType === 'Dragon') terrainMod *= 0.5;

      const burnMod = (isBurned && move.category === 'Physical' && !userPokemon.types.includes('Fire') && !checkAbility(userAbilityId, userAbility, 'Guts', 'Agallas')) ? 0.5 : 1;
      const spreadMod = (isDoubles && move.isSpread) ? 0.75 : 1;
      const critMod = isCrit ? (checkAbility(userAbilityId, userAbility, 'Sniper', 'Francotirador') ? 2.25 : 1.5) : 1;

      let finalMovePower = dynamicPower;
      if (itemBoostToPower !== 1) finalMovePower = pokeRound(finalMovePower * itemBoostToPower);

      const modsObj = { stab, eff, itemMod, defenderItemMod, weatherMod, terrainMod, burnMod, spreadMod, critMod, atkAbilityMod, defAbilityMod, protectMod };
      const rolls = calculateDamageRolls(50, finalMovePower, atkStatUsed, defStatUsed, modsObj);
      
      const minDamage = rolls[0] * minHits; 
      const maxDamage = rolls[15] * maxHits;
      
      const rawMinPct = finalMovePower === 0 || eff === 0 ? 0 : (minDamage / rivalHp) * 100;
      const rawMaxPct = finalMovePower === 0 || eff === 0 ? 0 : (maxDamage / rivalHp) * 100;

      const displayMin = Number((Math.floor(rawMinPct * 10) / 10).toFixed(1));
      const displayMax = Number((Math.floor(rawMaxPct * 10) / 10).toFixed(1));

      const minPct = Math.min(rawMinPct, 100);
      const maxPct = Math.min(rawMaxPct, 100);

      const isImmune = eff === 0 && !isProtected;
      let koText = '';
            
            if (isProtected) koText = 'Blocked by Protect';
            else if (isImmune) koText = `Immune (${rivalAbility.name || 'x0'})`;
            else if (finalMovePower === 0) koText = 'Status Move';
            else if (minDamage >= rivalHp) koText = 'Guaranteed OHKO';
            else if (maxDamage >= rivalHp) koText = `Possible OHKO${minHits !== maxHits ? ` (${maxHits} hits)` : ''}`;
            else if (minDamage * 2 >= rivalHp) koText = 'Guaranteed 2HKO';
            else if (maxDamage * 2 >= rivalHp) koText = 'Possible 2HKO';
            else koText = '3HKO or more';

            const isDeadly = maxPct >= 100 && !isProtected && !isImmune;

            return (
              <div key={idx} className={`relative overflow-hidden rounded-xl border p-4 transition-all ${isProtected || isImmune ? 'opacity-60 bg-slate-800 border-slate-700/50' : isDeadly ? 'bg-rose-900/10 border-rose-700/50' : 'bg-slate-800 border-slate-700'}`}>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="w-full">
                    
                    {/* LAYOUT DE TIPO - NOMBRE - POTENCIA - CATEGORÍA */}
                    <div className="flex items-center gap-1.5 w-full">
                      <img src={`/sprites/${moveType.toLowerCase()}.png`} alt={moveType} className="h-4 object-contain shrink-0" onError={handleIconError} title={moveType} />
                      <h4 className="font-bold text-sm text-white truncate max-w-[140px]">{move.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-900/50 px-1 rounded border border-slate-700/50 shrink-0" title="Base Power">
                        {finalMovePower > 0 ? finalMovePower : '-'}
                      </span>
                      <img src={`/sprites/${move.category.toLowerCase()}.png`} alt={move.category} className="h-4 object-contain shrink-0" onError={handleIconError} title={move.category} />
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-1">
                      {atkAbilityMod > 1 && <span className="text-[10px] bg-rose-900/50 text-rose-300 px-1 rounded">Abil Atk x{atkAbilityMod.toFixed(2)}</span>}
                      {defAbilityMod < 1 && <span className="text-[10px] bg-emerald-900/50 text-emerald-300 px-1 rounded">Abil Def x{defAbilityMod.toFixed(2)}</span>}
                      {isMulti && !isProtected && <span className="text-[10px] bg-purple-900/50 text-purple-300 px-1 rounded font-bold tracking-wider">Hits: {minHits === maxHits ? maxHits : `${minHits}-${maxHits}`}</span>}
                      {isCrit && !isProtected && checkAbility(userAbilityId, userAbility, 'Sniper', 'Francotirador') && <span className="text-[10px] bg-rose-900/50 text-rose-300 px-1 rounded font-bold">Sniper x2.25</span>}
                      {isCrit && !isProtected && !checkAbility(userAbilityId, userAbility, 'Sniper', 'Francotirador') && <span className="text-[10px] bg-rose-900/50 text-rose-300 px-1 rounded font-bold">Crit x1.5</span>}
                      {isPartiallyProtected && <span className="text-[10px] bg-emerald-900/50 text-emerald-300 px-1 rounded font-bold tracking-wider border border-emerald-500/50">Protect Bypass (25%)</span>}
                    </div>

                    <p className={`text-[10px] font-bold mt-1 ${isProtected || isImmune ? 'text-slate-500' : maxDamage >= rivalHp ? 'text-rose-400' : 'text-yellow-400'}`}>{koText}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5 shrink-0 pl-2">
                    <div className="flex gap-1">
                      {availableHits.length > 1 && !isImmune && !isProtected && finalMovePower > 0 && (
                        <select 
                          value={hitsSelected[idx] || 0} 
                          onChange={(e) => {
                            const newHits = [...hitsSelected];
                            newHits[idx] = Number(e.target.value);
                            setHitsSelected(newHits);
                          }}
                          className="text-[9px] px-1 py-0.5 rounded font-black uppercase transition-colors border bg-slate-800 border-slate-600 text-purple-400 hover:bg-slate-700 outline-none cursor-pointer appearance-none text-center"
                          title="Choose number of hits"
                        >
                          <option value={0}>Auto</option>
                          {availableHits.map(h => <option key={h} value={h}>{h} Hits</option>)}
                        </select>
                      )}
                      {!isImmune && !isProtected && finalMovePower > 0 && (
                        <button 
                          onClick={() => {
                            const newCrits = [...crits];
                            newCrits[idx] = !newCrits[idx];
                            setCrits(newCrits);
                          }}
                          className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase transition-colors border ${isCrit ? 'bg-rose-600/30 border-rose-500 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-slate-800 border-slate-600 text-slate-500 hover:bg-slate-700'}`}
                        >
                          Crit
                        </button>
                      )}
                    </div>
                    <span className={`text-xl font-black tracking-tight ${isProtected || isImmune ? 'text-slate-500' : isDeadly ? 'text-rose-400' : 'text-slate-200'}`}>
                      {finalMovePower === 0 || isImmune || isProtected ? '0%' : `${displayMin}% - ${displayMax}%`}
                    </span>
                  </div>
                </div>

                {!isImmune && !isProtected && finalMovePower > 0 && (
                  <div className="w-full bg-slate-900 rounded-full h-4 overflow-hidden relative z-10 border border-slate-800 shadow-inner">
                    <div className={`absolute left-0 top-0 h-full transition-all duration-700 rounded-full ${isDeadly ? 'bg-rose-500/40' : 'bg-yellow-500/40'}`} style={{ width: `${maxPct}%` }} />
                    <div className={`absolute left-0 top-0 h-full transition-all duration-700 rounded-full ${isDeadly ? 'bg-rose-500' : 'bg-yellow-500'}`} style={{ width: `${minPct}%` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}