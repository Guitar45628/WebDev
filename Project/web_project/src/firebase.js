// firebase.js

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCQN_M36h2LX1D9n52bEeILhM8vngaV4ok",
  authDomain: "webtest-16e4e.firebaseapp.com",
  databaseURL: "https://webtest-16e4e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "webtest-16e4e",
  storageBucket: "webtest-16e4e.appspot.com",
  messagingSenderId: "925199291102",
  appId: "1:925199291102:web:6b2279eba4002c1cb4684f"
};

const firebaseapp = initializeApp(firebaseConfig);

export default firebaseapp;
