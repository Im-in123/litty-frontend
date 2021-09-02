

import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import "./search.css"
import { POST_URL} from '../../urls';
import { store } from "../../stateManagement/store";
import { axiosHandler, getToken } from "../../helper";

 const Search =(props) =>{
    const [postData, setPostData] = useState({})
    const {state:{userDetail}, dispatch} = useContext(store)

    useEffect(() =>{
    
     return () => {
          };
     }, [])

     return(
    
        <main>
        <div class="container">
           <div class="search-box">
              <input type="text" class="search-input" placeholder="Search.."/>
        
              <button class="search-button">
                <i class="fas fa-search"></i>
              </button>
           </div>
        </div>
        </main>
    
     )
 }
 export default Search
   
