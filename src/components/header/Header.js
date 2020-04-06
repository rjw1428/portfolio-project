import React, {Component} from 'react';
import './Header.css';

class Header extends Component {
    interval = null
    intervalDelay = 5 //seconds
    letters = []
    phrases = ["Hi I am Ryan"]
    offsetChar = " "
    // constructor(props) {
    //     super(props)
    //     this.letters = Array.apply(null, {length: 26}).map((val,i)=>String.fromCodePoint(i+65).toLowerCase()).concat([" ", "'", ","])
    //     this.state = {
    //         count: 1,
    //         maxWordLength: this.phrases.map(phrase=>phrase.split(" ").map(word=>word.length).reduce((acc,curr)=>acc<curr?curr:acc)).reduce((acc,curr)=>acc<curr?curr:acc),
    //         maxRowLength: this.phrases.map(phrase=>phrase.split(" ").length).reduce((acc,curr)=>acc<curr?curr:acc),
    //         width: 1000
    //     }
    //     this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    // }

    componentDidMount() {
        window.addEventListener('resize', this.updateWindowDimensions);
        
        // this.interval = setInterval(() => {
        //     const c = this.state.count % this.phrases.length
        //     this.setState({
        //         count: c + 1,
        //     })
        // }, 1000 * this.intervalDelay)
    }

    // componentWillUnmount() {
    //     clearInterval(this.interval);
    //     window.removeEventListener('resize', this.updateWindowDimensions)
    // }

    // createDials(phrase) {
    //     let dials = Array.apply(null, {length: this.state.maxWordLength}).map((val,i)=>i)
    //     let words = phrase.split(" ")
    //     return words.map((word, i)=>{
    //         return (
    //             <div key={"word"+i} className="letter-ticker">
    //                 {this.createDial(i)}
    //             </div>
    //         )
    //     })
    // }

    // createRow(word, colLength) {
    //     let offset = Math.floor((colLength.length - word.length)/2)
    //     let spacer = Array.apply(null, {length: offset}).map(val=>this.offsetChar).join("")
    //     word=spacer+word+spacer
    //     if ((colLength.length - word.length)/2>0)
    //         word=this.offsetChar+word
        
    //     return colLength.map((dial,i)=>{
    //         let letter = word[i]?word[i]:this.offsetChar
    //         return (
    //             <div className="letter" 
    //                 key={i} 
    //                 id={"dial" + i} 
    //                 style={{...this.setOffset(letter)}}
    //                 ref={this.dial0}>
    //                 {this.createDial(i)}
    //             </div>
    //         )
    //     })
    // }

    // createDial(dialNum) {
    //     return this
    //         .letters
    //         .map((val, i) => {
    //             return <div key={dialNum.toString() + i.toString()} id={"dial" + dialNum}>
    //                 {val.toUpperCase()}
    //             </div>
    //         })
    // }

    // getOffset(letter) {
    //     return this.letters.findIndex(val => val === letter.toLowerCase())
    // }

    // setOffset(letter) {
    //     let staticOffest=this.state.width>768?8:4
    //     return {
    //         top: "calc(-" + this.getOffset(letter) + "em - "+staticOffest+"px )"
    //     }
    // }

    // updateWindowDimensions() {
    //     this.setState({ width: window.innerWidth });
    //   }

    render() {
        return (
            // <div className="header-wrapper keyword" style={{backgroundImage: 'url('+backgroundImg+')'}}>
            //     <div >
            //         {this.createDials(this.phrases[this.state.count - 1])}
            //     </div>
            // </div>
            <div className="header-content" style={{height: '50vh', maxHeight: '500px'}}>
                <h1 className="title">Hi, I'm <strong>Ryan Wilk</strong></h1>
                <h3 className="subtitle">I am a front end web developer who enjoyes manipulating bits and bytes to explore the world of software development.</h3>
            </div>
        )
    }
}

export default Header