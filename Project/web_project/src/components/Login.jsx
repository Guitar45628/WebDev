// import React, { useState, useEffect } from 'react';

// function Login() {
//   const [backgroundImage, setBackgroundImage] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   useEffect(() => {
//     // Fetch a random nature photo from Unsplash using the Unsplash Source API
//     fetch('https://source.unsplash.com/featured/?nature')
//       .then((response) => {
//         setBackgroundImage(response.url);
//       })
//       .catch((error) => {
//         console.error('Error fetching random nature photo:', error);
//       });
//   }, []);

//   const cardStyle = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     // width: '25rem', // Adjusted card widths
//   };

//   const handleLogin = () => {
//     // Handle login logic with email and password
//     console.log('Logging in with:', email, password);
//   };

//   return (
//     <>
//       <div className="card bg-base-100 shadow-xl" style={cardStyle}>
//         <div className="card-body">
//           <h1 className="card-title"><b>Login</b></h1>
//           <form>
//             <div className="mb-4">
//               <label htmlFor="email" className="text font-medium text-gray-600">Email address</label>
//               <input type="email" className="input input-bordered w-full" id="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="password" className="text font-medium text-gray-600">Password</label>
//               <input type="password" className="input input-bordered w-full" id="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
//             </div>
//             <div className="card-actions justify-center">
//               <button type="button" className="btn btn btn-outline btn-neutral w-full" onClick={handleLogin}>
//                 Login
//               </button>
//             </div>
//           </form>
//           <p className="text-xs text-gray-500 mt-4">
//             *If you don't have an account, please contact the administrator.
//           </p>
//         </div>
//       </div>
//       <div className="webpage-background" style={{ /*backgroundImage: `url(${backgroundImage})`,*/ backgroundSize: 'cover', height: '100vh', backgroundColor: '#EEEEEE' }}>
//         {/* Any other webpage content can be added here */}
//       </div>
//     </>
//   );
// }

// export default Login;


// import React, { useState, useEffect } from 'react';
// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// import Swal from 'sweetalert2';
// import firebaseapp from '../firebase';
// // import md5 from 'crypto-js/md5';

// const auth = getAuth(firebaseapp);

// function Login() {
//   const [backgroundImage, setBackgroundImage] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   useEffect(() => {
//     // Fetch a random nature photo from Unsplash using the Unsplash Source API
//     fetch('https://source.unsplash.com/featured/?nature')
//       .then((response) => {
//         setBackgroundImage(response.url);
//       })
//       .catch((error) => {
//         console.error('Error fetching random nature photo:', error);
//       });
//   }, []);

//   const cardStyle = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     // width: '25rem', // Adjusted card widths
//   };

//   const handleLogin = async () => {
//     try {
//     //   const hashedPassword = md5(password).toString();
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       console.log('Login successful:', user);

//       // Display success message using SweetAlert2
//       Swal.fire({
//         icon: 'success',
//         title: 'Login Successful',
//         text: `Welcome, ${user.email}!`,
//       });
//     } catch (error) {
//       console.error('Login failed:', error.message);

//       // Display error message using SweetAlert2
//       Swal.fire({
//         icon: 'error',
//         title: 'Login Failed',
//         text: error.message,
//       });
//     }
//   };

//   return (
//     <>
//       <div className="card bg-base-100 shadow-xl" style={cardStyle}>
//         <div className="card-body">
//           <h1 className="card-title"><b>Login</b></h1>
//           <form>
//             <div className="mb-4">
//               <label htmlFor="email" className="text font-medium text-gray-600">Email address</label>
//               <input type="email" className="input input-bordered w-full" id="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="password" className="text font-medium text-gray-600">Password</label>
//               <input type="password" className="input input-bordered w-full" id="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
//             </div>
//             <div className="card-actions justify-center">
//               <button type="button" className="btn btn btn-outline btn-neutral w-full" onClick={handleLogin}>
//                 Login
//               </button>
//             </div>
//           </form>
//           <p className="text-xs text-gray-500 mt-4">
//             *If you don't have an account, please contact the administrator.
//           </p>
//         </div>
//       </div>
//       <div className="webpage-background" style={{ /*backgroundImage: `url(${backgroundImage})`,*/ backgroundSize: 'cover', height: '100vh'}}>
//         {/* Any other webpage content can be added here */}
//       </div>
//     </>
//   );
// }

// export default Login;
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import firebaseapp from '../firebase';

const auth = getAuth(firebaseapp);

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
    const [loginError, setLoginError] = useState(false);
    const navigate = useNavigate();

    // Check if the user is already authenticated
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is already authenticated, redirect to Home
                navigate('/home');
            }
        });

        // Cleanup function to unsubscribe from the listener
        return () => unsubscribe();
    }, [navigate]);

    // set theme state in local storage on mount & also update local storage on state change
    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.querySelector("html").setAttribute("data-theme", theme);
    }, [theme]);

    const cardStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    };

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Login successful:', user);

            // Store user information in localStorage
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                // Add any other user details you want to store
            }));

            // Set the theme based on user preferences (if available)
            const storedTheme = localStorage.getItem('theme') || 'light';
            setTheme(storedTheme);

            // Use Navigate to go to Home.jsx after successful login
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error.message);
            setLoginError(true);
        }
    };

    return (
        <>
            <div id='login_page' className="bg-gradient-to-r from-purple-400 to-pink-400" style={{ backgroundSize: 'cover', height: '100vh' }}>
                {/* Any other webpage content can be added here */}
            </div>
            <div className="card lg:card-side bg-base-100 shadow-2xl w-96" style={cardStyle}>
                <div className="card-body">
                    <h1 className="text-center text-3xl"><b>ลงชื่อเข้าใช้</b></h1>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="email" className="text font-medium">อีเมล</label>
                            <input type="email" className="input input-ghost input-bordered w-full" id="email" placeholder="ป้อนอีเมล" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="text font-medium">รหัสผ่าน</label>
                            <input type="password" className="input input-ghost input-bordered w-full" id="password" placeholder="ป้อนรหัสผ่าน" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="card-actions justify-center">
                            <button type="button" className="btn btn btn-outline btn-neutral w-full text-lg" onClick={handleLogin}>
                                เข้าสู่ระบบ
                            </button>
                        </div>
                    </form>
                    {loginError && (
                        <p className="text-xs text-red-500 mt-4">
                            *เข้าสู่ระบบล้มเหลว ตรวจสอบรหัสผ่านอีกครั้ง
                        </p>
                    )}
                    <p className="text-base mt-4">
                        *สามารถเข้าสู่ระบบด้วยบัญชีที่เตรียมไว้ให้เท่านั้น
                    </p>
                </div>
            </div>
        </>
    );
}

export default Login;

