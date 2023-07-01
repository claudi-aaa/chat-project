import React, { useState, useEffect } from "react"
import { auth } from "../config/firebase"
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import Cookies from "universal-cookie";

const cookies = new Cookies()

export const Auth = (props) => {

    const { setIsAuth } = props;

    const [authUser, setAuthUser] = useState(null);
    const [viewSignIn, setViewSignIn] = useState(true);
    const [email, setEmail ] = useState("");
    const [password, setPassword] = useState("");


    const viewLogin = (status) => {
        setViewSignIn(status)
    }

    const handleSubmit = async(e, submittype) => {
        e.preventDefault()
        if (submittype === "login") {
            try {
                const result = await signInWithEmailAndPassword(auth, email, password)
                cookies.set("auth-token", result.user.refreshToken)
            } catch(err) {
                console.error(err)
            }
    
        } else {
            try {
                const result = await createUserWithEmailAndPassword(auth, email, password)
                cookies.set("auth-token", result.user.refreshToken)
            } catch(err) {
                console.error(err)
            }
        }
    }


    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user)
            } else {
                setAuthUser(null)
            }
        })

        return () => {
            listen()
        }
          
    }, [])

    const userSignOut = () => {
        signOut(auth).then(() => {
            cookies.remove("auth-token")
            console.log('user signed out')
        }).catch(err => console.error(err))
    }

  return (
    <div>
        <div className="auth-form-box">
            <h2>{viewSignIn ? 'Please log in' : 'Please register'}</h2>
            <form>
                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="yourname@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}></input>
                <label htmlFor="password">Password:</label>
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}></input>
                <button type="submit" onClick={(e) => handleSubmit(e, viewSignIn ? 'login' : 'signup')}>
                Submit</button>
            </form>
        </div>


      {authUser ? 
        <div>
            <p>{`Signed In as ${authUser.email}`}</p> 
            <button onClick={userSignOut}>Sign Out</button>
        </div> : 
         <div className="auth-options">
            <button onClick = {() => viewLogin(false)}>Register</button>
            <button onClick = {() => viewLogin(true)}>Login</button>
        </div>
        }



    </div>
  )
}
