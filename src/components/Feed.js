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


    useEffect(() =>{
        VerifyFunc(userDetail)

        getPostContent(1)
     return () => {
          };
     }, [postTrigger])
   
     
  const getPostContent = async(page) =>{
    setFetching(true)
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
        setPostList(...postList,res.data.results)
        post = res.data
        if(post.next){
            setCanGoNext(true)
            setNextPage(nextPage + 1)
            // setTimeout(() => setShouldHandleScroll(true), 1000)
            setShouldHandleScroll(true)

        }
     

     }
     console.log("PostList:::", postList)
     console.log("post:::", post)
     setFetching(false)
   

    }
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
        )
    
    }
         return (
<div id="main-feed" onScroll={handleScroll}>
            {postList.map((item,key)=>

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