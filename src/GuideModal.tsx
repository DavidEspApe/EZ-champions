import { useState } from 'react';
import { HelpCircle, X, ShieldAlert, Activity, Zap, Sun, Leaf, Users, Shield, Wind, FileText, Save, RotateCcw, Crosshair } from 'lucide-react';

export default function GuideModal({ activeTab }: { activeTab: 'speed' | 'advanced' }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl hover:scale-110 transition-transform z-50 border-2 border-blue-400/30"
        title="App Guide"
      >
        <HelpCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-950 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="text-blue-400" />
            Pokemon Champions Guide
          </h2>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-rose-600 rounded p-1">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm text-slate-300 custom-scrollbar">
          
          <section className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30">
            {activeTab === 'speed' && <p><strong>Speed Mode</strong> is a real-time global speed tier list. It automatically compares your Pokemon's speed against a database of competitive builds.</p>}
            {activeTab === 'advanced' && <p><strong>Advanced Mode</strong> is the ultimate 1v1 battle simulator. It allows you to configure both sides of the field with total freedom to test interactions and damages.</p>}
          </section>

          {activeTab === 'speed' && (
            <section className="space-y-3 bg-fuchsia-900/10 p-4 rounded-xl border border-fuchsia-900/50">
              <h3 className="font-bold text-fuchsia-400 uppercase tracking-wider text-xs border-b border-fuchsia-900/50 pb-1">Speed Mode Mechanics</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <li className="flex gap-3 items-start">
                  <div className="bg-slate-800 p-1.5 rounded border border-emerald-600 shrink-0 text-emerald-400"><Save size={16}/></div>
                  <div><strong className="text-white">PC Box:</strong> Use the dropdown menu to load any custom build you previously saved in Advanced Mode.</div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="bg-slate-800 p-1.5 rounded border border-blue-600 shrink-0 text-blue-400"><Activity size={16}/></div>
                  <div><strong className="text-white">Proximity Carousel:</strong> The tier list carousel only displays Pokemon that have a final speed stat within <strong>�20 points</strong> of your selected Pokemon.</div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="bg-slate-800 p-1.5 rounded border border-cyan-600 shrink-0 text-cyan-400"><Wind size={16}/></div>
                  <div><strong className="text-white">Tailwind & Paralysis:</strong> Toggle the global modifier buttons to instantly apply Tailwind (x2) or Paralysis (x0.5) to every single rival in the meta.</div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="bg-slate-800 p-1.5 rounded border border-orange-600 shrink-0 text-orange-400"><Sun size={16}/></div>
                  <div><strong className="text-white">Weather & Terrain:</strong> In this mode, changing the weather or terrain only serves to activate speed-boosting abilities (like Swift Swim or Surge Surfer).</div>
                </li>
                <li className="flex gap-3 items-start md:col-span-2">
                  <div className="bg-slate-800 p-1.5 rounded border border-emerald-600 shrink-0 text-emerald-400"><Crosshair size={16}/></div>
                  <div><strong className="text-white">Mega Locks:</strong> Clicking a Mega form in the carousel forces its Mega Stone to be equipped. The item selector locks to prevent illegal sets.</div>
                </li>
              </ul>
            </section>
          )}

          {activeTab === 'advanced' && (
            <section className="space-y-3 bg-indigo-900/10 p-4 rounded-xl border border-indigo-900/50">
              <h3 className="font-bold text-indigo-400 uppercase tracking-wider text-xs border-b border-indigo-900/50 pb-1">Advanced Mode Mechanics</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <li className="flex gap-3 items-start md:col-span-2">
                  <div className="bg-slate-800 p-1.5 rounded border border-emerald-600 shrink-0 text-emerald-400"><Save size={16}/></div>
                  <div><strong className="text-white">PC Box (Save & Load):</strong> Click the Save icon next to the Pokemon's name to save your custom build. You can load it later using the dropdown menu!</div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="bg-slate-800 p-1.5 rounded border border-emerald-600 shrink-0 text-emerald-400"><Activity size={16}/></div>
                  <div><strong className="text-white">66 EV Limit:</strong> The engine enforces a strict maximum of 66 total EVs per Pokemon to match the Champions format.</div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="bg-slate-800 p-1.5 rounded border border-slate-600 shrink-0"><span className="text-[10px] font-black text-emerald-400">+ ... -</span></div>
                  <div><strong className="text-white">Smart Natures:</strong> The (+) boosts the stat by 10%, (-) decreases by 10%. Only one stat can be boosted/reduced at a time.</div>
                </li>
                <li className="flex gap-3 items-start md:col-span-2">
                  <div className="bg-slate-800 p-1.5 rounded border border-rose-600 shrink-0 text-rose-400"><ShieldAlert size={16}/></div>
                  <div><strong className="text-white">Field & Turn Alterations:</strong> There are various turn alterations and field effects (Weather, Terrain, Screens, Protect, Burn, Helping Hand...) that dynamically modify the damage calculations and effects of attacks.</div>
                </li>
                <li className="flex gap-3 items-start md:col-span-2">
                  <div className="bg-slate-800 p-1.5 rounded border border-blue-600 shrink-0 text-blue-400"><FileText size={16}/></div>
                  <div>
                    <strong className="text-white">Showdown Import/Export:</strong> 
                    <p className="text-xs mt-1">Copy and paste sets directly from Pokemon Showdown. Our system automatically converts classic EVs (0-252) into our Level 50 Stat Point system (0-32).</p>
                  </div>
                </li>
              </ul>
            </section>
          )}

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
