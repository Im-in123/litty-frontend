import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import PostContent from './PostContent';
import PostInfo from './PostInfo';
import UserInfo from './UserInfo';
import Comment from './Comment';
import { POST_URL } from '../urls';
import { axiosHandler, getToken } from "../helper";
import { store } from "../stateManagement/store";
import { CommentTriggerAction } from "../stateManagement/actions";
import { VerifyFunc } from "../customs/others";

// import "./main.css"


let post =[];
let goneNext = false;
let bb
const Feed = (props) =>{
    // const {state:{commentTrigger}, dispatch} = useContext(store)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState(false)
    const [postList, setPostList] = useState([])
    const {state:{userDetail}, dispatch} = useContext(store)
    const {state:{postTrigger}} = useContext(store)
    const [nextPage, setNextPage] = useState(1)
    const [canGoNext, setCanGoNext] = useState(false)
    const [shouldHandleScroll, setShouldHandleScroll] = useState(false)
    const [evl, setEvl] = useState(false)


    useEffect(() =>{
        VerifyFunc(userDetail)

        getPostContent(1)
     return () => {
          };
     }, [postTrigger])
   

     useEffect(() =>{
        try {
           bb = document.getElementById("main-feed")
             bb.addEventListener('scroll', autoFetch)
         } catch (error) {
             alert("bb")
             console.log(error)
         }
        
     return () => {
        window.removeEventListener('scroll', autoFetch);

          };
     }, [evl])
       
    const autoFetch =()=>{
        if(!shouldHandleScroll)return;
        // console.log(bb)

        // console.log(bb.scrollHeight,bb.offsetHeight, bb.scrollTop)
        // if(bb.scrollTop >= 2000){
        //     console.log("a little close to final")
        // }

        if(bb.offsetHeight + bb.scrollTop >= bb.scrollHeight-300){
            console.log("finally")
            if(canGoNext && !goneNext){
                goneNext = true;
                getPostContent()
            }

        }
    }
  const getPostContent = async(page) =>{
      
    // setFetching(true)
    setCanGoNext(false)
    const token = await getToken();

    const res = await axiosHandler({
       method:"get",
       url:  POST_URL + `?page=${page ? page : nextPage}`,
       token
     }).catch((e) => {
      console.log("Error in Feed::::",e);
      setError(true)
     });
  
     if(res){
        console.log(" Feed::::", res.data.results);
        console.log("post:::", res.data)

        // if(page){

        // }
        if(post.length >0){       
             setPostList([...postList, ...res.data.results])
            post =   [...post, ...res.data.results]

        }else{
            post = res.data.results
            setPostList(res.data.results)

        }
        let p1  = res.data

        if(p1.next){
            setCanGoNext(true)
            setNextPage(nextPage + 1)
            // setTimeout(() => setShouldHandleScroll(true), 1000)
            setShouldHandleScroll(true)
        }else{
            setShouldHandleScroll(false)
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
  
    const handleScroll = (e) => {
        alert("m")
        const b = document.getElementById("main-feed")
        console.log("handle b::", b)
        // if(!shouldHandleScroll)return;
        if(b.scrollHeight <= 100){
          if(canGoNext && !goneNext){
            goneNext = true;
            getPostContent()
          }
        }
      }
    if(fetching){
        return(
            <div id="main-feed" >
            <div id="feed">
            <div className="content-wrapper feed-wrapper">
                 <div className="post-wall">
                    <div className="post">
                        <div className="post-wrapper">
                            {/* <UserInfo  />
                            <PostContent />
                            <PostInfo/> */}
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
                            </div>

                        </div>
                    </div>
                </div>
            </div>
           )}
 
          </div>
         )

        
 }

export default Feed;