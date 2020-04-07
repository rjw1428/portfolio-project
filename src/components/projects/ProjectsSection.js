import React, {Component} from 'react';
import './ProjectsSection.css';
import ProjectIndicator from './ProjectIndicator/ProjectIndicator';
import brodysIcon from '../../images/brodys-icon.png'
import alpineIcon from '../../images/alpine-icon.png'
import ssrIcon from '../../images/ssr-icon.jpg'

class ProjectSection extends Component {
    state = { 
        flipId: -1
    }

    test = (currentVal) =>{
        this.setState({ flipId: this.state.flipId === currentVal?-1:currentVal })
    }

    render() {
        return (
            <div>
                <div className="projects">
                    <ProjectIndicator 
                        className="item1" 
                        name="Brody's Burgers" 
                        link="https://brodysburgersandbeer.com/"
                        gitLink="https://github.com/rjw1428/brodys-site"
                        description="Developing a website for a San Diego restaurant where all content could be edited from the managers
                        phone, saving them extensive costs in having a web developer keep the changing content up to date."
                        icon={brodysIcon}
                        id={0}
                        flipId={this.state.flipId}
                        sendData={this.test}/>
                    <ProjectIndicator 
                        className="item2" 
                        name="Alpine Knives" 
                        link="https://alpineknives.com" 
                        gitLink="https://github.com/rjw1428/ssr-webstore"
                        description="Developing an e-commerce platform using Angular 8, FIrebase, Stripe, and Sendgrid to target mid size
                        companies too small to develop their own site, but too big to form traditional small scale sales.
                        (Currently in use by 1 company in Va)."
                        icon={alpineIcon}
                        id={1}
                        flipId={this.state.flipId}
                        sendData={this.test}/>
                    <ProjectIndicator 
                        className="item3" 
                        name="SSR Digital Displays" 
                        link="https://ssrdigitaldisplays.com/display/restfest/2" 
                        gitLink="https://github.com/rjw1428/ssr-menuboard/tree/master/src/app"
                        description="Developed a full-stack Digital Menu system to reduce restaurant overhead and improve customer
                        experience. Changes could be made in real-time from any web connected device. (Currently installed in 3 bars in San
                        Diego and 2 in Philadelphia)."
                        icon={ssrIcon}
                        id={2}
                        flipId={this.state.flipId}
                        sendData={this.test}/>
                </div>
          </div>
        )
    }
}

export default ProjectSection
