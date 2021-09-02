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

const Feed = (props) =>{
    // const {state:{commentTrigger}, dispatch} = useContext(store)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState(false)
    const [postList, setPostList] = useState(false)
    const {state:{userDetail}, dispatch} = useContext(store)
    const {state:{postTrigger}} = useContext(store)


    useEffect(() =>{
        VerifyFunc(userDetail)

        getPostContent()
     return () => {
          };
     }, [postTrigger])
   
     
  const getPostContent = async(extra ='') =>{
    setFetching(true)
  
    const token = await getToken();
    const res = await axiosHandler({
       method:"get",
       url: POST_URL+extra,
       token
     }).catch((e) => {
      console.log("Error in Feed::::",e);
      setError(true)
     });
  
     if(res){
        console.log(" Feed::::", res.data);
        setPostList(res.data)
        post = res.data
     

     }
     setFetching(false)
     console.log("PostList:::", postList)
     console.log("post:::", post)

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
<>
            {post.map((item,key)=>

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
 
          </>
         )

        
 }

export default Feed;