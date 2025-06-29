// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
// We are importing directly from the CDN URLs for browser modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  update,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js"; // Corrected import for database functions
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDK0BdPNJIYF5v_ar_pQNsZ_gRHJpUZWfc",
  authDomain: "clothingco-database.firebaseapp.com",
  databaseURL:
    "https://clothingco-database-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "clothingco-database",
  storageBucket: "clothingco-database.firebasestorage.app",
  messagingSenderId: "437133311430",
  appId: "1:437133311430:web:21afdc50ee24eddb1646c7",
  measurementId: "G-SGGWD7SM9R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Pass the initialized app to getDatabase
const auth = getAuth(app); // Pass the initialized app to getAuth

let username_login = document.getElementById("username_input_login");
let password_login = document.getElementById("password_input_login");
let login_btn = document.getElementById("login_btn");

// Đăng nhập 1 tải khoản có sẵn
login_btn.addEventListener("click", function () {
  let username = username_input_login.value;
  let password = password_input_login.value;

  signInWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem("UID", user.uid);
      let date = new Date();
      update(ref(database, "user/" + user.uid), {
        lastLogin: date,
      });
      localStorage.setItem("name", username);
      alert("Đăng nhập thành công");
      window.location.href = "./index.html"; // Redirect to index page after successful login
    })
    .catch((err) => {
      const errorCode = err.code;
      const errorMess = err.message;

      alert(errorMess);
    });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in.
    console.log("User ID:", user.uid);
    // In handleLogout()
    localStorage.removeItem("name");
    localStorage.removeItem("userUID");

    // You can fetch user-specific data, e.g., cart, using user.uid
  } else {
    // User is signed out.
  }
});

localStorage.setItem("name", username);
