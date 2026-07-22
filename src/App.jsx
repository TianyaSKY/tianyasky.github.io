import React, { useState } from 'react';
import TelemetryBar from './components/TelemetryBar';
import BackgroundCanvas from './components/BackgroundCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Education from './components/Education';
import Research from './components/Research';
import Engineering from './components/Engineering';
import Awards from './components/Awards';
import Skills from './components/Skills';
import Contact from './components/Contact';
import CommandPalette from './components/CommandPalette';

export default function App() {
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  return (
    <div className="app-container">
      <TelemetryBar />
      <BackgroundCanvas />
      <Navbar onOpenCmdPalette={() => setIsCmdOpen(true)} />
      <main>
        <Hero onOpenCmdPalette={() => setIsCmdOpen(true)} />
        <About />
        <Education />
        <Research />
        <Engineering />
        <Awards />
        <Skills />
        <Contact />
      </main>
      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />
    </div>
  );
}
