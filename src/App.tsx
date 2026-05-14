import { useState } from 'react'
import NavigationBar from './NavigationBar'
import SpeedMode from './SpeedMode'
import DefenseMode from './DefenseMode'
import AttackMode from './AttackMode'
import AdvancedMode from './AdvancedMode'
import GuideModal from './GuideModal';

export type AppMode = 'speed' | 'attack' | 'defense' | 'advanced';
export type Weather = 'None' | 'Sun' | 'Rain' | 'Sand' | 'Snow';
export type Terrain = 'None' | 'Electric' | 'Grassy' | 'Psychic' | 'Misty';

function App() {
  const [activeMode, setActiveMode] = useState<AppMode>('speed');
  const [weather, setWeather] = useState<Weather>('None');
  const [terrain, setTerrain] = useState<Terrain>('None');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans relative">
      
      {/* Botón flotante de guía adaptativo */}
      <GuideModal activeTab={activeMode} />

      <NavigationBar  
        activeMode={activeMode} 
        setActiveMode={setActiveMode} 
        weather={weather} 
        setWeather={setWeather} 
        terrain={terrain} 
        setTerrain={setTerrain} 
      />
      
      <main className="container mx-auto py-8">
        {activeMode === 'speed' && <SpeedMode weather={weather} terrain={terrain} setWeather={setWeather} setTerrain={setTerrain} />}
        {activeMode === 'attack' && <AttackMode weather={weather} terrain={terrain} setWeather={setWeather} setTerrain={setTerrain} />}
        {activeMode === 'defense' && <DefenseMode weather={weather} terrain={terrain} setWeather={setWeather} setTerrain={setTerrain} />}
        {activeMode === 'advanced' && <AdvancedMode weather={weather} terrain={terrain} setWeather={setWeather} setTerrain={setTerrain} />}
      </main>
    </div>
  )
}
export default App