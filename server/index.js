import { initAuth  } from "./authManager.js";


document.addEventListener("DOMContentLoaded" , async ()=>{

    let userLoggedStatus = document.querySelector("#userLoggedStatus");
    
    let { profile} = await initAuth({ requireLogin: true });    // destructured as needed


    // showing welcome user..
    if(profile){
        userLoggedStatus.textContent = `Welcome Back : ${profile.name || "Guest"}`
    }
    else{
        userLoggedStatus.textContent = "Please Complete you profile!"
    }
})



