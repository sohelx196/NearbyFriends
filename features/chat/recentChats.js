import { db } from "../../server/firebase.js";
import { initAuth } from "../../server/authManager.js";
import { collection, onSnapshot, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { makeroomId } from "./requests.js";


const { user } = await initAuth({ requireLogin: true });

const q = query(collection(db  , "users" , user.uid , "recentChats"), orderBy("lastTimestamp" , "desc"));


const list = document.getElementById("recentList");
const template = document.querySelector(".chat-card-template");

onSnapshot(q , (snapshot)=>{
    list.innerHTML = "";
    snapshot.forEach((snapDoc) => {
      
      const chat =  snapDoc.data();
      const clone = template.content.cloneNode(true);
      
        
     clone.querySelector(".chatName").textContent = chat.partnerName;
     clone.querySelector(".chatMessage").textContent = `Last Message : ${chat.lastMessage}`;

     const li = document.createElement("li");

   // old list way to render recent chats...
    //  li.innerHTML = `<strong>${chat.partnerName}</strong> <br>
    //   <small>${chat.lastMessage}</small><br>
    //   <button class="openBtn">Open Chat</button>
    //   <button class="deleteBtn">Delete</button>`;


       clone.querySelector(".openBtn").addEventListener("click" , ()=>{
        window.location.href = `/features/chat/chat.html?room=${makeroomId(user.uid, chat.partnerId)}`
       })

       clone.querySelector(".deleteBtn").addEventListener("click" , async ()=>{
         await deleteDoc(doc(db, "users", user.uid, "recentChats", chat.partnerId));
       })


      list.appendChild(clone);




    });
});   