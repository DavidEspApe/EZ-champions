import { useState, useEffect } from 'react';
import { HelpCircle, X, Swords, Shield, Zap, Crosshair, Sun, Leaf, RotateCcw, Users, Flame, FileText, Activity } from 'lucide-react';

export default function GuideModal({ activeTab }: { activeTab: string }) {
  const [isOpen, setIsOpen] = useState(false);

  // Cerrar con la tecla Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] bg-blue-600 border-2 border-blue-400 text-white p-3.5 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:bg-blue-500 hover:scale-110 transition-all flex items-center justify-center group"
        title="App Guide"
      >
        <HelpCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <HelpCircle className="text-blue-400" /> 
            {activeTab === 'attack' && 'Attack Mode Guide'}
            {activeTab === 'defense' && 'Defense Mode Guide'}
            {activeTab === 'speed' && 'Speed Mode Guide'}
            {activeTab === 'advanced' && 'Advanced Mode Guide'}
          </h2>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-rose-400 transition-colors p-1 bg-slate-800 rounded-lg hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          
          {/* INTRODUCCIÓN SEGÚN EL MODO */}
          <section className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            {activeTab === 'attack' && <p><strong>Attack Mode</strong> allows you to check if your Pokémon can secure a KO against the most common threats in the VGC format. Select your attacker on the left and choose your target on the right.</p>}
            {activeTab === 'defense' && <p><strong>Defense Mode</strong> helps you calculate if your Pokémon can survive the most devastating attacks in the meta. Fine-tune your HP and defensive EVs to find the perfect bulk.</p>}
            {activeTab === 'speed' && <p><strong>Speed Mode</strong> is a visual tool to easily check turn order. It takes into account Choice Scarfs, weather abilities (like Swift Swim or Chlorophyll), and speed control (Tailwind, Paralysis).</p>}
            {activeTab === 'advanced' && <p><strong>Advanced Mode</strong> is the ultimate 1v1 simulator. It allows you to configure both sides of the field with total freedom, making it perfect for testing complex interactions and board states.</p>}
          </section>

          {/* CONTROLES BÁSICOS */}
          <section className="space-y-3">
            <h3 className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-700 pb-1">Basic Controls</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li className="flex gap-3 items-start">
                <div className="bg-slate-800 p-1.5 rounded border border-slate-600 shrink-0"><span className="text-[10px] font-black text-emerald-400">+ ... -</span></div>
                <div><strong className="text-white">Natures:</strong> The (+) button boosts the stat by 10%, while (-) decreases it by 10%. (...) is a neutral nature.</div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="bg-slate-800 p-1.5 rounded border border-slate-600 shrink-0 text-blue-400"><Activity size={16}/></div>
                <div><strong className="text-white">EV Sliders:</strong> Range from 0 to 32. They represent actual stat points at Level 50 (8 EVs = 1 Stat Point).</div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="bg-slate-800 p-1.5 rounded border border-slate-600 shrink-0 text-slate-400"><RotateCcw size={16}/></div>
                <div><strong className="text-white">Reset:</strong> Clears the Pokémon's EVs, natures, moves, and items to start from scratch.</div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="bg-slate-800 p-1.5 rounded border border-slate-600 shrink-0 text-rose-400"><span className="text-[10px] font-black uppercase">Crit</span></div>
                <div><strong className="text-white">Critical Hit:</strong> Multiplies damage by 1.5x and ignores defensive screens as well as your own attack drops.</div>
              </li>
            </ul>
          </section>

          {/* MODIFICADORES DE CAMPO */}
          <section className="space-y-3">
            <h3 className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-700 pb-1">Field Modifiers</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li className="flex gap-3 items-start">
                <div className="bg-slate-800 p-1.5 rounded border border-slate-600 shrink-0 text-orange-400"><Sun size={16}/></div>
                <div><strong className="text-white">Weather:</strong> Alters Fire/Water damage (x1.5 or x0.5), provides defensive buffs (Rock types in Sand, Ice types in Snow), and triggers abilities.</div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="bg-slate-800 p-1.5 rounded border border-slate-600 shrink-0 text-green-400"><Leaf size={16}/></div>
                <div><strong className="text-white">Terrain:</strong> Boosts matching type damage by 30% for grounded Pokémon, prevents status (Misty/Electric), and halves Earthquake damage (Grassy).</div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="bg-slate-800 p-1.5 rounded border border-slate-600 shrink-0 text-indigo-400"><Users size={16}/></div>
                <div><strong className="text-white">Double Target:</strong> Spread moves deal 25% less damage when hitting multiple targets in a double battle.</div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="bg-slate-800 p-1.5 rounded border border-slate-600 shrink-0 text-emerald-400"><Shield size={16}/></div>
                <div><strong className="text-white">Protect:</strong> Blocks incoming attacks. If the attacker has "Unseen Fist", the attack bypasses Protect but deals 75% less damage.</div>
              </li>
            </ul>
          </section>

          {/* ESPECÍFICOS DE MODO */}
          <section className="space-y-3 bg-blue-900/10 p-4 rounded-xl border border-blue-900/50">
            <h3 className="font-bold text-blue-400 uppercase tracking-wider text-xs border-b border-blue-900/50 pb-1">Mode Specific Mechanics</h3>
            
            {(activeTab === 'attack' || activeTab === 'defense') && (
              <div className="flex gap-3 items-start mt-2">
                <div className="bg-slate-800 p-1.5 rounded border border-orange-600 shrink-0 text-orange-400"><Flame size={16}/></div>
                <div><strong className="text-white">Burn:</strong> Halves the damage of physical attacks (unless the attacking Pokémon has the Guts ability).</div>
              </div>
            )}

            {activeTab === 'speed' && (
              <ul className="space-y-3 mt-2">
                <li className="flex gap-3 items-start">
                  <div className="bg-slate-800 p-1.5 rounded border border-cyan-600 shrink-0 text-cyan-400"><span className="text-[10px] font-black uppercase">Tail</span></div>
                  <div><strong className="text-white">Tailwind:</strong> Doubles (x2) the speed of the selected side for 4 turns.</div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="bg-slate-800 p-1.5 rounded border border-yellow-600 shrink-0 text-yellow-400"><Zap size={16}/></div>
                  <div><strong className="text-white">Paralysis:</strong> Halves the Pokémon's speed (x0.5). Electric-types are immune to this status.</div>
                </li>
              </ul>
            )}

            {activeTab === 'advanced' && (
              <ul className="space-y-3 mt-2 grid grid-cols-1 md:grid-cols-2">
                <li className="flex gap-3 items-start">
                  <div className="bg-slate-800 p-1.5 rounded border border-fuchsia-600 shrink-0 text-fuchsia-400"><span className="text-[10px] font-black uppercase">Veil</span></div>
                  <div><strong className="text-white">Screens (Reflect/Light Screen/Veil):</strong> Reduce incoming damage. In double battles, the reduction is 33% (x0.66).</div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="bg-slate-800 p-1.5 rounded border border-indigo-600 shrink-0 text-indigo-400"><span className="text-[10px] font-black uppercase">Help</span></div>
                  <div><strong className="text-white">Helping Hand:</strong> Boosts the base power of the ally's attack by 50% (x1.5).</div>
                </li>
                <li className="flex gap-3 items-start md:col-span-2">
                  <div className="bg-slate-800 p-1.5 rounded border border-slate-600 shrink-0 text-blue-400"><FileText size={16}/></div>
                  <div>
                    <strong className="text-white">Showdown Import / Export:</strong> 
                    <p className="text-xs mt-1">Copy and paste sets directly from Pokémon Showdown. Our system automatically converts classic EVs (0-252) into our Level 50 Stat Point system (0-32). You can also export your builds to play them over there!</p>
                  </div>
                </li>
              </ul>
            )}
          </section>

        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button onClick={() => setIsOpen(false)} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors">
            Got it!
          </button>
        </div>

      </div>
    </div>
  );
}