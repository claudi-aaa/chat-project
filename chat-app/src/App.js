import React from "react";
import { useState, useRef } from "react";
import './App.css';
import { signOut } from "firebase/auth";
import { auth, db } from "./config/firebase";
import { Auth } from "./components/Auth";
import { Chat } from "./components/Chat";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { RoomPass } from "./components/RoomPass";
import { addDoc, collection, query, where, orderBy } from "firebase/firestore";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function App() {

  // check if user is authenticated or not 
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  
  const [room, setRoom] = useState(null);
  const [isPublic, setIsPublic] = useState(true);

  const roomInputRef = useRef(null);
  const roomsRef = collection(db, "rooms")


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

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    
    try {

      // check if room exists if so --- go to, if not add 


      let roomName = roomInputRef.current.value
      console.log(isPublic)

      await addDoc(roomsRef, {
        roomName,
        isPublic,
      });

      setRoom(roomName);


    } catch(err) {
      console.error(err)
    }

  }


  if (!isAuth) {
    return(
      <>
        <Header/>
        <Auth setIsAuth={setIsAuth}/>
        <Footer />
      </>

    )
  }

  return (
    <div className="App">
      <Header />

    {room ? (<Chat room={room}/>
    ) : (
      <form className="room-form">
        <label htmlFor="room-name">Enter Room Name:</label>
        <br/>
        <input type="text" ref={roomInputRef} name="room-name"/>
        <br />
        <label htmlFor="room-type">Select Room Type:</label>
        <br/>
        <select name="room-type">
          <option value={isPublic} onClick={() => setIsPublic(true)}>Public</option>
          <option value={isPublic} onClick={() => setIsPublic(false)}>Private</option>
        </select>
        {/* if this is set to private render this input form */}
        {isPublic ? null : (<RoomPass/>)}
        
        <br/>
        <button type="submit" onClick={(e) => handleRoomSubmit(e)}>Enter Chat</button>
      </form>
      // <form>
      //     <label htmlFor="">Enter Room Name:</label>
      //     <input type="text" ref={roomInputRef}/>
      //     <button onClick={()=> setRoom(roomInputRef.current.value)}>Enter Chat</button>
      // </form>

    )}


      <div className="signout-container">
        {/* <button className="signout-btn">Change Room</button> */}
        <button className="signout-btn">Account Settings</button>
        <button className="signout-btn" onClick={signUserOut}>Signout</button>
        
      </div>
     
     {/* <div className="signout-container">
      <button className="signout-btn" onClick={signUserOut}>Signout</button>
     </div>
     
     <div className="signout-container">
      <button className="signout-btn">Account Settings</button>
     </div> */}

    </div>
  )}

export default App;
