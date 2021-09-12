

import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import "./search.css"
import { POST_URL, PROFILE_URL, USER_SEARCH_URL} from '../../urls';
import { store } from "../../stateManagement/store";
import { axiosHandler, getToken } from "../../helper";

 const Search =(props) =>{
    const [postData, setPostData] = useState({})
    const {state:{userDetail}, dispatch} = useContext(store)
    const [fetching, setFetching] =useState(true)
    const [search, setSearch] = useState("")
    const [searchb, setSearchb] = useState("")
    const [users, setUsers] = useState("")

    let debouncer;

    useEffect(() =>{
    
     return () => {
          };
     }, [])

   //   useEffect(() =>{
    
   //    clearTimeout(debouncer);
   //    if (search !== ""){
   //     debouncer= setTimeout(() =>{
   //       let extra = `?keyword=${search}`;
   //       getUser(extra)
   //     }, 1700)
   //    }else{
   //    //  let extra1 = `?keyword=00000000000`;
   //    //  getUser(extra1)
   //    }
      
   // }, [search, searchb])

   useEffect(() =>{
    
      clearTimeout(debouncer);
    
       debouncer= setTimeout(() =>{
         let extra = `?keyword=${search}`;
         getUser(extra)
       }, 1700)
      
      
   }, [search, searchb])

     const getUser =  async(extra="")=>{
      setFetching(true)

      const token = await getToken();
      const result = await axiosHandler({
         method:"get",
         url: PROFILE_URL+extra,
         token,
        
       }).catch((e) => {
          console.log("getUser error::::",e.response.data);
       });
     
       if(result){
              console.log("getUser results::::",result.data.results)
              setUsers(result.data.results)
              setFetching(false)

       }
}

const displayUsers =(item)=>{
   if(item.user){
      return(<div>
         <Link to={`/other-profile/`+ item.user.username}>
            <img src={item.user.user_picture} style={{width:"10px", height:"10px"}}/> <p>{item.user.username}</p>

                                  </Link><br/> <hr/></div>
      )
   }
  
}

     return(
    
        <main>
        <div class="containerSearch">
           <div class="search-box">
              <input type="text" 
              class="search-input" 
              placeholder="start typing to search.."
              value={search} 
               onChange={e => 
               setSearch(e.target.value)}
              />
        
              <button class="search-button" onClick={e => setSearchb(e.target.value)}>
                <i class="fas fa-search"></i>
              </button>
           </div>

           <div><br/>
           {users && users.map((item, key)=>{
                        return displayUsers(item)
                        
                 })} 
               {users.length<1 ? "Nothing found": "" }
           </div>

        </div>
        </main>
    
     )
 }
 export default Search
   
