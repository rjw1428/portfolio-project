import React from 'react';
import './App.css';
import Header from './components/header/Header'
import AboutMe from './components/aboutMe/AboutMe'
import SectionTitle from './components/sectionTitle/SectionTitle'
import ProjectSection from './components/projects/ProjectsSection'
import Links from './components/links/Links'

function App() {
  return (
    <div className="App">
      <div className="background-wrapper">
        <div className="background"></div>
      </div>
      <div className="header-wrapper">
        <Header />
      </div>
      <div className="content-wrapper">
        <SectionTitle name="About Me" />
        <AboutMe />
        <SectionTitle name="Projects" />
        <ProjectSection />
        {/* <SectionTitle name="Cool Things" /> */}
        {/* AMERICAN FLAG... LEGO COSTUME... IDK */}
        <SectionTitle name="More Info" />
        <Links />
      </div>
    </div>
  );
}

export default App;
