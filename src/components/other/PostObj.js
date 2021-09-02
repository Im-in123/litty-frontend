import React from "react";

 class PostObj {
    constructor(options) {
       this.postList = options.list;
       this.updateParentState = options.update;
       this.id = options.id;
       this.avatar = options.avatar;
       this.nameLength = options.nameLength || 67;
       let dateNow = new Date();
       this.date = `${dateNow.toLocaleString('en', { day: "2-digit" })} ${dateNow.toLocaleString('en', { month: "short" })} at ${dateNow.toLocaleString('ru', { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
       this.img = options.img;
       this.likes = 0;
       this.maxLikes = Math.round(7 - 0.5 + Math.random() * (153 - 7 + 0.5));
       this.isLiked = false;
       this.comments = [];
       this.isExpanded = false;
       this.views = 1;
       this.maxViews = Math.round(277 - 0.5 + Math.random() * (1770 - 277 + 0.5));
 
       //timers
       this.likeTimer = setInterval(() => {
          if (this.likes >= this.maxLikes) clearInterval(this.likeTimer);
          this.likes++;
          this.updateParentState();
       }, Math.round(730 - 0.5 + Math.random() * (1650 - 730 + 0.5)));
       this.viewTimer = setInterval(() => {
          if (this.views >= this.maxViews) clearInterval(this.viewTimer);
          this.views++;
          this.updateParentState();
       }, Math.round(430 - 0.5 + Math.random() * (1000 - 430 + 0.5)));
 
       //imported methods
       this.deleteHandler = this.deleteHandler.bind(this);
       this.likeHandler = this.likeHandler.bind(this);
       this.addCommentHandler = this.addCommentHandler.bind(this);
    }
 
    get commentsCount() {
       return this.comments.length;
    }
 
    likeHandler(e) {
       e.preventDefault();
       let button = e.target.closest('.likes');
       if (!this.isLiked) {
          button.classList.toggle('liked');
          this.likes++;
       } else {
          button.classList.toggle('liked');
          this.likes--;
       }
       this.isLiked = !this.isLiked;
       this.updateParentState();
    }
 
    deleteHandler(e) {
       e.preventDefault();
 
       e.target.closest('.post').className = 'deleted';
       //clear interval for better performance
       clearInterval(this.timerId);
       delete this.postList[this.id];
       this.updateParentState();
    }
 
    addCommentHandler(e) {
       e.preventDefault();
       let form = e.target;
       let commentText = form.text.value.trim();
       if (!commentText.length) {
          form.text.value = "";
          return;
       }
       this.comments.push({
          userLength: 75,
          avatar: "https://justmonk.github.io/react-news-feed-spa-demo/img/user-avatar.jpg",
          text: commentText,
          type: "user"
       });
       form.text.value = "";
       this.updateParentState();
    }
 
 }
 

 export default PostObj;