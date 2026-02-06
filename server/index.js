import { initAuth  } from "./authManager.js";
import { listenChatRequest } from "../features/chat/requests.js";

document.addEventListener("DOMContentLoaded" , async ()=>{

    const userLoggedStatus = document.querySelector("#userLoggedStatus");
    
    let {user, profile} = await initAuth({ requireLogin: true });    // destructured as needed
     listenChatRequest(user);

    // showing welcome user..
    if(profile){
        userLoggedStatus.textContent = `${profile.name || "Buddy"}`
    }
    else{
        userLoggedStatus.textContent = "Please Complete your profile!"
    } 
})



