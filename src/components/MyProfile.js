import "./myprofile.css";
import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { axiosHandler, getToken } from "../helper";
import { store } from "../stateManagement/store";
import { BASE_URL, BASE_URL1, LOCAL_CHECK, POST_URL, SAVED_URL } from '../urls';
import UserInfo from "./UserInfo";
import PostContent from "./PostContent";
import PostInfo from "./PostInfo";
import Comment from "./Comment";
import { logout } from "../customs/authController";


let post = [];
let saved = [];

const MyProfile = (props)=> {
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState(false)
    const {state:{userDetail}, dispatch} = useContext(store)
    const [followers, setFollowers] = useState(false)
    const [following, setFollowing] = useState(false)

    const [showProfile, setShowProfile] = useState(true)
    const [showSaved, setShowSaved] = useState(false)
    const [showLiked, setShowLiked] = useState(false)

    const [myPost, setMyPost] = useState(false)
    const [mySaved, setMySaved] = useState(false)
    const [myLiked, setMyLiked] = useState(false)
    let bb


    useEffect(() =>{
        console.log("MyProfile props:::",props)

        let extra = `?keyword=${userDetail.user.username}`;
        setFollowers(userDetail.followers.length)
        setFollowing(userDetail.following.length)

        getMyPost(extra)
     return () => {
          };
     }, [])

  //    useEffect(() =>{
  //     try {
  //        bb = document.getElementById("main-feed")
  //          bb.addEventListener('scroll', autoFetch)
  //      } catch (error) {
  //         //  alert("bb")
  //         //  console.log(error)
  //      }
      
  //  return () => {
  //     window.removeEventListener('scroll', autoFetch);

  //       };
  //  }, [evl])
    
    const getMyPost = async(extra="") =>{
        setFetching(true)
      
        const token = await getToken();
        const res = await axiosHandler({
           method:"get",
           url: POST_URL + extra,
           token
         }).catch((e) => {
          console.log("Error in MyPost::::",e);
          setError(true)
         });
      
         if(res){
            console.log(" MyPost::::", res.data);
            setMyPost(res.data.results)
            post = res.data.results
          
         }
         setFetching(false)
         console.log("PostList:::", myPost)
         console.log("post:::", post)
    
        }
        const getMySaved = async(extra="") =>{
          // setFetching(true)
        
          const token = await getToken();
          const res = await axiosHandler({
             method:"get",
             url: SAVED_URL + extra,
             token
           }).catch((e) => {
            console.log("Error in getMySaved::::",e);
            setError(true)
           });
        
           if(res){
              console.log(" getMySaved::::", res.data);
              setMySaved(res.data.results)
              saved = res.data.results
            
           }
          //  setFetching(false)
           console.log("getMySaved:::", mySaved)
           console.log("getMySaved:::", saved)
      
          }

  const toggleProfile=(e)=>{
            setShowProfile(true)
            setShowLiked(false)
            setShowSaved(false)
            // getMySaved()
          }
const toggleSaved =(e)=>{
          setShowProfile(false)
          setShowLiked(false)
          setShowSaved(true)
          getMySaved()
        }
const toggleLiked =(e)=>{
          setShowProfile(false)
          setShowLiked(true)
          setShowSaved(false)
          // getMySaved()
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
                            <img class="phi-profile-picture" alt=""/>
                          </div>
                        </div>
                        
                        <div class="phi-profile-username-wrapper flexbox-col-left">
                          <h3 class="phi-profile-username flexbox"><span class="material-icons-round"></span></h3>
                          <div className="ps-fm">
                          <p class="">Followers </p>
                          <p class="">Following </p>
                          <p class="">Likes</p>
                          </div> 
                          <p class="phi-profile-tagline">Loading...</p>
                          <br></br><br></br>
                         

                        </div>
                      </div>
                      <div class="phi-info-right flexbox-right">
                        <div className="buttons-fm">
                          <button type="button" class="btn-primary-gray button btn-primary flexbox">
                            <ion-icon name="heart-outline"></ion-icon> <Link to="/profile-update">Settings</Link> <div class="btn-secondary"></div>
                          </button>
                          <button type="button" class="btn-primary-gray button btn-primary flexbox"
                         
                          >
                            <ion-icon name="heart-outline"></ion-icon> Logout<div class="btn-secondary"></div>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="profile-header-overlay"></div>
                    <img class="profile-header-image" src="https://images.unsplash.com/photo-1616808943301-d80596eff29f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2010&q=80" alt=""/>
                  </div>
                </section>
          
                <section class="profile-page">
                  <div className="grid-headings">
                  <h3 >Posts</h3> 
                  <h3 >Saved </h3>
                  <h3 >Liked</h3>
                  </div>
                 
                  <div class="profile-page-inner">
                  
                      
                  </div>
         
            
            </section>
              </div>
            
            </main>            )
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
                                {LOCAL_CHECK? 
                                 <img class="phi-profile-picture" src={`${BASE_URL1+userDetail.profile_picture}`} alt=""/>
                                 :
                                 <img class="phi-profile-picture" src={userDetail.profile_picture_url} alt=""/>
                                }
                                
                              </div>
                            </div>
                            
                            <div class="phi-profile-username-wrapper flexbox-col-left">
                              <h3 class="phi-profile-username flexbox">{userDetail.user.username}<span class="material-icons-round">verified</span></h3>
                              <div className="ps-fm">
                              <p class="">Followers {followers}</p>
                              <p class="">Following {following}</p>
                              <p class="">Likes 2B</p>
                              </div> 
                              <p class="phi-profile-tagline">{userDetail.bio}</p>
                              <br></br><br></br>
                             

                            </div>
                          </div>
                          <div class="phi-info-right flexbox-right">
                            <div className="buttons-fm">
                              <button type="button" class="btn-primary-gray button btn-primary flexbox">
                                <ion-icon name="heart-outline"></ion-icon> <Link to="/profile-update">Settings</Link> <div class="btn-secondary"></div>
                              </button>
                              <button type="button" class="btn-primary-gray button btn-primary flexbox"
                              onClick={() => logout(props)}
                              >
                                <ion-icon name="heart-outline"></ion-icon> Logout<div class="btn-secondary"></div>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div class="profile-header-overlay"></div>
                        <img class="profile-header-image" src="https://images.unsplash.com/photo-1616808943301-d80596eff29f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2010&q=80" alt=""/>
                      </div>
                    </section>
              
                    <section class="profile-page">
                      <div className="grid-headings">
                      <h3 onClick={toggleProfile}>Posts</h3> 
                      <h3 onClick={toggleSaved}>Saved </h3>
                      <h3 onClick={toggleLiked}>Liked</h3>
                      </div>
                      {showProfile &&
                      <div class="profile-page-inner postscroll">
                      {/* {post.map((item,key)=>
                                            <Griddy image={item.image}/>

                         )} */}
                           {myPost && myPost.map((item,key)=>
                        <Link to={`/post-detail/`+ item.id}>
                                    <Griddy image={item.image}/>
                                     </Link> 
                         )}
                          
                      </div>
                }
                     {showSaved &&
                   <div class="profile-page-inner savedscroll" >
                  
                        {mySaved && mySaved.map((item,key)=>
                     <Link to={`/post-detail/`+ item.post.id}>
                                 <Griddy2 post={item.post}/>
                                  </Link> 
                      )}
                       
                   </div>
                }
                {showLiked &&
                   <div class="profile-page-inner likedscroll">
                  
                        {/* { myLiked && myLiked.map((item,key)=>
                     <Link to={`/post-detail/`+ item.id}>
                                 <Griddy image={item.image}/>
                                  </Link> 
                      )}
                        */}
                   </div>
                }
                
                </section>
                  </div>
                
                </main>
             )
                }
  
 
export const Griddy = (props) =>{
  console.log("Griddy props::", props)
    if(props.image){
        let image;
        try {
            image= props.image[0]
        } catch (error) {
            return(
                <></>
            )
        }
        console.log("Griddyimg:::", props.image[0])
        return (
           <>
                       
   <div class="profile-page-item flexbox" key={image.id}>
   <img class="profile-page-item-image" src={LOCAL_CHECK? image.image: image.image_url} alt=""/>
 </div>
                     
           </>
        );
     }
    };

    export const Griddy2 = (props) =>{
      console.log("Griddy2 props::", props)
        if(props.post){
            let image;
            try {
                image= props.post.image[0]
            } catch (error) {
                return(
                    <></>
                )
            }
            console.log("Griddy2 img:::", props.post.image[0])
            return (
               <>
                           
       <div class="profile-page-item flexbox" key={image.id}>
       <img class="profile-page-item-image" src={LOCAL_CHECK? image.image: image.image_url} alt=""/>
     </div>
                         
               </>
            );
         }
        };


 export default MyProfile;