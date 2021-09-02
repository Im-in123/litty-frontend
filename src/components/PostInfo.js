import React, { useState, useEffect, useContext} from "react";
import { store } from "../stateManagement/store";
import { CommentTriggerAction, postCommentAction } from "../stateManagement/actions";
import Comment from "./Comment";
import { LIKE_URL} from "../urls";
import { axiosHandler, getToken } from "../helper";
import { Link } from "react-router-dom";

 const PostInfo  = (props) => {
   const {state:{commentTrigger}, dispatch} = useContext(store)
   const {state:{postComment}} = useContext(store)
   const [loading, setLoading] = useState(true);
   const [likeIconStyle, setLikeIconStyle] = useState("");
    const {state:{userDetail}} = useContext(store)
    const [likesend, setLikeSend] = useState(false);
    const [plink, setPlink] = useState("");



   console.log("PostInfo props:::", props)
   let like = props.like;
   let like_count = like.length; 
   if(like_count===0){
      like_count= null
   }
   let caption = props.caption
   let author = props.author.username
   let created_at = props.created_at
   let tags = props.tags;
   let comment_count = props.comment_count
   let  isliked =null;
   const [actiontype, setActiontype] = useState("unlike");
  


   useEffect(() =>{
      checkname()
            try {

         // console.log("likeeeeeeeee maiin:::::::", like)

         for (var i in like){
            let like1= like[i]
            if(like1.user.username===userDetail.user.username){
               isliked =like1.user.username;
               // console.log("likeeeeeeeee:::::::", isliked)
               // actiontype="like";
               setActiontype("like")
               // alert(actiontype)
               break;
            }else{
               isliked= null;
               // actiontype="unlike"; 
               setActiontype("unlike")

            }
            // setLikeIconStyle(isliked ? "fas" : "far")
            // likeIconStyle = isliked ? "fas" : "far";
            // setLoading(false)

         }
      } catch (error) {
         console.log("likeeeeeeeee error:::::::", error)
         isliked= null;
         setActiontype("unlike")

         // setLikeIconStyle(isliked ? "fas" : "far")
         //  likeIconStyle = isliked ? "fas" : "far";
         //  setLoading(false)

      }
      setLikeIconStyle(isliked ? "fas" : "far")
      setLoading(false)

  }, [])

  const checkname = async()=>{
   if (userDetail.user.username === props.author.username){
      setPlink(`/my-profile/`);

   }else{
      setPlink(`/other-profile/`+ props.author.username);

   }
 
}
  const likeHandler =(e)=>{
   //   e.preventDefault();
  
   SendLike()
     
  }
  const togglecomments =(e)=>{
   e.preventDefault();
   
}

const SendLike =async(e)=>{
   if(likesend){
      return
   }
   else{
      setLikeSend(true)
      let  likeCount = document.querySelector("#likecount"+props.id)
      let likevalue= likeCount.textContent
      console.log("likecount and value:::", likeCount, likevalue)
   
      if(actiontype==="like"){
         setLikeIconStyle("far")
         if(likevalue===""){
            // alert("empty string")
            likevalue= 0
         }
         if(likevalue ===0){
            console.log("")
         }else{
            
            likevalue =parseInt(likevalue) - 1
         }
         if(likevalue===0){
            likevalue=null
         }
         likeCount.textContent = likevalue

   
       }else if(actiontype==="unlike"){
         setLikeIconStyle("fas")
        
         if(likevalue===""){
            // alert("empty string")
            likevalue= 0
         }
         likevalue =parseInt(likevalue) + 1
         likeCount.textContent= likevalue
   
      }else{
         alert("unknown actiontype:::",actiontype)
      }
      let like_data  = {"post_id":props.id}
      const token = await getToken();
      const result = await axiosHandler({
         method:"post",
         url: LIKE_URL, 
         token,
         data: like_data
        
       }).catch((e) => {
          console.log("SendLike error::::", e);
       });
     
       if(result){
              console.log("SendLike results::::", result.data)
              let res= result.data
              if(res.data ==="success-added"){
               setLikeIconStyle("fas")
               setActiontype("like")
   
              }else if(res.data==="success-removed"){
               setLikeIconStyle("far")
               setActiontype("unlike")
            }else{
                 alert(res.data)
              }
            //   alert("success")
              
   
       }
   }
   setLikeSend(false)

}


if (loading){
   return(<>
      <Comment/>
         <div className="post-info">
         <div className="likes">
                  <a onClick={(e)=>e.preventDefault()}>
                 
                     <div className="icon"><i className="far fa-heart"></i></div>
                     {/* <div id={"likecount"+props.id} className="count">{like_count}</div> */}
                  </a>
               </div> 
            <div className="comments" id="##">
               <a href="#">
                  <div className="icon"><i className="far fa-comment-alt"></i></div>
               </a>
            </div>
            <div className="share" id="##">
                  <a href="#">
                     <div className="icon"><i className="far fa-save"></i></div>
                  </a>
               </div>
         </div>

         <div className="caption">
           <p><b></b> 
         
           </p>
         </div>
         <div className="post-date">
            
         </div>
         </>
      );
}

       return (<>
         <Comment id={props.id}/>
            <div className="post-info">
               <div className="likes"  onClick={(e)=>likeHandler()}>
                  <a onClick={(e)=>e.preventDefault()}>
                  {loading?(<>
                     <div className="icon"><i className="far fa-heart"></i></div>
                     <div id={"likecount"+props.id} className="count">{like_count}</div>
         </>):(<>
            <div className="icon"><i className={`${likeIconStyle} fa-heart`}></i></div>
                              <div id={"likecount"+props.id} className="count">{like_count}</div>
         </>)}
                           
                  </a>
               </div>           
  
               <div className="comments" id="##">
                  <a href={"#popup1"+props.id} onClick={()=> dispatch({type:postCommentAction, payload:props.id}) }>
                     <div className="icon"><i className="far fa-comment-alt"></i></div>
                     <div className="count">{comment_count}</div>
                  </a>
               </div>
               <div className="share" id="##">
                  <a href="#">
                     <div className="icon"><i className="far fa-save"></i></div>
                  </a>
               </div>
            </div>
  
            <div className="caption">
              <p><b><Link to={plink}>{author} </Link></b> {caption}
              {tags.map((item,key)=>
  
              <span key={item.id}>
                &nbsp;  #{item.title}&nbsp;
              </span>
           )}
              </p>
            </div>
            <div className="post-date">
            {created_at }
            </div>
            </>
         );
    }
 
   

 export default PostInfo;