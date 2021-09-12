import "./myprofile.css";
import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { axiosHandler, getToken } from "../helper";
import { store } from "../stateManagement/store";
import { BASE_URL, BASE_URL1, POST_URL, OTHER_PROFILE_URL, UPDATE_FOLLOW } from '../urls';
import UserInfo from "./UserInfo";
import PostContent from "./PostContent";
import PostInfo from "./PostInfo";
import Comment from "./Comment";
import {Griddy} from "./MyProfile";
import { activeChatUserAction } from "../stateManagement/actions";

let post = [];
let otherUser=[];
const OtherProfile = (props)=> {
    const [fetching, setFetching] = useState(true)
    const [followFetching, setFollowFetching] = useState(true)

    const [error, setError] = useState(false)
    const [myPost, setMyPost] = useState(false)
    const {state:{userDetail}, dispatch} = useContext(store)
    const {state:{activeChatUser}} = useContext(store)

    const [otherUser, setOtherUser] = useState("")
    const [followers, setFollowers] = useState(false)
    const [following, setFollowing] = useState(false)
    const [followError, setFollowError] = useState(false)
    const [followLoading, setFollowLoading] = useState(false)

     useEffect(() =>{
        
      const othername= props.match.params.username;
        let extra = `?keyword=${othername}`;
       getOtherProfile(extra)
        
       
     return () => {
          };
     }, [])

   const  getOtherProfile =async(extra)=>{
       setFetching(true)
    const token = await getToken();
    const gp = await axiosHandler({
       method:"get",
       url: OTHER_PROFILE_URL + extra,
       token
     }).catch((e) => {
      console.log("Error in getOtherProfile::::",e);
      setError(true)
     });
  
     if(gp){
            console.log(" getOtherProfile res::::", gp.data);
            setOtherUser(gp.data)
            setFollowers(gp.data.followers.length)
            setFollowing(gp.data.following.length)
         
          //  otherUser = gp.data
           try {
            const name = gp.data.user.username
            let extra1 = `?keyword=${name}`;
            getMyPost(extra1)
           } catch (error) {
               setError(true)
           }
            
     }
   }

    const getMyPost = async(extra1) =>{
        setFetching(true)
      
        const token = await getToken();
        const res = await axiosHandler({
           method:"get",
           url: POST_URL + extra1,
           token
         }).catch((e) => {
          console.log("Error in MyPost::::",e);
          setError(true)
         });
      
         if(res){
            console.log(" MyPost::::", res.data);
            setMyPost(res.data.results)
            post = res.data.results
            setFetching(false)
            
         }
        //  console.log("PostList:::", myPost)
         console.log("post:::", post)
    
        }
     

        const followHandler =async (e)=>{
          setFollowLoading(true)
          const token = await getToken();
          const data= {"other_id": otherUser.user.id}
          console.log("before data::::", data)
          
           const res = await axiosHandler({
              method:"post",
              url: UPDATE_FOLLOW,
              data:data,
              token
            }).catch((e) => {
              console.log(e)
              setFollowError(true)
            });
          
            if (res){
              setFollowLoading(false)

              console.log("handleFollow:::",res.data)
              const rr1  = res.data["data"]
              console.log("rr2:::::", rr1)
              let a1 = document.getElementById("follow-btn")
              var vv =  document.getElementById("followers")

              if(rr1 ==="unfollowed"){
               a1.innerText = "Follow"
                let fvalue= vv.textContent
                fvalue =parseInt(fvalue) - 1
                vv.textContent= fvalue

              }else if(rr1==="followed") {
                a1.innerText = "Unfollow"
                let fvalue= vv.textContent
                fvalue =parseInt(fvalue) + 1
                vv.textContent= fvalue
              }
            }
            setFollowError(false)
          }

  if(fetching){
            return(
              <main id="main" class="flexbox-col-start-center">
                
              <div class="view-width">
              <section class="profile-header">
                    <div class="profile-header-inner flexbox">
                      <div class="phi-info-wrapper flexbox">
                        <div class="phi-info-left flexbox">

                           <div class="phi-profile-picture-wrapper">
                            <div class="phi-profile-picture-inner flexbox">
                              <img class="phi-profile-picture"  alt=""/>
                            </div>
                          </div>

                          <div class="phi-profile-username-wrapper flexbox-col-left">
                            <h3 class="phi-profile-username flexbox"><span class="material-icons-round"></span></h3>
                            <div className="ps-fm">
                            <p class="">Followers <span id="followers"></span></p>
                            <p class="">Following <span id="following"></span></p>
                            <p class="">Likes</p>
                            </div>
                            <p class="phi-profile-tagline">{otherUser.bio}</p><br/>
                           
                          </div>
                        </div>
                        <div class="phi-info-right flexbox-right">
                          <div className="buttons-fm">
                            <button type="button" class="btn-primary-gray button btn-primary flexbox">
                              <ion-icon name="heart-outline"></ion-icon> 
                              <span id="follow-btn">Follow
                                </span>
                            
                            </button>
                            <button type="button" class="btn-primary-gray button btn-primary flexbox">
                              <ion-icon name="heart-outline"></ion-icon> Message
                            </button>
                          </div>
                        </div>
                      </div>

                      <div class="profile-header-overlay"></div>
                      <img class="profile-header-image" src="https://images.unsplash.com/photo-1616808943301-d80596eff29f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2010&q=80" alt=""/>
                    </div>
                  </section>
            
                <section class="profile-page">
                  <h3>Profile Posts</h3>
                  <div class="profile-page-inner">
                
                      
                  </div>
                </section>
            
              </div>
            
            </main>
            )
        }

   return (
    
    <main id="main" class="flexbox-col-start-center">
                
                <div class="view-width">
                <section class="profile-header">
                      <div class="profile-header-inner flexbox">
                        <div class="phi-info-wrapper flexbox">
                          <div class="phi-info-left flexbox">

                             <div class="phi-profile-picture-wrapper">
                              <div class="phi-profile-picture-inner flexbox">
                                <img class="phi-profile-picture" src={`${BASE_URL1+otherUser.profile_picture}`} alt=""/>
                              </div>
                            </div>

                            <div class="phi-profile-username-wrapper flexbox-col-left">
                              <h3 class="phi-profile-username flexbox">{otherUser.user.username}<span class="material-icons-round">verified</span></h3>
                              <div className="ps-fm">
                              <p class="">Followers <span id="followers">{followers}</span></p>
                              <p class="">Following <span id="following">{following}</span></p>
                              <p class="">Likes 2B</p>
                              </div>
                              <p class="phi-profile-tagline">{otherUser.bio}</p><br/>
                             
                            </div>
                          </div>
                          <div class="phi-info-right flexbox-right">
                            <div className="buttons-fm">
                              <button type="button" class="btn-primary-gray button btn-primary flexbox"  onClick={followHandler}>
                                <ion-icon name="heart-outline"></ion-icon> 
                                <span id="follow-btn">{followLoading ? "...":"Follow"}
                                  </span>
                              
                              </button>
                              <Link to={`/chatpage/`+ otherUser.user.username}> <button onClick={()=> dispatch({type:activeChatUserAction,payload:{username:otherUser.user.username,img:BASE_URL1+otherUser.profile_picture, timeout:otherUser.user.id}})
} type="button" class="btn-primary-gray button btn-primary flexbox">
                                <ion-icon name="heart-outline"></ion-icon> Message
                              </button></Link>
                            </div>
                          </div>
                        </div>

                        <div class="profile-header-overlay"></div>
                        <img class="profile-header-image" src="https://images.unsplash.com/photo-1616808943301-d80596eff29f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2010&q=80" alt=""/>
                      </div>
                    </section>
              
                  <section class="profile-page">
                    <h3>Profile Posts</h3>
                    <div class="profile-page-inner">
                    {/* {post.map((item,key)=>
                                          <Griddy image={item.image}/>

                       )} */}
                         {myPost.map((item,key)=>
                      <Link to={`/post-detail/`+ item.id}>
                                  <Griddy image={item.image}/>
                                   </Link> 
                       )}
                        
                    </div>
                  </section>
              
                </div>
              
              </main>
         
             )
                }
  
 
 export default OtherProfile;
   
    // const getProfile =()=>{
    //     const container = document.querySelector(".container");
    // const unsplashURL = "https://source.unsplash.com/random/";
    // const rows = 5;
    
    // const getRandomNumber = () => Math.floor(Math.random() * 10) + 300;
    // const getRandomSize = () => `${getRandomNumber()}x${getRandomNumber()}`;
    
    // for (let i = 0; i < rows * 3; i++) {
    //   const image = document.createElement("img");
    //   image.src = `${unsplashURL}${getRandomSize()}`;
    //   container.appendChild(image);
    // }
    // }