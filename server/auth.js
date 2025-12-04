import { auth } from "./firebase.js";

import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword , signOut , 
    onAuthStateChanged,sendPasswordResetEmail
  } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const signUpBtn = document.getElementById("signUpBtn");
let loginBtn = document.querySelector("#login");
let signOutBtn = document.querySelector("#signOutBtn");
const loginSuccessMsg = document.querySelector("#loginSuccessMsg");
// const userLoggedStatus = document.querySelector("#userLoggedStatus");

// handling signup
if(signUpBtn){

    signUpBtn.addEventListener("click" , async (e)=>{
        e.preventDefault();

        let email = document.querySelector("#email").value;
        let password = document.querySelector("#password").value;
        

        try{
                await createUserWithEmailAndPassword(auth , email , password);
                alert("User Registered Successully!!")
                window.location.href = "../features/CompleteProfile.html"
        }

        // code for backup None.
        //      try{
        //         await createUserWithEmailAndPassword(auth , email , password);
        //         // await signOut(auth)
        //         alert("User Registered Successully!!")

        //         onAuthStateChanged(auth,(user)=>{
        //            if(user){
        //                window.location.href = "../features/CompleteProfile.html"
        //            }
        //         })
        // }

        catch(error){
            const signupStatus = document.querySelector("#signupStatus");
            signupStatus.textContent = error.message;
            // console.log("Something Went Wrong!!" , error); 
        }   

    })

}


// Login Handling
if(loginBtn){
    loginBtn.addEventListener("click" , async (e)=>{
        e.preventDefault();

        let email = document.querySelector("#email").value;
        let password = document.querySelector("#password").value;

        try{    
            await signInWithEmailAndPassword(auth , email , password);
            // alert("Login Succcessfullu!");
            // loginSuccessMsg.textContent = "Login Successfully!!"
            setTimeout(() => {                
                window.location.href = "index.html";
            }, 2000);
        }
        catch(error){
            alert("Failed in Login!!" , error);
        }
    })
}


// SignOut User 

if(signOutBtn){ 
    signOutBtn.addEventListener("click", async ()=>{

     try{
         await signOut(auth);
         alert("SignOut Successfully!!");
         window.location.replace('login.html');
     }
     catch(error){
         alert("Failed!!!" , error)
     }

    })
}

    
// On Auth State Change...
const page =  window.location.pathname;
// if(page.includes("index.html")){
//     const user = auth.currentUser;
//       if(!user){
//         window.location.replace("login.html");
//      }
// }


// (we did not use it cause it leads to infinite loop)
// onAuthStateChanged(auth , (user)=>{
//     if(!user){
//         window.location.replace("login.html");   
//     }
// })  


if(page.includes("index.html")){
    onAuthStateChanged(auth , (user)=>{
        if(!user){
            window.location.replace("login.html");
        }
        // else{
        //     if(userLoggedStatus){
        //         userLoggedStatus.textContent = user.email;
        //     }
        // }
        
    })
}

if(page.includes("login.html")){
    onAuthStateChanged(auth , (user)=>{
        if(user){
            window.location.replace("index.html");
        }
    })
}



// reset password 
// document.querySelector("#resetBtn").addEventListener("click" , async ()=>{
//     let email = document.querySelector("#forgotEmail").value;
//     let msg = document.querySelector("#msg");

//     try{
//         await sendPasswordResetEmail(auth , email);
//         msg.textContent = "Check Your Email to reset Password!";
//         msg.style.color = "darkblue";
//     }
//     catch(e){
//         msg.textContent = e.message;
//         msg.style.color  =  "red";
//     }
    
// })