import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";


export let currentUser = null;
export let currentProfile = null;


export function initAuth({requireLogin = false} = {}){
  
}