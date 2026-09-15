import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Sparkles } from 'lucide-react';
import { POKEDEX } from '../data/pokedex';
import { ITEMS_DB } from '../data/items';
import { ABILITIES_DB } from '../data/habilidades';
import { MOVES_DB } from '../data/moves';
import { CHAMPIONS_ROSTER } from '../data/lista-champions';

export const TYPE_COLORS: Record<string, string> = {
  Normal: 'bg-[#A8A77A]', Fire: 'bg-[#EE8130]', Water: 'bg-[#6390F0]', Electric: 'bg-[#F7D02C]',
  Grass: 'bg-[#7AC74C]', Ice: 'bg-[#96D9D6]', Fighting: 'bg-[#C22E28]', Poison: 'bg-[#A33EA1]',
  Ground: 'bg-[#E2BF65]', Flying: 'bg-[#A98FF3]', Psychic: 'bg-[#F95587]', Bug: 'bg-[#A6B91A]',
  Rock: 'bg-[#B8A038]', Ghost: 'bg-[#735797]', Dragon: 'bg-[#6F35FC]', Dark: 'bg-[#705746]',
  Steel: 'bg-[#B7B7CE]', Fairy: 'bg-[#D685AD]',
};

// --- SPRITES Y HELPERS ---
export const getSpriteUrl = (id: string) => {
  if (!id) return '';
  if (id === 'floetteeternalmega') return '/sprites/floetteeternalmega.png';
  if (POKEDEX[id] && POKEDEX[id].sprite) return POKEDEX[id].sprite;

  const spriteFixes: Record<string, string> = {
    'rotomwash': 'rotom-wash', 'rotomheat': 'rotom-heat', 'rotommow': 'rotom-mow',
    'rotomfrost': 'rotom-frost', 'rotomfan': 'rotom-fan', 'basculegionm': 'basculegion',
    'basculegionf': 'basculegion-f', 'aegislash': 'aegislash', 'aegislashblade': 'aegislash-blade', 
    'palafinhero': 'palafin-hero', 'megameganium': 'meganium-mega', 'feraligatrmega': 'feraligatr-mega',
    'typhlosionmega': 'typhlosion-mega', 'dragonitemega': 'dragonite-mega', 'glimmoramega': 'glimmora-mega',
    'indeedeem': 'indeedee', 'indeedeef': 'indeedee-f',
    'lycanrocmidnight': 'lycanroc-midnight', 'lycanrocdusk': 'lycanroc-dusk'
  };

  let cleanId = id.replace('_', '');
  if (spriteFixes[cleanId]) cleanId = spriteFixes[cleanId];
  else {
    if (cleanId.endsWith('alola')) cleanId = cleanId.replace('alola', '-alola');
    else if (cleanId.endsWith('galar')) cleanId = cleanId.replace('galar', '-galar');
    else if (cleanId.endsWith('hisui')) cleanId = cleanId.replace('hisui', '-hisui');
    else if (cleanId.endsWith('paldea')) cleanId = cleanId.replace('paldea', '-paldea');
    
    if (cleanId.endsWith('megax')) cleanId = cleanId.replace('megax', '-megax');
    else if (cleanId.endsWith('megay')) cleanId = cleanId.replace('megay', '-megay');
    else if (cleanId.endsWith('mega')) cleanId = cleanId.replace('mega', '-mega');
  }
  return `https://play.pokemonshowdown.com/sprites/dex/${cleanId}.png`;
};

export const handleSpriteError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  if (target.src.includes('/dex/')) {
    const filename = target.src.split('/').pop();
    target.src = `https://play.pokemonshowdown.com/sprites/gen5/${filename}`;
  } else if (target.src.includes('/gen5/')) {
    const filename = target.src.split('/').pop();
    target.src = `/sprites/${filename}`;
  } else if (!target.src.includes('0.png')) {
    target.src = 'https://play.pokemonshowdown.com/sprites/0.png';
  }
};

export const handleIconError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  if (target.src.includes('play.pokemonshowdown.com')) {
    const urlParts = target.src.split('/');
    const fileName = urlParts[urlParts.length - 1];
    target.src = `/sprites/${fileName}?v=2`;
  } else if (target.src.includes('/sprites/') && target.src.includes('-')) {
    target.src = target.src.replace(/-/g, '');
  } else {
    target.style.display = 'none';
  }
};

