import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import "./chatpage.css"
import { BASE_URL1, BASE_URL2, CHAT_LIST_URL, GET_FOLLOWING_CHAT, OTHER_PROFILE_URL, POST_URL} from '../../urls';
import { store } from "../../stateManagement/store";
import { axiosHandler, getToken } from "../../helper";
import { postTriggerAction } from "../../stateManagement/actions";
import WebSocketInstance from './Websocket';
import { activeChatUserAction } from "../../stateManagement/actions";


const ChatPage =(props)=>{
    const {state:{userDetail}, dispatch} = useContext(store)
    const {state:{activeChatUser}} = useContext(store)
    const [small, setSmall] = useState(false)
    const [empty, setEmpty] = useState(true)


    const [chatList, setChatList] = useState([])

    const [msgObj, setMsgObj] = useState({})
    const [msg, setMsg] = useState([])
    var g=[]
    let dd
    const [fetching, setFetching] = useState(true)
    const [fetching2, setFetching2] = useState(true)

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState(false)
    const [error2, setError2] = useState(false)

    const [activeu, setActiveU] = useState(false)

    useEffect(() =>{
  alert("Chat features has been disabled for the moment. u know, credit card bills. lol")
   return () => {
        };
   }, [])
    useEffect(() =>{
      getOtherProfile(props)


   return () => {
        };
   }, [])

   useEffect(() =>{
   getChatList()


 return () => {
      };
 }, [])

    useEffect(() =>{
      checkSize()
      if(!fetching){
      //  setEmpty(true)
        console.log("active u::", activeChatUser)
        setActiveU(activeChatUser)
        console.log("active uog::", activeu)
        const guessKey= userDetail.user.id + activeChatUser.timeout+"getit"
        console.log("combined timeout:::", guessKey)
        // guessKey = "getit"+guessKey
        // console.log("combined final:::", guessKey)
        
        try {
          WebSocketInstance.hardclose()
          console.log("secondary close")
        } catch (error) {
          console.log(error)
        }
        let ws_scheme = window.location.protocol === "https:" ? "wss://":"ws://"
        const url = ws_scheme + BASE_URL2 +'/ws/chat/'+guessKey+'/';
        console.log("url:::", url)
        setLoading(false)

            WebSocketInstance.connect(url)

        waitForSocketConnection(() =>{
            WebSocketInstance.addCallbacks(
                setMessages,
               addMessage);
            WebSocketInstance.fetchMessages(userDetail.user.username, activeChatUser.username);
            console.log()
        }); 
      }
     

     return () => {
        try {
          WebSocketInstance.hardclose()
          console.log("secondary close leaving")
        } catch (error) {
          console.log(error)
        }
          };
     }, [activeChatUser])
     
    

   const clicker =(e)=>{
    document.getElementsByClassName("friends_list")[0].classList.toggle("active");

   }
   
   function waitForSocketConnection(callback){

    const recursion = waitForSocketConnection;
    setTimeout( 
        function(){
            console.log("websocket:::", WebSocketInstance)

            if (WebSocketInstance.socketRef.readyState === 1){
                console.log("Connection is secure");
                callback();
                return;

            }else{
                //WebSocketInstance.state = 1 //put this here myself, will fix it later
                // console.log(WebSocketInstance.state, 'heeere')
                console.log("Waiting for connection...")
                waitForSocketConnection(callback);

            }
        }, 500);
}
const  getOtherProfile =async(props)=>{
  const othername= props.match.params.username;
        let extra = `?keyword=${othername}`;
  setFetching(true)
const token = await getToken();
const gp = await axiosHandler({
  method:"get",
  url: OTHER_PROFILE_URL + extra,
  token
}).catch((e) => {
 console.log("Error in getOtherProfile in Chat::::",e);
 setError(true)
});

if(gp){
       console.log(" getOtherProfile in Chat res::::", gp.data);
      //  setOtherUser(gp.data)
      const gg= gp.data
      setFetching(false)
      dispatch({type:activeChatUserAction,payload:{username:gg.user.username, img: BASE_URL1+ gg.user.user_picture, timeout:gg.user.id}})

     //  otherUser = gp.data
      try {
       const name = gp.data.user.username
       let extra1 = `?keyword=${name}`;
      } catch (error) {
          setError(true)
      }
     
}
}

const getChatList = async(extra="") =>{
  setFetching2(true)

  const token = await getToken();
  const res = await axiosHandler({
     method:"get",
     url: CHAT_LIST_URL,
     token
   }).catch((e) => {
    console.log("Error in getChatList::::",e);
    setError2(true)
   });

   if(res){
      console.log(" getChatList::::", res.data.results);
      
      setChatList(res.data.results)
      // post = res.data
    
   }
   setFetching2(false)
  //  console.log("PostList:::", myPost)
  //  console.log("post:::", post)

  }

const sendMessageHandler = (e) =>{
    e.preventDefault(); 
    const messageObject = {
        from: userDetail.user.username,
        content: msgObj.message,
        to:"user1"
    }
    console.log("sendMessageHandler:::", messageObject)
    WebSocketInstance.newChatMessage(messageObject);
    setMsgObj({...msgObj, message:""})

}

const msgObjChange =(e)=>{
    setMsgObj({
        ...msgObj,
        [e.target.name]: e.target.value,
      });
}

function setMessages(messages){
    var e = messages.reverse() 
    setMsg(e);
    // console.log("setMessage::", messages)
    if(e.length>0){
        g=e
    }else{
       console.log()
    }

}

function addMessage(message){
    // console.log("addMessage::", message)
    // setMsg([...msg, message]);
    if(g.length>0){
        g = [...g, message]
        
    }else{
        // console.log('in it')
        g=[message]

    }
    setMsg(g);
    
    // console.log("g::", g)

    console.log("AddMessage::", msg)
}

const getChat =(username,img, timeout)=>{
  // setActiveU({username:username, img:img})
  // WebSocketInstance.hardclose()
  dispatch({type:activeChatUserAction,payload:{username:username, img:img, timeout:timeout}})
  

}


const renderUsers = (item) => {

     console.log("render users:::", item)

  if(item.other){
      // console.log("mapping")
      // let img = item.user.user_picture
      // img = BASE_URL1+img

     return (<>
            
        <div className= {item.other.username === activeChatUser.username ? 'friend active fcenter ': 'friend  fcenter'}
        key={item.other.id} onClick={()=>getChat(item.other.username, item.other.user_picture, item.other.id)}>
        <div class="avatarbox">
          <div class="avatar_overlay"><img src={item.other.user_picture}/></div>
        </div>
        <div class="namemsg">
          <p class="b">{item.other.username}</p>
          {/* <p class="msg">is typing...</p> */}
        </div>
        <div class="timeago">
          {/* <p>20 mins ago</p> */}
        </div>
        </div>


  </>)
}
}


const renderMessages  = (item) => {

    // console.log("render messages:::", item)

    if(item){
        // console.log("mapping")
        // setEmpty(false)
    return (<>
      
        <div class="msg">
        <div  key = {item.id}
            className= {item.sender === userDetail.user.username ? 'user friend t': 'user me t'}>
        
          <div class="avatarbox">
            {/* <div class="avatar_overlay"><img src="https://s-media-cache-ak0.pinimg.com/736x/c9/b8/87/c9b8873c63d378702f5b932d6acfa28b.jpg"/></div> */}
          </div>
          <div class="text">
           {item.message}
             <small > { Math.round(  (new Date().getTime() - new Date(item.timestamp).getTime()) / 60000 )} ago</small>
          </div>
        </div>
        </div> 


    </>)
}}


const scrollToBottom = () => {
  setTimeout(() => {
    let chatArea = document.getElementById("scrollto")
    chatArea.scrollTop = chatArea.scrollHeight;
  }, 300)
}

const checkSize = (e) => {
  let currentHideNav = (window.innerWidth <= 1000);
  console.log("width stuff::", currentHideNav)
  if (currentHideNav ===true){
    setSmall(true)
    
  }else{
    setSmall(false)
  }
}
if(loading){
  return (
    <div class="content">
      loading..
    </div>
  )
}
    return(
      
<div class="content">
  <aside>
    <div class="head" onClick={clicker}>
      <div class="avatar">GC</div>
      {/* <div class="name">{userDetail.user.username}</div> */}
      {/* <div class="mail">{userDetail.user.email}</div> */}
      {small ? (
      <div class="name">Click here to toggle chat list</div>

      ):(
        <div class="name"> Chat list</div>

      ) }

    </div>
    <div class="friends_list ok">

    {chatList && chatList.map((item, key)=>{
                        return renderUsers(item)
                        
                 })} 
      {/* <div class="friend active fcenter">
        <div class="avatarbox">
          <div class="avatar_overlay"><img src="https://s-media-cache-ak0.pinimg.com/736x/c9/b8/87/c9b8873c63d378702f5b932d6acfa28b.jpg"/></div>
        </div>
        <div class="namemsg">
          <p class="b">Gato catzera</p>
          <p class="msg">is typing...</p>
        </div>
        <div class="timeago">
          <p>20 mins ago</p>
        </div>
      </div>
      <div class="friend fcenter">
        <div class="avatarbox">
          <div class="avatar_overlay"><img src="https://smilingpaws.files.wordpress.com/2014/01/british-shorthair-cat.jpg"/></div>
        </div>
        <div class="namemsg">
          <p class="b">Crazy catzera</p>
          <p class="msg">Hey dude.</p>
        </div>
        <div class="timeago">
          <p>11 July</p>
        </div>
      </div> */}
      
    </div>
  </aside>
  <div class="midcont">
    <div class="head">
      <div class="avatarbox">
        <div class="avatar_overlay"><img src={activeChatUser.img}/></div>
      </div>
      <h4>{activeChatUser.username}</h4>
      <div class="configschat"><i class="fa fa-phone"></i><i class="fa fa-camera-retro"></i><i class="fa fa-ellipsis-v"></i></div>
    </div>
    <div class="messagescont" id="scrollto"> 
   
    {msg && msg.map((item, key)=>{
                        return renderMessages(item)
                        
                 })} 
     {msg && scrollToBottom()}
     {/* {empty? <small>No messages found</small> :""} */}
     
    </div>
    <span id="hidden-span"></span>
    <div class="bottomchat">
      {/* <div class="text">Write something...</div><i class="fa fa-microphone"></i> */}
            <div><form onSubmit={sendMessageHandler}>
                <input className="inputbutton" type="text"
             required
             name="message"
             onChange={msgObjChange}
             
            value = {msgObj.message}
              placeholder="Press enter to send.."/>
         {/* <button  className="button">Send</button> */}
         <i class="fa fa-microphone"></i>
              </form>
       </div>
        
    </div>
  </div>
</div>
    
    )

}

// const RenderMessages  = (props) => {
//     const {state:{userDetail}} = useContext(store)

//     console.log("render messages:::", props)

//     if(props.data){
//         console.log("mapping")
        
//     return (<>
      
//         <div class="msg">
//         <div className= 'user friend t' >
        
//           <div class="avatarbox">
//             <div class="avatar_overlay"><img src="https://s-media-cache-ak0.pinimg.com/736x/c9/b8/87/c9b8873c63d378702f5b932d6acfa28b.jpg"/></div>
//           </div>
//           <div class="text">
//            {props.data.message}
//              {/* <small > { Math.round(  (new Date().getTime() - new Date(message.timestamp).getTime()) / 60000 )} ago</small> */}
//           </div>
//         </div>
//         </div> 


//     </>)
// }}
export default ChatPage;
        