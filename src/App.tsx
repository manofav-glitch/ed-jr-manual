import { useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { BottomNav } from './components/BottomNav.tsx';
import { CodeBlueScreen } from './features/codeblue/CodeBlueScreen.tsx';
import { DosesScreen } from './features/doses/DosesScreen.tsx';
import { FlowchartScreen } from './features/flowcharts/FlowchartScreen.tsx';
import { NoteScreen } from './features/note/NoteScreen.tsx';
import { AboutScreen } from './features/about/AboutScreen.tsx';
import { HomeScreen } from './features/protocols/HomeScreen.tsx';
import { ProtocolScreen } from './features/protocols/ProtocolScreen.tsx';
import { TriageScreen } from './features/triage/TriageScreen.tsx';
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
          <Route path="/f/:id" element={<FlowchartScreen />} />
          <Route path="/about" element={<AboutScreen />} />
          <Route path="/triage" element={<TriageScreen />} />
          <Route path="/code" element={<CodeBlueScreen />} />
          <Route path="/doses" element={<DosesScreen />} />
          <Route path="/note" element={<NoteScreen />} />
          <Route path="*" element={<HomeScreen />} />
        </Routes>
      </div>
      <BottomNav />
    </HashRouter>
  );
}
