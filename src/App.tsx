import { HashRouter, Routes, Route } from 'react-router-dom';
import { CharacterProvider } from './context/CharacterContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Atlas from './pages/Atlas';
import ZoneDetail from './pages/ZoneDetail';
import RacesClasses from './pages/RacesClasses';
import Progression from './pages/Progression';
import CharacterPage from './pages/CharacterPage';

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
            <Route path="/progression" element={<Progression />} />
            <Route path="/character" element={<CharacterPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </CharacterProvider>
  );
}
