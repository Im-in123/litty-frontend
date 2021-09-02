import React from "react";

 
 class Controls extends React.Component {
    constructor(props) {
       super(props);
       this.state = {
          count: 0
       }
    }
 
    render() {
       return (
          <div className="right-side">
             <div className="controls" onChange={this.props.change}>
                <div className="controls-title">Feed controls</div>
 
                <div className="toggle-wrap" title="Automatically append new posts in your feed">
                   <input id="autoUpdate" type="checkbox" defaultChecked></input>
                   <label htmlFor="autoUpdate">
                      Autoupdate
                   <div className="toggle"><div className="round"></div></div>
                   </label>
                </div>
 
                <div className="toggle-wrap" title="Page doesn't jump when you scroll down (more than half screen)">
                   <input id="fixedScroll" type="checkbox" defaultChecked></input>
                   <label htmlFor="fixedScroll">
                      Fixed scroll
                   <div className="toggle"><div className="round"></div></div>
                   </label>
                </div>
 
                <div className="toggle-wrap" title="Show only posts that you liked">
                   <input id="showOnlyLiked" type="checkbox"></input>
                   <label htmlFor="showOnlyLiked">
                      Show only liked
                   <div className="toggle"><div className="round"></div></div>
                   </label>
                </div>
 
                <div className="toggle-wrap" title="If max posts count exceeded, oldest automatically replaced">
                   <input id="clearOld" type="checkbox" defaultChecked></input>
                   <label htmlFor="clearOld">
                      Clear old
                   <div className="toggle"><div className="round"></div></div>
                   </label>
                </div>
 
                <div className="toggle-wrap" title="Dont upload new posts">
                   <input id="stopUpload" type="checkbox"></input>
                   <label htmlFor="stopUpload">
                      Stop upload
                   <div className="toggle"><div className="round"></div></div>
                   </label>
                </div>
 
                <div className="controls-title">App info</div>
                <div className="row">
                   <span>Total posts:</span>
                   <span>{this.props.totalPosts}</span>
                </div>
                <div className="row">
                   <span>On screen:</span>
                   <span>{this.props.postsOnScreen}</span>
                </div>
                <div className="row">
                   <span>Max posts:</span>
                   <span>50</span>
                </div>
 
             </div>
 
          </div>
       );
    }
 }

 export default Controls;