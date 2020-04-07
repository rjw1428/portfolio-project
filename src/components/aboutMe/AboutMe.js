import React, { Component } from 'react';
import './AboutMe.css';
import pic1 from '../../images/img1.jpg';
import pic2 from '../../images/sd1.jpg';
import pic3 from '../../images/philly1.jpg';
class AboutMe extends Component {
    constructor(props) {
        super(props);
        this.image1 = React.createRef();
    }

    state = {
        display: "hide",
        showImg1: false
    }
    componentDidMount() {
        let img1TopPosition = this.image1.offsetTop
        window.addEventListener('scroll', this.listenToScroll)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.listenToScroll)
    }

    listenToScroll = (topPosition) => {
        let scrollTop = document.documentElement.scrollTop + document.body.clientHeight - document.body.scrollHeight
        console.log(topPosition <= scrollTop)
        this.setState({
            showImg1: topPosition <= scrollTop,
        })
        console.log(document.documentElement.clientHeight, document.documentElement.scrollTop, this.state.position, this.image1.current.offsetTop)
    }

    handleExpandText() {
        if (this.state.display === 'hide')
            this.setState({ display: 'show' })
        else this.setState({ display: 'hide' })
    }
    render() {
        return (
            <div className="about-content">
                <div className={this.state.display === 'hide'?"first":""}>
                    <div className="slant" ref={this.image1}>
                        <div className={["slant-left"]}></div>
                    </div>
                    <p>My career has already taken me on an exciting adventure. I started my career as a mechinical engineer.
                    I was a first line supervisor for a locomotive
                    refurbishing facility (engines, wheelsets, and tractions motors).
                    It was during this time that I found my rudamentary knowledge of
                    creating simple software systems could help remove some of the tedious aspects of people's jobs.
                    I created a few desktop applications to make filling out QA forms simpler, and even built up to a
                    system that would keep track of product and inventory throught the production line.
                    </p>
                    <div class="row">
                        <img className="display-lg" style={{marginBottom:this.state.display === 'hide'?'20px':'0'}} src={pic1} />
                    </div>
                </div>
                <div className={this.state.display}>
                    <p>After some time, I ended up leaving that job and moving to San Diego where I used my engineering skills
                    for the DoD. Very quickly I was able to demonstrate my design abilities.
                    Over the first year, I had two designs implemented into LCS and LHA class Navy ships, improving the oil system.
                    During this time, there were two software challenges that I undertook that helped me shape the direction of my career.
                    </p>
                    <div className="slant">
                        <div className="slant-right"></div>
                    </div>
                    <p>The first was from some of the reports I was creating at work. I found that our process very repetative
                    and the means storing them to be primative and flawed. I set out to design a front end desktop application that would build
                    our reports in a consistent way, while taking the information and storing it in a back end database that would be easier to query and maintain.
                    </p>
                    <div class="row">
                        <img className="display-lg-2" src={pic2} />
                    </div>
                    <p>But the real game-changing project came one night (as so much great innovation often does) with my friends at our favorite bar.
                    One of my friends owned a restaurant and wanted digital menu boards, but thought they current systems on the market were too expensive. Knowing that I had
                    a bit of a knack for software projects, he asked me if I would be able to build him something. After a few iterations, I was able to deliver something that was powerful, but also scaleable.
                    </p>
                    <figure className="slant">
                        <div className="slant-bottom"></div>
                    </figure>
                    <p>Creating a startup was alway a goal of mine, so started selling these systems to bars in the area. It was during this time that I decided I wanted to leave the mechanical career track and begin my formal development as a software developer.
                    I got a job with Accenture, moved back to Philly and worked with them for a while, getting some experience and implementing various solutions for fortune 500 clients.
                    </p>
                    <p>Then I moved to working for Comcast, which has been amazing. Currently the UI team lead for a telemetry product.
                    </p>
                    <div class="row">
                        <img className="display-lg-3" src={pic3} />
                    </div>
                </div>
                <div className="show-more-text" onClick={() => this.handleExpandText()}>{this.state.display === 'hide' ? "Read More" : "Show Less"}</div>
            </div>
        )
    }
}

export default AboutMe