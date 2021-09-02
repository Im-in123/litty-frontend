
import React from "react";

 
 class ScrollTopButton extends React.Component {
    constructor(props) {
       super(props);
       this.state = { 
          visible: false,
          styles: { display: 'none' } 
       };
       this.visible = false;
       this.scrollHandler = this.scrollHandler.bind(this);
       this.resizeHandler = this.resizeHandler.bind(this);
    }
 
    scrollHandler() {
       if (window.pageYOffset > document.documentElement.clientHeight / 2) {
          if (!this.state.visible) this.setState({ visible: true });
       } else {
          if (this.state.visible) this.setState({ visible: false });
       }
    }
 
    resizeHandler() {
       console.log(`resize`);
       if (this.isThrottled === undefined) this.isThrottled = false;
       if (this.isQueueEmpty === undefined) this.isQueueEmpty = true;
       
       if (!this.isThrottled) {
          this.isThrottled = true;
          this.setState( {styles: { position: 'fixed', top: '4.4rem', left: `${document.querySelector('.feed-wrapper').getBoundingClientRect().left - 60}px`, display: `${this.state.visible ? 'block' : 'none'}` } });
          setTimeout(() => {
             this.isThrottled = false;
             if (!this.isQueueEmpty) this.resizeHandler();
          },100);
       } else {
          if (this.isQueueEmpty) this.isQueueEmpty = false;
       }
       
    }
 
    scrollToTop(e) {
       e.preventDefault();
       window.scrollTo(0, 0);
    }
 
    componentDidMount() {
       document.addEventListener('scroll', this.scrollHandler);
       window.addEventListener('resize', this.resizeHandler);
    }
    componentWillUnmount() {
       document.removeEventListener('scroll', this.scrollHandler);
       window.removeEventListener('resize', this.resizeHandler);
    }
 
    render() {
       if (!document.querySelector('.feed-wrapper')) this.styles = { display: 'none' };
       else this.styles = { position: 'fixed', top: '4.4rem', left: `${document.querySelector('.feed-wrapper').getBoundingClientRect().left - 60}px`, display: `${this.state.visible ? 'block' : 'none'}` };
 
       return (
          <div id="scrollTopButton" style={this.styles}><a href="#" onClick={this.scrollToTop}><i className="far fa-caret-square-up"></i></a></div>
       );
    }
 }


 export default ScrollTopButton;