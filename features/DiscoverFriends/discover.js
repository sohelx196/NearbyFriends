import {db , rtdb } from "../../server/firebase.js";
import { collection, getDocs , onSnapshot} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { initAuth } from "../../server/authManager.js";
import { autoUpdateLocation } from "../../utils/locationUpadater.js";
import { acceptChatRequest, listenChatRequest, sendChatRequest } from "../chat/requests.js";

let friendsList = document.querySelector("#friendsList");

const { user, profile } = await initAuth({ requireLogin: true });
   //{currentuser,currentUserProfile}

  // updating location every 2 minute..
   autoUpdateLocation(user , 2); 


   // chat request listening..
   listenChatRequest(user)



   
// compute distance in km between two coordinates (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180; 
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


async function loadNearbyFriends() {
    
  // let rawUser = await getDocs(collection(db , "users"));
  let rawUser = collection(db , "users");
  
onSnapshot(rawUser, (snapshot) => {

  let onlineFriends = []
 

    for(const doc of snapshot.docs){
         let friend = {uid : doc.id , ...doc.data()};
         if(doc.id == user.uid) continue;

         // getting distance..
         if(friend.online && friend.location && profile?.location){          

            const distance = getDistance(
                // pass user and friend lat and long..
                profile.location.lat,
                profile.location.lon,
                friend.location.lat,
                friend.location.lon,
              );
          
        
            if(distance <= 1000){  
                onlineFriends.push({...friend , distance})
            }
            //  onlineFriends.push({...friend , distance})
         }
    }
    renderFriends(onlineFriends);
  }); 
}



function renderFriends(friends){ 

    friendsList.innerHTML = "";
    
    if(!friends.length){
        friendsList.innerHTML = "<h2>Loading available users..</h2>";
        
        return;
    }

    friends.forEach((f) => {
     const li = document.createElement("li");

     li.innerHTML = `<strong>${f.name}</strong> - ${f.age} year old
     (<small>${f.distance.toFixed(2)} km away</small>)
     <button class="chatBtn" data-id="${f.uid}">Chat Now</button>`;
    li.classList.add("friendList");
     friendsList.appendChild(li);

     li.querySelector(".chatBtn").addEventListener("click" , async (e)=>{
            await sendChatRequest( f.uid , f.name , {uid : user.uid , name : profile.name} )
     })

    });
}

loadNearbyFriends();