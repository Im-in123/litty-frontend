

import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import "./notification.css"
import { POST_URL} from '../../urls';
import { store } from "../../stateManagement/store";
import { axiosHandler, getToken } from "../../helper";

 const Notitfication =(props) =>{
    const [postData, setPostData] = useState({})
    const {state:{userDetail}, dispatch} = useContext(store)

    useEffect(() =>{
    
     return () => {
          };
     }, [])

     return(
    
        <main>
        <div class="containerNotification">
           <h3>Notifications</h3>
        </div>
        </main>
    
     )
 }
 export default Notitfication;
   
