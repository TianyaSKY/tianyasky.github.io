import React from 'react';
import Sidebar from '../components/Sidebar';
import About from '../components/About';
import News from '../components/News';
import ProjectsSection from '../components/ProjectsSection';
import Education from '../components/Education';
import Skills from '../components/Skills';
import Contact from '../components/Contact';

export default function Home({ onOpenCmdPalette }) {
  return (
    <div id="main" className="academic-main" role="main">
      <Sidebar onOpenCmdPalette={onOpenCmdPalette} />
      <article className="page" itemScope itemType="http://schema.org/CreativeWork">
        <meta itemProp="headline" content="Minxiang Chen - Homepage" />
        <div className="page__inner-wrap">
          <section className="page__content" itemProp="text">
            <About />
            <hr />
            <News />
            <hr />
            <ProjectsSection />
            <hr />
            <Education />
            <hr />
            <Skills />
            <hr />
            <Contact />
          </section>
        </div>
      </article>
    </div>
  );
}
