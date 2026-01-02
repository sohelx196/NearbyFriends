
import  {rtdb , db} from "../../server/firebase.js";
import { initAuth } from "../../server/authManager.js";
import { ref, push, onChildAdded  } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
import { setDoc, doc ,getDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { sendChatRequest } from "./requests.js";


const {user,  profile} = await initAuth({requireLogin : true});

async function initChat() {
    
  const param = new URLSearchParams(window.location.search);
  const roomId = param.get("room");

  if(!roomId){
    alert("No chat room specified!");
    return;
  }



  document.getElementById("header").innerText = `Chatting With ${recieverName}`;
  
  listenMessages(roomId , user);
  setupSendMessage(roomId ,user);

}

function listenMessages(roomId , user){

  const msgRef = ref(rtdb , `chats/${roomId}/messages`);

    onChildAdded(msgRef , (snapshot)=>{
        const msg = snapshot.val();
        renderMessages(msg , user);
    })
}

// extracting recieverId from the currentUrl...
const param  = new URLSearchParams(window.location.search);
const roomId = param.get("room");

const ids = roomId.split("_");  // gives array of two strings...
const receiverId = ids[0] === user.uid ? ids[1] : ids[0];

// getting reciever name...
const docSnap = await getDoc(doc(db , "users" , receiverId));
const recieverName = docSnap.data().name;

 function setupSendMessage(roomId , user){

  const sendBtn = document.getElementById("sendBtn");
  const input = document.getElementById("messageInput");

  sendBtn.addEventListener("click" ,async ()=>{
    const text = input.value.trim();
    if(!text) return;

    const msgRef = ref(rtdb , `chats/${roomId}/messages`);
    await push(msgRef , {
        sender : user.uid,
        text,
        timestamp : Date.now(),
    });

    // recentChats for both user...
     const senderRef = doc(db , "users" , user.uid , "recentChats" , receiverId);
     
     const recieverRef = doc(db , "users" , receiverId , "recentChats" , user.uid);
  
     await setDoc(senderRef , {
      partnerId : receiverId,
      partnerName : recieverName,
      lastMessage :  text,
      lastTimestamp : Date.now()
     })

     await setDoc(recieverRef , {
      partnerId: user.uid,
      partnerName: profile.name || "Unknown",
      lastMessage: text,
      lastTimestamp: Date.now(),
     })


    input.value = "";
  })
}


function renderMessages(msg , user){
  const messagesDiv = document.querySelector("#messages");
  const div = document.createElement("div");
  
  div.className = msg.sender === user.uid ? "chat chat-end" : "chat chat-start"; 
  div.innerHTML = `<div class="chat-bubble">${msg.text}</div>`;
  messagesDiv.appendChild(div);

  // stick user to the latest msg..
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

initChat();