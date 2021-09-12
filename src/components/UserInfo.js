import React,{useEffect, useContext, useState, useLayoutEffect} from "react";
import { Link } from "react-router-dom";
import { store } from "../stateManagement/store";


const UserInfo =(props)=>  {
   const {state:{userDetail}, dispatch} = useContext(store);
   const [plink, setPlink] = useState("");
   const [loading, setLoading] = useState("true");


   useEffect(() =>{
      checkname()

   return () => {
        };
   }, [])

   const checkname = async()=>{
      if(props.data){
      if (userDetail.user.username === props.data.username){
         setPlink(`/my-profile/`);

      }else{
         setPlink(`/other-profile/`+ props.data.username);

            }
      setLoading(false)
      }

}

if(loading){
   return (
      <div className="user-info">
       

         <div className="user-avatar">
         <img src="" alt="author"></img>

         </div>
        
         <div className="user-data">
            <div className="username">
            <svg width="10" height="10">

                  <rect width="100%" height="100%" style={{ fill: "#dbdbdb" }} />
               </svg>
            </div>

            <div className="post-date">
            </div>
         </div>

      </div>
   );
}else{

   if(props.data){
      // console.log("UserInfo props:::", props.data)
      let pp
      try {
         pp= props.data.user_picture
    
       } catch (error) {
         pp=""//userDetail.profile_picture.file_upload
    
       }  
       return (
          <div className="user-info">
            <Link to={ plink }>

             <div className="user-avatar">
                {pp? (
             <img src={pp} alt="author"></img>

                ):(
                  <img src="" alt="author"></img>

                )}
             </div>
             </Link>
             <div className="user-data">
                <div className="username">
                   {/* <svg width={props.data.username.toString()} height="10"> */}
                {/* <svg width="40" height="7">

                      <rect width="100%" height="100%" style={{ fill: "#dbdbdb" }} />
                   </svg> */}
                </div>
 
                <div className="post-date">
                   {/* {props.data.created_at} */}
                </div>
             </div>
 
          </div>
       );
       
   }else{
      return "....."
   }
} 
 }
 
 export default UserInfo;