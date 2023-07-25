import React from "react";
import { useState, useRef } from "react";
import './App.css';
import { signOut } from "firebase/auth";
import { auth, db } from "./config/firebase";
import { Auth } from "./components/Auth";
import { Chat } from "./components/Chat";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
// import { RoomPass } from "./components/RoomPass";
import { addDoc, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function App() {

  // check if user is authenticated or not 
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  
  const [room, setRoom] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [roomPass, setRoomPass] = useState(null);

  const roomInputRef = useRef(null);
  const roomPassRef = useRef(null);
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

        let roomPass = roomPassRef.current.value
        let roomData = collection(db, "rooms")
        let q = query(roomData, where("roomName", "==", roomName))
  
        let querySnapshot = await getDocs(q);
  
        if (querySnapshot.length !== null && querySnapshot.length !== undefined) {
          querySnapshot.forEach((doc) => {
            let currentDoc = doc.data()
            
            // check if password matches that found in db, only let in if correct
            if (currentDoc.roomPass == roomPass) {
              console.log('correct password - joining the room now')
              setRoom(roomName);
              return

            } else {
              console.log('unsuccessful room join - please try again')
              setRoom(null)
              setRoomPass(null)
              return
            }
          });

        } else {

          // this private room does not exist - make it exist by adding it 
          console.log(`this is the room name: ${roomName}`)

          await addDoc(roomsRef, {
            roomName,
            isPublic,
            roomPass
          })

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
        {isPublic ? null : (
            <div className="room-form-pass">
              <label htmlFor="roomPass">Room Password:</label>
              <br/>
              <input name="roomPass" type="text" placeholder="password" onChange={setRoomPass} ref={roomPassRef}></input>
          </div>
        )}
        
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

        {room ? (<button className="signout-btn" onClick={() => leaveRoom()}>Leave Room</button>)
          : (null)
        }
        
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
