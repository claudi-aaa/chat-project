import React, { useState, useEffect} from "react"
import { auth } from "../config/firebase"
import "../styles/Auth.css";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import Cookies from "universal-cookie";

const cookies = new Cookies()

export const Auth = (props) => {

    const { setIsAuth } = props;

    const [loginError, setLoginError] = useState(null);
    const [regError, setRegError] = useState(null);



    const [authUser, setAuthUser] = useState(null);
    const [viewSignIn, setViewSignIn] = useState(true);
    const [email, setEmail ] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("ANON");


    const viewLogin = (e, status) => {
        if (authUser) {
            console.log('logged in')
        }

        // console.log(`this is status ${status} and status type ${typeof status}`)
        setViewSignIn(status)
        setEmail("@gmail.com")        
    }
    

    const viewLoginError = (errorMsg) => {
        if (errorMsg !== null) {
            // setRegError(null)
            setLoginError("❌ Invalid login, please try again")
        }
    }

    const viewRegError = (errorMsg) => {
        if (errorMsg !== null) {
            // setLoginError(null)
            setRegError("❌ Invalid registration, please try again")
        }
    }


    




    const handleSubmit = async(e, submittype) => {
        e.preventDefault()
        if (submittype === "login") {
            try {
                const result = await signInWithEmailAndPassword(auth, email, password)
                cookies.set("auth-token", result.user.refreshToken)
                setIsAuth(true);
            } catch(err) {
                console.error(err)
                viewLoginError(err)
            }
    
        } else {
            try {
                const result = await createUserWithEmailAndPassword(auth, email, password)
                updateProfile(auth.currentUser, {
                    displayName: nickname
                })
                cookies.set("auth-token", result.user.refreshToken)
            } catch(err) {
                console.error(err)
                viewRegError(err)
            }
        }
    }


    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user)
                setViewSignIn(false)
                setIsAuth(true)
            } else {
                setAuthUser(null)
            }
        })

        return () => {
            listen()
        }
          
    }, [])



  return (
    <div className="auth-container">
        <div className="auth-form-box">
            <form className="auth-form">
            <h2 className="auth-header">{viewSignIn ? 'Please log in' : 'Please register'}</h2>
            {viewLoginError ? (
                <>
                <p className="auth-error">{loginError}</p>
                </>
            ) : null}

            {viewRegError ? (
                <>
                <p className="auth-error">{regError}</p>
                </>
            ) : null}

            <div className="auth-options">
                <button className={viewSignIn ? null : 'active'  } onClick={(e) => viewLogin(e, false)}>Register</button>
                <button className={viewSignIn ? 'active': null } onClick={(e) => viewLogin(e, true)}>Login</button>
            </div>
            
            {viewSignIn ? null : (
                <>
                    <label htmlFor="nickname">Nickname:</label>
                    <br/>
                    <input
                        type="text"
                        name="nickname"
                        placeholder="Nick"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        >
                    </input>
                </>
            )}
                <label htmlFor="email">Email:</label>
                <br/>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="yourname@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}></input>
                <br/>
                <label htmlFor="password">Password:</label>
                <br/>
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}></input>
                <br/>
                <button 
                    type="submit" 
                    className="login-btn"
                    onClick={(e) => handleSubmit(e, viewSignIn ? 'login' : 'signup')}>
                    Submit
                </button>
            </form>

        </div>

    </div>
  )
}

