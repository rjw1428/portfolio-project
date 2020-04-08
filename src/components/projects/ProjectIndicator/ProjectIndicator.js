import React, {Component} from 'react';
import './ProjectIndicator.css'

class ProjectIndicator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isHover1: false,
            isHover2: false
        }
    }

    mouseEnter(num) {
        if (num===1)
            this.setState({isHover1: true})
        else 
            this.setState({isHover2: true})
    }

    mouseLeave(num) {
        if (num===1)
            this.setState({isHover1: false})
        else 
            this.setState({isHover2: false})
    }

    emit(val) {
        this.props.sendData(val)
    }

    render() {
        return (
            <div className={["project-wrapper", this.props.flipId===this.props.id?"flip":""].join(" ")}>
                <div className={"project-wrapper-front"} onClick={() => this.emit(this.props.id)}>
                    <img onMouseEnter={()=>this.mouseEnter(1)} onMouseLeave={()=>this.mouseLeave(1)} src={this.props.icon} style={{position: 'absolute', zIndex: '10', opacity: (this.state.isHover1 || this.state.isHover2)?.9:.5}} alt={this.props.name}/>
                    <img onMouseEnter={()=>this.mouseEnter(2)} onMouseLeave={()=>this.mouseLeave(2)} className="logo" src={this.props.logo} style={{position: 'absolute', zIndex: '10'}} alt={this.props.name}/>
                </div> 
                <div className={"project-wrapper-back"} onClick={() => this.emit(this.id)}>
                    <h3>{this.props.name}</h3>
                    <p style={{padding: '0px 10px', margin: 0}}>{this.props.description}</p>
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