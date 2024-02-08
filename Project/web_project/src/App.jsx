import './App.css';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from './components/Footer';
import Flight from './components/Flight';

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  // set theme state in localstorage on mount & also update localstorage on state change
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    // add custom data-theme attribute to html tag required to update theme using DaisyUI
    document.querySelector("html").setAttribute("data-theme", localTheme);
  }, [theme]);

  return (
    <div id='app_page' className="flex flex-col h-screen">
      <BrowserRouter className="flex-grow">
        {/* <Navbar/> */}
        <Routes>
          <Route
            exect
            path="/"
            element={
              <>
                <Navbar/>
                <Home />
                <Footer />
              </>
            }
          ></Route>
          <Route
            exect
            path="/home"
            element={
              <>
                <Navbar/>
                <Home />
                <Footer />
              </>
            }
          ></Route>
          <Route
            exect
            path="/profile"
            element={
              <>
                <Navbar/>
                <Profile />
                <Footer />
              </>
            }
          ></Route>
          <Route
            exect
            path="/login"
            element={
              <>
                <Login/>
              </>
            }
          ></Route>
          <Route
            exect
            path="/flight"
            element={
              <>
                <Flight/>
              </>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
