import React, {Component} from 'react';
import './ProjectIndicator.css'

class ProjectIndicator extends Component {
    icon = ""
    name = ""
    constructor(props) {
        super(props)
        this.icon = props.icon
        this.name = props.name
        this.id = props.id
    }

    test(val) {
        this.props.sendData(val)
    }

    render() {
        console.log(this.props.flipId)
        return (
            <div className={["project-wrapper", this.props.flipId===this.id?"flip":""].join(" ")}>
                <div className={"project-wrapper-front"} onClick={() => this.test(this.id)}>
                    <img src={this.icon} style={{position: 'absolute', zIndex: '10'}}/>
                    <h1 className={"tile-title"}>{this.name}</h1>
                    {/* onClick={()=> window.location.assign(this.link)} */}
                </div> 
                <div className={"project-wrapper-back"} onClick={() => this.test(this.id)}>
                    <p style={{padding: '10px 10px'}}>{this.props.description}</p>
                    <div>
                        <p style={{textAlign: 'center'}} onClick={()=> window.location.assign(this.props.link)}><strong>View Project</strong></p>
                        <p style={{textAlign: 'center'}} onClick={()=> window.location.assign(this.props.gitLink)}><strong>View Repo</strong></p>
                    </div>
                </div> 
            </div>
        )
    }
}

export default ProjectIndicator