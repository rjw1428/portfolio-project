import React, {Component} from 'react';
import './ProjectIndicator.css'

class ProjectIndicator extends Component {

    emit(val) {
        this.props.sendData(val)
    }

    render() {
        return (
            <div className={["project-wrapper", this.props.flipId===this.props.id?"flip":""].join(" ")}>
                <div className={"project-wrapper-front"} onClick={() => this.emit(this.props.id)}>
                    <img src={this.props.icon} style={{position: 'absolute', zIndex: '10'}} alt={this.props.name}/>
                    <h1 className={"tile-title"}>{this.props.name}</h1>
                    {/* onClick={()=> window.location.assign(this.link)} */}
                </div> 
                <div className={"project-wrapper-back"} onClick={() => this.emit(this.id)}>
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