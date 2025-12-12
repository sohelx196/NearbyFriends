// handle sending and recieving request..

import { rtdb } from "../../server/firebase.js";
import { ref, set, onChildAdded, remove, update , onChildChanged} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";


export async function sendChatRequest(recieverId , recieverName , senderId){
     const reqRef = ref(rtdb , `requests/${recieverId}/${senderId.uid}`);

     await set(reqRef , {
        from : senderId.uid,
        name : senderId.name,
        timestamp : Date.now(),
        status : "pending",
     });

     alert(`Chat request send to ${recieverName}`);
}

export async function listenChatRequest(user){

const userReqRef = ref(rtdb , `requests/${user.uid}`);

onChildAdded(userReqRef , async (snapshot)=>{
   const request = snapshot.val();
   const key = snapshot.key;
   const reqRef = ref(rtdb, `requests/${user.uid}/${key}`);

   if(request.status === "pending"){
      let accept = confirm(`Chat request from ${request.name}. Accept?`);
      if(accept){
         await update(reqRef , {status : "accepted"});
      }
      else{
         clearChatRequest(user.uid , key)
      }    
   }
});

onChildChanged(userReqRef , async (snapshot)=>{
   const request = snapshot.val();
   const key = snapshot.key;

   if(request.status === "accepted"){
      alert(`${request.name} accepted your request`);
      window.location.href = `../chat/chat.html?room=${makeroomId(user.uid , key)}`
   }
   else{
      clearChatRequest(user.uid , key);
   }
})

};


function makeroomId(uid1 , uid2){
   return [uid1 , uid2].sort().join("_");
}


export async function clearChatRequest(currentUserId,fromUserId){
  const reqRef = ref(rtdb , `requests/${currentUserId}/${fromUserId}`);
  await remove(reqRef);
}


// export async function acceptChatRequest(currentUserId  , fromUserId) {
//    const reqRef = ref(rtdb , `requests/${currentUserId}/${fromUserId}`);
//    await update(reqRef , {status : "accepted"});

//    const chatRoomId = [currentUserId , fromUserId].sort().join("_");
//    return chatRoomId;
// };


