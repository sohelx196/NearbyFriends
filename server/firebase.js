
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
  import { getDatabase } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

  const firebaseConfig = {
    apiKey: "AIzaSyDMsc08ftkf9cINLLcUjjFfTXrvf7GFV6c",
    authDomain: "nearbyfriends-cfd1a.firebaseapp.com",
    projectId: "nearbyfriends-cfd1a",
    storageBucket: "nearbyfriends-cfd1a.firebasestorage.app",
    messagingSenderId: "579406680264",
    appId: "1:579406680264:web:0d42b188e55ae39c1a55fd",
    measurementId: "G-3WSNBR70JS"
  };


  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const rtdb = getDatabase(app); // realtime databasee