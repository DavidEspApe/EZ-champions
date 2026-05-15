import { useState, useMemo, useRef, useEffect } from 'react';
import { Shield, Crosshair, Heart, ShieldAlert, Activity, Package, Sparkles, Flame, Users, RotateCcw, Search, ChevronDown } from 'lucide-react';
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

// --- SISTEMAS DE SPRITES HD Y RESCATE LOCAL ---
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
  if (target.src.includes('play.pokemonshowdown.com')) {
    const urlParts = target.src.split('/');
    const fileName = urlParts[urlParts.length - 1];
    target.src = `/sprites/${fileName}`;
  } 
  else if (target.src.includes('/sprites/') && target.src.includes('-')) {
    target.src = target.src.replace(/-/g, '');
  } 
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

const EvInput = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => {
  const [val, setVal] = useState(value.toString());
  useEffect(() => { setVal(value.toString()); }, [value]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed)) onChange(Math.min(32, Math.max(0, parsed)));
  };
  const handleBlur = () => {
    let parsed = parseInt(val, 10);
    if (isNaN(parsed) || parsed < 0) parsed = 0;
    if (parsed > 32) parsed = 32;
    setVal(parsed.toString());
    onChange(parsed);
  };
  return (
    <input type="number" min="0" max="32" value={val} onChange={handleChange} onBlur={handleBlur} className="w-8 text-[10px] text-center font-bold bg-slate-800 border border-slate-600 rounded text-white focus:border-blue-400 focus:bg-slate-700 outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
  );
};

const NatureSelect = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => (
  <div className="flex items-center bg-slate-800 rounded border border-slate-600 overflow-hidden shrink-0">
    <button onClick={() => onChange(1.1)} className={`w-6 py-0.5 text-[10px] font-black transition-colors ${value > 1.0 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`} title="Beneficial Nature (+10%)">+</button>
    <button onClick={() => onChange(1.0)} className={`w-6 py-0.5 text-[10px] font-black transition-colors border-l border-r border-slate-700 ${value === 1.0 ? 'bg-slate-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`} title="Neutral Nature">...</button>
    <button onClick={() => onChange(0.9)} className={`w-6 py-0.5 text-[10px] font-black transition-colors ${value < 1.0 ? 'bg-rose-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`} title="Hindering Nature (-10%)">-</button>
  </div>
);

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

