const fs = require('fs');
let content = fs.readFileSync('src/AdvancedMode.tsx', 'utf8');

// 1. Add imports and savingPlayer state
content = "import { BuildDropdown, SaveBuildModal } from './components/SavedBuilds';\n" + content;
content = content.replace("export default function AdvancedMode() {\n", "export default function AdvancedMode() {\n  const [savingPlayer, setSavingPlayer] = useState<1 | 2 | null>(null);\n");
content = content.replace('import { Crosshair', 'import { Save, Crosshair');

// Fix AdvancedMode prop signature that we missed earlier!
content = content.replace("export default function AdvancedMode() {\n", "export default function AdvancedMode({ weather, terrain, setWeather, setTerrain }: { weather?: Weather, terrain?: Terrain, setWeather?: (w: Weather) => void, setTerrain?: (t: Terrain) => void }) {\n");
// Actually, earlier we found it already has props! Let's check:
