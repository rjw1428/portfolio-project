import React from 'react';
import './App.css';
import Header from './components/header/Header'
import ProjectIndicator from './components/ProjectIndicator/ProjectIndicator';

function App() {
  document.title = "Ryan's Portfolio"
  return (
    <div className="App">
      <div className="background-wrapper">
        <div className="background"></div>
      </div>
      <div className="container">
        <div className="content-wrapper">
          <Header />
          <div className="projects">
            <ProjectIndicator className="item1" name="Brody's Burgers" link="https://brodysburgersandbeer.com/"/>
            <ProjectIndicator className="item2" name="Alpine Knives" link="https://alpineknives.com"/>
            <ProjectIndicator className="item3" name="SSR Digital Displays" link="https://ssrdigitaldisplays.com/display/restfest/2"/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
