import { useState, useRef, useEffect, useMemo } from 'react';
import { Crosshair, Heart, ShieldAlert, Activity, Swords, Search, ChevronDown, Zap, Sun, CloudRain, CloudFog, Snowflake, Leaf, Eye, Cloud, RotateCcw, Users, Sparkles, Package, Download, Upload, FileText, Trash2, Copy, Check } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { POKEDEX } from './data/pokedex';
import { MOVES_DB } from './data/moves';
import { getEffectiveness } from './data/tipos';
import { ITEMS_DB } from './data/items';
import { ABILITIES_DB } from './data/habilidades';
import type { Weather, Terrain } from './App';
import { CHAMPIONS_ROSTER } from './data/lista-champions';

const TYPE_COLORS: Record<string, string> = {
  Normal: 'bg-[#A8A77A]', Fire: 'bg-[#EE8130]', Water: 'bg-[#6390F0]', Electric: 'bg-[#F7D02C]',
  Grass: 'bg-[#7AC74C]', Ice: 'bg-[#96D9D6]', Fighting: 'bg-[#C22E28]', Poison: 'bg-[#A33EA1]',
  Ground: 'bg-[#E2BF65]', Flying: 'bg-[#A98FF3]', Psychic: 'bg-[#F95587]', Bug: 'bg-[#A6B91A]',
  Rock: 'bg-[#B8A038]', Ghost: 'bg-[#735797]', Dragon: 'bg-[#6F35FC]', Dark: 'bg-[#705746]',
  Steel: 'bg-[#B7B7CE]', Fairy: 'bg-[#D685AD]',
};

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
  if (spriteFixes[cleanId]) cleanId = spriteFixes[cleanId];
  else {
    if (cleanId.endsWith('megax')) cleanId = cleanId.replace('megax', '-megax');
    else if (cleanId.endsWith('megay')) cleanId = cleanId.replace('megay', '-megay');
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
  if (target.src.includes('play.pokemonshowdown.com')) {
    const urlParts = target.src.split('/');
    target.src = `/sprites/${urlParts[urlParts.length - 1]}`;
  } else if (target.src.includes('/sprites/') && target.src.includes('-')) {
    target.src = target.src.replace(/-/g, '');
  } else target.style.display = 'none';
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

const calcHP = (base: number, evs: number) => Math.floor(((2 * base + 31) * 50) / 100) + 50 + 10 + evs;
const calcStat = (base: number, evs: number, nature: number) => Math.floor((Math.floor(((2 * base + 31) * 50) / 100) + 5 + evs) * nature);
const getStageMod = (stage: number) => stage === 0 ? 1 : stage > 0 ? (2 + stage) / 2 : 2 / (2 + Math.abs(stage));

const getSliderStyle = (val: number, colorRgba: string) => ({
  background: `linear-gradient(to right, ${colorRgba} ${(val / 32) * 100}%, white ${(val / 32) * 100}%)`
});

const isMegaForm = (speciesId: string) => {
  if (!speciesId) return false;
  if (speciesId === 'yanmega') return false; 
  return speciesId.endsWith('mega') || speciesId.endsWith('megax') || speciesId.endsWith('megay');
};

const autoEquipMegaItem = (newSpeciesId: string) => {
  if (!isMegaForm(newSpeciesId)) return null;
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
    if (POKEDEX[`${speciesId}megax`] && itemId === autoEquipMegaItem(`${speciesId}megax`)) return { target: `${speciesId}megax`, label: 'Mega Evolve X' };
    if (POKEDEX[`${speciesId}megay`] && itemId === autoEquipMegaItem(`${speciesId}megay`)) return { target: `${speciesId}megay`, label: 'Mega Evolve Y' };
    if (POKEDEX[`${speciesId}mega`] && itemId === autoEquipMegaItem(`${speciesId}mega`)) return { target: `${speciesId}mega`, label: 'Mega Evolve' };
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

type StatKey = 'atk' | 'def' | 'spa' | 'spd' | 'spe';
interface PlayerState {
  speciesId: string; abilityId: string; itemId: string; moves: string[]; crits?: boolean[]; hits?: number[]; 
  evs: Record<'hp' | StatKey, number>; nature: Record<StatKey, number>; stages: Record<StatKey, number>;
  isBurned: boolean; isParalyzed: boolean; hasTailwind: boolean; hasReflect: boolean;
  hasLightScreen: boolean; hasAuroraVeil: boolean; hasHelpingHand: boolean; hasFriendGuard: boolean;
  hasProtect: boolean; 
}

const createDefaultPlayer = (speciesId: string): PlayerState => ({
  speciesId, abilityId: POKEDEX[speciesId]?.abilities[0] || 'No Ability', itemId: 'None',
  moves: ['', '', '', ''], crits: [false, false, false, false], hits: [0, 0, 0, 0],
  evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  nature: { atk: 1.0, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.0 },
  stages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  isBurned: false, isParalyzed: false, hasTailwind: false, hasReflect: false,
  hasLightScreen: false, hasAuroraVeil: false, hasHelpingHand: false, hasFriendGuard: false,
  hasProtect: false 
});

// --- COMPONENTES UI BÁSICOS ---
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

const AbilitySelector = ({ selectedId, onSelect, abilities, colorClass = "text-yellow-300 hover:border-yellow-500" }: { selectedId: string, onSelect: (id: string) => void, abilities: string[], colorClass?: string }) => {
  const [isOpen, setIsOpen] = useState(false); const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const abilityName = ABILITIES_DB[selectedId]?.name || selectedId;

  return (
    <div className="relative" ref={wrapperRef}>
      <div className={`w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 flex justify-between items-center cursor-pointer transition-all ${colorClass}`} onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-1.5 overflow-hidden flex-1">
          <Sparkles size={14} className="shrink-0" />
          <span className="truncate text-[11px] font-bold leading-tight">{abilityName}</span>
        </div>
        <ChevronDown size={12} className="text-slate-400 shrink-0 ml-1" />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-[100] overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            {abilities.map(ab => (
              <div key={ab} className="px-3 py-2 hover:bg-slate-600 cursor-pointer text-[11px] text-white flex items-center gap-2" onClick={() => { onSelect(ab); setIsOpen(false); }}>
                <Sparkles size={12} className="shrink-0 text-yellow-400" />
                <span className="truncate">{ABILITIES_DB[ab]?.name || ab}</span>
              </div>
            ))}
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
  const [isOpen, setIsOpen] = useState(false); const [search, setSearch] = useState(''); const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const selectedMove = selectedMoveId ? MOVES_DB[selectedMoveId] : null;
  const filteredMoves = learnset.map(id => MOVES_DB[id]).filter(m => m && m.name.toLowerCase().includes(search.toLowerCase()));
  
  return (
    <div className="relative" ref={wrapperRef}>
      <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 flex justify-between items-center cursor-pointer hover:border-blue-500 text-sm" onClick={() => setIsOpen(!isOpen)}>
        {selectedMove ? (
          <div className="flex items-center gap-2 overflow-hidden w-full">
            <img src={`/sprites/${selectedMove.type.toLowerCase()}.png`} alt={selectedMove.type} className="h-4 object-contain shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} title={selectedMove.type} />
            <span className="text-white font-bold truncate flex-1">{selectedMove.name}</span>
            <img src={`/sprites/${selectedMove.category.toLowerCase()}.png`} alt={selectedMove.category} className="h-4 object-contain shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} title={selectedMove.category} />
          </div>
        ) : <span className="text-slate-500">Empty</span>}
        <ChevronDown size={14} className="text-slate-400 shrink-0 ml-2" />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-[100] overflow-hidden">
          <div className="p-2 border-b border-slate-700 flex items-center gap-2 bg-slate-900"><Search size={14} className="text-slate-400" /><input type="text" autoFocus placeholder="Search move..." className="bg-transparent w-full outline-none text-white text-xs" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="max-h-48 overflow-y-auto">
            <div className="px-3 py-2 hover:bg-rose-600 cursor-pointer text-xs text-slate-400" onClick={() => { onSelect(''); setIsOpen(false); }}>-- Remove --</div>
            {filteredMoves.map(move => (
              <div key={move.id} className="px-3 py-2 hover:bg-blue-600 cursor-pointer flex justify-between items-center text-xs gap-2" onClick={() => { onSelect(move.id); setIsOpen(false); setSearch(''); }}>
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

const EvInput = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => {
  const [val, setVal] = useState(value.toString());
  useEffect(() => setVal(value.toString()), [value]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed)) onChange(Math.min(32, Math.max(0, parsed)));
  };
  return <input type="number" min="0" max="32" value={val} onChange={handleChange} onBlur={() => {let p=parseInt(val,10); if(isNaN(p)||p<0)p=0; if(p>32)p=32; setVal(p.toString()); onChange(p);}} className="w-8 text-[10px] text-center font-bold bg-slate-800 border border-slate-600 rounded text-white focus:border-blue-400 focus:bg-slate-700 outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />;
};

// --- COMPONENTE: BOTONES DE NATURALEZA ---
const NatureSelect = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => (
  <div className="flex items-center bg-slate-800 rounded border border-slate-600 overflow-hidden shrink-0">
    <button 
      onClick={() => onChange(1.1)} 
      className={`w-6 py-0.5 text-[10px] font-black transition-colors ${value > 1.0 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
      title="Beneficial Nature (+10%)"
    >
      +
    </button>
    <button 
      onClick={() => onChange(1.0)} 
      className={`w-6 py-0.5 text-[10px] font-black transition-colors border-l border-r border-slate-700 ${value === 1.0 ? 'bg-slate-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
      title="Neutral Nature"
    >
      ...
    </button>
    <button 
      onClick={() => onChange(0.9)} 
      className={`w-6 py-0.5 text-[10px] font-black transition-colors ${value < 1.0 ? 'bg-rose-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
      title="Hindering Nature (-10%)"
    >
      -
    </button>
  </div>
);

const StageSelect = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => (
  <div className="flex items-center bg-slate-800 rounded border border-slate-600 text-xs text-white overflow-hidden shrink-0">
    <button onClick={() => onChange(Math.max(-6, value - 1))} className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600">-</button>
    <span className="w-5 text-center font-bold text-[10px]">{value > 0 ? `+${value}` : value}</span>
    <button onClick={() => onChange(Math.min(6, value + 1))} className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600">+</button>
  </div>
);

const EffectToggle = ({ active, onClick, label, colorClass = 'indigo' }: { active: boolean, onClick: () => void, label: string, colorClass?: string }) => {
  const activeClasses = {
    indigo: 'bg-indigo-600/30 border-indigo-500 text-indigo-300', orange: 'bg-orange-600/30 border-orange-500 text-orange-300',
    yellow: 'bg-yellow-600/30 border-yellow-500 text-yellow-300', cyan: 'bg-cyan-600/30 border-cyan-500 text-cyan-300',
    fuchsia: 'bg-fuchsia-600/30 border-fuchsia-500 text-fuchsia-300', emerald: 'bg-emerald-600/30 border-emerald-500 text-emerald-300',
  }[colorClass] || 'bg-indigo-600/30 border-indigo-500 text-indigo-300';
  return <button onClick={onClick} className={`px-1 py-1 rounded text-[9px] font-bold text-center transition-colors border uppercase ${active ? activeClasses : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'}`}>{label}</button>;
};

// --- SHOWDOWN IMPORT / EXPORT LOGIC ---
const parseShowdown = (text: string): Partial<PlayerState> | null => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  if (!lines.length) return null;

  const result: Partial<PlayerState> = {};
  const firstLine = lines[0];
  let speciesStr = firstLine;
  let itemStr = '';
  if (firstLine.includes('@')) {
    const parts = firstLine.split('@');
    speciesStr = parts[0].trim();
    itemStr = parts[1].trim();
  }
  if (speciesStr.includes('(')) speciesStr = speciesStr.split('(')[0].trim();

  const findKey = (dict: Record<string, any>, name: string) => {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const [k, v] of Object.entries(dict)) {
      if (k.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanName || (v.name && v.name.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanName)) return k;
    }
    return null;
  };

  result.speciesId = findKey(POKEDEX, speciesStr) || 'dragapult';
  if (itemStr) result.itemId = findKey(ITEMS_DB, itemStr) || 'None';

  // Añadimos la habilidad por defecto del Pokémon al importarlo
  const importedPoke = POKEDEX[result.speciesId];
  result.abilityId = importedPoke?.abilities?.[0] || 'No Ability';

  result.moves = ['', '', '', ''];
  result.evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
  result.nature = { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 };
  let moveIdx = 0;

  const natureMap: Record<string, any> = {
    'Adamant': { atk: 1.1, spa: 0.9 }, 'Bold': { def: 1.1, atk: 0.9 }, 'Brave': { atk: 1.1, spe: 0.9 },
    'Calm': { spd: 1.1, atk: 0.9 }, 'Careful': { spd: 1.1, spa: 0.9 }, 'Gentle': { spd: 1.1, def: 0.9 },
    'Impish': { def: 1.1, spa: 0.9 }, 'Jolly': { spe: 1.1, spa: 0.9 }, 'Modest': { spa: 1.1, atk: 0.9 },
    'Quiet': { spa: 1.1, spe: 0.9 }, 'Relaxed': { def: 1.1, spe: 0.9 }, 'Sassy': { spd: 1.1, spe: 0.9 },
    'Timid': { spe: 1.1, atk: 0.9 }, 'Naughty': { atk: 1.1, spd: 0.9 }, 'Lax': { def: 1.1, spd: 0.9 },
    'Naive': { spe: 1.1, spd: 0.9 }, 'Rash': { spa: 1.1, spd: 0.9 }, 'Hasty': { spe: 1.1, def: 0.9 },
    'Mild': { spa: 1.1, def: 0.9 }, 'Lonely': { atk: 1.1, def: 0.9 }
  };

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('Ability:')) {
      const abStr = line.replace('Ability:', '').trim();
      result.abilityId = findKey(ABILITIES_DB, abStr) || abStr.toLowerCase().replace(/[^a-z0-9]/g, ''); 
    } else if (line.startsWith('EVs:')) {
      const parts = line.replace('EVs:', '').trim().split('/');
      parts.forEach(p => {
        const [val, stat] = p.trim().split(' ');
        const nVal = parseInt(val);
        if (isNaN(nVal)) return;
        
        const mappedVal = nVal;
        
        const s = stat.toLowerCase();
        if (s === 'hp') result.evs!.hp = mappedVal;
        if (s === 'atk') result.evs!.atk = mappedVal;
        if (s === 'def') result.evs!.def = mappedVal;
        if (s === 'spa') result.evs!.spa = mappedVal;
        if (s === 'spd') result.evs!.spd = mappedVal;
        if (s === 'spe') result.evs!.spe = mappedVal;
      });
    } else if (line.endsWith('Nature')) {
      const nat = line.replace('Nature', '').trim();
      if (natureMap[nat]) result.nature = { atk: 1, def: 1, spa: 1, spd: 1, spe: 1, ...natureMap[nat] };
    } else if (line.startsWith('-')) {
      if (moveIdx < 4) {
        const moveStr = line.replace('-', '').trim();
        const mId = findKey(MOVES_DB, moveStr);
        if (mId) { result.moves![moveIdx] = mId; moveIdx++; }
      }
    }
  }
  return result;
};

const exportShowdown = (player: PlayerState): string => {
  const pokeName = POKEDEX[player.speciesId]?.name || 'Unknown';
  const itemName = ITEMS_DB[player.itemId]?.name || '';
  
  const abName = ABILITIES_DB[player.abilityId]?.name || player.abilityId;
  
  let str = `${pokeName}${itemName && itemName !== 'No Item' ? ` @ ${itemName}` : ''}\n`;
  if (abName && abName !== 'No Ability') str += `Ability: ${abName}\n`;
  
  const evs = [];
  if (player.evs.hp > 0) evs.push(`${player.evs.hp} HP`);
  if (player.evs.atk > 0) evs.push(`${player.evs.atk} Atk`);
  if (player.evs.def > 0) evs.push(`${player.evs.def} Def`);
  if (player.evs.spa > 0) evs.push(`${player.evs.spa} SpA`);
  if (player.evs.spd > 0) evs.push(`${player.evs.spd} SpD`);
  if (player.evs.spe > 0) evs.push(`${player.evs.spe} Spe`);
  if (evs.length > 0) str += `EVs: ${evs.join(' / ')}\n`;
  
  let natureStr = '';
  if (player.nature.atk > 1) natureStr = player.nature.spa < 1 ? 'Adamant' : player.nature.spe < 1 ? 'Brave' : 'Lonely';
  else if (player.nature.def > 1) natureStr = player.nature.spa < 1 ? 'Impish' : player.nature.spe < 1 ? 'Relaxed' : 'Bold';
  else if (player.nature.spa > 1) natureStr = player.nature.atk < 1 ? 'Modest' : player.nature.spe < 1 ? 'Quiet' : 'Mild';
  else if (player.nature.spd > 1) natureStr = player.nature.spa < 1 ? 'Careful' : player.nature.atk < 1 ? 'Calm' : 'Sassy';
  else if (player.nature.spe > 1) natureStr = player.nature.spa < 1 ? 'Jolly' : player.nature.atk < 1 ? 'Timid' : 'Naive';
  if (natureStr) str += `${natureStr} Nature\n`;
  
  player.moves.forEach(m => { if (m) str += `- ${MOVES_DB[m]?.name}\n`; });
  return str;
};

// --- COMPONENTE MODAL DE SHOWDOWN MEJORADO ---
const ShowdownModal = ({ playerState, updateState }: { playerState: PlayerState, updateState: (p: Partial<PlayerState>) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleExport = () => {
    const generated = exportShowdown(playerState);
    setText(generated);
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleImport = () => {
    const parsed = parseShowdown(text);
    if (parsed) {
      updateState(parsed);
      setIsOpen(false);
    } else {
      alert("Invalid Showdown Format");
    }
  };

  return (
    <div className="w-full">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full mt-2 py-1.5 bg-slate-900 border border-slate-700 rounded flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 hover:text-blue-400 transition-colors uppercase tracking-wider">
        <FileText size={12}/> {isOpen ? 'Close Showdown Import/Export' : 'Showdown Import/Export'}
      </button>
      {isOpen && (
        <div className="mt-2 bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-inner">
          <textarea 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder="Paste Showdown set here..."
            className="w-full h-32 bg-slate-800 border border-slate-600 rounded p-2 text-xs text-white font-mono outline-none focus:border-blue-400 mb-2 resize-none"
          />
          <div className="flex gap-2">
            <button onClick={() => setText('')} className="flex-1 bg-rose-600/30 border border-rose-500 text-rose-300 py-1.5 rounded flex justify-center items-center gap-2 text-xs font-bold hover:bg-rose-600/50 transition-colors">
              <Trash2 size={14}/> Clear
            </button>
            <button onClick={handleImport} className="flex-1 bg-emerald-600/30 border border-emerald-500 text-emerald-300 py-1.5 rounded flex justify-center items-center gap-2 text-xs font-bold hover:bg-emerald-600/50 transition-colors">
              <Download size={14}/> Import
            </button>
            <button onClick={handleExport} className="flex-1 bg-blue-600/30 border border-blue-500 text-blue-300 py-1.5 rounded flex justify-center items-center gap-2 text-xs font-bold hover:bg-blue-600/50 transition-colors">
              {copied ? <Check size={14} /> : <Copy size={14}/>} {copied ? 'Copied!' : 'Export & Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdvancedMode({ weather, terrain, setWeather, setTerrain }: { weather?: Weather, terrain?: Terrain, setWeather?: (w: Weather) => void, setTerrain?: (t: Terrain) => void }) {
  const [isDoubles, setIsDoubles] = useLocalStorage('adv-isDoubles', false);
  const [p1, setP1] = useLocalStorage<PlayerState>('adv-p1', createDefaultPlayer('dragapult'));
  const [p2, setP2] = useLocalStorage<PlayerState>('adv-p2', createDefaultPlayer('corviknight'));

  const updateP = (playerNum: 1|2, updates: Partial<PlayerState>) => {
    if (playerNum === 1) setP1(prev => ({ ...prev, ...updates }));
    else setP2(prev => ({ ...prev, ...updates }));
  };

  const updateSingleP = (playerNum: 1|2, field: keyof PlayerState, val: any) => updateP(playerNum, { [field]: val });

  const updateNested = (playerNum: 1|2, cat: 'evs'|'stages', stat: string, val: number) => {
    const setFn = playerNum === 1 ? setP1 : setP2;
    setFn(prev => ({ ...prev, [cat]: { ...prev[cat as keyof PlayerState] as any, [stat]: val } }));
  };

  // --- MOTOR INTELIGENTE DE NATURALEZAS ---
  const handleNatureChange = (playerNum: 1|2, pState: PlayerState, statKey: StatKey, val: number) => {
    if (val === 1.0) {
      updateSingleP(playerNum, 'nature', { atk: 1.0, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.0 });
    } else {
      const newNature = { ...pState.nature };
      (Object.keys(newNature) as StatKey[]).forEach((k) => {
        if (newNature[k] === val) newNature[k] = 1.0;
      });
      newNature[statKey] = val;
      updateSingleP(playerNum, 'nature', newNature);
    }
  };

  const getFinalStats = (p: PlayerState) => {
    const poke = POKEDEX[p.speciesId] || POKEDEX['dragapult'];
    const item = ITEMS_DB[p.itemId] || ITEMS_DB['None'];
    const ability = ABILITIES_DB[p.abilityId] || ABILITIES_DB['No Ability'];

    const isLightBall = p.itemId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === 'lightball';
    const itemAtkMod = isLightBall ? (poke.id.includes('pikachu') ? 2 : 1) : (item.atkMod || 1);
    const itemSpaMod = isLightBall ? (poke.id.includes('pikachu') ? 2 : 1) : (item.spaMod || 1);

    let hp = calcHP(poke.baseStats.hp, p.evs.hp);
    let atk = Math.floor(calcStat(poke.baseStats.atk, p.evs.atk, p.nature.atk) * itemAtkMod * (ability.atkMod||1) * getStageMod(p.stages.atk));
    let def = Math.floor(calcStat(poke.baseStats.def, p.evs.def, p.nature.def) * (item.defMod||1) * (ability.defMod||1) * getStageMod(p.stages.def));
    let spa = Math.floor(calcStat(poke.baseStats.spa, p.evs.spa, p.nature.spa) * itemSpaMod * (ability.spaMod||1) * getStageMod(p.stages.spa));
    let spd = Math.floor(calcStat(poke.baseStats.spd, p.evs.spd, p.nature.spd) * (item.spdMod||1) * (ability.spdMod||1) * getStageMod(p.stages.spd));
    let spe = Math.floor(calcStat(poke.baseStats.spe, p.evs.spe, p.nature.spe) * (item.speMod||1) * (ability.speMod||1) * getStageMod(p.stages.spe));

    if (weather === 'Snow' && poke.types.includes('Ice') && !checkAbility(p.abilityId, ability, 'Mega Sol', 'Mega Sol')) def = Math.floor(def * 1.5);
    if (weather === 'Sand' && poke.types.includes('Rock') && !checkAbility(p.abilityId, ability, 'Mega Sol', 'Mega Sol')) spd = Math.floor(spd * 1.5);
    if (checkAbility(p.abilityId, ability, 'Marvel Scale', 'Escama Especial') && (p.isBurned || p.isParalyzed)) def = Math.floor(def * 1.5);

    if (checkAbility(p.abilityId, ability, 'Swift Swim', 'Nado Rapido') && weather === 'Rain') spe = Math.floor(spe * 2);
    if (checkAbility(p.abilityId, ability, 'Chlorophyll', 'Clorofila') && weather === 'Sun') spe = Math.floor(spe * 2);
    if (checkAbility(p.abilityId, ability, 'Sand Rush', 'Impetu Arena') && weather === 'Sand') spe = Math.floor(spe * 2);
    if (checkAbility(p.abilityId, ability, 'Slush Rush', 'Quitanieves') && weather === 'Snow') spe = Math.floor(spe * 2);
    if (checkAbility(p.abilityId, ability, 'Surge Surfer', 'Cola Surf') && terrain === 'Electric') spe = Math.floor(spe * 2);
    if (checkAbility(p.abilityId, ability, 'Protosynthesis', 'Protosintesis') && weather === 'Sun') spe = Math.floor(spe * 1.5);
    if (checkAbility(p.abilityId, ability, 'Quark Drive', 'Carga Cuark') && terrain === 'Electric') spe = Math.floor(spe * 1.5);

    if (p.hasTailwind) spe = Math.floor(spe * 2);
    if (p.isParalyzed && !poke.types.includes('Electric')) spe = Math.floor(spe * 0.5);

    return { hp, atk, def, spa, spd, spe };
  };

  const p1Stats = useMemo(() => getFinalStats(p1), [p1, weather, terrain]);
  const p2Stats = useMemo(() => getFinalStats(p2), [p2, weather, terrain]);

  const renderPlayerColumn = (playerNum: 1|2, pState: PlayerState, finalStats: ReturnType<typeof getFinalStats>) => {
    const poke = POKEDEX[pState.speciesId] || POKEDEX['dragapult'];
    const isP1 = playerNum === 1;

    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 flex flex-col gap-4 shadow-lg h-full">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2">
          <h3 className={`font-bold text-lg flex items-center gap-2 ${isP1 ? 'text-blue-400' : 'text-rose-400'}`}><Crosshair size={18}/> {isP1 ? 'Pokémon A' : 'Pokémon B'}</h3>
          {/* BOTÓN INDIVIDUAL DE RESETEO */}
          <button 
            onClick={() => updateP(playerNum, createDefaultPlayer(pState.speciesId))} 
            title="Reset Pokémon" 
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-rose-600 transition-colors"
          >
            <RotateCcw size={14}/>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-3 w-full">
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-16 h-16 flex items-center justify-center bg-slate-900/80 rounded-lg border border-slate-700 shadow-inner overflow-hidden relative">
              <img src={getSpriteUrl(poke.id)} alt={poke.name} className="max-h-12 object-contain" onError={handleSpriteError} />
            </div>
            <div className="flex gap-1">{poke.types.map((t: string) => <span key={t} className={`${TYPE_COLORS[t]} text-white text-[8px] font-black px-1 rounded uppercase border border-black/10`}>{t.substring(0,3)}</span>)}</div>
          </div>
          
          <div className="flex-1 space-y-2 w-full">
            <PokemonSelector 
            selectedId={pState.speciesId} 
            onSelect={(id) => { 
              updateSingleP(playerNum, 'speciesId', id); 
              updateSingleP(playerNum, 'abilityId', POKEDEX[id].abilities[0] || 'No Ability'); 
              updateSingleP(playerNum, 'moves', ['', '', '', '']); 
              updateSingleP(playerNum, 'evs', { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }); 
              updateSingleP(playerNum, 'nature', { atk: 1.0, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.0 });
              updateSingleP(playerNum, 'stages', { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 });
              updateSingleP(playerNum, 'hits', [0, 0, 0, 0]); 
              const megaItem = autoEquipMegaItem(id);
              if (megaItem) updateSingleP(playerNum, 'itemId', megaItem);
              else updateSingleP(playerNum, 'itemId', 'None');
            }} 
          />
            
          {/* BOTÓN INTELIGENTE DE TRANSFORMACIÓN / MEGA */}
          {(() => {
            const transformData = getTransformData(pState.speciesId, pState.itemId);
            if (!transformData) return null;
            return (
              <button 
                onClick={() => {
                  updateSingleP(playerNum, 'speciesId', transformData.target);
                  updateSingleP(playerNum, 'abilityId', POKEDEX[transformData.target]?.abilities[0] || 'No Ability');
                }} 
                className="w-full py-1.5 bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-500/50 rounded-lg text-xs font-bold hover:bg-fuchsia-600/40 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={12} /> {transformData.label}
              </button>
            );
          })()}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              <AbilitySelector selectedId={pState.abilityId} onSelect={(id) => updateSingleP(playerNum, 'abilityId', id)} abilities={poke.abilities} colorClass="text-yellow-300 hover:border-yellow-500" />
              <ItemSelector 
                  selectedId={pState.itemId} 
                  onSelect={(id) => updateSingleP(playerNum, 'itemId', id)} 
                  colorClass="text-emerald-300 hover:border-emerald-500" 
                  disabled={isMegaForm(pState.speciesId)} 
                />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-700">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Moves</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 w-full">{[0, 1, 2, 3].map(i => <MoveSelector key={i} selectedMoveId={pState.moves[i]} learnset={poke.learnset} onSelect={(id) => { const nm = [...pState.moves]; nm[i] = id; updateSingleP(playerNum, 'moves', nm); }} />)}</div>
        </div>

        {/* SHOWDOWN MODAL IMPORT/EXPORT */}
        <ShowdownModal playerState={pState} updateState={(updates) => updateP(playerNum, updates)} />
        
        <div className="space-y-1 w-full max-w-full overflow-x-auto [&::-webkit-scrollbar]:hidden pb-2">
          <div className="bg-slate-900 p-1 sm:p-2 rounded-lg border border-slate-700 flex items-center justify-between gap-1 min-w-max">
            <span className="text-[10px] sm:text-xs font-bold text-emerald-400 w-10 sm:w-12 shrink-0"><Heart size={12} className="inline mr-0.5 sm:mr-1"/>HP</span>
            <div className="shrink-0 invisible pointer-events-none"><StageSelect value={0} onChange={() => {}} /></div>
            <div className="shrink-0 invisible pointer-events-none"><NatureSelect value={1} onChange={() => {}} /></div>
            <input type="range" min="0" max="32" value={pState.evs.hp} onChange={(e) => updateNested(playerNum, 'evs', 'hp', Number(e.target.value))} className="w-10 sm:w-12 accent-emerald-500 rounded-full h-1.5 appearance-none cursor-pointer shrink-0" style={getSliderStyle(pState.evs.hp, 'rgba(16, 185, 129, 0.4)')} />
            <div className="shrink-0"><EvInput value={pState.evs.hp} onChange={(v) => updateNested(playerNum, 'evs', 'hp', v)} /></div>
            <span className="text-xs sm:text-sm font-mono text-white font-bold w-7 sm:w-8 text-right flex items-center gap-1 justify-end shrink-0">{finalStats.hp}</span>
          </div>
          {[ { key: 'atk', label: 'Atk', color: 'text-rose-400', icon: Swords, accent: 'accent-rose-500', rgba: 'rgba(244, 63, 94, 0.4)' }, { key: 'def', label: 'Def', color: 'text-orange-400', icon: ShieldAlert, accent: 'accent-orange-500', rgba: 'rgba(249, 115, 22, 0.4)' }, { key: 'spa', label: 'SpA', color: 'text-purple-400', icon: Swords, accent: 'accent-purple-500', rgba: 'rgba(168, 85, 247, 0.4)' }, { key: 'spd', label: 'SpD', color: 'text-indigo-400', icon: ShieldAlert, accent: 'accent-indigo-500', rgba: 'rgba(99, 102, 241, 0.4)' }, { key: 'spe', label: 'Spe', color: 'text-blue-400', icon: Zap, accent: 'accent-blue-500', rgba: 'rgba(59, 130, 246, 0.4)' } ].map(stat => (
            <div key={stat.key} className="bg-slate-900 p-1 sm:p-2 rounded-lg border border-slate-700 flex items-center justify-between gap-1 min-w-max">
              <span className={`text-[10px] sm:text-xs font-bold ${stat.color} w-10 sm:w-12 shrink-0`}><stat.icon size={12} className="inline mr-0.5 sm:mr-1"/>{stat.label}</span>
              <div className="shrink-0"><StageSelect value={pState.stages[stat.key as StatKey]} onChange={(v) => updateNested(playerNum, 'stages', stat.key as StatKey, v)} /></div>
              <div className="shrink-0"><NatureSelect value={pState.nature[stat.key as StatKey]} onChange={(v) => handleNatureChange(playerNum, pState, stat.key as StatKey, v)} /></div>
              <input type="range" min="0" max="32" value={pState.evs[stat.key as StatKey]} onChange={(e) => updateNested(playerNum, 'evs', stat.key as StatKey, Number(e.target.value))} className={`w-10 sm:w-12 ${stat.accent} rounded-full h-1.5 appearance-none cursor-pointer shrink-0`} style={getSliderStyle(pState.evs[stat.key as StatKey], stat.rgba)} />
              <div className="shrink-0"><EvInput value={pState.evs[stat.key as StatKey]} onChange={(v) => updateNested(playerNum, 'evs', stat.key as StatKey, v)} /></div>
              <span className="text-xs sm:text-sm font-mono text-white font-bold w-7 sm:w-8 text-right flex items-center gap-1 justify-end shrink-0">{finalStats[stat.key as StatKey]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDamageBars = (attackerNum: 1|2, attackerState: PlayerState, defenderState: PlayerState, attackerStats: any, defenderStats: any) => {
    const attackerPoke = POKEDEX[attackerState.speciesId] || POKEDEX['dragapult'];
    const defenderPoke = POKEDEX[defenderState.speciesId] || POKEDEX['corviknight'];
    const attackerItem = ITEMS_DB[attackerState.itemId] || ITEMS_DB['None'];
    const defenderItem = ITEMS_DB[defenderState.itemId] || ITEMS_DB['None'];
    const attackerAbility = ABILITIES_DB[attackerState.abilityId] || ABILITIES_DB['No Ability'];
    const defenderAbility = ABILITIES_DB[defenderState.abilityId] || ABILITIES_DB['No Ability'];

    const isFairyAuraOnField = checkAbility(p1.abilityId, ABILITIES_DB[p1.abilityId], 'Fairy Aura', 'Aura Feerica') || checkAbility(p2.abilityId, ABILITIES_DB[p2.abilityId], 'Fairy Aura', 'Aura Feerica');
    const attackerHasMegaSol = checkAbility(attackerState.abilityId, attackerAbility, 'Mega Sol', 'Mega Sol');
    const activeWeather = attackerHasMegaSol ? 'Sun' : weather;

    return attackerState.moves.map((moveId, idx) => {
      const move = moveId ? MOVES_DB[moveId] : null;
      if (!move) return <div key={idx} className="rounded-lg border border-dashed border-slate-700 bg-slate-800/30 flex items-center justify-center p-4 text-slate-500 text-[10px]">Empty</div>;

      const isCrit = attackerState.crits ? attackerState.crits[idx] : false;
      let finalAtkStat = move.category === 'Physical' ? attackerStats.atk : attackerStats.spa;
      let finalDefStat = move.category === 'Physical' ? defenderStats.def : defenderStats.spd;
      
      if (move.overrideOffensiveStat === 'def') finalAtkStat = attackerStats.def;
      else if (move.useTargetAttack) finalAtkStat = defenderStats.atk;
      
      if (move.overrideDefensiveStat === 'def') finalDefStat = defenderStats.def;

      // MEGA SOL BYPASS 
      if (attackerHasMegaSol) {
        if ((move.category === 'Physical' || move.overrideDefensiveStat === 'def') && weather === 'Snow' && defenderPoke.types.includes('Ice')) {
          let baseD = calcStat(defenderPoke.baseStats.def, defenderState.evs.def, defenderState.nature.def);
          baseD = Math.floor(baseD * (defenderItem.defMod||1) * (defenderAbility.defMod||1) * getStageMod(defenderState.stages.def));
          if (checkAbility(defenderState.abilityId, defenderAbility, 'Marvel Scale', 'Escama Especial') && (defenderState.isBurned || defenderState.isParalyzed)) baseD = Math.floor(baseD * 1.5);
          finalDefStat = baseD;
        } else if (move.category === 'Special' && move.overrideDefensiveStat !== 'def' && weather === 'Sand' && defenderPoke.types.includes('Rock')) {
          let baseS = calcStat(defenderPoke.baseStats.spd, defenderState.evs.spd, defenderState.nature.spd);
          baseS = Math.floor(baseS * (defenderItem.spdMod||1) * (defenderAbility.spdMod||1) * getStageMod(defenderState.stages.spd));
          finalDefStat = baseS;
        }
      }

      if (isCrit) {
        const atkStage = move.overrideOffensiveStat === 'def' ? attackerState.stages.def : (move.useTargetAttack ? defenderState.stages.atk : (move.category === 'Physical' ? attackerState.stages.atk : attackerState.stages.spa));
        const defStage = (move.category === 'Physical' || move.overrideDefensiveStat === 'def') ? defenderState.stages.def : defenderState.stages.spd;
        if (atkStage < 0) finalAtkStat = Math.floor(finalAtkStat / getStageMod(atkStage));
        if (defStage > 0) finalDefStat = Math.floor(finalDefStat / getStageMod(defStage));
      }

      // --- PROTECT LOGIC ---
      let isProtected = false;
      let protectMod = 1;
      let isPartiallyProtected = false;
      
      if (defenderState.hasProtect && move.category !== 'Status') {
        const hasUnseenFist = checkAbility(attackerState.abilityId, attackerAbility, 'Unseen Fist', 'Puño Invisible');
        const hasPiercingDrill = checkAbility(attackerState.abilityId, attackerAbility, 'Piercing Drill', 'Taladro Perforador');
        
        if ((hasUnseenFist || hasPiercingDrill) && move.flags?.includes('contact')) {
          protectMod = 0.25;
          isPartiallyProtected = true;
        } else {
          isProtected = true;
        }
      }

      // --- MULTIHIT ---
      let minHits = 1; let maxHits = 1; let isMulti = false;
      let availableHits: number[] = [];

      if (move.flags?.includes('multihit')) {
        isMulti = true;
        if (checkAbility(attackerState.abilityId, attackerAbility, 'Skill Link', 'Encadenar')) {
          availableHits = [5];
        } else {
          if (['doublekick', 'doublehit', 'dualwingbeat', 'dragondarts', 'bonemerang', 'geargrind', 'dualchop', 'twinbeam'].includes(move.id)) availableHits = [2];
          else if (['surgingstrikes', 'tripleaxel', 'triplekick'].includes(move.id)) availableHits = [3];
          else if (move.id === 'populationbomb') availableHits = [1,2,3,4,5,6,7,8,9,10];
          else availableHits = [2, 3, 4, 5];
        }
      } else if (checkAbility(attackerState.abilityId, attackerAbility, 'Parental Bond', 'Amor Filial')) {
        availableHits = [1.25];
        isMulti = true;
      }

      if (availableHits.length > 0) {
        const selectedHits = attackerState.hits?.[idx] || 0;
        if (selectedHits > 0 && availableHits.includes(selectedHits)) {
          minHits = selectedHits; maxHits = selectedHits;
        } else {
          minHits = availableHits[0]; maxHits = availableHits[availableHits.length - 1];
        }
      }

      // --- PESO DINÁMICO ---
      const getWeight = (poke: any, state: any, ability: any, item: any) => {
        let w = poke.weightkg || 50;
        if (checkAbility(state.abilityId, ability, 'Heavy Metal', 'Metal Pesado')) w *= 2;
        if (checkAbility(state.abilityId, ability, 'Light Metal', 'Metal Liviano')) w *= 0.5;
        if (item.id === 'Float Stone' || item.name === 'Piedra Pómez') w *= 0.5;
        return w;
      };

      const attackerWeight = getWeight(attackerPoke, attackerState, attackerAbility, attackerItem);
      const defenderWeight = getWeight(defenderPoke, defenderState, defenderAbility, defenderItem);
      
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
        if (!attackerState.itemId || attackerState.itemId === 'None' || attackerState.itemId === 'No Item') {
          dynamicPower *= 2;
        }
      }

      // --- CAMBIO DE TIPO ---
      let typeAbilityMod = 1;
      if (moveType === 'Normal') {
        if (checkAbility(attackerState.abilityId, attackerAbility, 'Pixilate', 'Piel Feerica')) { moveType = 'Fairy'; typeAbilityMod = 1.3; }
        else if (checkAbility(attackerState.abilityId, attackerAbility, 'Aerilate', 'Piel Celeste')) { moveType = 'Flying'; typeAbilityMod = 1.3; }
        else if (checkAbility(attackerState.abilityId, attackerAbility, 'Refrigerate', 'Piel Helada')) { moveType = 'Ice'; typeAbilityMod = 1.3; }
        else if (checkAbility(attackerState.abilityId, attackerAbility, 'Dragonize', 'Dragonize')) { moveType = 'Dragon'; typeAbilityMod = 1.2; }
      }
      if (move.flags?.includes('sound') && checkAbility(attackerState.abilityId, attackerAbility, 'Liquid Voice', 'Voz Liquida')) moveType = 'Water';
      
      let stab = (attackerPoke.types.includes(moveType) || checkAbility(attackerState.abilityId, attackerAbility, 'Protean', 'Mutatipo')) ? 1.5 : 1;
      if (stab > 1 && checkAbility(attackerState.abilityId, attackerAbility, 'Adaptability', 'Adaptable')) stab = 2;

      let eff = getEffectiveness(moveType, defenderPoke.types);
      if (move.isFreezeDry && defenderPoke.types.includes('Water')) eff *= 4;

      if (checkAbility(attackerState.abilityId, attackerAbility, 'Scrappy', 'Intrepido') && (moveType === 'Normal' || moveType === 'Fighting')) {
        eff = getEffectiveness(moveType, defenderPoke.types.filter((t: string) => t !== 'Ghost'));
      }

      if (moveType === 'Ground' && (checkAbility(defenderState.abilityId, defenderAbility, 'Levitate', 'Levitacion') || checkAbility(defenderState.abilityId, defenderAbility, 'Earth Eater', 'Geofagia'))) eff = 0;
      if (moveType === 'Water' && (checkAbility(defenderState.abilityId, defenderAbility, 'Water Absorb', 'Absorbe Agua') || checkAbility(defenderState.abilityId, defenderAbility, 'Storm Drain', 'Colector'))) eff = 0;
      if (moveType === 'Electric' && (checkAbility(defenderState.abilityId, defenderAbility, 'Volt Absorb', 'Absorbe Elec') || checkAbility(defenderState.abilityId, defenderAbility, 'Motor Drive', 'Electromotor') || checkAbility(defenderState.abilityId, defenderAbility, 'Lightning Rod', 'Pararrayos'))) eff = 0;
      if (moveType === 'Fire' && checkAbility(defenderState.abilityId, defenderAbility, 'Flash Fire', 'Absorbe Fuego')) eff = 0;
      if (moveType === 'Grass' && checkAbility(defenderState.abilityId, defenderAbility, 'Sap Sipper', 'Herbivoro')) eff = 0;
      if (move.flags?.includes('sound') && checkAbility(defenderState.abilityId, defenderAbility, 'Soundproof', 'Insonorizar')) eff = 0;
      if (move.flags?.includes('bullet') && checkAbility(defenderState.abilityId, defenderAbility, 'Bulletproof', 'Antibalas')) eff = 0;

      if (isProtected) eff = 0;

      let atkAbilityMod = 1;
      if (move.category === 'Physical' && checkAbility(attackerState.abilityId, attackerAbility, 'Huge Power', 'Potencia')) atkAbilityMod *= 2;
      if (move.category === 'Physical' && checkAbility(attackerState.abilityId, attackerAbility, 'Pure Power', 'Energia Pura')) atkAbilityMod *= 2;
      if (move.category === 'Physical' && checkAbility(attackerState.abilityId, attackerAbility, 'Guts', 'Agallas') && attackerState.isBurned) atkAbilityMod *= 1.5;
      if (move.category === 'Special' && checkAbility(attackerState.abilityId, attackerAbility, 'Solar Power', 'Poder Solar') && activeWeather === 'Sun') atkAbilityMod *= 1.5;
      if (checkAbility(attackerState.abilityId, attackerAbility, 'Sand Force', 'Poder Arena') && weather === 'Sand' && ['Rock', 'Ground', 'Steel'].includes(moveType)) atkAbilityMod *= 1.3;
      if (checkAbility(attackerState.abilityId, attackerAbility, 'Tough Claws', 'Garra Dura') && move.flags?.includes('contact')) atkAbilityMod *= 1.33;
      if (checkAbility(attackerState.abilityId, attackerAbility, 'Iron Fist', 'Puno Ferreo') && move.flags?.includes('punch')) atkAbilityMod *= 1.2;
      if (checkAbility(attackerState.abilityId, attackerAbility, 'Reckless', 'Audaz') && move.flags?.includes('recoil')) atkAbilityMod *= 1.2;
      if (checkAbility(attackerState.abilityId, attackerAbility, 'Sharpness', 'Cortante') && move.flags?.includes('slicing')) atkAbilityMod *= 1.5;
      if (checkAbility(attackerState.abilityId, attackerAbility, 'Mega Launcher', 'Megadisparador') && move.flags?.includes('pulse')) atkAbilityMod *= 1.5;
      if (checkAbility(attackerState.abilityId, attackerAbility, 'Strong Jaw', 'Mandibula Fuerte') && move.flags?.includes('bite')) atkAbilityMod *= 1.5;
      if (checkAbility(attackerState.abilityId, attackerAbility, 'Technician', 'Experto') && dynamicPower <= 60) atkAbilityMod *= 1.5;
      if (checkAbility(attackerState.abilityId, attackerAbility, 'Water Bubble', 'Pompa') && moveType === 'Water') atkAbilityMod *= 2;
      if (checkAbility(attackerState.abilityId, attackerAbility, 'Sheer Force', 'Potencia Bruta') && move.flags?.includes('secondary')) atkAbilityMod *= 1.3;
      
      if (moveType === 'Fairy' && isFairyAuraOnField) atkAbilityMod *= 1.333;
      atkAbilityMod *= typeAbilityMod;

      let defAbilityMod = 1;
      if (checkAbility(defenderState.abilityId, defenderAbility, 'Thick Fat', 'Sebo') && ['Fire', 'Ice'].includes(moveType)) defAbilityMod *= 0.5;
      if (checkAbility(defenderState.abilityId, defenderAbility, 'Fur Coat', 'Pelaje Recio') && move.category === 'Physical') defAbilityMod *= 0.5;
      if (checkAbility(defenderState.abilityId, defenderAbility, 'Water Bubble', 'Pompa') && moveType === 'Fire') defAbilityMod *= 0.5;
      if (checkAbility(defenderState.abilityId, defenderAbility, 'Fluffy', 'Peluche')) {
        if (move.flags?.includes('contact')) defAbilityMod *= 0.5;
        if (moveType === 'Fire') defAbilityMod *= 2;
      }
      if (checkAbility(defenderState.abilityId, defenderAbility, 'Multiscale', 'Compensacion')) defAbilityMod *= 0.5;
      if (checkAbility(defenderState.abilityId, defenderAbility, 'Solid Rock', 'Roca Solida') && eff > 1) defAbilityMod *= 0.75;
      if (checkAbility(defenderState.abilityId, defenderAbility, 'Filter', 'Filtro') && eff > 1) defAbilityMod *= 0.75;

      let itemBoostToPower = 1;
      let itemMod = attackerItem.damageMod || 1;
      const isLightBallAttacker = attackerItem && attackerItem.name ? attackerItem.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === 'lightball' : false;
      if (isLightBallAttacker) itemMod = 1;

      if (attackerItem.expertBelt && eff > 1) itemMod = 1.2;
      if (attackerItem.boostType === moveType && attackerItem.boostMod) {
         itemBoostToPower = attackerItem.boostMod;
         itemMod = 1;
      } 
      let defenderItemMod = 1;
      if (defenderItem.resistType === moveType && eff > 1) defenderItemMod = defenderItem.resistMod || 0.5; 

      let weatherMod = 1;
      if (activeWeather === 'Sun') { if (moveType === 'Fire') weatherMod = 1.5; if (moveType === 'Water') weatherMod = 0.5; } 
      else if (activeWeather === 'Rain') { if (moveType === 'Water') weatherMod = 1.5; if (moveType === 'Fire') weatherMod = 0.5; }

      let terrainMod = 1; 
      const isAttackerGrounded = !attackerPoke.types.includes('Flying') && !checkAbility(attackerState.abilityId, attackerAbility, 'Levitate', 'Levitacion') && attackerItem.id !== 'airballoon';
      const isDefenderGrounded = !defenderPoke.types.includes('Flying') && !checkAbility(defenderState.abilityId, defenderAbility, 'Levitate', 'Levitacion') && defenderItem.id !== 'airballoon';

      if (terrain === 'Electric' && isAttackerGrounded && moveType === 'Electric') terrainMod *= 1.3;
      if (terrain === 'Grassy' && isAttackerGrounded && moveType === 'Grass') terrainMod *= 1.3;
      if (terrain === 'Psychic' && isAttackerGrounded && moveType === 'Psychic') terrainMod *= 1.3;
      
      if (terrain === 'Grassy' && isDefenderGrounded && ['earthquake', 'bulldoze', 'magnitude'].includes(move.id)) terrainMod *= 0.5;
      if (terrain === 'Misty' && isDefenderGrounded && moveType === 'Dragon') terrainMod *= 0.5;

      const burnMod = (attackerState.isBurned && move.category === 'Physical' && !attackerPoke.types.includes('Fire') && !checkAbility(attackerState.abilityId, attackerAbility, 'Guts', 'Agallas')) ? 0.5 : 1;
      const spreadMod = (isDoubles && move.isSpread) ? 0.75 : 1;
      
      const screenActive = (move.category === 'Physical' && (defenderState.hasReflect || defenderState.hasAuroraVeil)) || (move.category === 'Special' && (defenderState.hasLightScreen || defenderState.hasAuroraVeil));
      let screenMod = 1;
      if (screenActive && !isCrit && !checkAbility(attackerState.abilityId, attackerAbility, 'Infiltrator', 'Allanamiento')) screenMod = isDoubles ? 0.66 : 0.5;

      const hhMod = attackerState.hasHelpingHand ? 1.5 : 1; 
      const fgMod = defenderState.hasFriendGuard ? 0.75 : 1; 
      const critMod = isCrit ? (checkAbility(attackerState.abilityId, attackerAbility, 'Sniper', 'Francotirador') ? 2.25 : 1.5) : 1;

      let finalMovePower = dynamicPower;
      if (itemBoostToPower !== 1) finalMovePower = pokeRound(finalMovePower * itemBoostToPower);

      const modsObj = { stab, eff, itemMod, defenderItemMod, weatherMod, terrainMod, burnMod, spreadMod, screenMod, hhMod, fgMod, critMod, atkAbilityMod, defAbilityMod, protectMod };
      const rolls = calculateDamageRolls(50, finalMovePower, finalAtkStat, finalDefStat, modsObj);

      const minDamage = rolls[0] * minHits; 
      const maxDamage = rolls[15] * maxHits;

      const rawMinPct = finalMovePower === 0 || eff === 0 ? 0 : (minDamage / defenderStats.hp) * 100;
      const rawMaxPct = finalMovePower === 0 || eff === 0 ? 0 : (maxDamage / defenderStats.hp) * 100;

      const displayMin = Number((Math.floor(rawMinPct * 10) / 10).toFixed(1));
      const displayMax = Number((Math.floor(rawMaxPct * 10) / 10).toFixed(1));

      const minPct = Math.min(rawMinPct, 100);
      const maxPct = Math.min(rawMaxPct, 100);

      const isImmune = eff === 0 && !isProtected; 
      let koText = '';
      
      if (isProtected) koText = 'Blocked by Protect';
      else if (isImmune) koText = `Immune (${defenderAbility.name || 'x0'})`;
      else if (finalMovePower === 0) koText = 'Status Move';
      else if (minDamage >= defenderStats.hp) koText = 'Guaranteed OHKO';
      else if (maxDamage >= defenderStats.hp) koText = `Possible OHKO${minHits !== maxHits ? ` (${maxHits} hits)` : ''}`;
      else if (minDamage * 2 >= defenderStats.hp) koText = 'Guaranteed 2HKO';
      else if (maxDamage * 2 >= defenderStats.hp) koText = 'Possible 2HKO';
      else koText = '3HKO or more';

      const isDeadly = maxPct >= 100 && !isProtected && !isImmune;

      return (
        <div key={idx} className={`relative overflow-hidden rounded-lg border p-2 transition-all ${isProtected || isImmune ? 'bg-slate-800/50 border-slate-700/50 opacity-60' : isDeadly ? 'bg-rose-900/10 border-rose-700/50' : 'bg-slate-800 border-slate-700'}`}>
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div className="flex-1 min-w-0 pr-4">
              
              {/* LAYOUT DE TIPO - NOMBRE - POTENCIA - CATEGORÍA */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <img src={`/sprites/${moveType.toLowerCase()}.png`} alt={moveType} className="h-4 object-contain shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} title={moveType} />
                <h4 className="font-bold text-sm text-white truncate max-w-[120px]">{move.name}</h4>
                <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-700/50 shrink-0" title="Base Power">
                  {finalMovePower > 0 ? finalMovePower : '-'}
                </span>
                <img src={`/sprites/${move.category.toLowerCase()}.png`} alt={move.category} className="h-4 object-contain shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} title={move.category} />
              </div>
              
              <div className="flex flex-wrap gap-1">
                {atkAbilityMod > 1 && <span className="text-[9px] bg-rose-900/50 text-rose-300 px-1 rounded">Abil Atk x{atkAbilityMod.toFixed(2)}</span>}
                {defAbilityMod < 1 && <span className="text-[9px] bg-emerald-900/50 text-emerald-300 px-1 rounded">Abil Def x{defAbilityMod.toFixed(2)}</span>}
                {isMulti && !isProtected && <span className="text-[9px] bg-purple-900/50 text-purple-300 px-1 rounded font-bold tracking-wider">Hits: {minHits === maxHits ? maxHits : `${minHits}-${maxHits}`}</span>}
                {isCrit && !isProtected && checkAbility(attackerState.abilityId, attackerAbility, 'Sniper', 'Francotirador') && <span className="text-[9px] bg-rose-900/50 text-rose-300 px-1 rounded font-bold">Sniper x2.25</span>}
                {isCrit && !isProtected && !checkAbility(attackerState.abilityId, attackerAbility, 'Sniper', 'Francotirador') && <span className="text-[10px] bg-rose-900/50 text-rose-300 px-1 rounded font-bold">Crit x1.5</span>}
                {isPartiallyProtected && <span className="text-[9px] bg-emerald-900/50 text-emerald-300 px-1 rounded font-bold tracking-wider border border-emerald-500/50">Protect Bypass (25%)</span>}
              </div>
              <p className={`text-[10px] font-bold mt-1 ${isProtected || isImmune ? 'text-slate-500' : maxDamage >= defenderStats.hp ? 'text-rose-400' : 'text-yellow-400'}`}>{koText}</p>
            </div>
            
            <div className="text-right flex flex-col items-end gap-1.5 shrink-0 pl-2">
              <div className="flex gap-1">
                {availableHits.length > 1 && !isImmune && !isProtected && finalMovePower > 0 && (
                  <select 
                    value={attackerState.hits?.[idx] || 0} 
                    onChange={(e) => {
                      const newHits = attackerState.hits ? [...attackerState.hits] : [0,0,0,0];
                      newHits[idx] = Number(e.target.value);
                      updateSingleP(attackerNum, 'hits', newHits);
                    }}
                    className="text-[9px] px-1 py-0.5 rounded font-black uppercase transition-colors border bg-slate-800 border-slate-600 text-purple-400 hover:bg-slate-700 outline-none cursor-pointer appearance-none text-center"
                    title="Choose number of hits"
                  >
                    <option value={0}>Auto</option>
                    {availableHits.map(h => <option key={h} value={h}>{h} Hits</option>)}
                  </select>
                )}
                {!isImmune && !isProtected && finalMovePower > 0 && (
                  <button onClick={() => { const nc = attackerState.crits ? [...attackerState.crits] : [false, false, false, false]; nc[idx] = !nc[idx]; updateSingleP(attackerNum, 'crits', nc); }} className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase transition-colors border ${isCrit ? 'bg-rose-600/30 border-rose-500 text-rose-400' : 'bg-slate-800 border-slate-600 text-slate-500 hover:bg-slate-700'}`}>Crit</button>
                )}
              </div>
              <span className={`text-sm font-black tracking-tight ${isProtected || isImmune ? 'text-slate-500' : isDeadly ? 'text-rose-400' : 'text-slate-200'}`}>
                {finalMovePower === 0 || isImmune || isProtected ? '0%' : `${displayMin}% - ${displayMax}%`}
              </span>
            </div>
          </div>
          {!isImmune && !isProtected && finalMovePower > 0 && (
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden relative z-10 shadow-inner">
              <div className={`absolute left-0 top-0 h-full transition-all duration-700 rounded-full ${isDeadly ? 'bg-rose-500/40' : 'bg-yellow-500/40'}`} style={{ width: `${maxPct}%` }} />
              <div className={`absolute left-0 top-0 h-full transition-all duration-700 rounded-full ${isDeadly ? 'bg-rose-500' : 'bg-yellow-500'}`} style={{ width: `${minPct}%` }} />
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 landscape:grid-cols-[1fr_200px_1fr] lg:grid-cols-[1fr_240px_1fr] gap-4">
        <div className="flex gap-3">
          <div className="flex-1 min-w-0">{renderPlayerColumn(1, p1, p1Stats)}</div>
        </div>
        
        <div className="bg-slate-800/80 rounded-xl border border-slate-600 p-4 flex flex-col gap-4 shadow-lg h-full">
          <div className="text-center border-b border-slate-700 pb-2 flex justify-center items-center px-2"><h3 className="font-black text-slate-300 uppercase tracking-widest text-[10px] flex items-center gap-1"><Activity size={14}/> Field</h3></div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-center items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-700">
              <button onClick={() => setWeather?.(weather === 'Sun' ? 'None' : 'Sun')} title="Sun" className={`p-1.5 rounded-lg transition-colors ${weather === 'Sun' ? 'bg-orange-500/20 text-orange-400' : 'text-slate-500 hover:bg-slate-700'}`}><Sun size={14} /></button>
              <button onClick={() => setWeather?.(weather === 'Rain' ? 'None' : 'Rain')} title="Rain" className={`p-1.5 rounded-lg transition-colors ${weather === 'Rain' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:bg-slate-700'}`}><CloudRain size={14} /></button>
              <button onClick={() => setWeather?.(weather === 'Sand' ? 'None' : 'Sand')} title="Sand" className={`p-1.5 rounded-lg transition-colors ${weather === 'Sand' ? 'bg-yellow-700/30 text-yellow-500' : 'text-slate-500 hover:bg-slate-700'}`}><CloudFog size={14} /></button>
              <button onClick={() => setWeather?.(weather === 'Snow' ? 'None' : 'Snow')} title="Snow" className={`p-1.5 rounded-lg transition-colors ${weather === 'Snow' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500 hover:bg-slate-700'}`}><Snowflake size={14} /></button>
            </div>
            <div className="flex justify-center items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-700">
              <button onClick={() => setTerrain?.(terrain === 'Electric' ? 'None' : 'Electric')} title="Electric" className={`p-1.5 rounded-lg transition-colors ${terrain === 'Electric' ? 'bg-yellow-400/20 text-yellow-400' : 'text-slate-500 hover:bg-slate-700'}`}><Zap size={14} /></button>
              <button onClick={() => setTerrain?.(terrain === 'Grassy' ? 'None' : 'Grassy')} title="Grassy" className={`p-1.5 rounded-lg transition-colors ${terrain === 'Grassy' ? 'bg-green-500/20 text-green-400' : 'text-slate-500 hover:bg-slate-700'}`}><Leaf size={14} /></button>
              <button onClick={() => setTerrain?.(terrain === 'Psychic' ? 'None' : 'Psychic')} title="Psychic" className={`p-1.5 rounded-lg transition-colors ${terrain === 'Psychic' ? 'bg-pink-500/20 text-pink-400' : 'text-slate-500 hover:bg-slate-700'}`}><Eye size={14} /></button>
              <button onClick={() => setTerrain?.(terrain === 'Misty' ? 'None' : 'Misty')} title="Misty" className={`p-1.5 rounded-lg transition-colors ${terrain === 'Misty' ? 'bg-fuchsia-400/20 text-fuchsia-300' : 'text-slate-500 hover:bg-slate-700'}`}><Cloud size={14} /></button>
            </div>
          </div>
          <hr className="border-slate-700" />
          <button onClick={() => setIsDoubles(!isDoubles)} className={`w-full py-2 rounded-lg text-xs font-bold flex justify-center items-center gap-2 transition-colors border ${isDoubles ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-700'}`}><Users size={14}/> Double Target</button>
          <div className="flex gap-2 w-full h-full">
            <div className="flex-1 flex flex-col gap-1.5 border-r border-slate-700 pr-2">
              <h4 className="text-center text-blue-400 text-[10px] uppercase font-black tracking-wider mb-1">Side A</h4>
              <EffectToggle active={p1.hasProtect} onClick={() => updateSingleP(1, 'hasProtect', !p1.hasProtect)} label="Protect" colorClass="emerald" />
              <EffectToggle active={p1.isBurned} onClick={() => updateSingleP(1, 'isBurned', !p1.isBurned)} label="Burned" colorClass="orange" />
              <EffectToggle active={p1.isParalyzed} onClick={() => updateSingleP(1, 'isParalyzed', !p1.isParalyzed)} label="Paralyzed" colorClass="yellow" />
              <EffectToggle active={p1.hasTailwind} onClick={() => updateSingleP(1, 'hasTailwind', !p1.hasTailwind)} label="Tailwind" colorClass="cyan" />
              <EffectToggle active={p1.hasReflect} onClick={() => updateSingleP(1, 'hasReflect', !p1.hasReflect)} label="Reflect" colorClass="fuchsia" />
              <EffectToggle active={p1.hasLightScreen} onClick={() => updateSingleP(1, 'hasLightScreen', !p1.hasLightScreen)} label="Light Screen" colorClass="fuchsia" />
              <EffectToggle active={p1.hasAuroraVeil} onClick={() => updateSingleP(1, 'hasAuroraVeil', !p1.hasAuroraVeil)} label="Aurora Veil" colorClass="fuchsia" />
              <EffectToggle active={p1.hasHelpingHand} onClick={() => updateSingleP(1, 'hasHelpingHand', !p1.hasHelpingHand)} label="Helping Hand" colorClass="indigo" />
            </div>
            <div className="flex-1 flex flex-col gap-1.5 pl-1">
              <h4 className="text-center text-rose-400 text-[10px] uppercase font-black tracking-wider mb-1">Side B</h4>
              <EffectToggle active={p2.hasProtect} onClick={() => updateSingleP(2, 'hasProtect', !p2.hasProtect)} label="Protect" colorClass="emerald" />
              <EffectToggle active={p2.isBurned} onClick={() => updateSingleP(2, 'isBurned', !p2.isBurned)} label="Burned" colorClass="orange" />
              <EffectToggle active={p2.isParalyzed} onClick={() => updateSingleP(2, 'isParalyzed', !p2.isParalyzed)} label="Paralyzed" colorClass="yellow" />
              <EffectToggle active={p2.hasTailwind} onClick={() => updateSingleP(2, 'hasTailwind', !p2.hasTailwind)} label="Tailwind" colorClass="cyan" />
              <EffectToggle active={p2.hasReflect} onClick={() => updateSingleP(2, 'hasReflect', !p2.hasReflect)} label="Reflect" colorClass="fuchsia" />
              <EffectToggle active={p2.hasLightScreen} onClick={() => updateSingleP(2, 'hasLightScreen', !p2.hasLightScreen)} label="Light Screen" colorClass="fuchsia" />
              <EffectToggle active={p2.hasAuroraVeil} onClick={() => updateSingleP(2, 'hasAuroraVeil', !p2.hasAuroraVeil)} label="Aurora Veil" colorClass="fuchsia" />
              <EffectToggle active={p2.hasHelpingHand} onClick={() => updateSingleP(2, 'hasHelpingHand', !p2.hasHelpingHand)} label="Helping Hand" colorClass="indigo" />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 min-w-0">{renderPlayerColumn(2, p2, p2Stats)}</div>
        </div>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 shadow-inner">
        <h3 className="text-center font-black text-slate-500 uppercase tracking-widest mb-6 text-xs">Damage Exchange</h3>
        <div className="grid grid-cols-1 landscape:grid-cols-2 md:grid-cols-2 gap-6">
          <div className="space-y-2"><h4 className="text-sm font-bold text-blue-400 flex items-center gap-2"><Swords size={14}/> Pokémon A attacks B</h4>{renderDamageBars(1, p1, p2, p1Stats, p2Stats)}</div>
          <div className="space-y-2"><h4 className="text-sm font-bold text-rose-400 flex items-center gap-2"><Swords size={14}/> Pokémon B attacks A</h4>{renderDamageBars(2, p2, p1, p2Stats, p1Stats)}</div>
        </div>
      </div>
    </div>
  );
}