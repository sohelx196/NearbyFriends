import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { doc, getDoc , updateDoc , serverTimestamp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { auth, db ,rtdb } from "./firebase.js";
import { ref, onDisconnect, set , onValue } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

export let currentUser = null;
export let currentProfile = null;


export function initAuth({requireLogin = false} = {}){

    return new Promise((resolve , reject)=>{
        onAuthStateChanged(auth ,  async (user)=>{
    
            if(user){
                currentUser  = user;
                
                // fetch profile data from firestore..
                let userStatusRef = ref(rtdb , "/status/" + user.uid);
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
           await set(userStatusRef , {online : true});            

             await updateDoc(docRef , {
              online  : true,
              lastActive : serverTimestamp(),
             });  

             // mark user offline...
            onDisconnect(userStatusRef).set({online: false});
            
            // sync the rtdb with firestore...   
            onValue(userStatusRef , async (snapshot)=>{
               let isOnline  = snapshot.val()?.online ?? false;
               await updateDoc(docRef , {online : isOnline});
            })


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