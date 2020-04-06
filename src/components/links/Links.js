import React, {Component} from 'react';
import './Links.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faListAlt } from '@fortawesome/free-regular-svg-icons'

class Links extends Component {
    onNavigate = (address) => {
        window.location.assign(address)
    }
    render() {
        return (
            <div className="link-list">
                <FontAwesomeIcon 
                    className="link" 
                    icon={faGithub} 
                    size="4x" 
                    onClick={()=>this.onNavigate("https://github.com/rjw1428?tab=repositories")}/>
                <FontAwesomeIcon 
                    className="link" 
                    icon={faEnvelope} 
                    size="4x"
                    onClick={()=>this.onNavigate("mailto:software@ryanwilk.com?subject=Hey, I was checking out your website...")}/>
                <FontAwesomeIcon 
                    className="link" 
                    icon={faLinkedin} 
                    size="4x"
                    onClick={()=>this.onNavigate("https://www.linkedin.com/in/rjw1428/")}/>
                <FontAwesomeIcon 
                    className="link" 
                    icon={faListAlt} 
                    size="4x"
                    onClick={()=>this.onNavigate("https://drive.google.com/open?id=1nyfBUDH1jbgf1TpJgvnvsIGBvP8KlCIK")}/>
            </div> 
        )
    }
}

export default Links