import React from "react";
import { useState, useRef } from "react";
import './App.css';
import { signOut } from "firebase/auth";
import { auth, db } from "./config/firebase";
import { Auth } from "./components/Auth";
import { Chat } from "./components/Chat";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function App() {

  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  
  const [room, setRoom] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [roomPass, setRoomPass] = useState(null);

  const roomInputRef = useRef(null);
  const roomPassRef = useRef(null);


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

  const leaveRoom = () => {
    setRoom(null);
    setRoomPass(null);
    setIsPublic(true);
  }

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    
    try {

      let roomName = roomInputRef.current.value
      if (isPublic === false) {

        const docRef = doc(db, "rooms", roomName)
        const docSnap = await getDoc(docRef)

        // take user to room only if private room exists and password is correct
        if(docSnap.exists()) {
          if(roomPass === docSnap.data().roomPass) {
            setRoom(roomName);
          } else {
            setRoom(null);
            setRoomPass(null);
          }

        // for private rooms that don't exist make new document
        } else {
          await setDoc(doc(db, "rooms", roomName), {
            isPublic: false,
            roomPass: roomPass
          });
          setRoom(roomName);
        }

      } else {
        //  for public rooms, do not need to save to system 
        setRoom(roomName);
      }
      
    } catch(err) {
      console.error(err)
    }

  }

// if user is not signed in display login/registration else show room form 
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

    {/* room form */}
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
        {isPublic ? null : (
            <div className="room-form-pass">
              <label htmlFor="roomPass">Room Password:</label>
              <br/>
              <input name="roomPass" type="text" placeholder="password" onChange={(e) => setRoomPass(e.target.value)} ref={roomPassRef}></input>
          </div>
        )}
        
        <br/>
        <button type="submit" onClick={(e) => handleRoomSubmit(e)}>Enter Chat</button>
      </form>

    )}

      
      <div className="signout-container">

        {room ? (<button className="signout-btn" onClick={() => leaveRoom()}>Leave Room</button>)
          : (null)
        }
        
        <button className="signout-btn" onClick={signUserOut}>Signout</button>
        
      </div>

    </div>
  )}

export default App;
