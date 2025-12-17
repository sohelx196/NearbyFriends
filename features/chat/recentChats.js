import { db } from "../../server/firebase.js";
import { initAuth } from "../../server/authManager.js";
import { collection, onSnapshot, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { makeroomId } from "./requests.js";

const list = document.getElementById("recentList");

const { user } = await initAuth({ requireLogin: true });

const q = query(collection(db  , "users" , user.uid , "recentChats"), orderBy("lastTimestamp" , "desc"));



onSnapshot(q , (snapshot)=>{
    list.innerHTML = "";
    snapshot.forEach((snapDoc) => {
        const chat =  snapDoc.data();
       

        const li = document.createElement("li");

        li.innerHTML = `<strong>${chat.partnerName}</strong> <br>
      <small>${chat.lastMessage}</small><br>
      <button class="openBtn">Open Chat</button>
      <button class="deleteBtn">Delete</button>`;

       li.querySelector(".openBtn").addEventListener("click" , ()=>{
        window.location.href = `/features/chat/chat.html?room=${makeroomId(user.uid, chat.partnerId)}`
       })

       li.querySelector(".deleteBtn").addEventListener("click" , async ()=>{
         await deleteDoc(doc(db, "users", user.uid, "recentChats", chat.partnerId));
       })


      list.appendChild(li);
    });
});  