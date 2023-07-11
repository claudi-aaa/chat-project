import React, {useState, useEffect} from 'react'
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import "../styles/Chat.css";


export const Chat = (props) => {

    const { room } = props;
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesRef = collection(db, "messages");


    useEffect(() => {
        const queryMessages = query(
            messagesRef,
            where("room", "==", room),
            orderBy("createdAt"))

        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({...doc.data(), id: doc.id})
            });
            console.log(messages);
            setMessages(messages);
        })

        return () => unsubscribe();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage === "") return;

        try {
            await addDoc(messagesRef, {
                text: newMessage,
                createdAt: serverTimestamp(),
                user: auth.currentUser.displayName,
                room: room,
            });

            setNewMessage("");

        } catch(err) {
            console.error(err)
        }
    }



    return (
        <div className="room-container">
            <div className="room-title">
                <h1>ROOM: {room.toUpperCase()}</h1>
            </div>

            <div className="message-container">
                {messages.map((message) => (
                    <div key={message.id}>
                        <span className="from-user">{message.user}: {message.text}</span>
                    </div>
                ))}
            </div>


            <form className="send-message-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="type your message here"
                    className="new-message-input"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage} />
                <button className="send-msg-btn" type="submit">Send</button>
            </form>

            <p>You are signed in as {auth.currentUser.displayName}</p>
        </div>

    )
}

