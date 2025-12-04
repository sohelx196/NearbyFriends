import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { doc, getDoc , updateDoc , serverTimestamp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";


export let currentUser = null;
export let currentProfile = null;


export function initAuth({requireLogin = false} = {}){

    return new Promise((resolve , reject)=>{
        onAuthStateChanged(auth ,  async (user)=>{
    
            if(user){
                currentUser  = user;
                
                // fetch profile data from firestore..
                let docRef = doc(db , "users" , user.uid);
                try{
                   let userDataStatus = await getDoc(docRef);
                   
                   if(userDataStatus.exists()){
                      currentProfile = userDataStatus.data();
                   }
                   else{
                     currentProfile = null;
                   }
                   // here we returning data as a object
                   resolve({user : currentUser , profile : currentProfile});                   
                }
                catch(error){
                    alert("Error while fetching user profile..");
                    resolve({user : currentUser , profile : null});
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
                currentUser = null; 
                currentProfile  = null;

                if(requireLogin){
                      alert("Please log in first.");
                      window.location.href = "../login.html";
                }

                resolve({user : null , profile : null})
            }
        })
    })  
}