import { useState, useMemo, useRef, useEffect, memo, useCallback } from 'react';
import { Zap, ArrowUpRight, ArrowDownRight, Minus, Gauge, Wind, Package, Sparkles, Crosshair, Search, RotateCcw, X } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { POKEDEX } from './data/pokedex';
import { ITEMS_DB } from './data/items';
import { ABILITIES_DB } from './data/habilidades';
import type { Weather, Terrain } from './App';
import { SPEED_THREATS } from './data/builds';
import { BuildDropdown } from './components/SavedBuilds';
import type { SavedBuild } from './components/SavedBuilds';

import { 
  TYPE_COLORS, getSpriteUrl, handleSpriteError, handleIconError, getItemSpriteUrl, 
  checkAbility, calcSpeedStat, getSliderStyle, autoEquipMegaItem, getTransformData,
  EvInput, NatureSelect, PokemonSelector, ItemSelector, isMegaForm
} from './core/nucleo';

const COMBINED_SPEED_THREATS = [...SPEED_THREATS];

const RivalCard = memo(({ 
  rival, 
  userSpeed, 
  isSelected, 
  onClick 
}: { 
  rival: any, 
  userSpeed: number, 
  isSelected: boolean, 
  onClick: () => void 
}) => {
  const isFaster = userSpeed > rival.finalSpeed;
  const isSlower = userSpeed < rival.finalSpeed;
  const isTie = userSpeed === rival.finalSpeed;
  
  let bgColor = 'bg-slate-900 border-slate-700';
  let badgeColor = 'bg-slate-800 text-slate-400 border-slate-700';
  let icon = <Minus size={14} />;
  let speedColor = 'text-slate-300';
  
  if (isFaster) {
    bgColor = 'bg-emerald-900/20 border-emerald-500/30 hover:border-emerald-400/50';
    badgeColor = 'bg-emerald-900/50 text-emerald-400 border-emerald-500/50';
    icon = <ArrowUpRight size={14} />;
    speedColor = 'text-emerald-400';
  } else if (isSlower) {
    bgColor = 'bg-rose-900/20 border-rose-500/30 hover:border-rose-400/50';
    badgeColor = 'bg-rose-900/50 text-rose-400 border-rose-500/50';
    icon = <ArrowDownRight size={14} />;
    speedColor = 'text-rose-400';
  } else if (isTie) {
    bgColor = 'bg-sky-900/20 border-sky-500/30 hover:border-sky-400/50';
    badgeColor = 'bg-sky-900/50 text-sky-400 border-sky-500/50';
    icon = <Minus size={14} />;
    speedColor = 'text-sky-400';
  }

  return (
    <div 
      onClick={onClick}
      className={`shrink-0 w-72 p-5 rounded-xl border ${bgColor} ${isSelected ? 'ring-2 ring-rose-500 ring-offset-2 ring-offset-slate-950 scale-105' : 'transition-transform hover:-translate-y-1'} cursor-pointer flex flex-col gap-4 shadow-md`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="w-16 h-16 flex shrink-0 items-center justify-center relative">
          <img src={getSpriteUrl(rival.speciesId)} alt={rival.rPoke.name} className="max-h-16 object-contain" onError={handleSpriteError} />
        </div>
        
        <div className="flex flex-col items-end">
          <span className={`text-4xl font-mono font-black ${speedColor} drop-shadow-sm`}>{rival.finalSpeed}</span>
          <span className={`flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 mt-1 rounded border ${badgeColor}`}>
            {icon}
            {isFaster ? 'Faster' : isSlower ? 'Slower' : 'Tie'}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className="font-bold text-sm leading-tight text-slate-200 line-clamp-2" title={rival.name}>{rival.name}</span>
        <div className="flex flex-col gap-1.5 mt-3">
          {rival.rItem.name !== 'None' && (
             <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 bg-slate-900/80 px-2 py-1.5 rounded-lg border border-slate-700/50 truncate">
               <img src={getItemSpriteUrl(rival.rItem.name)} alt="" className="w-4 h-4 object-contain" onError={handleIconError} />
               <span className="truncate">{rival.rItem.name}</span>
             </span>
          )}
          {rival.rAbil.name !== 'No Ability' && (
             <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 bg-slate-900/80 px-2 py-1.5 rounded-lg border border-slate-700/50 truncate">
               <Sparkles size={14} className="text-yellow-500/80" />
               <span className="truncate">{rival.rAbil.name}</span>
             </span>
          )}
        </div>
      </div>
    </div>
  );
}, (prev, next) => {
  const prevRelation = prev.userSpeed > prev.rival.finalSpeed ? 1 : prev.userSpeed < prev.rival.finalSpeed ? -1 : 0;
  const nextRelation = next.userSpeed > next.rival.finalSpeed ? 1 : next.userSpeed < next.rival.finalSpeed ? -1 : 0;
  
  return prevRelation === nextRelation && 
         prev.isSelected === next.isSelected && 
         prev.rival === next.rival;
});

export default function SpeedMode({ weather, terrain, setWeather, setTerrain }: { weather?: Weather, terrain?: Terrain, setWeather?: (w: Weather) => void, setTerrain?: (t: Terrain) => void }) {
  const [userSpeciesId, setUserSpeciesId] = useLocalStorage('speed-user-species', 'garchomp');
  const userPokemon = POKEDEX[userSpeciesId] || POKEDEX['garchomp'];

  const [userAbilityId, setUserAbilityId] = useLocalStorage('speed-user-ability', userPokemon.abilities[0] || 'No Ability');
  const [userItemId, setUserItemId] = useLocalStorage('speed-user-item', 'None');
  const [userEvs, setUserEvs] = useLocalStorage<number>('speed-user-evs', 0);
  const [userNature, setUserNature] = useLocalStorage<number>('speed-user-nature', 1.0);
  const [userTailwind, setUserTailwind] = useLocalStorage('speed-user-tailwind', false);
  const [userParalyzed, setUserParalyzed] = useLocalStorage('speed-user-para', false);

  const [enemyTailwind, setEnemyTailwind] = useLocalStorage('speed-enemy-tailwind', false);
  const [enemyParalyzed, setEnemyParalyzed] = useLocalStorage('speed-enemy-para', false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedRivalId, setSelectedRivalId] = useState<string | null>(null);
  const [rivalItemOverride, setRivalItemOverride] = useState<string | null>(null);
  const [rivalAbilityOverride, setRivalAbilityOverride] = useState<string | null>(null);
  
  useEffect(() => {
    setRivalItemOverride(null);
    setRivalAbilityOverride(null);
  }, [selectedRivalId]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let isHovered = false;
    let isDown = false;
    let startX: number;
    let scrollLeftState: number;

    const el = scrollRef.current;
    if (!el) return;

    const handleMouseEnter = () => { if (!isDown) isHovered = true; };
    const handleMouseLeave = () => { isHovered = false; isDown = false; };
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      isHovered = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeftState = el.scrollLeft;
      el.style.cursor = 'grabbing';
      el.style.scrollBehavior = 'auto';
    };
    
    const handleMouseUp = () => {
      isDown = false;
      el.style.cursor = 'grab';
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5; 
      el.scrollLeft = scrollLeftState - walk;
    };
    
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('touchstart', handleMouseEnter, { passive: true });
    el.addEventListener('touchend', handleMouseLeave);
    el.addEventListener('wheel', handleWheel, { passive: false });
    
    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mousemove', handleMouseMove);
    
    el.style.cursor = 'grab';

    const scroll = () => {
      if (!isHovered && !isDown && el && el.scrollWidth > el.clientWidth) {
        el.scrollLeft += 1;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('touchstart', handleMouseEnter);
      el.removeEventListener('touchend', handleMouseLeave);
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const userAbility = ABILITIES_DB[userAbilityId] || ABILITIES_DB['No Ability'];
  const userItem = ITEMS_DB[userItemId] || ITEMS_DB['None'];
  const transformData = getTransformData(userSpeciesId, userItemId);

  const handleSpeciesChange = (newSpeciesId: string) => {
    setUserSpeciesId(newSpeciesId);
    setUserAbilityId(POKEDEX[newSpeciesId]?.abilities[0] || 'No Ability');
    setUserEvs(0);
    setUserNature(1.0);
    const megaItem = autoEquipMegaItem(newSpeciesId);
    if (megaItem) setUserItemId(megaItem);
    else setUserItemId('None');
  };

  const resetUserStats = () => {
    setUserEvs(0); setUserNature(1.0);
    setUserTailwind(false); setUserParalyzed(false);
    setEnemyTailwind(false); setEnemyParalyzed(false);
    setSearchQuery('');
    setSelectedRivalId(null);
    setWeather?.('None'); setTerrain?.('None');
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

  const selectedRivalData = useMemo(() => {
    if (!selectedRivalId) return null;
    const build = COMBINED_SPEED_THREATS.find(b => b.id === selectedRivalId);
    if (!build) return null;
    
    const rPoke = POKEDEX[build.speciesId] || POKEDEX['garchomp'];
    let rItemId = rivalItemOverride !== null ? rivalItemOverride : build.itemId;
      if (rivalItemOverride === null && isMegaForm(build.speciesId)) {
        const megaItem = autoEquipMegaItem(build.speciesId);
        if (megaItem) rItemId = megaItem;
      }
    const rAbilId = rivalAbilityOverride !== null ? rivalAbilityOverride : build.abilityId;
    
    const rItem = ITEMS_DB[rItemId] || ITEMS_DB['None'] || { name: rItemId };
    const rAbil = ABILITIES_DB[rAbilId] || ABILITIES_DB['No Ability'] || { name: rAbilId };
    
    let stat = calcSpeedStat(rPoke.baseStats.spe, build.defaultEvs, build.defaultNature);
    if (rItem.speMod) stat = Math.floor(stat * rItem.speMod);
    if (rAbil.speMod) stat = Math.floor(stat * rAbil.speMod);

    if (checkAbility(rAbilId, rAbil, 'Swift Swim', 'Nado Rapido') && weather === 'Rain') stat = Math.floor(stat * 2);
    if (checkAbility(rAbilId, rAbil, 'Chlorophyll', 'Clorofila') && weather === 'Sun') stat = Math.floor(stat * 2);
    if (checkAbility(rAbilId, rAbil, 'Sand Rush', 'Impetu Arena') && weather === 'Sand') stat = Math.floor(stat * 2);
    if (checkAbility(rAbilId, rAbil, 'Slush Rush', 'Quitanieves') && weather === 'Snow') stat = Math.floor(stat * 2);
    if (checkAbility(rAbilId, rAbil, 'Surge Surfer', 'Cola Surf') && terrain === 'Electric') stat = Math.floor(stat * 2);
    if (checkAbility(rAbilId, rAbil, 'Protosynthesis', 'Protosintesis') && weather === 'Sun') stat = Math.floor(stat * 1.5);
    if (checkAbility(rAbilId, rAbil, 'Quark Drive', 'Carga Cuark') && terrain === 'Electric') stat = Math.floor(stat * 1.5);

    if (enemyTailwind) stat = Math.floor(stat * 2);
    if (enemyParalyzed && !rPoke.types.includes('Electric')) stat = Math.floor(stat * 0.5);

    return { ...build, itemId: rItemId, rPoke, rItem, rAbil, finalSpeed: stat };
  }, [selectedRivalId, enemyTailwind, enemyParalyzed, weather, terrain, rivalItemOverride, rivalAbilityOverride]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return COMBINED_SPEED_THREATS.filter(build => 
      build.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      build.speciesId.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 10);
  }, [searchQuery]);

  const allProcessedRivals = useMemo(() => {
    return COMBINED_SPEED_THREATS.map(build => {
      const rPoke = POKEDEX[build.speciesId] || POKEDEX['garchomp'];
      let finalItemId = build.itemId;
        if (isMegaForm(build.speciesId)) {
          const mItem = autoEquipMegaItem(build.speciesId);
          if (mItem) finalItemId = mItem;
        }
        const rItem = ITEMS_DB[finalItemId] || ITEMS_DB['None'] || { name: finalItemId };
      const rAbil = ABILITIES_DB[build.abilityId] || ABILITIES_DB['No Ability'] || { name: build.abilityId };
      
      let stat = calcSpeedStat(rPoke.baseStats.spe, build.defaultEvs, build.defaultNature);
      if (rItem.speMod) stat = Math.floor(stat * rItem.speMod);
      if (rAbil.speMod) stat = Math.floor(stat * rAbil.speMod);

      const rAbilId = build.abilityId;
      if (checkAbility(rAbilId, rAbil, 'Swift Swim', 'Nado Rapido') && weather === 'Rain') stat = Math.floor(stat * 2);
      if (checkAbility(rAbilId, rAbil, 'Chlorophyll', 'Clorofila') && weather === 'Sun') stat = Math.floor(stat * 2);
      if (checkAbility(rAbilId, rAbil, 'Sand Rush', 'Impetu Arena') && weather === 'Sand') stat = Math.floor(stat * 2);
      if (checkAbility(rAbilId, rAbil, 'Slush Rush', 'Quitanieves') && weather === 'Snow') stat = Math.floor(stat * 2);
      if (checkAbility(rAbilId, rAbil, 'Surge Surfer', 'Cola Surf') && terrain === 'Electric') stat = Math.floor(stat * 2);
      if (checkAbility(rAbilId, rAbil, 'Protosynthesis', 'Protosintesis') && weather === 'Sun') stat = Math.floor(stat * 1.5);
      if (checkAbility(rAbilId, rAbil, 'Quark Drive', 'Carga Cuark') && terrain === 'Electric') stat = Math.floor(stat * 1.5);

      if (enemyTailwind) stat = Math.floor(stat * 2);
      if (enemyParalyzed && !rPoke.types.includes('Electric')) stat = Math.floor(stat * 0.5);

      return { ...build, rPoke, rItem, rAbil, finalSpeed: stat };
    }).sort((a, b) => b.finalSpeed - a.finalSpeed);
  }, [enemyTailwind, enemyParalyzed, weather, terrain]);

  const processedRivals = useMemo(() => {
    return allProcessedRivals.filter(rival => Math.abs(rival.finalSpeed - userSpeed) <= 20);
  }, [allProcessedRivals, userSpeed]);

  const handleRivalClick = useCallback((id: string) => {
    setSelectedRivalId(id);
  }, []);

  return (
    <div className="flex flex-col text-slate-200 mobile-zoom">
      <div className="bg-slate-900 border-b border-slate-700 p-4 shrink-0 shadow-sm relative z-20 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-blue-400">
            <Gauge size={24} />
            Speed Tiers Calculator
          </h2>
        </div>
        
        <div className="relative w-full sm:w-64">
          <div className="flex items-center gap-2 bg-slate-950 rounded-lg px-4 py-2 border border-slate-700 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all shadow-inner w-full">
            <Search size={16} className="text-slate-500 shrink-0" />
            <input 
              type="text" 
              placeholder="Search to select..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-600 font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-slate-300">
                <X size={14} />
              </button>
            )}
          </div>
          
          {searchQuery.trim() && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50 flex flex-col max-h-60 overflow-y-auto">
              {searchResults.map(result => (
                <button
                  key={result.id}
                  onClick={() => {
                    setSelectedRivalId(result.id);
                    setSearchQuery('');
                  }}
                  className="text-left px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700/50 last:border-0 flex items-center gap-3"
                >
                  <img src={getSpriteUrl(result.speciesId)} alt="" className="w-8 h-8 object-contain drop-shadow" onError={handleSpriteError} />
                  {result.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 pt-6 px-4 md:px-8 pb-8 flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
        
        <div className={`grid grid-cols-1 ${selectedRivalId ? 'lg:grid-cols-2' : ''} gap-6 items-stretch w-full ${!selectedRivalId ? 'max-w-xl mx-auto' : ''}`}>
          
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg flex flex-col w-full h-full">
            <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-blue-400">
                <Crosshair size={20} />
                <h3 className="font-bold text-lg">Your Pokemon</h3>
              </div>
              <div className="flex items-center gap-2">
                <BuildDropdown 
                  onSelect={(build: SavedBuild) => {
                    setUserSpeciesId(build.speciesId);
                    setUserAbilityId(build.abilityId);
                    let finalUserItem = build.itemId;
                      if (isMegaForm(build.speciesId)) {
                        const mItem = autoEquipMegaItem(build.speciesId);
                        if (mItem) finalUserItem = mItem;
                      }
                      setUserItemId(finalUserItem);
                    setUserEvs(build.evs.spe);
                    setUserNature(build.nature.spe);
                  }}
                />
                <button onClick={resetUserStats} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 transition-colors shadow-sm flex items-center gap-2">
                  <RotateCcw size={12} /> Reset
                </button>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col space-y-4">
              <div className="flex flex-col xl:flex-row items-center xl:items-start gap-4 w-full">
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className="w-20 h-20 flex items-center justify-center relative">
                    <img src={getSpriteUrl(userSpeciesId)} alt={userPokemon.name} className="max-h-20 object-contain" onError={handleSpriteError} />
                  </div>
                  <div className="flex gap-1">{userPokemon.types.map(t => <span key={t} className={`${TYPE_COLORS[t]} text-white text-[8px] font-black px-1 rounded uppercase border border-black/10`}>{t.substring(0,3)}</span>)}</div>
                </div>
                <div className="flex-1 w-full">
                  <PokemonSelector selectedId={userSpeciesId} onSelect={handleSpeciesChange} />
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

              <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-700 mt-2">
                <span className="flex items-center gap-2 font-bold text-blue-400 uppercase tracking-wider text-sm"><Gauge size={18}/> Final Speed</span>
                <span className="text-4xl font-mono text-white font-black drop-shadow-md">{userSpeed}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-slate-400 font-semibold">Item</label>
                  <ItemSelector selectedId={userItemId} onSelect={setUserItemId} disabled={isMegaForm(userSpeciesId)} />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-slate-400 font-semibold">Ability</label>
                  <select value={userAbilityId} onChange={(e) => setUserAbilityId(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                    {userPokemon.abilities.map(a => <option key={a} value={a}>{ABILITIES_DB[a]?.name || a}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-4 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-300">Base Speed</span>
                  <span className="font-mono text-white bg-slate-800 px-2 py-1 rounded">{userPokemon.baseStats.spe}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                  <span>Nature:</span>
                  <NatureSelect value={userNature} onChange={setUserNature} statName="spe" />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mb-1"><span>EVs:</span></div>
                <div className="flex items-center gap-2">
                  <input type="range" min="0" max="32" value={userEvs} onChange={(e) => setUserEvs(Number(e.target.value))} className="flex-1 accent-blue-500 bg-white rounded-full h-1.5 appearance-none cursor-pointer" style={getSliderStyle(userEvs, 'rgba(59, 130, 246, 0.4)')} />
                  <EvInput value={userEvs} onChange={setUserEvs} />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700 shrink-0">
              <button onClick={() => setUserTailwind(!userTailwind)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-colors border ${userTailwind ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-700'}`}><Wind size={16} /> Tailwind</button>
              <button onClick={() => setUserParalyzed(!userParalyzed)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-colors border ${userParalyzed ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-700'}`}><Zap size={16} /> Paralyzed</button>
            </div>
          </div>

          {selectedRivalData && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg flex flex-col w-full h-full relative">
              <button 
                onClick={() => setSelectedRivalId(null)}
                className="absolute -top-3 -right-3 w-8 h-8 bg-rose-600 hover:bg-rose-500 rounded-full flex items-center justify-center border-2 border-slate-800 text-white shadow-lg transition-transform hover:scale-110 z-20"
                title="Close"
              >
                <X size={16} strokeWidth={3} />
              </button>

              <div className="p-4 border-b border-slate-700 bg-slate-800/80 backdrop-blur shrink-0 z-10 rounded-t-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                  <h3 className="font-bold text-lg text-rose-400 flex items-center gap-2 whitespace-nowrap">
                    <Crosshair size={20} />
                    Selected Rival
                  </h3>
                </div>
                <div className="flex gap-2 w-full">
                  <button onClick={() => setEnemyTailwind(!enemyTailwind)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-colors border ${enemyTailwind ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-700'}`}><Wind size={14} /> Rivals Tailwind</button>
                  <button onClick={() => setEnemyParalyzed(!enemyParalyzed)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-colors border ${enemyParalyzed ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-700'}`}><Zap size={14} /> Rivals Paralyzed</button>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col space-y-4">
                <div className="flex flex-col xl:flex-row items-center xl:items-start gap-4 w-full">
                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div className="w-20 h-20 flex items-center justify-center relative bg-slate-900/50 rounded-xl border border-slate-700 shadow-inner">
                      <img src={getSpriteUrl(selectedRivalData.speciesId)} alt={selectedRivalData.rPoke.name} className="max-h-16 object-contain" onError={handleSpriteError} />
                    </div>
                    <div className="flex gap-1">{selectedRivalData.rPoke.types.map(t => <span key={t} className={`${TYPE_COLORS[t]} text-white text-[8px] font-black px-1 rounded uppercase border border-black/10`}>{t.substring(0,3)}</span>)}</div>
                  </div>
                  <div className="flex-1 w-full mt-2 text-center xl:text-left">
                    <h4 className="text-lg font-bold text-rose-300 leading-tight">{selectedRivalData.name}</h4>
                    <div className="flex flex-col gap-2 mt-3 text-left">
                       <ItemSelector 
                         selectedId={rivalItemOverride !== null ? rivalItemOverride : selectedRivalData.itemId} 
                         onSelect={setRivalItemOverride} 
                         disabled={isMegaForm(selectedRivalData.speciesId)}
                       />
                       <select 
                         value={rivalAbilityOverride !== null ? rivalAbilityOverride : selectedRivalData.abilityId} 
                         onChange={(e) => setRivalAbilityOverride(e.target.value)} 
                         className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                       >
                         {selectedRivalData.rPoke.abilities.map(a => <option key={a} value={a}>{ABILITIES_DB[a]?.name || a}</option>)}
                       </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-700 mt-2">
                  <span className="flex items-center gap-2 font-bold text-rose-400 uppercase tracking-wider text-sm"><Gauge size={18}/> Final Speed</span>
                  <span className="text-4xl font-mono text-white font-black drop-shadow-md">{selectedRivalData.finalSpeed}</span>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-4 flex-1 flex flex-col justify-center">
                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-3 mb-1">
                    <span className="text-sm font-semibold text-slate-300">Base Speed</span>
                    <span className="font-mono text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">{selectedRivalData.rPoke.baseStats.spe}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-3 mb-1">
                    <span className="text-sm font-semibold text-slate-300">Nature</span>
                    <span className={`font-mono font-bold px-3 py-1 rounded-lg border ${selectedRivalData.defaultNature === 1.1 ? 'text-emerald-400 bg-emerald-900/20 border-emerald-500/30' : selectedRivalData.defaultNature === 0.9 ? 'text-rose-400 bg-rose-900/20 border-rose-500/30' : 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                      {selectedRivalData.defaultNature === 1.1 ? '+Speed (1.1x)' : selectedRivalData.defaultNature === 0.9 ? '-Speed (0.9x)' : 'Neutral (1.0x)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-semibold text-slate-300">EVs</span>
                    <span className="font-mono text-blue-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">{selectedRivalData.defaultEvs} EVs</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] mt-4 bg-slate-900/30 border-y border-slate-700/50 pt-4 pb-2 overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>
          
          <div 
            ref={scrollRef}
            className="w-full flex gap-4 overflow-x-auto pb-6 px-4 [&::-webkit-scrollbar]:hidden"
            style={{ willChange: 'scroll-position' }}
          >
            {processedRivals.map(rival => (
              <RivalCard 
                key={rival.id}
                rival={rival}
                userSpeed={userSpeed}
                isSelected={selectedRivalId === rival.id}
                onClick={() => handleRivalClick(rival.id)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
