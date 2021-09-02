import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import "./postcreate.css"
import { POST_URL} from '../../urls';
import { store } from "../../stateManagement/store";
import { axiosHandler, getToken } from "../../helper";
import { postTriggerAction } from "../../stateManagement/actions";

 const PostCreate =(props) =>{
    const [postData, setPostData] = useState({})
    const {state:{userDetail}, dispatch} = useContext(store)
    const {state:{postTrigger}} = useContext(store)
    const [loading, setLoading] = useState(false)

    useEffect(() =>{
    
     return () => {
          };
     }, [])
   

     const submit = async (e) => {
       setLoading(true)
        e.preventDefault();
        let image = document.querySelector("#upload-image")
        let images = image.files
          // let imageu = []

        // for (let i = 0; i < images.length; i++) {
        //     let file = images.item(i);
        //     imageu= [...imageu, file]
        // }
        const formData = new FormData();
       
        console.log("caption:::", postData.post)
        console.log("author_id:::", userDetail.user.id)
        console.log("image:::", image, images)
        formData.append("author_id", userDetail.user.id);
        formData.append("caption", postData.post);
        
        for (let i = 0; i < images.length; i++) {
            formData.append("image", images[i]);

        }
        // formData.append("image", images[0]);
        
        const token = await getToken();
        console.log("postcreate data:::", formData)
        // console.log("idcheck", userDetail.user.id)
        const url = POST_URL
        console.log("url::::", url)
        const method = "post";
        console.log("method:::::",method)
        const profile = await axiosHandler({
          method,
          url,
          data: formData,
          token,
          headers: { "Content-Type": "multipart/form-data" },
        }).catch((e) => {
          console.log("res:::", e)
          alert(e)
          setLoading(false)
        });
        if (profile) {
            console.log("create post data:::",profile.data)
            setLoading(false)
          alert("created successfully!")
          dispatch({type:postTriggerAction, payload:props.id})
          window.location.href = "/my-profile";
        }
      };

      const onChange = (e) => {
        setPostData({
          ...postData,
          [e.target.name]: e.target.value,
        });
      };
        
         return (
            <div class="widget-post" aria-labelledby="post-header-title">
  <div class="widget-post__header">
    <h2 class="widget-post__title" id="post-header-title">
       <i class="fa fa-pencil" aria-hidden="true"></i>
      write post
    </h2>
  </div>
  <form id="widget-form" class="widget-post__form" name="form" aria-label="post widget" onSubmit={submit} >
    <div class="widget-post__content">
      <label for="post-content" class="sr-only">share your moments</label>
      <textarea name="post" id="post-content" class="widget-post__textarea scroller" placeholder="share your moments"
      value={postData.post}
      onChange={onChange}
      required = {true}
      ></textarea>
    </div>
  
    <div class="widget-post__actions post--actions">
      <div class="post-actions__attachments">
        
        <button type="button" class="btn post-actions__upload attachments--btn">
          <label for="upload-image" class="post-actions__label">
             <i class="fa fa-upload" aria-hidden="true"></i> 
            upload image
          </label>
        </button>
        <input type="file" id="upload-image" accept="image/*" multiple
        required = {true}
        />
      </div>
      <div class="post-actions__widget">
        <button type="submit" class="btn post-actions__publish">
          {loading? "uploading...": "upload"}
          </button>
      </div>
    </div>
  </form>
</div>
        )
 }



export default PostCreate;
