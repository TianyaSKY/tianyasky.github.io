import React, { useState } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Education from '../components/Education';
import ProjectsBento from '../components/ProjectsBento';
import Awards from '../components/Awards';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import VisionSimulator from '../components/VisionSimulator';
import SciFiTerminal from '../components/SciFiTerminal';

export default function Home({ onOpenCmdPalette }) {
  const [openDemo, setOpenDemo] = useState(null); // 'vision' | 'terminal' | null

  return (
    <>
      <Hero onOpenCmdPalette={onOpenCmdPalette} />
      <About />
      <Education />

      <section id="projects" className="section-inner">
        <ProjectsBento onOpenDemo={(kind) => setOpenDemo(kind)} />
      </section>

      <Awards />
      <Skills />
      <Contact />

      {openDemo === 'vision' && (
        <div className="inline-demo-modal" onClick={() => setOpenDemo(null)}>
          <div className="inline-demo-shell" onClick={(e) => e.stopPropagation()}>
            <button className="inline-demo-close" onClick={() => setOpenDemo(null)}>关闭</button>
            <VisionSimulator />
          </div>
        </div>
      )}
      {openDemo === 'terminal' && (
        <div className="inline-demo-modal" onClick={() => setOpenDemo(null)}>
          <div className="inline-demo-shell" onClick={(e) => e.stopPropagation()}>
            <button className="inline-demo-close" onClick={() => setOpenDemo(null)}>关闭</button>
            <SciFiTerminal />
          </div>
        </div>
      )}
    </>
  );
}