export const getItemSpriteUrl = (itemName: string) => {
  if (!itemName || itemName === 'No Item' || itemName === 'None') return '';
  
  // B?squeda inteligente: buscar por nombre exacto, o por ID (por si el usuario cambi? el nombre pero la base de datos de Pok?mon guardados usa el nombre antiguo)
  const possibleId = itemName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const item = Object.values(ITEMS_DB).find(i => 
    i.name === itemName || 
    i.id === possibleId || 
    i.id === possibleId + 'ite' ||
    i.name.toLowerCase().replace(/[^a-z0-9]/g, '') === possibleId
  );
  
  if (item && item.sprite) return item.sprite;
  let cleanName = itemName.toLowerCase().replace(/'/g, '');
  cleanName = cleanName.replace(/[^a-z0-9]+/g, '-');
  cleanName = cleanName.replace(/^-+|-+$/g, '');
  return `https://play.pokemonshowdown.com/sprites/itemicons/${cleanName}.png`;
};

// --- LOGICA DE JUEGO ---
export const checkAbility = (abilityIdStr: string, abilityObj: any, enName: string, esName: string) => {
  if (!abilityIdStr && !abilityObj) return false;
  const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "");
  const combined = `${abilityIdStr} ${abilityObj?.name || ''} ${abilityObj?.id || ''}`;
  const nCombined = normalize(combined);
  return nCombined.includes(normalize(enName)) || nCombined.includes(normalize(esName));
};

export const calcHP = (base: number, evs: number) => Math.floor(((2 * base + 31) * 50) / 100) + 50 + 10 + evs;
export const calcStat = (base: number, evs: number, nature: number) => Math.floor((Math.floor(((2 * base + 31) * 50) / 100) + 5 + evs) * nature);
export const calcSpeedStat = (base: number, evs: number, nature: number) => {
  const rawBase = Math.floor(((2 * base + 31) * 50) / 100) + 5;
  return Math.floor((rawBase + evs) * nature);
};
export const getStageMod = (stage: number) => stage === 0 ? 1 : stage > 0 ? (2 + stage) / 2 : 2 / (2 + Math.abs(stage));

export const getSliderStyle = (val: number, colorRgba: string) => ({
  background: `linear-gradient(to right, ${colorRgba} ${(val / 32) * 100}%, white ${(val / 32) * 100}%)`
});

export const isMegaForm = (speciesId: string) => {
  if (!speciesId) return false;
  if (speciesId === 'yanmega') return false; 
  return speciesId.endsWith('mega') || speciesId.endsWith('megax') || speciesId.endsWith('megay') || speciesId.endsWith('megaz');
};

export const autoEquipMegaItem = (newSpeciesId: string) => {
    if (!isMegaForm(newSpeciesId)) return null;
    const base = newSpeciesId.replace(/megax$|megay$|megaz$|mega$/, '');
    
    if (newSpeciesId.endsWith('megax') && (ITEMS_DB[`${base}itex`] || ITEMS_DB[`${base}nitex`])) return ITEMS_DB[`${base}itex`] ? `${base}itex` : `${base}nitex`;
    if (newSpeciesId.endsWith('megay') && (ITEMS_DB[`${base}itey`] || ITEMS_DB[`${base}nitey`])) return ITEMS_DB[`${base}itey`] ? `${base}itey` : `${base}nitey`;
    if (newSpeciesId.endsWith('megaz') && (ITEMS_DB[`${base}itez`] || ITEMS_DB[`${base}nitez`])) return ITEMS_DB[`${base}itez`] ? `${base}itez` : `${base}nitez`;
    if (newSpeciesId.endsWith('mega') && (ITEMS_DB[`${base}ite`] || ITEMS_DB[`${base}nite`])) return ITEMS_DB[`${base}ite`] ? `${base}ite` : `${base}nite`;
  
    const possibleItems = Object.keys(ITEMS_DB).filter(k => (k.includes('ite') || k.includes('ita')) && k.startsWith(base.substring(0, 4)));
    
    if (newSpeciesId.endsWith('megaz')) {
       const zItem = possibleItems.find(i => i.endsWith('z'));
       if (zItem) return zItem;
    }

    possibleItems.sort((a, b) => {
      let matchA = 0; while (matchA < a.length && matchA < base.length && a[matchA] === base[matchA]) matchA++;
      let matchB = 0; while (matchB < b.length && matchB < base.length && b[matchB] === base[matchB]) matchB++;
      return matchB - matchA;
    });
  
    if (newSpeciesId.endsWith('megax')) return possibleItems.find(i => i.endsWith('x')) || 'None';
    if (newSpeciesId.endsWith('megay')) return possibleItems.find(i => i.endsWith('y')) || 'None';
    if (newSpeciesId.endsWith('megaz')) return possibleItems.find(i => i.endsWith('z')) || 'None';
    return possibleItems[0] || 'None';
  };

