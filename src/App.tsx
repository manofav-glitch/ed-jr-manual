import { useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { BottomNav } from './components/BottomNav.tsx';
import { AboutScreen } from './features/about/AboutScreen.tsx';
import { Placeholder } from './features/Placeholder.tsx';
import { HomeScreen } from './features/protocols/HomeScreen.tsx';
import { ProtocolScreen } from './features/protocols/ProtocolScreen.tsx';
import { useApp } from './lib/store.ts';

export function App() {
  const theme = useApp((s) => s.theme);
  useEffect(() => {
    if (theme === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    // Hash routes work on GitHub Pages and offline without server rewrites.
    <HashRouter>
      <div className="min-h-dvh pb-[calc(4rem+env(safe-area-inset-bottom))]">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/p/:chapterId/:tab?" element={<ProtocolScreen />} />
          <Route path="/about" element={<AboutScreen />} />
          <Route path="/triage" element={<Placeholder title="Triage" />} />
          <Route path="/code" element={<Placeholder title="Code blue" />} />
          <Route path="/doses" element={<Placeholder title="Doses" />} />
          <Route path="/note" element={<Placeholder title="Case-sheet note" />} />
          <Route path="*" element={<HomeScreen />} />
        </Routes>
      </div>
      <BottomNav />
    </HashRouter>
  );
}
