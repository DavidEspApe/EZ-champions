import { Zap, Crosshair, Shield, Settings, Sun, CloudRain, CloudFog, Snowflake, Leaf, Eye, Cloud, Coffee, Heart } from 'lucide-react';
import type { AppMode, Weather, Terrain } from './App';
import { useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface NavProps {
  activeMode: AppMode; setActiveMode: (mode: AppMode) => void;
  weather: Weather; setWeather: (w: Weather) => void;
  terrain: Terrain; setTerrain: (t: Terrain) => void;
  onSupport: () => void;
  onFeedback: () => void;
}

const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export default function NavigationBar({ activeMode, setActiveMode, weather, setWeather, terrain, setTerrain, onSupport, onFeedback }: NavProps) {
  const [showDonation, setShowDonation] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const modes = [
    { id: 'speed', label: 'Speed', icon: <Zap size={18} /> },
    { id: 'advanced', label: 'Advanced', icon: <Settings size={18} /> },
  ];

  return (
    <nav className="w-full bg-slate-900 border-b border-slate-800 text-white p-4 landscape:py-1 landscape:md:py-4 sticky top-0 z-50 shadow-lg min-h-[80px] landscape:min-h-[50px] landscape:md:min-h-[80px] flex items-center relative">
      {/* LOGO GIGANTE ESQUINA SUPERIOR IZQUIERDA */}
      <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-6 flex items-center shrink-0 cursor-default select-none z-[100] hover:scale-105 transition-transform">
        <img src="/ez-logo.png" alt="EZ Champions Logo" className="h-14 w-14 md:h-[70px] md:w-[70px] object-contain drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]" />
      </div>

      {/* Grid de 3 columnas fijas en desktop, flex-col en m?vil */}
      <div className="max-w-7xl mx-auto flex flex-col gap-3 landscape:gap-1 landscape:md:gap-3 md:grid md:grid-cols-3 items-center w-full">
        
        {/* COLUMNA 1: LOGO (Centrado en m?vil, Izquierda en desktop) */}
        <div className="hidden md:block w-full"></div>

        {/* COLUMNA 2: MODOS (Centrado, con scroll en m?vil) */}
        <div className="flex justify-center w-full overflow-x-auto md:overflow-visible p-1 md:p-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex bg-slate-800 p-1 rounded-full border border-slate-700 min-w-max">
            {modes.map((mode) => (
              <button 
                key={mode.id} 
                onClick={() => setActiveMode(mode.id as AppMode)} 
                className={`flex items-center gap-2 px-3 py-1.5 landscape:py-0.5 landscape:md:py-1.5 lg:px-4 lg:py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeMode === mode.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
              >
                {mode.icon} <span className="hidden md:inline">{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* COLUMNA 3: TOGGLES Y DONACIONES (Centrado en m?vil, Derecha en desktop, con scroll en m?vil) */}
        <div className="flex justify-center md:justify-end min-h-[42px] w-full overflow-x-auto md:overflow-visible p-1 md:p-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex items-center gap-3 w-full md:w-auto">
            {activeMode !== 'advanced' && (
              <div className="flex flex-nowrap items-center gap-2 min-w-max">
                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                  <button onClick={() => setWeather(weather === 'Sun' ? 'None' : 'Sun')} className={`p-1.5 rounded-lg transition-colors ${weather === 'Sun' ? 'bg-orange-500/20 text-orange-400' : 'text-slate-500 hover:text-slate-300'}`}><Sun size={18} /></button>
                  <button onClick={() => setWeather(weather === 'Rain' ? 'None' : 'Rain')} className={`p-1.5 rounded-lg transition-colors ${weather === 'Rain' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}><CloudRain size={18} /></button>
                  <button onClick={() => setWeather(weather === 'Sand' ? 'None' : 'Sand')} className={`p-1.5 rounded-lg transition-colors ${weather === 'Sand' ? 'bg-yellow-700/30 text-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}><CloudFog size={18} /></button>
                  <button onClick={() => setWeather(weather === 'Snow' ? 'None' : 'Snow')} className={`p-1.5 rounded-lg transition-colors ${weather === 'Snow' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500 hover:text-slate-300'}`}><Snowflake size={18} /></button>
                </div>
                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                  <button onClick={() => setTerrain(terrain === 'Electric' ? 'None' : 'Electric')} className={`p-1.5 rounded-lg transition-colors ${terrain === 'Electric' ? 'bg-yellow-400/20 text-yellow-400' : 'text-slate-500 hover:text-slate-300'}`}><Zap size={18} /></button>
                  <button onClick={() => setTerrain(terrain === 'Grassy' ? 'None' : 'Grassy')} className={`p-1.5 rounded-lg transition-colors ${terrain === 'Grassy' ? 'bg-green-500/20 text-green-400' : 'text-slate-500 hover:text-slate-300'}`}><Leaf size={18} /></button>
                  <button onClick={() => setTerrain(terrain === 'Psychic' ? 'None' : 'Psychic')} className={`p-1.5 rounded-lg transition-colors ${terrain === 'Psychic' ? 'bg-pink-500/20 text-pink-400' : 'text-slate-500 hover:text-slate-300'}`}><Eye size={18} /></button>
                  <button onClick={() => setTerrain(terrain === 'Misty' ? 'None' : 'Misty')} className={`p-1.5 rounded-lg transition-colors ${terrain === 'Misty' ? 'bg-fuchsia-400/20 text-fuchsia-300' : 'text-slate-500 hover:text-slate-300'}`}><Cloud size={18} /></button>
                </div>
              </div>
            )}
            
            
          </div>
        </div>

      </div>
    
      {/* Bot?n de Support con posici?n absoluta en la esquina superior derecha */}
      
      
      
    
      {/* Botones (Solo en Desktop) */}
      {!isMobileDevice && (
        <div className="absolute right-4 flex items-center z-[100]">
          <button onClick={onFeedback} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold transition-all hover:scale-105 mr-2">
            <MessageSquare size={14} className="text-blue-400" />
            <span>Feedback</span>
          </button>
          <button onClick={onSupport} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-xs font-bold transition-all hover:scale-105">
            <Heart size={14} className="fill-rose-400" />
            <span>Support</span>
          </button>
        </div>
      )}
    </nav>

  );
}
