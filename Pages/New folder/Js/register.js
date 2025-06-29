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

let username_register = document.getElementById("username_input_register");
let password_register = document.getElementById("password_input_register");
let login_btn = document.getElementById("login_btn");
let register_btn = document.getElementById("register_btn");

// Đăng ký 1 tài khoản
register_btn.addEventListener("click", function () {
  let username = username_register.value;
  let password = password_register.value;

  createUserWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      const user = userCredential.user;
      set(ref(database, "user/" + user.uid), {
        username: username,
        password: password,
      });

      alert("Tạo tài khoản thành công");
      window.location.href = "./login.html"; // Redirect to login page after successful registration
    })
    .catch((err) => {
      const errorCode = err.code;
      const errorMess = err.message;

      alert(errorMess);
    });
});
