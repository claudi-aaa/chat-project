import React from "react";
import { useState, useRef } from "react";
import './App.css';
import { signOut } from "firebase/auth";
import { auth } from "./config/firebase";
import { Auth } from "./components/Auth";
import { Chat } from "./components/Chat";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function App() {

  // check if user is authenticated or not 
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  
  const [room, setRoom] = useState(null);
  const roomInputRef = useRef(null);

  const signUserOut = async() => {
    try {
      await signOut(auth)
      cookies.remove("auth-token")
      setIsAuth(false)
      setRoom(null)
    } catch(err) {
      console.error(err)
    }
  }


  if (!isAuth) {
    return(
      <Auth setIsAuth={setIsAuth}/>
    )
    
  }


  return (
    <div className="App">
    
    {room ? (<Chat room={room}/>
    ) : (
      <form>
        <label htmlFor="">Enter Room Name:</label>
        <input type="text" ref={roomInputRef}/>
        <button onClick={()=> setRoom(roomInputRef.current.value)}>Enter Chat</button>
      </form>

    )}
     
     <button onClick={signUserOut}>Signout</button>
    
    </div>
  )}

export default App;
