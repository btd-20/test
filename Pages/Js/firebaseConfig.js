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

firebase.initializeApp(firebaseConfig);
const firebaseDB = firebase.database();