export default function DefenseMode({ weather, terrain, setWeather, setTerrain }: { weather?: Weather, terrain?: Terrain, setWeather?: (w: Weather) => void, setTerrain?: (t: Terrain) => void }) {
  const [userSpeciesId, setUserSpeciesId] = useLocalStorage('def-user-species', 'corviknight');
  const userPokemon = POKEDEX[userSpeciesId] || POKEDEX['corviknight'];
  
  const [userAbilityId, setUserAbilityId] = useLocalStorage('def-user-ability', userPokemon.abilities[0]);
  const [userItemId, setUserItemId] = useLocalStorage('def-user-item', 'None');
  const userAbility = ABILITIES_DB[userAbilityId] || ABILITIES_DB['No Ability'];
  const userItem = ITEMS_DB[userItemId] || ITEMS_DB['None'];

  const transformData = getTransformData(userSpeciesId, userItemId);

  const [hpEvs, setHpEvs] = useLocalStorage('def-user-hpevs', 0);
  const [defEvs, setDefEvs] = useLocalStorage('def-user-defevs', 0);
  const [spdEvs, setSpdEvs] = useLocalStorage('def-user-spdevs', 0);
  const [defNature, setDefNature] = useLocalStorage('def-user-defnature', 1.0);
  const [spdNature, setSpdNature] = useLocalStorage('def-user-spdnature', 1.0);
  
  const [userProtect, setUserProtect] = useLocalStorage('def-user-protect', false);

  const [rivalBuildId, setRivalBuildId] = useLocalStorage('def-rival-build', VGC_BUILDS[0].id);

  const [rivalSpeciesOverride, setRivalSpeciesOverride] = useState<string | null>(null);
  const [rivalAbilityOverride, setRivalAbilityOverride] = useState<string | null>(null);

  const [isBurned, setIsBurned] = useLocalStorage('def-rival-burn', false);
  const [isDoubles, setIsDoubles] = useLocalStorage('def-rival-doubles', false);
  
  const [crits, setCrits] = useState<boolean[]>([false, false, false, false]);
  const [hitsSelected, setHitsSelected] = useState<number[]>([0, 0, 0, 0]);

  const handleSpeciesChange = (newSpeciesId: string) => {
    setUserSpeciesId(newSpeciesId);
    setUserAbilityId(POKEDEX[newSpeciesId]?.abilities[0] || 'No Ability');
    
    // Reseteos al cambiar de Pokémon
    setHpEvs(0);
    setDefEvs(0);
    setSpdEvs(0);
    setDefNature(1.0);
    setSpdNature(1.0);
    
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
    setUserSpeciesId('corviknight'); setUserAbilityId(POKEDEX['corviknight'].abilities[0] || 'No Ability'); setUserItemId('None');
    setHpEvs(0); setDefEvs(0); setSpdEvs(0); setDefNature(1.0); setSpdNature(1.0);
    setUserProtect(false); setIsBurned(false); setIsDoubles(false); setRivalBuildId(VGC_BUILDS[0].id);
    setCrits([false, false, false, false]);
    setHitsSelected([0, 0, 0, 0]);
    setWeather?.('None'); setTerrain?.('None');
  };

  const activeBuild = useMemo(() => VGC_BUILDS.find(b => b.id === rivalBuildId) || VGC_BUILDS[0], [rivalBuildId]);
  const rivalPokemon = POKEDEX[rivalSpeciesOverride || activeBuild.speciesId] || POKEDEX['garchomp'];
  const rivalAbilityId = rivalAbilityOverride || activeBuild.abilityId;
  const rivalAbility = ABILITIES_DB[rivalAbilityId] || { name: rivalAbilityId }; 
  const rivalItem = ITEMS_DB[activeBuild.itemId] || { name: activeBuild.itemId };

  const isLightBall = rivalItem && rivalItem.name ? rivalItem.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === 'lightball' : false;
  const itemAtkMod = isLightBall ? (rivalPokemon.id.includes('pikachu') ? 2 : 1) : (rivalItem.atkMod || 1);
  const itemSpaMod = isLightBall ? (rivalPokemon.id.includes('pikachu') ? 2 : 1) : (rivalItem.spaMod || 1);

  const rivalBaseAtk = useMemo(() => calcStat(rivalPokemon.baseStats.atk, activeBuild.defaultEvs.atk || 0, activeBuild.defaultNature.atk || 1.0), [rivalPokemon, activeBuild]);
  const rivalBaseSpa = useMemo(() => calcStat(rivalPokemon.baseStats.spa, activeBuild.defaultEvs.spa || 0, activeBuild.defaultNature.spa || 1.0), [rivalPokemon, activeBuild]);

  const finalRivalAtk = Math.floor(rivalBaseAtk * itemAtkMod);
  const finalRivalSpa = Math.floor(rivalBaseSpa * itemSpaMod);

  const attackerHasMegaSol = checkAbility(activeBuild.abilityId, rivalAbility, 'Mega Sol', 'Mega Sol');
  const activeWeather = attackerHasMegaSol ? 'Sun' : weather;
  const isFairyAuraOnField = checkAbility(userAbilityId, userAbility, 'Fairy Aura', 'Aura Feerica') || checkAbility(activeBuild.abilityId, rivalAbility, 'Fairy Aura', 'Aura Feerica');

  const currentHp = useMemo(() => calcHP(userPokemon.baseStats.hp, hpEvs), [userPokemon, hpEvs]);
  const baseDefStat = useMemo(() => calcStat(userPokemon.baseStats.def, defEvs, defNature), [userPokemon, defEvs, defNature]);
  const baseSpdStat = useMemo(() => calcStat(userPokemon.baseStats.spd, spdEvs, spdNature), [userPokemon, spdEvs, spdNature]);
  const baseUserAtk = useMemo(() => calcStat(userPokemon.baseStats.atk, 0, 1.0), [userPokemon]); 

  let finalDefStat = Math.floor(baseDefStat * (userItem.defMod || 1));
  let finalSpdStat = Math.floor(baseSpdStat * (userItem.spdMod || 1));

  if (!attackerHasMegaSol) {
    if (weather === 'Snow' && userPokemon.types.includes('Ice')) finalDefStat = Math.floor(finalDefStat * 1.5);
    if (weather === 'Sand' && userPokemon.types.includes('Rock')) finalSpdStat = Math.floor(finalSpdStat * 1.5);
  }
  if (checkAbility(userAbilityId, userAbility, 'Marvel Scale', 'Escama Especial')) finalDefStat = Math.floor(finalDefStat * 1.5);

  return (
    <div className="flex flex-col xl:grid xl:grid-cols-3 gap-4 xl:gap-8 w-full max-w-7xl mx-auto p-4">
      
      {/* --- PANEL DE TU POKÉMON (DEFENSOR) --- */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-3 sm:p-5 col-span-1 flex flex-col gap-4 sm:gap-5 overflow-hidden">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-2 border-b border-slate-700 pb-2">
          <div className="flex items-center gap-2 text-blue-400">
            <Shield size={20} />
            <h3 className="font-bold text-lg">Defender (You)</h3>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setUserProtect(!userProtect)} className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors border ${userProtect ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-600 text-slate-500 hover:bg-slate-700'}`}>
              <ShieldAlert size={12}/> Protect
            </button>
            <button onClick={handleReset} title="Reset Defender" className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-rose-600 transition-colors">
              <RotateCcw size={14}/>
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row items-center xl:items-start gap-4 w-full">
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-20 h-20 flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-700 shadow-inner overflow-hidden">
              <img src={getSpriteUrl(userSpeciesId)} alt={userPokemon.name} className="max-h-16 object-contain" onError={handleSpriteError} />
            </div>
            <div className="flex gap-1">
              {userPokemon.types.map(t => (
                <span key={t} className={`${TYPE_COLORS[t]} text-white text-[8px] font-black px-1 rounded uppercase border border-black/10`}>
                  {t.substring(0,3)}
                </span>
              ))}
            </div>
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 xl:gap-3 w-full">
          <div>
            <label className="block text-sm mb-1 text-slate-400 flex items-center gap-1"><Sparkles size={14}/> Ability</label>
            <select value={userAbilityId} onChange={(e) => setUserAbilityId(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 outline-none text-blue-300">
              {userPokemon.abilities.map((ab: string) => <option key={ab} value={ab}>{ABILITIES_DB[ab]?.name || ab}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-400 flex items-center gap-1"><Package size={14}/> Item</label>
            <ItemSelector 
                selectedId={userItemId} 
                onSelect={setUserItemId} 
                colorClass="text-emerald-300 hover:border-emerald-500" 
                disabled={isMegaForm(userSpeciesId)} 
              />
          </div>
        </div>

        <div className="space-y-4 mt-2">
          <div className="bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-700">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-2 mb-2">
              <span className="flex items-center gap-2 font-bold text-emerald-400"><Heart size={16}/> HP</span>
              <span className="text-xl font-mono text-white">{currentHp}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-slate-400 font-bold">EVs:</span>
              <input type="range" min="0" max="32" step="1" value={hpEvs} onChange={(e) => setHpEvs(Number(e.target.value))} className="flex-1 accent-emerald-500 rounded-full h-1.5 appearance-none cursor-pointer" style={getSliderStyle(hpEvs, 'rgba(16, 185, 129, 0.4)')} />
              <EvInput value={hpEvs} onChange={setHpEvs} />
            </div>
          </div>
          <div className="bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-700">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-2 mb-2">
              <span className="flex items-center gap-1 font-bold text-orange-400"><ShieldAlert size={16}/> Physical Def</span>
              <div className="flex items-center gap-2">
                <NatureSelect value={defNature} onChange={setDefNature} />
                <span className="text-xl font-mono text-white flex items-center gap-1">
                  {finalDefStat}
                  {!attackerHasMegaSol && weather === 'Snow' && userPokemon.types.includes('Ice') && <span className="text-[10px] text-cyan-300 bg-cyan-900/50 px-1 rounded ml-1">Snow</span>}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-slate-400 font-bold">EVs:</span>
              <input type="range" min="0" max="32" step="1" value={defEvs} onChange={(e) => setDefEvs(Number(e.target.value))} className="flex-1 accent-orange-500 rounded-full h-1.5 appearance-none cursor-pointer" style={getSliderStyle(defEvs, 'rgba(249, 115, 22, 0.4)')} />
              <EvInput value={defEvs} onChange={setDefEvs} />
            </div>
          </div>
          <div className="bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-700">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-2 mb-2">
              <span className="flex items-center gap-1 font-bold text-indigo-400"><Activity size={16}/> Special Def</span>
              <div className="flex items-center gap-2">
                <NatureSelect value={spdNature} onChange={setSpdNature} />
                <span className="text-xl font-mono text-white flex items-center gap-1">
                  {finalSpdStat}
                  {!attackerHasMegaSol && weather === 'Sand' && userPokemon.types.includes('Rock') && <span className="text-[10px] text-yellow-500 bg-yellow-900/50 px-1 rounded ml-1">Sand</span>}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-slate-400 font-bold">EVs:</span>
              <input type="range" min="0" max="32" step="1" value={spdEvs} onChange={(e) => setSpdEvs(Number(e.target.value))} className="flex-1 accent-indigo-500 rounded-full h-1.5 appearance-none cursor-pointer" style={getSliderStyle(spdEvs, 'rgba(99, 102, 241, 0.4)')} />
              <EvInput value={spdEvs} onChange={setSpdEvs} />
            </div>
          </div>
        </div>
      </div>

      {/* --- PANEL DEL RIVAL (ATACANTE) --- */}
      <div className="col-span-1 xl:col-span-2 space-y-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 sm:p-5 overflow-hidden">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-2 border-b border-slate-700 pb-2 mb-4">
            <div className="flex items-center gap-2 text-rose-400">
              <Crosshair size={20} />
              <h3 className="font-bold text-lg">Attacker (Rival)</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsBurned(!isBurned)} className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors border ${isBurned ? 'bg-orange-600/30 border-orange-500 text-orange-300' : 'bg-slate-800 border-slate-600 text-slate-500'}`}>
                <Flame size={12}/> Burn Rival
              </button>
              <button onClick={() => setIsDoubles(!isDoubles)} className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors border ${isDoubles ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300' : 'bg-slate-800 border-slate-600 text-slate-500'}`}>
                <Users size={12}/> Double Target
              </button>
            </div>
          </div>
          
          <div className="flex flex-col xl:flex-row gap-4 mb-4 items-center xl:items-start w-full">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="w-20 h-20 flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-700 shadow-inner overflow-hidden">
                <img src={getSpriteUrl(rivalPokemon.id)} alt={rivalPokemon.name} className="max-h-16 object-contain" onError={handleSpriteError} />
              </div>
              <div className="flex gap-1">
                {rivalPokemon.types.map(t => (
                  <span key={t} className={`${TYPE_COLORS[t]} text-white text-[8px] font-black px-1 rounded uppercase border border-black/10`}>
                    {t.substring(0,3)}
                  </span>
                ))}
              </div>
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
              <div className="flex flex-col xl:flex-row gap-2 w-full">
                <div className="p-2 flex-1 bg-slate-900/80 rounded border border-yellow-900/50 text-xs text-yellow-300 flex items-center gap-2">
                  <Sparkles size={14} className="shrink-0" />
                  <span className="truncate font-bold">{rivalAbility.name}</span>
                </div>
                <div className="p-2 flex-1 bg-slate-900/80 rounded border border-rose-900/50 text-xs text-rose-300 flex items-center gap-2">
                  <img src={getItemSpriteUrl(rivalItem.name)} alt="" className="w-4 h-4 object-contain flex-shrink-0" onError={handleIconError} />
                  <span className="truncate font-bold">{rivalItem.name}</span>
                </div>
              </div>
            </div>
          </div>
            
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 xl:gap-3 mb-6">
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                Physical Attack
                {activeBuild.defaultNature?.atk === 1.1 && <span className="text-rose-400 font-black text-xs">+</span>}
                {activeBuild.defaultNature?.atk === 0.9 && <span className="text-blue-400 font-black text-xs">-</span>}
              </span>
              <span className="text-lg font-mono text-white flex items-center gap-1">
                {finalRivalAtk}
              </span>
            </div>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                Special Attack
                {activeBuild.defaultNature?.spa === 1.1 && <span className="text-rose-400 font-black text-xs">+</span>}
                {activeBuild.defaultNature?.spa === 0.9 && <span className="text-blue-400 font-black text-xs">-</span>}
              </span>
              <span className="text-lg font-mono text-white flex items-center gap-1">
                {finalRivalSpa}
              </span>
            </div>
          </div>
        </div>

        {/* --- CÁLCULO DE DAÑO Y MOTOR SÚPER-AVANZADO --- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 w-full">
          {activeBuild.moves.map((moveId, idx) => {
            const move = MOVES_DB[moveId]; 
            if (!move) return <div key={idx} className="rounded-xl border border-dashed border-slate-700 bg-slate-800/30 flex items-center justify-center p-8 text-slate-500 text-xs">Empty</div>;
            
            const isCrit = crits[idx];

            let atkStatUsed = move.overrideOffensiveStat === 'def' 
              ? defStatUsed 
              : (move.useTargetAttack ? baseUserAtk : (move.category === 'Physical' ? finalRivalAtk : finalRivalSpa));
              
            let defStatUsed = (move.category === 'Physical' || move.overrideDefensiveStat === 'def') 
              ? finalDefStat 
              : finalSpdStat;

            // --- PROTECT & BYPASS LOGIC (25% DAMAGE REDUCTION) ---
            let isProtected = false;
            let protectMod = 1;
            let isPartiallyProtected = false;
            
            if (userProtect && move.category !== 'Status') {
              const hasUnseenFist = checkAbility(activeBuild.abilityId, rivalAbility, 'Unseen Fist', 'Puño Invisible');
              const hasPiercingDrill = checkAbility(activeBuild.abilityId, rivalAbility, 'Piercing Drill', 'Taladro Perforador');
              
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
              if (checkAbility(activeBuild.abilityId, rivalAbility, 'Skill Link', 'Encadenar')) {
                availableHits = [5];
              } else {
                if (['doublekick', 'doublehit', 'dualwingbeat', 'dragondarts', 'bonemerang', 'geargrind', 'dualchop', 'twinbeam'].includes(move.id)) availableHits = [2];
                else if (['surgingstrikes', 'tripleaxel', 'triplekick'].includes(move.id)) availableHits = [3];
                else if (move.id === 'populationbomb') availableHits = [1,2,3,4,5,6,7,8,9,10];
                else availableHits = [2, 3, 4, 5];
              }
            } else if (checkAbility(activeBuild.abilityId, rivalAbility, 'Parental Bond', 'Amor Filial')) {
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

            const attackerWeight = getWeight(rivalPokemon, activeBuild.abilityId, rivalAbility, rivalItem);
            const defenderWeight = getWeight(userPokemon, userAbilityId, userAbility, userItem);
            
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
              if (!activeBuild.itemId || activeBuild.itemId === 'None' || activeBuild.itemId === 'No Item') {
                dynamicPower *= 2;
              }
            }

            // --- CAMBIO DE TIPO DEL ATAQUE ---
            let typeAbilityMod = 1;
            if (moveType === 'Normal') {
              if (checkAbility(activeBuild.abilityId, rivalAbility, 'Pixilate', 'Piel Feerica')) { moveType = 'Fairy'; typeAbilityMod = 1.3; }
              else if (checkAbility(activeBuild.abilityId, rivalAbility, 'Aerilate', 'Piel Celeste')) { moveType = 'Flying'; typeAbilityMod = 1.3; }
              else if (checkAbility(activeBuild.abilityId, rivalAbility, 'Refrigerate', 'Piel Helada')) { moveType = 'Ice'; typeAbilityMod = 1.3; }
              else if (checkAbility(activeBuild.abilityId, rivalAbility, 'Dragonize', 'Dragonize')) { moveType = 'Dragon'; typeAbilityMod = 1.2; }
            }
            if (move.flags?.includes('sound') && checkAbility(activeBuild.abilityId, rivalAbility, 'Liquid Voice', 'Voz Liquida')) moveType = 'Water';

            let stab = (rivalPokemon.types.includes(moveType) || checkAbility(activeBuild.abilityId, rivalAbility, 'Protean', 'Mutatipo')) ? 1.5 : 1;
            if (stab > 1 && checkAbility(activeBuild.abilityId, rivalAbility, 'Adaptability', 'Adaptable')) stab = 2;

            // --- EFECTIVIDAD E INMUNIDADES INTELIGENTES ---
            let eff = getEffectiveness(moveType, userPokemon.types);
            if (move.isFreezeDry && userPokemon.types.includes('Water')) eff *= 4; 

            if (checkAbility(activeBuild.abilityId, rivalAbility, 'Scrappy', 'Intrepido') && (moveType === 'Normal' || moveType === 'Fighting')) {
              eff = getEffectiveness(moveType, userPokemon.types.filter((t: string) => t !== 'Ghost'));
            }

            if (moveType === 'Ground' && (checkAbility(userAbilityId, userAbility, 'Levitate', 'Levitacion') || checkAbility(userAbilityId, userAbility, 'Earth Eater', 'Geofagia'))) eff = 0;
            if (moveType === 'Water' && (checkAbility(userAbilityId, userAbility, 'Water Absorb', 'Absorbe Agua') || checkAbility(userAbilityId, userAbility, 'Storm Drain', 'Colector'))) eff = 0;
            if (moveType === 'Electric' && (checkAbility(userAbilityId, userAbility, 'Volt Absorb', 'Absorbe Elec') || checkAbility(userAbilityId, userAbility, 'Motor Drive', 'Electromotor') || checkAbility(userAbilityId, userAbility, 'Lightning Rod', 'Pararrayos'))) eff = 0;
            if (moveType === 'Fire' && checkAbility(userAbilityId, userAbility, 'Flash Fire', 'Absorbe Fuego')) eff = 0;
            if (moveType === 'Grass' && checkAbility(userAbilityId, userAbility, 'Sap Sipper', 'Herbivoro')) eff = 0;
            if (move.flags?.includes('sound') && checkAbility(userAbilityId, userAbility, 'Soundproof', 'Insonorizar')) eff = 0;
            if (move.flags?.includes('bullet') && checkAbility(userAbilityId, userAbility, 'Bulletproof', 'Antibalas')) eff = 0;

            if (isProtected) eff = 0;

            // --- MULTIPLICADORES DEL ATACANTE (RIVAL) ---
            let atkAbilityMod = 1;
            if (move.category === 'Physical' && checkAbility(activeBuild.abilityId, rivalAbility, 'Huge Power', 'Potencia')) atkAbilityMod *= 2;
            if (move.category === 'Physical' && checkAbility(activeBuild.abilityId, rivalAbility, 'Pure Power', 'Energia Pura')) atkAbilityMod *= 2;
            if (move.category === 'Physical' && checkAbility(activeBuild.abilityId, rivalAbility, 'Guts', 'Agallas') && isBurned) atkAbilityMod *= 1.5;
            if (move.category === 'Special' && checkAbility(activeBuild.abilityId, rivalAbility, 'Solar Power', 'Poder Solar') && activeWeather === 'Sun') atkAbilityMod *= 1.5;
            if (checkAbility(activeBuild.abilityId, rivalAbility, 'Sand Force', 'Poder Arena') && weather === 'Sand' && ['Rock', 'Ground', 'Steel'].includes(moveType)) atkAbilityMod *= 1.3;
            if (checkAbility(activeBuild.abilityId, rivalAbility, 'Tough Claws', 'Garra Dura') && move.flags?.includes('contact')) atkAbilityMod *= 1.33;
            if (checkAbility(activeBuild.abilityId, rivalAbility, 'Iron Fist', 'Puno Ferreo') && move.flags?.includes('punch')) atkAbilityMod *= 1.2;
            if (checkAbility(activeBuild.abilityId, rivalAbility, 'Reckless', 'Audaz') && move.flags?.includes('recoil')) atkAbilityMod *= 1.2;
            if (checkAbility(activeBuild.abilityId, rivalAbility, 'Sharpness', 'Cortante') && move.flags?.includes('slicing')) atkAbilityMod *= 1.5;
            if (checkAbility(activeBuild.abilityId, rivalAbility, 'Mega Launcher', 'Megadisparador') && move.flags?.includes('pulse')) atkAbilityMod *= 1.5;
            if (checkAbility(activeBuild.abilityId, rivalAbility, 'Strong Jaw', 'Mandibula Fuerte') && move.flags?.includes('bite')) atkAbilityMod *= 1.5;
            if (checkAbility(activeBuild.abilityId, rivalAbility, 'Technician', 'Experto') && dynamicPower <= 60) atkAbilityMod *= 1.5;
            if (checkAbility(activeBuild.abilityId, rivalAbility, 'Water Bubble', 'Pompa') && moveType === 'Water') atkAbilityMod *= 2;
            if (checkAbility(activeBuild.abilityId, rivalAbility, 'Sheer Force', 'Potencia Bruta') && move.flags?.includes('secondary')) atkAbilityMod *= 1.3;
            
            if (moveType === 'Fairy' && isFairyAuraOnField) atkAbilityMod *= 1.333;
            atkAbilityMod *= typeAbilityMod;

            // --- MULTIPLICADORES DEL DEFENSOR (TÚ) ---
            let defAbilityMod = 1;
            if (checkAbility(userAbilityId, userAbility, 'Thick Fat', 'Sebo') && ['Fire', 'Ice'].includes(moveType)) defAbilityMod *= 0.5;
            if (checkAbility(userAbilityId, userAbility, 'Fur Coat', 'Pelaje Recio') && move.category === 'Physical') defAbilityMod *= 0.5;
            if (checkAbility(userAbilityId, userAbility, 'Water Bubble', 'Pompa') && moveType === 'Fire') defAbilityMod *= 0.5;
            if (checkAbility(userAbilityId, userAbility, 'Fluffy', 'Peluche')) {
              if (move.flags?.includes('contact')) defAbilityMod *= 0.5;
              if (moveType === 'Fire') defAbilityMod *= 2;
            }
            if (checkAbility(userAbilityId, userAbility, 'Multiscale', 'Compensacion')) defAbilityMod *= 0.5;
            if (checkAbility(userAbilityId, userAbility, 'Solid Rock', 'Roca Solida') && eff > 1) defAbilityMod *= 0.75;
            if (checkAbility(userAbilityId, userAbility, 'Filter', 'Filtro') && eff > 1) defAbilityMod *= 0.75;

            // --- CLIMAS, ESTADOS Y TERRENOS ---
            let itemBoostToPower = 1;
      let itemMod = rivalItem.damageMod || 1; 
      const isLightBallAttacker = rivalItem && rivalItem.name ? rivalItem.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === 'lightball' : false;
      if (isLightBallAttacker) itemMod = 1;

      if (rivalItem.expertBelt && eff > 1) itemMod = 1.2;
      if (rivalItem.boostType === moveType && rivalItem.boostMod) {
         itemBoostToPower = rivalItem.boostMod;
         itemMod = 1; 
      }
      let defenderItemMod = 1;
      if (userItem.resistType === moveType && eff > 1) defenderItemMod = userItem.resistMod || 0.5; 

      let weatherMod = 1;
      if (activeWeather === 'Sun') { if (moveType === 'Fire') weatherMod = 1.5; if (moveType === 'Water') weatherMod = 0.5; } 
      else if (activeWeather === 'Rain') { if (moveType === 'Water') weatherMod = 1.5; if (moveType === 'Fire') weatherMod = 0.5; }

      let terrainMod = 1; 
      const isAttackerGrounded = !rivalPokemon.types.includes('Flying') && !checkAbility(activeBuild.abilityId, rivalAbility, 'Levitate', 'Levitacion') && rivalItem.id !== 'airballoon';
      const isDefenderGrounded = !userPokemon.types.includes('Flying') && !checkAbility(userAbilityId, userAbility, 'Levitate', 'Levitacion') && userItem.id !== 'airballoon';

      if (terrain === 'Electric' && isAttackerGrounded && moveType === 'Electric') terrainMod *= 1.3;
      if (terrain === 'Grassy' && isAttackerGrounded && moveType === 'Grass') terrainMod *= 1.3;
      if (terrain === 'Psychic' && isAttackerGrounded && moveType === 'Psychic') terrainMod *= 1.3;
      
      if (terrain === 'Grassy' && isDefenderGrounded && ['earthquake', 'bulldoze', 'magnitude'].includes(move.id)) terrainMod *= 0.5;
      if (terrain === 'Misty' && isDefenderGrounded && moveType === 'Dragon') terrainMod *= 0.5;

      const burnMod = (isBurned && move.category === 'Physical' && !rivalPokemon.types.includes('Fire') && !checkAbility(activeBuild.abilityId, rivalAbility, 'Guts', 'Agallas')) ? 0.5 : 1;
      const spreadMod = (isDoubles && move.isSpread) ? 0.75 : 1;
      const critMod = isCrit ? (checkAbility(activeBuild.abilityId, rivalAbility, 'Sniper', 'Francotirador') ? 2.25 : 1.5) : 1;

      let finalMovePower = dynamicPower;
      if (itemBoostToPower !== 1) finalMovePower = pokeRound(finalMovePower * itemBoostToPower);

      const modsObj = { stab, eff, itemMod, defenderItemMod, weatherMod, terrainMod, burnMod, spreadMod, critMod, atkAbilityMod, defAbilityMod, protectMod };
      const rolls = calculateDamageRolls(50, finalMovePower, atkStatUsed, defStatUsed, modsObj);
      
      const minDamage = rolls[0] * minHits; 
      const maxDamage = rolls[15] * maxHits;
      
      const rawMinPct = finalMovePower === 0 || eff === 0 ? 0 : (minDamage / currentHp) * 100;
      const rawMaxPct = finalMovePower === 0 || eff === 0 ? 0 : (maxDamage / currentHp) * 100;

      const displayMin = Number((Math.floor(rawMinPct * 10) / 10).toFixed(1));
      const displayMax = Number((Math.floor(rawMaxPct * 10) / 10).toFixed(1));

      const minPct = Math.min(rawMinPct, 100);
      const maxPct = Math.min(rawMaxPct, 100);

      const isImmune = eff === 0 && !isProtected;
      let koText = '';
            
            if (isProtected) koText = 'Blocked by Protect';
            else if (isImmune) koText = `Immune (${userAbility.name || 'x0'})`;
            else if (finalMovePower === 0) koText = 'Status Move';
            else if (minDamage >= currentHp) koText = 'Guaranteed OHKO';
            else if (maxDamage >= currentHp) koText = `Possible OHKO${minHits !== maxHits ? ` (${maxHits} hits)` : ''}`;
            else if (minDamage * 2 >= currentHp) koText = 'Guaranteed 2HKO';
            else if (maxDamage * 2 >= currentHp) koText = 'Possible 2HKO';
            else koText = '3HKO or more';

            const isDeadly = maxPct >= 100 && !isProtected && !isImmune;

            return (
              <div key={idx} className={`relative overflow-hidden rounded-xl border p-4 transition-all ${isProtected || isImmune ? 'opacity-60 bg-slate-800 border-slate-700/50' : isDeadly ? 'bg-rose-900/10 border-rose-700/50' : 'bg-slate-800 border-slate-700'}`}>
                <div className="flex justify-between items-start mb-4 relative z-10 px-1 sm:px-0">
                  <div className="flex-1 min-w-0">
                    
                    {/* LAYOUT DE TIPO - NOMBRE - POTENCIA - CATEGORÍA */}
                    <div className="flex items-center gap-1.5 w-full">
                      <img src={`/sprites/${moveType.toLowerCase()}.png`} alt={moveType} className="h-4 object-contain shrink-0" onError={handleIconError} title={moveType} />
                      <h4 className="font-bold text-sm text-white flex-1 whitespace-normal break-words leading-tight">{move.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-900/50 px-1 rounded border border-slate-700/50 shrink-0" title="Base Power">
                        {finalMovePower > 0 ? finalMovePower : '-'}
                      </span>
                      <img src={`/sprites/${move.category.toLowerCase()}.png`} alt={move.category} className="h-4 object-contain shrink-0" onError={handleIconError} title={move.category} />
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-1">
                      {atkAbilityMod > 1 && <span className="text-[10px] bg-rose-900/50 text-rose-300 px-1 rounded">Abil Atk x{atkAbilityMod.toFixed(2)}</span>}
                      {defAbilityMod < 1 && <span className="text-[10px] bg-emerald-900/50 text-emerald-300 px-1 rounded">Abil Def x{defAbilityMod.toFixed(2)}</span>}
                      {isMulti && !isProtected && <span className="text-[10px] bg-purple-900/50 text-purple-300 px-1 rounded font-bold tracking-wider">Hits: {minHits === maxHits ? maxHits : `${minHits}-${maxHits}`}</span>}
                      {isCrit && !isProtected && checkAbility(activeBuild.abilityId, rivalAbility, 'Sniper', 'Francotirador') && <span className="text-[10px] bg-rose-900/50 text-rose-300 px-1 rounded font-bold">Sniper x2.25</span>}
                      {isCrit && !isProtected && !checkAbility(activeBuild.abilityId, rivalAbility, 'Sniper', 'Francotirador') && <span className="text-[10px] bg-rose-900/50 text-rose-300 px-1 rounded font-bold">Crit x1.5</span>}
                      {isPartiallyProtected && <span className="text-[10px] bg-emerald-900/50 text-emerald-300 px-1 rounded font-bold tracking-wider border border-emerald-500/50">Protect Bypass (25%)</span>}
                    </div>

                    <p className={`text-[10px] font-bold mt-1 ${isProtected || isImmune ? 'text-slate-500' : maxDamage >= currentHp ? 'text-rose-400' : 'text-yellow-400'}`}>{koText}</p>
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