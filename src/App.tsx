import { useState, useEffect } from 'react'
import NavigationBar from './NavigationBar'
import SpeedMode from './SpeedMode'
import AdvancedMode from './AdvancedMode'
import GuideModal from './GuideModal';
import { preloadSprites } from './core/nucleo';

export type AppMode = 'speed' | 'advanced';
export type Weather = 'None' | 'Sun' | 'Rain' | 'Sand' | 'Snow';
export type Terrain = 'None' | 'Electric' | 'Grassy' | 'Psychic' | 'Misty';

function App() {
  const [activeMode, setActiveMode] = useState<AppMode>('advanced');
  const [weather, setWeather] = useState<Weather>('None');
  const [terrain, setTerrain] = useState<Terrain>('None');

  useEffect(() => {
    preloadSprites();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans relative overflow-x-hidden">
      
      {/* BotÃ³n flotante de guÃ­a adaptativo */}
      <GuideModal activeTab={activeMode} />

      <NavigationBar  
        activeMode={activeMode} 
        setActiveMode={setActiveMode} 
        weather={weather} 
        setWeather={setWeather} 
        terrain={terrain} 
        setTerrain={setTerrain} 
      />
      
      <main className="container mx-auto px-4 py-4 md:py-8 md:px-8">
        {activeMode === 'speed' && <SpeedMode weather={weather} terrain={terrain} setWeather={setWeather} setTerrain={setTerrain} />}
        {activeMode === 'advanced' && <AdvancedMode weather={weather} terrain={terrain} setWeather={setWeather} setTerrain={setTerrain} />}
      </main>

      <footer className="w-full text-center p-6 text-[10px] text-slate-500 max-w-5xl mx-auto border-t border-slate-800/50 mt-8 mb-4">
        Disclaimer: Pokemon, all character names, images, and related assets are trademarks and copyright (c) of Nintendo, Creatures Inc., Game Freak, and The Pokemon Company. This website is an unofficial, non-profit fan-created tool intended for community analysis and entertainment. It is not affiliated with, endorsed, sponsored, or supported by Nintendo or The Pokemon Company in any way.
      </footer>
    </div>
  )
}
export default App
