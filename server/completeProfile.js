import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { auth , db} from "./firebase.js";
import { doc,  setDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";


const nameInput = document.querySelector("#nameInput");
const ageInput = document.querySelector("#ageInput");
const aboutInput = document.querySelector("#aboutInput");

const saveBtn = document.querySelector("#saveProfileBtn");
 


// check for user is logged in or not..
let currentUser = null;
saveBtn.disabled = true;
onAuthStateChanged(auth , async (user)=>{
    if(!user) return;
    else{
        currentUser = user;
        saveBtn.disabled = false;
    }
});


saveBtn.addEventListener("click" , async ()=>{

  if(!currentUser){
    alert("user not found");
    return;
  };

    const name = nameInput.value.trim();
    const age = ageInput.value.trim();
    const about = aboutInput.value.trim();

    const profileData = {
        name : name,
        age : Number(age),
        about : about,  
        email : currentUser.email,
    }


    try{
         await setDoc(doc(db , "users" , currentUser.uid) , profileData);
         alert("Profile Saved Successfully..")
         window.location.replace("../index.html");
    }
    catch(error){
        alert("Something went wrong while saving profile..!");
    }
});