import { HashRouter, Routes, Route } from 'react-router-dom';
import { CharacterProvider } from './context/CharacterContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Atlas from './pages/Atlas';
import ZoneDetail from './pages/ZoneDetail';
import RacesClasses from './pages/RacesClasses';
import Progression from './pages/Progression';
import CharacterPage from './pages/CharacterPage';
import Bestiary from './pages/Bestiary';
import Quests from './pages/Quests';
import Macros from './pages/Macros';
import Abilities from './pages/Abilities';
import Travel from './pages/Travel';
import Handbook from './pages/Handbook';
import Factions from './pages/Factions';
import ClassDetail from './pages/ClassDetail';
import ClassIndex from './pages/ClassIndex';
import Lore from './pages/Lore';

export default function App() {
  return (
    <CharacterProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/atlas" element={<Atlas />} />
            <Route path="/atlas/:zoneId" element={<ZoneDetail />} />
            <Route path="/classes" element={<RacesClasses />} />
            <Route path="/classes/:classId" element={<ClassDetail />} />
            <Route path="/spells" element={<ClassIndex />} />
            <Route path="/bestiary" element={<Bestiary />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/factions" element={<Factions />} />
            <Route path="/macros" element={<Macros />} />
            <Route path="/abilities" element={<Abilities />} />
            <Route path="/travel" element={<Travel />} />
            <Route path="/handbook" element={<Handbook />} />
            <Route path="/lore" element={<Lore />} />
            <Route path="/progression" element={<Progression />} />
            <Route path="/character" element={<CharacterPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </CharacterProvider>
  );
}
