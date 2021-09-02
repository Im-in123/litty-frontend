import React from "react";
import "./application.css";
import Header from "./Header";
import Feed from "./Feed";
import ScrollTopButton from "./ScrollTopButton";

class Application extends React.Component {
    constructor(props) {
       super(props);
       this.state = { isMobile: false };
       this.checkResolution = this.checkResolution.bind(this);
    }
 
    checkResolution(e) {
       if (document.documentElement.offsetWidth < 900 && !this.state.isMobile) this.setState({ isMobile: true });
       else if (document.documentElement.offsetWidth > 900 && this.state.isMobile) this.setState({ isMobile: false });
    }
 
    componentDidMount() {
       if (document.documentElement.offsetWidth < 900) this.setState({ isMobile: true });
       else this.setState({ isMobile: false });
       window.addEventListener('resize', this.checkResolution);
    }
    componentWillUnmount() {
       window.removeEventListener('resize', this.checkResolution);
    }
 
    render() {
       return (
          <div className="wrapper">
             <Header isMobile={this.state.isMobile} />
             <Feed isMobile={this.state.isMobile} />
             <ScrollTopButton />
          </div>
       )
    }
 }
 
 export default Application;
//  ReactDOM.render(<Application />, document.getElementById('root'));