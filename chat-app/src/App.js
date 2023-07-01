import React from "react";
import { useState, useRef } from "react";
import './App.css';
import { Auth } from "./components/Auth";

import Cookies from "universal-cookie";
const cookies = new Cookies();

function App() {

  // check if user is authenticated or not 
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));

  return (
    <div className="App">
      <Auth setIsAuth={setIsAuth}/>
    </div>
  );
}

export default App;
