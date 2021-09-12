import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import PostContent from './PostContent';
import PostInfo from './PostInfo';
import UserInfo from './UserInfo';
import Comment from './Comment';
import { POST_URL } from '../urls';
import { axiosHandler, getToken } from "../helper";
import { store } from "../stateManagement/store";
import { CommentTriggerAction, postTriggerAction } from "../stateManagement/actions";
import { VerifyFunc } from "../customs/others";

// import "./main.css"

let p1
let post =[];
let goneNext = false;
let bb
let track = 0
const Feed = (props) =>{
    
    // const {state:{commentTrigger}, dispatch} = useContext(store)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState(false)
    const [postList, setPostList] = useState([])
    const {state:{userDetail}, dispatch} = useContext(store)
    const {state:{postTrigger}} = useContext(store)
    // dispatch({type:postTriggerAction,payload:1});

    const [nextPage, setNextPage] = useState(1)
    const [canGoNext, setCanGoNext] = useState(false)
    const [shouldHandleScroll, setShouldHandleScroll] = useState(false)
    const [evl, setEvl] = useState(false)
    let tt=1

    useEffect(() => {
        alert("Please note:This site is still under development.Images are deleted after dyno restart. Hence some post dont have images.")
      }, [])

      useEffect(() =>{
        VerifyFunc(userDetail)

     return () => {
          };
     }, [])

    useEffect(() =>{

        getPostContent(postTrigger)
     return () => {
          };
     }, [])
   

     useEffect(() =>{
        try {
           bb = document.getElementById("main-feed")
             bb.addEventListener('scroll', autoFetch)
         } catch (error) {
            //  alert("bb")
            //  console.log(error)
         }
        
     return () => {
        window.removeEventListener('scroll', autoFetch);

          };
     }, [evl])
       
    const autoFetch =()=>{
        if(shouldHandleScroll){

        if(bb.offsetHeight + bb.scrollTop >= bb.scrollHeight-700){
            console.log("finally", canGoNext, goneNext)
            if(canGoNext && !goneNext){
                goneNext = true;
                setShouldHandleScroll(false)
                getPostContent()

            }else{
                console.log("passing cangonext", canGoNext, goneNext)

            }

        }
    }else{
        console.log("passing autofetch", canGoNext, goneNext)
    }
    }
  const getPostContent = async(page=null) =>{
   
    setCanGoNext(false)
    const token = await getToken();

    const res = await axiosHandler({
       method:"get",
    //    url:  POST_URL + `?page=${page ? page : nextPage}`,
     url:  page ?  `${POST_URL}?page=${page}` : p1.next,
    //  url:  POST_URL + `?page=${page ? page : tt}`,
       token
     }).catch((e) => {
      console.log("Error in Feed::::",e);
      setError(true)
     });
  
     if(res){
        console.log(" Feed::::", res.data.results);
        console.log("post:::", res.data)

        if(post.length >0){       
             setPostList([...postList, ...res.data.results])
            // post =   [...post, ...res.data.results]
            for(var i in res.data.results){
                post.push(res.data.results[i])
            }

        }else{
            post = res.data.results
            setPostList(res.data.results)

        }
         p1  = res.data

        if(p1.next){
            setCanGoNext(true)
            // tt += 1 
            // // dispatch({type:postTriggerAction,payload:postTrigger+1});

            // // alert(postTrigger+1)
            // alert(tt)
            // setNextPage(nextPage + 1)
            
                        goneNext = false;

            // setTimeout(() => setShouldHandleScroll(true), 1000)
            setShouldHandleScroll(true)
        }else{
            setShouldHandleScroll(false)
            // alert("gonenext")
        }
     

     }
    //  setScroll()

     console.log("PostList:::", postList)
     console.log("post:::", post)
    
     setFetching(false)
     setEvl(true)
    }
    // window.onscroll = function(){
    // }
  
    
    if(fetching){
        return(
            <div id="maina-feed" >         
                    <div id="feed" >
                        <div className="content-wrapper feed-wrapper">
                             <div className="post-wall">
                                <div className="post">
                                    <div className="post-wrapper" >
                                        <UserInfo  />
                                       
                                        <div className="post-content">
                                        <div class="slideshow-container">
                                        <div class="fade mySlides mySlidesget">
                                        <div class="numbertext">loading..</div>
                                        <img src="" alt="loading.." className="iimm" style={{width:"100%"}}/>
                                        <div class="text">
                                            loading..
                                        </div>
                                        
                                        </div>
                                        </div>
                                        <br/>
                                        </div>

                                       <div className="post-info">
                                        <div className="likes">
                                                <a onClick={(e)=>e.preventDefault()}>
                                                
                                                    <div className="icon"><i className="far fa-heart"></i></div>
                                                </a>
                                            </div> 
                                            <div className="comments" id="##">
                                            <a href="#">
                                                <div className="icon"><i className="far fa-comment-alt"></i></div>
                                            </a>
                                            </div>
                                            <div className="share" id="##">
                                                <a href="#">
                                                    <div className="icon">
                                                        <i className="far fa-save"></i></div>
                                                </a>
                                            </div>
                                        </div>

                                        <div className="caption">
                                        <p><b></b> 
                                        loading...
                                        </p>
                                        </div>
                                        <div className="post-date"> </div>                                       
                                        
                                    </div>
        
                                </div>
                            </div>
                        </div>
                    </div>
              
                  </div>
        )
    
    }
         return (
             
<div id="main-feed"
    //  style={{overflow:"scroll", height:"100vh"}} 
     >
            {post && postList.map((item,key)=>

            <div id="feed" key={key}>
                <div className="content-wrapper feed-wrapper">
                     <div className="post-wall">
                        <div className="post">
                            <div className="post-wrapper" >
                                <UserInfo data={item.author} />
                               <PostContent id={item.id} image={item.image} video={item.video} /> 
                                <PostInfo id={item.id} like={item.like} caption ={item.caption} author={item.author} created_at={item.created_at} tags={item.tags} comment_count={item.comment_count}/>
                                {/* <Comment id={item.id}/> */}
                                <br/>
                                <br/>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
           )}
                                 <div>loading more...</div>

          </div>
         )

        
 }

export default Feed;