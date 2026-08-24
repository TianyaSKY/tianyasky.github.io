import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Education from '../components/Education';
import ProjectsBento from '../components/ProjectsBento';
import Awards from '../components/Awards';
import Skills from '../components/Skills';
import Contact from '../components/Contact';

export default function Home({ onOpenCmdPalette }) {
  return (
    <>
      <Hero onOpenCmdPalette={onOpenCmdPalette} />
      <About />
      <Education />

      <section id="projects" className="section-inner">
        <ProjectsBento />
      </section>

      <Awards />
      <Skills />
      <Contact />
    </>
  );
}
