import { useState, useEffect } from 'react'
import NavigationBar from './NavigationBar'
import DonationModal from './DonationModal'
import FeedbackModal from './FeedbackModal'
import { Heart, MessageSquare } from 'lucide-react'
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
  const [terrain, setTerrain] = useState<Terrain>('None')
  const [showDonation, setShowDonation] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false);

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

            <footer className="w-full text-center p-6 text-[10px] text-slate-500 max-w-5xl mx-auto border-t border-slate-800/50 mt-8 mb-4 flex flex-col items-center gap-4">
        <p>Disclaimer: Pokemon, all character names, images, and related assets are trademarks and copyright (c) of Nintendo, Creatures Inc., Game Freak, and The Pokemon Company. This website is an unofficial, non-profit fan-created tool intended for community analysis and entertainment. It is not affiliated with, endorsed, sponsored, or supported by Nintendo or The Pokemon Company in any way.</p>
        {isMobileDevice && <div className="flex justify-center items-center gap-4 mt-2">
          <button onClick={() => setShowFeedback(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold transition-all hover:scale-105">
            <MessageSquare size={14} className="text-blue-400" /> Feedback
          </button>
          <button onClick={() => setShowDonation(true)} className="flex items-center gap-1.5 px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full text-xs font-bold transition-all hover:scale-105">
            <Heart size={14} className="fill-rose-400" /> Support
          </button>
        </div>}
      </footer>
      <DonationModal isOpen={showDonation} onClose={() => setShowDonation(false)} />
      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
    </div>
  )
}
export default App
