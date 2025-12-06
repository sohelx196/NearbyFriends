import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { auth , db} from "./firebase.js";
import { doc,  setDoc , getDoc , updateDoc , serverTimestamp} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";


const nameInput = document.querySelector("#nameInput");
const ageInput = document.querySelector("#ageInput");
const aboutInput = document.querySelector("#aboutInput");

const saveBtn = document.querySelector("#saveProfileBtn");
const loadingProfile = document.querySelector("#loadingProfile");
const content = document.querySelector("#content");
 


// check for user is logged in or not..
let currentUser = null;

 onAuthStateChanged(auth , async (user)=>{
        if(user){
           currentUser = user;
           loadingProfile.style.display = "none";
           content.classList.add("show");

           // reading user for showing to the form..  
              let docRef = doc(db  , "users" , currentUser.uid);
              let userDataStatus = await  getDoc(docRef);

              if(userDataStatus.exists()){
                   const data = userDataStatus.data();
                   
                   // setting data into input fields
                   nameInput.value = data.name || "";
                   ageInput.value  = data.age || "";
                   aboutInput.value = data.about || "";
              }
             
             // mark user as online...
             await updateDoc(docRef , {
              online  : true,
              lastActive : serverTimestamp(),
             });  

             // mark user offline...
             window.addEventListener("beforeunload" , async ()=>{
              await updateDoc(docRef , {
                online : false,
                lastActive : serverTimestamp(),
              })
             })

        }
        else{
            alert("Login First..")
            window.location.replace("../login.html")
        }
 });


 // Saving data after submit...
saveBtn.addEventListener("click" , async ()=>{

  if(!currentUser){
    alert("user not found");
    return;
  };

    const name = nameInput.value.trim();
    const age = ageInput.value.trim();
    const about = aboutInput.value.trim();

  // before we submit, we need to take the users location..so we did below

  let location = null;
  try{
    const position =  await new Promise((resolve , reject) =>{
      navigator.geolocation.getCurrentPosition(resolve , reject);
    });
    
    // updating lat and lon into location
    location = {
      lat : position.coords.latitude,
      lon : position.coords.longitude,
    }
  }
  catch(error){
    console.warn("Location access denied or unavailable");    
  }



    let profileData = {
        name : name,
        age : Number(age),
        about : about,  
        email : currentUser.email,
        online: true,
        lastActive: new Date(),
    }
    // this checks if the location exists (not undefined or null) then add into users document otherwise dont add..
    if (location) {
       profileData.location = location;
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