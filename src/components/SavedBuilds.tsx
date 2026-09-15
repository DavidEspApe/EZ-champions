import { useState, useRef, useEffect } from 'react';
import { Save, FolderOpen, Trash2, X, Check } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getSpriteUrl, handleSpriteError, getItemSpriteUrl, handleIconError } from '../core/nucleo';
import { ITEMS_DB } from '../data/items';

export interface SavedBuild {
  id: string;
  name: string;
  speciesId: string;
  abilityId: string;
  itemId: string;
  evs: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
  nature: { atk: number; def: number; spa: number; spd: number; spe: number };
  moves: string[];
}

export function BuildDropdown({ onSelect }: { onSelect: (build: SavedBuild) => void }) {
  const [builds, setBuilds] = useLocalStorage<SavedBuild[]>('ez-champions-saved-builds', []);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBuilds(builds.filter(b => b.id !== id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/50 rounded-lg text-xs font-bold transition-colors shadow-sm"
        title="Load saved builds"
      >
        <FolderOpen size={14} /> Load ({builds.length})
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 max-h-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
          <div className="p-2.5 border-b border-slate-700 bg-slate-900/50 flex items-center justify-between">
            <span className="font-bold text-xs text-white">Saved Pokémon</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
            {builds.length === 0 ? (
              <div className="text-center text-slate-500 py-6 text-xs px-4">Your PC Box is empty. Save Pokémon in Advanced Mode!</div>
            ) : (
              builds.map(build => (
                <div 
                  key={build.id} 
                  onClick={() => { onSelect(build); setIsOpen(false); }}
                  className="bg-slate-900 border border-slate-700 hover:border-blue-500/50 p-2 rounded-lg cursor-pointer transition-colors group flex flex-col relative"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <img src={getSpriteUrl(build.speciesId)} alt="" className="w-8 h-8 object-contain" onError={handleSpriteError} />
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-bold text-xs text-white truncate" title={build.name}>{build.name}</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider">{build.speciesId}</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => handleDelete(build.id, e)} 
                      className="text-slate-500 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function SaveBuildModal({ currentBuild, onClose }: { currentBuild: Omit<SavedBuild, 'id'|'name'>, onClose: () => void }) {
  const [builds, setBuilds] = useLocalStorage<SavedBuild[]>('ez-champions-saved-builds', []);
  const [saveName, setSaveName] = useState(`${currentBuild.speciesId.charAt(0).toUpperCase() + currentBuild.speciesId.slice(1)} Build`);

  const handleSave = () => {
    if (!saveName.trim()) return;
    const newBuild: SavedBuild = {
      ...currentBuild,
      id: crypto.randomUUID(),
      name: saveName.trim()
    };
    setBuilds([...builds, newBuild]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <h3 className="font-bold text-white flex items-center gap-2"><Save size={16} className="text-emerald-400" /> Save Build</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700"><X size={18} /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Build Name</label>
            <input 
              type="text" 
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
              placeholder="e.g. Garchomp Scarf"
              autoFocus
            />
          </div>
          <button 
            onClick={handleSave}
            disabled={!saveName.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 rounded-lg flex justify-center items-center gap-2 transition-colors"
          >
            <Check size={16} /> Save Build
          </button>
        </div>
      </div>
    </div>
  );
}
