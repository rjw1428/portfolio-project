import React, {Component} from 'react';
import './Header.css';

class Header extends Component {
    interval = null
    intervalDelay = 5 //seconds
    letters = Array.apply(null, {length: 26}).map((val,i)=>String.fromCodePoint(i+65).toLowerCase()).concat(["'",","])
    phrases = ["AAAAAAAAAAAAAAAAA","Hi, I'm Ryan Wilk"]
    constructor(props) {
        super(props)
        this.state = {
            count: 0
        }
    }
    componentDidMount() {
        window.addEventListener('resize', this.updateWindowDimensions);
        setTimeout(()=>{
            this.setState({
                count: 1,
            })
        }, 100)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions)
    }

    updateWindowDimensions() {
        console.log("HERE")
        // this.setState({ width: window.innerWidth });
    }

    createDials(phrase) {
        let dials = Array.apply(null, {length: this.phrases[this.state.count].length}).map((val,i)=>i)
        return (
            <div className="letter-ticker">
                {dials.map((dial,i)=>{
                    let letter = phrase[i]
                    let offset = this.getOffset(letter)
                    return (
                        <div className="letter" 
                            key={i} 
                            id={"dial" + i} 
                            style={this.setStyle(offset, i)}>
                            {this.createDial(i)}
                        </div>
                    )
                })}
            </div>
        )
    }


    createDial(dialNum) {
        return this.letters.map((val, i) => {
            return <div style={{ height: "1em"}} key={dialNum.toString() + i.toString()} id={"dial" + dialNum}>
                {val.toUpperCase()}
            </div>
        })
    }
    

    getOffset(letter) {
        let num = this.letters.findIndex(val => val === letter.toLowerCase())
        return num<0?28:num
    }

    setStyle(offset, letterNum) {
        let w=offset>25?.4:.6
        w = (offset === 22 || offset === 12)?.9:w
        let a=offset>25?'left':'center'
        let h=1
        return {
            // transform: "translateY(-"+offset*h+"em)",//"calc(-"+h+"em *"+ offset +")",
            top: -offset*h+"em",
            width: w+"em",
            lineHeight: h+"em",
            height: -h*28+"em",
            textAlign: a,
            fontWeight: letterNum>=8?700:400,
        }
    }
    render() {
        return (
            <div className="header-content title" style={{height: '50vh', maxHeight: '500px'}}>
                <div className="ticker-wrapper">
                    {this.createDials(this.phrases[this.state.count])}
                </div>
                <h3 className="subtitle">I am a front end web developer who enjoyes manipulating bits and bytes to explore the world of software development.</h3>
            </div>
        )
    }
}

export default Header