// handle sending and recieving request..

import { rtdb } from "../../server/firebase.js";
import { ref, set, onChildAdded, remove, update , onChildChanged , onValue} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
import { showReqPopup } from "../../utils/showRequestMsg.js";




export async function sendChatRequest(recieverId , recieverName , senderId){


     const reqRef = ref(rtdb , `requests/${recieverId}/${senderId.uid}`);

     await set(reqRef , {
        from : senderId.uid,
        name : senderId.name,
        timestamp : Date.now(),
        status : "pending",
     });

     alert(`Chat request send to ${recieverName}.   You will be notified when accepted.`);
    
   // listening to the reciever response..
    onValue(reqRef , (snapshot)=>{
      const data = snapshot.val();
      if(data && data.status === "accepted"){
         alert(`${recieverName} accepted you request`)
         window.location.href = `../chat/chat.html?room=${makeroomId(recieverId, senderId.uid)}`;
      }
   })
}

export async function listenChatRequest(user){

const userReqRef = ref(rtdb  , `requests/${user.uid}`);

onChildAdded(userReqRef , async (snapshot)=>{
   const request = snapshot.val();
   const senderUid = snapshot.key;
   const reqRef = ref(rtdb, `requests/${user.uid}/${senderUid}`);

   if(request.status === "pending"){
      let accept = await showReqPopup(`Chat request from ${request.name}. Accept?`);
      if(accept){
         await update(reqRef , {status : "accepted"});
      }
      else{
         clearChatRequest(user.uid , senderUid)
      }
   }
});

onChildChanged(userReqRef , async (snapshot)=>{
   const request = snapshot.val();
   const senderUid = snapshot.key;
   console.log(senderUid)

   if(request.status === "accepted"){
      window.location.href = `/features/chat/chat.html?room=${makeroomId(user.uid , senderUid)}`
   }
   else{
      clearChatRequest(user.uid , senderUid);
   }
});

}; 


export function makeroomId(uid1 , uid2){
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