export const getTransformData = (speciesId: string, itemId: string) => {
  if (!speciesId) return null;
  if (speciesId === 'aegislash') return { target: 'aegislashblade', label: 'Blade Form' };
  if (speciesId === 'aegislashblade') return { target: 'aegislash', label: 'Shield Form' };
  if (speciesId === 'palafin') return { target: 'palafinhero', label: 'Hero Form' };
  if (speciesId === 'palafinhero') return { target: 'palafin', label: 'Zero Form' };

  if (isMegaForm(speciesId)) {
    const base = speciesId.replace(/megax$|megay$|megaz$|mega$/, '');
    return { target: base, label: 'Revert Form' };
  }
  if (itemId && itemId !== 'None') {
    if (POKEDEX[`${speciesId}megax`] && itemId === autoEquipMegaItem(`${speciesId}megax`)) return { target: `${speciesId}megax`, label: 'Mega Evolve X' };
    if (POKEDEX[`${speciesId}megay`] && itemId === autoEquipMegaItem(`${speciesId}megay`)) return { target: `${speciesId}megay`, label: 'Mega Evolve Y' };
    if (POKEDEX[`${speciesId}megaz`] && itemId === autoEquipMegaItem(`${speciesId}megaz`)) return { target: `${speciesId}megaz`, label: 'Mega Evolve Z' };
    if (POKEDEX[`${speciesId}mega`] && itemId === autoEquipMegaItem(`${speciesId}mega`)) return { target: `${speciesId}mega`, label: 'Mega Evolve' };
  }
  return null;
};

export const pokeRound = (n: number) => Math.floor(n);

export const calculateDamageRolls = (level: number, power: number, attackStat: number, defenseStat: number, mods: any) => {
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

// --- COMPONENTES COMPARTIDOS ---
export const EvInput = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => {
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

export const NatureSelect = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => (
  <div className="flex items-center bg-slate-800 rounded border border-slate-600 overflow-hidden shrink-0">
    <button onClick={() => onChange(1.1)} className={`w-6 py-0.5 text-[10px] font-black transition-colors ${value > 1.0 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`} title="Beneficial Nature (+10%)">+</button>
    <button onClick={() => onChange(1.0)} className={`w-6 py-0.5 text-[10px] font-black transition-colors border-l border-r border-slate-700 ${value === 1.0 ? 'bg-slate-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`} title="Neutral Nature">...</button>
    <button onClick={() => onChange(0.9)} className={`w-6 py-0.5 text-[10px] font-black transition-colors ${value < 1.0 ? 'bg-rose-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`} title="Hindering Nature (-10%)">-</button>
  </div>
);

export const PokemonSelector = ({ selectedId, onSelect }: { selectedId: string, onSelect: (id: string) => void }) => {
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

export const ItemSelector = ({ selectedId, onSelect, colorClass, disabled = false }: { selectedId: string, onSelect: (id: string) => void, colorClass: string, disabled?: boolean }) => {
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

export const AbilitySelector = ({ selectedId, onSelect, abilities, colorClass = "text-yellow-300 hover:border-yellow-500" }: { selectedId: string, onSelect: (id: string) => void, abilities: string[], colorClass?: string }) => {
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

export const MoveSelector = ({ selectedMoveId, onSelect, learnset }: { selectedMoveId: string | null, onSelect: (id: string) => void, learnset: string[] }) => {
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

export const BuildSelector = ({ selectedId, onSelect, builds }: { selectedId: string, onSelect: (id: string) => void, builds: any[] }) => {
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

export const preloadSprites = () => {
  if (typeof window === 'undefined') return;
  CHAMPIONS_ROSTER.forEach(id => {
    const img = new window.Image();
    img.src = getSpriteUrl(id);
  });
};
