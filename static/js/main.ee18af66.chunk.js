(this["webpackJsonpportfolio-site"]=this["webpackJsonpportfolio-site"]||[]).push([[0],[,,,,,,,,,,,,,function(e,t,a){e.exports=a.p+"static/media/brodys-icon.3decbb29.png"},function(e,t,a){e.exports=a.p+"static/media/alpine-icon.299060f2.png"},function(e,t,a){e.exports=a.p+"static/media/ssr-icon.42da1985.jpg"},function(e,t,a){e.exports=a(34)},,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},,,,,,function(e,t,a){"use strict";a.r(t);var n=a(0),i=a.n(n),r=a(12),o=a.n(r),s=(a(21),a(22),a(2)),l=a(3),c=a(4),m=a(5),d=(a(23),function(e){Object(m.a)(a,e);var t=Object(c.a)(a);function a(){var e;Object(s.a)(this,a);for(var n=arguments.length,i=new Array(n),r=0;r<n;r++)i[r]=arguments[r];return(e=t.call.apply(t,[this].concat(i))).interval=null,e.intervalDelay=5,e.letters=[],e.phrases=["Hi I am Ryan"],e.offsetChar=" ",e}return Object(l.a)(a,[{key:"componentDidMount",value:function(){window.addEventListener("resize",this.updateWindowDimensions)}},{key:"render",value:function(){}}]),a}(n.Component)),p=(a(24),function(e){Object(m.a)(a,e);var t=Object(c.a)(a);function a(){var e;Object(s.a)(this,a);for(var n=arguments.length,i=new Array(n),r=0;r<n;r++)i[r]=arguments[r];return(e=t.call.apply(t,[this].concat(i))).state={display:"extra"},e}return Object(l.a)(a,[{key:"handleExpandText",value:function(){"extra"===this.state.display?this.setState({display:""}):this.setState({display:"extra"})}},{key:"render",value:function(){var e=this;return i.a.createElement("div",null,i.a.createElement("p",null,"My career has already taken me on an exciting adventure. I started my career as a mechinical engineer. I was a first line supervisor for a locomotive refurbishing facility (engines, wheelsets, and tractions motors). It was during this time that I found my rudamentary knowledge of creating simple software systems could help remove some of the tedious aspects of people's jobs. I created a few desktop applications to make filling out QA forms simpler, and even built up to a system that would keep track of product and inventory throught the production line."),i.a.createElement("p",{className:this.state.display},"After some time, I ended up leaving that job and moving to San Diego where I used my engineering skills for the DoD. Very quickly I was able to demonstrate my design abilities. Over the first year, I had two designs implemented into LCS and LHA class Navy ships, improving the oil system. During this time, there were two software challenges that I undertook that helped me shape the direction of my career."),i.a.createElement("p",{className:this.state.display},"The first was from some of the reports I was creating at work. I found that our process very repetative and the means storing them to be primative and flawed. I set out to design a front end desktop application that would build our reports in a consistent way, while taking the information and storing it in a back end database that would be easier to query and maintain."),i.a.createElement("p",{className:this.state.display},"But the real game-changing project came one night (as so much great innovation often does) with my friends at our favorite bar. One of my friends owned a restaurant and wanted digital menu boards, but thought they current systems on the market were too expensive. Knowing that I had a bit of a knack for software projects, he asked me if I would be able to build him something. After a few iterations, I was able to deliver something that was powerful, but also scaleable."),i.a.createElement("p",{className:this.state.display},"Creating a startup was alway a goal of mine, so started selling these systems to bars in the area. It was during this time that I decided I wanted to leave the mechanical career track and begin my formal development as a software developer. I got a job with Accenture, moved back to Philly and worked with them for a while, getting some experience and implementing various solutions for fortune 500 clients."),i.a.createElement("p",{className:this.state.display},"Then I moved to working for Comcast, which has been amazing. Currently the UI team lead for a telemetry product."),i.a.createElement("div",{style:{textAlign:"center"}},i.a.createElement("div",{className:"show-more-text",onClick:function(){return e.handleExpandText()}},"extra"===this.state.display?"Read More":"Show Less")))}}]),a}(n.Component)),u=(a(25),function(e){return i.a.createElement("div",null,i.a.createElement("h1",{className:"section-title"},e.name))}),h=(a(26),a(27),function(e){Object(m.a)(a,e);var t=Object(c.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).icon="",n.name="",n.icon=e.icon,n.name=e.name,n.id=e.id,n}return Object(l.a)(a,[{key:"test",value:function(e){this.props.sendData(e)}},{key:"render",value:function(){var e=this;return console.log(this.props.flipId),i.a.createElement("div",{className:["project-wrapper",this.props.flipId===this.id?"flip":""].join(" ")},i.a.createElement("div",{className:"project-wrapper-front",onClick:function(){return e.test(e.id)}},i.a.createElement("img",{src:this.icon,style:{position:"absolute",zIndex:"10"}}),i.a.createElement("h1",{className:"tile-title"},this.name)),i.a.createElement("div",{className:"project-wrapper-back",onClick:function(){return e.test(e.id)}},i.a.createElement("p",{style:{padding:"10px 10px"}},this.props.description),i.a.createElement("div",null,i.a.createElement("p",{style:{textAlign:"center"},onClick:function(){return window.location.assign(e.props.link)}},i.a.createElement("strong",null,"View Project")),i.a.createElement("p",{style:{textAlign:"center"},onClick:function(){return window.location.assign(e.props.gitLink)}},i.a.createElement("strong",null,"View Repo")))))}}]),a}(n.Component)),f=a(13),g=a.n(f),v=a(14),w=a.n(v),y=a(15),b=a.n(y),k=function(e){Object(m.a)(a,e);var t=Object(c.a)(a);function a(){var e;Object(s.a)(this,a);for(var n=arguments.length,i=new Array(n),r=0;r<n;r++)i[r]=arguments[r];return(e=t.call.apply(t,[this].concat(i))).state={flipId:-1},e.test=function(t){e.setState({flipId:e.state.flipId===t?-1:t})},e}return Object(l.a)(a,[{key:"render",value:function(){return i.a.createElement("div",null,i.a.createElement(u,{name:"Projects"}),i.a.createElement("div",{className:"projects"},i.a.createElement(h,{className:"item1",name:"Brody's Burgers",link:"https://brodysburgersandbeer.com/",gitLink:"https://github.com/rjw1428/brodys-site",description:"Developing a website for a San Diego restaurant where all content could be edited from the managers\r phone, saving them extensive costs in having a web developer keep the changing content up to date.",icon:g.a,id:0,flipId:this.state.flipId,sendData:this.test}),i.a.createElement(h,{className:"item2",name:"Alpine Knives",link:"https://alpineknives.com",gitLink:"https://github.com/rjw1428/ssr-webstore",description:"Developing an e-commerce platform using Angular 8, FIrebase, Stripe, and Sendgrid to target mid size\r companies too small to develop their own site, but too big to form traditional small scale sales.\r (Currently in use by 1 company in Va).",icon:w.a,id:1,flipId:this.state.flipId,sendData:this.test}),i.a.createElement(h,{className:"item3",name:"SSR Digital Displays",link:"https://ssrdigitaldisplays.com/display/restfest/2",gitLink:"https://github.com/rjw1428/ssr-menuboard/tree/master/src/app",description:"Developed a full-stack Digital Menu system to reduce restaurant overhead and improve customer\r experience. Changes could be made in real-time from any web connected device. (Currently installed in 3 bars in San\r Diego and 2 in Philadelphia).",icon:b.a,id:2,flipId:this.state.flipId,sendData:this.test})))}}]),a}(n.Component),E=(a(28),a(6)),I=a(9),j=a(10),N=function(e){Object(m.a)(a,e);var t=Object(c.a)(a);function a(){var e;Object(s.a)(this,a);for(var n=arguments.length,i=new Array(n),r=0;r<n;r++)i[r]=arguments[r];return(e=t.call.apply(t,[this].concat(i))).onNavigate=function(e){window.location.assign(e)},e}return Object(l.a)(a,[{key:"render",value:function(){var e=this;return i.a.createElement("div",{className:"link-list"},i.a.createElement(E.a,{className:"link",icon:I.a,size:"4x",onClick:function(){return e.onNavigate("https://github.com/rjw1428?tab=repositories")}}),i.a.createElement(E.a,{className:"link",icon:j.a,size:"4x",onClick:function(){return e.onNavigate("mailto:software@ryanwilk.com?subject=Hey, I was checking out your website...")}}),i.a.createElement(E.a,{className:"link",icon:I.b,size:"4x",onClick:function(){return e.onNavigate("https://www.linkedin.com/in/rjw1428/")}}),i.a.createElement(E.a,{className:"link",icon:j.b,size:"4x",onClick:function(){return e.onNavigate("https://drive.google.com/open?id=1nyfBUDH1jbgf1TpJgvnvsIGBvP8KlCIK")}}))}}]),a}(n.Component);var x=function(){return document.title="Ryan's Portfolio",i.a.createElement("div",{className:"App"},i.a.createElement("div",{className:"background-wrapper"},i.a.createElement("div",{className:"background"})),i.a.createElement("div",{className:"header-wrapper"},i.a.createElement(d,null)),i.a.createElement("div",{className:"content-wrapper"},i.a.createElement(u,{name:"About Me"}),i.a.createElement(p,null),i.a.createElement(k,null),i.a.createElement(u,{name:"More Info"}),i.a.createElement(N,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(x,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[16,1,2]]]);
//# sourceMappingURL=main.ee18af66.chunk.js.map