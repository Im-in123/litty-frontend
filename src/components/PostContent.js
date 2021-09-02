import React, {useEffect, useLayoutEffect} from "react";
import "./carousel.css";

const PostContent = (props)=> {
    console.log("Post Content props:::",props)
    var slideIndex = 1;


     useEffect(() =>{
       try {
        showSlides(slideIndex);

       } catch (error) {
         console.log("showslides error:::", error)
       }
     }, [])
   
    
    function plusSlides(n) {
      showSlides(slideIndex += n);
    }
    
    function currentSlide(n) {
      showSlides(slideIndex = n);
    }
    
    function showSlides(n) {

      var i;
      // var slides = document.getElementsByClassName("mySlides");
      // var dots = document.getElementsByClassName("dot");
      var slides = document.getElementsByClassName("mySlidesget"+props.id);
      var dots = document.getElementsByClassName("dotget"+props.id);
      if (n > slides.length) {slideIndex = 1} 
      if (n < 1) {slideIndex = slides.length}
      for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none"; 
      }
      for (i = 0; i < dots.length; i++) {
          dots[i].className = dots[i].className.replace(" active", "");
      }
      slides[slideIndex-1].style.display = "block"; 
      dots[slideIndex-1].className += " active";
    }

    if(props.image){
       let showcount =false
       let count = props.image.length
       if(count > 1){
          showcount = true
       }
      
       return (
          <div className="post-content">
<div class="slideshow-container">
  {props.image.map((item,key)=>
 <div class={`fade mySlides mySlidesget${props.id}`}>
 <div class="numbertext">{showcount && <>{key+1} / {showcount && count}</>}</div>
 <img src={item.image} alt="" className="iimm" style={{width:"100%"}}/>
 {/* <div class="text">Görsel Başlığı 1</div> */}
  <div class="text">
  {showcount && <>Görsel Başlığı</>}
  </div>

</div>
             )}
 
 {showcount && 
<>
  <a class="prev" onClick={(e)=>plusSlides(-1)}>❮</a>
  <a class="next"onClick={(e)=>plusSlides(1)}>❯</a>
 </>}
</div>
<br/>


{showcount && 
  <div style={{textAlign:"center"}}>
  {props.image.map((item,key)=>
  <span class={`dot dotget${props.id}`} onClick={(e)=>currentSlide(item.id)}></span> 

             )}
</div>}

</div>
        
       );
    }
   };
  
 
 export default PostContent;