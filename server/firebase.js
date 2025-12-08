import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

  
  const firebaseConfig = {
    apiKey: "AIzaSyA4RJagyni9VpSnRtmxdGgC0yaWfM-k4to",
    authDomain: "nearbyfriends-6fbe2.firebaseapp.com",
    projectId: "nearbyfriends-6fbe2",
    storageBucket: "nearbyfriends-6fbe2.firebasestorage.app",
    messagingSenderId: "807699646600",
    appId: "1:807699646600:web:7b6f162939053bf2a4773d",
    measurementId: "G-BBC5HJ9FJR",
    databaseURL : "https://nearbyfriends-6fbe2-default-rtdb.firebaseio.com/"
  };


  // Initialize Firebase
  // const app = initializeApp(firebaseConfig);
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}



  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const rtdb = getDatabase(app); // realtime databasee

export default app;