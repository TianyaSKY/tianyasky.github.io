import React from 'react';
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

export default function App() {
  return (
    <div className="app-container">
      <BackgroundCanvas />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Education />
        <Research />
        <Engineering />
        <Awards />
        <Skills />
        <Contact />
      </main>
    </div>
  );
}
