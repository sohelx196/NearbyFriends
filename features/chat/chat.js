
import  {rtdb} from "../../server/firebase.js";
import { initAuth } from "../../server/authManager.js";
import { ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

async function initChat() {
    
  const param = new URLSearchParams(window.location.search);
  const roomId = param.get("room");

  if(!roomId){
    alert("No chat room specified!");
    return;
  }

  const {user,  profile} = await initAuth({requireLogin : true});
  document.getElementById("header").innerText = `Chatting as ${profile.name}`;
  
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
    })

    input.value = "";
  })
}


function renderMessages(msg , user){
  const messagesDiv = document.getElementById("messages");
  const div = document.createElement("div");
  
  div.className = msg.sender === user.uid ? "msg self" : "msg other"; 
  div.textContent = msg.text;
  messagesDiv.appendChild(div);

  // stick user to the latest msg..
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

initChat();