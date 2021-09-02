import React from "react";

 
 class Header extends React.Component {
    constructor(props) {
       super(props);
       this.state = {
          scrollIndicator: false,
          sideMenuVisible: false
       };
       this.showIndicator = this.showIndicator.bind(this);
       this.showSideMenu = this.showSideMenu.bind(this);
       this.hideSideMenu = this.hideSideMenu.bind(this);
    }
 
    showIndicator() {
       if (window.pageYOffset > document.documentElement.clientHeight / 2) {
          if (!this.state.scrollIndicator) this.setState({ scrollIndicator: true });
       } else {
          if (this.state.scrollIndicator) this.setState({ scrollIndicator: false });
       }
    }
 
    showSideMenu(e) {
       e.preventDefault();
       this.setState({ sideMenuVisible: true });
       document.querySelector('.right-side').classList.add('side-open');
       document.body.style.overflow = 'hidden';
    }
 
    hideSideMenu(e) {
       e.preventDefault();
       this.setState({ sideMenuVisible: false });
       document.querySelector('.right-side').classList.remove('side-open');
       document.body.style.overflow = 'visible';
    }
 
    componentDidMount() {
       document.addEventListener('scroll', this.showIndicator);
    }
 
    componentWillUnmount() {
       document.removeEventListener('scroll', this.showIndicator);
    }
 
    render() {
       return (
          <div id="header">
             {this.state.sideMenuVisible ? <div className="overlay" onClick={this.hideSideMenu}></div> : ""}
             <div className={`fixed-header ${this.state.scrollIndicator ? 'scroll-indicator' : ''}`}>
                <div className="content-wrapper header-content">
                   <div className="app-title">
                      {this.props.isMobile ? <div className="side-menu-button"><a href="#" onClick={this.showSideMenu}><i className="fas fa-bars"></i></a></div> : ""}
                      <div className="title">Litty</div>
                   </div>
                   <div className="header-right-side">
                      <div className="header-info">
                         <svg width="75" height="7">
                            <rect width="100%" height="100%" style={{ fill: "#8075a4" }} />
                         </svg>
                         <svg width="40" height="7" style={{ float: "right" }}>
                            <rect width="100%" height="100%" style={{ fill: "#a4a4a4" }} />
                         </svg>
                      </div>
                      <div className="user-avatar">
                         <img src="https://justmonk.github.io/react-news-feed-spa-demo/img/user-avatar.jpg" alt="user-avatar"></img>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       );
    }
 }

 export default Header;