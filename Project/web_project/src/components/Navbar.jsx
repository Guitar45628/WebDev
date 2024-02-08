import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import firebaseapp from '../firebase';

const auth = getAuth(firebaseapp);

const themes = [
    "light",
    "dark",
    // "cupcake",
    "bumblebee",
    // "emerald",
    // "corporate",
    // "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    // "halloween",
    // "garden",
    // "forest",
    // "aqua",
    "lofi",
    // "pastel",
    // "fantasy",
    // "wireframe",
    // "black",
    "luxury",
    // "dracula",
    "cmyk",
    // "autumn",
    // "business",
    // "acid",
    "lemonade",
    "night",
    // "coffee",
    // "winter",
    // "dim",
    // "nord",
    // "sunset"
];

function Navbar() {
    const navigate = useNavigate();
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
    );

    // update state on toggle
    const handleToggle = (e) => {
        if (e.target.checked) {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    const handleLogout = async () => {
        try {
            // Log the user out using Firebase Authentication
            await signOut(auth);

            // Clear user data from localStorage
            localStorage.removeItem('user');

            // Redirect to the login page after successful logout
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    };

    // set theme state in localstorage on mount & also update localstorage on state change
    useEffect(() => {
        localStorage.setItem("theme", theme);
        const localTheme = localStorage.getItem("theme");
        // add custom data-theme attribute to html tag required to update theme using DaisyUI
        document.querySelector("html").setAttribute("data-theme", localTheme);
    }, [theme]);

    // Save theme from radio button
    const handleThemeChange = (selectedTheme) => {
        setTheme(selectedTheme);
        setIsModalOpen(false);
        localStorage.setItem("theme", selectedTheme);
    };

    return (
        <div className="navbar bg-base-100 bg-blend-normal rounded-lg">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a>Homepage</a></li>
                        <li><a>Portfolio</a></li>
                        <li><a>About</a></li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center">
                <a className="btn btn-ghost text-xl"><b>WU-ThermalComfort</b></a>
            </div>
            <div className="navbar-end">
                <button>
                    <label className="swap swap-rotate btn btn-ghost btn-circle">
                        <input type="checkbox" onChange={handleToggle}
                            checked={theme === "light" ? false : true} />
                        {/* sun icon */}
                        <svg id="light" className="swap-on fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>
                        {/* moon icon */}
                        <svg id="dark" className="swap-off fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>

                    </label>
                </button>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img alt="Porfile Pic" src="../../src/assets/book.png" />
                        </div>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                            <a className="justify-between" href='/profile'>
                                Profile
                                {/* <span className="badge">New</span> */}
                            </a>
                        </li>
                        <li><a onClick={() => document.getElementById('setting_modal').showModal()}>Settings</a></li>
                        <li><a onClick={handleLogout}>Logout</a></li>
                    </ul>
                </div>
            </div>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="setting_modal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">การตั้งค่า</h3>
                    <div className="divider"></div>
                    <p><b>Theme</b></p>
                    <div className="dropdown mb-72">
                        <div tabIndex={0} role="button" className="btn m-1">
                            Theme
                            <svg width="12px" height="12px" className="h-2 w-12 fill-current opacity-60 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path></svg>
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52">
                            {themes.map((theme) => (
                                <li key={theme}>
                                    <input
                                        type="radio"
                                        name="theme-dropdown"
                                        className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                        aria-label={theme}
                                        value={theme}
                                        onChange={() => handleThemeChange(theme)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </dialog>
        </div>
    )
}

export default Navbar


