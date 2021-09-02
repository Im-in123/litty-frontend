import Header from "./Header";
// import "./main2.css";
import "./main.css";
import Feed from "./Feed";
import React from "react";

 class Main extends React.Component {
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

     componentDidUpdate(prevProps, prevState) {
        if (prevState.count !== this.state.count) { //this default if optmizes the code in rerenders. 
            document.title = `You clicked ${this.state.count} times`;
          }

     }

     componentWillUnmount() {
        window.removeEventListener('resize', this.checkResolution);
     }
     
    render() {
        return (
            <div className="wrapper">
                <Feed/>
            </div>
           
        )
 }

}

export default Main;